---
name: ivey-case-prep
description: >-
  Builds a single self-contained HTML prep page for one Ivey HBA session, case,
  or problem set — diagram-first, example-driven, with every assigned question
  worked end to end. Pulls from the School repo (Canvas README, casebook PDF,
  problem-set PDF, session summaries), solves the numbers by hand, then publishes
  as an Artifact and files the HTML into the course's notes/ folder. Use when the
  user pastes Canvas page text, drops a case or problem-set PDF, or asks to prep,
  study, or "make me an HTML" for a class, session, case, or assignment.
  Composes with the praghtml skill for diagram craft and motion.
---

# Ivey Case Prep

One session → one HTML page that contains **everything needed to walk into class**: the concepts as diagrams, the assigned questions worked out, the traps, and the source materials filed in the repo.

Inherits the **`praghtml`** skill's diagram-first stance and its *Always ground it in an example* rule. Praghtml owns diagram craft; this skill owns the Ivey workflow, the page IA, and the answer standard. Don't restate praghtml — load it when a diagram needs real thought.

## Non-negotiables

1. **Ship HTML.** A chat-only answer is a failed run. Chat reply = artifact link + what's on the page.
2. **Reproduce every question as it was set**, before the answer. Verbatim wording, the given data as a figure block, and the numbered *Required:* parts. The page must stand alone without the PDF open beside it.
3. **Show the process, not just the answer.** Every calculation gets numbered steps: what you're doing, why, the arithmetic written out longhand, and what the result means. A correct answer with no visible working teaches nothing and earns nothing.
4. **Solve every assigned question completely** before writing a line of HTML. Partial answers are worse than none — the user takes these into class.
5. **Lead with diagrams, but do not go thin.** Diagrams replace *paragraphs*, not *content*. Every concept keeps its reasoning; it just opens with a picture. **Completeness is not a licence for length.** See *Density and motion*. If a point takes 200 words, it needed a diagram and 40.
6. **Every concept carries a concrete example** with real numbers. See praghtml's example rule.
7. **Never pass off invented figures as sourced.** Numbers from the problem set are stated as fact; anything you made up to illustrate is labelled *illustrative*.
8. **Footer disclaimer, always:** worked solutions are the user's own, check against the posted key.
9. **No em dashes.** Not in prose, headings, diagram labels or tables. Use a comma, a colon, a full stop or brackets. En dashes in numeric ranges (`pp. 15–80`, `2009–2021`) are fine.
10. **Plain words.** Write it the way you would say it out loud. Where a term is real course vocabulary that earns marks in class (institutional void, contribution margin, universalist), keep the term and put the plain version right beside it. Diagram labels are the worst offenders: name the actual choice (`Who you know`, `Pay someone off`), not the abstract category (`Relationship substitutes`, `Illegal substitutes`).

## Where things live

```
~/Documents/PragPersonal/School/
  README.md                            ← course index, Canvas IDs, tool coverage
  <code>-<Course-Name>/
    README.md                          ← Canvas scrape: syllabus, assignments, module tree
    COURSE-OUTLINE.md                  ← if Ivey published it
    SESSION-SUMMARY.md                 ← if the Session Summary LTI exists
    canvas-export.json                 ← raw Canvas data
    cases/                             ← casebook + case PDFs
    assignments/                       ← problem sets, handouts
    notes/                             ← the pages this skill writes
```

**Page path:** `<course-dir>/notes/session-<n>-<slug>.html`. For a single case rather than a session: `notes/case-<slug>.html`.

**Filing rule:** any PDF the user hands over gets copied into the course dir first — casebooks and cases into `cases/`, problem sets and handouts into `assignments/`. Do this before building the page, and list the paths on the page.

## Workflow

### 1 · Gather

| Source | How |
| --- | --- |
| Canvas page text | The user usually pastes it — it carries the module sequence, quiz questions and reading refs |
| Course README | `<course-dir>/README.md` — instructor, module tree, assignment list, Canvas links |
| Problem set / case PDF | `pdftotext -layout file.pdf -` (usually in `~/Downloads`) |
| Casebook | `pdftotext -layout` the first pages for the table of contents; map cases to sessions |
| Screenshots in the quiz | Canvas quizzes reference `Screenshot ....png` — the data is in the problem-set PDF instead; go there |

