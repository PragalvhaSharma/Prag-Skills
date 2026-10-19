# Prag Skills

Agent skills I use daily, for Claude Code, Codex, Cursor and OpenCode, plus the global agent instructions and subagents every one of those tools runs with by default. Each skill folder is self-contained: a `SKILL.md` the agent reads on demand, plus whatever templates, references and scripts that skill needs.

## Skills

| Skill | What it does |
|---|---|
| `praghtml` | Diagram-first HTML pages whose diagrams animate themselves on a loop: explainers, stacks, flows, and product-idea demos. Includes Anatomy figures, interactive isometric objects whose motion is the idea. Every follow-up gets appended into the same page. |
| `slides` | A full-bleed slide deck as one self-contained HTML file: spring-driven track, progress rail, jump menu, print-to-PDF, optional live demos. Pitch decks lead with the real people you interviewed, and one content source can also build the PPTX, PDF and presenter script. |
| `fan-out` | Splits a task across parallel subagents or worktrees in Codex, Claude Code, OpenCode and Cursor, merges the results, and has the `verifier` agent check them. |
| `cover-letter` | One-page cover letters rendered as print-ready PDFs in Times New Roman 12pt, with no em dashes. |
| `universal-cold-email` | Cold emails to hiring managers, founders, recruiters, operators, and investors. Reads your profile from a reference file and drafts straight into Gmail. |
| `cold-email-pipeline` | Outreach to one person on two channels: researches them from a post, job or LinkedIn link, drafts a matched LinkedIn DM and cold email, sends the email with the gws CLI and the DM through signed-in Chrome, then verifies both. |
| `gws-email` | Drafts, replies to or sends Gmail email through the gws CLI as HTML so it renders full width in Gmail. Saves a draft by default. |
| `daily-brief` | A morning brief from WHOOP, Wealthsimple holdings with live prices, Google Calendar, Canvas deadlines, Gmail, iMessage and WhatsApp, ranked into what matters today with a Signal vs Noise section. |
| `write` | Edits dictated talking into publishable Substack and X writing: fixes grammar, cuts filler, reorders points, and never adds content the speaker didn't say. Renders a plain HTML reading page for each piece. |
| `ivey-case-prep` | One self-contained HTML prep page per Ivey HBA session, case, or problem set, with every assigned question worked end to end. |
| `accounting-class-prep` | Managerial accounting prep pages (Concepts, Case, Problems), reading each exhibit one by one with a screenshot beside what to do with it. |

### Skills by other authors

These are open source skills I use every day. Each folder keeps its original license file.

