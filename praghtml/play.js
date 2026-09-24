/* ── praghtml · play.js ───────────────────────────────────────────────────
   Mode 3. Ideator motion for any diagram, with zero scene code. Put
   data-play on a container and it walks itself, on a loop:

     <div class="diagram" data-play>
       <ol class="ladder">
         <li data-step data-say="Agent picks a hypothesis">…</li>
         <li data-step>…</li>
       </ol>
       <div class="forks" data-pick>   ← a branch: one child wins per pass,
         <div class="fork">…</div>        cycling keep → discard → crash
       </div>
     </div>

   Steps are every [data-step] / [data-pick] inside, in DOM order. With none
   marked, the container's direct children are the steps.

     • Starts when the diagram scrolls in (after Reveal has finished).
     • Current step .is-now, passed steps .is-done, upcoming ones wait dim.
     • Loops. Pauses off-screen, on tab switch, and on click (WCAG 2.2.2).
     • data-ms on a step or the container sets the beat (default 950).
     • prefers-reduced-motion: never starts. The diagram is simply there.   */
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const HOLD = 1400;       // hold the finished frame before rewinding
  const REST = 520;        // calm beat after the rewind
  const SETTLE = 700;      // let Reveal's entrance finish first

  document.querySelectorAll("[data-play]").forEach((root) => {
    let steps = [...root.querySelectorAll("[data-step], [data-pick]")];
    if (!steps.length) steps = [...root.children];
    if (!steps.length) return;

    const beat = Number(root.dataset.ms) || 950;
    const says = steps.some((s) => s.dataset.say);

    // Control bar: live dot, caption, beats, pause. Injected so pages stay clean.
    const bar = document.createElement("div");
    bar.className = "play-bar";
    bar.innerHTML =
      `<span class="play-dot" aria-hidden="true"></span>` +
      (says ? `<span class="play-say"></span>` : "") +
      `<span class="play-beats" aria-hidden="true">${steps.map(() => "<i></i>").join("")}</span>` +
      `<button type="button" class="play-btn" aria-pressed="false">Pause</button>`;
    root.after(bar);
    const sayEl = bar.querySelector(".play-say");
    const beats = [...bar.querySelectorAll(".play-beats i")];
    const btn = bar.querySelector(".play-btn");

    let pass = 0, i = -1, timer = null, running = false;
    let onScreen = false, userPaused = false, settled = false;

    function clearPick(g) { [...g.children].forEach((c) => c.classList.remove("is-pick", "is-dim")); }

    function reset() {
      steps.forEach((s) => {
        s.classList.remove("is-now", "is-done");
        if (s.hasAttribute("data-pick")) clearPick(s);
      });
      beats.forEach((b) => b.classList.remove("is-now", "is-done"));
      if (sayEl) sayEl.textContent = "";
      i = -1;
    }

    function show(n) {
      steps.forEach((s, k) => {
        s.classList.toggle("is-now", k === n);
        s.classList.toggle("is-done", k < n);
      });
      beats.forEach((b, k) => {
        b.classList.toggle("is-now", k === n);
        b.classList.toggle("is-done", k < n);
      });
      const s = steps[n];
      if (s.hasAttribute("data-pick")) {
        const kids = [...s.children];
        const win = kids[pass % kids.length];
        kids.forEach((c) => {
          c.classList.toggle("is-pick", c === win);
          c.classList.toggle("is-dim", c !== win);
        });
      }
      if (sayEl && s.dataset.say) sayEl.textContent = s.dataset.say;
    }

    function tick() {
      timer = null;
      if (!running) return;
      if (i + 1 >= steps.length) {
        // Hold the payoff, rewind, rest, go again.
        timer = setTimeout(() => {
          reset();
          pass += 1;
          timer = setTimeout(tick, REST);
        }, HOLD);
        return;
      }
      i += 1;
      show(i);
      timer = setTimeout(tick, Number(steps[i].dataset.ms) || beat);
    }

    function sync() {
      const go = settled && onScreen && !userPaused && !document.hidden;
      root.classList.toggle("is-playing", i >= 0 || go);
      bar.classList.toggle("is-live", go);
      btn.textContent = userPaused ? "Play" : "Pause";
      btn.setAttribute("aria-pressed", String(userPaused));
      if (go && !running) { running = true; tick(); }
      if (!go && running) { running = false; clearTimeout(timer); timer = null; }
    }

    const toggle = () => { userPaused = !userPaused; sync(); };
    btn.addEventListener("click", toggle);
    root.addEventListener("click", (e) => { if (!e.target.closest("a, button")) toggle(); });
    document.addEventListener("visibilitychange", sync);

    new IntersectionObserver((entries) => {
      onScreen = entries.some((en) => en.isIntersecting);
      if (onScreen && !settled) setTimeout(() => { settled = true; sync(); }, SETTLE);
      sync();
    }, { threshold: 0.35 }).observe(root);
  });
})();
