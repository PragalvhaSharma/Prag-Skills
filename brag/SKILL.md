---
name: brag
description: Turn the current project website into a short, polished, shareable launch video using Hyperframes. Use when someone says "/brag", "let's brag about this", "make a launch video", "turn this into a video", or wants to share what they built. Reads the project code directly — no live URL or screenshots needed.
---

# /brag

You built it. Now let's brag about it.

## Invocation dispatch (must happen first)

**Model check.** If you are Claude Opus 5.5 and the invocation doesn't ask for the full workflow (`--full`, "use the full brag") or for voiceover (`--voice`, which brag-slim doesn't do), switch to brag-slim: read `<skill-dir>/slim.md` (the /brag-slim skill, bundled here) and follow it for the rest of this run instead of this file. Pass along the user's input, and pass any other options (`--no-music`, `--title`, …) as plain-language direction. Tell the user in one line first, e.g. "You're on Opus 5.5, so I'm using /brag-slim: I build the whole video myself. Say 'use the full brag' to switch back." If you are any other model, or can't tell which model you are, skip this check.

Before inspecting the project, parse the complete `/brag` invocation. If the
invocation contains `--voice` or asks for an explainer (see "Readable output"),
set `voice.enabled = true`. Enable narration only for that run. Do not enable
narration automatically and do not fall back to the normal no-voice workflow.

`/brag` turns the current project website or app into a short, polished, shareable launch video using Hyperframes. It is narrow, opinionated, and fun.

## What this skill does

1. Reads the current project code to understand the app.
2. Plans a short brag concept specific to this project.
3. Scripts and storyboards the video.
4. Hands a focused composition brief to Hyperframes.
5. Validates, renders, and writes share copy.

## Parsing the invocation

The user may invoke with natural language or flags:

```
/brag
/brag --tone chaotic
/brag --tone polished --format vertical
/brag this. Make it feel like a ridiculous startup launch.
```

Parse these options:

| Option | Values | Default |
|---|---|---|
| `--tone` | preset or freeform description | inferred |
| `--format` | `landscape`, `vertical`, `square` | `landscape` |
| `--duration` | seconds | auto (15-25s) |
| `--no-music` | flag | music on |
| `--no-sfx` | flag | sfx on |
| `--title` | string | inferred from project |
| `--voice` | flag | narration off |

Voice is opt-in. If `--voice` is present, use Kokoro via Hyperframes. Use
ElevenLabs only under the **Voice** rule in "Readable output" below.

Tone can be a preset (`default`, `polished`, `yc-parody`, `chaotic`, `deadpan`, `cinematic`, `app-store`) or a creative direction such as "fake Series A launch from 2016", "museum exhibit", or "overproduced mobile game ad".

When the user gives freeform tone direction, map it to the nearest preset for pacing and structure, but preserve the user's direction in the plan and composition brief.

## Readable output (Karpathy, Oct 2026)

When `--voice` is enabled, write narration that complements the visuals, does
not simply read visible text, matches scene pacing, sounds natural and
conversational, and moves smoothly between scenes. Keep the script concise and
specific to the product so the voice feels like part of the edit rather than a
separate narration track.

Write narration, on-screen lines and share copy at about 80% of ASD-STE100 (Simplified Technical English). Tone sets the energy, and these rules set the words. Launch copy can bend them for a joke, but it keeps short sentences and plain words. Leave the project's own copy as it is.

- **Words:** keep each sentence to 20 words or fewer. Use active voice, simple tenses and plain words ("use" for "utilize"). Use the same word for the same thing. If scene 2 says "match", scene 4 does not say "pair".
- **Explainer mode:** if the user asks you to explain how something works, make an explainer in the style of 3Blue1Brown. The default tone is `polished`. This mode replaces the 15–25 s limit and the Hook → Reveal pattern. Step 2's advice against diagrams does not apply.
- **Explainer scenes:** give each scene one idea, in the order the process runs. Draw the idea as a diagram, and move the diagram to show what changes over time. The diagram leads, and real UI supports it. Each scene gets one short on-screen line and a few sentences of narration. The narration sets the duration, usually 30–90 seconds in total. In `brag-plan.md`, give each scene its idea, diagram motion, on-screen line and narration.
- **Example, "how Horse Tinder matches":** profile cards fill a grid ("Each horse has a profile."). An arrow grows from one card to another ("Swipe right to pick a horse."). A second arrow comes back, and the two arrows turn into a badge ("Two right swipes make a match."). The narration for that last scene: "If both horses swipe right, the app makes a match."
- **Voice:** check for a key with `[ -n "$ELEVENLABS_API_KEY" ] && echo set`, and never print the key. If the key is set, ask the user before you use it, because ElevenLabs costs money. If there is no key or the user says no, use Kokoro. Step 3 has both commands.
- **Proof:** an explainer diagram can use example numbers only if the on-screen line or narration says "for example". In the Step 4 message, give the video's duration, link `brag.jpg`, and list each stand-in or example number on screen.

---

## Output directory

By default, output goes to `brag-output/`. To avoid overwriting previous runs, use a timestamped directory:

```
brag-output-2026-05-04-143022/
```

