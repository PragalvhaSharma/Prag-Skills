// praghtml reference build: an Anatomy object figure for a finance idea (break-even drawn as a cistern).
// Copy it next to a new page as <slug>.fig.mjs, then change PAGE and ID, the model, the page prose and the geometry.
// Sections: 1 model, 2 page seed, 3 geometry (kit calls), 4 card, live script and splice. Guide: ../figures.md
// Builds the cistern figure in break-even-cistern.html. Run: node break-even-cistern.fig.mjs
// The page is seeded from the praghtml template only when it is missing (or with --fresh);
// every run then splices the figure at <!-- iso:fig-cistern -->, so reruns leave the prose alone.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { k, figureBlock, splice, TEMPLATE } from "/Users/prag/.claude/skills/praghtml/iso/figure.mjs";
// It writes its .html next to itself, so this copy refuses to run from inside the skill.
if (fileURLToPath(import.meta.url).includes("/skills/praghtml/iso/examples/")) {
  console.error("This is the praghtml reference copy. Copy it beside your page, then run the copy.");
  process.exit(1);
}

const PAGE = fileURLToPath(new URL("break-even-cistern.html", import.meta.url));
const ID = "fig-cistern";

// 1. One pure model drives the parts and the readout. Illustrative numbers.
const PRICE = 50, VARIABLE = 30, FIXED = 90000, QMAX = 6000, STOPS = [0, 1500, 3000, 4500, 6000];
function model(units) {
  const CM = PRICE - VARIABLE, q = Math.round(units / 10) * 10, cm = CM * q, profit = cm - FIXED;
  const usd = (n) => "$" + Math.abs(n).toLocaleString("en-US");
  const tail = profit < 0 ? "loss " + usd(profit) : profit > 0 ? "profit " + usd(profit) : "break-even";
  return {
    fill: Math.min(cm, FIXED) / FIXED,                                         // tank: share of the spout height
    spill: Math.max(0, profit) / (CM * QMAX - FIXED),                          // basin: share of the top profit
    count: String(q).padStart(4, "0"),                                         // units counter on the inlet
    text: q.toLocaleString("en-US") + " units · CM " + usd(cm) + " · " + tail,
  };
}

// 2. Page seed (prose) and its few page-level styles.
const PAGE_CSS = `
    .nums th, .nums td { padding-left: 8px; padding-right: 8px; }
    .nums td { font-variant-numeric: tabular-nums; }
    .nums tr.is-key td { background: var(--accent-soft); font-weight: 600; }
    .math { font-family: var(--mono); font-size: 0.9rem; }
    @media (max-width: 640px) {
      .nums { font-size: 0.8rem; }
      .nums th, .nums td { padding: 7px 4px; }
      .nums th { font-size: 0.64rem; letter-spacing: 0; }
    }
`;


