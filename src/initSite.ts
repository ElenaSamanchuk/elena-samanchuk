import { initCustomCursor } from "./effects/customCursor";
import { initCasePreviews } from "./effects/casePreview";
import { initMechanicsVideos } from "./effects/mechanicsVideos";
import { initScrollToTop } from "./effects/scrollToTop";
import { initWebGLBackground } from "./effects/webglBg";

export function initSite() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollOffset = 92;

  initCustomCursor(reducedMotion);
  initScrollToTop(reducedMotion);

  if (!reducedMotion) {
    const webglCanvas = document.querySelector<HTMLCanvasElement>("#webgl-bg");
    if (webglCanvas) initWebGLBackground(webglCanvas);
  }

  const scrollToSection = (selector: string) => {
    const target = document.querySelector<HTMLElement>(selector);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal-card").forEach((node) => observer.observe(node));

  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      event.preventDefault();
      scrollToSection(hash);
    });
  });

  const scrollProgressBar = document.querySelector<HTMLElement>("#scroll-progress-bar");

  const updateScrollUi = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = `${progress}%`;
  };

  updateScrollUi();
  window.addEventListener("scroll", updateScrollUi, { passive: true });
  window.addEventListener("resize", updateScrollUi);

  const animateMetric = (item: HTMLElement) => {
    if (item.dataset.metricAnimated === "true") return;
    item.dataset.metricAnimated = "true";
    const valueNode = item.querySelector<HTMLElement>(".metric-value");
    if (!valueNode) return;
    const end = Number(item.dataset.metricEnd ?? "0");
    const duration = reducedMotion ? 0 : 1200;
    const start = performance.now();
    const render = (current: number) => {
      valueNode.textContent = String(Math.round(current));
    };
    if (duration === 0) {
      render(end);
      return;
    }
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      render(end * (1 - (1 - t) ** 3));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const metricObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) animateMetric(entry.target as HTMLElement);
      });
    },
    { threshold: 0.35 },
  );

  document.querySelectorAll<HTMLElement>(".metric-item").forEach((node) => metricObserver.observe(node));

  initCasePreviews(reducedMotion);
  const mechanicsCtrl = initMechanicsVideos(reducedMotion);

  document.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--spot-x", `${x}%`);
      card.style.setProperty("--spot-y", `${y}%`);
    });
  });

  const pipelineRoot = document.querySelector<HTMLElement>("[data-pipeline]");
  if (pipelineRoot) {
    const tabs = Array.from(pipelineRoot.querySelectorAll<HTMLButtonElement>(".pipeline-tab"));
    const panels = Array.from(pipelineRoot.querySelectorAll<HTMLElement>(".pipeline-panel"));
    const progressFill = pipelineRoot.querySelector<HTMLElement>(".pipeline-progress__fill");

    const setPipelineStep = (step: number) => {
      tabs.forEach((tab, index) => {
        const isActive = index === step;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
      });
      panels.forEach((panel, index) => {
        panel.classList.toggle("is-active", index === step);
      });
      if (progressFill) progressFill.style.width = `${((step + 1) / panels.length) * 100}%`;
      mechanicsCtrl?.setActive(step === 2);
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setPipelineStep(Number(tab.dataset.pipelineStep ?? "0"));
      });
    });

    setPipelineStep(0);
  }
}
