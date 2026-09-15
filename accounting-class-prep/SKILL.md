---
name: accounting-class-prep
description: >-
  Builds the prep page for one Managerial Accounting and Control (4624 MAC)
  class. Every page has the same three parts: Concepts, Case, Problems. The
  case part runs a real analysis, opening with an Issues ladder, then reads
  every exhibit one by one with a screenshot of the exhibit itself next to
  what to do with it. Pulls the case PDF, the exhibit spreadsheet and the
  Canvas case-preparation questions out of the School repo, works the numbers,
  publishes as an Artifact and files the HTML into the course notes folder.
  Use for any 4624 session, case or problem set, and for any other accounting
  case where the exhibits carry the argument.
---

# Accounting Class Prep (4624 MAC)

One class, one page, three parts, always in this order:

```
CONCEPTS   the technique this session teaches, diagram first
CASE       the analysis, opening with Issues and reading every exhibit
PROBLEMS   the problem set, worked end to end
```

All three parts appear on every page. If a session has no case, the Case group
still ships with one line saying so and the Concepts part grows. Never silently
drop a part, because the reader uses the same three anchors every week.

## Load `ivey-case-prep` first

That skill owns the template, the design system, the density caps, the maths
longhand rules, the diagram patterns and the ban on Mermaid and on hand-placed
SVG text. All of it applies here unchanged. This skill only adds three things:
the fixed three-part spine, the case analysis method, and the exhibit workflow.
Do not restate `ivey-case-prep` on the page or in your head. Read it, then read
the rest of this.

## Non-negotiables on top of the inherited ones

1. **The Case part opens with an overview**, so the reader knows what company
   this is before a single number appears. A video overview to watch on the bus,
   the company card, the story in three paragraphs, the four lines of the case's
   own income statement, and who is in the room. See *The overview* below.
2. **Then Issues, and an issue is never a topic.** It is a decision somebody has
   to make. "Should RegionFly cut two more routes" is an issue. "Cost
   allocation" is a topic.
3. **Every issue names the number that settles it.** If no number settles it,
   it is background, so cut it.
4. **The business and industry read is built from first principles**, and it
   lands on an accounting consequence. Start from a physical fact about the
   business that a ten year old would accept, and walk up one step at a time to
   the number that decides the case. No framework, no named model, no jargon
   nouns. See *Writing from first principles* below, because this is the part
   that keeps coming out unreadable.
5. **Every exhibit that matters gets a screenshot with clickable highlights,
   and the read beside it goes deep.** Each point carries its own sub-points,
   each sub-point can light its own patch of the table, and the arithmetic sits
   inside the point rather than somewhere else on the page. A one-line caption
   under a table is not a read.
6. **Diagrams are drawn for this case, not chosen from a shape library.** If a
   route was cancelled it is drawn as a cancelled route, not as a row with a
   zero in it. See *Diagrams for this case*.
7. **The case part carries observations**: things in the numbers nobody else
   will have noticed. See *Observations*.
8. **Look at the screenshot before you write about it.** Render it, open it with
   the Read tool, read the numbers off the image. Never describe an exhibit you
   have only seen through `pdftotext`, whose column alignment lies.
9. **Rebuild the exhibit numbers yourself.** Totals get re-added, the spreadsheet
   version gets compared against the PDF version, and any difference gets said
   out loud on the page.
10. **Any session that allocates overhead gets the rate built, applied,
   cross-footed and then rebuilt on a second base.** Never state a rate. Show the
   division, spread it across the cost objects, prove the column re-adds to the
   pool, then run it again on a different base and show how far the answer
   moved. See *The overhead rate* below.
11. **The case part ends with a recommendation you would actually defend**, with
   the single number that carries it, plus three comments to make in class.
   Contribution is 30% of the grade in this course, so the page has to leave the
   reader with something to say, not only something to know.

## Where things live

```
School/4624-Managerial-Accounting-and-Control/
  README.md                     Canvas scrape: modules, links, instructor
  COURSE-OUTLINE.md             Ivey outline: grading, session list
  session-NN/
    canvas-session-NN-*.html    the session page saved from Canvas
    canvas-case-preparation-*.html   the assigned case questions
    IP_*.pdf                    the case, the readings
    *.xlsx                      the exhibit spreadsheet handed to students
    *problem set*.pdf           the problem set
  notes/
    session-NN-<slug>.html      the page this skill writes
    assets/session-NN-<slug>/   the exhibit screenshots for that page
```

