---
name: slides
description: >-
  Build a presentation as one self-contained HTML {HyperText Markup Language}
  file — a full-bleed slide deck you drag, swipe, or arrow through, with a
  spring-driven track, a section progress rail, a jump menu, print-to-PDF, and
  optional live demos that play themselves. Use whenever the user wants slides,
  a deck, a presentation, a readout, a pitch, a project review, a design review,
  a pilot or launch update, a talk, a lunch-and-learn, an all-hands section, or
  says slides / deck / present this / turn this into slides / make me a
  presentation. Domain-agnostic and component-driven: bring your own blocks.
  Themed Opendoor by default. Not for prose documents (use html-design) or
  architecture walkthroughs (use explainer).
---

# Slides

Ship a **presentation as one HTML file**. No hosting, no export, no
PowerPoint — open it in a browser, press `F`, present. It drags like an iOS
page view, prints to a landscape PDF, and deep-links to any slide.

**Opendoor-themed by default:** ivory paper, one blue, Publico Headline over
Graphik, flat tint fills. Full palette and voice rules in
[theme.md](theme.md); reskinning is a `:root` swap.

**Install note:** canonical copy lives at `~/.claude/skills/slides/`. Symlink
into Codex + Cursor via `bash ~/.claude/skills/slides/sync.sh`.

Composes with **`html-design`** (polish) and **`frontend-design`** (taste), and
with **`dataviz`** when a chart is doing real analytical work. This skill owns
the deck shell, the component library, and the slide-writing rules; don't
restate those skills.

## Non-negotiables

- **One self-contained `.html`.** Inline `<style>` and `<script>`. The only
  network requests are the two Opendoor font files.
- **Start from [template.html](template.html)** on the first create — the deck
  engine is 400 lines of spring physics, gesture handling, and pixel-snapping
  that is not worth re-deriving. Copy it, then rewrite the slides.
- **Never paste the whole deck into chat.** Reply = path + one-line gist.
- **Every slide is one claim.** If a slide has two claims it is two slides.
- **Path default:** the user's path → else `decks/<slug>.html` in a repo → else
  `./<slug>.html`.

Chat reply shape:

> `decks/paint-pilot.html` — 14 slides in four sections; the intake demo on 8
> plays itself. `F` for full screen, `O` for the jump menu, `P` prints to PDF.

## What this is / isn't

| Is | Isn't |
| --- | --- |
| A deck you present from a browser | A prose document (→ `html-design`) |
| One claim per slide, evidenced | A wall of bullets |
| Components chosen per slide | Every component pasted in |
| Live demos that loop, when a flow needs showing | A video, or a static screenshot tour |
| Numbers with provenance | Invented metrics |
| Opendoor-themed | A new palette per deck |

## Session mode

Once invoked, **stay in slides mode** until the user ends it ("new deck",
"start fresh", "stop") or switches to unrelated work.

| Turn | Action |
| --- | --- |
| **First ask** | Create the file from `template.html`. Write the outline, then build the slides. |
| **Follow-up** | **Edit the same file** — add, cut, reorder, retitle, retime. |
| **New deck** | Only when asked — new file, new slug. |

Track the active path in the head, as the template already does:

```html
<meta name="slides-file" content="decks/paint-pilot.html">
<meta name="slides-session" content="active">
```

## Workflow

### 1 · Pin the deck (before any markup)

Four things, out loud, in one short block:

1. **The claim** — the one sentence the audience leaves with.
2. **The audience** — and what they can decide. A deck for a director is a
   different deck from one for the team that will maintain it.
3. **The ask** — what you need from them. A deck with no ask is a document.
4. **The length** — minutes, which sets slide count (see below).

Ask **one** clarifying question, only if the claim or the ask is genuinely
unclear. Otherwise state your reading and build.

### 2 · Outline as sections, then slides

Sections are the deck's spine: **three or four**, each answering one question.
They become the rail segments and the jump-menu groups automatically.

| Length | Slides | Sections |
| --- | --- | --- |
| 5 min | 6–8 | 2 |
| 15 min | 12–16 | 3–4 |
| 30 min | 20–28 | 4–5 |

Write the outline as a table before touching HTML — number, section, claim,
component:

| # | Section | The claim on this slide | Component |
| --- | --- | --- | --- |
| 1 | — | Cover | cover |
| 2 | 1 · The problem | The hard step was never the arithmetic | section opener |
| 3 | 1 | The how-to is fourteen steps; nine are already done | steps strip |
| 4 | 1 | A name is not a code | gap tree |
| 5 | 2 · What shipped | The form outranks the model | section opener |
| 6 | 2 | Two real orders, replayed | schema stage (live) |

