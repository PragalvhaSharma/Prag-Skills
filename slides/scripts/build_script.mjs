#!/usr/bin/env node
// Build the second output of the slides skill: <slug>-script.html, the
// presenter script page, read straight from the deck so the two never drift.
//
//   node build_script.mjs <deck.html> [--out <file>] [--images <dir> | --no-images]
//                         [--allow-em-dash]
//
// The deck is the single source of truth:
//   <section class="slide" data-title="Cover" data-time="30">
//     ...
//     <aside class="notes" data-speaker="Pragalvha" data-sources="Draft, p. 3">Word-for-word script.</aside>
//   </section>
//   data-time="0" (or data-backup) marks a backup slide that is not presented.
// Talk details (who it is for, topics per speaker, Q&A, sign-off) live in
//   <script type="application/json" id="talk">{ ... }</script>
// See SKILL.md, "The script page", for every field.
//
// Slide images: each slide is screenshotted from the deck at 1280x720 with
// headless Chrome (CHROME=/path overrides the browser). --images <dir> uses
// existing renders instead, in natural sort order; --no-images skips them.
// No dependencies beyond Node 18+.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

// ── arguments ────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const opt = { out: null, images: null, noImages: false, allowEmDash: false };
const pos = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--out" || a === "--images") {
    const v = argv[++i];
    if (v === undefined || v.startsWith("--")) { console.error(a + " needs a value"); usage(2); }
    if (a === "--out") opt.out = v; else opt.images = v;
  }
  else if (a === "--no-images") opt.noImages = true;
  else if (a === "--allow-em-dash") opt.allowEmDash = true;
  else if (a === "-h" || a === "--help") { usage(0); }
  else if (a.startsWith("--")) { console.error("unknown option " + a); usage(2); }
  else pos.push(a);
}
function usage(code) {
  console.log("usage: node build_script.mjs <deck.html> [--out <file>] [--images <dir> | --no-images] [--allow-em-dash]");
  process.exit(code);
}
if (pos.length !== 1) usage(2);
const deckPath = path.resolve(pos[0]);
if (!fs.existsSync(deckPath)) fail("deck not found: " + deckPath);
const outPath = path.resolve(opt.out || deckPath.replace(/\.html?$/i, "") + "-script.html");
// Same file even through a symlink, a hard link or a different letter case
// on a case-insensitive disk: compare real paths, then inode and device.
function sameFile(a, b) {
  const real = (p) => {
    try { return fs.realpathSync(p); } catch {}
    try { return path.join(fs.realpathSync(path.dirname(p)), path.basename(p)); } catch { return p; }
  };
  if (real(a) === real(b)) return true;
  try { const x = fs.statSync(a), y = fs.statSync(b); return x.ino === y.ino && x.dev === y.dev; } catch { return false; }
}
if (sameFile(outPath, deckPath)) fail("--out points at the deck itself; give the script page its own file name");
if (opt.images) {
  const dir = path.resolve(opt.images);
  if (!fs.existsSync(dir)) fail("--images folder not found: " + dir);
  if (!fs.statSync(dir).isDirectory()) fail("--images needs a folder of slide images, and " + dir + " is a file");
}

function fail(msg) { console.error("error: " + msg); process.exit(1); }
const warnings = [];
const warn = (m) => warnings.push(m);

// ── HTML helpers ─────────────────────────────────────────────────────────
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", middot: "\u00B7", hellip: "\u2026",
  ndash: "\u2013", mdash: "\u2014", rsquo: "\u2019", lsquo: "\u2018", rdquo: "\u201D", ldquo: "\u201C", times: "\u00D7",
  rarr: "\u2192", larr: "\u2190", minus: "\u2212", deg: "\u00B0", euro: "\u20AC", pound: "\u00A3", shy: "",
  eacute: "\u00E9", aacute: "\u00E1", iacute: "\u00ED", oacute: "\u00F3", uacute: "\u00FA", agrave: "\u00E0",
  atilde: "\u00E3", otilde: "\u00F5", ccedil: "\u00E7", ecirc: "\u00EA", ocirc: "\u00F4", ntilde: "\u00F1",
  egrave: "\u00E8", acirc: "\u00E2", euml: "\u00EB", iuml: "\u00EF", ouml: "\u00F6", uuml: "\u00FC", auml: "\u00E4",
  copy: "\u00A9", reg: "\u00AE", trade: "\u2122", laquo: "\u00AB", raquo: "\u00BB", bull: "\u2022", sect: "\u00A7" };
for (const k of Object.keys(ENT)) if (/^[a-z](acute|grave|tilde|cedil|circ|uml)$/.test(k)) ENT[k[0].toUpperCase() + k.slice(1)] = ENT[k].toUpperCase();
const decode = (s) => String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === "#") return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  return ENT[e] ?? ENT[e.toLowerCase()] ?? m;
});
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function attrs(tag) {
  const o = {};
  for (const m of tag.matchAll(/([\w:-]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    if (m.index === 0) continue; // the tag name
    o[m[1].toLowerCase()] = m[2] === undefined ? "" : decode(m[3] ?? m[4] ?? m[5] ?? "");
  }
  return o;
}
const hasClass = (a, c) => new RegExp("(^|\\s)" + c + "(\\s|$)").test(a.class || "");
function paragraphs(html) {
  const t = decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|h\d)>/gi, "\n\n").replace(/<[^>]+>/g, ""));
  return t.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
}
const words = (s) => (s.trim() ? s.trim().split(/\s+/).length : 0);