New material the user hands over gets copied into `session-NN/` before you build
anything, and the paths get listed in the Materials section of the page.

## Workflow

### 0 · Send the video off first

Video generation takes several minutes, so start it **before** you read anything,
and let it render while you build the page. Spawn the **`case-video`** agent with
the case PDF path, the course and the session number. It creates the NotebookLM
notebook, adds the case as a source, generates an explainer video, downloads the
mp4 next to the case PDF, and reports back the path and the file size.

Do not wait on it. Carry on gathering and solving. Drop the video into the page
when the agent reports back.

Two things that matter about the prompt it uses, both baked into that agent:

- **The video orients, the page argues.** It is told to cover who the company is,
  what happened to the business, the decision on the table, and what is
  misleading about the numbers, and to give **no recommendation**. A video that
  hands over an answer robs the page of its job.
- **One video per case.** Never a second because the first was slow.

**The 15MB question.** An Artifact publish takes binary files up to 15MB, and
NotebookLM hands back about 35MB for a six minute video, so it will be over.
Do not link out and give up: these are slides with narration and they compress
to nothing. The agent makes a web copy at roughly 240kbps and 15fps, which lands
near 14MB for six minutes and is **visually indistinguishable** from the
original at normal viewing size. Pull the same frame out of both and compare them
if you want to check.

So three files live in the session folder: the original mp4, the web copy that
gets published through `files`, and a poster frame. Never publish a video with no
poster, because it renders as a black rectangle.

If a video is long enough that even the web copy will not fit, keep the local
file, point `<video>` at it so it plays from the repo, and put the notebook link
in the caption of the published version. Say which of the two happened when you
report to the user.

Not every session needs one. A problem-set session does not. A case does.

### 1 · Gather

| Source | How |
| --- | --- |
| Session page and case questions | Strip tags out of `session-NN/canvas-*.html`. The case-preparation page carries the assigned questions verbatim, so use its wording |
| Case text | `pdftotext -layout "session-NN/IP_*.pdf" -` |
| Exhibit spreadsheet | `python3 xlsx_dump.py file.xlsx` (in this skill folder, no dependencies, shows formulas) |
| Exhibit pictures | `python3 exhibit_shots.py case.pdf OUT_DIR` (in this skill folder) |
| Highlight coordinates | `python3 exhibit_boxes.py case.pdf OUT_DIR PAGE "spec" ...` (same folder) |
| Problem set | `pdftotext -layout` and reproduce every question as set |

### 2 · Read the exhibits

This is the part students skip and the part class time is spent on. For each
exhibit, in order:

1. Find it. `pdftotext -layout case.pdf - | grep -n "^Exhibit"` gives the page.
2. Shoot it. `python3 exhibit_shots.py case.pdf notes/assets/<slug>/` renders
   every exhibit page to a trimmed JPG and prints the `<figure>` block. Add
   `--chop-right 130` to shave the sideways Ivey copyright rail, `--chop-bottom`
   to shave the footer, `--pages 5,7` to pick pages by hand.
3. **Open the JPG with the Read tool and look at it.** Read the numbers off the
   picture. This is where alignment errors, footnotes and units get caught.
4. If a spreadsheet version exists, dump it and compare. The spreadsheet often
   has live formulas that show how the case writer built a total, and sometimes
   it has been amended and disagrees with the PDF. Say so if it does.
5. Draw the boxes. Decide which two to four parts of the exhibit carry the
   argument, then get their coordinates from `exhibit_boxes.py` rather than
   guessing:

   ```
   python3 exhibit_boxes.py case.pdf notes/assets/<slug>/ 5 \
     "block:REVENUE..Total Revenue=rev" \
     "row:Total Overhead Costs=oh" \
     "word:$1,262,448=profit" \
     "col:2016=y16"
   ```

   It reads the real text positions out of the PDF with `pdftotext -bbox-layout`,
   maps them through the crop and resize that `exhibit_shots.py` recorded in
   `geometry.json`, and prints the `<button class="hs">` tags with their
   percentages already worked out. Paste them inside `<div class="canvas">`.

   Four kinds of spec: `row:` a whole line, `block:FROM..TO` everything between
   two lines, `word:` just those words, `col:` a column down the table. Add
   `=name` to give the box a name, then give the matching row in the read the
   same `data-mark`, and the two light each other up.

   **Then open the JPG in the browser and check the boxes land.** They are
   computed, not guessed, but a chopped page or an exhibit set in a strange font
   can still drift.

