---
name: praghtml
description: >-
  Prag's HTML {HyperText Markup Language} pages: diagram-first explainers whose
  diagrams animate themselves on a loop. Explains concepts, architecture,
  stacks, flows, codebases and product ideas as one self-contained .html, with
  hand-built diagrams that assemble on scroll and then walk through their steps
  like a live demo. Also builds Anatomy object figures: interactive isometric
  objects whose motion is the idea, for any topic. Once invoked in a
  conversation, every follow-up question is appended into the same file (never
  chat-only); chat reply is path + one-line gist. Use when the user asks to
  explain something, map a codebase or feature, show the stack, walk a flow,
  show how an idea or feature should work, or make any HTML page, or says "how
  does this work", "explain this", "what's the stack", "show me how this should
  feel", "make it animate", "make me an HTML". Replaces the old explainer,
  animator and ideator skills. Not for slide decks (use slides) or production
  app code.
---

# Praghtml

Turn questions into a living, **visual, moving HTML** page. Get to the point, lead with diagrams, show the **big picture** (and for tech: the **stack** — everything that comes together). Focus on **how things should work**, especially over time.

Composes with **`html-design`** and **`frontend-design`** for polish. Praghtml owns structure, content and motion; load those for look-and-feel. Don't restate them.

**Every page moves.** Diagrams assemble as they scroll in (Reveal), then walk through their steps on a loop (Play): current step lit, upcoming steps dim, a branch picking a different outcome each pass. A page with diagrams that just sit there is unfinished. See *Motion*. Body text never moves.

**The density bar in `html-design` applies here too** — it is a content rule, not a styling one. This user's standing complaint is that these pages come out too verbose. Diagrams **replace** prose, they don't accompany it: ≤2 sentences under each one, tables instead of paragraphs, no preamble, no boilerplate Overview/Conclusion sections, and a subtraction pass before showing. In session mode this matters more each turn — appended Q sections accumulate, so keep every one tight and re-trim the Big picture instead of letting it grow.

