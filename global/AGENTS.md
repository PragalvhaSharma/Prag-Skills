# Global agent instructions

## Parallel work

This file is my explicit, standing request for sub-agents, delegation and parallel agent work in every session. I should not have to say "parallelize" or "use subagents" again. Compute and tokens are not a constraint; speed and correctness are.

Before starting any task with more than one part:

1. List the pieces. Mark each one critical path (your next step needs its result) or sidecar (it can start now and is needed only later).
2. Do the critical-path step yourself. Give each sidecar that takes several steps, or would fill your context with search results, logs or web pages, to its own subagent. Launch them all in the same message, then keep working while they run.
3. Run single reads, searches, web lookups and shell commands as parallel tool calls in one message.

Fan out when pieces can finish without seeing each other's output: separate research questions or sources, searches across different parts of a codebase, reviewing one change from several angles, tests or docs written alongside the implementation, and code changes in separate files. Keep work in one agent when each step needs the previous step's result, when two pieces would edit the same file, or when the whole task takes only a few tool calls.

Subagents:

- Use the strongest model. Let subagents inherit my current model and reasoning effort. Never choose small or fast models (Luna, Haiku, mini, nano, flash or fast variants) to save cost. If you must name a model, use Claude Opus 5.5: in Codex, `anthropic/claude-opus-5-5`; in Claude Code launched through `ocx claude`, the `ocx-claude-opus-5-5` agent. Don't use GPT-5.6 Sol in any form (`cursor/gpt-5.6-sol`, `gpt-5.6-sol` or the `ocx-gpt-5-6-sol` agent); the Cursor route hits rate limits. My ChatGPT login also rejects `gpt-6-astra` in Codex, so don't request it.
- A fresh subagent knows nothing from this conversation. Brief each one fully: the goal, the context it needs, the files it owns, the files it must not touch, how to check it is done, what to return (a short summary, changed paths and anything it could not verify), and whether it may launch subagents of its own. When the background is too long to brief, fork the conversation instead (Codex: `fork_context: true`; Claude Code: the `fork` subagent type).
- Give code changes separate files, and a separate git worktree where the tool supports it (Claude Code: `isolation: "worktree"`).
- Run up to 8 at once. In Codex, close each agent with `close_agent` as soon as you have its result.
- If you are yourself a subagent, finish your assigned piece and launch more agents only when your brief asks for it.
- How to launch: Codex `spawn_agent`; Claude Code several Agent tool calls in one message; OpenCode several task tool calls to the `general` subagent in one message; Cursor several Task calls in one message.

Fan in one piece at a time and run the build or tests after each. Before reporting done on work that changed code or files, have a fresh `verifier` agent check the combined result against the original goal; give it the goal and the diff, not the workers' summaries. For nontrivial work, also get a second review from a fresh Claude Opus 5.5 agent (Codex: `spawn_agent` with `model` set to `anthropic/claude-opus-5-5`; Claude Code launched through `ocx claude`: the `ocx-claude-opus-5-5` agent). For large splits, follow the `fan-out` skill.

## When you're blocked

Tell me when you're blocked instead of waiting quietly. Blocked means you can't make meaningful progress without me: a login, 2FA code or CAPTCHA; my approval before an irreversible, legal, payment or send step; access you don't have; or a decision you can't reasonably infer. Hard, slow or uncertain work doesn't count; make a sensible assumption and keep going.

1. For any real block, notify me as soon as you hit it, then keep doing whatever doesn't depend on my answer: `/Users/prag/.local/bin/blocked-alert notify "<what you need from me, in one line>"`. I get a "needs you" banner on my Mac and a high-priority push on my phone.
2. If you're really blocked on something important (a deadline, money, an application, anything in production, possible data loss, or a long unattended run that has stalled), email me instead. Write the body to a file, then run `/Users/prag/.local/bin/blocked-alert email --subject "<short summary>" --body-file <path>`. Say what's blocked, why it matters, what you tried and exactly what I need to do. The email command sends the notification too.

Alert once per blocker; the script drops repeats, so don't reword an alert to get past it. The notification line also reaches my phone through ntfy, so keep it to what's blocked and what you need: no personal details, private links or customer data. Put those in the email only if I need them to act. Passwords, 2FA codes and account or ID numbers go in neither. Subagents report blocks to their parent, and only the top-level agent alerts me. If `blocked-alert` exits non-zero, say which part failed in your reply and keep going. `blocked-alert status` checks that both channels work.

## Email through gws

When drafting, replying to or sending Gmail email with the gws CLI, use the gws-email skill: `python3 /Users/prag/.codex/skills/gws-email/scripts/gws_email.py` (see its SKILL.md). It sends the body as HTML so Gmail shows it full width. Never build a plain-text-only draft; Gmail hard-wraps those at about 70 characters when they're sent.
