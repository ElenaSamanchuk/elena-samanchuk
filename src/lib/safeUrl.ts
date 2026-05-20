const ALLOWED_PROTOCOLS = new Set(["https:", "http:", "mailto:"]);
const BASE = import.meta.env.BASE_URL;

/** Пути к файлам из `public/` с учётом Vite `base` (например GitHub Pages subpath). */
export function assetUrl(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|mailto:)/i.test(path)) return path;

  const clean = path.startsWith("/") ? path.slice(1) : path;
  const joined = `${BASE}${clean}`.replace(/([^:]\/)\/+/g, "$1");
  return joined.startsWith("/") ? joined : `/${joined}`;
}

/** Абсолютный URL ассета для атрибутов src/href. */
export function resolveAssetHref(path: string): string {
  const relative = assetUrl(path);
  if (typeof window === "undefined") return relative;
  return new URL(relative, window.location.origin).href;
}

/** Пропускает только безопасные внешние ссылки для href в разметке. */
export function safeHref(url: string): string {
  if (url.startsWith("/") && !url.startsWith("//")) {
    return resolveAssetHref(url);
  }

  try {
    const parsed = new URL(url, window.location.origin);
    if (ALLOWED_PROTOCOLS.has(parsed.protocol)) return parsed.href;
  } catch {
    /* invalid URL */
  }
  return "#";
}
