---
name: daily-brief
description: Prag's Daily Brief. Pulls WHOOP, Wealthsimple holdings with live prices, Google Calendar, Ivey Canvas deadlines, Gmail, iMessage and WhatsApp into one collector run, then writes a ranked "what matters today" brief with a Signal vs Noise section. Use when Prag says /daily-brief, "daily brief", "brief me", "what do I need to do today", "what should I focus on", "what did I miss", or asks for his morning rundown. Delivers in chat by default; emails it when asked or when run from a scheduled automation.
---

# Daily Brief

One page that tells Prag what deserves his attention today and what he can ignore. The
brief is only useful if it is ruthless: a short list of real actions beats a complete
inventory.

## 1. Collect

```bash
node ~/.claude/skills/daily-brief/scripts/collect.mjs --out /tmp/daily-brief-$(date +%F).json
```

It prints which sources are `ok`, `stale`, or `unavailable`. Read the JSON file. Every
source is independent, so always write the brief from whatever came back; never stop
because one source failed. Options: `--hours 48` widens the message window (use it on
Mondays or after he has been away), `--only gmail,school` re-runs just some sources.

Then gather the little extra context worth having:

- Read `sources.whoop.personalContextFile` (hand-kept context such as life events).
- For up to 5 Gmail messages that look like signal, read the body with
  `gws gmail +read --id <id>` before judging them. Do not read the rest.
- For a school deadline due within 3 days, check the course folder in
  `~/Documents/PragPersonal/School/<course>/` for the assignment brief or session prep.

Everything is read-only. Never send, reply, mark as read, archive, or label anything.

## 2. Decide what is signal

Signal is anything that needs action from him, changes a decision, or would hurt to miss:

- A real person waiting on him: direct questions, asks, plans that need a yes or no,
  group chats where he is named or a decision is being made.
- Deadlines, exams, interviews, and class prep in the next 7 days, weighted by how much
  they count and how close they are.
- Money that moved: a position up or down more than 5% today, a total move that is large
  for him, bills, refunds, aid, anything from his bank or school finance office.
- Work and career: Opendoor, recruiters replying to him, interviews, applications he started.
- Security alerts he may not have triggered, account problems, anything legal or
  official (government or school administration).
- Body: a WHOOP number that broke well away from his own baseline.

Noise is everything else: marketing, newsletters, job alerts he did not ask about, recap
emails, receipts with nothing wrong, automated notifications, group chat banter that
does not involve him. Noise gets counted and collapsed, never itemised one by one.

When unsure, ask "if he never saw this, would anything bad happen this week?" No means noise.

## 3. Write it

Order and shape (chat: Markdown; email: HTML, see step 4):

1. **Headline**: one line naming the single most important thing today.
2. **Today**: a time-ordered list of today's calendar events and classes, plus tomorrow
   morning if it affects tonight. Flag clashes and tight gaps.
3. **Do today**: 3 to 5 numbered actions, most consequential first. Each one concrete
   and finishable ("Submit Coding Assignment 2 on Canvas before 6 pm Mon", not "work on
   school"). Fold in actions from every section; this list is the point of the brief.
4. **School**: deadlines and exams in the next 7 days with day and time, plus anything
   bigger within 14 days (midterms) as a heads-up. Mention class prep only if a case or
   problem set is due before the next session.
5. **People**: who is waiting on him, from iMessage, WhatsApp and Gmail. Name, what they
   want, how long they have waited, and a one-line suggested reply. Draft only.
6. **Body**: recovery, HRV, sleep, resting HR for `whoop.brief.mostRecentDay` against his
   30-day averages, one finding, one action. Follow the WHOOP rules below.
7. **Money**: per-currency day change, the biggest movers with their %, and the holdings
   note. Describe what happened; never recommend buying or selling.
8. **Signal vs Noise**: two columns or two lists. Signal: the handful of items above,
   one line each, with the source. Noise: grouped counts with a one-line reason it is safe
   to ignore ("14 LinkedIn job alerts, none from companies you applied to").
9. **Data health**: one line per source that is `stale` or `unavailable`, with its `fix`.
   Omit the section when everything is ok.

Writing rules:

- Every number must come from the collector output. Never compute, estimate, or convert
  currencies yourself. If a number is missing, say so.
- **Never use em dashes.** Use a comma, a colon, or two sentences. This matters to him.
- Direct and specific, no cheerleading, no filler. Times in Toronto time.
- Keep it to one screen in chat. If a section has nothing that matters, write one line
  saying so instead of padding it.
- Write every line in Simplified Technical English, about 80% of the way (Karpathy, Oct
  2026). Keep an action to 20 words or fewer, verb first, and a description to 25. Use
  active voice, simple tenses and plain words. Call a thing by one name in every section:
  "Coding Assignment 2", never also "the CS assignment".
- Put the point first. Then name the source, so he can check it: the Canvas course, the
  Gmail sender and subject, or the chat. Write "Reply to Sam: dinner Fri, yes or no?
  (iMessage, 2 days)", not "Sam has been waiting a while and probably wants an answer".
- Use a table instead of a paragraph when a section compares items: People (who, where,
  what they want, days waiting, reply), Body (metric, today, 30-day average), Money
  (holding, % change).
- In the email, put raw source detail in an appendix at the end of the card. It holds
  every source's status, the day change for every holding, and the WHOOP `days` and `n`.
  A `<details>` wrapper is optional. Keep the appendix last, so the brief reads well if
  the mail client shows it open. Chat gets no appendix.

WHOOP rules (from his existing health brief):

- Weight claims by sample size (`days`, `n`); correlations are associations, never causes.
- If `whoop.staleDays` is more than 2, say how stale the data is first.
- Use the personal context file only when the dates line up; do not moralise about it and
  give no medical advice.
- No diagnoses or treatments. If a pattern looks worth attention, say it is worth raising
  with a doctor. End the section with "Observations from your own data, not medical advice."

## 4. Deliver

- **Chat (default)**: post the brief as the reply.
- **Email** (when he asks, or when this runs from a scheduled automation): write the brief
  as an HTML fragment (white card, system sans-serif, dark text, no images, no tracking)
  and send it to his own inbox:

```bash
gws gmail +send --to <your-email> --subject "Daily Brief · <headline>" --html --body "$(cat /tmp/daily-brief.html)"
```

  Confirm the send succeeded from the returned message id. This is the only thing the
  skill ever sends, and only to him.

## Sources and setup

See [references/sources.md](references/sources.md) for where each source comes from, the
one-time setup it needs, and how to fix it when the collector reports it unavailable.