const MAIN = `<main>
    <header>
      <div class="session-tag">Living explainer · updates with each question</div>
      <h1>Break-even: when the tank starts to spill</h1>
      <p class="gist">Each unit you sell pours $20 of contribution into a tank. Fixed costs set its overflow spout at $90,000, so profit spills out only after 4,500 units.</p>
    </header>

    <section aria-labelledby="big-picture">
      <h2 id="big-picture">Big picture</h2>
      <!-- iso:fig-cistern -->
      <ul>
        <li><strong>Water is contribution margin (CM).</strong> Price $50 minus variable cost $30 leaves $20 a unit.</li>
        <li><strong>The spout sits at fixed costs, $90,000.</strong> The empty gap below it is the loss still to cover.</li>
        <li><strong>The basin is profit.</strong> Water can't rise past the spout, so each unit after 4,500 spills $20 into the basin.</li>
      </ul>
    </section>


    <section aria-labelledby="examples">
      <h2 id="examples">Examples</h2>
      <p>The figure tours these five stops. Illustrative numbers: price $50, variable cost $30, fixed costs $90,000.</p>
      <table class="nums">
        <thead><tr><th>Units</th><th>Revenue</th><th>Var. cost</th><th>CM</th><th>Fixed</th><th>Profit</th></tr></thead>
        <tbody>
          <tr><td>0</td><td>$0</td><td>$0</td><td>$0</td><td>$90k</td><td>−$90k</td></tr>
          <tr><td>1,500</td><td>$75k</td><td>$45k</td><td>$30k</td><td>$90k</td><td>−$60k</td></tr>
          <tr><td>3,000</td><td>$150k</td><td>$90k</td><td>$60k</td><td>$90k</td><td>−$30k</td></tr>
          <tr class="is-key"><td>4,500</td><td>$225k</td><td>$135k</td><td>$90k</td><td>$90k</td><td>$0</td></tr>
          <tr><td>6,000</td><td>$300k</td><td>$180k</td><td>$120k</td><td>$90k</td><td>+$30k</td></tr>
        </tbody>
      </table>
      <p class="math">Break-even = $90,000 ÷ $20 = <strong>4,500 units</strong>. Revenue there = 4,500 × $50 = <strong>$225,000</strong>.</p>
    </section>

    <section aria-labelledby="what-if">
      <h2 id="what-if">What if</h2>
      <table class="nums">
        <thead><tr><th>Change</th><th>CM a unit</th><th>Break-even</th></tr></thead>
        <tbody>
          <tr><td>Base case</td><td>$20</td><td>4,500 units</td></tr>
          <tr><td>Price $55</td><td>$25</td><td>3,600 units</td></tr>
          <tr><td>Fixed costs $110,000</td><td>$20</td><td>5,500 units</td></tr>
        </tbody>
      </table>
      <p>A higher price pours more into the tank for each unit, so it fills sooner. Higher fixed costs raise the spout.</p>
    </section>

    <section aria-labelledby="gotchas">
      <h2 id="gotchas">Gotchas</h2>
      <ul>
        <li><strong>Price and unit cost stay constant.</strong> Discounts or volume deals change the $20, so the tank fills at a different rate.</li>
        <li><strong>Fixed costs step up at capacity.</strong> A second shift or a new machine raises the spout.</li>
        <li><strong>One product or a fixed sales mix.</strong> With several products, use the weighted average CM.</li>
      </ul>
    </section>

    <section aria-labelledby="questions-heading" id="questions">
      <h2 id="questions-heading">Questions</h2>

      <article class="q" id="q-1">
        <div class="q-meta">Q1 · turn 1</div>
        <h3>How does break-even work?</h3>
        <figure class="reveal">
          <div class="diagram">
            <ol class="chain" data-reveal-stagger>
              <li><div class="box">Fixed costs<small>$90,000</small></div></li>
              <li><div class="box">÷ CM a unit<small>$20</small></div></li>
              <li><div class="box is-key">Break-even<small>4,500 units · $225,000 revenue</small></div></li>
            </ol>
          </div>
          <figcaption>Break-even units = fixed costs ÷ CM a unit.</figcaption>
        </figure>
        <ul>
          <li>Each unit adds its CM, $20, toward fixed costs.</li>
          <li>At 4,500 units, CM equals fixed costs: no profit and no loss.</li>
          <li>Below that you carry a loss. Above it, each unit adds $20 of profit.</li>
        </ul>
      </article>
    </section>
  </main>`;

// Seed the page from the praghtml template: real file path, title, page CSS and the prose above.
function seedPage() {
  let html = readFileSync(TEMPLATE, "utf8");
  const swap = (pattern, to) => {
    if (!pattern.test(html)) throw new Error("template changed; cannot find " + pattern);
    html = html.replace(pattern, () => to);
  };
  swap(/<meta name="praghtml-file" content="[^"]*"\s*\/>/, `<meta name="praghtml-file" content="${PAGE}" />`);
  swap(/<title>[^<]*<\/title>/, "<title>Break-even: when the tank starts to spill</title>");
  swap(/\n\s*<\/style>\s*\n<\/head>/, `\n${PAGE_CSS}  </style>\n</head>`);
  swap(/<main>[\s\S]*?<\/main>/, MAIN);
  if (html.includes("{{")) throw new Error("seedPage: a {{placeholder}} is left");
  return html;
}
if (!existsSync(PAGE) || process.argv.includes("--fresh")) writeFileSync(PAGE, seedPage());

