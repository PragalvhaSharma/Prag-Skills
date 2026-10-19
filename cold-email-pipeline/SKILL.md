---
name: cold-email-pipeline
description: End-to-end outreach to one person on two channels. Researches the target from a post, job, or LinkedIn link, drafts a matched LinkedIn DM and cold email for Prag, sends the email with the gws CLI and the LinkedIn message through signed-in Chrome, then verifies both. Use when the user asks to message someone on LinkedIn and email them, reach out after applying to a role, or types /cold-email-pipeline.
---

# Cold Email Pipeline

**Trigger:** `/cold-email-pipeline`, or any request like "message him on LinkedIn and email him".

One pass per target: research, draft both messages, send both, verify both, report.

## Sources of truth

- Identity, proof points, links, and resume path: `/Users/prag/.codex/skills/personal-information/SKILL.md`. Its wording wins over any older copy elsewhere (for example, the xAI result is "Won the xAI Hackathon", not "2nd place").
- Email craft (hooks, subject lines, structure, follow-ups): `/Users/prag/.codex/skills/universal-cold-email/SKILL.md`. Follow it except where this file overrides it.
- Resume: `/Users/prag/Documents/PragPersonal/PragalvhaSharmaResume.pdf`.

## Workflow

1. **Research.** Open the link (lnkd.in short links redirect to the post) and the person's LinkedIn profile in signed-in Chrome. Capture name, title, company, exactly what they asked applicants to send, connection degree, whether a Message button exists, and any email under Contact info.
2. **Apply first when relevant.** If the user also asked to submit an application, submit it before sending outreach, so "I applied" is true when the messages land.
3. **Find the email.** Check LinkedIn Contact info, the post, and company or public pages. If nothing is published, infer the company pattern (for example first initial + last name) and label the address as guessed in the final report.
4. **Draft both messages** from the same story, following the content rules below.
   - LinkedIn: one paragraph, about 700 characters or less, slightly more formal than email, plain text only (LinkedIn does not render markdown links). End with "Prag, https://www.pragalvha.com/profile". InMail needs a short subject line.
   - Email: 110 to 170 words, specific subject, single-line paragraphs, inline markdown links, website on its own line under "Prag".
5. **Send, only if the user told you to send or message in this session.** Without that instruction, create a Gmail draft (`--mode draft`), show the LinkedIn text in chat, and stop. With it, send both without asking again.
6. **Send the email** (see the script section below), attaching the resume for job outreach or whenever the target asked for it.
7. **Send the LinkedIn message** (see the LinkedIn section below).
8. **Verify and report.** Gmail: the send result has `labelIds: ["SENT"]`. About a minute later, search for a bounce, especially when the address was guessed. LinkedIn: the thread shows the message with a timestamp. Save screenshots and report channel, recipient, whether the address was verified or guessed, and anything that was skipped, such as an attachment.

## Content rules (both channels)

- Always include the NASA/NSS and xAI proof points, in the exact wording and links from personal-information. Add at most one or two more that fit the target.
- Opendoor title is always "AI Operations Engineering Intern" (never drop "Intern"), and Prag is Opendoor's first-ever intern in that role.
- Invent nothing: no metrics, projects, or duties absent from personal-information.
- No em dashes. No "Hope you're doing well".
- Answer the target's ask directly. If they asked for a hard problem you solved, lead with one concrete problem, the solution, and the measured result.
- **Never close with an offer to walk them through something**, such as "Happy to walk you through...", "Happy to walk through X in 10 minutes if useful", or "happy to chat more". End with a direct ask ("Would love a shot at the Payments team.") and then the sign-off.

**Readable output (Karpathy, Oct 2026).** The email and the DM both follow the readability rules under Style rules in universal-cold-email.

- Write about 80% of the way to Simplified Technical English (ASD-STE100): most sentences 20 words or fewer, one idea each. Keep Prag's voice.
- Put the reason for writing in the first two sentences of each message. Example: "I applied to a role on your Payments team today."
- Use the same names in both messages. If the email says "Payments team", the DM does not say "payments org".
- Both messages stay text. Link a small artifact only if the user asks for one or already has one. Examples: a one-page HTML or a short demo video. In the DM, paste the plain URL.
- Lead the step 8 report with a table, one row per channel. Columns: status (sent or failed), recipient, address (verified or guessed), and proof. Proof is the Gmail message id and bounce check, or the LinkedIn screenshot path. Then list anything skipped. Leave out raw command output.

## Email script

`scripts/gmail_outreach.py` renders a markdown-like body file into plain-text and HTML parts, attaches files, and calls `gws`. Write the body to a file first; never pass it inline.

```bash
# Send now (prints the Gmail message id and labelIds)
python3 ~/.codex/skills/cold-email-pipeline/scripts/gmail_outreach.py --mode send \
  --to person@company.com --subject "Specific subject" \
  --body-file /tmp/body.md --attach /Users/prag/Documents/PragPersonal/PragalvhaSharmaResume.pdf

# Draft only (default mode). Add --dry-run to preview the request without calling Gmail.
python3 ~/.codex/skills/cold-email-pipeline/scripts/gmail_outreach.py \
  --to person@company.com --subject "Specific subject" --body-file /tmp/body.md

# Bounce check after sending
gws gmail users messages list --params '{"userId":"me","q":"from:mailer-daemon newer_than:1h"}'
```

If `gws` reports an auth error, tell the user to run `gws auth login` and stop the email step.

## LinkedIn mechanics

- Use the Chrome extension browser, which is signed in to LinkedIn. Open the profile and use Message.
- If Message does not open the chat overlay, open the compose URL from the Message link with `&interop=msgOverlay` removed. It loads the full-page composer with the recipient filled in.
- 1st-degree connections get a normal message. 2nd and 3rd-degree connections get InMail when Premium credits exist; it shows "Use 1 of N InMail credits" and a Subject field, so mention the credit in the report. With no Message option, use Connect, then "Add a note" (300 characters), and shorten the DM to fit.
- Enter long text with `paste(index, text, {format: "text"})` and read the composer text back before pressing send.
- File attachments from the Chrome extension fail unless "Allow access to file URLs" is enabled for the extension in chrome://extensions. If blocked, send text only and let the email carry the resume; mention this in the report.
- After sending, confirm the thread shows the message and a timestamp, and save a screenshot.