6. Write the read, and go deep. Each point is a `.pt` block with three layers:

   | Layer | What it is |
   | --- | --- |
   | The head | The claim, one sentence, in plain words. This is what the point says |
   | `.sub` lines | The bits within. Each one a fragment, and any of them may carry its own `data-mark` so it lights a smaller patch of the table |
   | `.mini` | The arithmetic, laid out longhand, sitting inside the point rather than in a separate working section |

   Put the maths where the claim is. "Overhead fell more slowly than revenue" is
   a sentence anyone can write. The point only lands when the subtraction is
   under it, so show the two percentages being produced. Mark the trap point
   `class="pt trap"` so it and its box both go red.

   Keep `.mini` lines under about 46 characters or they scroll sideways in the
   narrow column. Put a commentary aside on its own line rather than trailing it
   after the figure.

**Every exhibit in the case gets shown. No exceptions, no skipping.** If the
case has five exhibits, the page has five exhibits, each with its own read. An
exhibit you decided was unimportant is exactly the one the professor opens on,
and "I did not look at that one" is the worst answer available in a case class.
Where an exhibit genuinely carries little, give it one short point saying what is
in it and why it does not change the answer. That is still a read.

Narrative pages are not exhibits and are not shot. Everything labelled *Exhibit*
is.

**What gets a box:** the numbers the argument stands on. Two to four top-level
boxes per exhibit, each of which may carry nested sub-boxes.

**Label the box with the classification, not with a number.** The whole first
module of this course is sorting costs, so a box on a cost is tagged with what
that cost *is*:

| Class | Tag | Colour |
| --- | --- | --- |
| Leaves with the unit | `.hs.vr` "Variable" | green |
| Stays whatever you do | `.hs.fx` "Fixed" | brick |
| Both, needs splitting | `.hs.mx` "Mixed" | ochre |

The matching `.pt` point carries the same class, so the tag on the exhibit and
the point beside it light up in the same colour. This is fixed for the whole
term: green always means it leaves with the unit, brick always means it stays.

**Argue every classification from two things**, and put both on the page: what
the account description says the money buys, and **how the account actually
moved** when volume moved. Those two disagree more often than students expect.
RegionFly's flight support account describes crew who are "not assigned to a
particular route", which reads fixed, and then falls 31.6% when flying falls 27%,
which is not fixed at all. The second test is the one that settles it, and almost
nobody in the room will have run it.

**Where they go:** `notes/assets/session-NN-<slug>/exhibit-N.jpg`, referenced
from the HTML as `assets/session-NN-<slug>/exhibit-N.jpg`, and passed to the
Artifact tool through `files` so the published page shows them. Do not inline
them as base64, because three exhibits is most of a megabyte of data URI.

### 3 · Build the Case part, in this order

| Block | Contents |
| --- | --- |
| Overview | `.vid` video overview, `.brief` company card and the story, `.pnl` the four lines, `.cast` who is in the room |
| The decision on the table | `.dec` strip: who decides, the call, by when, the binding constraint |
| Issues | `.issues` ladder, three levels: the immediate decision, the accounting problem underneath it, the thing behind that. Each row names what settles it |
| Business and industry | `.chain` earnings chain, `.mix` cost-structure bar, `.ind` four industry facts, `.ksf` success factors with how the company scores, `.sowhat` bridge to the number that matters |
| Exhibit reads | One `.exread` per exhibit: sticky screenshot left, `.pt` points right, each with `.sub` lines and `.mini` working |
| Observations | `.obs`: four to six things you noticed in the numbers, each with its evidence |
| The numbers rebuilt | The analysis the issues asked for, worked longhand per `ivey-case-prep` |
| Overhead rate | If anything is allocated: `.rateline`, the longhand, `.choice`, the allocation table, `.swap`, and a `.sowhat` |
| Assigned questions | Every case-preparation question, verbatim, answered |
| Alternatives | Two or three real options, each with its number, and why the others lose |
| Where I land | `.rec` block: the call, the because, the one number that carries it |
| What to say in class | `.say` cards: an opening, a response to the obvious counter, a closing that ties to a prior session |

