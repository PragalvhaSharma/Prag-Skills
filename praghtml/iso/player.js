/* praghtml · iso player. Drives one Anatomy figure inside a praghtml page.

     PLAY(root, { stops, draw, ... })    (inside a figureBlock live script)

   - Idle tour: visits each stop (or sweeps min to max), loops.
   - Pointer: move across the figure to steer it. Touch: drag sideways.
   - Keys on the focused figure: arrows step between stops; Home and End
     jump to the first and last stop (or min and max when o.step is set).
   - Pause (WCAG 2.2.2): the button under the card, or a click on the
     figure (a drag is not a click). Pause freezes every part where it
     is, springs and a steer still easing included. Steering stops the
     tour; after 3.6 s idle the tour takes over again from the nearest
     stop, holding it for one dwell, unless the reader paused.
   - Stops offscreen and in hidden tabs. Reduced motion: no tour, no
     easing; the figure rests at start and still answers keys and pointer.
     If reduced motion turns off, the tour returns unless the reader paused.
   - Marks root with data-iso-player. Until then the bridge CSS holds flow
     dashes and pulse dots still, so they stay still with JS off too.
   - draw(value, ctx) writes attributes and returns the readout text, or
     { text, busy, say }. busy keeps frames coming while a spring settles.
   - PLAY on a root that already has a player returns that player. */
