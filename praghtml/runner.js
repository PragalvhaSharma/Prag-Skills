/* ── praghtml · runner.js ─────────────────────────────────────────────────
   Mode 2. A staged sequence that plays itself and loops. Lifted out of the
   old ideator skill and made stage-agnostic — it knows nothing about your markup
   beyond the handles you pass it. Paste inline; only on pages that need it.

     • Autostarts when `root` scrolls into view — there is no Play button.
     • Loops: after the last scene it holds the payoff, rewinds, replays.
     • Pauses off-screen and on tab switch; resumes clean on return.
     • Pause + Restart + click-the-stage-to-hold (WCAG 2.2.2: anything that
       auto-moves must be pausable).
     • prefers-reduced-motion: plays once, fast, then stops. Never loops.

   A scene is { id, ms, kicker, caption, apply(els) }. Keep it to 7.
   `reset(els)` must undo every class every scene adds — a loop that leaks
   state looks broken on pass two.                                           */

function collectEls(root = document) {
  const els = {};
  root.querySelectorAll("[data-el]").forEach((n) => (els[n.dataset.el] = n));
  return els;
}

function createRunner(config) {
  const {
    root,                       // element watched for visibility
    scenes,                     // array, or { scenarioName: array }
    els = collectEls(root),
    reset = () => {},
    stage = root,               // click target for pause/resume
    kickerEl, captionEl, metaEl, beatsEl,
    playBtn, restartBtn, liveEl,
    chips,                      // NodeList of [data-scenario] buttons
    loop = true,
    loopHold = 1500,            // hold the payoff frame before rewinding
    resetHold = 560,            // idle beat after the rewind
  } = config;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const keyed = Array.isArray(scenes);
  let scenario = keyed ? null : Object.keys(scenes)[0];

  let index = -1;
  let playing = false;      // runner is advancing scenes
  let userPaused = false;   // viewer pressed Pause / tapped the stage
  let onScreen = false;
  let timer = null;
  let runId = 0;

  const list = () => (keyed ? scenes : scenes[scenario]);
  const setText = (el, s) => { if (el) el.textContent = s; };

  function renderBeats() {
    if (!beatsEl) return;
    beatsEl.innerHTML = list()
      .map((_, i) => `<span class="beat" data-i="${i}"></span>`)
      .join("");
    paintBeats();
  }

  function paintBeats() {
    if (!beatsEl) return;
    beatsEl.querySelectorAll(".beat").forEach((n) => {
      const i = Number(n.dataset.i);
      n.classList.toggle("is-done", i < index);
      n.classList.toggle("is-current", i === index);
    });
  }

  function showScene(i) {
    const l = list();
    if (i < 0 || i >= l.length) return;
    index = i;
    const scene = l[i];
    scene.apply(els);
    setText(kickerEl, scene.kicker || "");
    setText(captionEl, scene.caption || "");
    setText(metaEl, `${i + 1} / ${l.length} · ${scene.id}`);
    paintBeats();
  }

  const clearTimer = () => { if (timer) { clearTimeout(timer); timer = null; } };
  const wait = (ms) => new Promise((r) => { timer = setTimeout(r, ms); });

  function syncControls() {
    if (playBtn) {
      playBtn.textContent = userPaused ? "▶ Play" : "❚❚ Pause";
      playBtn.setAttribute("aria-pressed", String(userPaused));
      playBtn.setAttribute("aria-label", userPaused ? "Play" : "Pause");
    }
    if (liveEl) liveEl.classList.toggle("is-live", playing && !userPaused);
  }

  // Run only while the viewer hasn't paused, the stage is on-screen, and the
  // tab is visible — a loop animating off-screen is wasted work.
  const canPlay = () => !userPaused && onScreen && !document.hidden;

  async function run(startAt) {
    const myRun = ++runId;
    playing = true;
    syncControls();
    let i = startAt < 0 ? 0 : startAt;

    while (myRun === runId) {
      const l = list();
      if (i >= l.length) {
        if (!loop || reduce) {
          playing = false;
          syncControls();
          setText(metaEl, "Done · Restart to replay");
          return;
        }
        setText(metaEl, "Looping…");
        await wait(reduce ? 60 : loopHold);
        if (myRun !== runId) return;
        reset(els);
        index = -1;
        paintBeats();
        await wait(resetHold);
        if (myRun !== runId) return;
        i = 0;
        continue;
      }
      showScene(i);
      await wait(reduce ? 70 : l[i].ms);
      if (myRun !== runId) return;
      i += 1;
    }
  }

  // Cancel the active runner but leave the current frame on screen.
  function halt() { runId += 1; clearTimer(); playing = false; }

  // Single source of truth: start or stop to match current state.
  function maybePlay() {
    if (canPlay()) { if (!playing) run(index); }
    else {
      if (playing) halt();
      if (userPaused) setText(metaEl, "Paused");
    }
    syncControls();
  }

  function restart() {
    userPaused = false;
    halt();
    reset(els);
    index = -1;
    paintBeats();
    maybePlay();
  }

  // --- controls ----------------------------------------------------------
  playBtn?.addEventListener("click", () => { userPaused = !userPaused; maybePlay(); });
  restartBtn?.addEventListener("click", restart);

  // Click anywhere on the stage to hold a frame — real hotspots opt out.
  stage?.addEventListener("click", (e) => {
    if (e.target.closest("[data-hotspot], a, button")) return;
    userPaused = !userPaused;
    maybePlay();
  });

  chips?.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      scenario = chip.dataset.scenario;
      if (stage) stage.dataset.scenario = scenario;
      userPaused = false;
      halt();
      reset(els);
      index = -1;
      renderBeats();
      setText(kickerEl, "Scenario");
      setText(captionEl, `“${chip.textContent}” — playing…`);
      maybePlay();
    });
  });

  // --- autoplay lifecycle -------------------------------------------------
  if ("IntersectionObserver" in window && root) {
    new IntersectionObserver(
      (entries) => { onScreen = entries.some((en) => en.isIntersecting); maybePlay(); },
      { threshold: 0.3 }
    ).observe(root);
  } else {
    onScreen = true;
  }
  document.addEventListener("visibilitychange", maybePlay);

  reset(els);
  renderBeats();
  syncControls();
  if (!("IntersectionObserver" in window)) maybePlay();

  return { restart, halt, showScene, get index() { return index; } };
}
