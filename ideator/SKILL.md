---
name: ideator
description: >-
  Turns any product idea or feature into a simple interactive animated
  HTML {HyperText Markup Language} demo that shows how the thing should work in
  action — clickable fake interface, staged scenes, motion. The demo auto-plays
  and loops on its own, so there is never a play button to press. Domain-agnostic:
  interface flows, tools, maps, forms, dashboards, mobile sheets, search,
  checkout, settings — not limited to bots or chat. Use when the user wants an
  idea demo, concept prototype, "show me how this should feel", SimplerSell-style
  project preview, animated walkthrough of something they're about to build, or
  says ideator / idea demo / prototype this flow. Not for architecture explainers
  (use explainer) or shipping product code.
---

# Ideator

Ship a **clickable animated demo** of an idea — a fake product interface that
moves on its own — so you can see the thing before building it. Think
SimplerSell project previews (`projects.simplersell.com/...`) but **one
self-contained HTML {HyperText Markup Language} file**, no hosting, no auth, no
backend.

**The demo plays automatically and loops** the moment it scrolls into view —
there is no "play" button to press. That is the whole feel: a living preview
that is always running.

**Works for any surface** — web apps, mobile sheets, admin tools, maps, forms,
dashboards, search, checkout, settings, chat, whatever the idea is. Pick the
stage that matches the product; never default to a bot/Slack skin unless the
idea *is* a chat/bot experience.

**Install note:** Canonical copy lives at `~/.claude/skills/ideator/`. Symlink
into Codex + Cursor via `bash ~/.claude/skills/ideator/sync.sh`.

Composes with **`frontend-design`** (taste) and **`html-design`** (polish).
Optionally **`emil-design-eng`** / **`apple-design`** when motion should feel
premium. Ideator owns the demo structure and interaction script; don't restate
those skills.

## Non-negotiable: the deliverable is a living demo

A chat-only description of the idea is a **failed run.**

- Write **one self-contained `.html`**. Inline styles + script; a
  Content Delivery Network {CDN} link only if truly needed (prefer none — demos
  should open offline).
- **It must auto-play and loop with no play button.** The demo starts as soon as
  it is on screen and repeats until the viewer pauses it. This is the default
  engine in `template.html` — do **not** reintroduce a "play" gate.
- **Start from `template.html`** in this skill folder on first create — then
  **replace the stage** so it matches *this* idea's product surface.
- **Path default:** user-named path → else `ideas/<slug>.html` in a repo →
  else `./idea-<slug>.html`.
- **Chat reply = path + one-line gist.** No long paste of the flow.

Chat reply shape:
> Open `ideas/smart-filter.html` — it auto-plays on a loop: type → results
> filter → detail opens. Pause or click the stage to hold a frame.

## What this is / isn't

| Is | Isn't |
| --- | --- |
| Fake interface that **auto-plays the happy path on a loop** | Production app / real data / real auth |
| Interactive: pause, restart, click the stage, scenario chips | Static mockup or slide deck |
| 1 focused idea, 3–7 scenes | Full product with nav, settings, edge-case matrix |
| Motion that teaches the flow | Architecture diagrams (→ `explainer`) |
| Plausible copy + placeholder content | Invented metrics presented as real |
| Any product domain | Locked to bots / Slack / one vertical |

## Session mode

Once invoked, **stay in ideator mode** until the user ends it ("new idea",
"start fresh", "stop", or switches to implementation).

| Turn | Action |
| --- | --- |
| **First ask** | Create the file from `template.html`. Retheme + rebuild the stage for the idea. Fill pitch, scenes, scene script. |
| **Follow-up** | **Update the same file** — tweak scenes, timing, copy, add a scenario. |
| **New idea** | Only when asked — new file, new slug. |

Track the active path:

```html
<meta name="ideator-file" content="ideas/smart-filter.html" />
<meta name="ideator-session" content="active" />
```

## Workflow

### 1 · Pin the idea (30 seconds)

Name three things before coding:

1. **Idea** — one sentence ("Filter homes by commute time on the map")
2. **Hero moment** — the one beat that must land ("pins outside 30 min fade out")
3. **Audience** — who watches this (product managers, engineers, designers, or
   yourself)

One clarifying question only if the hero moment is unclear.

### 2 · Storyboard scenes (before pixels)

Write 3–7 scenes as a table. Each scene = one beat of the demo.

| # | Beat | What moves | Duration feel |
| --- | --- | --- | --- |
| 0 | Idle | Stage at rest | — |
| 1 | Trigger | User action starts (type, tap, toggle) | snappy (~200ms) |
| 2 | Work | Loading / intermediate state | short hold |
| 3 | Result | Primary outcome lands | settle (~280ms) |
| 4 | Callout | Caption highlights the insight | fade |

Rules:

- **One job per scene.** Don't cram two revelations into one beat.
- **Hero moment gets the best motion** — everything else stays quieter.
- **The demo runs start-to-finish on a loop.** Order the scenes so they read on
  repeat and the last beat flows back into the first (the engine holds the
  payoff, then rewinds gently before replaying). Optional click hotspots can
  layer a "try it" on top, but the viewer never has to press play.