// 3. Geometry in world units (z up), built once in Node.  ---- geometry ----
const box = (x, y, w, d, r = 0.5) => ({ x, y, w, d, r });
const PLATE = box(-76, -36, 138, 48, 6);
// Tank: open top, on a stand ZS tall. The glass frame is 2 deep (GLASS to TY1); the glass, the water's front face and the
// scale all sit on its front plane, TY1, so the water lines up with its ticks. Water runs from ZW0 (empty) to ZSP (the spout lip).
const TX0 = -52, TX1 = 8, TY0 = -30, TY1 = 6, TW = TX1 - TX0, TD = TY1 - TY0, WALL = 2.5, GLASS = TY1 - 2;
const ZS = 14, ZW0 = 17, ZSP = 65, ZT = 72, SY = (TY0 + TY1) / 2;
// Profit basin: open top, glass front, on the plate right of the tank. Water runs from ZB0 to ZB1.
const B = box(27, -25, 28, 26, 1.5), BW = 1.6, ZB0 = 2, ZB1 = 12, BH = 14, BGLASS = B.y + B.d - BW;
// Inlet: a post with the units counter, a run with a valve, a nozzle over the tank.
const IN = [-64, 2], NZ = [-38, 2], ZR = 82;
const TANK_WATER = box(TX0 + WALL, TY0 + WALL, TW - 2 * WALL, TY1 - TY0 - WALL, 0.4);
const POOL = box(B.x + BW, B.y + BW, B.w - 2 * BW, B.d - BW, 0.4);
const P = k.fitProjection([
  ...k.boxCorners(PLATE, -10, 0), ...k.boxCorners(box(TX0, TY0, TW, TD), 0, ZT), ...k.boxCorners(B, 0, BH),
  ...k.boxCorners(box(IN[0] - 7.5, IN[1] - 4.5, 12, 9.5), 0, ZR + 9),
], 600, 540, { pad: 26 });
const at = (x, y, z) => k.iso([x, y, z], P);
const slab = (plan, z0, z1, style, steps = 3, bevel = 0.3) => k.solidSvg(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), style);
const cyl = (c, r, z0, z1, style, bevel = 0.3) => k.solidSvg(k.cylinder(c[0], c[1], r, z0, z1 - z0, P, 28, bevel), style);
const water = (plan, z, h) => (h > 0.05 ? k.solidSvg(k.slabOf(plan, z, h, P, 2), { lit: true, className: "cs-water" }) : "");
const label = (x, y, z, side, s, size, extra = {}) => k.faceTextSvg(k.sideMatrix([x, y], z - 0.35 * size, P, side), s, { size, ...extra });
const REST = model(QMAX);

// Scale on the tank glass: ticks every $10k hang from the right post; labels at $0, $30k, $60k, $90k (the spout lip).
const RX = TX1 - 4, tankZ = (i) => ZW0 + ((ZSP - ZW0) * i) / 9;
const tankMinor = [], tankMajor = [];
for (let i = 0; i <= 9; i++) (i % 3 ? tankMinor : tankMajor).push(k.segment([RX, TY1, tankZ(i)], [RX - (i % 3 ? 1.8 : 2.8), TY1, tankZ(i)], P));
const tankLabels = ["$0", "$30k", "$60k", "$90k"].map((s, i) => label(RX - 4, TY1, tankZ(3 * i), "left", s, 5, { anchor: "end", tone: "hi" }));
const BX = B.x + B.w - 3, BF = B.y + B.d, basinZ = (i) => ZB0 + ((ZB1 - ZB0) * i) / 3;
const basinTicks = [0, 1, 2, 3].map((i) => k.segment([BX, BF, basinZ(i)], [BX - (i % 3 ? 1.5 : 2.5), BF, basinZ(i)], P)).join("");
// The spill: a falling jet from inside the spout mouth to the basin floor (hidden by the pool once it fills).
const MOUTH = TX1 + 13.5, JET = [];
for (let i = 0; i <= 16; i++) { const u = i / 16; JET.push(at(MOUTH - 1 + (B.x + B.w / 2 - MOUTH + 1) * u, SY, ZSP - 0.5 - (ZSP - 0.5 - ZB0) * u * u)); }
const jetD = k.pathOf(JET);
const mouthD = k.pathOf([[SY - 2, ZSP], [SY + 2, ZSP], [SY + 2, ZSP + 3], [SY - 2, ZSP + 3]].map(([y, z]) => at(MOUTH, y, z)), true);
const LX0 = TX0 + 1, LX1 = TX1 - 5, LY0 = TY0 + 1, LY1 = TY1 - 5;
const leg = (x, y) => slab(box(x - 1, y - 1, 6, 6, 0.8), 0, 1.2, { tone: "lo" }) + slab(box(x, y, 4, 4, 0.4), 1.2, ZS, { tone: "mid" });
const spoke = (i, r) => [-52 + r * Math.cos(i * Math.PI / 2 + Math.PI / 4), IN[1] + r * Math.sin(i * Math.PI / 2 + Math.PI / 4), ZR + 8];
// Every colour mixes page tokens. The cavity (tank and basin walls seen from inside) is a neutral grey: ink on the page background.
const cavity = (n) => `color-mix(in srgb,var(--ink) ${n}%,var(--bg))`;
const CSS = "#fig-cistern .cs-inside{" +
  `--anatomy-paper:${cavity(9)};--anatomy-top:${cavity(6)};--anatomy-shade-0:${cavity(12)};--anatomy-shade-1:${cavity(14)};--anatomy-shade-2:${cavity(17)};--anatomy-shade-3:${cavity(20)}}` +
  "#fig-cistern .cs-water{--anatomy-face:color-mix(in srgb,var(--accent) 14%,var(--bg));--anatomy-lit-top:color-mix(in srgb,var(--accent) 20%,var(--bg));--anatomy-lit-shade:color-mix(in srgb,var(--accent) 28%,var(--bg))}" +
  "#fig-cistern .cs-jet{fill:none;stroke:color-mix(in srgb,var(--accent) 24%,var(--bg));stroke-width:4.5;stroke-linecap:round;vector-effect:none}" +
  "#fig-cistern .cs-flow{stroke:var(--accent)}#fig-cistern .cs-mouth{fill:" + cavity(20) + ";stroke:none}#fig-cistern .cs-mouth-water{fill:color-mix(in srgb,var(--accent) 24%,var(--bg));stroke:none}" +
  "#fig-cistern .cs-display{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}" +
  "#fig-cistern [data-part=stream],#fig-cistern [data-part=spout-water]{transition:opacity .2s}" +
  // Phones: the drawing is height-bound and fills about 70% of the card's width, so 128% keeps every label near 9 px
  // and the drawing about 20 px inside the card.
  "@media (max-width:560px){#fig-cistern .iso-plate{overflow:hidden}#fig-cistern .iso-plate .iso-svg{width:128%;margin:0 -14%}}";
