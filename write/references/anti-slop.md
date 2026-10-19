# Anti-slop

> **Most of this list is about your reflexes, not his.** Sloppy spoken phrasing is
> cut; a blunt or odd line of his stays. When in doubt, keep his version.
Everything here is a tell. Readers may not be able to name what's wrong, but they stop trusting the writer, and on X they scroll past. Sweep for these every revise pass.

## Banned constructions

| Pattern | Example | Fix |
| --- | --- | --- |
| **Antithesis snap** | "This isn't a tooling problem. It's a judgment problem." | Say the true thing once: "The bottleneck was judgment, not tooling." |
| **Rule of three** | "faster, cheaper, and more reliable" | Keep the one that matters. Three items signals padding. |
| **Fragment answer** | "The result? Nothing shipped." | Join it: "The result was that nothing shipped." |
| **Throat-clearing opener** | "Here's the thing." / "Let's be clear." / "The truth is:" | Delete. Start with the thing. |
| **Rhetorical question** | "What if the problem isn't the model?" | Assert it: "The problem isn't the model." |
| **Era framing** | "In today's landscape of AI tools…" | Delete the clause. Start at the noun. |
| **Signposting** | "First, let's look at…" / "Now that we've established…" | Delete. The structure should be felt, not announced. |
| **Mid-paragraph bold takeaway** | "…and that's **the real insight here**." | Cut the bolding and the phrase. If it's the insight, it's a sentence of its own. |
| **Summary close** | "Ultimately, what this all comes down to is…" | Cut the paragraph. End on the last real point. |
| **Inspiration close** | "So go build something." | Cut. Never end on a cheer. |
| **Permission close** | "And that's okay." / "And that's fine." | Cut. |
| **not only / but also** | "not only faster but also cheaper" | "faster and cheaper" |
| **Anaphora block** | "We built X. We built Y. We built Z." | One sentence with a list, or three real sentences that each say something different. |
| **Empty hedge** | "arguably", "some might say", "many would agree", "it could be argued" | Delete, or replace with a precise limit (see voice-and-style.md). |
| **Booster adverb** | "significantly faster", "truly novel", "incredibly hard" | Delete the adverb. Add a number if you have one. |
| **Superlative reflex** | "one of the most important things" | Name the thing, drop the ranking. |
| **Colon title** | "Paint and Judgment: What Operations Taught Me About AI" | Pick one half. Usually the concrete half. |
| **Engagement bait** | "Let that sink in." / "Thoughts?" / "Agree?" | Cut. |
| **Emoji, hashtags, 🧵, "Thread:"** | anywhere | Cut, all of it. |

## Banned vocabulary

delve, leverage (as a verb), robust, seamless, unlock, supercharge, elevate, empower, streamline, navigate (figurative), landscape (figurative), tapestry, testament to, game-changer, double-edged sword, paradigm, holistic, synergy, at the end of the day, it's worth noting, needless to say, in the realm of, a myriad of, plethora, foster, harness, pivotal, crucial, vital, myriad, journey (figurative), unpack (figurative), lean into, dive deep, deep dive, resonate, curate (unless literal).

Also: "moreover", "furthermore", "additionally", "consequently", "thus". If a logical connector is doing load-bearing work, the argument has a gap — fix the chain instead.

## Cadence tells

These survive every phrase-level edit, so check them separately, by eye.

- **Uniform paragraph length.** Every paragraph 3–4 sentences. Real writing is lumpy — vary from 1 to 6.
- **Uniform sentence length.** Everything 15–25 words. Needs 3-word sentences and 40-word sentences in the same piece.
- **Balanced clause symmetry** in sentence after sentence. Break the pattern.
- **Em dash as a rhythm crutch.** One per 300 words is plenty. `slopcheck.sh` counts them.
- **Every section the same shape** — claim, example, mini-conclusion, repeat. Vary what sections do.
- **Uniformly confident tone** across the whole piece. Real arguments have soft spots, and naming them is what makes the hard spots believable.

## One deliberate exception

The antithesis snap is banned as a *reflex*, not as a device. One instance, placed at a
real hinge — usually the last line, where the whole argument turns over — is craft, and
it is a large part of why PG's endings land. Two in a piece is a tic. Three is a voice
made of nothing else.

So: if `slopcheck.sh` flags one and it's carrying the close, keep it and move on. If it
flags three, you were writing on autopilot. The script over-flags by design; read every
hit and decide, rather than obeying it.

## Two harder rules

**No sentence exists to set up another sentence.** Setup sentences are how drafts double in length while saying the same thing. If a sentence's only job is to make the next one land, delete it and let the next one land cold.

**Never state the emotional read.** Don't write that something was frustrating, surprising, or remarkable. Show the thing and let the reader have the reaction. Naming it steals it.

## The last check

Read the opening line and the closing line back to back, with nothing in between. If they'd work as a standalone two-line post, the piece has a spine. If they sound like they came from two different essays — or from no one in particular — go back to the chain.