Canvas quiz text often arrives with **the user's own answers already filled in** for some questions and blank for others. Treat filled answers as their attempt: confirm or correct them explicitly, don't silently overwrite.

### 2 · Solve

Work every question **before** writing HTML. Show the arithmetic on the page, not just the result.

- Cross-foot every allocation table — columns must re-add to the stated total.
- State the assumption when the question is ambiguous (FIFO for inventory, which season a month falls in, whether a shared asset counts as traceable).
- Where two answers are defensible, give the one you'd write **and** name the other in a note.
- Journal entries balance and the totals row proves it.

### 3 · Build

Start from `template.html` in this skill folder. It carries the design system and one worked instance of every component.

### 4 · Publish

Publish as an Artifact (favicon 📒 for accounting, pick per subject), keep the same file path across revisions so the URL is stable, and reply with the link plus a short list of what's on the page.

### 5 · Session mode

Stay in this skill for follow-ups. A new question appends to the **Q&A log** at the bottom of the *same* file, newest first — diagram, then answer, then an example. New session or new case → new file.

## Page IA

| Section | Required | Contents |
| --- | --- | --- |
| Masthead | Yes | Course code, module/session, title, one-line gist, meta block: reading pages, problems, graded or not |
| Contents rail | Yes | Sticky left rail, grouped Start here / Concepts / Questions / Reference, numbered to match headings, a dot marking interactive sections, scroll-spy highlight. Folds to pills under 960px |
| Big picture | Yes | One diagram of the session's whole mental model, ≤12 nodes |
| Building blocks | Yes | Every concept the page later leans on, defined once, up front, grouped into families. See *The building blocks section* |
| Concept sections | Yes | Numbered `1 ·`, `2 ·`… — numbering here is real, it's the order to learn them in. Each opens with an **In one line** plain-English box, then diagram → short lede → examples table or example strip → the edge case |
| Interactive model | If a decision has a break-even | Editable inputs + a live chart. Label defaults as illustrative |
| Practice / quiz answers | If assigned | Every question, answered, with a *why* column. Global "quiz me" toggle hides them behind reveal buttons |
| Worked problems | If assigned | Question as set → numbered working → answer tables. See *Every problem gets three blocks* |
| Glossary | If the session is jargon-heavy | Plain-English table; explicitly flatten synonyms (`cost driver = allocation base = proxy`) |
| Traps | Yes | One-line table: the mistake → what to do instead |
| Formula sheet | If quantitative | Two-column table, mono numerals |
| Materials | Yes | Repo paths + relevant casebook page numbers + Canvas links |
| Q&A log | Yes | Seeded with one real question; follow-ups append |

Section numbering tracks **learning order**, not importance. If the content isn't a sequence, don't number it.

## The building blocks section

Sits directly after the big picture, before the numbered concept sections. **One place where every idea the rest of the page uses gets defined**, so a reader who has not done the reading can still follow section 7. Without it the numbered sections each quietly assume four terms the reader has not met, and the page only works for someone who already knows it.

It is **not** the glossary. The glossary at the bottom is a revision list: term, plain words, one line each. The building blocks section is the actual teaching, and it does four things for every block:

| Part | Content |
| --- | --- |
| **Name** | The real term, the one that earns marks |
| **In plain words** | One sentence a first-year would follow. No other course term inside it |
| **The anchor** | A formula, a number, or a five-word example. Something concrete, never another abstraction |
| **Where it's used** | A link forward to the numbered section that needs it, `used in §4` |

**Group the blocks into three to five families and name the families as a sequence** — what gets counted, how the count is adjusted, what the count is compared against, what the count is not. The families are the argument. A flat alphabetical list of twelve terms is a glossary that moved up the page and helps nobody.

Open the section with a **stack diagram**: the families as layers, base to top, so the reader sees that later ideas rest on earlier ones. Then the blocks themselves as a grid, grouped under family headings.

Rules that keep it from turning into a wall:

