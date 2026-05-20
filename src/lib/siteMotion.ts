import Lenis from "lenis";
import { animate, inView } from "motion";
import { prefersReducedMotion } from "./mediaPrefs";

const revealEase = [0.22, 1, 0.36, 1] as const;

export type SiteMotionApi = {
  scrollTo: (target: HTMLElement, offset: number) => void;
  destroy: () => void;
};

function revealElement(element: Element): void {
  animate(
    element,
    { opacity: [0, 1], y: [22, 0] },
    { duration: 0.55, ease: revealEase },
  );
}

function revealStaggerChildren(parent: HTMLElement): void {
  const items = Array.from(parent.querySelectorAll<HTMLElement>("[data-reveal]"));
  items.forEach((element, index) => {
    animate(
      element,
      { opacity: [0, 1], y: [16, 0] },
      { delay: index * 0.07, duration: 0.5, ease: revealEase },
    );
  });
}

export function initSiteMotion(onScroll: () => void): SiteMotionApi {
  const reducedMotion = prefersReducedMotion();
  let lenis: Lenis | undefined;
  let rafId = 0;

  if (!reducedMotion) {
    lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", onScroll);

    const raf = (time: number) => {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
  } else {
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const revealNodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
  const staggerParents = document.querySelectorAll<HTMLElement>("[data-stagger]");
  const staggered = new Set<Element>();

  staggerParents.forEach((parent) => {
    parent.querySelectorAll("[data-reveal]").forEach((node) => staggered.add(node));
  });

  if (!reducedMotion) {
    staggerParents.forEach((parent) => {
      inView(parent, () => revealStaggerChildren(parent), { amount: 0.1 });
    });

    revealNodes.forEach((node) => {
      if (staggered.has(node)) return;
      inView(node, revealElement, { amount: 0.12, margin: "0px 0px -40px 0px" });
    });
  } else {
    revealNodes.forEach((node) => {
      node.style.opacity = "1";
      node.style.transform = "none";
    });
  }

  return {
    scrollTo(target, offset) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -offset, duration: reducedMotion ? 0 : 1.1 });
        return;
      }
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    },
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
      window.removeEventListener("scroll", onScroll);
    },
  };
}

/** Счётчик метрик при появлении в зоне видимости */
export function initMetricCounters(reducedMotion: boolean): void {
  document.querySelectorAll<HTMLElement>("[data-metric]").forEach((item) => {
    const valueNode = item.querySelector<HTMLElement>("[data-metric-value]");
    if (!valueNode) return;
    const end = Number(item.dataset.metricEnd ?? "0");

    const run = () => {
      if (item.dataset.metricAnimated === "true") return;
      item.dataset.metricAnimated = "true";
      if (reducedMotion) {
        valueNode.textContent = String(end);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1200);
        valueNode.textContent = String(Math.round(end * (1 - (1 - t) ** 3)));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (reducedMotion) {
      run();
      return;
    }

    inView(item, run, { amount: 0.4 });
  });
}
