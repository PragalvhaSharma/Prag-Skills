---
name: universal-cold-email
description: Write strong cold emails for hiring managers, founders, recruiters, operators, investors, and peers. Use when the user wants a tailored cold email, outreach note, networking email, informational interview ask, referral request, job pitch, or follow-up based on a company, person, product, job post, or short research notes.
---

# Universal Cold Email

**Trigger:** `/cold-email`

Use this skill to turn sparse context into a short, specific cold email that feels high-conviction, not templated.

The best emails are direct, lightly personalized, proof-dense, and easy to reply to. They do not read like cover letters.

Cold email is not just for jobs or startups. It works for scholarships, rare collectibles, investor meetings, conference invitations, and anything else behind a closed door. Most people never ask. The worst outcome is silence, and you are already at zero.

## Installation

### curl (manual)

```bash
mkdir -p ~/.claude/skills/universal-cold-email/references
curl -fsSL https://raw.githubusercontent.com/PragalvhaSharma/Prag-Skills/main/universal-cold-email/SKILL.md \
  > ~/.claude/skills/universal-cold-email/SKILL.md
curl -fsSL https://raw.githubusercontent.com/PragalvhaSharma/Prag-Skills/main/universal-cold-email/references/templates.md \
  > ~/.claude/skills/universal-cold-email/references/templates.md
curl -fsSL https://raw.githubusercontent.com/PragalvhaSharma/Prag-Skills/main/universal-cold-email/references/personal-info.md \
  > ~/.claude/skills/universal-cold-email/references/personal-info.md
```

Then add this to `~/.claude/CLAUDE.md`:

```markdown
# universal-cold-email
- **universal-cold-email** (`~/.claude/skills/universal-cold-email/SKILL.md`) - cold email drafting skill.
  Trigger: `/cold-email`
  When the user types `/cold-email`, invoke the Skill tool with `skill: "universal-cold-email"` before doing anything else.
```

### Setup

After installing, edit `references/personal-info.md` with your own identity, proof points, links, and positioning notes. The skill reads that file to personalize every email it drafts.

## Personal info

Before drafting, read [references/personal-info.md](references/personal-info.md) to load the sender's identity, proof points, links, demo URLs, and positioning notes.

Rules:
- Always draft from the sender's perspective as defined in personal-info.md.
- Pick 2 to 4 proof points per email based on relevance to the target. Never dump the whole profile.
- Use the proof rules in personal-info.md. If the personal info marks a proof point as always-on, include it in every email first, worded exactly as that file words it. Then choose the remaining proof points based on role relevance. Tier 3 is for specific technical conversations only.
- Use the positioning notes in personal-info.md to choose the right framing for the target.
- Always include the sender's website in the closing line of every cold email. No exceptions.
- Always include links and demo URLs inline with proof points. Links strengthen proof and credibility—never omit them.
- When a proof needs a link, keep it inline with the claim using a short label like `[xAI feature](...)` or `[demo](...)`. Links are mandatory for any claim with evidence behind it.
- If personal-info.md lists an always-on proof point with exact wording, reproduce that wording and its inline link verbatim in every draft. Do not paraphrase a proof point that the file pins.

## Default output

Unless the user asks for something else, produce:

- 3 subject lines
- 1 primary email draft
- 1 shorter alternative if the first draft is above 170 words
- 1 follow-up email

## Workflow

1. Lock the objective.

Choose the real goal before drafting:

- get considered for a role
- get a response from a founder or hiring manager
- ask one smart question
- earn a referral or warm intro
- reopen a thread with a follow-up
- ask for something unconventional (scholarship money, rare items, access, funding)

Do not mix goals in one email.

2. Find one credible hook.

Anchor the opener to one concrete thing:

- a product the sender uses
- a job post
- a launch, post, talk, acquisition, or hiring update
- a company mission or market angle
- a mutual context
- a sharp tactical question

Prefer one real hook over three vague compliments.

3. Pick the angle.

Use the strongest available angle:

- `user angle`: "I use this product and care about how it is built."
- `operator angle`: "I have done adjacent work and can help fast."
- `asset angle`: "I already built, wrote, shipped, or analyzed something relevant."
- `question angle`: "I have one thoughtful question worth replying to."
- `referral angle`: "There is a specific reason I am reaching out to this person."

4. Compress credibility.

Read personal-info.md and state who the sender is in one line, then show proof with 2 to 4 concrete points from the appropriate tier.

Best proof uses:

- numbers
- company names
- shipped work
- scope
- selection signals
- direct relevance to the target role or company

If one or two bullets are stronger with receipts, add the link inline inside the bullet instead of on a separate line. Good:

- `- 2nd place at the <Company> Hackathon for <Project>, later featured by <Company> ([feature](https://...))`
- `- 1st place globally in <Contest>, beating 26,725 students across 19 countries ([press](https://...))`

Bad — the link orphaned onto its own line, where it proves nothing:

- `- 2nd place at the <Company> Hackathon for <Project>`
- `https://...`

5. Make one ask.

Use a low-friction CTA:

