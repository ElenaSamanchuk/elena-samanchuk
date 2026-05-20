const DEFAULT_OFFSET = 88;

/** Отступ якорной прокрутки с учётом фиксированной шапки. */
export function readScrollOffset(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--site-nav-offset").trim();
  const parsed = Number.parseFloat(raw);
  if (Number.isFinite(parsed) && parsed > 0) return parsed + 8;
  return DEFAULT_OFFSET;
}
