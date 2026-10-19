// praghtml × Anatomy bridge.
// Build an Anatomy object figure in Node, then splice it into a praghtml page.
// A page can hold several figures. The kit, its CSS and the player go into <head> once.
// Guide: ./figures.md. Kit, examples and craft references: ../anatomy (git clone of wheresryan22/anatomy).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../anatomy/kit/iso-kit.mjs";

export { k };
const HERE = dirname(fileURLToPath(import.meta.url));
export const ANATOMY = join(HERE, "..", "anatomy");
export const TEMPLATE = join(HERE, "..", "template.html");
const KIT = join(ANATOMY, "kit");
const ASSETS_OPEN = "<!-- iso:assets -->";
const ASSETS_CLOSE = "<!-- /iso:assets -->";

const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const scriptSafe = (code) => code.replace(/<\/(script)/gi, "<\\/$1");

// An id names the figure's wrapper and its page markers, so "assets" (the shared asset markers) is reserved.
function checkId(fn, id) {
  if (!/^[A-Za-z][\w-]*$/.test(String(id))) throw new Error(fn + ": id must look like fig-break-even");
  if (id === "assets") throw new Error(fn + ': id "assets" is reserved for the shared asset markers');
}

// Anatomy is MIT-licensed: every page that inlines its kit and CSS carries the license text.
function licenseNotice() {
  const text = readFileSync(join(ANATOMY, "LICENSE"), "utf8").trim();
  if (!/^Copyright /m.test(text) || /<!--|-->|--!>/.test(text)) throw new Error("anatomy/LICENSE changed shape; update iso/figure.mjs");
  return "<!-- Anatomy kit and CSS, from https://github.com/wheresryan22/anatomy\n" + text + "\n-->";
}

// Read kit files as one classic-script body: strip "export", keep the names.
function inline(files) {
  const source = files.map((file) => readFileSync(join(KIT, file), "utf8")).join("\n");
  const names = [];
  for (const line of source.split("\n")) {
    if (!line.startsWith("export")) continue;
    const match = /^export\s+(?:async\s+)?(?:function\*?|const|let|var|class)\s+([A-Za-z_$][\w$]*)/.exec(line);
    if (!match) throw new Error("iso/figure.mjs cannot inline this kit line; update the bridge: " + line.slice(0, 80));
    names.push(match[1]);
  }
  const code = source.replace(/^export\s+/gm, "");
  if (/^import\s/m.test(code)) throw new Error("iso/figure.mjs: " + files.join(", ") + " now imports other files; inline those too");
  return { code, names };
}

export const KIT_NAMES = inline(["iso-kit.mjs"]).names;
export const GL_NAMES = inline(["gl.mjs"]).names;

// Page tokens drive the card: the lit part takes --accent, text takes --ink and --muted.
// Flow dashes and pulse dots move only while a player runs the figure (it sets data-iso-player) and is not paused.
const BRIDGE_CSS = `
.pg-iso{margin:28px 0 32px}
.pg-iso.iso[data-theme="light"]{--anatomy-page:var(--bg,#fff);--anatomy-card:var(--bg,#fff);--anatomy-text:var(--ink,#57575a);--anatomy-strong:var(--ink,#18181a);--anatomy-muted:var(--muted,#8c8c90);--anatomy-lit:var(--accent,#000);--anatomy-mono:var(--mono,ui-monospace,Menlo,monospace)}
.pg-iso .iso-figure{margin:0}
.pg-iso .iso-stage{touch-action:pan-y;border-radius:2px}
.pg-iso .iso-stage:focus-visible{outline:2px solid var(--accent,currentColor);outline-offset:6px}
.pg-iso.is-paused .iso-line[data-flow],.pg-iso.is-paused .iso-dots circle[data-pulse],.pg-iso:not([data-iso-player]) .iso-line[data-flow],.pg-iso:not([data-iso-player]) .iso-dots circle[data-pulse]{animation-play-state:paused}
:where(.pg-iso .iso-bar){display:flex;align-items:center;gap:10px;margin-top:10px;font-size:.8rem}
.pg-iso .iso-bar[hidden]{display:none}
@media (prefers-reduced-motion:reduce){.pg-iso .iso-bar{display:none}}
@media print{.pg-iso .iso-bar{display:none}.pg-iso{break-inside:avoid}}
`;

// Everything a page needs once: Anatomy's license notice, its CSS plus the bridge CSS, the kit as window.ISO, and window.ISO_PLAY.
export function kitAssets({ gl = false } = {}) {
  const { code, names } = inline(gl ? ["iso-kit.mjs", "gl.mjs"] : ["iso-kit.mjs"]);
  const kit = "window.ISO=(()=>{\"use strict\";\n" + code + "\nreturn{" + names.join(",") + "};})();";
  const player = readFileSync(join(HERE, "player.js"), "utf8");
  return [
    ASSETS_OPEN,
    licenseNotice(),
    `<style id="iso-css">${k.ISO_CSS}${BRIDGE_CSS}</style>`,
    `<script id="iso-kit"${gl ? " data-gl" : ""}>${scriptSafe(kit)}</script>`,
    `<script id="iso-player">${scriptSafe(player)}</script>`,
    ASSETS_CLOSE,
  ].join("\n");
}