The Issues ladder is the spine of the whole part. Write it first, then check that
every later block serves one of its rows. Anything that serves none comes out.

#### The overview

The reader may be opening this cold, twenty minutes before class, having skimmed
the case on a bus. Tell them who this is first.

**`.vid`, the video.** Embedded top of the Case part, with a short list of what
it covers beside it and a line saying it was machine generated from the case PDF
and gives no recommendation. Label it with its running time so the reader knows
what they are committing to.

**`.brief`, left half: the company card.** Name, one line on what they sell and
where, then a fact rail of six figures at most. Size, age, ownership, and when
the case is set. Every figure comes from the case.

**`.brief`, right half: the story, in three paragraphs.**

| Paragraph | What it does |
| --- | --- |
| 1 | Who they are and how they got here. The history only as far as it explains the present |
| 2 | What just happened, and what is now being asked. End on the deadline |
| 3 | Why it is hard, which is almost always that the numbers available do not answer the question asked |

Write it the way you would tell a friend what the case is about. No case-writer
prose, no restating the opening scene, no quoting the protagonist's sigh.

**`.pnl`, the four lines the case is built on.** Every MAC case has an income
statement underneath it, and in this course it is almost always the same four
rows: revenue, the costs that leave with the unit, overhead, and what is left.
Lay them out as the subtraction they are, with a bar for each row's share of
revenue and the change over the period on the right.

The teaching is in reading the change column downwards. For RegionFly: fares
−30.6%, variable costs −28.8%, overhead only −19.2%, and profit **−44.9%**.
Profit falls fastest because the middle row shrank with the business and the
third row did not. Put that sentence under the table. Every question in a MAC
case is about one of those four rows, or about the line between two of them.

**`.cast`, who is in the room.** Two to four people or groups. Name, role, and
one line on what that person actually wants, because the tension between those
wants is usually the case. The cost system's owner and the person who has to act
on its numbers being different people is the whole story in most MAC cases.

The overview is orientation, not analysis. No recommendation, no working, and no
number that has not appeared in the case. Everything on it should be checkable
against page one.

#### Writing from first principles

Business and industry is the part that keeps coming out as a wall of framework
boxes nobody can read. The fix is not smaller text or fewer words. It is
**building the idea from the bottom**, so each sentence is obvious once you have
read the one before it.

Four blocks, and the first one carries the weight:

**`.ground`, the ladder.** Five rungs, each one plain sentence, each with the
number underneath it. The shape is always the same because the economics of
every case in this course are the same shape:

| Rung | What it says |
| --- | --- |
| 1 | **The physical fact.** What actually happens in the world. A plane leaves the gate. A truck makes a run. A machine stamps a part. End it on the fact that creates the tension, usually that the thing costs the same whether it is used or not |
| 2 | **Money in.** Who pays, for what, and whether this company gets to set the price |
| 3 | **Money out because that thing happened.** The costs that would not exist if it had not happened. This is contribution, taught without the word |
| 4 | **Money out anyway.** The bill that arrives whether or not you do anything. This is the fixed block, again without the word |
| 5 | **So.** The conclusion falls out of rungs 2 to 4, worked as arithmetic, not asserted |

Rules for the rungs:

- **Write the sentence you would say out loud to a friend.** "A plane leaves the
  gate with a fixed number of seats on it, and it costs the same to fly whether
  those seats are full or empty."
- **One idea per rung.** If a rung needs a semicolon, split it.
- **The number sits under the sentence, never inside it.** Prose carries the
  logic, the mono block carries the figures.
- **No course vocabulary until rung 5**, and even there put the plain words
  first: "fares minus the costs that leave with the flight", then the term.
- **Rung 5 shows the subtraction.** Lose this, save that, rule, net. The reader
  should see the answer being produced, not told it.

**`.mix`, where the money goes.** One bar, two buckets, named in plain words:
"Goes away if the plane stays home" and "Still there in the morning". Never
"variable" and "fixed" as the bucket labels. The percentage and the dollar
figure both appear.

**`.ksf`, what this business has to be good at.** Two to four things, each a
short bold claim, then why it decides who wins, then whether this company
actually does it, with the evidence. A verdict with no evidence is a guess and
comes out.

