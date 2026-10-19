# Object figures (Anatomy)

An object figure explains an idea as a real thing that works: a cistern, a lever, a lock. It is an interactive isometric SVG inside a card with a title, a hint and a live readout. Upstream aims at technical ideas; in praghtml it explains any topic: finance, accounting, economics, strategy, science, school cases and tech. Read this guide before you put one in a page.

## Where it lives

| Path in `~/.claude/skills/praghtml/` | What it is |
| --- | --- |
| `anatomy/` | Git clone of [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy), MIT, commit 240a9bf at install. Kit, examples, references, verify scripts. |
| `iso/figure.mjs` | Build side (Node). Wraps a drawing in its card and splices it into a page. |
| `iso/player.js` | Page side. `window.ISO_PLAY` tours, steers and pauses one figure. |
| `iso/examples/break-even-cistern.fig.mjs` | A finished build to copy from: model, page seed, kit geometry, live script. Copy it beside your page first; it refuses to run inside the skill. |

A sparse checkout hides Anatomy's own `SKILL.md`, so it does not register as a second skill. Read it with `git -C ~/.claude/skills/praghtml/anatomy show HEAD:SKILL.md`.

## Use one, or not

Use an object figure when a physical mechanism maps one-to-one onto the idea, and moving it teaches something. If you cannot say in one sentence what moves and what that means, use a praghtml diagram.

| The idea is | Use |
| --- | --- |
| A quantity that rises, a threshold, a flow rate, a balance, a queue, a leak | **Object figure** |
| A static fact or a list | Table |
| A stack or an architecture | Layers |
| An order of events | Ladder |
| A flow of 3–6 steps | Chain |
| States over time | Track |

Use one object figure per section, at most. It replaces that section's diagram; it never decorates one. The kit builds it, so praghtml's ~40-element cap for hand-written SVG does not apply.

## The one idea

- **The object is the explanation.** Put no boxes, arrows or floating labels on it.
- **Every figure is dense.** A few slabs read as nothing. Build a recognisable machine from many small, precise parts (`craft.md` §1–§3).
- **One small pure model** gives every moving part and the readout. Nothing moves unless the model says so.
- **Truth first.** The model uses the real formula; check one value by hand. If the numbers are made up, end the caption with "Illustrative numbers."
- **The readout states the answer** in words, e.g. `400 units · break-even`.

## Size and time

| Size | Scope | Parts | Time | Rule |
| --- | --- | --- | --- | --- |
| Figure | One mechanism | 40–80 | 30–90 min | Build it without asking. |
| Hero | A dense object | 80–150 | 2–4 h | Tell the user first, then build. |
| Epic | A whole vehicle, building or plant with many moving systems, or 3D on several subjects | many | 6 h+ | Do not start. Propose a Hero and list what the full version adds. |

The sizes come from Anatomy's `SKILL.md`, workflow step 1. A part is one real piece: a foot, a screw, a rail, a groove. Have a working page open within the first hour, then deepen it. Run `date` at each step; if a step takes twice its share, tell the user.

## Metaphors for any topic

Pick an object whose working *is* the concept. Each moving part stands for one term of the model. For science, the real apparatus is often the best object. ★ marks rows from upstream figures. Readouts are examples.

