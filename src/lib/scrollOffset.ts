const DEFAULT_OFFSET = 108;
const MOBILE_OFFSET = 24;

/** Отступ якорной прокрутки с учётом фиксированной шапки. */
export function readScrollOffset(): number {
  const navbar = document.getElementById("site-navbar");
  if (!navbar) return DEFAULT_OFFSET;

  const fixed = getComputedStyle(navbar).position === "fixed";
  if (!fixed) return MOBILE_OFFSET;

  return navbar.getBoundingClientRect().height + 20;
}
