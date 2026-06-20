import { codeMarkupLines, turnkeyCaseSteps } from "../data/turnkeyCase";
import { initBlockBuilder } from "./blockBuilderAnim";

const AUTOPLAY_MS = 3200;
const CODE_CHAR_MS = 22;
const CODE_LINE_PAUSE_MS = 120;

export function initTurnkeyCaseShowcase(reducedMotion: boolean): void {
  const root = document.querySelector<HTMLElement>("[data-turnkey-showcase]");
  if (!root) return;

  const steps = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-turnkey-step]"));
  const overlays = root.querySelector<HTMLElement>("[data-turnkey-overlays]");
  const visuals = overlays
    ? Array.from(overlays.querySelectorAll<HTMLElement>("[data-turnkey-visual]"))
    : [];
  const briefTrack = root.querySelector<HTMLElement>("[data-turnkey-brief-track]");
  const briefViewport = root.querySelector<HTMLElement>("[data-turnkey-brief-viewport]");
  const figmaBuilder = root.querySelector<HTMLElement>("[data-turnkey-figma-builder]");
  const codeOutput = root.querySelector<HTMLElement>("[data-turnkey-code-output]");

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
    if (!figmaBuilder) return;
    figmaBuilder.classList.remove("is-styled", "is-polish");
    figmaBuilder.querySelectorAll<HTMLElement>(".pb").forEach((el) => {
      el.classList.remove("is-visible", "is-styled");
      el.style.height = "";
      el.style.width = "";
      el.style.opacity = "";
    });
  };

  const resetBriefPan = () => {
    briefPanOffset = 0;
    if (briefTrack) briefTrack.style.transform = "translate3d(0, 0, 0)";
  };

  const getBriefMaxOffset = (): number => {
    if (!briefTrack || !briefViewport) return 0;
    return Math.max(0, briefTrack.scrollHeight - briefViewport.clientHeight);
  };

  const startBriefScroll = () => {
    if (!briefTrack || !briefViewport || reducedMotion) return;
    if (turnkeyCaseSteps[activeIndex]?.id !== "brief") return;
    stopBriefPan();
    resetBriefPan();

    const runPan = () => {
      if (turnkeyCaseSteps[activeIndex]?.id !== "brief") return;
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

  const startFigmaBuilder = () => {
    if (!figmaBuilder || figmaCleanup) return;
    figmaCleanup = initBlockBuilder(figmaBuilder, reducedMotion);
  };

  const typeNextCodeChar = () => {
    if (!codeOutput) return;
    const line = codeMarkupLines[codeLineIndex];
    if (!line) {
      codeTimer = window.setTimeout(() => {
        codeOutput.textContent = "";
        codeLineIndex = 0;
        codeCharIndex = 0;
        typeNextCodeChar();
      }, reducedMotion ? 0 : 900);
      return;
    }

    if (codeCharIndex <= line.length) {
      const chunk = codeMarkupLines.slice(0, codeLineIndex).join("\n");
      const current = chunk + (chunk ? "\n" : "") + line.slice(0, codeCharIndex);
      codeOutput.textContent = current;
      codeCharIndex += 1;
      codeTimer = window.setTimeout(typeNextCodeChar, reducedMotion ? 0 : CODE_CHAR_MS);
      return;
    }

    codeLineIndex += 1;
    codeCharIndex = 0;
    codeTimer = window.setTimeout(typeNextCodeChar, reducedMotion ? 0 : CODE_LINE_PAUSE_MS);
  };

  const startCodeTyper = () => {
    stopCodeTyper();
    if (!codeOutput) return;
    codeLineIndex = 0;
    codeCharIndex = 0;
    codeOutput.textContent = "";
    if (reducedMotion) {
      codeOutput.textContent = codeMarkupLines.join("\n");
      return;
    }
    typeNextCodeChar();
  };

  const syncVisualEngines = (stepId: string | undefined) => {
    stopFigmaBuilder();
    stopCodeTyper();
    stopBriefPan();

    if (stepId === "brief") startBriefScroll();
    if (stepId === "figma") startFigmaBuilder();
    if (stepId === "code") startCodeTyper();
  };

  const setActive = (index: number) => {
    activeIndex = ((index % steps.length) + steps.length) % steps.length;
    const stepId = turnkeyCaseSteps[activeIndex]?.id;
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
          if (turnkeyCaseSteps[activeIndex]?.id === "brief") startBriefScroll();
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
