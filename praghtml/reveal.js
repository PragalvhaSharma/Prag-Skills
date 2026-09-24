/* ── praghtml · reveal.js ─────────────────────────────────────────────────
   Mode 1. Elements enter once as they scroll in. Paste inline at the end of
   <body>. Mark up with class="reveal", or data-reveal-stagger on a parent
   to cascade its children.                                                  */
(() => {
  // Ideally also set in <head> so nothing flashes before this runs.
  document.documentElement.classList.add("js-on");

  const targets = document.querySelectorAll(".reveal, [data-reveal-stagger]");
  if (!targets.length) return;

  // Number the children of each stagger parent so CSS can delay them in turn.
  document.querySelectorAll("[data-reveal-stagger]").forEach((parent) => {
    [...parent.children].forEach((child, i) => child.style.setProperty("--i", i));
  });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const show = (el) => el.classList.add("is-in");

  // No observer, or the viewer asked for less motion: everything is present.
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(show);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);   // once, never again
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => {
    // The first screen animates on load instead of waiting for a scroll.
    // Two frames so the hidden state paints first and the transition runs.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      requestAnimationFrame(() => requestAnimationFrame(() => show(el)));
    } else io.observe(el);
  });
})();