const svg = k.figureSvg({
  width: 600, height: 540,
  label: "A glass-fronted cistern on a stand. Water, the contribution, rises toward an overflow spout at $90,000; past the spout it spills into a profit basin.",
  body: [
    "<style>" + CSS + "</style>",
    '<path class="iso-halo" d="' + k.haloOf(PLATE, -10, 10, P) + '"/>',
    ...k.corners(PLATE, 12).map(([x, y]) => cyl([x, y], 3.5, -10, -6, { tone: "lo" })),
    slab(PLATE, -6, 0, { tone: "lo" }, 8, 1.2),
    k.lineSvg(k.planOutline(k.insetPlan(PLATE, 3), 0, P), { tone: "faint" }),
    k.lineSvg(k.corners(PLATE, 4.5).map(([x, y]) => k.ring(x, y, 1.8, 0, P, 16)).join("")),
    k.dotsSvg(k.corners(PLATE, 4.5).map(([x, y]) => at(x, y, 0)), { size: 0.55 }),
    label(-46, PLATE.y + PLATE.d, -3.3, "left", "FIXED COSTS $90,000", 4.4, { tone: "hi" }),
    // Stand: far leg, side legs, rails, near leg.
    leg(LX0, LY0), leg(LX1, LY0), leg(LX0, LY1),
    slab(box(LX1 + 1, LY0 + 4, 2, LY1 - LY0 - 4, 0.2), 5, 8, { tone: "lo" }),
    slab(box(LX0 + 4, LY1 + 1, LX1 - LX0 - 4, 2, 0.2), 5, 8, { tone: "lo" }),
    leg(LX1, LY1),
    // Tank: floor, the two walls seen from inside (cavity tones), the water, the near wall, the glass frame.
    slab(box(TX0, TY0, TW, TD, 1), ZS, ZW0, { tone: "mid" }, 4, 0.4),
    '<g class="cs-inside">' + slab(box(TX0, TY0, TW - WALL, WALL, 0.3), ZW0, ZT, { tone: "mid" }) +
      slab(box(TX0, TY0 + WALL, WALL, GLASS - TY0 - WALL, 0.3), ZW0, ZT, { tone: "mid" }) + "</g>",
    '<g data-part="tank-water">' + water(TANK_WATER, ZW0, (ZSP - ZW0) * REST.fill) + "</g>",
    slab(box(TX1 - WALL, TY0, WALL, GLASS - TY0, 0.3), ZW0, ZT, { tone: "hi", inner: k.lineSvg([28, 41].map((z) => k.segment([TX1, TY0, z], [TX1, GLASS, z], P)).join(""), { tone: "faint" }) }),
    slab(box(TX0, GLASS, 4, 2, 0.3), ZW0, ZT, { tone: "hi" }),
    slab(box(TX0 + 4, GLASS, TW - 8, 2, 0.3), ZT - 3, ZT, { tone: "hi" }),
    slab(box(TX1 - 4, GLASS, 4, 2, 0.3), ZW0, ZT, { tone: "hi" }),
    k.lineSvg(k.segment([TX0 + 9, TY1, 50], [TX0 + 15, TY1, 61], P) + k.segment([TX0 + 13, TY1, 50], [TX0 + 16, TY1, 55.5], P), { tone: "faint", free: true }),
    k.lineSvg(tankMinor.join("")), k.lineSvg(tankMajor.join("") + k.segment([RX - 2.8, TY1, ZW0], [RX - 2.8, TY1, ZSP], P), { tone: "mid" }), ...tankLabels,
    // Two short lines under the flange, clear of the spout block and the jet.
    label(TX1, TY1 - 3, ZSP - 9, "right", "SPOUT", 4.4, { tone: "hi" }),
    label(TX1, TY1 - 3, ZSP - 14.5, "right", "$90k", 4.4, { tone: "hi" }),
    // Spout flange with four screws on the near wall, at the $90k line.
    slab(box(TX1, SY - 5, 1.5, 10, 0.4), ZSP - 4, ZSP + 6, { tone: "mid" }),
    k.dotsSvg([[SY - 3.8, ZSP - 2.6], [SY + 3.8, ZSP - 2.6], [SY - 3.8, ZSP + 4.6], [SY + 3.8, ZSP + 4.6]].map(([y, z]) => at(TX1 + 1.5, y, z)), { size: 0.55 }),
    // Basin: floor and the two walls seen from inside.
    slab(B, 0, ZB0, { tone: "mid" }, 4, 0.3),
    '<g class="cs-inside">' + slab(box(B.x, B.y, B.w - BW, BW, 0.3), ZB0, BH, { tone: "mid" }) +
      slab(box(B.x, B.y + BW, BW, B.d - 2 * BW, 0.3), ZB0, BH, { tone: "mid" }) + "</g>",
    '<g data-part="stream"><path class="cs-jet" d="' + jetD + '"/>' + k.lineSvg(jetD, { tone: "mid", flow: true, className: "cs-flow" }) + "</g>",
    slab(box(TX1 + 1.5, SY - 3, 12, 6, 0.8), ZSP - 1, ZSP + 4, { tone: "mid" }),
    // The mouth is a dry opening; its water shows only while the stream runs.
    '<path class="cs-mouth" d="' + mouthD + '"/><g data-part="spout-water"><path class="cs-mouth-water" d="' + mouthD + '"/></g>' + k.lineSvg(mouthD),
    '<g data-part="pool">' + water(POOL, ZB0, (ZB1 - ZB0) * REST.spill) + "</g>",
    slab(box(B.x + B.w - BW, B.y, BW, B.d - BW, 0.3), ZB0, BH, { tone: "hi" }),
    slab(box(B.x, BGLASS, 3, BW, 0.3), ZB0, BH, { tone: "hi" }),
    slab(box(BX, BGLASS, 3, BW, 0.3), ZB0, BH, { tone: "hi" }),
    k.lineSvg(k.segment([B.x + 3, BF, BH], [BX, BF, BH], P)),
    k.lineSvg(basinTicks, { tone: "mid" }),
    label(BX - 3.5, BF, ZB1 - 0.5, "left", "$30k", 4.4, { anchor: "end", tone: "hi" }),
    label(B.x + B.w, BF - 3, 8, "right", "PROFIT", 4.4, { tone: "hi" }),
    // Inlet: base flange, post, units counter, elbow, run, valve with handwheel, nozzle over the tank.
    cyl(IN, 4.5, 0, 1.4, { tone: "lo" }),
    cyl(IN, 2.4, 1.4, ZR - 3, { tone: "mid" }, 0),
    slab(box(IN[0] - 7.5, IN[1] + 2.2, 15, 3.2, 0.6), 38, 48, { tone: "hi" }),
    '<g transform="' + k.sideMatrix([IN[0] - 6.5, IN[1] + 5.4], 45.8, P, "left") + '"><rect class="cs-display" width="13" height="5.6" rx="0.6"/>' +
      '<text data-part="count" class="iso-face-text" data-tone="hi" x="6.5" y="4.4" font-size="4.4" text-anchor="middle">' + REST.count + "</text></g>",
    cyl(IN, 3.4, ZR - 3.4, ZR + 3.4, { tone: "mid" }, 0.5),
    slab(box(IN[0] + 3, IN[1] - 2.2, NZ[0] - 3 - IN[0] - 3, 4.4, 0.8), ZR - 2.2, ZR + 2.2, { tone: "mid" }),
    slab(box(-55, IN[1] - 3.2, 6, 6.4, 1), ZR - 3.2, ZR + 3.2, { tone: "hi" }, 3, 0.4),
    cyl([-52, IN[1]], 0.8, ZR + 3.2, ZR + 6.8, { tone: "mid" }, 0),
    cyl([-52, IN[1]], 4.2, ZR + 6.8, ZR + 8, { tone: "mid" }),
    k.lineSvg(k.ring(-52, IN[1], 3.3, ZR + 8, P, 32) + [0, 1, 2, 3].map((i) => k.segment(spoke(i, 1), spoke(i, 3.3), P)).join("")),
    cyl([-52, IN[1]], 1.2, ZR + 8, ZR + 8.8, { tone: "hi" }, 0),
    cyl(NZ, 1.8, ZT + 3, ZR - 3, { tone: "mid" }, 0),
    cyl(NZ, 3, ZR - 3, ZR + 3, { tone: "mid" }, 0.5),
  ],
});
const LIVE_PARTS = [
  "const tankWater = root.querySelector('[data-part=\"tank-water\"]'), pool = root.querySelector('[data-part=\"pool\"]');",
  "const stream = root.querySelector('[data-part=\"stream\"]'), spoutWater = root.querySelector('[data-part=\"spout-water\"]'), counter = root.querySelector('[data-part=\"count\"]');",
  "const water = (plan, z, h) => (h > 0.05 ? solidSvg(slabOf(plan, z, h, P, 2), { lit: true, className: 'cs-water' }) : '');",
  "let drawn = '';",
  "function paint(m) {",
  "  const key = m.fill.toFixed(4) + ' ' + m.spill.toFixed(4);",
  "  if (key !== drawn) {",
  "    drawn = key;",
  "    tankWater.innerHTML = water(TANK_WATER, ZW0, (ZSP - ZW0) * m.fill);",
  "    pool.innerHTML = water(POOL, ZB0, (ZB1 - ZB0) * m.spill);",
  "  }",
  "  stream.style.opacity = spoutWater.style.opacity = m.spill > 0 ? '' : '0';",
  "  counter.textContent = m.count;",
  "}",
].join("\n");
const LIVE_DATA = { P, TANK_WATER, POOL, ZW0, ZSP, ZB0, ZB1 };
// ---- /geometry ----

