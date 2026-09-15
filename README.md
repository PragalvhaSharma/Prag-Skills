# Prag Skills

Agent skills I use daily, for Claude Code, Codex, and Cursor. Each folder is a self-contained skill: a `SKILL.md` the agent reads on demand, plus whatever templates, references, and scripts that skill needs.

## Skills

| Skill | What it does |
|---|---|
| `explainer` | Diagram-first HTML pages that explain a concept, an architecture, a stack, or a flow. Every follow-up question gets appended into the same page. |
| `slides` | A full-bleed slide deck as one self-contained HTML file — spring-driven track, progress rail, jump menu, print-to-PDF, optional live demos. |
| `ideator` | Turns a product idea into an interactive animated HTML demo that auto-plays and loops. Clickable fake interface, staged scenes, real motion. |
| `universal-cold-email` | Cold emails to hiring managers, founders, recruiters, operators, and investors. Reads your profile from a reference file and drafts straight into Gmail. |
| `hatch-pet` | Builds, repairs, validates, and packages Codex-compatible v2 animated pets from character art — all 9 animation rows, 16 look directions, 8x11 spritesheet. |
| `ivey-case-prep` | One self-contained HTML prep page per Ivey HBA session, case, or problem set, with every assigned question worked end to end. |
| `accounting-class-prep` | Managerial accounting prep pages — Concepts, Case, Problems — reading each exhibit one by one with a screenshot beside what to do with it. |
| `browser-harness` | Real browser control over CDP: clicking, typing, navigation, logged-in sessions, JS-rendered or bot-protected pages. |
| `macos-harness` | Drives a whole Mac from one persistent Python session — screenshots, PID-targeted input, Accessibility, Apple Events, filesystem. |

## Install

Clone and run the sync script. It copies every skill into `~/.claude/skills` as the canonical set, then symlinks Codex, Cursor, and Agents at that folder so all four tools see the same skills.

```bash
git clone https://github.com/PragalvhaSharma/Prag-Skills.git
cd Prag-Skills
bash sync.sh
```

Or take a single skill — copy its folder into `~/.claude/skills/` and you're done.

## Before first use

- **`universal-cold-email`** ships with a blank `references/personal-info.md`. Fill in your own identity, proof points, and links before drafting anything; the skill reads that file for every email.
- **`ivey-case-prep`** and **`accounting-class-prep`** read course material out of a local School repo. Point the paths in their `SKILL.md` at wherever you keep yours.
- **`browser-harness`** and **`macos-harness`** wrap external CLIs that need to be installed separately.

## Layout

| Location | Role |
|---|---|
| `~/.claude/skills` | Canonical copies |
| `~/.agents/skills` | Symlinks |
| `~/.codex/skills` | Symlinks (Codex `.system` skills stay separate) |
| `~/.cursor/skills` | Symlinks |
