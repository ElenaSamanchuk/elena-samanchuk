import { initCustomCursor } from "./effects/customCursor";
import { initCasePreviews } from "./effects/casePreview";
import { initMechanicsVideos } from "./effects/mechanicsVideos";
import { initScrollToTop } from "./effects/scrollToTop";
import { initWebGLBackground } from "./effects/webglBg";
import { prefersLightEffects, prefersReducedMotion } from "./lib/mediaPrefs";
import { readScrollOffset } from "./lib/scrollOffset";
import { initScrollRuntime, registerScrollTask } from "./lib/scrollRuntime";

export function initSite() {
  const reducedMotion = prefersReducedMotion();
  const lightEffects = prefersLightEffects();
  let scrollOffset = readScrollOffset();

  initScrollRuntime();

  initCustomCursor(reducedMotion);
  initScrollToTop(reducedMotion);

  if (!lightEffects) {
    const webglCanvas = document.querySelector<HTMLCanvasElement>("#webgl-bg");
    if (webglCanvas) initWebGLBackground(webglCanvas);
  }

  const scrollToSection = (selector: string) => {
    const target = document.querySelector<HTMLElement>(selector);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal-card").forEach((node) => revealObserver.observe(node));

  const enableTilt = !lightEffects && !window.matchMedia("(pointer: coarse)").matches;

  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
    if (!enableTilt) return;
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

  document.addEventListener("click", (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    event.preventDefault();
    scrollToSection(hash);
  });

  const scrollProgressBar = document.querySelector<HTMLElement>("#scroll-progress-bar");

  const updateScrollUi = () => {
    scrollOffset = readScrollOffset();
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = `${progress}%`;
  };

  const navLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(".nav-links a[href^='#']"),
  );
  const navSections = navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href || href === "#top") return null;
      const section = document.querySelector<HTMLElement>(href);
      return section ? { href, section } : null;
    })
    .filter((item): item is { href: string; section: HTMLElement } => Boolean(item));

  const setActiveNav = (href: string) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === href;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  const updateActiveNav = () => {
    if (!navSections.length) return;
    const marker = window.scrollY + scrollOffset + 40;
    let current = navSections[0].href;
    for (const item of navSections) {
      if (item.section.offsetTop <= marker) current = item.href;
    }
    setActiveNav(current);
  };

  const navbar = document.getElementById("site-navbar");
  const updateNavbar = () => {
    navbar?.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  registerScrollTask(updateScrollUi);
  if (navSections.length) registerScrollTask(updateActiveNav);
  registerScrollTask(updateNavbar);

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
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateMetric(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.35 },
  );

  document.querySelectorAll<HTMLElement>(".metric-item").forEach((node) => metricObserver.observe(node));

  initCasePreviews(reducedMotion);
  const mechanicsCtrl = initMechanicsVideos(reducedMotion);

  if (!lightEffects) {
    document.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--spot-x", `${x}%`);
        card.style.setProperty("--spot-y", `${y}%`);
      });
    });
  }

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
        tab.tabIndex = isActive ? 0 : -1;
      });
      panels.forEach((panel, index) => {
        const isActive = index === step;
        panel.classList.toggle("is-active", isActive);
        panel.toggleAttribute("hidden", !isActive);
        panel.setAttribute("aria-hidden", String(!isActive));
      });
      if (progressFill) progressFill.style.width = `${((step + 1) / panels.length) * 100}%`;
      mechanicsCtrl?.setActive(step === 2);
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => setPipelineStep(index));
    });

    pipelineRoot.addEventListener("keydown", (event) => {
      const activeIndex = tabs.findIndex((tab) => tab.classList.contains("is-active"));
      if (activeIndex < 0) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        const next = (activeIndex + 1) % tabs.length;
        setPipelineStep(next);
        tabs[next]?.focus();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const next = (activeIndex - 1 + tabs.length) % tabs.length;
        setPipelineStep(next);
        tabs[next]?.focus();
      }
      if (event.key === "Home") {
        event.preventDefault();
        setPipelineStep(0);
        tabs[0]?.focus();
      }
      if (event.key === "End") {
        event.preventDefault();
        const last = tabs.length - 1;
        setPipelineStep(last);
        tabs[last]?.focus();
      }
    });

    setPipelineStep(0);
  }
}
