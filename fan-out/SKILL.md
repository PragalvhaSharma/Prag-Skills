---
name: fan-out
description: Split a task across parallel subagents or worktrees and merge the results safely. Use whenever a task has two or more parts that can run independently, or the user says "parallelize", "fan out", "use subagents", "run these in parallel" or "spin up agents". Works in Codex, Claude Code, OpenCode and Cursor.
---

# Fan-out

Parallel agents finish sooner and keep the main context clean when the pieces don't depend on each other. They fail when pieces share files, need each other's output, or get a vague brief. Compute is not the constraint; a correct merge is.

## 1 · Gate

Fan out when all of these are true:

- The task has two or more pieces that can each finish without seeing the others' output.
- No two pieces edit the same file.
- You can check the combined result (tests, a build, or a clear goal).

When the pieces form a chain, run them in one agent. Still hand noisy side work (codebase searches, log reading, web research) to a subagent so the main context stays clean.

A task you can finish in a few tool calls needs no subagents; batch those calls in one message instead.

## 2 · Plan the split (you are the coordinator)

Write this table before launching anything:

| Piece | Owns (files/dirs) | Depends on | Done when |
| --- | --- | --- | --- |

- Split by context boundary rather than by phase. The agent that builds a piece also writes its tests.
- A chain of dependent steps goes to one agent.
- Assign every piece yourself. Agents never pick or claim their own work.
- Size the split to the work, up to 8 agents at once. Keep the critical-path step for yourself.

## 3 · Brief each agent

A fresh subagent knows nothing from your conversation. Paste what it needs; never write "as discussed above".

```text
GOAL: one sentence on the outcome.
CONTEXT: the facts, decisions and constraints it needs.
OWNS: files/dirs it may edit.
DO NOT TOUCH: files/dirs other agents own.
DONE WHEN: the check that proves it (command, test, or observable result).
RETURN: under 200 words on what changed and how it was verified, plus changed paths and anything you could not verify.
DELEGATION: Do not launch subagents of your own.
```

Drop the DELEGATION line only when a piece is big enough to split again.

When the background is too long to brief, fork the conversation instead: Codex `spawn_agent` with `fork_context: true`; Claude Code the `fork` subagent type.

A subagent that receives a brief finishes its piece and launches more agents only when the brief asks for it.

## 4 · Launch

Send every launch in one message so they run concurrently, then keep working on the critical path.

| Agent | Launch | Code edits |
| --- | --- | --- |
| Codex | `spawn_agent` per piece; `wait_agent` only when blocked; `close_agent` when done | Separate files; for large edits, `git worktree add` per piece and give each agent its path |
| Claude Code | Several Agent tool calls in one message | `isolation: "worktree"` |
| OpenCode | Several task tool calls to the `general` subagent in one message; `explore` for read-only search | Separate files; `git worktree add` per piece |
| Cursor | Several Task calls in one message | Separate files; `git worktree add` per piece |

Models: let subagents inherit the parent's model and effort. Never downgrade to small or fast models (Luna, Haiku, mini, nano, flash) to save cost. If you name a model, use Claude Opus 5.5: in Codex, `anthropic/claude-opus-5-5`; in Claude Code launched through `ocx claude`, the `ocx-claude-opus-5-5` agent. Don't use GPT-5.6 Sol in any form (`cursor/gpt-5.6-sol`, `gpt-5.6-sol` or the `ocx-gpt-5-6-sol` agent); the Cursor route hits rate limits. Don't request `gpt-6-astra` either: the ChatGPT login rejects it in Codex.

A worktree is a fresh checkout: install dependencies first. Ports, databases and other local services are shared.

## 5 · Fan in (the part that usually fails)

1. Merge pieces one at a time and run the build or tests after each.
2. Launch the `verifier` agent with fresh context. Give it the original goal and the diff, not the workers' summaries.
3. For nontrivial work, also get a second review from a fresh Claude Opus 5.5 agent.
4. Fix what they find. Report what ran in parallel, what was verified, and anything skipped.
5. Write the report for oversight: the result first, then the proof the user can check (a command, a test, a diff, a path). Keep worker transcripts out of it.