| Field | Concept | Object | What moves | Readout |
| --- | --- | --- | --- | --- |
| Tech ★ | Cache key that skips unchanged work | Pin-tumbler lock | Every pin matches, so the plug turns | `5/5 pins · skip redraw` |
| Tech ★ | One GPU context for many canvases | Gantry plotter over 16 wells | One print head visits each well | `well 7 of 16` |
| Tech ★ | Render targets by bytes per texel | Chest of seven drawers | Each drawer is as deep as its bytes | `RGBA16F · 8 B` |
| Tech ★ | Separable blur | Bed of nails beside two combs on rails | Two comb passes do one stamp's work | `49 + 49 vs 49 × 49 taps` |
| Tech ★ | Spring that presses and leans | Test rig with a dial gauge | A probe presses; the needle reads the lean | `lean 0.4 mm` |
| Tech ★ | Height profile | Contour gauge | Pins slide to the edge's shape | `peak 12 px` |
| Tech ★ | Light that depends on facing | Photo studio on a turntable | The subject turns past key and fill lamps | `facing 40°` |
| Accounting | Break-even | Cistern with an overflow spout at fixed-cost height | Each unit pours in its contribution; the spill is profit | `400 units · break-even` |
| Finance | Operating leverage | Lever on a movable fulcrum | Fixed costs move the fulcrum; a small sales push swings profit far | `DOL 3.0×` |
| Accounting | FIFO inventory | Gravity-flow carton rack | The oldest carton rolls out first | `COGS from lot 1 · $4.10` |
| Economics | Solow steady state | Tank with an investment inflow and a depreciation leak | The level settles where inflow meets leak | `k* 9.0 · in = out` |
| Sales, admissions | Funnel | Stacked sieves | Each sieve passes a share down | `1,000 → 120 → 30` |
| Operations | Bottleneck (theory of constraints) | Pipe that narrows, or an hourglass | Flow caps at the neck | `40/h · neck at step 3` |
| Finance | Diversification | Hanging mobile | One arm drops; the whole tilts less | `σ 18% → 11%` |
| ML, maths | Gradient descent | Ball on a contour plate | The ball steps downhill | `step 12 · loss 0.08` |
| Economics | Supply and demand | Balance scale | The pans settle at the clearing price | `P* $4 · Q* 300` |
| Tech | Rate limit (token bucket) | Metered hopper | Tokens drip in; each request takes one | `7 tokens · 2 dropped` |
| Operations | Little's law | Ticket dispenser and rack | Arrival rate times wait fills the rack | `L = 4/min × 3 min = 12` |
| Finance | Compound interest | Tank whose float opens its own inlet | The fuller it is, the faster it fills: interest on interest | `year 10 · $1,629` |
| Strategy | Flywheel effect | Heavy flywheel with a crank | Each push adds speed; churn is friction | `120 rpm · push 6` |
| Science | Osmosis | U-tube with a membrane | Water climbs the salty side | `Δh 4 cm` |

## Workflow