**Install note:** Canonical copy lives at `~/.claude/skills/praghtml/`. Symlink into Codex, Cursor and Agents via `bash ~/.claude/skills/praghtml/sync.sh` so one edit updates all of them. `anatomy/` is a git clone of [Anatomy](https://github.com/wheresryan22/anatomy) for object figures; update it with `git -C ~/.claude/skills/praghtml/anatomy pull` (see *Object figures*).

## Non-negotiable: every answer ships / updates HTML

A chat-only answer is a **failed run.** No exceptions.

- Write **one self-contained `.html`**. Inline CSS + inline SVG. **No diagram library** — no Mermaid, no CDN renderer, no `<pre class="mermaid">`.
- **Path default:** user-named path → else `explainers/<slug>.html` in a repo → else `~/Documents/PragPersonal/Projects/<slug>.html`.
- **Start from `template.html`** in this skill folder on first create. It already carries `motion.css`, `reveal.js` and `play.js` inline.
- **Open it** in the browser after writing (`open <path>`), don't just print the path.
- **Chat reply = path + gist only.** No pasted diagrams.

Chat reply shape:
> Updated `explainers/checkout.html` — added how retries interact with PricingService; open for the stack + diagrams.

## Session mode (critical)

Once this skill is invoked in a conversation, **stay in this mode** until the user clearly ends it ("new explainer", "start fresh", "stop explaining", or switches to unrelated implementation work).

| Turn | Action |
| --- | --- |
| **First question** | Create the HTML from `template.html`. Fill Title, Big picture, Stack (if tech). Answer the question in its own section. |
| **Every follow-up question** | **Update the same file.** Do not create a new HTML per question. Append a new **Question** section with diagrams. Refresh Big picture / Stack / gist if the new answer changes the overall model. |
| **New explainer** | Only when asked — new file, new slug. |

Track the active path in the conversation. Put it in the HTML too:

```html
<meta name="praghtml-file" content="explainers/checkout.html" />
<meta name="praghtml-session" content="active" />
```

Each answered question becomes a dated/numbered block under `#questions` so the page is a running explainer notebook, not a one-shot doc.

## When to use

- Explain a concept, pattern, or system
- Map a codebase / module / feature
- Show **what comes together** (stack, services, libs, layers)
- Architecture / component relationships
- Flows, lifecycles, motion / interaction
- **A product idea or feature**: how it should work in action (see *Idea demos*)
- Any other one-off HTML page that should feel alive

**Not this skill:** slide decks (`slides`), implementing product fixes, auditing motion (`improve-animations`).

## Operating rules

1. **HTML is mandatory** — create or update the file every turn in session mode.
2. **Accumulate** — follow-ups append; they don't replace prior Q sections (unless the user asks to revise a specific answer).
3. **Lead with diagrams.** 1–3 sentences per diagram; bullets over paragraphs.
4. **Every concept ships a concrete example.** No abstract definition stands alone — see *Always ground it in an example*.
5. **One idea per diagram.** Split overloaded pictures.
6. **Name real things** from the codebase / real stack — never `ServiceA` / `Utils`.
7. **Show time when it matters** — sequence / state / timeline, not only boxes.
8. **Default to "how it should work."** Note as-is drift in one line if relevant.
9. **Explain, don't refactor** product code.

## Readable output (Karpathy, Oct 2026)

Karpathy ranks output formats as a ladder: text → diagram → HTML page → explainer video. Each rung is easier to take in than the one below it. This skill lives on the HTML rung. Use the lower rungs inside the page, and offer the next rung when it helps.

- **Climb only as far as the question needs.** A one-fact answer is a row in a table. A new diagram is for a new structure or flow.
- **Write prose at about 80% of ASD-STE100** (Simplified Technical English). Instructions: 20 words or fewer. Descriptions: 25 words or fewer. Paragraphs: 6 sentences or fewer. One idea per sentence.
- **Active voice, simple tenses.** "The webhook sends the lead to Make.com." Avoid "-ing" verbs and "has been".
- **Same word for the same thing.** A page that says "vendor" never switches to "store" or "retailer" for the same record. Noun clusters: 3 words or fewer.
- **Plain words:** use, start, make sure, before, about, to. Drop utilize, commence, ensure, prior to, approximately, in order to.
- **Build for oversight.** The model does the legwork and the reader checks it. Lead with the answer or verdict, then the proof: a number, a cropped screenshot, a source link, a test result.
- **Fold raw detail.** Full logs, every check and long tables go in a collapsed `<details>` at the end.
- **Offer the video rung when change over time is the point.** Hand off to `brag-slim` (or Hyperframes) for a 3b1b-style explainer. ElevenLabs narration needs the user's key: ask before you spend it, and never print it. Without a key, use a free local voice (macOS `say`).
- **Discardable is fine.** A large page built for one question is a good result when it makes the answer easier to check.

## Workflow

### 1 · Scope

| Kind | Goal | Primary form |
| --- | --- | --- |
| Concept | Mental model | **chain** |
| Architecture | Structure + boundaries | **layers** (nested boxes) |
| **Stack / tech** | What comes together | **layers**, top to bottom |
| Codebase / feature | Who calls what | **layers** + one accented path |
| Flow / lifecycle | Order of events | **ladder** (never a sequence diagram) |
| Motion / interaction | States, triggers, timing | **track** + timeline table |
| Mechanism / quantity (any topic) | What moves and what it means | **object figure** (Anatomy) |

One clarifying question only if scope is genuinely ambiguous.

### 2 · Recon (code / tech)

Just enough — no file-tree dumps:

- Entry points + hot path
- Where state lives / who owns side effects
- **Stack inventory** (languages, frameworks, services, queues, DBs, third parties that actually participate)
- For motion: trigger, states, interruptibility, reduced-motion path

### 3 · Page information architecture

| Section | Status | Contents |
| --- | --- | --- |
| **Title + gist** | Required | Plain title + 1–2 sentence summary (update as session grows) |
| **Big picture** | Required | Overall mental model diagram + 2–4 bullets — the whole system at a glance |
| **Examples** | Required | Not always its own section — but every concept above must carry a concrete instance |
| **Stack** | Required for tech | Everything that comes together: languages, frameworks, services, infra, key libs — as a diagram + short table |
| **How it works** | If there's a core flow | Main-path sequence / state |
| **Motion / interaction** | If motion matters | trigger → states → settle + timeline (+ optional live demo) |
| **Key pieces** | Codebase | `path/symbol` → one-line role |
| **Questions** | Required after first Q | Running log: each user question → diagram-first answer |
| **Gotchas** | If any | Races, ownership edges, what must not animate |

**Big picture** = the forest. Keep it current as new questions land; it should still fit in one diagram (≤ ~12 nodes).

**Stack** (tech topics) — show how the pieces compose, not a laundry list of every dependency:

```html
<div class="layers">
  <div class="layer"><span class="layer-name">Client</span>
    <div class="box">React / Next</div></div>
  <div class="layer"><span class="layer-name">Edge</span>
    <div class="box">API gateway</div></div>
  <div class="layer"><span class="layer-name">Core</span>
    <div class="box is-key">Node API</div><div class="box">Workers</div></div>
  <div class="layer"><span class="layer-name">Data</span>
    <div class="box">Postgres</div><div class="box">Redis</div></div>
</div>
```

Plus a tight table:

| Layer | Piece | Role |
| --- | --- | --- |
| Client | React | UI + local interaction |
| API | `services/checkout` | Orchestrates payment |
| Data | Postgres | Source of truth |

Omit Stack for pure non-tech concepts (e.g. "what is eventual consistency" can stay concept-only unless tools/systems are in play).

**Questions log** — for each user question in the session:

```html
<article class="q" id="q-3">
  <h3>Q3 · How do retries work?</h3>
  <figure><!-- diagram --></figure>
  <ul><!-- 2–4 bullets --></ul>
</article>
```

Newest question can go at the top or bottom of `#questions` — pick one order and keep it consistent in the file (default: **newest at top**).

### 4 · Check, then stop (per turn)

Render the page and look at it before you reply. `qa.js` in this folder does the render and the checks:

```bash
node ~/.claude/skills/praghtml/qa.js <page.html> [out-dir]
```

- It renders at 1280 px and as a 390 px phone (Playwright device emulation, reduced motion on), and saves full-page screenshots.
- It fails on sideways scroll, a broken image, a dead `#anchor` link or a script error. On sideways scroll it names the element that sticks out.
- Open the screenshots and look. Fix, rebuild, and re-render only when something changed.
- Pages with object figures also need `lines.mjs` and `capture.mjs` (see *Object figures*).
- Do not trust Chrome's `--window-size=390,…` as a phone check. The page lays out wider than 390 px and the capture cuts off the right edge.
- Without reduced motion, Reveal elements can capture blank. For the Chrome CLI, add `--force-prefers-reduced-motion --run-all-compositor-stages-before-draw`.

After updating the HTML: path + gist. Stay ready for the next question. Don't auto-expand beyond what the latest question needs.

## Always ground it in an example

A definition the reader can't picture is not an explanation. **Every concept, rule, and classification gets at least one concrete, named example** — and examples are cheap in words, so they are the *first* thing to add and the *last* thing to cut.

| Rule | Do |
| --- | --- |
| **Concrete over generic** | "beef tenderloin in a steak meal", not "a raw material" |
| **Real numbers** | show the arithmetic: `$135,000 ÷ $90,000 = 150%` |
| **One per branch** | every cell of a 2×2, every arm of a fork, every state gets its own example |
| **Counter-example where the rule surprises** | the case that looks like it should fall the other way and doesn't |
| **Same running example throughout** | pick one domain and reuse it, so the reader carries context between sections |
| **Label the made-up ones** | "illustrative figures" when they aren't from the source |

Examples belong **inside the diagram** where they fit — a node labelled `Beef tenderloin` teaches more than a node labelled `Direct material` with a caption underneath. Otherwise put them in an examples table right under the diagram.

**Checklist before shipping:** every abstract noun on the page has a concrete instance within one screen of it. If a section defines something and never shows it, that section is unfinished.

## Audit and evidence pages

Use this shape when the page reports what you tested: an app audit, a QA pass, a review that someone will forward. The proof is the content.

| Part | Do |
| --- | --- |
| **Header** | Title, a two-sentence verdict, who it is for, the date and what you tested. Jump pills to each section. |
| **Big picture** | One layers diagram. Each box carries a verdict pill: `WORKS`, `FAKE` or `GAP`. |
| **Findings** | Numbered. One claim per heading, a verdict pill, one or two sentences, then the screenshots. |
| **Screenshots** | 16 or fewer. Crop each one to the evidence and ring the exact spot in the accent colour. A click opens the full screenshot in a lightbox (`data-full`). |
| **State changes** | A before → after pair, top-aligned, with bold "Before:" and "After a refresh:" captions. |
| **What works** | Screenshots of what works too. Credit makes the negatives easier to trust. |
| **Next steps** | A ranked ladder, then a "What I need from you" table. |
| **Full log** | Every check you ran, in a collapsed `<details>` at the end. |

- Blur passwords, demo logins, keys and private emails in the image itself before it goes in. Never quote them in the text.
- Inline the images as WebP `data:` URIs, so the page is one file that opens anywhere and goes out as one attachment.
- State what you did not change ("Nothing real was sent") in the header and the footer.

## Diagrams

**Hand-build every diagram in HTML + CSS + inline SVG. No Mermaid. No diagram library, no CDN renderer, no `<pre class="mermaid">`.**

A generated diagram announces that a tool drew it — numbered step bubbles, dotted `alt` frames, yellow sticky notes, acres of dead lane whitespace, labels placed wherever the layout engine felt like. It reads as *output*. A diagram you lay out yourself reads as *a page*. It also costs less: no CDN, no render pass, no layout you can't control, and it prints.

Build everything out of these six primitives. The first five are ~20 lines of CSS each, defined once in the page's `<style>` and reused. The sixth comes from the Anatomy bridge.

| Primitive | Use for | Built from |
| --- | --- | --- |
| **Chain** | a flow of 3–6 steps | `<ol>` in flexbox, arrow via `::after` |
| **Layers** | stack, architecture, boundaries | nested `<div>`s; the boundary IS the border |
| **Ladder** | order of events over time | numbered rows, actor chip + what happens |
| **Track** | states / motion over time | a bar with labelled segments |
| **Hero SVG** | when the geometry itself is the point | hand-written `<svg viewBox>` |
| **Object figure** | a mechanism: a level, threshold, flow, leak or balance | Anatomy kit through `iso/figure.mjs`; see *Object figures* |

### Order of events: use a ladder, not a sequence diagram

The sequence diagram is the worst offender — four empty lifelines, a numbered bubble per line, `alt` boxes drawn as dotted rectangles a third of the page tall. Replace it with a ladder: one row per step, actor on the left, what happens on the right, a spine line down the side.

```html
<ol class="ladder">
  <li><span class="who">Agent</span> reads <code>program.md</code>, picks a hypothesis</li>
  <li><span class="who">Agent</span> edits the one file, commits</li>
  <li><span class="who">Runner</span> <code>uv run train.py &gt; run.log</code> — output redirected</li>
</ol>
```

Branches (`alt` / `else`) become two or three short labelled blocks side by side — a "keep" block and a "discard" block — not a dotted frame swallowing the diagram.

### Rules

- **Tokens only.** Every fill, border and text colour is a `var(--…)` already on the page. No hard-coded hex inside a diagram.
- **One accent path.** Exactly one thing is the main path or the answer; everything else is neutral.
- **≤ ~12 boxes**, labels ≤ 4 words, spoken-aloud names from the real system.
- **Mobile.** Flex-wrap, or flip the chain to a column under ~640px. Never a fixed-width canvas.
- **One-line caption** under each, stating the takeaway — not describing the picture.
- **Print.** `break-inside: avoid` on every figure.
- **No JS to render.** A diagram that needs a script to appear is the thing we just removed.
- **Reveal, then play; don't render.** The diagram is complete in the HTML; Reveal fades it in, Play walks it. With JavaScript off or reduced motion on, everything is simply there.
- **Object figures are the exception** to the box and element caps: they carry 40–80 parts by design. Their colours still come from page tokens, through the bridge.

Reach for a hand-written `<svg>` only when boxes genuinely can't say it: an overlap, a curve, a nesting, a real geometric relationship. Then set a `viewBox`, use `currentColor` or token variables for strokes, and keep it under ~40 elements.

### Object figures (Anatomy)

Some ideas are a mechanism: a level that fills, a threshold, a flow, a leak, a balance, a queue. Draw those as a real object that does the thing. Anatomy (`anatomy/`, MIT) builds them: interactive isometric SVG in a framed card with a live readout. Use it for any topic, not only machines.

| Idea | Object | What moves → readout |
| --- | --- | --- |
| Break-even | Cistern with an overflow spout at the fixed-cost height | Each unit pours in its contribution; the spill is profit |
| Solow steady state | Tank with an investment inlet and a depreciation leak | The level settles where inflow equals the leak |
| Bottleneck | Pipe that narrows | Flow out equals the narrowest section |
| Cache key | Pin-tumbler lock | All pins match → the plug turns, nothing redraws |

**Read `iso/figures.md` before you build one.** It has the full metaphor table, the bridge API and the verify steps. `iso/examples/break-even-cistern.fig.mjs` is a finished build to copy from.

- **Size it first and tell the user.** Figure: 40–80 parts, about 30–90 min, build it. Hero: 80–150 parts, 2–4 h, say so first. Epic: do not start; propose a Hero.
- **One model drives it.** A small pure function gives the readout, the motion and the caption. Label made-up numbers "illustrative".
- **Build in Node, splice into the page.** Keep the build script beside the page as `<slug>.fig.mjs`. It builds the SVG with the kit, wraps it with `figureBlock(...)` and calls `splice(page, id, block)` at an `<!-- iso:<id> -->` marker.
- `splice` inlines the kit, its CSS and `iso/player.js` into `<head>` once. It is safe to rerun.
- **Session follow-ups:** edit the `.fig.mjs` and rerun it. Never hand-edit the spliced block.
- **One lit subject.** Lit is the page `--accent`. The subject can span parts that are the same thing, like water in two vessels; every other part stays neutral. Light theme only.
- **Motion:** `PLAY(root, { stops, draw })` in the live script tours the stops, steers on pointer and keys, pauses on its button or a click on the figure, and stops offscreen. Reduced motion never tours.
- **Verify** with `qa.js`, then:

  ```bash
  node ~/.claude/skills/praghtml/anatomy/scripts/lines.mjs <page.html> --select '#<id> .iso-plate'
  node ~/.claude/skills/praghtml/anatomy/scripts/capture.mjs <page.html> --select '#<id> .iso-plate' --out <png> [--width 390]
  ```

  `lines.mjs` must report 0 floating line ends. Open the captures and look.
- **Update:** `git -C ~/.claude/skills/praghtml/anatomy pull`, then rebuild one figure page. A sparse checkout hides Anatomy's own SKILL.md, so it never shows up as a second skill. Never restore it.

## Motion

One motion layer, in this folder. **Paste inline, never link**: the page must open offline from anywhere.

| File | Mode | What it does |
| --- | --- | --- |
| `motion.css` | all | Tokens, state classes, reveal + play styles, reduced-motion and print blocks. Into `<style>`. |
| `reveal.js` | Reveal | Diagrams enter as they scroll in, children staggered. First screen animates on load. |
| `play.js` | **Play** | Any `data-play` diagram walks itself step by step on a loop. The default for every process diagram. |
| `runner.js` | Runner | Scripted scenes for a fake interface (idea demos). Only when Play can't express it. |
| `iso/player.js` | Object | Tours an object figure's stops on a loop, steers on pointer and keys, pauses on its button or a click. `splice` inlines it with the kit; never paste it by hand. |

Put `<script>document.documentElement.classList.add("js-on")</script>` in `<head>` so nothing flashes.

### Play: the default for every diagram with steps

```html
<div class="diagram" data-play data-ms="1000">
  <ol class="ladder" data-reveal-stagger>
    <li data-step data-say="Agent picks a hypothesis">…</li>
    <li data-step data-ms="1600">…the step that matters, held longer…</li>
  </ol>
  <div class="forks" data-reveal-stagger data-pick>
    <div class="fork keep">…</div><div class="fork drop">…</div>
  </div>
</div>
```

- `data-step` per step, in reading order. `data-pick` on a branch group: one child wins per pass, cycling.
- `data-say` shows a caption under the diagram. Skip it when the step text already says it.
- `data-ms` sets the beat (default 950ms); on a step, holds that one longer. The hero step gets the longest hold.
- The script injects a bar with a live dot, progress beats and Pause. Clicking the diagram also pauses.
- Upcoming steps dim, the current one lifts and rings in `--accent`, finished ones keep an accent trace (ladder spine fills, chain arrows light).
- Chains, ladders, layers, checklists, maps: all of them get Play. Static reference tables don't.

### Idea demos (what ideator used to do)

When the question is "show me how this feature should work", build a small fake interface in a `.diagram` stage and drive it with `runner.js`:

```js
createRunner({
  root: document.getElementById("demo"),
  captionEl: document.getElementById("caption"),
  scenes: [
    { id: "idle",   ms: 450,  caption: "…", apply: (e) => {} },
    { id: "type",   ms: 1000, caption: "…", apply: (e) => e.query.textContent = "Riverside" },
    { id: "filter", ms: 1200, caption: "…", apply: (e) => e.row2.classList.add("is-dim") },
  ],
  reset: (e) => { /* remove every class any scene added */ },
});
```

≤ 7 scenes, one job each. It autostarts on scroll-in and loops, **never a play button**. `reset()` must be total or pass two looks broken. Name real UI, real data.

### Timing and states

`--ease: cubic-bezier(0.22, 1, 0.36, 1)` for everything. `--t-fast` 160ms (state flips), `--t-base` 240ms (default), `--t-reveal` 520ms (structure entering). Holds between beats can be long (950–1600ms); transitions can't.

State classes, same meaning everywhere; scenes add and remove these, never inline styles: `.is-in` entered · `.is-now` current step · `.is-done` passed · `.is-on` active · `.is-dim` pushed back · `.is-pick` the one that matters · `.is-out` leaving · `.is-key` the static hero.

### Non-negotiables

- **Reduced motion is a real path**: Reveal shows everything, Play never starts, Runner plays once fast and stops.
- **Anything that auto-moves is pausable** (WCAG 2.2.2). Don't strip the bar or click-to-hold.
- **Nothing runs off-screen or in a hidden tab.**
- Animate `transform` and `opacity` only in loops. Name transition properties, never `transition: all`.

## Explaining motion

Intended behavior only — **trigger → states → settle**. Always name **interruptibility** and **reduced motion**. Timeline table only with known durations (else describe feel). Optional live demo in `template.html`, driven by `runner.js`.

## Examples

- **Session** — User: `/praghtml how does checkout work?` → create HTML with Big picture + Stack + Q1. User: "what about retries?" → same file, refresh Big picture if needed, add Q2 with diagram. User: "how should the success toast animate?" → add Motion section + Q3.
- **Concept** — "Explain event sourcing" → Big picture chain with Play; Stack omitted.
- **Idea** — "Show me how saved searches should work" → fake search UI driven by `runner.js`, plus a ladder of the flow.
- **Stack** — "What's the stack for this app?" → Stack section is the hero; Big picture shows how layers connect.
- **Mechanism, any topic** — "Explain break-even" → Big picture is an Anatomy cistern: units pour in contribution, the spout sits at fixed costs, the spill is profit. Tables carry the numbers. Reference build: `iso/examples/break-even-cistern.fig.mjs`.

## Anti-patterns

- Chat-only answer / no file update on a follow-up question
- New HTML file per question in the same session
- Skipping Big picture, or letting it go stale after new answers
- Tech explainer with no Stack / "what comes together" view
- Dependency dump (`lodash`, `left-pad`) instead of the real composing pieces
- Mega-diagram mixing structure + sequence + timing
- Generic box names; invented durations
- **Any Mermaid** — a `mermaid` CDN import, a `<pre class="mermaid">`, a sequence diagram with lifelines and numbered bubbles
- A concept defined but never shown — no example, or a placeholder example (`foo`, `a resource`)
- Naming a distinction (A vs B) without explaining what actually separates them
- Diagrams that just sit there: Reveal with no Play reads as "no animation"
- A play button on something that should be playing, or a loop with no Pause
- Linking `motion.css` / `*.js` by `src` instead of inlining
- Grading motion quality; refactoring product code; pasting long summaries into chat
- Sentences past 25 words, paragraphs past 6 sentences, or one thing called by two names
- A claim the reader cannot check: no number, screenshot, source or test beside it
- A full-page screenshot where a ringed crop would show the point
- Calling a page done from a `--window-size=390` render, or without opening the screenshots
- Boxes and arrows drawn in isometric and called an object figure
- An object figure for a static fact, a list or a stack
- A figure readout or motion that does not come from its model
- Hand-editing a spliced `iso:` block instead of rerunning its `.fig.mjs`
