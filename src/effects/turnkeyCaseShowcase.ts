import { DEMO_SHOWCASE_BY_ID } from "../data/demoShowcases";
import type { DemoShowcaseConfig, DemoShowcaseStepVisual } from "../data/demoShowcaseTypes";
import { safeHref } from "../lib/safeUrl";
import { initBlockBuilder } from "./blockBuilderAnim";

const AUTOPLAY_MS = 3200;
const CODE_CHAR_MS = 22;
const CODE_LINE_PAUSE_MS = 120;

function getStepVisual(config: DemoShowcaseConfig, stepId: string | undefined): DemoShowcaseStepVisual | null {
  if (!stepId || stepId === "ship") return null;
  return config.steps.find((step) => step.id === stepId)?.visual ?? null;
}

function getStepCodeLines(config: DemoShowcaseConfig, stepId: string | undefined): string[] {
  if (!stepId) return config.codeLines;
  const step = config.steps.find((item) => item.id === stepId);
  return step?.codeLines ?? config.codeLines;
}

function getStepPreviewImage(config: DemoShowcaseConfig, stepId: string | undefined): string {
  if (!stepId) return config.previewImage;
  const step = config.steps.find((item) => item.id === stepId);
  return step?.previewImage ?? config.previewImage;
}

function initDemoShowcaseRoot(root: HTMLElement, config: DemoShowcaseConfig, reducedMotion: boolean): void {
  const steps = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-turnkey-step]"));
  const overlays = root.querySelector<HTMLElement>("[data-turnkey-overlays]");
  const visuals = overlays
    ? Array.from(overlays.querySelectorAll<HTMLElement>("[data-turnkey-visual]"))
    : [];

  if (!steps.length || !visuals.length) return;

  const autoplay = !reducedMotion;
  let activeIndex = 0;
  let timer: number | null = null;
  let figmaCleanup: (() => void) | null = null;
  let codeTimer: number | null = null;
  let codeLineIndex = 0;
  let codeCharIndex = 0;
  let briefPanFrame = 0;
  let briefPanOffset = 0;
  let briefPanActive = false;
  let activeChipsPanel: HTMLElement | null = null;

  const clearStepTimer = () => {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const stopBriefPan = () => {
    if (briefPanFrame) window.cancelAnimationFrame(briefPanFrame);
    briefPanFrame = 0;
    briefPanActive = false;
  };

  const stopCodeTyper = () => {
    if (codeTimer !== null) {
      window.clearTimeout(codeTimer);
      codeTimer = null;
    }
  };

  const stopFigmaBuilder = () => {
    figmaCleanup?.();
    figmaCleanup = null;
    root.querySelectorAll<HTMLElement>("[data-turnkey-figma-builder]").forEach((figmaBuilder) => {
      figmaBuilder.classList.remove("is-styled", "is-polish");
      figmaBuilder.querySelectorAll<HTMLElement>(".pb").forEach((el) => {
        el.classList.remove("is-visible", "is-styled");
        el.style.height = "";
        el.style.width = "";
        el.style.opacity = "";
      });
    });
  };

  const resetBriefPan = () => {
    briefPanOffset = 0;
    activeChipsPanel
      ?.querySelector<HTMLElement>("[data-turnkey-brief-track]")
      ?.style.setProperty("transform", "translate3d(0, 0, 0)");
  };

  const getBriefMaxOffset = (): number => {
    if (!activeChipsPanel) return 0;
    const briefTrack = activeChipsPanel.querySelector<HTMLElement>("[data-turnkey-brief-track]");
    const briefViewport = activeChipsPanel.querySelector<HTMLElement>("[data-turnkey-brief-viewport]");
    if (!briefTrack || !briefViewport) return 0;
    return Math.max(0, briefTrack.scrollHeight - briefViewport.clientHeight);
  };

  const startChipsScroll = (stepId: string) => {
    if (reducedMotion) return;
    activeChipsPanel = root.querySelector<HTMLElement>(`[data-turnkey-visual="${stepId}"]`);
    if (!activeChipsPanel) return;

    stopBriefPan();
    resetBriefPan();

    const briefTrack = activeChipsPanel.querySelector<HTMLElement>("[data-turnkey-brief-track]");
    if (!briefTrack) return;

    const runPan = () => {
      if (getStepVisual(config, config.steps[activeIndex]?.id) !== "chips") return;
      briefPanActive = true;
      let phase = 0;

      const tick = () => {
        if (!briefPanActive) return;
        const maxOffset = getBriefMaxOffset();
        if (maxOffset <= 6) {
          stopBriefPan();
          return;
        }

        phase += 0.0011;
        const target = ((Math.sin(phase) + 1) * 0.5) * maxOffset;
        briefPanOffset += (target - briefPanOffset) * 0.028;
        briefTrack.style.transform = `translate3d(0, ${-briefPanOffset}px, 0)`;
        briefPanFrame = window.requestAnimationFrame(tick);
      };

      resetBriefPan();
      briefPanFrame = window.requestAnimationFrame(tick);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(runPan);
    });
  };

  const startFigmaBuilder = (stepId: string) => {
    if (figmaCleanup) return;
    const panel = root.querySelector<HTMLElement>(`[data-turnkey-visual="${stepId}"]`);
    const figmaBuilder = panel?.querySelector<HTMLElement>("[data-turnkey-figma-builder]");
    if (!figmaBuilder) return;
    figmaCleanup = initBlockBuilder(figmaBuilder, reducedMotion);
  };

  const typeNextCodeChar = (codeOutput: HTMLElement, lines: string[]) => {
    const line = lines[codeLineIndex];
    if (!line) {
      codeTimer = window.setTimeout(() => {
        codeOutput.textContent = "";
        codeLineIndex = 0;
        codeCharIndex = 0;
        typeNextCodeChar(codeOutput, lines);
      }, reducedMotion ? 0 : 900);
      return;
    }

    if (codeCharIndex <= line.length) {
      const chunk = lines.slice(0, codeLineIndex).join("\n");
      const current = chunk + (chunk ? "\n" : "") + line.slice(0, codeCharIndex);
      codeOutput.textContent = current;
      codeCharIndex += 1;
      codeTimer = window.setTimeout(
        () => typeNextCodeChar(codeOutput, lines),
        reducedMotion ? 0 : CODE_CHAR_MS,
      );
      return;
    }

    codeLineIndex += 1;
    codeCharIndex = 0;
    codeTimer = window.setTimeout(
      () => typeNextCodeChar(codeOutput, lines),
      reducedMotion ? 0 : CODE_LINE_PAUSE_MS,
    );
  };

  const startCodeTyper = (stepId: string) => {
    stopCodeTyper();
    const panel = root.querySelector<HTMLElement>(`[data-turnkey-visual="${stepId}"]`);
    const codeOutput = panel?.querySelector<HTMLElement>("[data-turnkey-code-output]");
    if (!codeOutput) return;

    const lines = getStepCodeLines(config, stepId);
    codeLineIndex = 0;
    codeCharIndex = 0;
    codeOutput.textContent = "";
    if (reducedMotion) {
      codeOutput.textContent = lines.join("\n");
      return;
    }
    typeNextCodeChar(codeOutput, lines);
  };

  const syncVisualEngines = (stepId: string | undefined) => {
    stopFigmaBuilder();
    stopCodeTyper();
    stopBriefPan();

    const visual = getStepVisual(config, stepId);
    if (visual === "chips" && stepId) startChipsScroll(stepId);
    if (visual === "figma" && stepId) startFigmaBuilder(stepId);
    if (visual === "code" && stepId) startCodeTyper(stepId);
  };

  const setActive = (index: number) => {
    activeIndex = ((index % steps.length) + steps.length) % steps.length;
    const stepId = config.steps[activeIndex]?.id;
    const isShip = stepId === "ship";

    steps.forEach((btn, i) => {
      const isActive = i === activeIndex;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (isShip) {
      overlays?.setAttribute("hidden", "");
    } else {
      overlays?.removeAttribute("hidden");
    }

    visuals.forEach((panel) => {
      const isActive = !isShip && panel.dataset.turnkeyVisual === stepId;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });

    root.classList.toggle("is-ship-step", isShip);

    const previewImg = root.querySelector<HTMLImageElement>("[data-preview-img]");
    if (previewImg && !isShip) {
      const nextSrc = safeHref(getStepPreviewImage(config, stepId));
      if (previewImg.getAttribute("src") !== nextSrc) {
        previewImg.setAttribute("src", nextSrc);
      }
    }

    syncVisualEngines(stepId);
  };

  const startAutoplay = () => {
    clearStepTimer();
    if (!autoplay) return;
    timer = window.setInterval(() => setActive(activeIndex + 1), AUTOPLAY_MS);
  };

  steps.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActive(Number(btn.dataset.turnkeyIndex ?? 0));
      clearStepTimer();
      startAutoplay();
    });
  });

  root.addEventListener("mouseenter", clearStepTimer);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", clearStepTimer);
  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget as Node)) startAutoplay();
  });

  setActive(0);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAutoplay();
          const stepId = config.steps[activeIndex]?.id;
          if (getStepVisual(config, stepId) === "chips" && stepId) startChipsScroll(stepId);
        } else {
          clearStepTimer();
          stopBriefPan();
          stopFigmaBuilder();
          stopCodeTyper();
        }
      });
    },
    { threshold: 0.2 },
  );
  observer.observe(root);
}

export function initTurnkeyCaseShowcase(reducedMotion: boolean): void {
  document.querySelectorAll<HTMLElement>("[data-turnkey-showcase]").forEach((root) => {
    const config = DEMO_SHOWCASE_BY_ID[root.dataset.showcaseId ?? ""];
    if (!config) return;
    initDemoShowcaseRoot(root, config, reducedMotion);
  });
}

export function initDemoShowcases(reducedMotion: boolean): void {
  initTurnkeyCaseShowcase(reducedMotion);
}
