# Theme · Opendoor

The deck's look is not decoration; it is the reason the thing reads as a
finished artefact rather than a generated one. **Default to this theme.** Only
reskin when the deck is genuinely not for an Opendoor audience.

## The one-line summary

Ivory paper, one blue, serif headlines, sans micro-labels, flat tint fills, and
the whole page as the slide.

## Type

| Role | Face | Where |
| --- | --- | --- |
| Display | **Publico Headline** 700 | Every headline, every big number, `h1`–`h4` |
| Text | **Graphik** 400/500 | Body copy, captions, table cells |
| Micro-label | **Graphik** 700, uppercase, tracked | Eyebrows, kickers, axis labels, chips |
| Code | system mono | `code`, `pre`, identifiers, file paths |

Both brand faces are served from Opendoor's own CDN at
`https://cdn.opendoor.com/fonts/…` — already wired in `template.html`, with a
`preconnect` and `font-display:swap`. If the deck must open offline, drop the
`@font-face` block and the stack falls back to `ui-serif` / `system-ui`
gracefully; do not substitute a Google font.

**Tracking is size-specific.** This is most of what makes it look right:

| Size | Letter-spacing |
| --- | --- |
| Cover headline, 5rem+ | `-.042em` |
| Statement, ~4rem | `-.038em` |
| Section head, ~2.5rem | `-.028em` |
| Card heading, ~1.4rem | `-.022em` |
| Body copy | `0` |
| Uppercase micro-label | `+.10em` to `+.17em` |

Numbers use `font-variant-numeric:tabular-nums` deck-wide, so columns of
figures line up.

## Colour

```
--paper      #F7F6F3   the page
--blue       #0040E6   Opendoor blue — the ONE accent
--mint-pale  #B5CAFF   the accent that reads on blue
--ink        #23201D   headings
--body       #3D3935   body copy
--mute       #786E64   secondary copy
--rule       #DFDBD8   borders
--rule-soft  #EBE9E7   inner table rules
```

Flat tint fills, for cards and bands. Always paired with `--ink` text:

```
--sky      #E8F4F8      --mint    #DFE8DE      --lavender  #EDE8F5
--peach    #F6E6D8      --blush   #F6E4E6      --grey      #ECEAE6
```

Semantic ink, for status only:

```
--mint-ink  #015A78   good / cleared        --crimson    #C13E3E   held / wrong
--amber-ink #8A5A2A   assumption / caution  --teal       #015A78
```

Rules:

- **One accent.** Blue is it. A second accent colour makes the deck look
  templated.
- **No gradients.** Flat fills only. The one shadow in the whole system is the
  screenshot frame's.
- **Blue slides are structural**, not decorative: the cover, each section
  opener, and the closer. Roughly one in three or four slides. On a blue slide
  the accent flips to `--mint-pale`.
- **Tint fills carry meaning, not variety.** Mint = cleared, peach = an
  assumption was named, blush = held, sky = neutral emphasis, grey = removed or
  inert. Keep that mapping consistent across a deck.

## The mark

The Opendoor mark, as inline SVG so it inherits `currentColor` — blue on paper,
white on blue:

```html
<div class="brand">
  <svg class="brand__mark" viewBox="0 0 14 20" fill="currentColor" role="img" aria-label="Opendoor">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0652 7.72525C10.0652 2.87886 9.23666 0.869951 6.95864 0.869951C4.94968 0.869951 3.93488 2.27822 3.93488 7.16613C3.93488 11.9918 4.7219 13.9801 7.04144 13.9801C9.09177 13.9801 10.0652 12.5924 10.0652 7.72525ZM0 7.60107C0 2.15396 3.74854 0 7.08288 0C10.645 0 14 2.13332 14 7.26967C14 12.7581 10.2515 14.85 6.91711 14.85C3.35507 14.85 0 12.5718 0 7.60107ZM13.2689 19.2321C12.929 18.7812 11.6198 17.0442 11.6198 17.0442C11.4969 16.8812 11.2864 16.7829 11.0605 16.7829H2.93952C2.71362 16.7829 2.50312 16.8812 2.38028 17.0442L0.731324 19.2318C0.679012 19.3011 0.651254 19.3819 0.651254 19.4645V19.7984C0.651254 19.9098 0.741489 20 0.852838 20H13.1472C13.2585 20 13.3488 19.9098 13.3488 19.7984V19.4645C13.3488 19.3819 13.3213 19.3014 13.2689 19.2321Z"/>
  </svg>
  <span class="brand__word">Project name</span>
</div>
```

The same mark on a blue rounded square is the favicon, already inlined as a
data URI in `template.html`.

**The lockup carries the project name, not "Opendoor".** `Opendoor ·
Team · #channel` belongs in the eyebrow above the headline.

## Voice

The copy convention matters as much as the palette:

- **Headlines are claims, not topics.** "The hard step was never the arithmetic"
  beats "Background".
- **Set the pivot in `<em>`.** Inside `.stmt`, `<em>` is not italic — it turns
  the accent colour. One per headline.
- **Bold the number, not the sentence.** `<b>` inside body copy is for the
  figure or the noun that carries the claim.
- **Every composition gets a caption** that says what to take from it. A
  diagram without a `.cap` is a diagram the audience will read differently than
  you meant.
- **Numbers with provenance.** `13,904 orders · Jun 2025 – Jul 2026, from
  channel scrape/`. A figure with no source reads as invented, because usually
  it was.
- **No acronyms.** If one is unavoidable, spell it out in braces the first time:
  `CDN {Content Delivery Network}`.
- **Never invent a metric.** If it was not measured, label it as a target, an
  estimate, or an assumption — the `.metric__ask` and the peach "assumption"
  tint exist for exactly this.

## Reskinning for a non-Opendoor audience

Only the `:root` block and the mark change. Nothing else in the deck reads a
literal colour.

1. Replace the `@font-face` block with the other brand's faces (or delete it).
2. Rewrite `--display`, `--text`, `--ui`.
3. Replace `--paper`, `--blue`, `--mint-pale`, `--ink`, `--body`, `--mute`,
   `--rule`, `--rule-soft`.
4. Replace the six tint fills with tints of the new palette at a similar
   lightness (roughly `L*` 92–96), so `--ink` still passes contrast on them.
5. Swap the `.brand__mark` SVG and the favicon data URI.
6. Check the blue slides: `.slide--blue` uses `--blue` as a *background*, so the
   new accent has to work as a full-bleed field, not just as a link colour. If
   it does not, keep the field dark and make the accent `--mint-pale`'s
   equivalent.

If a deck's palette is being invented from nothing rather than taken from a
brand, load `frontend-design` for the aesthetic direction first, then encode
the result as tokens here.