Use a timestamp when:
- The user explicitly asks for a new run without overriding previous results
- A `brag-output/` directory already exists in the project

Generate the timestamp at the start of the run (`YYYY-MM-DD-HHmmss`) and use it consistently for all output paths in that run: plan, brief, composition, render, and share copy.

## Skill directory

`<skill-dir>` is the directory containing this `SKILL.md`. Claude Code prints it as "Base directory for this skill" when the skill loads; for other agents it's wherever the skill was installed. Bundled assets are under `<skill-dir>/assets/` and scripts under `<skill-dir>/scripts/`. Don't guess an install path: a plugin install, a `~/.claude/skills/` copy, and this repo all put it somewhere different.

---

## Step 1: Inspect the project

**Read:** [references/step-1-inspect.md](references/step-1-inspect.md)

Scan the project directory and extract the information needed to plan the brag video.

**Gate:** You can answer all 9 questions in the brag planning rubric.

---

## Step 2: Plan and storyboard

**Read:** [references/step-2-plan.md](references/step-2-plan.md)

Write `<output-dir>/brag-plan.md` (where `<output-dir>` is `brag-output/` or the timestamped variant chosen above). Answer the planning rubric. Commit to a creative angle. Write the beat-by-beat storyboard including scenes, text, timing, transitions, and SFX cues.

When music is selected, include a compact `Music cue guidance` section: read the bundled track's cue preset from `<skill-dir>/assets/music/cues/` if present, otherwise note cues will be detected at composition time (any track now supports beat sync — see `references/audio.md`). Cue metadata is optional timing guidance only: story, readability, pacing, and product clarity stay primary.

**Gate:** `<output-dir>/brag-plan.md` exists with a full storyboard. Scene durations sum to 15–25 seconds.

---

## Step 3: Hand off to Hyperframes

**Read:** The Hyperframes domain skills — `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`. /brag is its own workflow: do not enter the `hyperframes` entry-point intent interview or route into its generic promo / launch-video workflow.
**Read:** [references/step-3-compose.md](references/step-3-compose.md)
**Read:** [references/audio.md](references/audio.md)

Write the composition brief and use Hyperframes to create the video implementation in `<output-dir>/composition/`.

`/brag` owns the product angle, source material, storyboard, tone, format, audio selection, music cue guidance, and delivery expectations. Hyperframes owns the concrete composition structure, exact animation timing, animation mechanics, runtime choices, linting rules, and render workflow.

**Gate:** `npx hyperframes check` passes with zero errors inside `<output-dir>/composition/` (the single browser gate before render — see hyperframes-cli for what it audits).

---

## Step 4: Validate, render, and deliver

**Read:** [references/step-4-deliver.md](references/step-4-deliver.md)

Validate, preview, render to `<output-dir>/brag.mp4`, pick the best poster frame into `<output-dir>/brag.jpg`, bake that poster as the video's frame 0 so it's the idle thumbnail everywhere, and write `<output-dir>/share-copy.txt`.

**Gate:** `<output-dir>/brag.mp4` exists. A best-frame poster `<output-dir>/brag.jpg` is picked (not an arbitrary frame) and baked as frame 0 of `brag.mp4`. Share copy is written.

---

## Tone system

Seven tone presets ship with `/brag`. Each changes scripting energy, pacing, typography personality, and transition style. Presets are defaults, not limits.

Full definitions: [references/tones.md](references/tones.md)

| Tone | Energy | One-liner |
|---|---|---|
| `default` | Playful, clean, postable | The good-vibes default |
| `polished` | Serious, elegant | For projects that are not jokes |
| `yc-parody` | Deadpan startup energy | Fake seriousness applied to absurd projects |
| `chaotic` | Fast, loud, aggressive | Over-the-top and unhinged |
| `deadpan` | Calm, dry, understated | The joke is that nothing is a joke |
| `cinematic` | Dramatic, trailer-scale | Big motion, bigger claims |
| `app-store` | Smooth, feature-card clean | Corporate but not boring |

Always allow a freeform creative direction to refine or override the preset.

---

## Creative laws

These apply to every brag video regardless of tone.

**Short.** 15–25 seconds. Not one second more without a reason.

**Readable.** Keep the pace high through motion and cuts, never by flashing text. Every line a viewer must read holds long enough to read it (short label ~0.8s settled; a sentence ~0.3s per word). Fast-in, then hold — never fast-in, then gone.

**Specific.** The video must feel like it was made for this exact project, not any project.

**Show the thing.** At least one scene must display actual UI, copy, or a key visual from the product. No abstract filler.

**No generic SaaS language.** "Streamline your workflow" is banned. Use the project's actual copy and claims.

**The hook is everything.** The first 2 seconds determine whether someone keeps watching. Plan the hook before anything else.

**Funny earns its place.** Humor should come from the project's absurdity, not from trying to be funny.

**Pattern:**
```
Hook (2-3s) → Reveal (2-4s) → 2-3 sharp highlights (5-12s) → Punchline/outro (2-4s)
```

Adapt this. Not every project needs exactly 3 highlights. The pattern is a starting shape, not a template.