// One figure: Anatomy's card (Fig n, title, hint, live readout), a Pause bar, legend and caption,
// and a live script scoped to this figure. The SVG is prebuilt, so the figure is complete without JS.
// live: JS source. It runs with root (this figure's wrapper), PLAY (window.ISO_PLAY) and every kit
// function in scope, e.g. PLAY(root, { stops: [...], draw(v) { ...; return "readout"; } }).
export function figureBlock({ id, svg, fig = "Fig 1", title, hint, readout = "", keys = [], caption, live = "", slider = {}, theme = "light", gl = false }) {
  checkId("figureBlock", id);
  if (!svg) throw new Error("figureBlock: svg is required; build it with k.figureSvg");
  if (theme !== "light") throw new Error('figureBlock: theme must be "light"; only light maps to page tokens');
  const interactive = Boolean(live);
  // The slider is read only when the figure is live; a static figure ignores it.
  if (interactive && (slider === null || typeof slider !== "object" || Array.isArray(slider))) throw new Error("figureBlock: slider must be an object like { label, min, max, now }");
  const num = (key, fallback) => {
    const n = slider[key] === undefined ? fallback : slider[key];
    if (typeof n !== "number" || !Number.isFinite(n)) throw new Error("figureBlock: slider." + key + " must be a finite number");
    return n;
  };
  let stageAttrs = "";
  if (interactive) {
    const min = num("min", 0), max = num("max", 1), now = num("now", min);
    if (!(min < max) || now < min || now > max) throw new Error(`figureBlock: slider needs min < max and now between them (got min ${min}, max ${max}, now ${now})`);
    stageAttrs = ` tabindex="0" role="slider" aria-label="${esc(slider.label || title || fig)}" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${now}" aria-valuetext="${esc(readout)}"`;
  }
  const stage = `<div class="iso-stage"${stageAttrs}>${svg}</div>`;
  const OPEN = '<figure class="iso-figure">';
  const CLOSE = "</figure>";
  const plate = k.plateHtml({ fig, title, hint, readout, body: stage });
  if (!plate.startsWith(OPEN) || !plate.endsWith(CLOSE)) throw new Error("Anatomy's plateHtml changed shape; update iso/figure.mjs");
  let legend = "";
  if (keys.length || caption) {
    const match = k.plateHtml({ fig: "", readout: "", keys, caption, body: "" }).match(/<figcaption class="iso-legend">[\s\S]*<\/figcaption>/);
    if (!match) throw new Error("Anatomy's legend markup changed shape; update iso/figure.mjs");
    legend = match[0];
  }
  const bar = interactive
    ? '<div class="play-bar iso-bar" hidden><span class="play-dot" aria-hidden="true"></span><span class="play-say"></span><button type="button" class="play-btn" aria-pressed="false">Pause</button></div>'
    : "";
  const names = gl ? [...KIT_NAMES, ...GL_NAMES] : KIT_NAMES;
  const script = interactive
    ? `<script>(function(root,ISO,PLAY){if(!root||!ISO||!PLAY)return;const{${names.join(",")}}=ISO;(function(){\n${scriptSafe(live)}\n})();})(document.getElementById(${JSON.stringify(id)}),window.ISO,window.ISO_PLAY);</script>`
    : "";
  return `<div class="iso pg-iso" data-theme="${theme}" id="${id}" data-iso-figure${gl ? " data-gl" : ""}>${OPEN}${plate.slice(OPEN.length, -CLOSE.length)}${bar}${legend}${CLOSE}${script}</div>`;
}

// Put the block where <!-- iso:ID --> sits (or replace the block from an earlier build),
// then write or refresh the shared assets before </head>. Safe to run again after every edit.
export function splice(page, id, block) {
  checkId("splice", id);
  let html = readFileSync(page, "utf8");
  const open = `<!-- iso:${id} -->`;
  const close = `<!-- /iso:${id} -->`;
  const at = html.indexOf(open);
  if (at < 0) throw new Error(`splice: put ${open} in ${page} where the figure goes`);
  const end = html.indexOf(close, at);
  const marked = `${open}\n${block}\n${close}`;
  html = end < 0 ? html.slice(0, at) + marked + html.slice(at + open.length) : html.slice(0, at) + marked + html.slice(end + close.length);
  const gl = /<div class="iso pg-iso"[^>]*\sdata-gl[\s>]/.test(html);
  const assets = kitAssets({ gl });
  const from = html.indexOf(ASSETS_OPEN);
  if (from >= 0) {
    const to = html.indexOf(ASSETS_CLOSE, from);
    if (to < 0) throw new Error("splice: " + ASSETS_OPEN + " has no closing marker");
    html = html.slice(0, from) + assets + html.slice(to + ASSETS_CLOSE.length);
  } else {
    const head = html.indexOf("</head>");
    if (head < 0) throw new Error("splice: the page has no </head>");
    html = html.slice(0, head) + assets + "\n" + html.slice(head);
  }
  writeFileSync(page, html);
  return page;
}