1. **Size it** with the table above. Run `date`.
2. **Write the model.** One pure function: the input in; part positions and the readout text out.
3. **Invent the object.** One sentence: what moves, and what that motion means.
4. **List the parts.** 40–80 for a Figure, grouped: base, structure, mechanism, controls, subject. Only the subject is lit.
5. **Build in Node with `k`.** Follow `anatomy/references/craft.md` (§3 parts, §4 tones, §5 painter's order, §6 camera) and `kit.md` (§6 moving things, §7 SVG strings). Read the closest example; `dial-indicator` is the smallest.
6. **Keep the build script beside the page** as `<page-slug>.fig.mjs`. Follow-ups edit it and run it again.
7. **Mark the spot.** Put `<!-- iso:fig-NAME -->` in the page. Call `figureBlock`, then `splice`.
8. **Make it live.** Pass build-time values into the live script with `JSON.stringify`. Call `PLAY` once.
9. **Verify** with the commands below.
10. **Detail pass.** Zoom 4× over the subject and mechanism with `capture.mjs --zoom x,y,w,h`. Where a region is plain, add the real parts it lacks: screws, seams, bevels, label plates, scales.

## Bridge API

Import `{ k, figureBlock, splice }` from `/Users/prag/.claude/skills/praghtml/iso/figure.mjs`. Use the absolute path; `~` does not expand in an import. `k` is the whole iso-kit namespace (`kit.md`). Other exports: `kitAssets({ gl })`, `TEMPLATE` (path to `template.html`), `ANATOMY` (path to the clone), `KIT_NAMES`, `GL_NAMES`.

### `figureBlock({ … })` returns the figure's HTML

| Option | Default | What it does |
| --- | --- | --- |
| `id` | required | Wrapper id and page marker, e.g. `fig-break-even`. It starts with a letter. `assets` is reserved for the shared asset markers. |
| `svg` | required | The drawing, from `k.figureSvg({ width, height, label, body })`. `label` says what the object is and what it shows. |
| `fig`, `title`, `hint` | `"Fig 1"`, none, none | Card corners. The hint says how to steer, e.g. "Hover or drag to set units sold". |
| `readout` | `""` | Readout before the script runs. Use the model's text at `start`. |
| `keys` | `[]` | Legend rows `{ mark, label }`. Marks: `raised`, `flat`, `lit`, `edge`, `dim`, `dotted`, `dashed`, `red`, `green`, `blue`. |
| `caption` | none | One line under the card: the takeaway. |
| `live` | `""` | Page script source. Without it, the figure is static: no focus, no slider, no Pause bar. |
| `slider` | `{}` | Starting ARIA slider values `{ label, min, max, now }`, read only when `live` is set; a static figure ignores it. On a live figure it must be a plain object; `null` or an array throws. A missing or empty `label` falls back to `title`, then `fig`. `min`, `max` and `now` default to 0, 1 and `min`; they must be finite numbers with `min < max` and `now` between them. Anything else, including `null` or a numeric string, throws. |
| `theme` | `"light"` | Keep it. Only light maps to page tokens; any other value throws. |
| `gl` | `false` | Inlines Anatomy's WebGL kit, `gl.mjs`, and puts its functions in the live script's scope. Untested in praghtml. |

### `splice(page, id, block)`

- Writes the block after `<!-- iso:ID -->` and closes it with `<!-- /iso:ID -->`. A rerun replaces everything between the two markers.
- Writes the shared assets into `<head>` once, between `<!-- iso:assets -->` markers: Anatomy's MIT license notice, its CSS plus the bridge CSS, the kit as `window.ISO`, and `window.ISO_PLAY`. Any figure with `gl: true` adds the WebGL kit.
- Throws if the id is invalid, or the marker or `</head>` is missing. Returns the page path.

### `PLAY(root, { … })` returns `{ set, pause, play, value }`

A live script runs once, right after its figure's markup. In scope: `root` (this figure's wrapper), `PLAY` (`window.ISO_PLAY`), `ISO` (the kit object) and every kit function by bare name, e.g. `translateAlong`. Only `iso-kit.mjs` exists in the page (`gl.mjs` too with `gl: true`).

| Option | Default | What it does |
| --- | --- | --- |
| `draw(value, ctx)` | required | Moves the parts for `value`. Returns the readout text, or `{ text, busy, say }`. |
| `stops` | `[min, max]` | Values the tour visits, in order. Arrows step through them sorted. |
| `min`, `max` | lowest, highest stop | Range for pointer, keys and ARIA. |
| `start` | first stop | Value at load. The figure rests here under reduced motion. |
| `tour` | visit stops | `"sweep"`: glide min to max over `period`, hold, rewind. `false`: no tour, no Pause bar. |
| `dwell`, `period`, `hold` | `2200`, `6000`, `1400` ms | Time at each stop; sweep length; hold at `max`. |
| `tau`, `idle` | `0.28` s, `3600` ms | Ease (exponential follow); delay before the tour takes over again after steering. It starts from the nearest stop and holds it for one `dwell`. |
| `step` | none | Arrows move by `step`; Home and End go to `min` and `max`. |
| `pointer`, `band`, `fromPointer(share)` | on, `[0.15, 0.85]`, linear | `pointer: false` stops pointer steering. `band` is the share of SVG width mapped onto the range; `fromPointer` maps that share (0–1) to a value. |

`ctx` is `{ dt, still, target, touring }`. The text goes to the readout and to the stage's `aria-valuetext`. `say` goes beside the Pause button. `busy: true` keeps frames coming while a spring settles; Pause freezes springs too, and steering wakes them. `set(v)` steers like a reader; `pause()` and `play()` work like the button; `value` reads the current value. `PLAY` on a root that already has a player returns that player.

## Skeleton

The tested build script for a tiny break-even figure. Real figures follow the upstream detail rules: 40+ parts, and every line ends on something. Run it with `node break-even.fig.mjs`; `break-even.html` needs `<!-- iso:fig-break-even -->`.

