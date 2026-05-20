import { registerScrollTask } from "../lib/scrollRuntime";

const STAGGER_SELECTORS = [
  ".timeline .reveal-card",
  ".capability-grid .reveal-card",
  ".partners-strip.reveal-card",
  ".collab-roadmaps .reveal-card",
  ".contact-hub.reveal-card",
  ".hero-pipeline-card.reveal-card",
  ".resume-sidebar .reveal-card",
];

/** Лёгкий stagger при появлении — без magnetic и декоративного шума */
export function initModernTrends(reducedMotion: boolean): void {
  applyStaggerDelays();
  if (reducedMotion) return;
  initHeroParallax();
}

function applyStaggerDelays(): void {
  STAGGER_SELECTORS.forEach((selector) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((node, index) => {
      node.style.setProperty("--reveal-delay", `${Math.min(index * 0.06, 0.36)}s`);
    });
  });
}

function initHeroParallax(): void {
  const hero = document.querySelector<HTMLElement>(".hero-main");
  if (!hero) return;

  registerScrollTask(() => {
    const y = Math.min(window.scrollY, 400);
    hero.style.setProperty("--hero-shift", `${y * 0.04}px`);
  });
}
