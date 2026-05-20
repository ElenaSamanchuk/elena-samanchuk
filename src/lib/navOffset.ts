const NAV_GAP_PX = 12;

/** Синхронизирует CSS-переменные отступа под фиксированную шапку. */
export function syncNavOffset(): number {
  const navbar = document.getElementById("site-navbar");
  const root = document.documentElement;
  if (!navbar) return 0;

  const height = Math.ceil(navbar.getBoundingClientRect().height);
  const offset = height + NAV_GAP_PX;
  root.style.setProperty("--site-nav-height", `${height}px`);
  root.style.setProperty("--site-nav-offset", `${offset}px`);
  return offset;
}