```js
import { fileURLToPath } from "node:url";
import { k, figureBlock, splice } from "/Users/prag/.claude/skills/praghtml/iso/figure.mjs";
const PAGE = fileURLToPath(new URL("break-even.html", import.meta.url));

// 1. One pure model drives the parts and the readout. Illustrative numbers.
const FIXED = 12000, MARGIN = 30, FLOOR = 6, SPOUT = 70;
function model(units) {
  const sold = Math.round(units / 10) * 10, profit = sold * MARGIN - FIXED;
  const level = FLOOR + (SPOUT - FLOOR) * Math.min(1, (units * MARGIN) / FIXED);
  const money = "$" + Math.abs(profit).toLocaleString("en-US");
  return { level, text: sold + " units · " + (profit < 0 ? "loss " + money : profit > 0 ? "profit " + money : "break-even") };
}

// 2. Geometry in world units (z up), built once. A moving part sits at rest in <g data-part>.
const PLATE = { x: -64, y: -60, w: 128, d: 116, r: 6 }, TANK = [0, -8], R = 34, H = 84;
const BOARD = { x: -5, y: TANK[1] + R + 1.5, w: 10, d: 3, r: 0.6 }, FACE = BOARD.y + BOARD.d;
const P = k.fitProjection([...k.boxCorners(PLATE, -8, 0), ...k.boxCorners({ x: -R, y: TANK[1] - R, w: 2 * R, d: 2 * R }, 0, H + 4)], 600, 380, { pad: 30 });
const ticks = [14, 22, 30, 38, 46, 54, 62].map((z) => k.segment([BOARD.x, FACE, z], [BOARD.x + 3, FACE, z], P)).join("");
const svg = k.figureSvg({
  width: 600, height: 380,
  label: "A cistern with an overflow spout at the fixed-cost height. A float on the gauge board shows the contribution so far.",
  body: [
    `<path class="iso-halo" d="${k.haloOf(PLATE, -8, 8, P)}"/>`,
    k.solidSvg(k.slabOf(PLATE, -8, 8, P, 8, 1.2), { tone: "lo" }),
    k.dotsSvg(k.corners(PLATE, 8).map(([x, y]) => k.iso([x, y, 0], P))),
    k.solidSvg(k.cylinder(TANK[0], TANK[1], R, 0, H, P, 64, 0.8), { tone: "hi" }),
    k.lineSvg(k.ring(TANK[0], TANK[1], R - 3, H, P, 64)),
    k.solidSvg(k.slabOf({ x: R - 0.4, y: TANK[1] - 4, w: 16, d: 8, r: 1.5 }, SPOUT - 3, 6, P, 4, 0.4), { tone: "mid" }),
    k.solidSvg(k.slabOf(BOARD, 0, H + 4, P, 3, 0.4), { tone: "mid", inner: k.lineSvg(k.sideSeam(BOARD, SPOUT, P, 3), { tone: "hi" }) }),
    k.lineSvg(ticks),
    `<g data-part="float" transform="${k.translateAlong(P, [0, 0, model(200).level])}">${k.solidSvg(k.slabOf({ x: -7, y: FACE, w: 14, d: 2.4, r: 0.6 }, -1.5, 3, P, 3), { lit: true })}</g>`,
  ],
});

// 3. Card, live script, splice. The live script runs in the page with root, PLAY and the kit in scope.
const block = figureBlock({
  id: "fig-break-even", svg, fig: "Fig 1", title: "Break-even cistern", hint: "Hover or drag to set units sold",
  readout: model(200).text,
  keys: [{ mark: "lit", label: "Float: contribution so far" }, { mark: "raised", label: "Spout at fixed cost, $12,000" }],
  caption: "Each unit pours in $30 of contribution. At 400 units the water reaches the spout; every later unit spills out as profit. Illustrative numbers.",
  slider: { label: "Units sold. Arrow keys step through 200, 400 and 600.", min: 0, max: 800, now: 200 },
  live: `
