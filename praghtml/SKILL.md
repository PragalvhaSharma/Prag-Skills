---
name: praghtml
description: >-
  Prag's HTML {HyperText Markup Language} pages: diagram-first explainers whose
  diagrams animate themselves on a loop. Explains concepts, architecture,
  stacks, flows, codebases and product ideas as one self-contained .html, with
  hand-built diagrams that assemble on scroll and then walk through their steps
  like a live demo. Once invoked in a conversation, every follow-up question is
  appended into the same file (never chat-only); chat reply is path + one-line
  gist. Use when the user asks to explain something, map a codebase or feature,
  show the stack, walk a flow, show how an idea or feature should work, or make
  any HTML page, or says "how does this work", "explain this", "what's the
  stack", "show me how this should feel", "make it animate", "make me an
  HTML". Replaces the old explainer, animator and ideator skills. Not for
  slide decks (use slides) or production app code.
---

# Praghtml

Turn questions into a living, **visual, moving HTML** page. Get to the point, lead with diagrams, show the **big picture** (and for tech: the **stack** — everything that comes together). Focus on **how things should work**, especially over time.

Composes with **`html-design`** and **`frontend-design`** for polish. Praghtml owns structure, content and motion; load those for look-and-feel. Don't restate them.

**Every page moves.** Diagrams assemble as they scroll in (Reveal), then walk through their steps on a loop (Play): current step lit, upcoming steps dim, a branch picking a different outcome each pass. A page with diagrams that just sit there is unfinished. See *Motion*. Body text never moves.

**The density bar in `html-design` applies here too** — it is a content rule, not a styling one. This user's standing complaint is that these pages come out too verbose. Diagrams **replace** prose, they don't accompany it: ≤2 sentences under each one, tables instead of paragraphs, no preamble, no boilerplate Overview/Conclusion sections, and a subtraction pass before showing. In session mode this matters more each turn — appended Q sections accumulate, so keep every one tight and re-trim the Big picture instead of letting it grow.

**Install note:** Canonical copy lives at `~/.claude/skills/praghtml/`. Symlink into Codex, Cursor and Agents via `bash ~/.claude/skills/praghtml/sync.sh` so one edit updates all of them.

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

### 4 · Stop (per turn)

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

## Diagrams

**Hand-build every diagram in HTML + CSS + inline SVG. No Mermaid. No diagram library, no CDN renderer, no `<pre class="mermaid">`.**

A generated diagram announces that a tool drew it — numbered step bubbles, dotted `alt` frames, yellow sticky notes, acres of dead lane whitespace, labels placed wherever the layout engine felt like. It reads as *output*. A diagram you lay out yourself reads as *a page*. It also costs less: no CDN, no render pass, no layout you can't control, and it prints.

Build everything out of these five primitives. Each is ~20 lines of CSS, defined once in the page's `<style>` and reused.

| Primitive | Use for | Built from |
| --- | --- | --- |
| **Chain** | a flow of 3–6 steps | `<ol>` in flexbox, arrow via `::after` |
| **Layers** | stack, architecture, boundaries | nested `<div>`s; the boundary IS the border |
| **Ladder** | order of events over time | numbered rows, actor chip + what happens |
| **Track** | states / motion over time | a bar with labelled segments |
| **Hero SVG** | when the geometry itself is the point | hand-written `<svg viewBox>` |

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

Reach for a hand-written `<svg>` only when boxes genuinely can't say it: an overlap, a curve, a nesting, a real geometric relationship. Then set a `viewBox`, use `currentColor` or token variables for strokes, and keep it under ~40 elements.

## Motion

One motion layer, in this folder. **Paste inline, never link**: the page must open offline from anywhere.

| File | Mode | What it does |
| --- | --- | --- |
| `motion.css` | all | Tokens, state classes, reveal + play styles, reduced-motion and print blocks. Into `<style>`. |
| `reveal.js` | Reveal | Diagrams enter as they scroll in, children staggered. First screen animates on load. |
| `play.js` | **Play** | Any `data-play` diagram walks itself step by step on a loop. The default for every process diagram. |
| `runner.js` | Runner | Scripted scenes for a fake interface (idea demos). Only when Play can't express it. |

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
