import { prefersReducedMotion } from "./mediaPrefs";
import { computeAnchorScrollTop } from "./scrollOffset";

const revealEase = [0.22, 1, 0.36, 1] as const;

export type SiteMotionApi = {
  scrollTo: (target: HTMLElement, offset: number) => void;
  destroy: () => void;
};

function showRevealsWithoutMotion(): void {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((node) => {
    node.style.opacity = "1";
    node.style.transform = "none";
  });
}

function createNativeScrollApi(onScroll: () => void): SiteMotionApi {
  window.addEventListener("scroll", onScroll, { passive: true });
  const reducedMotion = prefersReducedMotion();
  showRevealsWithoutMotion();

  return {
    scrollTo(target, offset) {
      const top = computeAnchorScrollTop(target, offset);
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    },
    destroy() {
      window.removeEventListener("scroll", onScroll);
    },
  };
}

export async function initSiteMotion(onScroll: () => void): Promise<SiteMotionApi> {
  if (prefersReducedMotion()) {
    return createNativeScrollApi(onScroll);
  }

  const [{ default: Lenis }, { animate, inView }] = await Promise.all([
    import("lenis"),
    import("motion"),
  ]);
  await import("lenis/dist/lenis.css");

  const revealElement = (element: Element): void => {
    animate(element, { opacity: [0, 1], y: [22, 0] }, { duration: 0.55, ease: revealEase });
  };

  const revealStaggerChildren = (parent: HTMLElement): void => {
    const items = Array.from(parent.querySelectorAll<HTMLElement>("[data-reveal]"));
    items.forEach((element, index) => {
      animate(
        element,
        { opacity: [0, 1], y: [16, 0] },
        { delay: index * 0.07, duration: 0.5, ease: revealEase },
      );
    });
  };

  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    touchMultiplier: 1.2,
  });

  lenis.on("scroll", onScroll);

  let rafId = 0;
  const raf = (time: number) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  const revealNodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
  const staggerParents = document.querySelectorAll<HTMLElement>("[data-stagger]");
  const staggered = new Set<Element>();

  staggerParents.forEach((parent) => {
    parent.querySelectorAll("[data-reveal]").forEach((node) => staggered.add(node));
  });

  staggerParents.forEach((parent) => {
    inView(parent, () => revealStaggerChildren(parent), { amount: 0.1 });
  });

  revealNodes.forEach((node) => {
    if (staggered.has(node)) return;
    inView(node, revealElement, { amount: 0.12, margin: "0px 0px -40px 0px" });
  });

  return {
    scrollTo(target, offset) {
      const top = computeAnchorScrollTop(target, offset);
      lenis.scrollTo(top, { duration: 1.05, lock: true });
    },
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
    },
  };
}

/** Счётчик метрик при появлении в зоне видимости */
export async function initMetricCounters(reducedMotion: boolean): Promise<void> {
  const runCounter = (item: HTMLElement, valueNode: HTMLElement, end: number) => {
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

  const items = document.querySelectorAll<HTMLElement>("[data-metric]");

  if (reducedMotion) {
    items.forEach((item) => {
      const valueNode = item.querySelector<HTMLElement>("[data-metric-value]");
      if (!valueNode) return;
      runCounter(item, valueNode, Number(item.dataset.metricEnd ?? "0"));
    });
    return;
  }

  const { inView } = await import("motion");

  items.forEach((item) => {
    const valueNode = item.querySelector<HTMLElement>("[data-metric-value]");
    if (!valueNode) return;
    const end = Number(item.dataset.metricEnd ?? "0");
    inView(item, () => runCounter(item, valueNode, end), { amount: 0.4 });
  });
}