- **A block is at most 45 words including the anchor.** If it needs more, it is a numbered concept section, not a block.
- **Every block carries its anchor.** A definition with no number, formula or named example is the one thing this section exists to prevent.
- **Cover every term the page later uses without explaining.** Write the page first, then sweep it for terms and check each one appears here. A term used in section 7 and defined nowhere is the failure mode.
- **Do not duplicate the numbered sections.** The block says what the thing *is*. The numbered section says what it *does*, why it matters and where it breaks.
- Eight to eighteen blocks for a normal session. A definitions-heavy one covering two readings can justify more, but past about twenty-four you are transcribing the reading rather than sweeping the page. Fewer than eight means you have not swept it at all.

## Every problem gets three blocks, in this order

Never collapse them. The order is the point: the reader should be able to attempt the question, then check their method, then check their number.

**1 · The question, as set** — a dashed-border block. Verbatim wording, the given data in a `<pre class="given">` figure block laid out like the original table, and the *Required:* parts as an `<ol type="a">`. Copy from the PDF via `pdftotext -layout`; do not paraphrase and do not silently fix the source's typos.

**2 · Working it through** — numbered `.step` rows. Each step is:

| Part | Content |
| --- | --- |
| Heading | The *move*, in plain words — "Read off the base, then divide", not "Part (a)" |
| One or two sentences | Why this step, and the trap in it |
| `<pre class="math">` | The arithmetic **written out longhand** |
| Closing line | What the number means, when it isn't obvious |

**3 · The answers** — the clean tables, for revision at a glance.

### Writing the maths longhand

Maths goes in a monospace block laid out the way you'd write it on paper — never as a sentence with numbers in it, and never as a bare result.

- Name the formula in words on the first line, then substitute, then resolve. Three lines, aligned on `=`.
- Right-align figures in a column; rule under a column before its subtotal (`───────`).
- Wrap the answer in `<b>` so the eye lands on it.
- Use `<i>` for a quiet aside on the same line — `✓ balances`, `✓ matches the pool`, `(not 100 — B&G's own 10 is out)`.
- Real symbols: `×  ÷  →  ≈  ─`. Not `*`, `/`, `->`.
- Show a denominator being *built* when the question turns on it: `Base = 30 + 25 + 20 + 15 = 90`.
- Where two routes reach the same number, show both — it proves the model rather than the arithmetic.

```
Rate = Budgeted production overhead  ÷  Budgeted direct labour
     = $135,000  ÷  $90,000
     = <b>1.50, i.e. 150% of direct labour cost</b>
```

Journal entries are laid out as they'd be written, credits indented, with a totals line proving the balance.

## The answer standard

What separates a page that earns marks from a page that lists facts:

| Do | Example |
| --- | --- |
| Show the arithmetic inline | `135,000 ÷ 90,000 = 150% of DL$` |
| Name the assumption | "December is in the busy season, so under FIFO every case in inventory is at $12" |
| Give the check | "The three columns must re-add to $73,910" |
| Say what the marker is testing | "The marker is checking you noticed which season December falls in, not that you can multiply" |
| Flag the defensible alternative | "Either gas answer works — marks come from naming the cost object" |
| Contrast the method not chosen | Run the direct method too and show the $24,500 it moves |
| Connect forward | "Same critique that opens the ABC module" |

For an essay question with a word limit, write **to** the limit and show a live word count on the page.

## Density and motion, the rule that overrides "be thorough"

A page that is correct and unreadable has failed. The reader is a student skimming twenty minutes before class, not someone reading an essay. Default to the shortest form that carries the idea.

### Word budgets per component. These are caps, not targets.

| Component | Cap | If you exceed it |
| --- | --- | --- |
| `.oneline` "In one line" | 35 words | Cut the qualifier. |
| `.lede` under a heading | 45 words | Split it, or turn it into a diagram. |
| A **table cell** | **12 words** | You are writing prose in a grid. Make it a fragment. |
| `.note` | 40 words | Two notes, or one diagram. |
| `figcaption` | 25 words | The diagram is not doing its job. |
| A card body | 30 words | Fragments and a number. |
| Step prose in a worked problem | 40 words | The maths block should carry it. |

