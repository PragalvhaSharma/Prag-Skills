---
name: gws-email
description: Draft, reply to, or send Gmail email with the gws CLI so it renders full width in Gmail. Use for any Gmail draft, reply, reply-all, or send made through gws (Google Workspace CLI), including one-off replies inside other tasks. Converts a plain body file to HTML and calls gws gmail +send or +reply with --html, saving a draft by default.
---

# gws email

Gmail hard-wraps a plain-text-only message at about 70 characters when it is sent, so a draft built as `text/plain` (for example with Python's `EmailMessage.set_content` and `gws gmail users drafts create`) arrives as a narrow column. Always send the body as HTML. This script does that and handles threading through gws's own helpers.

## Use

Write the body to a file as normal prose: blank lines between paragraphs, no manual line wrapping needed (wrapped lines inside a paragraph are joined). `- ` lines become bullets and `1. ` lines a numbered list; indent a line to continue the item above it. A URL alone on a line stays on its own line as a link, `[label](url)` becomes a link, and a sign-off block like `Thanks,\nPrag` keeps its line breaks.

```bash
S=/Users/prag/.codex/skills/gws-email/scripts/gws_email.py

# Reply in an existing thread (draft by default). --all for reply-all.
python3 "$S" reply --message-id <gmail-message-id> --all --body-file work/reply.txt

# New email
python3 "$S" new --to person@example.com --subject "Subject" --body-file work/email.txt

# Revise a draft: save the new one and delete the old draft
python3 "$S" reply --message-id <id> --all --body-file work/reply-v2.txt --replace-draft <old-draft-id>

# Check the HTML without touching Gmail
python3 "$S" reply --message-id <id> --body-file work/reply.txt --preview
```

Other flags: `--cc`, `--bcc`, `--from`, `-a <file>` (repeatable), `--dry-run`. `--send` delivers immediately; use it only when the user has explicitly authorized sending.

## Rules

- Never create Gmail drafts or messages as `text/plain` only. If you must build raw MIME yourself, include a `text/html` part (multipart/alternative) with unwrapped paragraphs.
- Replies quote the original message, as Gmail does. The reply goes to the original sender; use `--all` to keep everyone on the thread.
- Verify a new draft with `gws gmail users drafts get --params '{"userId":"me","id":"<draft-id>"}'` and check its payload `mimeType` is `text/html` or `multipart/alternative`.
- If gws reports an auth error, ask the user to run `gws auth login`.
