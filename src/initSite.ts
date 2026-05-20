import { initCasePreviews } from "./effects/casePreview";
import { initBlockBuilder } from "./effects/blockBuilderAnim";
import { initScrollToTop } from "./effects/scrollToTop";
import { syncNavOffset } from "./lib/navOffset";
import { prefersReducedMotion } from "./lib/mediaPrefs";
import { readScrollOffset } from "./lib/scrollOffset";
import { initMetricCounters, initSiteMotion } from "./lib/siteMotion";
import { initScrollRuntime, registerScrollTask } from "./lib/scrollRuntime";

/** Показывает в консоли и data-атрибуте активную сборку сайта */
export const SITE_REVISION = "stack-tw";

/** Доп. сдвиг якоря: секция останавливается чуть ниже шапки, не «над» блоком */
const ANCHOR_SCROLL_EXTRA = 72;

/** Линия активации пункта меню (синхронна с якорной прокруткой) */
const NAV_SPY_EXTRA = 64;

export function initSite() {
  document.documentElement.dataset.siteRevision = SITE_REVISION;
  document.documentElement.dataset.theme = "dark";
  if (import.meta.env.DEV) {
    console.info(`[site] revision: ${SITE_REVISION}`);
  }

  const reducedMotion = prefersReducedMotion();
  let scrollOffset = readScrollOffset();

  initScrollRuntime();
  syncNavOffset();

  const scrollProgressBar = document.querySelector<HTMLElement>("#scroll-progress-bar");
  const navbar = document.getElementById("site-navbar");

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

  const setActiveNav = (href: string) => {
    sectionNavLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === href;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  const updateScrollUi = () => {
    scrollOffset = readScrollOffset();
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = `${progress}%`;
  };

  const navMarkerTop = () => scrollOffset + NAV_SPY_EXTRA;

  const updateActiveNav = () => {
    if (!navSections.length) return;
    const markerFromTop = navMarkerTop();
    let current = navSections[0].href;

    for (let i = navSections.length - 1; i >= 0; i--) {
      const item = navSections[i];
      const top = item.section.getBoundingClientRect().top;
      if (top <= markerFromTop) {
        current = item.href;
        break;
      }
    }

    setActiveNav(current);
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

  const motionApi = initSiteMotion(onScroll);
  initMetricCounters(reducedMotion);
  initScrollToTop(reducedMotion);

  const scrollToSection = (selector: string) => {
    const target = document.querySelector<HTMLElement>(selector);
    if (!target) return;
    scrollOffset = readScrollOffset();
    motionApi.scrollTo(target, scrollOffset + ANCHOR_SCROLL_EXTRA);
    window.setTimeout(updateActiveNav, reducedMotion ? 0 : 450);
    window.setTimeout(updateActiveNav, reducedMotion ? 50 : 1150);
  };

  document.addEventListener("click", (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    event.preventDefault();
    if (link.classList.contains("nav-link")) setActiveNav(hash);
    scrollToSection(hash);
  });

  initCasePreviews(reducedMotion);

  const builderRoot = document.querySelector<HTMLElement>("[data-block-builder]");
  if (builderRoot) initBlockBuilder(builderRoot, reducedMotion);

  onScroll();
}