// ── read the deck ────────────────────────────────────────────────────────
const raw = fs.readFileSync(deckPath, "utf8");
let talk = {};
const talkM = raw.match(/<script\b[^>]*\bid\s*=\s*["']talk["'][^>]*>([\s\S]*?)<\/script>/i);
if (talkM && talkM[1].trim()) {
  try { talk = JSON.parse(talkM[1]); } catch (e) { fail("the talk JSON in the deck does not parse: " + e.message); }
}
const docTitle = decode((raw.match(/<title>([\s\S]*?)<\/title>/i) || [, ""])[1]).trim();
const body = raw.replace(/<!--[\s\S]*?-->/g, "").replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "");

function sectionEnd(src, from) {
  const re = /<(\/?)section\b[^>]*>/gi;
  re.lastIndex = from;
  let depth = 1, m;
  while ((m = re.exec(src))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return m.index;
  }
  return src.length;
}

const slides = [];
for (const m of body.matchAll(/<section\b[^>]*>/gi)) {
  const a = attrs(m[0]);
  if (!hasClass(a, "slide")) continue;
  const start = m.index + m[0].length;
  const inner = body.slice(start, sectionEnd(body, start));
  // drop nested sections' notes? Slides do not nest, so take every notes aside inside.
  const asides = [...inner.matchAll(/<aside\b([^>]*)>([\s\S]*?)<\/aside>/gi)]
    .map((x) => ({ a: attrs("<aside " + x[1] + ">"), html: x[2] }))
    .filter((x) => hasClass(x.a, "notes"));
  let title = a["data-title"];
  if (!title) {
    const h = inner.match(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/i);
    title = h ? paragraphs(h[1]).join(" ") : "Slide " + (slides.length + 1);
  }
  const speakers = [];
  for (const x of asides) {
    const sp = (x.a["data-speaker"] || a["data-speaker"] || talk.speaker || "").trim();
    if (sp && !speakers.includes(sp)) speakers.push(sp);
  }
  if (!asides.length && (a["data-speaker"] || talk.speaker)) speakers.push((a["data-speaker"] || talk.speaker).trim());
  const paras = asides.flatMap((x) => paragraphs(x.html));
  const sources = asides.map((x) => x.a["data-sources"]).filter(Boolean).join(" ") || a["data-sources"] || "";
  const t = a["data-time"];
  let secs = t === undefined || t === "" ? null : Number(t);
  let badTime = null;
  if (secs !== null && (!Number.isFinite(secs) || secs < 0)) { badTime = t; secs = null; }
  else if (secs !== null && secs !== 0) secs = Math.max(1, Math.round(secs)); // only an exact 0 means backup
  const backup = secs === 0 || a["data-backup"] !== undefined;
  slides.push({ n: slides.length + 1, title: title.trim(), speakers, paras, script: paras.join(" "), sources, secs, backup, badTime });
}
if (!slides.length) fail("no <section class=\"slide\"> elements found in " + deckPath);

// ── timing ───────────────────────────────────────────────────────────────
const defSecs = Number(talk.seconds) > 0 ? Number(talk.seconds) : null;
let estimated = 0;
for (const s of slides) {
  s.words = words(s.script);
  if (s.backup) { s.secs = 0; continue; }
  if (s.secs === null) {
    if (defSecs) s.secs = defSecs;
    else { s.secs = Math.max(10, Math.round((s.words / 150) * 60 / 5) * 5); if (s.badTime === null) estimated++; }
    if (s.badTime !== null) warn("slide " + s.n + " has data-time=\"" + s.badTime + "\", which is not a number of seconds; timed " + (defSecs ? "by talk.seconds (" + defSecs + " s)" : "at 150 words a minute") + " instead.");
  }
}
if (estimated) warn(estimated + " slide(s) have no data-time; timed at 150 words a minute. Set data-time on every slide.");
const clock = (t) => Math.floor(t / 60) + ":" + String(Math.round(t % 60)).padStart(2, "0");
let acc = 0;
for (const s of slides) {
  if (s.backup) continue;
  s.start = acc; s.end = acc + s.secs; acc = s.end;
}
const timed = slides.filter((s) => !s.backup);
const backups = slides.filter((s) => s.backup);
const total = acc;
if (!timed.length) fail("every slide is marked as backup; nothing to time");
for (const s of timed) {
  if (!s.script) warn("slide " + s.n + " (" + s.title + ") has no script. Add <aside class=\"notes\" data-speaker=\"...\">.");
  else {
    const wpm = s.words / (s.secs / 60);
    if (wpm > 165) warn("slide " + s.n + " is " + s.words + " words for " + s.secs + " s (" + Math.round(wpm) + " words a minute). Cut it or give it more time.");
  }
  if (!s.speakers.length) warn("slide " + s.n + " has no data-speaker.");
}
const uniform = timed.every((s) => s.secs === timed[0].secs) ? timed[0].secs : null;

// ── speakers and labels ──────────────────────────────────────────────────
const order = [];
for (const s of timed) for (const sp of s.speakers) if (!order.includes(sp)) order.push(sp);
for (const s of backups) for (const sp of s.speakers) if (!order.includes(sp) && !/^backup$/i.test(sp)) order.push(sp);
const PALETTE = [["#006E4E", "#DCEEE5"], ["#7A4E2D", "#F3E9DF"], ["#1F4E8C", "#E1EAF6"], ["#8C1F5A", "#F5E1EC"], ["#5B4B8A", "#E9E5F3"], ["#7A6A12", "#F3EED6"]];
const first = (n) => String(n).trim().split(/\s+/)[0].toLowerCase();
const same = (a, b) => !!a && !!b && (a === b || first(a) === first(b));
const to = (talk.to || "").trim();
const me = (talk.me || "").trim();
// Me / You only make sense in a note between co-presenters.
const label = (sp) => (multi && me && same(sp, me) ? "Me" : multi && to && same(sp, to) ? "You" : sp);
const labels = (sps) => (sps.length ? sps.map(label).join(" and ") : "Speaker");
const key = (sp) => "sp" + Math.max(0, order.indexOf(sp));
const multi = order.length > 1;
const ME = me || null;
if (multi) {
  if (to && !order.some((sp) => same(sp, to))) warn("talk \"to\" is \"" + to + "\", but no slide has that data-speaker, so the page has no You labels and no \"" + to + " only\" filter.");
  if (me && !order.some((sp) => same(sp, me))) warn("talk \"me\" is \"" + me + "\", but no slide has that data-speaker, so the page has no Me labels.");
  for (const sp of order) {
    const v = talk.speakers && (talk.speakers[sp] ?? Object.entries(talk.speakers).find(([k]) => same(k, sp))?.[1]);
    if (!v) warn("the talk block has no topics for " + sp + " in \"speakers\", so the split bullet lists slide titles. Write the topics as a list.");
  }
  if (!talk.provenance) warn("the talk block has no \"provenance\" line (where the content comes from).");
}

// ── text helpers ─────────────────────────────────────────────────────────
function andList(xs) {
  if (xs.length <= 1) return xs.join("");
  if (xs.length === 2) return xs[0] + " and " + xs[1];
  return xs.slice(0, -1).join(", ") + ", and " + xs[xs.length - 1];
}
function dur(sec) {
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  const mm = m === 1 ? "1 minute" : m + " minutes", ss = s === 1 ? "1 second" : s + " seconds";
  if (!s) return mm;
  if (!m) return ss;
  return mm + " " + ss;
}
function runs(list) { // contiguous runs of slides, by slide number
  const out = [];
  for (const s of list) {
    const r = out[out.length - 1];
    // backups are not presented, so they do not break a run
    if (r && timed.indexOf(s) === timed.indexOf(r[r.length - 1]) + 1) r.push(s); else out.push([s]);
  }
  return out;
}
function rangeText(list) {
  const rs = runs(list);
  const parts = rs.map((r) => (r.length === 1 ? String(r[0].n) : r[0].n + " to " + r[r.length - 1].n));
  const one = rs.length === 1 && rs[0].length === 1;
  return (one ? "slide " : "slides ") + andList(parts);
}
const timeText = (list) => andList(runs(list).map((r) => clock(r[0].start) + " to " + clock(r[r.length - 1].end)));
// Split after . ! ? only where a new sentence starts, so 3.5 and Dr. stay whole.
const ABBR = /\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|Mt|vs|Inc|Ltd|Co|Fig|e\.g|i\.e|U\.S|U\.K|a\.m|p\.m)\.$/;
function sentences(s) {
  const out = [];
  let cur = "";
  for (const p of s.split(/(?<=[.!?]["\u201D')\]]*)\s+(?=["\u201C'(]?[A-Z0-9])/)) {
    cur = cur ? cur + " " + p : p;
    if (!ABBR.test(cur)) { out.push(cur.trim()); cur = ""; }
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter(Boolean);
}
const clip = (s, atEnd) => { // keep a quoted handover line short
  const w = s.split(/\s+/);
  if (w.length <= 18) return s;
  return atEnd ? "\u2026" + w.slice(-12).join(" ") : w.slice(0, 12).join(" ") + "\u2026";
};
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const subj = (sp) => { const l = label(sp); return l === "Me" ? "I" : l === "You" ? "you" : l; };
const verb = (sp, v) => { const l = label(sp); return l === "Me" || l === "You" ? v : v + "s"; };
const topicsFor = (sp) => {
  const v = talk.speakers && (talk.speakers[sp] ?? Object.entries(talk.speakers).find(([k]) => same(k, sp))?.[1]);
  const t = typeof v === "string" ? v : v && v.topics;
  if (t) return t.replace(/\s*\.?\s*$/, ".");
  return andList(timed.filter((s) => s.speakers.includes(sp)).map((s) => s.title)) + ".";
};

const title = (talk.title || docTitle.split(/\s+[\u00B7|]\s+/)[0] || "Presentation").trim();
const deckName = path.basename(deckPath);
const scriptName = path.basename(outPath);
const relDeck = path.relative(path.dirname(outPath), deckPath).split(path.sep).join("/");
const secsWord = uniform ? uniform + " second" : null;

// ── slide images ─────────────────────────────────────────────────────────
function findChrome() {
  if (process.env.CHROME && !fs.existsSync(process.env.CHROME)) warn("CHROME=" + process.env.CHROME + " does not exist, so the builder looked for an installed browser instead.");
  const c = [process.env.CHROME,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"].filter(Boolean);
  for (const p of c) if (fs.existsSync(p)) return p;
  for (const n of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge"]) {
    const r = spawnSync("which", [n], { encoding: "utf8" });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  return null;
}
function shoot(chrome, url, out, profile) {
  return new Promise((resolve) => {
    const p = spawn(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
      "--no-default-browser-check", "--mute-audio", "--force-device-scale-factor=1", "--user-data-dir=" + profile,
      "--window-size=1280,720", "--virtual-time-budget=3500", "--screenshot=" + out, url], { stdio: "ignore" });
    const t = setTimeout(() => p.kill("SIGKILL"), 60000);
    p.on("exit", () => { clearTimeout(t); resolve(fs.existsSync(out) && fs.statSync(out).size > 0); });
    p.on("error", () => { clearTimeout(t); resolve(false); });
  });
}
const hasSips = process.platform === "darwin" && spawnSync("which", ["sips"]).status === 0;
let convDir = null; // converted copies go here, never next to the user's files
process.on("exit", () => { if (convDir) fs.rmSync(convDir, { recursive: true, force: true }); });
function toDataUri(file) {
  let f = file, mime = /\.jpe?g$/i.test(file) ? "image/jpeg" : /\.webp$/i.test(file) ? "image/webp" : "image/png";
  if (mime === "image/png" && hasSips) {
    convDir = convDir || fs.mkdtempSync(path.join(os.tmpdir(), "slides-script-img-"));
    const jpg = path.join(convDir, path.basename(file).replace(/\.png$/i, "") + "-" + Math.random().toString(36).slice(2, 8) + ".jpg");
    const r = spawnSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "74", "-Z", "1280", file, "--out", jpg], { stdio: "ignore" });
    if (r.status === 0 && fs.existsSync(jpg)) { f = jpg; mime = "image/jpeg"; }
  }
  return "data:" + mime + ";base64," + fs.readFileSync(f).toString("base64");
}
async function captureImages() {
  if (opt.noImages) return [];
  if (opt.images) {
    const dir = path.resolve(opt.images);
    const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (files.length !== slides.length) warn("--images has " + files.length + (files.length === 1 ? " image" : " images") + " for " + slides.length + (slides.length === 1 ? " slide" : " slides") + "; matched in order.");
    return slides.map((s, i) => (files[i] ? toDataUri(path.join(dir, files[i])) : null));
  }
  const chrome = findChrome();
  if (!chrome) { warn("no Chrome found, so the page has no slide images. Set CHROME=/path/to/chrome or pass --images."); return []; }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "slides-script-"));
  try {
    const hide = "<style>.rail,.pill,.hint,.jump,.npanel,.demo__ctl,.beats{display:none!important}</style>";
    const shotDeck = path.join(tmp, "deck.html");
    fs.writeFileSync(shotDeck, /<\/head>/i.test(raw) ? raw.replace(/<\/head>/i, hide + "</head>") : hide + raw);
    const base = pathToFileURL(shotDeck).href;
    const imgs = new Array(slides.length).fill(null);
    let next = 0;
    async function worker(w) {
      const profile = path.join(tmp, "profile-" + w);
      while (next < slides.length) {
        const i = next++;
        const out = path.join(tmp, "slide-" + String(i + 1).padStart(2, "0") + ".png");
        if (await shoot(chrome, base + "#" + (i + 1), out, profile)) imgs[i] = toDataUri(out);
        else warn("could not screenshot slide " + (i + 1));
      }
    }
    await Promise.all([0, 1, 2, 3].map(worker));
    return imgs;
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// ── em dash rule ─────────────────────────────────────────────────────────
function emDashCheck() {
  const hits = [];
  const look = (where, s) => { if (s && String(s).includes("\u2014")) hits.push(where + ": " + String(s).slice(0, 90)); };
  for (const s of slides) { look("slide " + s.n + " title", s.title); look("slide " + s.n + " speaker", s.speakers.join(" ")); look("slide " + s.n + " script", s.script); look("slide " + s.n + " sources", s.sources); }
  look("talk JSON", JSON.stringify(talk).replace(/\\u2014/g, "\u2014"));
  look("deck title", title);
  if (hits.length && !opt.allowEmDash) fail("em dashes (U+2014) found. Rewrite these in the deck, then rebuild:\n  " + hits.join("\n  "));
}
emDashCheck();

// ── build the page ───────────────────────────────────────────────────────
const imgs = await captureImages();
const hasImgs = imgs.some(Boolean);
const P = (html) => "<p>" + html + "</p>";
const B = (s) => "<b>" + esc(s) + "</b>";

const letter = [];
if (to) letter.push(P(esc("Hey " + to + ",")));
letter.push(P(esc(talk.intro || (to
  ? (multi
    ? "Here are the slides and the script for our " + title + " presentation. Touch up whatever you want, especially your half."
    : "Here are the slides and the script for " + title + ".")
  : "Here are the slides and the script for " + title + ", slide by slide."))));

// What's attached
const files = [];
files.push(B(deckName) + " is the deck. Open it in a browser and press F for full screen. Each slide has its script in the speaker notes: press N to show them with a talk clock.");
let pageLine = B(scriptName) + " shows every slide next to its script and timing. Open it in a browser on your laptop.";
const toSp = to && order.find((sp) => same(sp, to));
const practice = uniform ? "a practice mode with a " + uniform + " second timer" : "a practice mode with a timer for each slide";
if (multi && toSp) pageLine += " It has a &quot;" + esc(toSp) + " only&quot; filter and " + practice + ".";
else if (multi) pageLine += " It has a filter for each speaker and " + practice + ".";
else pageLine += " It has " + practice + ".";
files.push(pageLine);
for (const f of talk.files || []) {
  if (typeof f === "string") files.push(esc(f));
  else if (f && f.name) files.push(B(f.name) + " " + esc(f.text || ""));
}
letter.push("<h2>" + (to ? "What&#x27;s attached" : "The files") + "</h2>");
letter.push("<ul>" + files.map((f) => "<li>" + f + "</li>").join("") + "</ul>");

// How we're splitting it
letter.push("<h2>" + (multi ? "How we&#x27;re splitting it" : "How it&#x27;s timed") + "</h2>");
const slideWord = (n) => (n === 1 ? "1 slide" : n + " slides");
let countLine = uniform
  ? slideWord(timed.length) + " at " + (uniform === 1 ? "1 second" : uniform + " seconds") + (timed.length === 1 ? "" : " each") + ", so " + dur(total) + " total"
  : slideWord(timed.length) + ", " + dur(total) + " in total";
const limit = Number(talk.limit_minutes) > 0 ? Number(talk.limit_minutes) * 60 : null;
if (talk.split_note) countLine += ", " + talk.split_note.replace(/\.\s*$/, "");
else if (limit && total < limit) countLine += ", which leaves " + dur(limit - total) + " for questions";
else if (limit && total > limit) { countLine += ", which is " + dur(total - limit) + " over the " + dur(limit) + " limit"; warn("the talk runs " + dur(total) + ", over the " + dur(limit) + " limit."); }
letter.push(P(esc(countLine + ".")));
const bullets = [];
if (multi) for (const sp of order) {
  const mine = timed.filter((s) => s.speakers.includes(sp));
  if (!mine.length) continue;
  bullets.push(B(cap(label(sp)) + ", " + rangeText(mine) + " (" + timeText(mine) + "):") + " " + esc(topicsFor(sp)));
}
for (const s of backups) {
  const note = (talk.backup_note && (talk.backup_note[s.n] || talk.backup_note[String(s.n)])) || null;
  let t = note || "is a backup slide (" + s.title + "). Only pull it up if someone asks.";
  if (!note && talk.qa && talk.qa.length && s === backups[backups.length - 1]) t += " The likely questions are at the bottom of this page.";
  bullets.push(B("Slide " + s.n) + " " + esc(t));
}
if (bullets.length) letter.push("<ul>" + bullets.map((b) => "<li>" + b + "</li>").join("") + "</ul>");

// handovers
const handovers = [];
for (let i = 1; i < timed.length; i++) {
  const a = timed[i - 1], b = timed[i];
  const pa = a.speakers[a.speakers.length - 1], pb = b.speakers[0];
  if (!pa || !pb || pa === pb) continue;
  handovers.push({ a, b, pa, pb, at: b.start });
}
if (talk.handover) {
  const at = handovers.length === 1 ? "The handover is at " + clock(handovers[0].at) + ". " : "";
  letter.push(P(esc(at + talk.handover)));
} else if (handovers.length) {
  const lines = handovers.map((h) => {
    const lastA = h.a.script ? clip(sentences(h.a.script).slice(-1)[0], true) : "";
    const firstB = h.b.script ? clip(sentences(h.b.script)[0], false) : "";
    const endsInPunct = firstB && /[.!?]["\u201D')\]]*$/.test(firstB);
    const s = subj(h.pa) + " " + verb(h.pa, "end") + " slide " + h.a.n + (lastA ? " with &quot;" + esc(lastA) + "&quot;" : "")
      + " and " + subj(h.pb) + " " + verb(h.pb, "open") + " slide " + h.b.n + (firstB ? " with &quot;" + esc(firstB) + "&quot;" : "") + (endsInPunct ? "" : ".");
    // subj() already gives "I", "you" or a name, so only the first word of a sentence is capitalised
    return handovers.length === 1 ? "The handover is at " + clock(h.at) + ". " + cap(s) : "At " + clock(h.at) + ", " + s;
  });
  for (const l of lines) letter.push(P(l));
}
if (talk.provenance) letter.push(P(esc(talk.provenance)));

// The full script
const wsAll = timed.filter((s) => s.words).map((s) => s.words);
const lo = Math.min(...wsAll), hi = Math.max(...wsAll);
const span = lo === hi ? String(lo) : lo + " to " + hi;
const nWords = (n) => n + (n === 1 ? " word" : " words");
const wordsLine = !wsAll.length ? "" : uniform
  ? "Each slide is " + span + (span === "1" ? " word" : " words") + ", about " + uniform + " seconds out loud."
  : "Each slide is " + span + (span === "1" ? " word" : " words") + ". The time next to each slide is its slot.";

function card(s, i) {
  const sp = s.speakers[0] || "";
  const cls = s.backup ? "backup" : key(sp);
  const head = s.backup
    ? "Slide " + s.n + ", backup: " + s.title
    : "Slide " + s.n + ", " + labels(s.speakers) + ", " + clock(s.start) + " to " + clock(s.end) + ": " + s.title;
  const img = imgs[i] ? '<figure><a href="' + esc(relDeck) + "#" + s.n + '" title="Open slide ' + s.n + ' in the deck"><img src="' + imgs[i] + '" alt="Slide ' + s.n + ": " + esc(s.title) + '" width="1280" height="720" loading="lazy"></a></figure>' : "";
  const script = s.paras.length ? s.paras.map((p) => '<p class="script">' + esc(p) + "</p>").join("") : '<p class="script empty">No script for this slide.</p>';
  const meta = [s.words ? nWords(s.words) : "", s.backup ? "untimed" : s.secs + " sec", '<a href="' + esc(relDeck) + "#" + s.n + '">open in deck</a>'].filter(Boolean).join(" &middot; ");
  return '<article class="slide ' + cls + (imgs[i] ? "" : " noimg") + '" id="s' + s.n + '" data-k="' + cls + '">'
    + '<h3><span class="dot"></span>' + esc(head) + "</h3>"
    + '<div class="row">' + img + '<div class="notes">' + script
    + (s.sources ? '<p class="src"><b>Sources:</b> ' + esc(s.sources) + "</p>" : "")
    + '<p class="wc">' + meta + "</p></div></div></article>";
}
const cards = [];
// The talk in the order it is given, then every backup slide at the end.
for (const s of timed) {
  const h = handovers.find((x) => x.b === s);
  if (h) cards.push('<div class="divider ' + key(h.pb) + '">' + clock(h.at) + " &middot; " + esc(h.pa) + " hands over to " + esc(h.pb) + "</div>");
  cards.push(card(s, s.n - 1));
}
if (backups.length) cards.push('<div class="divider other">Backup, shown only if someone asks</div>');
for (const s of backups) cards.push(card(s, s.n - 1));

const qaList = (talk.qa || []).map((x) => (Array.isArray(x) ? { q: x[0], a: x[1] } : x)).filter((x) => x && x.q);
const qaHtml = qaList.length ? '<section class="qa" id="qa"><h2>Likely questions</h2><p class="lede2">' + (multi ? "Short answers either of us can give." : "Short answers to have ready.") + "</p>"
  + qaList.map((x, k) => '<div class="qa-item"><p class="q"><span class="qn">Q' + (k + 1) + "</span>" + esc(x.q) + '</p><p class="a">' + esc(x.a || "") + "</p></div>").join("") + "</section>" : "";

const rows = slides.map((s) => '<tr class="' + (s.backup ? "backup" : key(s.speakers[0] || "")) + '"><td class="num">' + s.n + '</td><td><a href="#s' + s.n + '">' + esc(s.title) + "</a></td><td>" + esc(s.backup ? "Backup" : s.speakers.join(" and ")) + '</td><td class="time">' + (s.backup ? "Untimed" : clock(s.start) + " to " + clock(s.end)) + '</td><td class="num">' + s.words + "</td></tr>").join("");

const signoff = talk.from ? '<p class="sign">' + esc(talk.signoff || "Thanks,") + "<br>" + esc(talk.from) + "</p>" : "";
const spCss = order.map((sp, i) => { const [c, bg] = PALETTE[i % PALETTE.length]; return ".sp" + i + "{--c:" + c + ";--bg:" + bg + ";}"; }).join("\n");
const filterBtns = multi ? '<button type="button" data-f="all" aria-pressed="true">All slides</button>' + order.map((sp) => '<button type="button" data-f="' + key(sp) + '" aria-pressed="false">' + esc(sp) + " only</button>").join("") : "";
const data = JSON.stringify(timed.map((s) => ({ n: s.n, who: s.speakers.join(" and "), k: key(s.speakers[0] || ""), title: s.title, script: s.paras, start: s.start, secs: s.secs })));

const CSS = String.raw`
:root{--ink:#23201D;--body:#3D3935;--muted:#786E64;--rule:#DFDBD8;--grey:#ECEAE6;--paper:#F7F6F3;--white:#fff;--accent:#006E4E;}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;background:var(--paper);color:var(--body);font:16px/1.55 Arial,Helvetica,sans-serif;}
.wrap{max-width:1200px;margin:0 auto;padding:40px 32px 80px;}
.letter{max-width:780px;}
.eyebrow{color:var(--accent);font-weight:700;font-size:13px;letter-spacing:.06em;text-transform:uppercase;}
h1{font:400 42px/1.1 Georgia,serif;color:var(--ink);margin:10px 0 26px;}
h1 em{font-style:normal;color:var(--accent);}
.letter p,.letter li{font-size:17px;}
.letter h2,.full>h2,.qa>h2{font:700 19px/1.3 Arial,Helvetica,sans-serif;color:var(--ink);margin:28px 0 10px;}
.letter ul{padding-left:22px;margin:0 0 14px;}
.letter li{margin:0 0 8px;}
.letter b{color:var(--ink);}
.full{margin-top:34px;}
.full>p.lede2{font-size:17px;margin:0 0 18px;}
.controls{display:none;gap:8px;flex-wrap:wrap;align-items:center;margin:0 0 18px;}
.js .controls{display:flex;}
.controls button{font:700 14px Arial,sans-serif;border:1px solid var(--rule);background:var(--white);color:var(--ink);padding:9px 16px;border-radius:999px;cursor:pointer;}
.controls button[aria-pressed="true"]{background:var(--ink);color:var(--white);border-color:var(--ink);}
.controls .go{background:var(--accent);border-color:var(--accent);color:var(--white);margin-left:auto;}
details.table{margin:0 0 24px;}
details.table summary{cursor:pointer;font-weight:700;color:var(--ink);font-size:15px;margin-bottom:10px;}
.tablewrap{overflow-x:auto;border:1px solid var(--rule);border-radius:10px;background:var(--white);}
table{width:100%;border-collapse:collapse;}
th,td{text-align:left;padding:8px 14px;border-bottom:1px solid var(--grey);font-size:15px;}
th{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);background:var(--paper);}
td a{color:var(--ink);text-decoration:none;}
td a:hover{text-decoration:underline;}
td.num,th.num{text-align:right;width:70px;font-variant-numeric:tabular-nums;}
td.time{font-variant-numeric:tabular-nums;white-space:nowrap;}
tr.backup td{color:var(--muted);}
.slide{background:var(--white);border:1px solid var(--rule);border-left:6px solid var(--c,var(--rule));border-radius:12px;padding:20px 22px;margin:0 0 20px;scroll-margin-top:16px;}
.slide.backup{--c:var(--rule);}
.slide h3{font:700 18px/1.35 Arial,Helvetica,sans-serif;color:var(--ink);margin:0 0 14px;display:flex;gap:10px;align-items:baseline;}
.slide h3 .dot{flex:none;width:10px;height:10px;border-radius:50%;background:var(--c,var(--muted));transform:translateY(-1px);}
.row{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:26px;align-items:start;}
.slide.noimg .row{grid-template-columns:1fr;}
.slide.noimg .notes{max-width:760px;}
figure{margin:0;}
figure img{display:block;width:100%;height:auto;border-radius:6px;border:1px solid var(--rule);}
.script{font:19px/1.6 Georgia,serif;color:var(--ink);margin:0 0 12px;}
.script.empty{color:var(--muted);font-style:italic;}
.src{font-size:13px;color:var(--muted);margin:0 0 4px;}
.wc{font-size:12px;color:var(--muted);margin:0;}
.wc a{color:var(--muted);}
.hidden{display:none!important;}
.divider{margin:28px 0 14px;font:700 13px Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--c,var(--muted));display:flex;align-items:center;gap:12px;}
.divider::after{content:"";flex:1;height:1px;background:var(--rule);}
.qa{margin-top:34px;}
.qa .lede2{margin:0 0 14px;color:var(--muted);}
.qa-item{background:var(--white);border:1px solid var(--rule);border-radius:12px;padding:16px 22px;margin:0 0 12px;}
.qa-item .q{font:700 17px/1.4 Arial,sans-serif;color:var(--ink);margin:0 0 8px;}
.qa-item .qn{display:inline-block;min-width:36px;color:var(--accent);}
.qa-item .a{font:18px/1.6 Georgia,serif;color:var(--body);margin:0;}
.sign{font-size:17px;margin:34px 0 0;}
#rehearse{position:fixed;inset:0;background:#14120F;color:#F2EFEA;display:none;flex-direction:column;z-index:10;}
#rehearse.on{display:flex;}
.rh-top{display:flex;align-items:center;gap:14px;padding:14px 24px;font-size:14px;flex-wrap:wrap;}
.rh-top .rh-title{font-weight:700;}
.rh-top .rh-who{font-weight:700;padding:3px 10px;border-radius:999px;background:var(--bg);color:var(--c);font-size:12px;}
.rh-top .rh-total{margin-left:auto;font-variant-numeric:tabular-nums;}
.rh-top button{font:700 13px Arial,sans-serif;background:transparent;color:#F2EFEA;border:1px solid #5A544D;padding:6px 12px;border-radius:999px;cursor:pointer;}
.rh-bar{height:6px;background:#2E2A26;}
.rh-bar i{display:block;height:100%;width:0;background:#3BB37F;transition:width .2s linear;}
.rh-bar.over i{background:#E0703A;}
.rh-body{flex:1;display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:28px;padding:24px;min-height:0;}
.rh-body.noimg{grid-template-columns:minmax(0,1fr);max-width:900px;margin:0 auto;width:100%;}
.rh-body.noimg .rh-imgbox{display:none;}
.rh-body img{width:100%;height:auto;max-height:100%;object-fit:contain;border-radius:6px;}
.rh-script{font:23px/1.6 Georgia,serif;overflow:auto;}
.rh-script p{margin:0 0 14px;}
.rh-clock{font:400 44px/1 Georgia,serif;font-variant-numeric:tabular-nums;margin-bottom:14px;}
.rh-hint{padding:10px 24px 16px;font-size:13px;color:#A39B91;}
@media (max-width:900px){.row,.rh-body{grid-template-columns:1fr;}h1{font-size:32px;}.wrap{padding:24px 16px 60px;}.slide{padding:14px;}th,td{padding:8px;font-size:14px;}}
@media print{body{background:#fff;}.controls,#rehearse,details.table{display:none!important;}.slide{break-inside:avoid;page-break-inside:avoid;}.hidden{display:block!important;}}
`;

const JS = String.raw`
(function () {
  var DATA = __DATA__;
  var filter = "all";
  var btns = document.querySelectorAll(".controls [data-f]");
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      filter = b.getAttribute("data-f");
      btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      document.querySelectorAll("article.slide, tbody tr, .divider").forEach(function (el) {
        var k = el.getAttribute("data-k") || (el.className.match(/\bsp\d+\b/) || ["other"])[0];
        el.classList.toggle("hidden", !(filter === "all" || k === filter));
      });
    });
  });
  var box = document.getElementById("rehearse"), rb = document.getElementById("rh-body"), img = document.getElementById("rh-img"), scr = document.getElementById("rh-script");
  var clk = document.getElementById("rh-clock"), tot = document.getElementById("rh-total"), bar = document.getElementById("rh-bar");
  var ttl = document.getElementById("rh-title"), who = document.getElementById("rh-who"), pb = document.getElementById("rh-pause");
  var END = DATA.length ? DATA[DATA.length - 1].start + DATA[DATA.length - 1].secs : 0;
  var list = [], i = 0, t0 = 0, acc = 0, paused = false, tick = null;
  function fmt(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function elapsed() { return acc + (paused ? 0 : (Date.now() - t0) / 1000); }
  function show() {
    var d = list[i], im = document.querySelector("#s" + d.n + " img");
    rb.classList.toggle("noimg", !im);
    if (im) { img.src = im.src; img.alt = "Slide " + d.n; }
    scr.innerHTML = "";
    d.script.forEach(function (p) { var el = document.createElement("p"); el.textContent = p; scr.appendChild(el); });
    ttl.textContent = "Slide " + d.n + " \u00B7 " + d.title;
    who.textContent = d.who; who.className = "rh-who " + d.k;
    acc = 0; t0 = Date.now(); render();
  }
  function render() {
    var e = elapsed(), d = list[i];
    clk.textContent = fmt(e) + " / " + fmt(d.secs);
    bar.firstChild.style.width = Math.min(100, e / d.secs * 100) + "%";
    bar.classList.toggle("over", e > d.secs);
    tot.textContent = "Talk clock " + fmt(d.start + e) + " of " + fmt(END) + " \u00B7 slot " + fmt(d.start) + " to " + fmt(d.start + d.secs);
  }
  function open() {
    list = DATA.filter(function (d) { return filter === "all" || d.k === filter; });
    if (!list.length) return;
    i = 0; paused = false; pb.textContent = "Pause";
    box.classList.add("on"); box.setAttribute("aria-hidden", "false");
    show(); clearInterval(tick); tick = setInterval(render, 200);
  }
  function close() { box.classList.remove("on"); box.setAttribute("aria-hidden", "true"); clearInterval(tick); }
  function go(k) { var j = i + k; if (j < 0) return; if (j >= list.length) { close(); return; } i = j; paused = false; pb.textContent = "Pause"; show(); }
  function pause() { if (paused) { t0 = Date.now(); paused = false; pb.textContent = "Pause"; } else { acc = elapsed(); paused = true; pb.textContent = "Resume"; } }
  var go1 = document.getElementById("go"); if (go1) go1.addEventListener("click", open);
  document.getElementById("rh-exit").addEventListener("click", close);
  pb.addEventListener("click", pause);
  document.addEventListener("keydown", function (e) {
    if (!box.classList.contains("on")) return;
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(-1); }
    else if (e.key === "Escape") close();
    else if (e.key === "p" || e.key === "P") pause();
  });
})();
`;

const practiceLabel = uniform ? "Practise with a " + uniform + "-second timer" : "Practise with the timer";
const html = "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
  + "<title>" + esc(title) + ": " + (hasImgs ? "script and slides" : "the script") + "</title>\n"
  + "<meta name=\"slides-script-for\" content=\"" + esc(deckName) + "\">\n"
  + "<style>" + CSS + spCss + "\n</style>\n<script>document.documentElement.className = \"js\";</script>\n</head>\n<body>\n<div class=\"wrap\">\n"
  + (talk.context ? "<div class=\"eyebrow\">" + esc(talk.context) + "</div>\n" : "")
  + "<h1>" + esc(title) + ": <em>" + (hasImgs ? "script and slides" : "the script") + "</em></h1>\n"
  + "<div class=\"letter\">\n" + letter.join("\n") + "\n</div>\n"
  + "<section class=\"full\">\n<h2>The full script</h2>\n" + (wordsLine ? "<p class=\"lede2\">" + esc(wordsLine) + "</p>\n" : "")
  + "<div class=\"controls\" role=\"toolbar\" aria-label=\"Filter and practice\">" + filterBtns + "<button type=\"button\" class=\"go\" id=\"go\">" + esc(practiceLabel) + "</button></div>\n"
  + "<details class=\"table\"><summary>Timing at a glance</summary><div class=\"tablewrap\"><table><thead><tr><th class=\"num\">Slide</th><th>Topic</th><th>Speaker</th><th>Time</th><th class=\"num\">Words</th></tr></thead><tbody>" + rows + "</tbody></table></div></details>\n"
  + cards.join("\n") + "\n</section>\n" + qaHtml + "\n" + signoff + "\n</div>\n"
  + "<div id=\"rehearse\" aria-hidden=\"true\"><div class=\"rh-top\"><span class=\"rh-title\" id=\"rh-title\"></span><span id=\"rh-who\" class=\"rh-who\"></span><span class=\"rh-total\" id=\"rh-total\"></span><button type=\"button\" id=\"rh-pause\">Pause</button><button type=\"button\" id=\"rh-exit\">Exit</button></div><div class=\"rh-bar\" id=\"rh-bar\"><i></i></div><div class=\"rh-body\" id=\"rh-body\"><div class=\"rh-imgbox\"><img id=\"rh-img\" alt=\"\"></div><div><div class=\"rh-clock\" id=\"rh-clock\">0:00</div><div class=\"rh-script\" id=\"rh-script\"></div></div></div><div class=\"rh-hint\">Right arrow or space for the next slide, left arrow to go back, P to pause, Esc to exit. The bar turns orange when the slide runs over its time.</div></div>\n"
  + "<script>" + JS.replace("__DATA__", () => data.replace(/</g, "\\u003c")) + "</script>\n</body>\n</html>\n";

if (!opt.allowEmDash && html.includes("\u2014")) fail("the generated page contains an em dash (U+2014); find it in the deck or the talk JSON and rewrite it");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html);

// ── report ───────────────────────────────────────────────────────────────
const mb = (Buffer.byteLength(html) / 1024 / 1024).toFixed(2);
console.log("wrote " + outPath + " (" + mb + " MB" + (hasImgs ? ", " + imgs.filter(Boolean).length + " slide images" : ", no slide images") + ")");
console.log(timed.length + (timed.length === 1 ? " timed slide, " : " timed slides, ") + clock(total) + " total" + (backups.length ? ", " + backups.length + (backups.length === 1 ? " backup" : " backups") : ""));
for (const sp of order) {
  const mine = timed.filter((s) => s.speakers.includes(sp));
  if (!mine.length) continue;
  const ws = mine.map((s) => s.words);
  const a = Math.min(...ws), b = Math.max(...ws);
  console.log("  " + sp + ": " + rangeText(mine) + " (" + timeText(mine) + "), " + (a === b ? a : a + " to " + b) + (b === 1 ? " word" : " words") + " a slide");
}
const slow = total ? Math.round(timed.reduce((a, s) => a + s.words, 0) / 130 * 60) : 0;
console.log("  at a slow 130 words a minute the script takes " + clock(slow) + (limit ? " (limit " + clock(limit) + ")" : ""));
if (limit && slow > limit) warn("at 130 words a minute the script runs " + clock(slow) + ", over the " + clock(limit) + " limit.");
for (const w of warnings) console.log("warning: " + w);

