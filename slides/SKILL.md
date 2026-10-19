---
name: slides
description: >-
  Build a presentation as self-contained HTML {HyperText Markup Language}: a
  full-bleed slide deck you drag, swipe, or arrow through, with a section
  progress rail, a jump menu, speaker notes, print-to-PDF, and optional live
  demos that play themselves. Use whenever the user wants slides,
  a deck, a presentation, a readout, a pitch, a project review, a design review,
  a pilot or launch update, a talk, a lunch-and-learn, an all-hands section, or
  says slides / deck / present this / turn this into slides / make me a
  presentation. Domain-agnostic and component-driven: bring your own blocks.
  Themed Opendoor by default. Every run ships two HTML files: the deck, and a
  script page (<slug>-script.html) written as a note to the co-presenter, with
  each slide's image beside its word-for-word script, the speaker split, the
  timing, a practice timer and likely questions. Not for prose documents (use
  html-design) or architecture walkthroughs (use praghtml).
---

# Slides

Ship a **presentation as two HTML files**: the deck, and its script page. No
hosting, no export, no PowerPoint. Open the deck in a browser, press `F`,
present. It drags like an iOS page view, prints to a landscape PDF, and
deep-links to any slide. The script page is what the presenters rehearse from:
every slide beside what to say, who says it and when. See
[The script page](#the-script-page).

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

- **Two outputs, every run.** `<slug>.html` is the deck and
  `<slug>-script.html` is the script page, side by side. Write the script into
  the deck (`data-time` and `<aside class="notes">` on every slide, the talk
  block in the head), then build the page from it:
  `node ~/.claude/skills/slides/scripts/build_script.mjs <slug>.html`. Rebuild
  it after every edit. Never ship the deck alone, and never write the script
  page by hand.
- **Each file is self-contained.** Inline `<style>` and `<script>`. The only
  network requests are the two Opendoor font files. Images, headshots
  included, go in as `data:` URIs, never as relative paths. The builder
  inlines the slide images on the script page the same way.
- **Start from [template.html](template.html)** on the first create — the deck
  engine is 400 lines of spring physics, gesture handling, and pixel-snapping
  that is not worth re-deriving. Copy it, then rewrite the slides.
- **Never paste the whole deck into chat.** Reply = both paths + one-line gist.
- **Every slide is one claim.** If a slide has two claims it is two slides.
- **Path default:** the user's path → else `decks/<slug>.html` in a repo → else
  `./<slug>.html`. The script page always sits next to the deck.

Chat reply shape:

> `decks/paint-pilot.html`: 14 slides in four sections; the intake demo on 8
> plays itself. `F` for full screen, `O` for the jump menu, `N` for the
> script, `P` prints to PDF.
> `decks/paint-pilot-script.html`: the script page, 9:40 total (8:10 at a slow
> 130 words a minute), Sam on slides 1 to 7, Priya on 8 to 14.

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
| **First ask** | Create the file from `template.html`. Write the outline, then build the slides and their script, then build `<slug>-script.html`. |
| **Follow-up** | **Edit the same file** (add, cut, reorder, retitle, retime), then rebuild the script page. |
| **New deck** | Only when asked — new file, new slug. |

Track the active path in the head, as the template already does:

```html
<meta name="slides-file" content="decks/paint-pilot.html">
<meta name="slides-session" content="active">
```

## Workflow

### 1 · Pin the deck (before any markup)

Five things, out loud, in one short block:

1. **The claim** — the one sentence the audience leaves with.
2. **The audience** — and what they can decide. A deck for a director is a
   different deck from one for the team that will maintain it.
3. **The ask** — what you need from them. A deck with no ask is a document.
4. **The length** — minutes, which sets slide count (see below).
5. **The speakers.** Who presents which part, and who the script page is
   addressed to (the co-presenter's first name). A solo talk has one speaker
   and no "to".

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
7. **Script.** On every slide, set `data-time` (seconds) and write the
   word-for-word script in its `<aside class="notes">`. Fill the talk block in
   the head. Rules in [The script page](#the-script-page).
8. **Build the script page.**
   `node ~/.claude/skills/slides/scripts/build_script.mjs <slug>.html`. Read
   every warning it prints and fix the deck, then rebuild.

Per-slide markup contract:

```html
<section class="slide" data-section="2" data-title="Two real orders" data-time="30">
  <p class="label"><i>2.1</i>What this slide shows</p>
  <!-- one component -->
  <p class="cap"><b>The takeaway.</b> What to do with what you just saw.</p>
  <aside class="notes" data-speaker="Alex" data-sources="Pilot log, Sept 2026">Word-for-word script for this slide.</aside>
</section>
```

| Attribute | Why |
| --- | --- |
| `data-section="N"` | Groups it. `"0"` is the overview run (cover, contents). |
| `data-section-name="2 · What shipped"` | Once per section, on its opener. |
| `data-title="…"` | The jump-menu label. Falls back to the first heading. |
| `data-time="30"` | Seconds this slide gets. Sets the script page timing and the `N` panel clock. |
| `data-time="0"` or `data-backup` | A backup slide: shown on the script page, untimed, only pulled up if asked. |
| `<aside class="notes">` | The script, word for word. Hidden on the slide; `N` shows it. Use `<p>` for paragraphs. |
| `data-speaker="Alex"` | Who says it. Drives the split, the colours and the filters on the script page. |
| `data-sources="…"` | Where the slide's numbers come from. Printed under the script. |
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
- **Swapped an icon bubble for a photo?** Give the photo the bubble's outer
  size (`box-sizing:border-box`, ring included). A taller attribution row
  shrinks its column's card and the row of cards drifts out of line.
- **Links on blue cards.** The global link colour is the accent, which vanishes
  on `--blue`. Set `--mint-pale` on any link that sits on a blue fill.
- **Renamed someone or something?** Grep the deck, the speaker notes and the
  script for the old stand-in ("the owner", "a client", the old name) and fix
  every hit.
- **Speaker notes (`N`).** On two or three slides, the panel shows the right
  speaker, the slot and the script. `T` restarts the clock.
- **The script page.** Open it. It starts "Hey <name>," for a shared talk, the
  split bullets have the right slide ranges and times, the handover quotes the
  right two lines, every card has its slide image, the "<name> only" filter
  hides the other speaker, and the practice button opens the timer. The build
  must finish with no warnings, and the slow 130 words a minute total must
  land under the limit.

### 5 · Stop

Both paths + gist. Stay ready to cut a slide, retime a demo, or add a section,
and rebuild the script page after each change. Do not expand into a written
report unless asked.

## The script page

The second output. It is the note we sent Alex with the Shopify in Brazil
deck (a strategy course, Session 5), and the user wants
exactly that shape every time. The builder writes it from the deck alone, so
the deck and the script never drift.

```bash
node ~/.claude/skills/slides/scripts/build_script.mjs decks/shopify-brazil.html
# writes decks/shopify-brazil-script.html; slide images come from headless Chrome
```

Options: `--out <file>`; `--images <dir>` uses existing renders (a PPTX render,
say) in natural sort order; `--no-images`; `--allow-em-dash`. It needs Node 18
or later, plus Chrome for the images (`CHROME=/path` picks another browser;
a wrong path warns and falls back to the installed one).

For a shared talk, fill `to`, `me`, `from`, `speakers` (the topics),
`provenance` and `qa` in the talk block. The build warns when a shared talk
is missing `speakers` topics or `provenance`, because the page then drifts
from the note below. With those filled, the page reads like this:

```text
COURSE NAME · SESSION 5 · DAY, DATE
Shopify in Brazil: script and slides

Hey Alex,
Here are the slides and the script for our Shopify in Brazil presentation.
Touch up whatever you want, especially your half.

What's attached
- shopify-brazil.html is the deck. Open it in a browser and press F for full
  screen. Each slide has its script in the speaker notes: press N to show
  them with a talk clock.
- shopify-brazil-script.html shows every slide next to its script and timing.
  Open it in a browser on your laptop. It has an "Alex only" filter and a
  practice mode with a 30 second timer.

How we're splitting it
18 slides at 30 seconds each, so 9 minutes total, which leaves 1 minute for
questions.
- Me, slides 1 to 10 (0:00 to 5:00): the cover and our recommendation, ...
- You, slides 11 to 18 (5:00 to 9:00): taxes and getting profits home, ...
- Slide 19 is a backup slide (Key sources). Only pull it up if someone asks.
  The likely questions are at the bottom of this page.
The handover is at 5:00. I end slide 10 with "Alex?" and you open slide 11
with "Thanks, Pragalvha."
Everything comes from our first draft, and the script is written to sound like
us talking.

The full script
Each slide is 56 to 71 words, about 30 seconds out loud.
[All slides] [Pragalvha only] [Alex only]    [Practise with a 30-second timer]
Timing at a glance (opens a table)

Slide 1, Me, 0:00 to 0:30: Cover
  [slide image]  Good morning. We're Pragalvha Sharma and Alex Chen, ...
                 Sources: ...  ·  58 words · 30 sec · open in deck
  ...
  5:00 · Pragalvha hands over to Alex
Slide 11, You, 5:00 to 5:30: Taxes and tax reform
  ...
  Backup, shown only if someone asks
Slide 19, backup: Key sources

Likely questions
Q1 Your own licence scores below a small acquisition. Why file for it now?
   It scores third only because it's slow ...

Thanks,
Prag
```

Keep that shape. The headings, the order, the "Me / You" labels, the slide
ranges with clock times and the quoted handover all come from the builder.
Your job is the words in the deck and the talk block. Me / You labels appear
only when two or more people present. Without `to` there is no greeting and
the files heading is "The files". With one speaker the split heading is "How
it's timed" and each card uses the speaker's name.

The page also has: a filter for each speaker, a collapsible timing table,
coloured dividers at each handover, the backup slides grouped at the end
after their own divider, and a dark
practice mode that shows one slide at a time with its own timer (arrows move,
`P` pauses, `Esc` exits; the bar turns orange when a slide runs over).
Clicking a slide image opens that slide in the deck.

### The talk block

A JSON block in the deck's head, `<script type="application/json" id="talk">`.
The template has one. Every field is optional.

| Field | Sets |
| --- | --- |
| `title` | The page title and "our <title> presentation". Default: the deck's `<title>` up to its first `·`. |
| `context` | The eyebrow above the title: course, session, date. |
| `to` | The co-presenter's first name. Turns on "Hey <to>," and labels their slides **You**. |
| `me` | The user's speaker name. Labels their slides **Me**, so the handover reads "I end slide 10 with …". |
| `from`, `signoff` | The sign-off: `signoff` (default "Thanks,") over `from`. No `from`, no sign-off. |
| `intro` | The first paragraph. Default for a shared talk: "Here are the slides and the script for our <title> presentation. Touch up whatever you want, especially your half." |
| `limit_minutes` | The time limit. The page says what it leaves for questions; the build warns if the talk runs over. The `N` clock counts against it. |
| `seconds` | The slot for any slide without `data-time`. |
| `speakers` | `{ "Alex": "taxes, the rivals, and the roadmap." }`: the topics in each split bullet, lower case, as a list. Required for a shared talk; without it the bullet lists slide titles and the build warns. |
| `split_note` | Replaces "which leaves N for questions". |
| `backup_note` | `{ "19": "is a backup sources slide. Only pull it up if someone asks." }` |
| `handover` | Replaces the generated handover sentence. With one handover, "The handover is at 5:00." still goes in front. |
| `provenance` | One line on where the content comes from, after the handover. Required for a shared talk. |
| `files` | Extra attachments: `[{ "name": "deck.pdf", "text": "is the same deck as a PDF." }]` |
| `qa` | `[{ "q": "…", "a": "…" }]`: the Likely questions section. Give three to five. |
| `speaker` | The default `data-speaker` for a solo talk. |

### Writing the script

- **Word for word, in the speaker's voice.** Write it the way they talk:
  contractions, short sentences, numbers said out loud ("about 30,000"). One
  `<aside class="notes">` per slide, `<p>` for paragraphs.
- **Time it at 150 words a minute.** A 30 second slot is 60 to 75 words. Set
  `data-time` on every slide. The build warns above 165 words a minute, and
  prints the total at a slow 130 words a minute, which must still land under
  `limit_minutes`. Re-time after every wording change.
- **Handovers are spoken.** The outgoing speaker's last sentence hands over
  ("Alex?") and the next speaker's first sentence takes it ("Thanks,
  Pragalvha."). The page quotes both lines, so make them worth quoting.
- **Backups go after the closer**, with `data-time="0"`. The page lists them
  at the end even if one sits mid-deck. Put the likely questions in `qa`, not
  on a slide.
- **No em dashes** (U+2014) in titles, scripts, sources or the talk block. The
  build stops if it finds one. Use a comma, a colon or a full stop.
- **Sources on the aside** (`data-sources`), short: "Draft, p. 3; Central
  Bank, 2025".

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
- **Pictures over paragraphs.** On screen: the claim, a label, one line per
  card, an icon, a photo, a diagram. The long version goes in speaker notes or
  the script. When the user says a slide is too texty, cut words and add a
  visual before you shrink the type.

### Readable output (Karpathy, Oct 2026)

Captions, speaker notes and the presenter script are prose. Write them in
Simplified Technical English at about 80%. The rest of the on-screen text keeps
the rules above.

- **Short, active sentences.** A description is 25 words or fewer, an
  instruction 20. Use simple tenses. Keep "the" and "a". A `.cap` is two
  sentences at most: the takeaway, then what to do with it.
- **One term per thing.** If slide 4 says "intake form", the caption, the
  notes and the script say "intake form" too.
- **Claim first, then a check the audience can run:** the number, its source,
  the screenshot. Full tables and every check go in the speaker notes or an
  appendix slide after the closer.
- **Show change over time with a live demo slide**, one or two per deck. If the
  deck goes out without a presenter, offer a short narrated explainer video
  built with `brag-slim` or Hyperframes.
- **Narration.** ElevenLabs needs the user's API key. Ask before you use it.
  Never print the key. Without a key, use a free local voice (macOS `say`,
  Kokoro or Piper).

### Evidence from people

For pitches, venture concepts and class deliverables, a problem backed only by
statistics reads as a web search. Judges and investors weigh **"we went out and
talked to real people"** far more. Build the problem around a real conversation:

1. **Who.** Name the person, their role and their organisation, with a photo
   when the user supplies one or points to a public profile. Use the
   **person card** from [components.md](components.md#person-card).
2. **What they told you.** Their two or three pain points, under a heading that
   uses their first name ("What Sam told us"), in their terms.
3. **Why it matters.** Your insight, then the market numbers that show how big
   the pain is. The statistics come after the person and support the story.

Rules:

- **Only real conversations.** Name only people the user says were spoken to.
  Label paraphrase as paraphrase in the caption. Never invent a quote, a date
  or a title; take the title from their own profile.
- **One face, used twice.** The large card on the origin slide, then the same
  photo, small, as the attribution on the evidence slide, so the audience
  recognises them.
- **Same name everywhere.** Slides, captions, speaker notes, presenter script.
- **Photos stay small.** Crop square, about 256 px, JPEG around 12 KB, inlined
  as a `data:` URI with alt text of name plus role. Round them with
  `border-radius:50%;object-fit:cover` and a white ring. No drop shadow.

## When the deck ships in more than one format

Class and client work often needs the HTML deck, a PPTX, a PDF and a
presenter script from the same words.

- **One content module is the source of truth.** Every output builds from it:
  short on-screen lines, long speaker notes, per-speaker script lines. Edit it,
  then rebuild **every** output. Never hand-patch one output.
- **Check each render.** Look at the HTML screenshot, the PPTX render and
  the PDF page for every slide you touched. They fail in different ways.
- **PPTX photos are rectangles.** Mask a headshot to a circle before inserting
  it (for example `sharp(img).composite([{ input: circleSvg, blend: "dest-in" }])`)
  and draw a white ellipse behind it for the ring.
- **Presenter script.** The two HTML files still ship, every time. If a PPTX
  is asked for too, put the same script in its speaker notes, render its
  slides, and build the script page from the HTML deck with
  `--images <render dir>` so the cards show the PPTX slides. Add the PPTX and
  PDF to the talk block's `files` so "What's attached" lists them.
- **Say where things stand.** If nothing is built yet, the offer slide says
  so and names the first test. Pre-launch decks never imply traction.
- **Names exactly as the source lists them.** Team, course and company names
  come verbatim from the portal or profile. Don't add a section number or
  suffix the user didn't give.
- **Published decks.** If a push deploys the deck, watch the run, then fetch
  the live URL and grep it for the new words before you report it as done.

## Components

Thirty-three blocks in [components.md](components.md), each a self-contained
CSS + HTML pair. **Take only what the slide needs** — unused CSS is what makes
a deck feel generated.

| Family | Blocks |
| --- | --- |
| **Numbers** | stat grid · big number · scale bars · now/target metric · funnel · line chart |
| **Argument** | two moves · versus · gap tree · steps strip · timeline · layer stack · 2×2 matrix · then-chain · tiers · risk + guardrail · do/don't |
| **Voice** | person card · pull quote · callout bar · definitions · verification list · annotations |
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
| Show who you talked to and what they said | person card |
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
| `N` | Speaker notes: this slide's script, its speaker and slot, and the talk clock against the limit |
| `T` | Restart the talk clock (it starts on the first move) |
| drag / swipe | 1:1 tracking, flick to advance, rubber-band at the ends |
| `#7` in the URL | Deep-links to slide 7 |

## Anti-patterns

- Describing the deck in chat instead of writing the file
- Shipping the deck without its script page, or a slide without its script
- Hand-writing or hand-editing `<slug>-script.html` instead of fixing the deck
  and rebuilding
- Changing the script page's shape: it is the Alex note, every time
- Rebuilding the deck engine instead of copying `template.html`
- Pasting all 33 components' CSS "just in case"
- Hand-maintaining rail segments or a section array — they are derived
- A slide whose content scrolls, because it should have been two slides
- Topic headlines ("Overview", "Background", "Next steps") instead of claims
- A composition with no caption saying what to take from it
- Bullet lists where a table, a stat grid, or two slides belong
- A metric with no provenance, or a target presented as measured
- Market statistics as the only proof of a problem, when the user has a real
  conversation to show
- An anonymous "the owner" or "a customer" when the user has given you the
  person's name
- An image loaded from a relative path, which breaks the one-file deck
- Five live demos — one or two, and only where a flow needs showing
- A second accent colour, a gradient, or a drop shadow
- Bare acronyms
- Handing it over without opening it, printing it, and cutting a slide

## Examples

- `slides for the paint pilot readout, 15 minutes, for ops leadership` → 14
  slides, four sections, one live intake demo, a was/now table, closer with
  three named asks, and `paint-pilot-script.html` beside it
- `deck for our 10 minute class presentation, I do the first half and Alex
  does the rest` → the deck with every slide timed and scripted, the talk
  block with `"to": "Alex"`, then `<slug>-script.html`: "Hey Alex,", the
  split, the handover at 5:00, the full script and likely questions
- `turn this design doc into a deck` → read the doc, outline sections from its
  headings, one claim per slide, code component for the schema
- `a 5-minute lightning talk on why we enumerate instead of guess` → 7 slides,
  two sections, one big number, one versus, one pull quote
- `add a timeline slide before the metrics` → same file, timeline component,
  renumber the labels
- `make slide 8's demo slower on the reveal beat` → same file, bump that
  scene's `ms`
- `put the founder we interviewed on slide 2, with his photo` → same file,
  person card with the headshot inlined, "What <first name> told us" beside
  it, the same face on the evidence slide, and every "the owner" renamed in
  slides, notes and script

## Related skills

| Need | Skill |
| --- | --- |
| A prose document, report, or one-pager | `html-design` |
| How a system works, diagram-first | `praghtml` |
| An interactive product-idea demo | `praghtml` (idea demos) |
| Distinctive visual taste for a non-Opendoor palette | `frontend-design` |
| Charts doing real analytical work | `dataviz` |
| Motion craft decisions | `emil-design-eng`, `apple-design` |