- "Mind if I send a 2-min demo?"
- "Got 5 min for a quick yes/no?"
- "Open to a quick 10 minute call next week?"
- "Would love a shot if the team is still hiring."
- "Would you be open to pointing me to the right person?"
- "If useful, I can send over a tighter write-up or prototype."

The ask should be specific and make it too easy to say yes. Never use vague asks like "would love to connect sometime" because that is the equivalent of "let's hang out soon." Everyone says it, nobody means it, nothing happens.

6. Cut hard.

Keep the final draft tight:

- target 110 to 170 words
- only keep details that strengthen reply odds
- remove repeated enthusiasm
- remove anything that sounds like a resume pasted into email

## Structure

Use this default structure:

1. Personal opener tied to one real thing
2. Why the sender is reaching out now
3. One-line identity statement
4. 2 to 4 proof bullets or tight proof clauses
5. Clear CTA
6. One closing line with the sender's website always. Include the full website URL in every closing.

Bullets work well when the sender has compact proof. If the proof is weak, use a shorter paragraph instead of fake bullet points.
When using bullets in email, keep each bullet to one compact claim. If a link matters, attach it inline with a short label instead of adding a raw URL line below it.

## Style rules

- Sound plainspoken and specific.
- Write like a smart friend, not a desperate applicant or a brand deck. Use contractions. Use fragments. Sign with just the first name.
- Never use em dashes in subject lines or email body copy. Use a period, comma, colon, parentheses, or a simple hyphen only when punctuation truly needs it.
- Keep the energy high, but do not beg.
- Use strong nouns and verbs, not inflated adjectives.
- Show urgency through specificity and initiative, not through desperation.
- Tone matters more than resume. This is a vibe check, not a thesis.
- If the sender has genuine product love or sharp insight, lead with it.
- If the sender already built something relevant, lead with that instead.
- Frame everything around what it does for them, not what the sender built. No one cares what you built. They care what it does for them.

## Formatting rules - critical for Gmail rendering

Real emails flow to the full width of the reader's window. Hard line breaks mid-sentence make the email look broken, narrow, and AI-generated.

- **Each paragraph must be a single continuous line with no hard line breaks inside it.** Let the email client handle wrapping. A paragraph that is 3 sentences long should be one unbroken line of text.
- Separate paragraphs with a single blank line (`\n\n`).
- Bullet points are each one continuous line. Do not break a bullet across multiple lines.
- Never wrap text at 60, 70, or 80 characters. That is terminal formatting, not email formatting.
- When writing the draft body file, ensure no mid-sentence newlines exist. The only newlines should be between paragraphs and between bullet items.
- Test: if you removed all blank lines, you should have exactly N lines for N paragraphs/bullets. If you have more, you have unwanted line breaks.

## What good source examples consistently did

- Opened with a concrete reason for choosing that company or person
- Kept the sender bio to one sentence
- Used proof with names, numbers, and scope
- Asked for a small next step
- Sounded intentional, not polished for the sake of being polished

## What weaker examples got wrong

- Turned the email into a mini autobiography
- Used generic admiration with no real hook
- Listed traits instead of evidence
- Asked for too much at once
- Sounded needy before establishing value
- Used "Hope you're doing well" as the opener (instant delete)
- Said "let me know if there's anything you need help with" instead of stating the value directly
- Were too formal when the context called for casual

## Subject line rules

If the subject line sucks, nothing else matters. The email dies in the inbox, unopened.

Subject lines should be specific enough that only one person could have received it. The best subject lines feel like they were written for exactly that person.

Good patterns:

- `[Specific thing they posted/did/said]`
- `[Context] -> [Why I'm reaching out]`
- `Built something for [Company]`
- `Re: your [talk/post/launch] on [topic]`

Bad patterns (never use):

- `Quick question` (too generic)
- `Following up` (says nothing)
- `Partnership Opportunity` (spam trigger)

Avoid clickbait, fake urgency, and all-caps.

## Decision rules

- Read personal-info.md first. Honor any always-on proof rule before anything else, then add the most relevant supporting proof for the target. Tier 3 is for technical deep-dives only.
- Every proof point must have a link if one exists. If a proof point lacks a link, research and add one or note to the user that a link is not available.
- Use the positioning notes in personal-info.md to decide which proof to lead with based on the target type (AI company, research, startup, investor, etc.).
- If the sender has strong proof but weak personalization, keep the hook short and let the proof carry—links are essential here to credibility.
- If the sender has strong personalization but lighter proof, keep the message shorter and ask for a conversation, not a job.
- If the sender has already built something relevant, mention it early with a link to evidence.
- If the goal is advice, ask one question that proves the sender has done homework.
- If the user provides only a company or job link, draft from the available facts and state any assumption briefly instead of blocking.

## Follow-up rules

Most replies do not come from the first email. They come from follow-ups. No reply does not mean no. People are busy.

Timing:

- Day 3: a light bump. Example: "bumping this up in case it got buried, no pressure either way"
- Day 7: give them an easy out. Example: "worth a quick look or should I close this out?" Giving an easy out somehow makes them more likely to say yes.

Core rules:

