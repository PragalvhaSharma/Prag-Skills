#!/usr/bin/env node
// Render a praghtml page at desktop and phone width, check the layout, and save full-page screenshots.
// Usage: node qa.js <page.html> [out-dir]
const path = require('path');
const fs = require('fs');

const candidates = [
  process.env.PLAYWRIGHT_PATH,
  'playwright',
  '/Users/prag/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright',
].filter(Boolean);
let chromium;
for (const c of candidates) {
  try { ({ chromium } = require(c)); break; } catch (e) { /* try the next one */ }
}
if (!chromium) {
  console.error('Playwright not found. Install it (npm i playwright) or set PLAYWRIGHT_PATH to its folder.');
  process.exit(2);
}

const page = path.resolve(process.argv[2] || '');
if (!process.argv[2] || !fs.existsSync(page)) {
  console.error('Usage: node qa.js <page.html> [out-dir]');
  process.exit(2);
}
const out = path.resolve(process.argv[3] || path.join(path.dirname(page), 'qa'));
fs.mkdirSync(out, { recursive: true });
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const sizes = {
  desk: { viewport: { width: 1280, height: 900 } },
  mob: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
};

(async () => {
  const browser = await chromium.launch(fs.existsSync(chrome) ? { executablePath: chrome } : {});
  let failed = false;
  for (const [name, opts] of Object.entries(sizes)) {
    const ctx = await browser.newContext({ ...opts, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(String(e)));
    p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await p.goto('file://' + page, { waitUntil: 'load' });
    // Scroll through once so every scroll-triggered reveal fires.
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 600) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(30); }
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const name = (el) => el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : '');
      // Outermost elements that stick out past the right edge.
      const tooWide = sw > vw ? [...document.querySelectorAll('body *')]
        .filter((el) => el.getBoundingClientRect().right > vw + 1 && (!el.parentElement || el.parentElement.getBoundingClientRect().right <= vw + 1))
        .slice(0, 8).map(name) : [];
      const imgs = [...document.images].filter((i) => i.getAttribute('src'));
      return {
        width: vw,
        scrollWidth: sw,
        height: document.documentElement.scrollHeight,
        images: imgs.length,
        brokenImages: imgs.filter((i) => !i.naturalWidth).length,
        badAnchors: [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href'))
          .filter((h) => h.length > 1 && !document.getElementById(decodeURIComponent(h.slice(1)))),
        tooWide,
        words: document.body.innerText.split(/\s+/).filter(Boolean).length,
      };
    });
    r.errors = errors;
    await p.screenshot({ path: path.join(out, name + '.png'), fullPage: true });
    const ok = r.scrollWidth <= r.width && !r.brokenImages && !r.badAnchors.length && !r.errors.length;
    if (!ok) failed = true;
    console.log((ok ? 'PASS ' : 'FAIL ') + name + ' ' + JSON.stringify(r));
    await ctx.close();
  }
  await browser.close();
  console.log('Screenshots: ' + out);
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

