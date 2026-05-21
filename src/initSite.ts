import { BUILDER_STAGE_MIN_HEIGHT } from "./data/blockBuilderConfig";
import { initCasePreviews } from "./effects/casePreview";
import { initDiagramMotion } from "./effects/diagramMotion";
import { initBlockBuilder } from "./effects/blockBuilderAnim";
import { initScrollToTop } from "./effects/scrollToTop";
import { syncNavOffset } from "./lib/navOffset";
import { prefersReducedMotion } from "./lib/mediaPrefs";
import { isNavSectionActive, readAnchorScrollOffset } from "./lib/scrollOffset";
import { initMetricCounters, initSiteMotion } from "./lib/siteMotion";
import { initSidebarLayout } from "./lib/sidebarLayout";
import { initScrollRuntime, registerScrollTask } from "./lib/scrollRuntime";

/** Показывает в консоли и data-атрибуте активную сборку сайта */
export const SITE_REVISION = "stack-tw";

/** Подключаемые модули: siteMotion, casePreview, blockBuilderAnim, scrollToTop */
export async function initSite() {
  document.documentElement.dataset.siteRevision = SITE_REVISION;
  document.documentElement.dataset.theme = "dark";
  document.documentElement.style.setProperty("--bb-stage-min-h", `${BUILDER_STAGE_MIN_HEIGHT}px`);
  if (import.meta.env.DEV) {
    console.info(`[site] revision: ${SITE_REVISION}`);
  }

  const reducedMotion = prefersReducedMotion();
  let anchorScrollOffset = readAnchorScrollOffset();
  let pendingNavHref: string | null = null;

  initScrollRuntime();
  syncNavOffset();
  initSidebarLayout();

  const scrollProgressBar = document.querySelector<HTMLElement>("#scroll-progress-bar");
  const navbar = document.getElementById("site-navbar");
  const navBurger = document.getElementById("nav-burger");
  const navDrawerBackdrop = document.getElementById("nav-drawer-backdrop");

  const setNavDrawerOpen = (open: boolean) => {
    navbar?.classList.toggle("is-nav-open", open);
    navBurger?.setAttribute("aria-expanded", open ? "true" : "false");
    navBurger?.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    document.body.classList.toggle("is-nav-drawer-open", open);
    if (navDrawerBackdrop) {
      if (open) navDrawerBackdrop.removeAttribute("hidden");
      else navDrawerBackdrop.setAttribute("hidden", "");
      navDrawerBackdrop.setAttribute("aria-hidden", open ? "false" : "true");
    }
  };

  const closeNavDrawer = () => setNavDrawerOpen(false);

  navBurger?.addEventListener("click", () => {
    const isOpen = navbar?.classList.contains("is-nav-open") ?? false;
    setNavDrawerOpen(!isOpen);
  });

  navDrawerBackdrop?.addEventListener("click", closeNavDrawer);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navbar?.classList.contains("is-nav-open")) closeNavDrawer();
  });

  const sectionNavLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(".nav-link[href^='#']"),
  );
  const navSections = sectionNavLinks
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href || href === "#top") return null;
      const section = document.querySelector<HTMLElement>(href);
      return section ? { href, section } : null;
    })
    .filter(
      (item, index, list) =>
        item && list.findIndex((other) => other?.href === item.href) === index,
    )
    .filter((item): item is { href: string; section: HTMLElement } => Boolean(item));

  const setActiveNav = (href: string | null) => {
    sectionNavLinks.forEach((link) => {
      const isActive = href !== null && link.getAttribute("href") === href;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  const updateScrollUi = () => {
    anchorScrollOffset = readAnchorScrollOffset();
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = `${progress}%`;
  };

  const navMarkerTop = () => anchorScrollOffset;

  const updateActiveNav = () => {
    if (!navSections.length) return;
    if (pendingNavHref) {
      setActiveNav(pendingNavHref);
      return;
    }

    const marker = navMarkerTop();
    let activeHref: string | null = null;

    for (const item of navSections) {
      if (isNavSectionActive(item.section, marker)) {
        activeHref = item.href;
      }
    }

    setActiveNav(activeHref);
  };

  const updateNavbar = () => {
    navbar?.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  const onScroll = () => {
    updateScrollUi();
    updateActiveNav();
    updateNavbar();
  };

  const syncLayout = () => {
    syncNavOffset();
    onScroll();
  };

  registerScrollTask(syncLayout);

  const motionApi = await initSiteMotion(onScroll);
  await initMetricCounters(reducedMotion);
  initScrollToTop(reducedMotion);

  const scrollToSection = (selector: string, activeHref?: string) => {
    const target = document.querySelector<HTMLElement>(selector);
    if (!target) return;
    anchorScrollOffset = readAnchorScrollOffset();
    if (activeHref) {
      pendingNavHref = activeHref;
      setActiveNav(activeHref);
    }
    motionApi.scrollTo(target, anchorScrollOffset);
    const finishNav = () => {
      pendingNavHref = null;
      updateActiveNav();
    };
    window.setTimeout(finishNav, reducedMotion ? 0 : 480);
    window.setTimeout(finishNav, reducedMotion ? 100 : 1400);
    window.setTimeout(finishNav, reducedMotion ? 100 : 2200);
  };

  document.addEventListener("click", (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    event.preventDefault();
    if (link.classList.contains("nav-link")) {
      closeNavDrawer();
      scrollToSection(hash, hash);
      return;
    }
    scrollToSection(hash);
  });

  initCasePreviews(reducedMotion);
  initDiagramMotion(reducedMotion);

  const builderRoot = document.querySelector<HTMLElement>("[data-block-builder]");
  if (builderRoot) initBlockBuilder(builderRoot, reducedMotion);

  onScroll();
}