- Wait long enough for the first email to breathe unless the user says otherwise.
- Follow-up should add a new angle, artifact, or tighter ask. The best follow-up is not a nudge. It is news.
- If traction or a real update exists, lead with it. Example for founders: "following up from last week. we just hit 500 users and crossed $10k MRR. would love to revisit the conversation." Traction is the best follow-up you can send.
- Do not send more than one main idea per follow-up.
- Keep follow-ups shorter than the original.
- Persistence pays. Be willing to follow up many times over long periods if the ask matters enough.

## Batch mode

If the user provides multiple companies, people, or job links:

- first identify the best hook for each target
- avoid reusing the same opener across every draft
- tailor the proof emphasis to the target instead of swapping only the company name
- if the list is long, prioritize the best-fit targets first and keep the pattern consistent

For startup-style roles, bias toward ownership, speed, shipping, ambiguity tolerance, and evidence of initiative.

## Platform-specific tone

Adapt energy to the channel:

- Twitter/X DMs: short, casual, to the point
- Cold emails: structured, but still direct
- Investor emails: lead with traction, no fluff
- LinkedIn: slightly more professional, still concise

Same rules, different energy. Read the room.

## The five-line test

Every draft should pass this structural test. The core email is five elements:

1. Hook (one line showing you paid attention)
2. Why it matters to them (not to you)
3. What you are offering, framed as outcome
4. Low-friction ask
5. Sign off (first name only)

If the draft cannot compress to this shape, the sender does not understand their own offer well enough yet.

## Output quality bar

Before finalizing, check:

- Would this sound real if a founder read it on a phone?
- Is there one reason this specific recipient would reply?
- Is the proof concrete enough to remember?
- Is the ask easy to say yes to?
- Could 15 percent of the words be cut without losing meaning?
- Does it sound like a smart friend wrote it, not a desperate applicant?
- Is the opener something other than "Hope you're doing well"?
- Does every proof point have an inline link?
- Does the closing line include the sender's website URL?

## Gmail draft creation

After drafting emails, automatically create Gmail drafts using the Google Workspace CLI (`gws`, https://github.com/googleworkspace/cli).

### Rules

- Always create Gmail drafts through the `gws` CLI.
- Never use `gog`, Gmail app tools, MCP Gmail actions, or any non-`gws` draft path for this skill.
- After every email draft is finalized, create the draft from the shell with `gws`.
- If there are multiple emails for **different people**, create one draft per person.
- If there are multiple emails for the **same person** (e.g. initial email + follow-up), combine them into a **single draft**. Put the initial email as the body. Add the follow-up below a separator line like `\n\n---\n\n[FOLLOW-UP - send on Day 3-7 if no reply]\n\n`.
- Always pass `--to` with the recipient's email address when known. If the recipient email is not known, omit `--to` and note it in the output so the user can fill it in from the draft.
- Use `--subject` with the best subject line from the options generated.
- Never pass a formatted cold email body inline on the shell unless it is a tiny one-liner. Write the body to a file first so paragraphs, bullets, and links do not break.
- For normal cold emails, write the final email to a temp `.md` or `.txt` file, then use the bundled helper [scripts/create_gmail_draft.py](scripts/create_gmail_draft.py) from the shell. The helper is allowed because it calls `gws gmail users drafts create` under the hood.
- The helper sends both a plain-text body and an HTML body to Gmail so paragraphs, bullets, and links render correctly.
- The helper supports paragraph breaks, `- ` bullets, markdown links like `[demo](https://...)`, and the common pattern where a URL is placed on the line after a bullet. It folds those links back into the bullet before calling `gws`.
- If you do not use the helper, use `gws gmail +send --draft --html` for a simple HTML draft. Do not use `gog`.
- If `gws` exits with an auth error, tell the user to run `gws auth login` and stop. Do not fall back to Gmail MCP or `gog`.

### Command syntax

```bash
# Preferred: create a Gmail-safe draft from a markdown/text body file
python3 scripts/create_gmail_draft.py \
  --to recipient@example.com \
  --subject "Subject here" \
  --body-file /tmp/email_body.md

# Draft without recipient (user fills in later)
python3 scripts/create_gmail_draft.py \
  --subject "Subject here" \
  --body-file /tmp/email_body.md

# Direct gws fallback for a simple HTML draft
gws gmail +send \
  --to recipient@example.com \
  --subject "Subject here" \
  --body "<p>Email body here</p>" \
  --html \
  --draft
```

### Workflow

1. Draft all emails per the normal workflow above.
2. Present the drafts to the user for review with subject line options.
3. After user approval (e.g., "go ahead and create" or "create the draft"), automatically:
   - Write each approved email body to a temp `.md` or `.txt` file. Prefer inline markdown links such as `[xAI feature](...)` rather than raw pasted URLs.
   - Create Gmail drafts using `python3 scripts/create_gmail_draft.py`, which shells out to `gws gmail users drafts create`.
   - Confirm to the user which drafts were created (recipients, draft IDs, and status).

## References

- Personal info: [references/personal-info.md](references/personal-info.md)
- Reusable templates and pattern notes: [references/templates.md](references/templates.md)
