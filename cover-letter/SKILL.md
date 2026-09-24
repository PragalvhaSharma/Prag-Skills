---
name: cover-letter
description: Write and render a one-page cover letter as a print-ready PDF in Times New Roman 12pt. Use when the user wants a cover letter, an application letter, a letter of interest, a letter to attach to a job application, or asks to clean up, retype, shorten, or reformat an existing cover letter. Produces a PDF that fits on exactly one page and contains no em dashes.
---

# Cover Letter

**Trigger:** `/cover-letter`

Turn a job posting plus the user's background into a one-page cover letter PDF that looks like a letter a person typed, not like a web page printed to paper.

## Non-negotiables

1. **No em dashes.** Not in the source, not in the rendered PDF. Break the clause into two sentences, or use a comma, colon, or period. Verify after rendering, not just in the source.
2. **Exactly one page.** Two pages is a failed build. Fix it and re-render before showing the user.
3. **Times New Roman, 12pt body.** Embedded in the PDF, not substituted.
4. **Every claim traceable.** Pull facts from the `personal-information` skill and the user's resume. Do not invent numbers, titles, dates, or outcomes. If a metric is ambiguous, write it the way the user's resume writes it and flag the ambiguity in chat.

## Process

### 1. Gather

- Read the job posting. Fetch the URL if given. Note the team name, the exact role title, and the two or three things the posting actually cares about.
- Load the `personal-information` skill for contact details and links.
- Read the user's current resume so the letter and resume agree on every number. If a phrase was recently changed in one, change it in both.

### 2. Draft

Target **330 to 370 words of body text**. That is what fits on one page at 12pt with a header. Longer drafts will spill and force you to shrink the type, which looks worse than cutting a sentence.

Structure that works:

- **Opening (about 45 words).** The role, who the user is right now, and the one sentence connecting their current job to what this team needs. No throat-clearing, no "I am writing to express my interest."
- **Strongest proof (about 95 words).** The single most relevant thing they built or ran, with the real number attached. Then the lesson from it, phrased as the discipline the role asks for. This paragraph does the work.
- **Second proof (about 75 words).** Something from a different domain, ideally showing the specific sub-skill in the job description that the first paragraph missed.
- **Credibility extras (about 70 words).** Wins, features, rankings, press. Group them so they do not each need their own paragraph.
- **Close (about 50 words).** Current status, any logistics the posting asked about such as timezone overlap or hours, and a plain offer to talk.

Voice: consistent formal register. Pick "I am" or "I'm" and hold it for the whole letter. Concrete nouns. No adjectives doing work that a number could do.

### 3. Render

Copy `assets/template.html`, replace the content, then:

```bash
scripts/build.sh <input.html> <output.pdf>
```

The script renders with headless Chrome, then checks page count, embedded fonts, and em dashes. It exits non-zero and tells you what is wrong. Do not hand the user a PDF the script rejected.

### 4. Fit it

If it comes out at two pages, in this order:

1. Cut sentences. Almost always the right fix. Look for a clause restating the previous one.
2. Tighten the template's `line-height` from 1.34 toward 1.25 and margins from 1in toward 0.85in.
3. Only then consider dropping a paragraph.

Never go below 1.2 line-height, below 0.8in margins, or below 12pt. Past that it stops reading as a letter.

### 5. Show it

Rasterize page 1 and actually look at it before claiming it is done:

```bash
pdftoppm -png -r 90 -f 1 -l 1 out.pdf preview
```

Read the PNG. Check the header is not crowding the date, the paragraphs are not rivers of whitespace, and nothing is orphaned at the bottom. Then `open` the PDF for the user.

## Filing

Save as `<FirstLast>_<Company>_<RoleTitle>_CoverLetter.pdf` in the same folder as the resume, which for this user is `~/Documents/PragPersonal/`. Keep the source HTML alongside your working files so the letter can be revised without retyping it. Back up any PDF you overwrite.

## References

- `references/style.md` — sentence-level rules, and the phrases to never use.
- `assets/template.html` — the layout. Header, rule, date, recipient block, salutation, body, sign-off.
- `scripts/build.sh` — render and verify.