**Table cells are fragments, not sentences.** `Fixed for a period, updated every year or two`, not `The basket is fixed for a period of time and is then updated every year or two by the agency.` Drop articles and auxiliaries. No cell gets two sentences. A table whose cells are paragraphs should have been cards, a diagram, or a list.

### Every section earns one visual

Concept sections open with a diagram, chart, meter, or interactive, before the prose rather than after it. A section with no visual means either you have not found the picture, or it should not be its own section. Whole-page rule: **at least one visual per 300 words of body copy.** Past that ratio you are writing an essay.

### Numbers get rendered, not typed

A figure that matters gets a `.stat` tile, a bar whose length means something, or a position on a scale. Numbers buried in a sentence are invisible. A comparison between two numbers is a chart, never a clause.

### Motion, for meaning only

Four behaviours ship in the template. All respect `prefers-reduced-motion`, and all start from a **visible** resting state. Nothing is parked at `opacity: 0` waiting for an observer that may never fire.

| Behaviour | Class | Use for |
| --- | --- | --- |
| Section reveal | `.rv` | A quiet 8px rise on entry. One per screenful at most. |
| Count up | `.count` with `data-to` | A headline figure that deserves a beat. |
| Growing bars | `.bars` inside `.rv` | Bars grow to width on first view, so the ranking lands. |
| Tipping balance | `.tug` | Two opposed forces resolving to a net position. |

Never animate decoratively. A page where things move for the sake of moving reads worse than a static one.

## Diagram patterns that keep recurring

Business-school content is mostly classification, flow, and allocation. These cover nearly all of it, all in the template, all hand-built CSS so they theme cleanly and need no library:

| Pattern | Use for | Component |
| --- | --- | --- |
| **Flow**: boxes and arrows | A process, a cause chain, a decision fork | `.flow.f5` / `.flow.f3` / `.fnode` / `.farr` |
| **Fan**: one source, many targets | Allocation, "this splits into these five" | `.flow.f3` with a `.fstack` on the right |
| **Spectrum**: an ordered scale with a line in it | Favour → workaround → bribe; any "where does it stop being OK" | `.spec` / `.sn` / `.specline` |
| **Labelled bars**: relative magnitudes | CAGE distances, weightings, anything comparative | `.bars` / `.bar` / `.bf` |
| **Two-ended scales**: where two things sit on one axis | Culture dimensions, "us vs them" contrasts | `.scales` / `.scale` / `.dot` |
| **Real charts** | Cost curves, time series, signed bar charts | inline `<svg>` |
| **Stat strip**: three to five big figures | The numbers to walk in knowing | `.stats` / `.stat` / `.count` |
| **Tug of war**: opposed forces, net position | Headwinds vs tailwinds, bull vs bear, cost vs benefit | `.tug` |
| **Scorecard**: claim, two sides, verdict | Any head to head where both sides have a case | `.sc` / `.scrow` |

Plus a **document facsimile** (an itemised bill, an invoice, a journal entry) when the real artifact teaches faster than a definition. A vet bill split direct/indirect explains overhead absorption in one glance.

### Banned outright: auto-laid-out diagram libraries

