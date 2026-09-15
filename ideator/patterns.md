# Ideator patterns

Quick recipes when remaking `template.html` for a new idea. Keep the
auto-playing scene runner (the loop engine + `SCENES`); **swap the stage guts**
to match whatever product surface the idea lives in. The runner already
auto-plays on view, loops, pauses off-screen, and honors reduced motion — you
only replace the `SCENES` data and `resetStage()`.

The default template sample is **search → filter → detail**. That is a starter,
not a preference for real-estate or chat. Rebuild the stage every time.

## Form → result (template sample)

**Use for:** search, generators, quotes, wizards, filters.

Stage pieces: input → controls → result list/card → optional detail.

Hero beat: the moment the outcome becomes obvious (filter lands, card opens).

## List → detail

**Use for:** feeds, ops queues, tickets, catalogs, tables.

```html
<div class="stage inbox">
  <div class="row is-dim" data-el="row1">…</div>
  <div class="row" data-el="row2">…</div>
  <aside class="panel" data-el="panel">…</aside>
</div>
```

Scenes: highlight row → panel/sheet slides in → fields populate → CTA settles.

## Map / spatial

**Use for:** listings, coverage, logistics, geo tools.

Scenes: map idle → pin drops → card pops → filter toggles pins with opacity.

## Canvas / editor

**Use for:** builders, design tools, board interfaces.

Scenes: object appears → select/handles → transform or connect → inspector updates.

## Checkout / steps

**Use for:** multi-step flows, onboarding, payments.

Scenes: step 1 filled → stepper advances → summary updates → success state.

## Settings / toggle

**Use for:** preferences, permissions, feature flags in the interface.

Scenes: control at rest → toggle/flip → dependent interface reacts → confirmation.

## Before / after

**Use for:** copy or layout change.

One stage, two layers. Scene toggles `.is-after`; CSS {Cascading Style Sheets} crossfades.
Chips can scrub Before / After after playthrough.

## Thread / chat

**Use for:** messaging, bots, triage — **only when the idea is chat**.

Stage pieces: message → status → reply → reaction/receipt.
Do not use this pattern as the default for unrelated ideas.

## Cursor puppet

**Use for:** multi-step interface tours where the "user" must be visible.

```html
<div class="cursor" data-el="cursor" aria-hidden="true"></div>
```

Move with `transform: translate(x, y)` per scene; brief `.is-click` on taps.
Keep travel ≤ 300ms.

## Timing cheatsheet

| Beat | Feel | Typical `ms` |
| --- | --- | --- |
| Appear | snappy | 200–400 hold after 200ms transition |
| Intermediate / loading | readable | 800–1200 |
| Hero settle | let it land | 1200–1600 |
| Loop hold (payoff frame) | let it breathe before rewind | 1400–1600 (`LOOP_HOLD`) |
| Rewind idle (before replay) | a beat of calm | ~500 (`RESET_HOLD`) |
| Reduced motion | play once, then stop | ~70 per scene, no loop |

## Scenario chip pattern

Max 3. Each key in `SCENES` is a full beat list. Switching chips must
`resetStage()`, rebuild beats, and restart the loop on the new path — never
leave nodes from the other path visible. Name chips for the idea ("With
results" / "Empty"), not generic bot jargon unless the idea is a bot.