**`.sowhat`, which means.** The bridge, and it is mandatory. Three or four
sentences saying which number answers the question on the table and which number
will mislead you. No `.sowhat`, no business section.

Two questions drive the whole thing, and both answers are numbers: what does one
more unit of demand cost to serve, and what does this company pay for capacity
whether it uses it or not. Everything else is background.

Pull the facts from the case narrative, not from what you know about the
industry in general. If the case does not say it, do not assert it.

#### The overhead rate

Half this course is one idea: a pile of cost that no single product caused has to
be handed out anyway, and **whoever picks the divisor picks the answer**. Any
session that allocates anything gets this block, in five parts.

**1 · Build it, visibly.** `.rateline` sets it out as a division you can see:
the pool, the base, the rate. Then the longhand underneath, per
`ivey-case-prep`: name the formula in words, substitute, resolve.

```
Rate = Overhead to spread  ÷  What you spread it on
     = $2,179,686  ÷  $4,164,340
     = 0.5234, i.e. 52.34 cents of overhead per dollar of fares
```

**2 · Name the choice.** `.choice`, in ochre, because this is the part that
earns marks. Nothing in the accounts says to divide by that base. A person
picked it. Say who benefits and who is punished by the pick, and say what
decision then gets made off the resulting number.

**3 · Apply it.** A full table: each cost object, its base units, the rate, the
overhead charged, and what that does to its reported profit.

**4 · Prove it.** The overhead column re-adds to the pool exactly. Say so on the
page. If the case's own totals do not foot, say that too and show by how much,
because noticing a rounding in the exhibit is evidence you actually rebuilt it
rather than retyping it.

**5 · Break it.** `.swap`: the same cost object under two or three different
bases, side by side, with the reported profit under each and a bar so the swing
is visible. Then a `.sowhat` naming what did **not** change. Nothing about the
route is different across those rows. Only the divisor moved.

Choose the alternative bases so the contrast is real. An equal split per unit is
usually the sharpest against a revenue base, because it has an obvious story
behind it, head office serves everybody about the same, and it produces a wildly
different number.

The line this block exists to earn: **contribution is the same in every row, and
the reported margin is not.** That is why one of them can decide whether to keep
a route and the other cannot.

#### Diagrams for this case

A generic shape teaches nothing. The diagram has to be about **these** routes,
**these** accounts, this company's actual situation, and things that are
different in the case have to look different on the page.

**The object diagram.** One row per real thing, at its real size. For RegionFly
that is `.fleet`: seven routes, bar length is that route's fares, the dark end is
what leaves with the flight, the pale end is contribution. The two cancelled
routes are **not rows with zeros in them**. They are drawn below a divider, in
dashed outline, struck through, at their last full year, labelled "was throwing
off this". A cancelled route is a different kind of object and the page should
say so at a glance.

**The bridge.** When something moved between two periods, show what moved it.
`.bridge` walks from opening profit to closing profit through each cause, with a
bar per step and the signed figure beside it. The RegionFly bridge is the whole
case in one picture: contribution given up, minus a little more slippage, plus
the overhead the cuts genuinely removed, and the arithmetic of the trade
underneath.

Both end in a `.sowhat`. A diagram that does not change what you would say in
class has not earned its space.

#### Observations

Separate from issues, and separate from the exhibit read. An **issue** is a
decision. A **read** is what an exhibit contains. An **observation** is
something you noticed that nobody else in the room will have, and it is where
class contribution actually comes from.

Four to six, each with three parts: the claim in plain words, the evidence as a
`.ev` block of real figures, and one line on why it matters. Tag each one:

| Tag | Means |
| --- | --- |
| `.tg.b` Cost behaviour | The numbers are telling you how a cost behaves |
| `.tg.q` Check the data | Something about the figures is odd, rounded, duplicated or a plug |
| `.tg.a` The argument | It changes what the recommendation should be |

Where to look, in order:

1. **Two accounts that move at different rates.** That is the fixed and variable
   split showing itself, often before the exhibit that formally gives it to you.
2. **Figures that are identical, or suspiciously round.** Two unrelated pools at
   the same dollar is a plug. One round number among granular ones is an
   estimate, so do not build a recommendation on it.