### 3 · Build the stage

The page has four zones (see `template.html`):

1. **Chrome** — idea name, one-line pitch, optional scenario chips
2. **Stage** — fake product surface shaped like the real thing
3. **Transport** — a "Live" indicator plus **Pause** and **Restart** only; the
   demo runs on its own, so there is no play button
4. **Caption** — live line that updates per scene

Match the **vernacular of the product** — consumer app, admin table, mobile
sheet, map, checkout, settings panel, chat thread, etc. The template's sample
stage is only a starter; **swap it every time**.

### 4 · Animate with purpose

Motion exists to teach the flow, not decorate.

- Default stack: **style transitions + the tiny auto-playing scene runner in the
  script** (in the template). Reach for the Web Animations
  API {Application Programming Interface} only if sequencing needs it.
- Easing: custom ease-out / spring feel — never default `ease` or ease-in for
  interface entrances (see `emil-design-eng` if loaded).
- Interface motions usually **≤ ~300ms**; holds between scenes can be longer so
  the viewer can read.
- **Reduced motion matters more with autoplay.** On
  `prefers-reduced-motion: reduce` the runner plays the sequence once, fast, then
  stops — it never loops or does large travel.
- **Self-managing loop:** the runner pauses when the demo scrolls off-screen or
  the tab is hidden and resumes cleanly on return; Restart and scenario switches
  never leave orphan timers. Keep that behavior when you rebuild the stage —
  only replace the `SCENES` data and `resetStage()`.

### 5 · Stop (per turn)

Open-worthy demo → path + gist. Stay ready to tighten scenes or add a
scenario. Don't auto-expand into production scaffolding.

## Demo patterns (pick the one that fits)

| Pattern | When | Stage shape |
| --- | --- | --- |
| **Form → result** | Search, generators, quotes, wizards | Inputs fill → output appears |
| **List → detail** | Feeds, queues, tables, catalogs | Row highlight → panel / sheet |
| **Map / spatial** | Listings, coverage, logistics | Pins, regions, cards on map |
| **Canvas / editor** | Design tools, builders | Objects place, select, transform |
| **Checkout / steps** | Multi-step flows | Stepper advances, summary updates |
| **Settings / toggle** | Preferences, permissions | Control flips → interface reacts |
| **Before / after** | Copy or layout change | Split or crossfade toggle |
| **Thread / chat** | Messaging, bots, triage only | Messages + status + reply |
| **Cursor puppet** | Multi-click tours | Ghost cursor through hotspots |

Keep the fake interface **recognizable but simplified** — enough chrome to feel
real, not a full recreation of production.

Stage HTML {HyperText Markup Language} recipes + timing cheatsheet:
[patterns.md](patterns.md).

## Scenario chips

If the idea has 2–3 meaningful paths (e.g. "with results" vs "empty state"):

- Chips above the stage switch `data-scenario`
- Each scenario reuses the stage shell with different scene data
- Switching a chip restarts the loop on that path
- Default to the **happy / hero** path on load

Don't build more than **3 scenarios** in v1.

## Copy rules

- Pitch: one line, plain language, no buzzword salad
- Scene captions: what the viewer should notice, present tense
- **No acronyms.** Don't use acronyms in demo copy. If one is genuinely
  unavoidable for the domain, write its full form in braces the first time it
  appears — e.g. `API {Application Programming Interface}`,
  `SLA {Service Level Agreement}` — then keep the rest plain. This skill's own
  writing follows the same rule.
- Fake content must feel real for the domain but **never invent company
  metrics** as if measured
- Buttons say what they do: "Pause", "Restart", "Try empty state" — never a
  "play" button, because the demo is always running

## Examples

- **Filter** — `ideator commute-time filter on the map` → map stage; pins fade
  as the slider moves
- **Checkout** — `ideator one-tap express checkout` → cart → sheet → success
- **Admin table** — `ideator bulk reassign in the ops queue` → rows select →
  assign → toast
- **Mobile sheet** — `ideator share listing from the photo viewer` → sheet
  rises → channel picks → sent
- **Follow-up** — `make the success moment slower` → same file, retune timing

## Anti-patterns

- Chat-only walkthrough with no HTML {HyperText Markup Language} file
- **A "play" button gating the demo** — it must auto-play and loop on its own
- Defaulting every demo to a bot/Slack thread
- Architecture Mermaid dump (that's `explainer`)
- Full app shell with real routing / auth / API {Application Programming Interface} calls
- 15 scenes / 6 scenarios on the first pass
- Motion with no teaching job (idle gradient soup, endless Lottie)
- Bare acronyms in the copy (spell them out; full form in braces if unavoidable)
- Static screenshots only — if nothing moves, it's not an ideator demo
- Pasting the whole storyboard into chat instead of path + gist

## Related skills

| Need | Skill |
| --- | --- |
| Why the system is shaped this way | `explainer` |
| Polish / diagrams in a doc page | `html-design` |
| Distinctive visual taste | `frontend-design` |
| Motion craft decisions | `emil-design-eng`, `apple-design` |
| Turn the idea into a real video | `product-launch-video` / HyperFrames |
