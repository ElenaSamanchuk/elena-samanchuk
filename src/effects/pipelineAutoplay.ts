import { prefersReducedMotion } from "../lib/mediaPrefs";

const SLIDE_MS = 5200;

export type PipelineController = {
  setStep: (step: number) => void;
  destroy: () => void;
};

export function initPipelineAutoplay(root: HTMLElement, onStep: (step: number) => void): PipelineController {
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>(".pipeline-tab"));
  const panels = Array.from(root.querySelectorAll<HTMLElement>(".pipeline-panel"));
  const progressFill = root.querySelector<HTMLElement>(".pipeline-progress__fill");
  const count = panels.length;
  const reducedMotion = prefersReducedMotion();

  let step = 0;
  let rafId = 0;
  let stepStart = 0;
  let paused = false;
  let destroyed = false;

  const applyStep = (index: number) => {
    step = ((index % count) + count) % count;
    tabs.forEach((tab, i) => {
      const isActive = i === step;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    panels.forEach((panel, i) => {
      const isActive = i === step;
      panel.classList.toggle("is-active", isActive);
      panel.toggleAttribute("hidden", !isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });
    onStep(step);
  };

  const setProgress = (ratio: number) => {
    if (!progressFill) return;
    progressFill.style.transition = "none";
    progressFill.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };

  const tick = (now: number) => {
    if (destroyed) return;
    if (!stepStart) stepStart = now;

    if (!paused && count > 0) {
      const elapsed = now - stepStart;
      const t = reducedMotion ? (elapsed >= SLIDE_MS * 0.35 ? 1 : 0) : Math.min(1, elapsed / SLIDE_MS);
      const base = step / count;
      const next = (step + 1) / count;
      setProgress(base + (next - base) * t);

      if (t >= 1) {
        applyStep(step + 1);
        stepStart = now;
      }
    }

    rafId = requestAnimationFrame(tick);
  };

  const pause = () => {
    paused = true;
  };
  const resume = () => {
    if (!paused) return;
    paused = false;
    stepStart = performance.now();
  };

  root.addEventListener("mouseenter", pause);
  root.addEventListener("mouseleave", resume);
  root.addEventListener("focusin", pause);
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget as Node)) resume();
  });

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      applyStep(index);
      setProgress((index + 1) / count);
      stepStart = performance.now();
    });
  });

  applyStep(0);
  setProgress(1 / count);
  stepStart = performance.now();
  rafId = requestAnimationFrame(tick);

  return {
    setStep(index: number) {
      applyStep(index);
      setProgress((step + 1) / count);
      stepStart = performance.now();
    },
    destroy() {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
}