// 4. Card, live script and splice. The live script runs in the page with root, PLAY and the kit in scope.
const block = figureBlock({
  id: ID,
  svg,
  fig: "Fig 1",
  title: "Break-even cistern",
  hint: "Hover or drag to sell more units",
  readout: REST.text,
  keys: [{ mark: "lit", label: "Water: contribution, $20 a unit" }, { mark: "raised", label: "Spout at fixed costs, $90,000" }],
  caption: "Contribution fills the tank to the $90,000 spout first; only the overflow is profit. Illustrative numbers.",
  slider: { label: "Units sold: arrow keys step through 0, 1,500, 3,000, 4,500 and 6,000", min: 0, max: QMAX, now: QMAX },
  live: `
const PRICE = ${PRICE}, VARIABLE = ${VARIABLE}, FIXED = ${FIXED}, QMAX = ${QMAX};
const { ${Object.keys(LIVE_DATA).join(", ")} } = ${JSON.stringify(LIVE_DATA)};
${model.toString()}
${LIVE_PARTS}
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
PLAY(root, {
  // tau 0.10 s: even the longest move, the wrap from 6,000 back to 0, lands on its exact value in about 0.7 s, so every stop holds for most of the 2.2 s dwell.
  stops: ${JSON.stringify(STOPS)}, min: 0, max: QMAX, start: still ? QMAX : 0, tau: 0.10,
  draw(units) {
    const m = model(units);
    paint(m, units);
    return m.text;
  },
});`,
});
splice(PAGE, ID, block);
console.log("spliced", ID, "into", PAGE);