3. **Ratios across the same kind of thing.** If cost per unit swings six points
   between routes, a single blended rate is hiding it.
4. **Whether the problem predates the action.** If the trend was already bad
   before the intervention, the intervention was never the fix. This is usually
   the strongest point available.
5. **What an action does mechanically to the remaining units.** Cutting routes
   raises overhead per surviving route with no operating change at all, which
   makes the next cut look justified. Name that loop.

Never pad the list. Three real observations beat six where half are restatements
of the exhibit.

#### Words that mean you have stopped writing plainly

If one of these is on the page, rewrite the sentence around it:

| Do not write | Write |
| --- | --- |
| Volume driver, revenue driver | What they sell, what gets counted |
| Binding constraint | What makes it hard |
| Cost structure is fixed heavy | Three quarters of the bill arrives either way |
| Key success factor | What you have to be good at |
| Contribution margin (before rung 5) | What is left after the costs that leave with it |
| Capacity cost, committed cost | The bill that arrives whether you fly or not |
| Leverage, optimise, drive, unlock | Say the actual thing that happens |
| So what / therefore / implication | Which means |

Course vocabulary still earns marks in class, so keep the real term, but put it
after the plain sentence rather than in place of it.

### 4 · Concepts and Problems

Concepts follows `ivey-case-prep` exactly: numbered sections, an "In one line"
box, a diagram before the prose, a worked example with real numbers. Keep it to
the technique this session actually teaches, and connect it forward to the case,
because in this course the concept exists to make the case tractable.

Problems follows `ivey-case-prep`'s three blocks without exception: the question
as set, the working, the answers.

### 5 · Publish

Publish as an Artifact, favicon 📒, the exhibit JPGs passed through `files`,
the same file path across revisions so the URL holds. File the HTML into
`notes/` and the JPGs into `notes/assets/`. Reply with the link plus what is on
the page.

Follow-up questions in the same session append to the Q&A log at the bottom of
the same file. New session or new case means a new file.

## The components

`case-components.html` in this skill folder carries the CSS and one worked
instance of each, in page order: `.dec`, `.issues`, `.chain`, `.mix`, `.ind`,
`.ksf`, `.sowhat`, `.shot`, `.exread`, `.rec`, `.say`. Paste
the style block into the template's own and copy the markup. The tokens are the
template's, so nothing is redesigned.

## Anti-patterns

- A Case part that summarises the case. The reader has the case, they need the
  analysis
- A Case part that starts with numbers before saying what company this is
- Waiting on the video instead of building the page while it renders
- A video that gives a recommendation, which is the page's job
- Publishing an mp4 over 15MB, which fails the upload instead of linking out
- An overview that retells the opening scene instead of saying what is going on
- An issue that is a topic, or an issue with no number attached
- Industry analysis that never reaches a number, or that ends without a `.sowhat`
- A `.ground` rung that starts with money instead of with a physical fact
- A figure typed inside a rung sentence rather than in the block underneath it
- Naming the technique before the reader has seen why it is needed
- Industry facts you know from the world rather than facts the case states
- A cost-structure claim with no split behind it. Fixed against variable is a
  percentage and a dollar figure, never an adjective
- An exhibit described from `pdftotext` output without looking at the picture
- Screenshots of narrative pages, or shots with no read beside them
- Exhibit totals copied across rather than re-added
- An overhead rate stated rather than divided out in front of the reader
- An allocation table whose column is not proved back to the pool
- A rate computed on one base with no second base to show what the choice cost
- Hotspot coordinates typed by eye instead of computed by `exhibit_boxes.py`
- Skipping an exhibit because it looked unimportant
- A cost box labelled with a number when it could be labelled Fixed or Variable
- A classification argued only from the description, with no test against how the
  account actually moved
- More than four top-level boxes on one exhibit, which highlights nothing
- A point whose claim has no arithmetic under it
- A cancelled or dead thing drawn as a row with a zero in it
- An observation that only restates what the exhibit says
- A box with no matching row in the read, or a row with no box
- Dropping the Concepts or Problems group because the session was case heavy
- A recommendation that lists both sides and picks neither
- Base64 exhibits inlined into the HTML
- Anything `ivey-case-prep` bans: Mermaid, SVG text boxes, sentences in table
  cells, a section with no visual, em dashes, jargon in a diagram label