const P = ${JSON.stringify(P)};
const FIXED = ${FIXED}, MARGIN = ${MARGIN}, FLOOR = ${FLOOR}, SPOUT = ${SPOUT};
${model.toString()}
const float = root.querySelector('[data-part="float"]');
// tau 0.12: readout rounded to 10; the longest move, the 600-to-200 wrap, settles in about 0.5 s (see Pitfalls).
PLAY(root, { stops: [200, 400, 600], min: 0, max: 800, tau: 0.12, draw(units) {
  const now = model(units);
  float.setAttribute("transform", translateAlong(P, [0, 0, now.level]));
  return now.text;
} });`,
});
splice(PAGE, "fig-break-even", block);
```

## Theme and tokens

Light theme only. Card and page take `--bg`; text takes `--ink` and `--muted`; the lit subject takes `--accent`; mono takes `--mono`.

- Light one subject, the answer, with `lit: true`. It can span parts that are the same thing, like the cistern's water in tank and basin. That is praghtml's one accent path.
- Use the tones for the rest: base `lo`, structure `mid`, subject `hi`, grooves `faint` (`craft.md` §4). Put no hex colours in the build, and skip the `red`, `green` and `blue` marks: their colours are not page tokens. Mix custom colours from tokens: `color-mix(in srgb, var(--ink) 12%, var(--bg))` is a neutral grey for any part; mix `--accent` only into the lit subject.

## Motion and accessibility

| praghtml rule | How the figure meets it |
| --- | --- |
| Every page moves | PLAY tours the stops on a loop, eased by `tau`. |
| Anything that auto-moves is pausable (WCAG 2.2.2) | A Pause button sits under the card, and a click on the figure toggles it (a drag does not). Pause freezes every part where it is, springs and a steer still easing included. `aria-pressed` shows the state. |
| Reduced motion is a real path | No tour, no easing, no bar. The figure rests at `start`. Keys and pointer still work. If the reader turns reduced motion off, the tour returns unless they paused. |
| Nothing runs off-screen or in a hidden tab | An IntersectionObserver and `visibilitychange` stop the frames. |
| Animate `transform` and `opacity` only in loops | Slide each `<g data-part>` with `translateAlong(P, [dx, dy, dz])`. A needle that turns is rebuilt each frame instead (`kit.md` §6). |
| No JS to render | Node builds the SVG. The figure is complete without script. |

- **Steering.** Move the pointer across the figure, or press arrows, Home or End on the focused stage. The tour stops. After `idle` it takes over again from the nearest stop and holds it for one `dwell` before moving on, unless the reader paused. A sweep picks up at the current value.
- In a live figure, the stage is a focusable ARIA slider with a 2 px accent focus ring. Screen readers hear the readout through its `aria-valuetext`; the card corners are `aria-hidden`. On touch, the page still scrolls; a sideways drag steers. A static figure has no slider and takes no focus.
- `lineSvg(d, { flow: true })` loops `stroke-dashoffset`, which breaks the transform-and-opacity rule; use it on one short line at most. Flow lines and `pulse` dots move only while the figure's player runs: they stay still with JS off and in a figure without `live`, and Pause, off-screen and reduced motion stop them.

## Verify

Write every output into your scratch folder. Without an out-dir, `qa.js` writes a `qa/` folder beside the page.

```sh
node ~/.claude/skills/praghtml/qa.js page.html scratch/qa
node ~/.claude/skills/praghtml/anatomy/scripts/lines.mjs page.html --select '#fig-x .iso-plate' --out scratch/lines.png
node ~/.claude/skills/praghtml/anatomy/scripts/capture.mjs page.html --select '#fig-x .iso-plate' --out scratch/fig.png
```

| Check | Pass means |
| --- | --- |
| `qa.js` | `PASS desk` and `PASS mob` (1280 px, and a 390 px phone; both in reduced motion): no sideways scroll, no broken images, no dead `#anchors`, no script errors. |
| `lines.mjs` | `line ends: 0 of N …` and exit 0: every texture line ends on something. `--out` rings each floating end. |
| `capture.mjs` | `console: clean`, `scrolls sideways: no`, and the readout you expect. `--key` and the printed readout use the page's first figure; check later ones with `--hover` and by eye. |