| Skill | What it does | Source and license |
|---|---|---|
| `browser-harness` | Real browser control over CDP: clicking, typing, navigation, logged-in sessions, JS-rendered or bot-protected pages. | [browser-use/browser-harness](https://github.com/browser-use/browser-harness), MIT |
| `macos-harness` | Drives a whole Mac from one persistent Python session: screenshots, PID-targeted input, Accessibility, Apple Events, filesystem. | [browser-use/macos-harness](https://github.com/browser-use/macos-harness), MIT |
| `hatch-pet` | Builds, repairs, validates, and packages Codex-compatible v2 animated pets from character art: all 9 animation rows, 16 look directions, 8x11 spritesheet. | [openai/skills](https://github.com/openai/skills), Apache 2.0 |
| `brag` | Turns the current project website into a short, polished launch video with Hyperframes. Bundles music by Sascha Ende (ende.app, CC BY 4.0). | [latent-spaces/brag](https://github.com/latent-spaces/brag), MIT |
| `brag-slim` | Turns a project folder or website URL into a short launch video with music, motion and share copy, using only the tools already on the machine. | [latent-spaces/brag](https://github.com/latent-spaces/brag), MIT |
| `humanizer` | Removes signs of AI-generated writing, based on Wikipedia's "Signs of AI writing" guide. | [blader/humanizer](https://github.com/blader/humanizer), MIT |
| `professional-communication` | Email structure, team messaging etiquette and meeting agendas for technical and non-technical audiences. | [softaworks/agent-toolkit](https://github.com/softaworks/agent-toolkit), MIT |
| `find-skills` | Finds and installs agent skills from the open skills ecosystem. | [vercel-labs/skills](https://github.com/vercel-labs/skills), MIT |

## Global agent instructions and subagents

`global/` holds the setup every agent on my Mac runs with by default.

| In this repo | Installed at | What it is |
|---|---|---|
| `global/AGENTS.md` | `~/.claude/CLAUDE.md` | The instructions every agent follows: parallel work by default (split multi-part tasks across subagents, brief each one fully, have a fresh `verifier` check the merged result), which models subagents may use, how to report a blocker, and how to send Gmail. |
| `global/claude-agents/verifier.md` | `~/.claude/agents/verifier.md` | The fresh-context checker for the fan-in step. It gets the original goal and the combined diff, runs the real checks, and reports what fails without fixing it. |
| `global/codex-agents/verifier.toml` | `~/.codex/agents/verifier.toml` | The same `verifier` for Codex. |
| `global/opencode-agents/verifier.md` | `~/.config/opencode/agents/verifier.md` | The same `verifier` for OpenCode. |
| `global/claude-agents/ocx-*.md` | `~/.claude/agents/` | Claude Code subagents that route to other models through the [OpenCodex](https://github.com/lidge-jun/opencodex) proxy (`ocx claude`). OpenCodex regenerates these on launch, so these copies are a reference and a fallback. |
| `global/claude-agents/case-video.md` | `~/.claude/agents/case-video.md` | Turns a case PDF into a NotebookLM video overview for case prep pages. |
| `global/cursor-hooks/parallel-work-context.sh` | `~/.cursor/hooks/parallel-work-context.sh` | A Cursor `sessionStart` hook. Cursor has no global AGENTS.md file, so the hook injects `~/.claude/CLAUDE.md` as additional context. |

`~/.claude/CLAUDE.md` is the one real copy of the instructions. It has to stay a real file because Claude Cowork sessions skip a symlinked one. Codex and OpenCode read it through symlinks at `~/.codex/AGENTS.md` and `~/.config/opencode/AGENTS.md`.

`AGENTS.md` is written for my machine. It names local tools such as `blocked-alert` and the `gws-email` script path, so edit those lines before you use it as your own.

## Install

Clone and run the sync script.

```bash
git clone https://github.com/PragalvhaSharma/Prag-Skills.git
cd Prag-Skills
bash sync.sh
```

It copies every skill into `~/.claude/skills` as the canonical set, then symlinks Codex, Cursor, and Agents at that folder so all four tools see the same skills. It then restores any file from `global/` that is missing on your machine, links `~/.codex/AGENTS.md` and `~/.config/opencode/AGENTS.md` to `~/.claude/CLAUDE.md`, and registers the Cursor hook in `~/.cursor/hooks.json`. It never overwrites a global file that already has content.

Or take a single skill: copy its folder into `~/.claude/skills/` and you're done.

`sync.sh` replaces each skill folder in `~/.claude/skills` with this repo's copy, so back up any skill you have changed locally, including a filled-in `universal-cold-email/references/personal-info.md`, before you run it.

## Before first use

- **`universal-cold-email`** ships with a blank `references/personal-info.md`. Fill in your own identity, proof points, and links before drafting anything; the skill reads that file for every email.
- **`cold-email-pipeline`**, **`cover-letter`**, **`daily-brief`**, **`write`** and **`gws-email`** are built around my own setup. They read my profile, my finance and WHOOP repos, my writing folder, or a script path under `/Users/prag`. Point those paths at your own files first. `cold-email-pipeline` and `cover-letter` load my profile from a private `personal-information` skill that is not in this repo, so give them your own profile file.
- **`ivey-case-prep`** and **`accounting-class-prep`** read course material out of a local School repo. Point the paths in their `SKILL.md` at wherever you keep yours.
- **`browser-harness`**, **`macos-harness`**, **`gws-email`** and **`brag`** wrap external CLIs (or Hyperframes) that need to be installed separately.

## Layout

| Location | Role |
|---|---|
| `~/.claude/skills` | Canonical copies |
| `~/.agents/skills` | Symlinks |
| `~/.codex/skills` | Symlinks (Codex `.system` skills stay separate) |
| `~/.cursor/skills` | Symlinks |