**Never emit a Mermaid diagram.** No ```mermaid fences, no `<pre class="mermaid">`, no sequence diagrams, no flowcharts, no mindmaps, no graphviz, no any other library that lays itself out. Not in these pages, not as a shortcut, not "just for this one".

They break the same way every time and you cannot see it because you did not lay it out:

- Message labels are drawn **across the lifelines**, so the text and the vertical rules mutually shred each other
- Participant boxes at the bottom get **clipped off** the canvas
- Step-number badges land **on top of** the label they number
- The thing is wider than the column, so the page scrolls sideways or the diagram is squeezed to nothing
- It invites **sentence-length labels**, which is the real failure: `Query hydration, your action sequence, follows, blocks, mutes, seen posts` is a paragraph pretending to be a diagram node

You get none of the control that makes a diagram readable, and you cannot verify it without rendering, which means shipping something broken.

**What to use instead:**

| You wanted | Use |
| --- | --- |
| A sequence diagram: actors exchanging messages over time | `.seq`, a numbered CSS list with a `from → to` column |
| A flowchart or process | `.flow` / `.fnode` / `.farr` |
| A decision tree or fork | `.flow.f3` with a `.fstack` of outcomes |
| A state machine or lifecycle | `.spec` (ordered) or `.flow` (cyclical, with a return arrow drawn in CSS) |
| A real chart: curve, time series, signed bars | hand-written inline `<svg>`, geometry only |

And the label discipline that comes with it: **a diagram label is a fragment, six words or fewer.** `Hydrate the query` not `Query hydration, your action sequence, follows, blocks, mutes, seen posts`. The detail goes in the row's description, the figcaption, or a table underneath. If the label needs a comma, it is not a label.

### The hard rule: never hand-place SVG text

**Box-and-arrow diagrams are CSS (`.flow`), not `<svg>`.** SVG text does not wrap and you cannot measure it while writing, so you are guessing widths. Every guess that runs long silently overflows its box and the viewBox, and it looks broken on the page even though nothing errored. CSS boxes grow to fit their text and reflow on a phone.

Use `<svg>` only where **the geometry is the content**: a cost curve, a time series, a signed bar chart. Keep those labels to a few words, put long explanation in a `<figcaption>` or a table underneath.

**Verify before you publish.** Open the page and check nothing overflows:

```js
// any SVG text past its viewBox, or any box scrolling its own content
document.querySelectorAll('svg.d').forEach(svg=>{const vb=svg.viewBox.baseVal;
  svg.querySelectorAll('text').forEach(t=>{const b=t.getBBox();
    if(b.x+b.width>vb.width-1) console.log('OVERFLOW:',t.textContent)})});
document.querySelectorAll('.fnode,.sn,.bar,.scale').forEach(el=>{
  if(el.scrollWidth>el.clientWidth+2) console.log('OVERFLOW:',el.textContent.slice(0,40))});
document.documentElement.scrollWidth > window.innerWidth && console.log('PAGE SCROLLS SIDEWAYS');
```

Other rules: one idea per diagram; label nodes with the real thing (`Beef tenderloin`, not `Direct material`); one accent colour per diagram.

## Design system

The template ships it. Don't redesign per page — consistency across a term is the point.

- **Ground:** white. Single light theme, `color-scheme: light`. No dark mode (the user asked for white).
- **Palette:** ledger green accent `#1B6B57`, brick `#A33A2C` for credits / fixed / warnings, ochre `#8A6A12` for cautions, neutrals with a slight green bias.
- **Type:** Bitter (headings, slab — reads like a printed workbook), Public Sans (body), IBM Plex Mono (all figures, labels, captions).
- **Numbers:** right-aligned, `tabular-nums`, mono. Totals get a rule above and a doubled rule below — real accounting convention.
- **Semantic colour is fixed:** green = variable / direct / applied / favourable. Brick = fixed / indirect / credit / unfavourable. Keep it consistent across every page in the term.

## Anti-patterns

- Chat-only answer, or a new file for a follow-up question in the same session
- Answering some assigned questions and skipping others
- Jumping to the answer with no visible working, or burying the arithmetic inside a sentence
- Paraphrasing the question instead of reproducing it, so the page needs the PDF beside it
- Prose where a diagram would do, or a diagram with no reasoning behind it
- **Table cells containing sentences.** The most common failure by far. A table is a grid of fragments; paragraphs in cells mean the component is wrong
- **A section with no visual.** If you could not find the picture, you have not understood the point yet
- **Stacked prose cards.** Three or more consecutive text blocks with no chart between them is an essay in a card layout
- A headline number typed into a sentence instead of rendered as a stat tile
- Motion added for decoration rather than to make a quantity or relationship legible
- Abstract classification with no named example
- Invented figures presented as if they came from the case
- Restating the case narrative — the user has the case; they need the analysis
- Dropping the "check against the posted key" disclaimer
- Redesigning the palette or fonts page to page
- Hand-placing `<svg>` `<text>` for a box diagram, then not opening the page to check it fits
- **Emitting a Mermaid diagram of any kind.** Auto-layout puts labels through lifelines, clips the participant boxes, and lets you write a sentence where a six-word fragment belongs
- A diagram label containing a comma, or running past six words
- Em dashes anywhere; jargon in a diagram label or an "In one line" box