- Add capture flags to see each path: `--width 390` (phone), `--reduced` (still), `--times 1200,2400,4800` (tour frames, each with its readout), `--hover 0.6,0.5` (pointer, as fractions of the card), `--key End` (keys), `--zoom x,y,w,h` (4× close-up).
- Open every PNG and look: one lit subject, nothing clipped at 390 px, the pose matches the readout.
- At 390 px every label should render at 8.5 px or more: its `font-size` × `Math.hypot(m.c, m.d)`, with `m = text.getScreenCTM()`. If one is smaller, scale the drawing up on phones, as the cistern does: `@media (max-width:560px){#fig-x .iso-plate{overflow:hidden}#fig-x .iso-plate .iso-svg{width:128%;margin:0 -14%}}`. Use the largest scale that keeps the drawing 12 px inside the card. A drawing that fills the card's width takes only 110–118% (`craft.md` §6). Then enlarge any label that is still small.

## Limits

- Not bridged: Anatomy's 3D turn mode (`kit/turn*.mjs`), its React path (`kit/react/`) and the dark theme (no page-token mapping; the template is light). `gl: true` (WebGL layers) is untested in praghtml.
- Only `iso-kit.mjs` (and `gl.mjs`) reach the page. Use `lathe.mjs`, `tube.mjs` and `audit.mjs` in the Node build. If the page needs their output, pass it in as JSON.

## Update

```sh
git -C ~/.claude/skills/praghtml/anatomy pull
git -C ~/.claude/skills/praghtml/anatomy status --short   # prints nothing
node <page-slug>.fig.mjs                                  # rebuild one figure page, then run Verify
```

- If the kit changes shape, the bridge throws an error that names `iso/figure.mjs`. Fix the bridge there. Never edit the clone.
- If a kit function is renamed, the build script throws instead. Read `anatomy/CHANGELOG.md` and `kit.md`, then update the script.
- Never restore Anatomy's `SKILL.md` (e.g. with `git sparse-checkout disable`). It would register as a second, competing skill.

## Pitfalls

| Pitfall | Fix |
| --- | --- |
| Tag text such as `<svg>` inside a CSS comment | Remove it. Some viewers strip the whole style block. |
| Two figures with one id | Give each a unique id: `fig-break-even`, `fig-leverage`. |
| Hand edits inside the spliced block | The next build erases them. Edit `<page-slug>.fig.mjs` and run it again. |
| Kit files linked by `src` | The page must open offline. `splice` inlines everything; add no `<script src>`. |
| `document.querySelector` in a live script | Query inside `root`. A page can hold several figures. |
| `k.` calls in a function passed with `toString()` | The page has no `k`. Call kit functions by bare name in page code. |
| A seam or tick that stops mid-face | End it on an edge, or use `k.sideSeam(plan, z, P, steps)` as the slab's `inner`. Fade a groove that runs out with `fadeLineSvg`; mark a needle tip `free: true`. |
| An example's `build.mjs` run in place | It rewrites the clone's shipped pages. Capture `examples/<name>/<name>-light.html` instead. To port its motion, replace its loop, pointer and key code with one `PLAY` call. |
| A readout that changes every frame | Round it, e.g. to 10 units. It is also the slider's spoken value. |
| A rounded readout that shows its exact stop value only briefly | Easing lands within half a rounding step of a stop after about `tau × ln(gap ÷ half the step)`. Use the largest gap, counting the wrap from the last stop back to the first, and keep that under a third of `dwell`. The cistern rounds to 10 units and wraps from 6,000 to 0, so it uses `tau: 0.10`: 0.1 × ln(6,000 ÷ 5) ≈ 0.71 s of a 2.2 s dwell. |
| A test that clicks the stage to focus it | The click toggles Pause. Focus it with `element.focus()` or Playwright's `page.focus()`. |