(() => {
  if (window.ISO_PLAY) return;
  const players = new WeakMap();
  window.ISO_PLAY = function (root, o) {
    if (!root || !o || typeof o.draw !== "function") throw new Error("ISO_PLAY(root, { draw }) needs a root and a draw function");
    if (players.has(root)) return players.get(root);
    const stage = root.querySelector(".iso-stage");
    const svg = stage ? stage.querySelector("svg") : null;
    const readout = root.querySelector("[data-readout]");
    const bar = root.querySelector(".iso-bar");
    const btn = bar ? bar.querySelector(".play-btn") : null;
    const sayEl = bar ? bar.querySelector(".play-say") : null;
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const stops = (o.stops && o.stops.length ? o.stops : [o.min ?? 0, o.max ?? 1]).map(Number);
    const min = Number(o.min ?? Math.min(...stops));
    const max = Number(o.max ?? Math.max(...stops));
    const ladder = [...new Set(stops)].sort((a, b) => a - b);
    const sweep = o.tour === "sweep";
    const hasTour = o.tour !== false;
    const dwell = (o.dwell ?? 2200) / 1000;
    const period = (o.period ?? 6000) / 1000;
    const hold = (o.hold ?? 1400) / 1000;
    const tau = o.tau ?? 0.28;
    const rewind = Math.max(0.6, tau * 4);
    const idle = o.idle ?? 3600;
    const band = o.band ?? [0.15, 0.85];
    const eps = Math.abs(max - min) * 1e-4 || 1e-6;
    const clamp = (v) => Math.min(max, Math.max(min, v));

    let value = clamp(Number(o.start ?? stops[0]));
    let target = value;
    let paused = !hasTour; // the reader paused, or there is no tour
    let touring = hasTour; // the tour sets target; steering hands it to the reader until idle
    let frozen = false; // paused: every part holds, springs included, until steered or played
    let visible = false;
    let busy = false;
    let frame = 0;
    let last = 0;
    let clock = 0;
    let idleTimer = 0;

    const auto = () => touring && !paused && !still.matches;
    const due = () => auto() || value !== target || (busy && !frozen);
    const clockAt = (v) => {
      if (sweep) return ((v - min) / (max - min || 1)) * period;
      let best = 0;
      stops.forEach((s, i) => { if (Math.abs(s - v) < Math.abs(stops[best] - v)) best = i; });
      return best * dwell + 1e-3;
    };

    function paint(dt) {
      const out = o.draw(value, { dt, still: still.matches, target, touring: auto() });
      let text = null;
      let say;
      busy = false;
      if (typeof out === "string") text = out;
      else if (out) { text = out.text ?? null; busy = Boolean(out.busy); say = out.say; }
      if (text != null) {
        if (readout && readout.textContent !== text) readout.textContent = text;
        if (stage && stage.getAttribute("aria-valuetext") !== text) stage.setAttribute("aria-valuetext", text);
      }
      if (stage) stage.setAttribute("aria-valuenow", String(Math.round(value * 1000) / 1000));
      if (sayEl && say !== undefined && sayEl.textContent !== say) sayEl.textContent = say;
    }

    function sync() {
      root.classList.toggle("is-paused", paused || still.matches || !visible || document.hidden);
      if (bar) bar.classList.toggle("is-live", auto() && visible && !document.hidden);
      if (btn) {
        btn.textContent = paused ? "Play" : "Pause";
        btn.setAttribute("aria-pressed", String(paused));
      }
    }

    function tick(now) {
      frame = 0;
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      let direct = still.matches;
      if (auto()) {
        clock += dt;
        if (sweep) {
          const t = clock % (period + hold + rewind);
          if (t < period) { target = min + (max - min) * (t / period); direct = true; }
          else if (t < period + hold) { target = max; direct = true; }
          else target = min;
        } else {
          target = stops[Math.floor(clock / dwell) % stops.length];
        }
      }
      if (direct) value = target;
      else {
        value += (target - value) * (1 - Math.exp(-dt / tau));
        if (Math.abs(target - value) < eps) value = target;
      }
      paint(dt);
      if (visible && !document.hidden && due()) frame = requestAnimationFrame(tick);
      else last = 0;
      sync();
    }

    function run() {
      if (!frame && visible && !document.hidden && due()) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
      sync();
    }

    function steer(v) {
      touring = false;
      frozen = false;
      target = clamp(Number(v));
      clearTimeout(idleTimer);
      if (!paused && hasTour && !still.matches) {
        idleTimer = setTimeout(() => { touring = true; clock = clockAt(target); run(); }, idle);
      }
      run();
    }

    function setPaused(next) {
      paused = Boolean(next) || !hasTour;
      clearTimeout(idleTimer);
      if (next) {
        // Hold every part where it is: the tour, a steer still easing, and any spring.
        target = value;
        frozen = true;
        if (frame) { cancelAnimationFrame(frame); frame = 0; last = 0; }
      } else if (!paused) {
        frozen = false;
        touring = true;
        clock = clockAt(value);
      }
      run();
    }

    if (stage) {
      stage.setAttribute("aria-valuemin", String(min));
      stage.setAttribute("aria-valuemax", String(max));
      if (o.pointer !== false) {
        stage.addEventListener("pointermove", (event) => {
          const box = (svg || stage).getBoundingClientRect();
          if (!box.width) return;
          const share = Math.min(1, Math.max(0, ((event.clientX - box.left) / box.width - band[0]) / (band[1] - band[0])));
          steer(o.fromPointer ? o.fromPointer(share) : min + share * (max - min));
        });
        stage.addEventListener("pointerleave", () => steer(target));
      }
      // A click on the figure toggles Pause, as in play.js. A press that travelled (a drag) is not a click.
      let down = null;
      stage.addEventListener("pointerdown", (event) => {
        down = event.isPrimary && event.button === 0 ? [event.clientX, event.clientY] : null;
      });
      stage.addEventListener("click", (event) => {
        const from = down;
        down = null;
        if (!hasTour || still.matches || !from || event.target.closest("a, button")) return;
        if (Math.hypot(event.clientX - from[0], event.clientY - from[1]) > 6) return;
        setPaused(!paused);
      });
      stage.addEventListener("keydown", (event) => {
        let to = null;
        if (event.key === "ArrowRight" || event.key === "ArrowUp") {
          to = o.step ? target + o.step : ladder.find((v) => v > target + eps) ?? ladder[ladder.length - 1];
        } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
          to = o.step ? target - o.step : [...ladder].reverse().find((v) => v < target - eps) ?? ladder[0];
        } else if (event.key === "Home") to = o.step ? min : ladder[0];
        else if (event.key === "End") to = o.step ? max : ladder[ladder.length - 1];
        if (to === null) return;
        event.preventDefault();
        steer(to);
      });
    }

    if (bar && hasTour) {
      bar.hidden = false;
      if (btn) btn.addEventListener("click", () => setPaused(!paused));
    }
    document.addEventListener("visibilitychange", run);
    const onStill = () => {
      clearTimeout(idleTimer);
      if (!still.matches && !paused) { touring = true; frozen = false; clock = clockAt(value); }
      run();
    };
    if (still.addEventListener) still.addEventListener("change", onStill);
    else if (still.addListener) still.addListener(onStill);
    new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      run();
    }, { rootMargin: "120px 0px" }).observe(stage || root);

    root.setAttribute("data-iso-player", "");
    paint(0);
    sync();
    const api = {
      set: steer,
      pause: () => setPaused(true),
      play: () => setPaused(false),
      get value() { return value; },
    };
    players.set(root, api);
    return api;
  };
})();
