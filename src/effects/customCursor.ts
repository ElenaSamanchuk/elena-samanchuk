export function initCustomCursor(reducedMotion: boolean) {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (reducedMotion || !finePointer) return;

  const dot = document.createElement("div");
  dot.className = "custom-cursor__dot";
  dot.setAttribute("aria-hidden", "true");

  const ring = document.createElement("div");
  ring.className = "custom-cursor__ring";

  const glow = document.createElement("div");
  glow.className = "custom-cursor__glow";

  document.body.append(dot, ring, glow);
  document.body.classList.add("has-custom-cursor");

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;
  let glowX = 0;
  let glowY = 0;
  let visible = false;

  const setVisible = (show: boolean) => {
    visible = show;
    dot.classList.toggle("is-visible", show);
    ring.classList.toggle("is-visible", show);
    glow.classList.toggle("is-visible", show);
  };

  document.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
      if (!visible) setVisible(true);
    },
    { passive: true },
  );

  document.addEventListener("mouseleave", () => setVisible(false));
  document.addEventListener("mouseenter", () => {
    if (mouseX || mouseY) setVisible(true);
  });

  const animate = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;

    requestAnimationFrame(animate);
  };

  animate();

  const hoverTargets = document.querySelectorAll<HTMLElement>(
    "a, button, [data-cursor-hover], .timeline-card, .capability-card, .collab-path",
  );

  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });

  document.addEventListener(
    "mousedown",
    () => document.body.classList.add("cursor-press"),
    { passive: true },
  );
  document.addEventListener(
    "mouseup",
    () => document.body.classList.remove("cursor-press"),
    { passive: true },
  );
}