Show the user that table if the deck is over ~10 slides. It is far cheaper to
fix an outline than a built deck.

**The shape that works**, for any subject:

```
cover
  ├─ section 1 opener  ·  the problem, as a claim
  │    3–5 evidence slides            ← the size of it, the mechanism, the miss
  ├─ section 2 opener  ·  what you did
  │    3–5 slides                     ← the two moves, what it refuses to do, live demo
  ├─ section 3 opener  ·  how you know
  │    2–4 slides                     ← metrics, was/now, risks + guardrails
  └─ closer            ·  the asks, named
```

### 3 · Build

Copy `template.html` to the target path. Then, in order:

1. **Head** — title, description, `slides-file` meta.
2. **Cover** — the brand lockup with the *project* name, an eyebrow of
   `Opendoor · Team · #channel`, the claim as `h1` with the pivot in `<em>`, the
   contents, and the by-line.
3. **Section openers** — `.slide--blue`, with `data-section-name` set **once
   per section**. This is the only place section names are declared; the rail,
   the pill label, and the jump menu all read it.
4. **Content slides** — one component each, from
   [components.md](components.md). Paste that component's CSS at the end of the
   last `<style>` block, its markup into `.track`.
5. **Closer** — the asks, named, with who decides.
6. **Cut.** Then cut again. A 14-slide deck that was 20 is a better deck.

Per-slide markup contract:

```html
<section class="slide" data-section="2" data-title="Two real orders">
  <p class="label"><i>2.1</i>What this slide shows</p>
  <!-- one component -->
  <p class="cap"><b>The takeaway.</b> What to do with what you just saw.</p>
</section>
```

| Attribute | Why |
| --- | --- |
| `data-section="N"` | Groups it. `"0"` is the overview run (cover, contents). |
| `data-section-name="2 · What shipped"` | Once per section, on its opener. |
| `data-title="…"` | The jump-menu label. Falls back to the first heading. |
| `class="slide--blue"` | Openers, statements, the closer. Roughly 1 in 3–4. |
| `class="slide--center"` | One statement, nothing else. |
| `class="slide--diag"` | One full-stage composition; centres it and lines up the label and caption with it. |

### 4 · Verify before you hand it over

Not optional — these are the things that are wrong in a generated deck:

- **Open it.** Arrow through every slide. Anything that scrolls inside a slide
  is over-full: cut it or split it.
- **Full screen (`F`) at 16:9.** The deck scales off the tighter viewport
  dimension, so a short window and a tall one differ.
- **Print preview (`P`).** Every slide one landscape page, colour intact,
  every revealed state in its finished form.
- **Jump menu (`O`).** Section names right, no `Section 3` fallback left over,
  every title readable out of context.
- **Read the captions alone.** They should tell the whole argument. If they
  don't, the slides are decorative.
- **Grep your own CSS.** Any component block you pasted but did not use, delete.

### 5 · Stop

Path + gist. Stay ready to cut a slide, retime a demo, or add a section. Do not
expand into a written report unless asked.

## Slide-writing rules

- **A slide is a claim plus its evidence.** Not a topic and some bullets.
- **The headline states the finding.** "Volume tripled and the median never
  moved" — not "Volume analysis".
