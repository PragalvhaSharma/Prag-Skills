# Component library

Every entry is a **self-contained pair**: a CSS chunk to append to the last
`<style>` block in the deck, and a slide body to drop into `.track`. Nothing
here depends on anything else here — only on the tokens and core classes in
`template.html`.

**Take only what the slide needs.** A deck that pastes all 32 blocks is a
worse deck than one that pastes four. Unused CSS is the thing that makes these
files feel generated.

**Compose freely.** Two components on one slide is normal (a chart plus a
callout, a screenshot plus annotations). A component you need and cannot find
here should be *invented in the same idiom* — see
[Writing a new component](#writing-a-new-component) at the end.

Contents

| Family | Components |
| --- | --- |
| [Numbers](#numbers--evidence) | stat grid · big number · scale bars · now/target metric · funnel · line chart |
| [Argument](#argument--structure) | two moves · versus · gap tree · steps strip · timeline · layer stack · 2×2 matrix · then-chain · tiers · risk + guardrail · do/don't |
| [Voice](#voice--text) | pull quote · callout bar · definitions · verification list · annotations |
| [Reference](#reference--data) | table · was/now · spec table · code |
| [Media](#media) | screenshot frame · split media · legend key |
| [Live](#live) | message mock · schema stage · flow diagram |

---

## Numbers & evidence

### Stat grid

Six-ish figures that establish the size of the thing. One tile may go blue to
mark the figure that carries the argument.

```css
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--rule);
  border:1px solid var(--rule);border-radius:12px;overflow:hidden;}
.stat{background:#fff;padding:1.15rem 1.2rem 1.25rem;}
.stat b{display:block;font-family:var(--display);font-size:clamp(1.9rem,3.1vw,2.55rem);
  font-weight:700;letter-spacing:-.038em;color:var(--ink);line-height:1;}
.stat i{font-style:normal;display:block;font-family:var(--ui);font-size:.68rem;font-weight:700;
  letter-spacing:.13em;text-transform:uppercase;color:var(--blue);margin:.55rem 0 .3rem;}
.stat span{display:block;font-size:.86rem;line-height:1.45;color:var(--mute);}
.stat--blue{background:var(--blue);}
.stat--blue b{color:#fff;}
.stat--blue i{color:var(--mint-pale);}
.stat--blue span{color:rgba(255,255,255,.82);}
@media (max-width:1000px){.stats{grid-template-columns:repeat(2,1fr);}}
@media (max-width:640px){.stats{grid-template-columns:1fr;}}
```

```html
<section class="slide" data-section="1" data-title="The size of the job">
  <p class="label"><i>1.2</i>Thirteen months, replayed</p>
  <div class="stats">
    <div class="stat"><b>13,904</b><i>Orders</i><span>Jun 2025 – Jul 2026. 12,120 are paint.</span></div>
    <div class="stat stat--blue"><b>28 gal</b><i>Median order</i><span>34 excluding top-ups.</span></div>
    <div class="stat"><b>346,292</b><i>Gallons</i><span>Across 11,620 orders. Median 3 lines.</span></div>
  </div>
  <p class="cap">Mean sits next to median, so this is <b>not a long-tail story</b>.</p>
</section>
```

### Big number

One figure, full bleed, when the number *is* the slide. Works on paper or blue.

```css
.bignum{width:min(100%,68rem);margin:0 auto;text-align:center;}
.bignum b{display:block;font-family:var(--display);font-weight:700;
  font-size:clamp(5rem,15vw,13rem);line-height:.86;letter-spacing:-.05em;color:var(--ink);}
.bignum b em{font-style:normal;font-size:.42em;letter-spacing:-.03em;color:var(--blue);}
.bignum i{font-style:normal;display:block;font-family:var(--ui);font-size:.82rem;font-weight:700;
  letter-spacing:.18em;text-transform:uppercase;color:var(--blue);margin-top:1.4rem;}
.bignum p{margin:1.1rem auto 0;font-size:1.15rem;line-height:1.55;color:var(--mute);max-width:44ch;}
.bignum p b{display:inline;font-size:inherit;letter-spacing:0;color:var(--ink);font-weight:700;
  font-family:var(--text);}
.slide--blue .bignum b{color:#fff;}
.slide--blue .bignum b em,.slide--blue .bignum i{color:var(--mint-pale);}
.slide--blue .bignum p{color:rgba(255,255,255,.86);}
.slide--blue .bignum p b{color:#fff;}
.bignum__row{display:flex;justify-content:center;gap:clamp(2rem,6vw,5rem);flex-wrap:wrap;}
.bignum__row b{font-size:clamp(3rem,8vw,6.5rem);}
```

```html
<section class="slide slide--center" data-section="1" data-title="73.5%">
  <div class="bignum">
    <b>73.5<em>%</em></b>
    <i>of typed colour names resolve to a code Sibi accepts</i>
    <p>The other quarter is not a modelling problem. <b>It is a table that was never written down.</b></p>
  </div>
</section>
```

### Scale bars

Two to four quantities on **one shared axis**, drawn to scale on purpose, so
the proportion carries the claim before a number is read. Bars fill in when the
slide arrives.

```css
.scale{width:min(100%,72rem);margin:0 auto;display:grid;gap:.85rem;}
.sc{display:grid;grid-template-columns:13rem 1fr 5.5rem;gap:1rem;align-items:center;}
.sc__k{font-size:.9rem;line-height:1.35;color:var(--mute);}
.sc__k b{display:block;font-family:var(--display);font-size:1rem;font-weight:700;color:var(--ink);letter-spacing:-.015em;}
.sc__track{height:1.5rem;border-radius:5px;background:var(--grey);overflow:hidden;}
.sc__fill{height:100%;width:0;border-radius:5px;background:#DFDBD8;}
.seen .sc__fill{width:var(--w);transition:width 900ms var(--ease) 160ms;}
.sc--now .sc__fill{background:var(--blue);}
.sc__v{font-family:var(--display);font-size:1.05rem;font-weight:700;color:var(--ink);text-align:right;letter-spacing:-.02em;}
@media (max-width:1000px){.sc{grid-template-columns:10rem 1fr 4.5rem;}}
@media print{.sc__fill{width:var(--w)!important;}}
```

```html
<div class="scale">
  <div class="sc">
    <p class="sc__k"><b>51 rows, hand-kept</b>Typed in as orders failed</p>
    <div class="sc__track"><div class="sc__fill" style="--w:2.4%"></div></div>
    <p class="sc__v">51</p>
  </div>
  <div class="sc sc--now">
    <p class="sc__k"><b>2,108 codes, enumerated</b>Every candidate asked of the validator</p>
    <div class="sc__track"><div class="sc__fill" style="--w:100%"></div></div>
    <p class="sc__v">2,108</p>
  </div>
</div>
```

### Now / target metric

A measurement with a baseline bar and a goal bar, plus the question that
falsifies it. Three across is the usual shape.

```css
.metric{border-top:2px solid var(--rule);padding-top:1rem;}
.metric__nm{font-family:var(--display);font-size:1.22rem;font-weight:700;color:var(--ink);letter-spacing:-.022em;line-height:1.2;}
.metric__nm i{font-style:normal;font-family:var(--ui);font-size:.76rem;color:var(--blue);letter-spacing:.1em;margin-right:.55rem;}
.tgt{display:block;font-family:var(--display);font-size:.84rem;font-weight:700;color:var(--mint-ink);margin-top:.3rem;}
.bars{display:grid;gap:.4rem;margin-top:.9rem;}
.bar{display:grid;grid-template-columns:3.4rem 1fr 4.6rem;gap:.7rem;align-items:center;}
.bar__k{font-size:.76rem;color:var(--mute);letter-spacing:.06em;text-transform:uppercase;}
.bar__track{height:.6rem;border-radius:100px;background:var(--grey);overflow:hidden;}
.bar__fill{height:100%;width:0;border-radius:100px;}
.bar__fill--base{background:#DFDBD8;}
.bar__fill--goal{background:var(--blue);}
.seen .bar__fill{width:var(--w);transition:width 800ms var(--ease) 200ms;}
.bar__v{font-family:var(--display);font-size:.92rem;font-weight:700;color:var(--ink);text-align:right;}
.metric__ask{margin-top:.85rem;padding-top:.75rem;border-top:1px solid var(--rule);font-size:.88rem;line-height:1.45;color:var(--mute);}
.metric__ask b{display:block;font-family:var(--ui);font-size:.72rem;font-weight:700;letter-spacing:.1em;
  text-transform:uppercase;color:var(--mint-ink);margin-bottom:.28rem;}
.metric__ask em{font-style:normal;color:var(--ink);font-weight:600;}
@media print{.bar__fill{width:var(--w)!important;}}
```

```html
<div class="cols c3">
  <div class="metric">
    <p class="metric__nm"><i>M1</i>Orders landing faster<span class="tgt">the real output</span></p>
    <div class="bars">
      <div class="bar"><span class="bar__k">Now</span><div class="bar__track"><div class="bar__fill bar__fill--base" style="--w:100%"></div></div><span class="bar__v">slow</span></div>
      <div class="bar"><span class="bar__k">Target</span><div class="bar__track"><div class="bar__fill bar__fill--goal" style="--w:40%"></div></div><span class="bar__v">faster</span></div>
    </div>
    <p class="metric__ask"><b>Did carts get placed sooner?</b><em>If ops still builds by hand, we only moved Slack.</em></p>
  </div>
</div>
```

### Funnel

A number narrowing across stages, with what is left at the end. Arrows between.

```css
.funnel{width:min(100%,74rem);margin:0 auto;display:grid;
  grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;gap:.9rem;align-items:stretch;}
.fn{border-radius:14px;padding:1.15rem 1.2rem 1.2rem;display:flex;flex-direction:column;gap:.4rem;}
.fn b{font-family:var(--display);font-size:clamp(2rem,3.4vw,2.9rem);font-weight:700;letter-spacing:-.04em;line-height:1;color:var(--ink);}
.fn i{font-style:normal;font-family:var(--ui);font-size:.66rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;}
.fn span{font-size:.86rem;line-height:1.45;color:var(--mute);margin-top:auto;}
.fn--a{background:var(--mint);} .fn--a i{color:var(--mint-ink);}
.fn--b{background:var(--peach);} .fn--b i{color:var(--amber-ink);}
.fn--c{background:var(--grey);} .fn--c i{color:#8A7F73;}
.fn--d{background:var(--blue);} .fn--d b{color:#fff;} .fn--d i{color:var(--mint-pale);} .fn--d span{color:rgba(255,255,255,.84);}
.fnarrow{align-self:center;font-family:var(--display);font-size:1.1rem;font-weight:700;color:var(--rule);}
@media (max-width:1000px){.funnel{grid-template-columns:1fr;} .fnarrow{display:none;}}
```

```html
<div class="funnel">
  <div class="fn fn--a"><b>41</b><i>Green</i><span>Cleared on the first pass.</span></div>
  <span class="fnarrow" aria-hidden="true">→</span>
  <div class="fn fn--b"><b>12</b><i>Asked</i><span>One named question each.</span></div>
  <span class="fnarrow" aria-hidden="true">→</span>
  <div class="fn fn--c"><b>7</b><i>Held</i><span>Missing a tint code.</span></div>
  <span class="fnarrow" aria-hidden="true">→</span>
  <div class="fn fn--d"><b>3</b><i>Left for a model</i><span>What a person still reads.</span></div>
</div>
```

### Line chart

A trend over time, inline SVG, no library. Draw the path yourself in the
viewBox (x = 0…600, y = 0…200 with y inverted) — or read `dataviz` if the
chart is doing real analytical work. The line strokes itself in on arrival.

```css
.lc{width:min(100%,68rem);margin:0 auto;}
.lc svg{width:100%;height:auto;display:block;overflow:visible;}
.lc .lc-grid{stroke:var(--rule-soft);stroke-width:1;}
.lc .lc-axis{font-family:var(--ui);font-size:11px;fill:var(--mute);}
.lc .lc-area{fill:var(--sky);opacity:0;transition:opacity 700ms var(--ease) 500ms;}
.lc .lc-line{fill:none;stroke:var(--blue);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;
  stroke-dasharray:1400;stroke-dashoffset:1400;}
.lc .lc-dot{fill:var(--blue);opacity:0;transition:opacity 300ms var(--ease) 1s;}
.lc .lc-tag{font-family:var(--display);font-size:13px;font-weight:700;fill:var(--ink);opacity:0;
  transition:opacity 300ms var(--ease) 1.05s;}
.seen .lc .lc-line{transition:stroke-dashoffset 1200ms var(--ease) 200ms;stroke-dashoffset:0;}
.seen .lc .lc-area,.seen .lc .lc-dot,.seen .lc .lc-tag{opacity:1;}
@media (prefers-reduced-motion:reduce){
  .lc .lc-line{stroke-dashoffset:0;transition:none;}
  .lc .lc-area,.lc .lc-dot,.lc .lc-tag{opacity:1;transition:none;}
}
@media print{
  .lc .lc-line{stroke-dashoffset:0!important;}
  .lc .lc-area,.lc .lc-dot,.lc .lc-tag{opacity:1!important;}
}
```

```html
<div class="lc">
  <svg viewBox="0 0 620 220" role="img" aria-label="Monthly orders rose from 410 in June 2025 to 1,690 in July 2026, tripling over thirteen months.">
    <line class="lc-grid" x1="40" y1="180" x2="600" y2="180"/>
    <line class="lc-grid" x1="40" y1="110" x2="600" y2="110"/>
    <line class="lc-grid" x1="40" y1="40"  x2="600" y2="40"/>
    <text class="lc-axis" x="0" y="184">0</text>
    <text class="lc-axis" x="0" y="44">1.8k</text>
    <path class="lc-area" d="M40 168 L180 150 L320 108 L460 74 L600 44 L600 180 L40 180 Z"/>
    <path class="lc-line" d="M40 168 L180 150 L320 108 L460 74 L600 44"/>
    <circle class="lc-dot" cx="600" cy="44" r="4.5"/>
    <text class="lc-tag" x="592" y="30" text-anchor="end">1,690</text>
    <text class="lc-axis" x="40" y="205">Jun 25</text>
    <text class="lc-axis" x="600" y="205" text-anchor="end">Jul 26</text>
  </svg>
</div>
```

---

## Argument & structure

### Two moves

The whole solution as exactly two things, side by side, joined by "and".

```css
.sol2{width:min(100%,68rem);margin:0 auto;display:grid;grid-template-columns:1fr auto 1fr;gap:1.6rem 1.2rem;align-items:stretch;}
.sol2__step{display:flex;flex-direction:column;gap:.85rem;padding:2rem 1.8rem 2.1rem;border-radius:18px;min-height:14rem;}
.sol2__step--a{background:var(--sky);}
.sol2__step--b{background:var(--mint);}
.sol2__n{font-family:var(--ui);font-size:.78rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--blue);}
.sol2__step--b .sol2__n{color:var(--mint-ink);}
.sol2__step h3{font-size:clamp(1.9rem,3.2vw,2.6rem);letter-spacing:-.03em;line-height:1.1;}
.sol2__step p{margin-top:auto;font-size:1.08rem;line-height:1.5;color:var(--mute);max-width:28ch;}
.sol2__step p b{color:var(--ink);font-weight:700;}
.sol2__and{align-self:center;font-family:var(--ui);font-size:.82rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);}
.sol2__foot{width:min(100%,68rem);margin:1.6rem auto 0;text-align:center;font-size:1.05rem;color:var(--mute);}
.sol2__foot b{color:var(--ink);font-weight:700;}
@media (max-width:800px){.sol2{grid-template-columns:1fr;gap:1rem;} .sol2__and{justify-self:center;} .sol2__step{min-height:0;} .sol2__foot{text-align:left;}}
```

```html
<div class="sol2">
  <div class="sol2__step sol2__step--a">
    <p class="sol2__n">Move one</p>
    <h3>Read the thread as it already is</h3>
    <p>No new intake form. <b>People keep posting the way they post.</b></p>
  </div>
  <span class="sol2__and" aria-hidden="true">and</span>
  <div class="sol2__step sol2__step--b">
    <p class="sol2__n">Move two</p>
    <h3>Refuse to guess</h3>
    <p>No source, no fill. <b>An unknown is routed, not invented.</b></p>
  </div>
</div>
<p class="sol2__foot">Neither move is clever. <b>Together they are the whole system.</b></p>
```

### Versus

Two things in opposition — before/after, us/them, the two readings of a
number. Unlike *two moves*, these do not add up; one wins.

```css
.vs{width:min(100%,74rem);margin:0 auto;display:grid;grid-template-columns:1fr auto 1fr;gap:1.4rem;align-items:stretch;}
.vs__side{border-radius:16px;padding:1.6rem 1.7rem 1.8rem;display:flex;flex-direction:column;gap:.7rem;}
.vs__side--x{background:var(--grey);}
.vs__side--o{background:var(--blue);color:#fff;}
.vs__k{font-family:var(--ui);font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);}
.vs__side--o .vs__k{color:var(--mint-pale);}
.vs__side h3{font-size:clamp(1.5rem,2.4vw,2rem);letter-spacing:-.028em;line-height:1.14;}
.vs__side--o h3{color:#fff;}
.vs__side ul{margin-top:.4rem;display:grid;gap:.5rem;}
.vs__side li{font-size:.98rem;line-height:1.45;color:var(--mute);padding-left:1.1rem;position:relative;}
.vs__side li::before{content:"";position:absolute;left:0;top:.55em;width:.42rem;height:.42rem;border-radius:50%;background:var(--rule);}
.vs__side--o li{color:rgba(255,255,255,.86);}
.vs__side--o li::before{background:var(--mint-pale);}
/* :not(.vs__k) matters — the kicker is a <p> too, and would otherwise take the
   footer's rule and margin-top:auto. */
.vs__side p:not(.vs__k){margin-top:auto;padding-top:.9rem;border-top:1px solid rgba(8,20,45,.1);font-size:.9rem;line-height:1.45;color:var(--mute);}
.vs__side--o p:not(.vs__k){border-top-color:rgba(255,255,255,.24);color:rgba(255,255,255,.8);}
.vs__mid{align-self:center;font-family:var(--display);font-size:1rem;font-weight:700;letter-spacing:.12em;
  text-transform:uppercase;color:var(--mute);writing-mode:vertical-rl;}
@media (max-width:820px){.vs{grid-template-columns:1fr;} .vs__mid{writing-mode:horizontal-tb;justify-self:center;}}
```

```html
<div class="vs">
  <div class="vs__side vs__side--x">
    <p class="vs__k">What we did</p>
    <h3>Keep a table by hand</h3>
    <ul><li>Typed in one row at a time</li><li>Only grew when an order failed</li><li>51 rows after two years</li></ul>
    <p>Recorded us, not the catalogue.</p>
  </div>
  <span class="vs__mid" aria-hidden="true">versus</span>
  <div class="vs__side vs__side--o">
    <p class="vs__k">What we do now</p>
    <h3>Ask the validator about every candidate</h3>
    <ul><li>2,606 dry-run queries</li><li>Zero writes, zero orders placed</li><li>2,108 codes confirmed</li></ul>
    <p>Records the catalogue, not our history.</p>
  </div>
</div>
```

### Gap tree

One input fans into three named outcomes. The dashed blank at the top is the
question; the three cards are the ways it goes wrong.

```css
.gaptree{width:min(100%,78rem);margin:0 auto;}
.gaptree__blank{padding:1.45rem 1.8rem 1.55rem;border:1.5px dashed var(--rule);border-radius:16px;background:var(--paper);}
.gaptree__blank-k{font-family:var(--ui);font-size:.78rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin-bottom:.65rem;}
.gaptree__field{display:flex;align-items:baseline;justify-content:space-between;gap:1.4rem;
  font-family:var(--display);font-size:clamp(1.45rem,2.2vw,1.85rem);font-weight:700;letter-spacing:-.02em;color:var(--ink);}
.gaptree__empty{display:inline-flex;align-items:center;gap:.75rem;font-family:var(--text);font-size:1.05rem;font-weight:600;color:var(--mute);}
.gaptree__empty i{display:inline-block;width:clamp(8rem,14vw,12rem);height:0;border-bottom:2px solid var(--rule);font-size:0;}
.gaptree__fork{display:grid;grid-template-columns:repeat(3,1fr);height:2.7rem;margin:0 2.2rem;position:relative;}
.gaptree__fork::before{content:"";position:absolute;left:16.66%;right:16.66%;top:0;height:1.5px;background:var(--rule);}
.gaptree__fork span{position:relative;display:block;}
.gaptree__fork span::before{content:"";position:absolute;left:50%;top:0;width:1.5px;height:100%;background:var(--rule);transform:translateX(-50%);}
.gapcards{display:grid;grid-template-columns:repeat(3,1fr);gap:1.35rem;}
.gapcard{display:flex;flex-direction:column;gap:1rem;padding:1.55rem 1.5rem 1.6rem;border-radius:16px;min-height:15rem;border:1px solid transparent;}
.gapcard--a{background:var(--sky);border-color:#A8C9D6;}
.gapcard--b{background:var(--lavender);border-color:#CFC4E5;}
.gapcard--c{background:var(--blush);border-color:#E8B4B8;}
.gapcard__top{display:flex;align-items:center;justify-content:space-between;gap:.6rem;}
.gapcard__mark{width:2.35rem;height:2.35rem;border-radius:10px;display:grid;place-items:center;background:rgba(255,255,255,.72);flex:none;}
.gapcard__mark svg{width:1.2rem;height:1.2rem;display:block;}
.gapcard--a .gapcard__mark,.gapcard--a .gapcard__do{color:var(--blue);}
.gapcard--b .gapcard__mark,.gapcard--b .gapcard__do{color:var(--teal);}
.gapcard--c .gapcard__mark,.gapcard--c .gapcard__do{color:var(--crimson);}
.gapcard__do{font-family:var(--ui);font-size:.82rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;}
.gapcard__ask{font-family:var(--display);font-size:clamp(1.55rem,2.4vw,1.95rem);font-weight:700;letter-spacing:-.028em;color:var(--ink);line-height:1.15;}
.gapcard__who{margin-top:auto;display:flex;flex-wrap:wrap;gap:.45rem;align-items:center;}
.gapcard__who i{font-style:normal;font-family:var(--display);font-size:.92rem;font-weight:600;color:var(--ink);
  background:#fff;border:1px solid rgba(8,20,45,.08);padding:.55rem .85rem;border-radius:9px;letter-spacing:-.01em;}
.gapcard__who em{font-style:normal;font-family:var(--ui);font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);}
.gaptree__foot{margin-top:1.4rem;padding-top:1.15rem;border-top:1px solid var(--rule);font-size:1.05rem;color:var(--mute);text-align:center;}
.gaptree__foot b{color:var(--ink);font-weight:700;}
@media (max-width:900px){.gaptree__fork{display:none;} .gapcards{grid-template-columns:1fr;} .gapcard{min-height:0;} .gaptree__foot{text-align:left;}}
```

```html
<div class="gaptree" role="img" aria-label="One free-text colour box fans into three misses: a typo, a real colour never written down, and an answer naming no colour at all.">
  <div class="gaptree__blank">
    <div class="gaptree__blank-k">The only colour question on the form</div>
    <div class="gaptree__field"><span>Colour</span><span class="gaptree__empty"><i aria-hidden="true"></i> free text</span></div>
  </div>
  <div class="gaptree__fork" aria-hidden="true"><span></span><span></span><span></span></div>
  <div class="gapcards">
    <article class="gapcard gapcard--a">
      <div class="gapcard__top">
        <span class="gapcard__mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7V5h16v2"/><path d="M12 5v14"/><path d="M9 19h6"/></svg></span>
        <span class="gapcard__do">A typo</span>
      </div>
      <h3 class="gapcard__ask">“Parrafin”</h3>
      <div class="gapcard__who"><i>Paraffin</i><em>one letter</em></div>
    </article>
    <!-- gapcard--b, gapcard--c the same shape -->
  </div>
  <p class="gaptree__foot"><b>The cart is rejected whole</b> if any line is missing its code.</p>
</div>
```

### Steps strip

N numbered tiles, split into the ones a person keeps and the ones the work
removes. The caption row shares the same proportional split, so the ratio
carries the claim without a number being read.

```css
.steps{width:min(100%,78rem);margin:0 auto;}
.steps__row{display:grid;grid-template-columns:repeat(var(--n,14),1fr);gap:.4rem;}
.stp{display:grid;place-items:center;height:3.1rem;border-radius:9px;
  font-family:var(--display);font-size:1.05rem;font-weight:700;letter-spacing:-.02em;}
.stp--keep{background:var(--blue);color:#fff;}
.stp--gone{background:var(--grey);color:#A89F96;}
.steps__brk{display:grid;grid-template-columns:var(--split,5fr 9fr);gap:.4rem;margin-top:.45rem;}
.brk{border-radius:9px;padding:1rem 1.1rem 1.1rem;font-size:.92rem;line-height:1.5;}
.brk b{display:block;font-family:var(--ui);font-size:.7rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;margin-bottom:.45rem;}
.brk--keep{background:var(--sky);color:var(--body);} .brk--keep b{color:var(--blue);}
.brk--gone{background:var(--grey);color:var(--mute);} .brk--gone b{color:#8A7F73;}
.brk em{font-style:normal;font-weight:700;color:var(--ink);}
@media (max-width:1000px){.steps__row{grid-template-columns:repeat(7,1fr);} .steps__brk{grid-template-columns:1fr;}}
@media (max-width:640px){.steps__row{grid-template-columns:repeat(5,1fr);}}
```

```html
<div class="steps" role="img" aria-label="Fourteen steps. One to five stay with a person; six to fourteen are already in the link.">
  <div class="steps__row" style="--n:14">
    <span class="stp stp--keep">1</span><span class="stp stp--keep">2</span><span class="stp stp--keep">3</span>
    <span class="stp stp--keep">4</span><span class="stp stp--keep">5</span>
    <span class="stp stp--gone">6</span><span class="stp stp--gone">7</span><span class="stp stp--gone">8</span>
    <span class="stp stp--gone">9</span><span class="stp stp--gone">10</span><span class="stp stp--gone">11</span>
    <span class="stp stp--gone">12</span><span class="stp stp--gone">13</span><span class="stp stp--gone">14</span>
  </div>
  <div class="steps__brk" style="--split:5fr 9fr">
    <div class="brk brk--keep"><b>Steps 1–5 · still a person</b>Open the calculator, sign in, choose the type, set the <em>property</em>.</div>
    <div class="brk brk--gone"><b>Steps 6–14 · already in the link</b>Search each line, choose colour and sheen, split the cans, check out.</div>
  </div>
</div>
```

### Timeline

Dated milestones on one spine. Use for a project history or a rollout plan;
mark exactly one node as *now*.

```css
.tl{width:min(100%,78rem);margin:0 auto;position:relative;}
.tl__spine{position:absolute;left:0;right:0;top:1.05rem;height:2px;background:var(--rule);}
.tl__row{position:relative;display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:1.2rem;}
.tlp{padding-top:2.6rem;position:relative;}
.tlp::before{content:"";position:absolute;top:.5rem;left:0;width:1.15rem;height:1.15rem;border-radius:50%;
  background:var(--paper);border:2px solid var(--rule);}
.tlp--done::before{background:var(--rule);border-color:var(--rule);}
.tlp--now::before{background:var(--blue);border-color:var(--blue);box-shadow:0 0 0 5px rgba(0,64,230,.14);}
.tlp--next::before{border-style:dashed;}
.tlp i{font-style:normal;display:block;font-family:var(--ui);font-size:.7rem;font-weight:700;
  letter-spacing:.13em;text-transform:uppercase;color:var(--mute);margin-bottom:.35rem;}
.tlp--now i{color:var(--blue);}
.tlp b{display:block;font-family:var(--display);font-size:1.18rem;font-weight:700;letter-spacing:-.024em;
  color:var(--ink);line-height:1.2;margin-bottom:.4rem;}
.tlp span{display:block;font-size:.9rem;line-height:1.5;color:var(--mute);}
.slide--blue .tl__spine{background:rgba(255,255,255,.3);}
.slide--blue .tlp::before{background:var(--blue);border-color:rgba(255,255,255,.5);}
.slide--blue .tlp--now::before{background:#fff;border-color:#fff;box-shadow:0 0 0 5px rgba(255,255,255,.2);}
.slide--blue .tlp i{color:rgba(255,255,255,.7);}
.slide--blue .tlp--now i{color:var(--mint-pale);}
.slide--blue .tlp span{color:rgba(255,255,255,.82);}
@media (max-width:820px){
  .tl__spine{top:0;bottom:0;left:.55rem;right:auto;width:2px;height:auto;}
  .tl__row{grid-auto-flow:row;gap:1.6rem;}
  .tlp{padding:0 0 0 2.2rem;}
  .tlp::before{top:.1rem;}
}
```

```html
<div class="tl">
  <div class="tl__spine" aria-hidden="true"></div>
  <div class="tl__row">
    <div class="tlp tlp--done"><i>20 Jul</i><b>Read the channel</b><span>Thirteen months of orders scraped and replayed.</span></div>
    <div class="tlp tlp--done"><i>2 Aug</i><b>Enumerated the codes</b><span>2,606 dry-run queries, zero writes.</span></div>
    <div class="tlp tlp--now"><i>17 Aug · now</i><b>Live on paint orders</b><span>One market, clean orders only.</span></div>
    <div class="tlp tlp--next"><i>Next</i><b>Two Tone, then partials</b><span>Only if the first slice held.</span></div>
  </div>
</div>
```

### Layer stack

A system as horizontal bands, top to bottom. Good for "what sits on what" when
a full architecture diagram would be too much.

```css
.stk{width:min(100%,64rem);margin:0 auto;display:grid;gap:.5rem;}
.stkl{display:grid;grid-template-columns:11rem 1fr;gap:1.4rem;align-items:center;
  border-radius:12px;padding:1.05rem 1.3rem 1.1rem;}
.stkl b{font-family:var(--display);font-size:1.12rem;font-weight:700;letter-spacing:-.022em;color:var(--ink);line-height:1.2;}
.stkl b em{font-style:normal;display:block;font-family:var(--ui);font-size:.66rem;font-weight:700;
  letter-spacing:.13em;text-transform:uppercase;color:var(--mute);margin-bottom:.25rem;}
.stkl span{font-size:.94rem;line-height:1.5;color:var(--mute);}
.stkl span code{background:rgba(255,255,255,.6);border-radius:4px;padding:.05em .35em;}
.stkl--1{background:var(--sky);}
.stkl--2{background:var(--lavender);}
.stkl--3{background:var(--mint);}
.stkl--4{background:var(--grey);}
.stkl--hot{background:var(--blue);}
.stkl--hot b{color:#fff;} .stkl--hot b em{color:var(--mint-pale);} .stkl--hot span{color:rgba(255,255,255,.86);}
@media (max-width:700px){.stkl{grid-template-columns:1fr;gap:.5rem;}}
```

```html
<div class="stk">
  <div class="stkl stkl--1"><b><em>Surface</em>Slack thread</b><span>Where the request already lives. No new intake form.</span></div>
  <div class="stkl stkl--hot"><b><em>The agent</em>Paintbot</b><span>Extract, override from the form text, calculate, look up.</span></div>
  <div class="stkl stkl--3"><b><em>Tables</em>Colour catalogue</b><span>2,060 names, 2,108 codes, all validated.</span></div>
  <div class="stkl stkl--4"><b><em>System of record</em>Sibi</b><span>A person presses <code>Place Order</code>. Nothing exists until then.</span></div>
</div>
```

### 2×2 matrix

Two axes, four quadrants, one thing placed in each. Say what the axes mean or
it is decoration.

```css
.mtx{width:min(100%,58rem);margin:0 auto;display:grid;grid-template-columns:2.4rem 1fr;grid-template-rows:1fr 2.4rem;gap:.6rem;}
.mtx__grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:.6rem;}
.mtq{border-radius:14px;padding:1.2rem 1.3rem;min-height:9.5rem;display:flex;flex-direction:column;gap:.45rem;background:var(--grey);}
.mtq i{font-style:normal;font-family:var(--ui);font-size:.66rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--mute);}
.mtq b{font-family:var(--display);font-size:1.25rem;font-weight:700;letter-spacing:-.026em;color:var(--ink);line-height:1.15;}
.mtq span{font-size:.9rem;line-height:1.45;color:var(--mute);margin-top:auto;}
.mtq--win{background:var(--blue);} .mtq--win i{color:var(--mint-pale);} .mtq--win b{color:#fff;} .mtq--win span{color:rgba(255,255,255,.84);}
.mtq--ok{background:var(--mint);} .mtq--ok i{color:var(--mint-ink);}
.mtq--meh{background:var(--peach);} .mtq--meh i{color:var(--amber-ink);}
.mtx__y,.mtx__x{display:flex;align-items:center;justify-content:center;gap:.5rem;
  font-family:var(--ui);font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);}
.mtx__y{writing-mode:vertical-rl;transform:rotate(180deg);}
.mtx__x{grid-column:2;}
@media (max-width:700px){.mtx{grid-template-columns:1fr;} .mtx__y{writing-mode:horizontal-tb;transform:none;} .mtx__grid{grid-template-columns:1fr;grid-template-rows:none;} .mtx__x{grid-column:1;}}
```

```html
<div class="mtx">
  <div class="mtx__y" aria-hidden="true">← low volume &nbsp;·&nbsp; high volume →</div>
  <div class="mtx__grid">
    <div class="mtq mtq--win"><i>Start here</i><b>High volume, decided inputs</b><span>Whiteout, one market. What shipped.</span></div>
    <div class="mtq mtq--meh"><i>Later</i><b>High volume, free text</b><span>Partials. Needs the catalogue first.</span></div>
    <div class="mtq mtq--ok"><i>Cheap win</i><b>Low volume, decided</b><span>Top-ups. Works already, barely matters.</span></div>
    <div class="mtq"><i>Not now</i><b>Low volume, free text</b><span>One-offs. A person is faster.</span></div>
  </div>
  <div class="mtx__x" aria-hidden="true">← inputs already decided &nbsp;·&nbsp; free text →</div>
</div>
```

### Then-chain

Three or four sequenced cards, each a "then". Colour-runs from blue outward so
the first one reads as now.

```css
.nextchain{display:grid;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));gap:.7rem;margin-top:1.1rem;}
.nextstep{border-radius:9px;padding:1rem 1.05rem;min-height:8.2rem;display:flex;flex-direction:column;gap:.35rem;}
.nextstep__k{font-family:var(--ui);font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;}
.nextstep__t{font-family:var(--display);font-size:1.12rem;font-weight:700;letter-spacing:-.02em;line-height:1.2;}
.nextstep__d{font-size:.88rem;line-height:1.4;margin-top:auto;}
.nextstep--0{background:var(--blue);color:#fff;}
.nextstep--0 .nextstep__k{color:var(--mint-pale);} .nextstep--0 .nextstep__d{color:rgba(255,255,255,.78);}
.nextstep--1{background:var(--mint);color:var(--ink);}
.nextstep--1 .nextstep__k,.nextstep--1 .nextstep__d{color:var(--mint-ink);}
.nextstep--2{background:var(--sky);color:var(--ink);}
.nextstep--2 .nextstep__k,.nextstep--2 .nextstep__d{color:var(--blue);}
.nextstep--3{background:var(--lavender);color:var(--ink);}
.nextstep--3 .nextstep__k,.nextstep--3 .nextstep__d{color:var(--teal);}
```

```html
<p class="section-split"><i>3.3</i>Next steps if the pilot worked</p>
<div class="nextchain">
  <div class="nextstep nextstep--0"><span class="nextstep__k">Now</span><span class="nextstep__t">Proven</span><span class="nextstep__d">Clean orders, one market</span></div>
  <div class="nextstep nextstep--1"><span class="nextstep__k">Then</span><span class="nextstep__t">Two Tone</span><span class="nextstep__d">Then partials</span></div>
  <div class="nextstep nextstep--2"><span class="nextstep__k">Then</span><span class="nextstep__t">Other teams</span><span class="nextstep__d">Appliances, then materials</span></div>
</div>
```

### Tiers

A closed vocabulary printed in red / amber / green, so the audience learns the
three words the system can say.

```css
.tiers{width:min(100%,78rem);margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:1.1rem;}
.tier{border-radius:15px;padding:1.3rem 1.35rem 1.4rem;display:flex;flex-direction:column;gap:.85rem;}
.tier--r{background:var(--blush);} .tier--y{background:var(--peach);} .tier--g{background:var(--mint);}
.tier__h{font-family:var(--display);font-size:1.32rem;font-weight:700;letter-spacing:-.028em;color:var(--ink);line-height:1.15;}
.tier__h em{font-style:normal;display:block;font-family:var(--ui);font-size:.68rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;margin-bottom:.35rem;}
.tier--r .tier__h em{color:var(--crimson);}
.tier--y .tier__h em{color:var(--amber-ink);}
.tier--g .tier__h em{color:var(--mint-ink);}
.tchips{display:flex;flex-wrap:wrap;gap:.35rem;}
.tchip{font-family:var(--ui);font-size:.76rem;font-weight:600;background:rgba(255,255,255,.78);border-radius:100px;padding:.3rem .65rem;color:var(--ink);}
.tier__n{margin-top:auto;font-size:.88rem;line-height:1.5;color:var(--body);}
.tier__n b{color:var(--ink);font-weight:700;}
.tiers__foot{width:min(100%,78rem);margin:1.4rem auto 0;padding-top:1.1rem;border-top:1px solid var(--rule);font-size:1rem;line-height:1.55;color:var(--mute);}
.tiers__foot b{color:var(--ink);font-weight:700;}
@media (max-width:1000px){.tiers{grid-template-columns:1fr;}}
```

```html
<div class="tiers">
  <div class="tier tier--r">
    <p class="tier__h"><em>🔴 Hold</em>Something is genuinely undecided</p>
    <div class="tchips"><span class="tchip">no tint code</span><span class="tchip">contradictory sheen</span></div>
    <p class="tier__n"><b>Nothing is built.</b> The question goes to a named owner.</p>
  </div>
  <div class="tier tier--y">
    <p class="tier__h"><em>🟡 Ask</em>Buildable, with one assumption</p>
    <div class="tchips"><span class="tchip">inferred lockbox</span><span class="tchip">store guessed</span></div>
    <p class="tier__n">The cart is built and <b>the assumption is named in the reply.</b></p>
  </div>
  <div class="tier tier--g">
    <p class="tier__h"><em>🟢 Auto</em>Every field has a source</p>
    <div class="tchips"><span class="tchip">catalogue hit</span><span class="tchip">form text agrees</span></div>
    <p class="tier__n">A link, ready to place. <b>A person still presses the button.</b></p>
  </div>
</div>
<p class="tiers__foot">Three words, and no fourth. <b>An agent that can only say three things can be audited.</b></p>
```

### Risk + guardrail

A risk stated plainly, with what stops it sitting immediately beside it. Never
list risks without the paired guardrail.

```css
.riskrow{display:grid;grid-template-columns:1fr 1.15fr;gap:1.1rem 1.6rem;align-items:start;}
.risk{border-top:2px solid var(--rule);padding-top:.85rem;}
.risk__t{font-family:var(--display);font-size:1.15rem;font-weight:700;color:var(--ink);letter-spacing:-.02em;line-height:1.2;margin-bottom:.45rem;}
.risk__t i{font-style:normal;font-family:var(--ui);font-size:.72rem;color:var(--crimson);letter-spacing:.1em;margin-right:.5rem;}
.risk p{font-size:.95rem;line-height:1.5;color:var(--mute);}
.risk p b{color:var(--ink);font-weight:700;}
.guard{background:var(--mint);border-radius:8px;padding:.85rem 1rem;font-size:.92rem;line-height:1.5;color:var(--mint-ink);}
.guard b{display:block;font-family:var(--ui);font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);margin-bottom:.3rem;}
@media (max-width:640px){.riskrow{grid-template-columns:1fr;}}
```

```html
<div class="riskrow">
  <div class="risk">
    <p class="risk__t"><i>R1</i>The source of truth gets overwritten</p>
    <p>Someone answers in the thread and the file is never updated. <b>The agent is reading a stale reply.</b></p>
  </div>
  <div class="guard"><b>Guardrail</b>A person always approves, and the reply is regenerated from the thread each run.</div>
</div>
```

### Do / don't

Two columns of short rules. Use when the deck is teaching a practice, not
reporting a result.

```css
.dd{width:min(100%,72rem);margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;}
.ddc{border-radius:14px;padding:1.3rem 1.4rem 1.4rem;}
.ddc--do{background:var(--mint);}
.ddc--dont{background:var(--blush);}
.ddc h4{font-family:var(--ui);font-size:.72rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;margin-bottom:.9rem;}
.ddc--do h4{color:var(--mint-ink);}
.ddc--dont h4{color:var(--crimson);}
/* The marker is absolute, not a grid/flex item — otherwise a <b> inside the
   line becomes its own item and collapses into the marker column. */
.ddc li{position:relative;padding:.42rem 0 .42rem 1.7rem;
  font-size:.98rem;line-height:1.45;color:var(--body);border-top:1px solid rgba(8,20,45,.07);}
.ddc li:first-child{border-top:0;}
.ddc li b{color:var(--ink);font-weight:700;}
.ddc li::before{content:"✓";position:absolute;left:0;top:.42rem;
  font-family:var(--ui);font-weight:700;font-size:.86rem;line-height:1.45;color:var(--mint-ink);}
.ddc--dont li::before{content:"✕";color:var(--crimson);}
@media (max-width:700px){.dd{grid-template-columns:1fr;}}
```

```html
<div class="dd">
  <div class="ddc ddc--do">
    <h4>Do</h4>
    <ul>
      <li>Fill a field only when <b>a source says so</b></li>
      <li>Send the question to <b>a named owner</b></li>
      <li>Let the deterministic pass <b>outrank the model</b></li>
    </ul>
  </div>
  <div class="ddc ddc--dont">
    <h4>Don't</h4>
    <ul>
      <li>Pick the likelier of two contradictory answers</li>
      <li>Turn an unknown into a default</li>
      <li>Hold an order to protect the agent's record</li>
    </ul>
  </div>
</div>
```

---

## Voice & text

### Pull quote

A real sentence from a real person, in the serif, at size. Attribute it or cut
it.

```css
.pq{width:min(100%,52rem);margin:0 auto;}
.pq blockquote{margin:0;font-family:var(--display);font-weight:700;
  font-size:clamp(1.9rem,3.6vw,3.1rem);line-height:1.16;letter-spacing:-.032em;color:var(--ink);}
.pq blockquote::before{content:"“";}
.pq blockquote::after{content:"”";}
.pq em{font-style:normal;color:var(--blue);}
.pq figcaption{margin-top:1.6rem;padding-top:1rem;border-top:1px solid var(--rule);
  font-size:.95rem;line-height:1.45;color:var(--mute);}
.pq figcaption b{display:block;font-family:var(--ui);font-size:.76rem;font-weight:700;
  letter-spacing:.14em;text-transform:uppercase;color:var(--blue);margin-bottom:.3rem;}
.slide--blue .pq blockquote{color:#fff;}
.slide--blue .pq em{color:var(--mint-pale);}
.slide--blue .pq figcaption{color:rgba(255,255,255,.78);border-top-color:rgba(255,255,255,.26);}
.slide--blue .pq figcaption b{color:var(--mint-pale);}
```

```html
<section class="slide slide--blue" data-section="1" data-title="What ops said">
  <figure class="pq">
    <blockquote>I don't need it to be right. I need it to <em>tell me when it isn't</em>.</blockquote>
    <figcaption><b>Paint operations</b>In the channel, 4 August 2026 — the sentence the whole design came from.</figcaption>
  </figure>
</section>
```

### Callout bar

One sentence that must not be missed, as a band. At most one per slide, and
rarely more than three in a deck.

```css
.callout{width:min(100%,76rem);margin:1.4rem auto 0;display:flex;align-items:flex-start;gap:1rem;
  border-radius:12px;padding:1.05rem 1.25rem;background:var(--blue);color:#fff;
  font-size:1.06rem;line-height:1.5;}
.callout b{font-weight:700;color:#fff;}
.callout i{font-style:normal;flex:none;font-family:var(--ui);font-size:.68rem;font-weight:700;
  letter-spacing:.13em;text-transform:uppercase;color:var(--mint-pale);padding-top:.24em;}
.callout--quiet{background:var(--grey);color:var(--body);}
.callout--quiet b{color:var(--ink);}
.callout--quiet i{color:var(--blue);}
.callout--warn{background:var(--blush);color:#8A2E2E;}
.callout--warn b{color:var(--crimson);}
.callout--warn i{color:var(--crimson);}
```

```html
<p class="callout"><i>The point</i><b>Nothing exists in the system of record until a person presses the button.</b> Everything upstream is a draft that can be thrown away.</p>
```

### Definitions

Terms the audience needs before the next slide makes sense. Two columns, no
prose.

```css
.defs{width:min(100%,74rem);margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:.2rem 2.4rem;}
.def{display:grid;grid-template-columns:11rem 1fr;gap:1rem;align-items:baseline;
  padding:.72rem 0;border-top:1px solid var(--rule-soft);}
.def:first-child,.def:nth-child(2){border-top:1.5px solid var(--rule);}
.def dt{font-family:var(--display);font-size:1rem;font-weight:700;color:var(--ink);letter-spacing:-.018em;line-height:1.25;}
.def dt code{font-size:.92em;}
.def dd{margin:0;font-size:.92rem;line-height:1.5;color:var(--mute);}
.def dd b{color:var(--ink);font-weight:700;}
@media (max-width:820px){.defs{grid-template-columns:1fr;} .def:nth-child(2){border-top:1px solid var(--rule-soft);}}
```

```html
<dl class="defs">
  <div class="def"><dt>Tint code</dt><dd>The identifier the supplier accepts. <b>Not the colour's name.</b></dd></div>
  <div class="def"><dt>Form text</dt><dd>The words a person typed, kept verbatim. Outranks the model.</dd></div>
  <div class="def"><dt><code>reviewOrder</code></dt><dd>The supplier's own dry run. Validates a cart and <b>places nothing</b>.</dd></div>
  <div class="def"><dt>Hold</dt><dd>A refusal to build, with the missing decision named.</dd></div>
</dl>
```

### Verification list

How each claim in the deck can be checked. The slide that makes the rest of
the deck trustworthy.

```css
.veri{display:grid;gap:.55rem;}
.vr{display:grid;grid-template-columns:auto 1fr;gap:.85rem;align-items:baseline;
  padding:.7rem .9rem;border-radius:9px;background:#fff;border:1px solid var(--rule);}
.vr em{font-style:normal;font-family:var(--display);font-size:1.02rem;font-weight:700;color:var(--blue);letter-spacing:-.02em;white-space:nowrap;}
.vr span{font-size:.92rem;line-height:1.5;color:var(--mute);}
.vr span b{color:var(--ink);font-weight:700;}
```

```html
<div class="veri">
  <div class="vr"><em>2,108 codes</em><span>Re-run <code>scripts/enumerate.ts</code>: <b>2,606 queries, zero writes</b>, verdicts written to <code>out/codes.json</code>.</span></div>
  <div class="vr"><em>13,904 orders</em><span>Counted from <code>channel scrape/</code>, one row per post. <b>Deduped on message id.</b></span></div>
</div>
```

### Annotations

Numbered callouts *beside* a mock or screenshot, pointing at its parts. Pairs
with the screenshot frame or the message mock.

```css
.anns{display:grid;gap:.9rem;}
.ann{border-left:2px solid var(--blue);padding-left:.9rem;}
.ann b{display:block;font-family:var(--display);font-size:.98rem;font-weight:700;color:var(--ink);letter-spacing:-.018em;line-height:1.2;margin-bottom:.3rem;}
.ann span{display:block;font-size:.87rem;line-height:1.5;color:var(--mute);}
.ann span em{font-style:normal;color:var(--ink);font-weight:600;}
.ann--mute{border-left-color:var(--rule);}
```

```html
<div class="anns">
  <div class="ann"><b>The line table</b><span>Every line with its code, so ops can check it <em>without opening the cart</em>.</span></div>
  <div class="ann"><b>The traffic light</b><span>One of three words. <em>Never a percentage.</em></span></div>
  <div class="ann ann--mute"><b>The link</b><span>A prefilled cart. Builds nothing until pressed.</span></div>
</div>
```

---

## Reference & data

### Table

The plain one. Reach for this before inventing a layout for tabular facts.

```css
.tbl{width:min(100%,80rem);margin:0 auto;border-collapse:collapse;}
.tbl th{font-family:var(--ui);font-size:.64rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;
  color:var(--mute);text-align:left;padding:0 1rem .55rem 0;border-bottom:1.5px solid var(--rule);}
.tbl td{padding:.75rem 1rem .78rem 0;border-bottom:1px solid var(--rule-soft);vertical-align:top;
  font-size:.92rem;line-height:1.45;color:var(--mute);}
.tbl td:last-child,.tbl th:last-child{padding-right:0;}
.tbl .k{color:var(--ink);}
.tbl .k b{display:block;font-family:var(--display);font-size:1rem;font-weight:700;letter-spacing:-.018em;}
.tbl .n{font-family:var(--display);font-weight:700;color:var(--ink);text-align:right;}
.tbl th.n{text-align:right;}
.tbl .good{color:var(--mint-ink);font-weight:600;}
.tbl .bad{color:var(--crimson);font-weight:600;}
.tbl tr.is-hot td{background:var(--sky);}
@media (max-width:640px){.tbl{font-size:.85rem;}}
```

```html
<table class="tbl">
  <thead><tr><th>Order type</th><th class="n">Orders</th><th class="n">Median gal</th><th>Clears first pass</th></tr></thead>
  <tbody>
    <tr class="is-hot"><td class="k"><b>Whiteout</b>fixed palette</td><td class="n">6,204</td><td class="n">39</td><td class="good">98%</td></tr>
    <tr><td class="k"><b>Two Tone</b>two groups</td><td class="n">3,110</td><td class="n">34</td><td class="good">91%</td></tr>
    <tr><td class="k"><b>Partial</b>free text</td><td class="n">2,806</td><td class="n">12</td><td class="bad">61%</td></tr>
  </tbody>
</table>
```

### Was / now

The same real cases, before and after, with the reason. The most persuasive
table in a pilot deck, because it is falsifiable.

```css
.wn{width:min(100%,80rem);margin:0 auto;border-collapse:collapse;}
.wn th{font-family:var(--ui);font-size:.64rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;
  color:var(--mute);text-align:left;padding:0 .9rem .55rem 0;border-bottom:1.5px solid var(--rule);}
.wn td{padding:.75rem .9rem .78rem 0;border-bottom:1px solid var(--rule-soft);vertical-align:top;font-size:.9rem;line-height:1.4;}
.wn td:last-child,.wn th:last-child{padding-right:0;}
.wn .o b{display:block;font-family:var(--display);font-size:1rem;font-weight:700;color:var(--ink);letter-spacing:-.018em;}
.wn .o span{display:block;font-size:.75rem;color:var(--mute);margin-top:.15rem;}
.wn .was{color:#A0413F;}
.wn .now{color:var(--mint-ink);}
.wn .why{color:var(--mute);font-size:.84rem;}
@media (max-width:640px){.wn{font-size:.85rem;}}
```

```html
<table class="wn">
  <thead><tr><th>Order</th><th>Was</th><th>Now</th><th>Why it changed</th></tr></thead>
  <tbody>
    <tr>
      <td class="o"><b>237 Geddis Rd</b><span>Two Tone · reported by ops</span></td>
      <td class="was">86 gal, <b>primer twice</b></td>
      <td class="now">52 gal, primer once</td>
      <td class="why">One answer was filed under two fields. The form text now outranks the model.</td>
    </tr>
  </tbody>
</table>
```

### Spec table

Options with what each returns and whether it is on. Use for models, flags,
endpoints, vendors — anything with a fixed set of properties.

```css
.rd{width:min(100%,80rem);margin:0 auto;border-collapse:collapse;}
.rd th{font-family:var(--ui);font-size:.64rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;
  color:var(--mute);text-align:left;padding:0 1rem .55rem 0;border-bottom:1.5px solid var(--rule);}
.rd td{padding:.85rem 1rem .88rem 0;border-bottom:1px solid var(--rule-soft);vertical-align:top;font-size:.92rem;line-height:1.45;color:var(--mute);}
.rd td:last-child,.rd th:last-child{padding-right:0;}
.rd .m b{display:block;font-family:var(--mono);font-size:.92rem;font-weight:700;color:var(--ink);}
.rd .m span{display:block;font-size:.78rem;color:var(--mute);margin-top:.2rem;}
.rd .ret{color:var(--ink);font-weight:600;}
.rd .df{font-family:var(--ui);font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;}
.rd .df--on{color:var(--mint-ink);}
.rd .df--off{color:var(--amber-ink);}
```

```html
<table class="rd">
  <thead><tr><th>Reader</th><th>What it may return</th><th>On by default</th></tr></thead>
  <tbody>
    <tr><td class="m"><b>extract-v3</b><span>structured pass</span></td><td class="ret">A field, or <code>unknown</code></td><td class="df df--on">Yes</td></tr>
    <tr><td class="m"><b>form-overrides</b><span>deterministic</span></td><td class="ret">A correction, or nothing</td><td class="df df--on">Yes</td></tr>
    <tr><td class="m"><b>freeform-guess</b><span>experimental</span></td><td class="ret">A best-effort colour name</td><td class="df df--off">No</td></tr>
  </tbody>
</table>
```

### Code

A snippet, when the exact text is the argument (a schema, a prompt rule, a
query). Keep it under about fifteen lines and highlight by hand with `<b>`.

```css
.code{width:min(100%,72rem);margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid var(--rule);background:#fff;}
.code__t{display:flex;align-items:center;justify-content:space-between;gap:1rem;
  padding:.6rem .9rem;background:var(--grey);border-bottom:1px solid var(--rule);}
.code__t span{font-family:var(--mono);font-size:.78rem;color:var(--ink);}
.code__t i{font-style:normal;font-family:var(--ui);font-size:.64rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--mute);}
.code pre{margin:0;padding:1rem 1.1rem;overflow-x:auto;font-family:var(--mono);font-size:.86rem;line-height:1.65;color:var(--body);}
.code pre b{font-weight:400;background:var(--sky);color:var(--ink);border-radius:3px;padding:.05em .25em;}
.code pre em{font-style:normal;color:var(--mute);}
.code pre s{text-decoration:none;background:var(--blush);color:#8A2E2E;border-radius:3px;padding:.05em .25em;}
```

```html
<div class="code">
  <div class="code__t"><span>prompts/extract.md</span><i>the whole guardrail</i></div>
<pre><em># Rule 1</em>
Every field you fill MUST carry the source it came from.
<b>No source, no fill.</b>

<em># Rule 2</em>
If two sources disagree, return <b>contradictory</b> and name both.
<s>Never pick the likelier one.</s></pre>
</div>
```

---

## Media

### Screenshot frame

A real screenshot, framed so it reads as a captured artefact rather than a
floating image. Point at it with **annotations** in the next column.

```css
.shot{width:100%;border-radius:12px;overflow:hidden;border:1px solid var(--rule);background:#fff;
  box-shadow:0 18px 40px -28px rgba(8,20,45,.5);}
.shot__bar{display:flex;align-items:center;gap:.45rem;padding:.5rem .7rem;background:var(--grey);border-bottom:1px solid var(--rule);}
.shot__bar i{width:.55rem;height:.55rem;border-radius:50%;background:var(--rule);flex:none;}
.shot__bar span{margin-left:.5rem;font-family:var(--mono);font-size:.72rem;color:var(--mute);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.shot img{display:block;width:100%;height:auto;}
.shot__cap{padding:.6rem .8rem;border-top:1px solid var(--rule-soft);font-size:.8rem;line-height:1.45;color:var(--mute);}
.shotrow{width:min(100%,80rem);margin:0 auto;display:grid;grid-template-columns:1.55fr 1fr;gap:1.8rem;align-items:start;}
@media (max-width:900px){.shotrow{grid-template-columns:1fr;}}
```

```html
<div class="shotrow">
  <figure class="shot">
    <div class="shot__bar" aria-hidden="true"><i></i><i></i><i></i><span>app.sibi.com/ordering/review</span></div>
    <img src="shots/review.png" alt="The review step of the ordering flow, with four paint lines and their tint codes.">
    <figcaption class="shot__cap">Captured 14 Aug 2026. Codes visible on every line.</figcaption>
  </figure>
  <div class="anns">
    <div class="ann"><b>Every line has a code</b><span>The cart is rejected whole if one is missing.</span></div>
    <div class="ann ann--mute"><b>Place Order</b><span>Still a person. Always.</span></div>
  </div>
</div>
```

### Split media

Half image, half argument. The copy side owns the reading order, so put it
first on narrow screens.

```css
.split{width:min(100%,82rem);margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:2.4rem;align-items:center;}
.split--wide{grid-template-columns:1fr 1.5fr;}
.split__media{border-radius:14px;overflow:hidden;background:var(--grey);}
.split__media img,.split__media svg{display:block;width:100%;height:auto;}
.split__copy h3{font-size:clamp(1.7rem,2.8vw,2.3rem);line-height:1.12;letter-spacing:-.03em;margin-bottom:.9rem;}
.split__copy p{font-size:1.05rem;line-height:1.55;color:var(--mute);}
.split__copy p + p{margin-top:.8rem;}
.split__copy p b{color:var(--ink);font-weight:700;}
@media (max-width:900px){
  .split,.split--wide{grid-template-columns:1fr;gap:1.4rem;}
  .split__media{order:2;}
}
```

```html
<div class="split">
  <div class="split__copy">
    <h3>The reply <em>is</em> the file</h3>
    <p>There is no separate record to keep in sync. The thread holds the request, and the reply holds everything the agent decided and why.</p>
    <p><b>Regenerated on every run</b>, so a stale reply is impossible by construction.</p>
  </div>
  <figure class="split__media"><img src="shots/reply.png" alt="A Slack reply containing a line table, a traffic light, and a cart link."></figure>
</div>
```

### Legend key

The key for a diagram, in the diagram's own colours. Any composition with more
than two fills needs one.

```css
.key{display:flex;flex-wrap:wrap;gap:.4rem 1.3rem;margin-top:1rem;
  font-family:var(--ui);font-size:.78rem;color:var(--mute);}
.key span{display:inline-flex;align-items:center;gap:.45rem;}
.key i{width:.85rem;height:.85rem;border-radius:3px;flex:none;background:var(--grey);}
.key b{color:var(--ink);font-weight:600;}
.key .k-blue{background:var(--blue);}
.key .k-mint{background:var(--mint);}
.key .k-sky{background:var(--sky);}
.key .k-peach{background:var(--peach);}
.key .k-blush{background:var(--blush);}
.key .k-dash{background:none;border:1.5px dashed var(--rule);border-radius:3px;}
.slide--blue .key{color:rgba(255,255,255,.78);}
.slide--blue .key b{color:#fff;}
```

```html
<p class="key">
  <span><i class="k-blue"></i><b>The agent</b></span>
  <span><i class="k-mint"></i>cleared</span>
  <span><i class="k-peach"></i>assumption named</span>
  <span><i class="k-blush"></i>held</span>
  <span><i class="k-dash"></i>never decided</span>
</p>
```

---

## Live

These three want the scene runner. See
[Live demo slides](SKILL.md#live-demo-slides) for how the runner is wired; the
chrome (`.demo`, `.stage`, `.cap2`, `.beats`, `.dbtn`, `.live`) is already in
`template.html`.

### Message mock

A chat message as the audience actually reads it — avatar, table, footnote,
call to action. Pair with **annotations** to name its parts.

```css
.sm{background:#fff;border:1px solid var(--rule);border-radius:12px;padding:1rem 1.1rem 1.15rem;}
.sm__head{display:flex;align-items:center;gap:.55rem;margin-bottom:.7rem;}
.sm__av{width:1.65rem;height:1.65rem;border-radius:5px;background:var(--blue);color:#fff;
  display:grid;place-items:center;font-family:var(--display);font-size:.9rem;font-weight:700;}
.sm__who{font-family:var(--display);font-size:.95rem;font-weight:700;color:var(--ink);letter-spacing:-.015em;}
.sm__who i{font-style:normal;font-family:var(--ui);font-size:.56rem;font-weight:700;letter-spacing:.1em;
  background:var(--grey);color:var(--mute);border-radius:3px;padding:.12rem .3rem;margin-left:.4rem;vertical-align:.12em;}
.sm__t{font-size:.72rem;color:var(--mute);}
.sm__ping{font-size:.85rem;color:var(--blue);font-weight:500;margin-bottom:.45rem;}
.sm__ttl{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;margin-bottom:.6rem;}
.sm__ttl b{font-family:var(--display);font-size:1.02rem;font-weight:700;color:var(--ink);letter-spacing:-.018em;}
.sm__tier{font-family:var(--ui);font-size:.76rem;font-weight:700;border-radius:100px;padding:.2rem .6rem;}
.sm__tier--g{background:var(--mint);color:var(--mint-ink);}
.sm__tier--y{background:var(--peach);color:var(--amber-ink);}
.sm__tier--r{background:var(--blush);color:var(--crimson);}
.sm__tbl{width:100%;border-collapse:collapse;font-size:.8rem;}
.sm__tbl th{font-family:var(--ui);font-size:.6rem;font-weight:700;letter-spacing:.11em;text-transform:uppercase;
  color:var(--mute);text-align:left;padding:.3rem .5rem .3rem 0;border-bottom:1px solid var(--rule);}
.sm__tbl td{padding:.34rem .5rem .34rem 0;border-bottom:1px solid var(--rule-soft);color:var(--body);vertical-align:top;}
.sm__tbl td:last-child,.sm__tbl th:last-child{text-align:right;padding-right:0;}
.sm__tbl .n{font-family:var(--display);font-weight:700;color:var(--ink);}
.sm__foot{margin-top:.75rem;font-size:.76rem;line-height:1.5;color:var(--mute);}
.sm__foot b{color:var(--ink);font-weight:600;}
.sm__cta{display:inline-block;margin-top:.8rem;font-family:var(--ui);font-size:.8rem;font-weight:600;
  color:var(--blue);background:var(--sky);border:1px solid #BBD3F5;border-radius:7px;padding:.42rem .8rem;text-decoration:none;}
```

```html
<div class="sm">
  <div class="sm__head">
    <span class="sm__av" aria-hidden="true">P</span>
    <span class="sm__who">Paintbot<i>app</i></span>
    <span class="sm__t">11:04</span>
  </div>
  <p class="sm__ping">@paint-ops</p>
  <div class="sm__ttl"><b>469 Flowing Trl · Phoenix</b><span class="sm__tier sm__tier--g">🟢 Ready</span></div>
  <table class="sm__tbl">
    <thead><tr><th>Line</th><th>Code</th><th>Gal</th></tr></thead>
    <tbody>
      <tr><td>Interior walls · eggshell</td><td><code>PPG1001-1</code></td><td class="n">38</td></tr>
      <tr><td>Ceiling · flat</td><td><code>PPG1001-1</code></td><td class="n">14</td></tr>
    </tbody>
  </table>
  <p class="sm__foot"><b>One assumption:</b> lockbox inferred from the last order at this address.</p>
  <a class="sm__cta" href="#">Open prefilled cart →</a>
</div>
```

### Schema stage

The intake demo: sources arrive on the left, a schema fills in the middle with
a status and a source per row, and what could **not** be filled becomes a
routed question on the right. This is the stage that makes "it refuses to
guess" visible.

```css
.stage--schema{display:grid;grid-template-columns:13rem 1fr 15rem;gap:.85rem;align-items:start;}
/* left: what arrives */
.src{background:#fff;border:1px solid var(--rule);border-radius:8px;padding:.5rem .6rem;margin-bottom:.4rem;
  opacity:0;transform:translateY(7px);transition:opacity 300ms var(--ease), transform 300ms var(--ease);}
.src.is-in{opacity:1;transform:none;}
.src:nth-of-type(2){transition-delay:110ms;}
.src:nth-of-type(3){transition-delay:220ms;}
.src b{display:block;font-family:var(--display);font-size:.78rem;font-weight:700;color:var(--ink);letter-spacing:-.008em;}
.src span{display:block;font-size:.7rem;color:var(--mute);margin-top:.12rem;}
.src__k{display:inline-block;font-family:var(--ui);font-size:.6rem;font-weight:700;letter-spacing:.1em;
  text-transform:uppercase;color:var(--blue);margin-bottom:.15rem;}
.ing__n{font-size:.72rem;line-height:1.4;color:var(--mute);margin-top:.7rem;border-top:1px solid var(--rule-soft);padding-top:.5rem;}
/* middle: the schema */
.sch{background:#fff;border:1px solid var(--rule);border-radius:9px;padding:.7rem .8rem .75rem;}
.sch__top{display:flex;align-items:baseline;justify-content:space-between;gap:.8rem;}
.sch__t{font-family:var(--display);font-size:.86rem;font-weight:700;color:var(--ink);letter-spacing:-.012em;}
.sch__v{font-family:var(--display);font-size:1.3rem;font-weight:700;color:var(--ink);letter-spacing:-.03em;line-height:1;}
.sch__v em{font-style:normal;font-size:.7rem;font-weight:600;color:var(--mute);margin-left:.25rem;}
.sch__v.is-hot{color:var(--crimson);}
.meter2{height:5px;border-radius:100px;background:var(--grey);overflow:hidden;margin:.45rem 0 .1rem;}
.meter2__fill{height:100%;width:0;border-radius:100px;background:var(--blue);transition:width 700ms var(--ease);}
.sch__n{font-size:.68rem;color:var(--mute);margin-bottom:.25rem;}
.rw{display:grid;grid-template-columns:1fr auto;gap:.6rem;align-items:center;padding:.26rem 0;border-top:1px solid var(--rule-soft);}
.rw__n{font-size:.82rem;color:var(--ink);line-height:1.25;}
.rw__s{display:block;font-size:.68rem;color:var(--mute);line-height:1.25;min-height:.9rem;margin-top:.05rem;
  opacity:0;transform:translateY(2px);transition:opacity 240ms var(--ease), transform 240ms var(--ease);}
.rw.is-set .rw__s{opacity:1;transform:none;}
.pill-s{font-family:var(--ui);font-size:.63rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
  border-radius:100px;padding:.16rem .5rem;white-space:nowrap;background:var(--grey);color:transparent;
  opacity:0;transform:scale(.88);transition:opacity 200ms var(--ease), transform 200ms var(--ease);}
.rw.is-set .pill-s{opacity:1;transform:none;}
.pill-s--ok{background:var(--mint);color:var(--mint-ink);}
.pill-s--amb{background:var(--peach);color:var(--amber-ink);}
.pill-s--con{background:var(--blush);color:var(--crimson);}
.pill-s--unk{background:var(--grey);color:var(--mute);}
.pill-s--as{background:var(--sky);color:var(--blue);}
.gate2{margin-top:.6rem;border-radius:7px;padding:.42rem .6rem;font-size:.78rem;line-height:1.3;
  background:var(--blush);color:#8A2E2E;opacity:0;transform:translateY(4px);
  transition:opacity 260ms var(--ease), transform 260ms var(--ease);}
.gate2.is-in{opacity:1;transform:none;}
.gate2 b{font-family:var(--display);font-weight:700;color:var(--crimson);}
.gate2.is-ok{background:var(--mint);color:#0A5F58;} .gate2.is-ok b{color:var(--mint-ink);}
.gate2.is-warn{background:var(--peach);color:#7A4A1E;} .gate2.is-warn b{color:var(--amber-ink);}
/* right: what could not be filled */
.q{border-top:1px solid var(--rule);padding:.42rem 0;opacity:0;transform:translateX(-6px);
  transition:opacity 280ms var(--ease), transform 280ms var(--ease);}
.q.is-in{opacity:1;transform:none;}
.q:nth-of-type(2){transition-delay:90ms;}
.q:nth-of-type(3){transition-delay:180ms;}
.q:nth-of-type(4){transition-delay:270ms;}
.q:nth-of-type(5){transition-delay:360ms;}
.q b{display:block;font-size:.78rem;font-weight:500;color:var(--ink);line-height:1.3;}
.q span{display:inline-block;margin-top:.2rem;font-family:var(--ui);font-size:.63rem;font-weight:700;
  letter-spacing:.08em;text-transform:uppercase;color:var(--blue);}
.q span.v-flag{color:var(--crimson);}
.q span.v-pass{color:var(--mint-ink);}
.q.is-off{opacity:.38;}
.oq__n{font-size:.72rem;line-height:1.4;color:var(--mute);margin-top:.7rem;border-top:1px solid var(--rule-soft);
  padding-top:.5rem;opacity:0;transition:opacity 280ms var(--ease) 420ms;}
.oq.is-in .oq__n{opacity:1;}
@media (max-width:1180px){
  .stage--schema{grid-template-columns:12rem 1fr;}
  .oq{grid-column:1 / -1;}
  .oq ol{display:grid;grid-template-columns:repeat(3,1fr);gap:0 1rem;}
  .q{border-top:2px solid var(--rule);}
}
@media (max-width:640px){.stage--schema{grid-template-columns:1fr;} .oq ol{grid-template-columns:1fr;}}
@media print{
  .src,.rw__s,.pill-s,.gate2,.q,.oq__n{opacity:1!important;transform:none!important;}
}
```

```html
<section class="slide slide--diag" data-section="2" data-title="Two real orders, replayed">
  <div class="demo" id="demo">
    <div class="demo__head">
      <div>
        <p class="label" style="margin-bottom:.45rem"><i>2.1</i>Two real orders, replayed</p>
        <p class="demo__pitch">Running live, and it loops. Both were reported by ops; both are fixed.</p>
      </div>
      <div class="demo__ctl">
        <span class="live" data-el="live"><i></i>Live</span>
        <button class="dbtn" data-scenario="messy" aria-pressed="true">237 Geddis Rd</button>
        <button class="dbtn" data-scenario="clean" aria-pressed="false">1411 Foxbrook Cir</button>
        <button class="dbtn" data-el="play" aria-pressed="false">&#10073;&#10073; Pause</button>
        <button class="dbtn" data-el="replay">&#8635; Restart</button>
      </div>
    </div>

    <div class="stage stage--schema" data-scenario="messy">
      <aside class="ing">
        <p class="pane__t">What arrives</p>
        <div class="src" data-el="s1"><span class="src__k">Form</span><b>Typeform</b><span>—</span></div>
        <div class="src" data-el="s2"><span class="src__k">Text</span><b>The form's own words</b><span>—</span></div>
        <div class="src" data-el="s3"><span class="src__k">Tables</span><b>Catalogue</b><span>—</span></div>
        <p class="ing__n">No new intake form. People post the way they already post.</p>
      </aside>

      <div class="sch">
        <div class="sch__top"><span class="sch__t">The order, as read</span><span class="sch__v" data-el="pct">0<em>ready</em></span></div>
        <div class="meter2"><div class="meter2__fill" data-el="fill"></div></div>
        <p class="sch__n" data-el="tally">Nothing read yet</p>
        <ul class="rows">
          <li class="rw" data-el="f0"><span class="rw__n">Address<span class="rw__s"></span></span><span class="pill-s">-</span></li>
          <li class="rw" data-el="f1"><span class="rw__n">Colour<span class="rw__s"></span></span><span class="pill-s">-</span></li>
          <li class="rw" data-el="f2"><span class="rw__n">Sheen<span class="rw__s"></span></span><span class="pill-s">-</span></li>
          <li class="rw" data-el="f3"><span class="rw__n">Gallons<span class="rw__s"></span></span><span class="pill-s">-</span></li>
        </ul>
        <p class="gate2" data-el="gate"></p>
      </div>

      <div class="oq" data-el="oq">
        <p class="pane__t">What it could not decide</p>
        <ol>
          <li class="q" data-el="q0"><b data-el="q0b"></b><span data-el="q0o"></span></li>
          <li class="q" data-el="q1"><b data-el="q1b"></b><span data-el="q1o"></span></li>
          <li class="q" data-el="q2"><b data-el="q2b"></b><span data-el="q2o"></span></li>
        </ol>
        <p class="oq__n" data-el="oqn"></p>
      </div>
    </div>

    <div class="cap2">
      <span class="cap2__k" data-el="kicker">Idle</span>
      <span class="cap2__t" data-el="caption">One post in the channel. Nothing read yet.</span>
      <span class="beats" data-el="beats"></span>
    </div>
  </div>
</section>
```

The runner for it — setters first, then scenes that only call setters:

```js
createDemo({
  root:'demo', first:'messy',
  build: function(el){
    var STATUS = { ok:'Present', amb:'Ambiguous', con:'Contradictory', unk:'Unknown', as:'Assumption' };
    var FIELDS = [], QS = [], i;
    for (i = 0; i < 4; i++) FIELDS.push(el('f' + i));
    for (i = 0; i < 3; i++) QS.push({ row: el('q' + i), q: el('q' + i + 'b'), owner: el('q' + i + 'o') });
    var srcNodes = [el('s1'), el('s2'), el('s3')];
    var pct = el('pct'), fill = el('fill'), tally = el('tally');
    var gate = el('gate'), oq = el('oq'), oqn = el('oqn');

    function setField(n, kind, note, source){
      var row = FIELDS[n], p = row.querySelector('.pill-s');
      p.className = 'pill-s pill-s--' + kind;
      p.textContent = STATUS[kind];
      row.querySelector('.rw__s').innerHTML = source ? note + ' <i>&middot; ' + source + '</i>' : note;
      row.classList.add('is-set');
    }
    function setMeter(p, t){ fill.style.width = p + '%'; pct.innerHTML = p + '%<em>ready</em>'; tally.textContent = t; }
    function setSources(list){
      srcNodes.forEach(function(nd, k){
        nd.querySelector('b').textContent = list[k][0];
        nd.querySelector('span:not(.src__k)').textContent = list[k][1];
        nd.classList.add('is-in');
      });
    }
    function setQuestions(list, note){
      QS.forEach(function(slot, k){
        if (list[k]){
          slot.q.textContent = list[k][0]; slot.owner.textContent = list[k][1];
          slot.row.style.display = ''; slot.row.classList.add('is-in');
        } else { slot.row.style.display = 'none'; }
      });
      oqn.textContent = note || '';
      oq.classList.add('is-in');
    }
    function setGate(html, cls){
      gate.innerHTML = html;
      gate.classList.remove('is-ok','is-warn');
      if (cls) gate.classList.add(cls);
      gate.classList.add('is-in');
    }
    function reset(){
      setMeter(0, 'Nothing read yet');
      FIELDS.forEach(function(row){
        row.classList.remove('is-set');
        var p = row.querySelector('.pill-s');
        p.className = 'pill-s'; p.textContent = '-';
        row.querySelector('.rw__s').innerHTML = '';
      });
      srcNodes.forEach(function(nd){ nd.classList.remove('is-in'); });
      QS.forEach(function(s){ s.row.classList.remove('is-in'); s.row.style.display = ''; s.q.textContent = ''; s.owner.textContent = ''; });
      oq.classList.remove('is-in'); oqn.textContent = '';
      gate.classList.remove('is-in','is-ok','is-warn'); gate.innerHTML = '';
    }

    return {
      reset: reset,
      scenes: {
        messy: [
          { ms:600, kicker:'Idle', caption:'One post. Nothing read yet.', apply: reset },
          { ms:1300, kicker:'Ingest', caption:'Whatever already exists arrives as-is.',
            apply: function(){
              setSources([['Typeform','Phoenix, 1,750 sq ft'],['Thread','notes, lockbox'],['Catalogue','2,060 names']]);
              setMeter(0, 'Reading 3 sources…');
            } },
          { ms:1500, kicker:'Extract', caption:'Every filled field carries its source. No source, no fill.',
            apply: function(){
              setField(0, 'ok', '469 Flowing Trl', 'Typeform');
              setMeter(25, '1 of 4 sourced');
            } },
          { ms:1600, kicker:'The unlock', caption:'The form and the notes disagree. It flags both instead of picking one.',
            apply: function(){
              setField(1, 'amb', '“Delicate whit”: typo, or another colour?', 'Typeform');
              setField(2, 'con', 'Form eggshell · notes satin', '2 sources');
              setMeter(25, '1 decided · 2 need a person, not a better prompt');
            } },
          { ms:1800, kicker:'Hour one', caption:'Three questions, each with a name on it, in parallel.',
            apply: function(){
              setField(3, 'unk', 'Gallons never decided');
              setQuestions([['Is “Delicate whit” Delicate White?','Paint ops'],['Eggshell or satin?','HPM'],['How many gallons?','HPM']],
                           'Sent to 2 owners at once, not in sequence.');
              setGate('<b>Not ready to place.</b> 3 decisions outstanding');
            } }
        ]
        /* clean: [ … the same setters, an order where the decisions got made … ] */
      }
    };
  }
});
```

### Flow diagram

Hand-drawn inline SVG where nodes and arrows appear beat by beat. The most
work of anything here, and the most convincing when the flow *is* the point.

Geometry rules that keep it legible — follow them or it smears:

- **One horizontal spine.** Inputs left, the actor in the middle, outputs
  right, all on one y. Verticals rise or drop off the actor only.
- **Nothing crosses.** Every label sits beside its own line; arrowheads land
  only on a node, never in space.
- **Centre by construction.** Content spans the viewBox inset equally on all
  four sides, so no transform is needed to centre it.
- **Labels are fill-only.** A `<g>` carrying `stroke` passes it to `<text>`
  children, which then get painted *and* outlined — that is the blur. The rule
  below switches it off.
- `shape-rendering:geometricPrecision` on shapes, normal rasterising on text.

```css
.stage--flow{display:flex;align-items:center;justify-content:center;padding:1.2rem 1.4rem;min-height:0;overflow:hidden;}
.flow-svg{width:min(100%,74rem);height:auto;display:block;margin:0 auto;overflow:visible;shape-rendering:geometricPrecision;}
.flow-svg .t-title{font-family:var(--display),sans-serif;font-weight:600;}
.flow-svg .t-label{font-family:var(--text),sans-serif;font-weight:500;}
.flow-svg .t-kicker{font-family:var(--display),sans-serif;font-weight:600;letter-spacing:.12em;}
.flow-svg .cnode,.flow-svg .carrow{opacity:0;transition:opacity 280ms var(--ease);}
.flow-svg .cnode.is-in,.flow-svg .carrow.is-in{opacity:1;}
.flow-svg .carrow path,.flow-svg .carrow line{stroke-linecap:round;stroke-linejoin:round;}
.flow-svg .carrow text{stroke:none;}          /* labels are fill-only: this is the anti-blur rule */
.flow-svg .carrow.is-pulse path,.flow-svg .carrow.is-pulse line{animation:flowPulse 1.2s ease-in-out infinite;}
@keyframes flowPulse{0%,100%{opacity:1}50%{opacity:.45}}
.flow-svg .cteam.is-hot rect{stroke:var(--blue);stroke-width:2;}
@media (prefers-reduced-motion:reduce){.flow-svg .carrow.is-pulse path,.flow-svg .carrow.is-pulse line{animation:none;}}
@media print{
  .flow-svg .cnode,.flow-svg .carrow{opacity:1!important;animation:none!important;}
  .flow-svg .cteam.is-hot rect{stroke:none;}
}
```

```html
<div class="stage stage--flow">
  <svg class="flow-svg" viewBox="0 54 1060 398" role="img" aria-label="Inputs flow into the agent; the agent runs a pipeline and posts a reply; a person places the order.">
    <defs>
      <marker id="arrGrey" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1.5 L9 5 L0 8.5 z" fill="#786E64"/></marker>
      <marker id="arrBlue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1.5 L9 5 L0 8.5 z" fill="#0040E6"/></marker>
    </defs>

    <g class="cnode" data-el="ins">
      <text class="t-kicker" x="105" y="150" text-anchor="middle" font-size="11" fill="#786E64">INPUTS</text>
      <rect x="30" y="164" width="150" height="44" rx="13" fill="#ECEAE6"/>
      <text class="t-title" x="105" y="192" text-anchor="middle" font-size="15" fill="#23201D">Typeform</text>
      <rect x="30" y="220" width="150" height="44" rx="13" fill="#ECEAE6"/>
      <text class="t-title" x="105" y="248" text-anchor="middle" font-size="15" fill="#23201D">Form text</text>
    </g>

    <g class="carrow" data-el="aIn" fill="none" stroke="#A89F96" stroke-width="1.75">
      <path d="M180 186 H248"/><path d="M180 242 H248"/><path d="M248 186 V242"/>
      <path d="M248 214 H388" marker-end="url(#arrGrey)"/>
      <text class="t-label" x="322" y="204" text-anchor="middle" font-size="12" fill="#786E64">reads</text>
    </g>

    <g class="cnode" data-el="ai">
      <rect x="390" y="190" width="220" height="104" rx="20" fill="#0040E6"/>
      <text class="t-kicker" x="500" y="218" text-anchor="middle" font-size="11" fill="#B5CAFF">#CHANNEL</text>
      <text class="t-title" x="500" y="248" text-anchor="middle" font-size="25" fill="#fff">The agent</text>
      <text class="t-label" x="500" y="273" text-anchor="middle" font-size="13" fill="#B5CAFF">extract · calculate · look up</text>
    </g>
    <!-- outputs, pipeline row, and the remaining arrows follow the same shape -->
  </svg>
</div>
```

Its runner shows and pulses groups — nothing else:

```js
createDemo({
  root:'flow', first:'flow',
  build: function(el){
    var nodes = [el('ins'), el('ai'), el('outs')];
    var arrows = [el('aIn'), el('aOut')];
    function show(list){ (Array.isArray(list)?list:[list]).forEach(function(nd){ if (nd) nd.classList.add('is-in'); }); }
    function pulse(list){
      arrows.forEach(function(nd){ if (nd) nd.classList.remove('is-pulse'); });
      (Array.isArray(list)?list:[list]).forEach(function(nd){ if (nd) nd.classList.add('is-pulse'); });
    }
    function reset(){ nodes.concat(arrows).forEach(function(nd){ if (nd) nd.classList.remove('is-in','is-pulse'); }); }
    return {
      reset: reset,
      scenes: {
        flow: [
          { ms:500,  kicker:'Idle',   caption:'Watch the arrows.', apply: reset },
          { ms:1000, kicker:'Core',   caption:'The agent sits on the thread.', apply: function(){ show(el('ai')); } },
          { ms:1300, kicker:'Inputs', caption:'The form and its own words. Text outranks the model.', apply: function(){ show([el('ins'), el('aIn')]); pulse(el('aIn')); } },
          { ms:1500, kicker:'Out',    caption:'A reply, and a link a person still has to press.', apply: function(){ show([el('outs'), el('aOut')]); pulse(el('aOut')); } }
        ]
      }
    };
  }
});
```

---

## Writing a new component

When nothing here fits, build it — in the same idiom, so the deck stays one
object:

1. **Tokens only.** No new hex values outside the `:root` block. A new colour
   means a new token, and a good reason.
2. **Serif for anything big, sans for anything uppercase.** Add the new
   uppercase class to the `.eyebrow,.label,…` selector list in the template.
3. **Tracking follows size.** Display sizes get `-.02em` to `-.045em`; body
   copy gets `0`; uppercase micro-labels get `+.1em` to `.17em`.
4. **Flat fills, one accent.** Tint backgrounds from the palette, no gradients,
   no shadows except the screenshot frame's.
5. **`width:min(100%,NNrem);margin:0 auto`** on any full-stage composition, so
   it centres and stops growing on a wide display.
6. **Reveal, don't animate for its own sake.** `data-reveal` for entrances; a
   `.seen` rule when a bar or path should draw itself.
7. **One narrow breakpoint.** Collapse to a single column at `900–1000px` and
   again at `640px`.
8. **`.slide--blue` overrides** if it will ever sit on a blue slide.
9. **Print.** If a state is revealed by script, force its finished form under
   `@media print`.
10. **Describe it.** `role="img"` plus an `aria-label` that states what the
    composition shows, in a sentence.
