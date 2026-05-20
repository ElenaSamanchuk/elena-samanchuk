const ALLOWED_PROTOCOLS = new Set(["https:", "http:", "mailto:"]);

/** Пропускает только безопасные внешние ссылки для href в разметке. */
export function safeHref(url: string): string {
  try {
    const parsed = new URL(url, window.location.origin);
    if (ALLOWED_PROTOCOLS.has(parsed.protocol)) return parsed.href;
  } catch {
    /* invalid URL */
  }
  return "#";
}