- **One `<em>` per headline** for the pivot. It turns the accent colour.
- **Bold the figure, not the sentence.**
- **Every composition gets a `.cap`.** Say what to take from it.
- **Numbers carry provenance** — where, when, how many. See
  [theme.md](theme.md#voice).
- **Never invent a metric.** Targets are labelled as targets; assumptions get
  the peach tint and are named.
- **Six words a line, six lines a slide**, as a smell test, not a law. The
  statement slides break it deliberately, in the other direction.
- **No acronyms.** If unavoidable, spell it out in braces the first time.
- **No bullet lists of more than four items.** Five facts is a table, a stat
  grid, or two slides.

## Components

Thirty-two blocks in [components.md](components.md), each a self-contained
CSS + HTML pair. **Take only what the slide needs** — unused CSS is what makes
a deck feel generated.

| Family | Blocks |
| --- | --- |
| **Numbers** | stat grid · big number · scale bars · now/target metric · funnel · line chart |
| **Argument** | two moves · versus · gap tree · steps strip · timeline · layer stack · 2×2 matrix · then-chain · tiers · risk + guardrail · do/don't |
| **Voice** | pull quote · callout bar · definitions · verification list · annotations |
| **Reference** | table · was/now · spec table · code |
| **Media** | screenshot frame · split media · legend key |
| **Live** | message mock · schema stage · flow diagram |

Always available from the template itself: cover, section opener, statement,
`.cols c2/c3/c4` + `.item`, `.tint`, `.chips`, `.toc`, `.section-split`,
`.callout`-free captions, and the demo chrome.

**Choosing one:** what is the slide's *job*?

| Job | Reach for |
| --- | --- |
| Establish the size of the thing | stat grid, big number |
| Show one quantity dwarfing another | scale bars |
| Show a trend | line chart |
| Show a number narrowing | funnel |
| Show a process | steps strip, timeline, flow diagram |
| Show what sits on what | layer stack |
| Show one input going wrong three ways | gap tree |
| Put two options in opposition | versus, do/don't |
| Show a decision space | 2×2 matrix |
| Name a closed vocabulary | tiers |
| Prove it works on real cases | was/now, message mock |
| Show a flow moving | schema stage, flow diagram |
| Make the argument in someone's words | pull quote |
| Land one unmissable sentence | callout bar |
| Make the deck checkable | verification list |

**Nothing fits?** Build it in the same idiom — the ten rules under
[Writing a new component](components.md#writing-a-new-component). Genuinely
reusable blocks should be added back to `components.md`.

## Live demo slides

A slide that *plays itself*. Use for at most **one or two** slides in a deck,
where a flow needs showing rather than describing.

The engine is already in the template. It gives you, free:

- **No play button.** It starts when its slide arrives, loops, holds the payoff
  frame, rewinds gently, runs again.
- Pauses off-slide and on a hidden tab; resumes on return.
- **Pause** + **Restart**, and clicking the stage holds a frame (WCAG 2.2.2:
  anything that auto-moves must be pausable).
- Scenario chips (`data-scenario`) for two or three paths.
- `prefers-reduced-motion`: plays once, fast, then stops.
- Printing captures the payoff frame, not whatever beat it was on.

To wire one:

1. Paste a stage from [components.md](components.md#live) — or build your own
   inside `.stage`, marking every element the runner touches with
   `data-el="name"`.
2. Give the `.demo` an `id`.
3. Call `createDemo({ root:'<id>', first:'<scenario>', build: fn })` at the
   bottom of the script, where `build(el)` returns `{ reset, scenes }`.

Scene-writing rules:

- **Write the setters first**, then scenes that only call setters. A scene with
  DOM code in it is a scene you cannot retime.
- **One job per scene.** 4–7 scenes. `ms` between 500 and 1800 — long enough to
  read the caption.
- **The hero beat is the one that reveals the mechanism**, and it gets the
  longest hold.
- **`apply` must be idempotent**, because print calls every scene in sequence.
- **Scene 0 is always `reset`.**
- Captions are what the viewer should notice, present tense.

## Keys the audience gets

| Key | Does |
| --- | --- |
| `→` `space` `enter` `PageDown` | Next |
| `←` `backspace` `PageUp` | Previous |
| `Home` `End` | First / last |
| `F` | Full screen |
| `O` | Jump menu (or tap the counter); `Esc` closes |
| `P` | Print to PDF |
| drag / swipe | 1:1 tracking, flick to advance, rubber-band at the ends |
| `#7` in the URL | Deep-links to slide 7 |

## Anti-patterns

- Describing the deck in chat instead of writing the file
- Rebuilding the deck engine instead of copying `template.html`
- Pasting all 32 components' CSS "just in case"
- Hand-maintaining rail segments or a section array — they are derived
- A slide whose content scrolls, because it should have been two slides
- Topic headlines ("Overview", "Background", "Next steps") instead of claims
- A composition with no caption saying what to take from it
- Bullet lists where a table, a stat grid, or two slides belong
- A metric with no provenance, or a target presented as measured
- Five live demos — one or two, and only where a flow needs showing
- A second accent colour, a gradient, or a drop shadow
- Bare acronyms
- Handing it over without opening it, printing it, and cutting a slide

## Examples

- `slides for the paint pilot readout, 15 minutes, for ops leadership` → 14
  slides, four sections, one live intake demo, a was/now table, closer with
  three named asks
- `turn this design doc into a deck` → read the doc, outline sections from its
  headings, one claim per slide, code component for the schema
- `a 5-minute lightning talk on why we enumerate instead of guess` → 7 slides,
  two sections, one big number, one versus, one pull quote
- `add a timeline slide before the metrics` → same file, timeline component,
  renumber the labels
- `make slide 8's demo slower on the reveal beat` → same file, bump that
  scene's `ms`

## Related skills

| Need | Skill |
| --- | --- |
| A prose document, report, or one-pager | `html-design` |
| How a system works, diagram-first | `explainer` |
| An interactive product-idea demo | `ideator` |
| Distinctive visual taste for a non-Opendoor palette | `frontend-design` |
| Charts doing real analytical work | `dataviz` |
| Motion craft decisions | `emil-design-eng`, `apple-design` |
