const DEFAULT_OFFSET = 88;

/** Зазор между низом шапки и заголовком секции */
export const ANCHOR_GAP_PX = 12;

/** Высота фиксированной шапки + отступ до контента (CSS-переменная) */
export function readScrollOffset(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--site-nav-offset").trim();
  const parsed = Number.parseFloat(raw);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return DEFAULT_OFFSET;
}

/** Живой offset: низ navbar + зазор — совпадает с видимой шапкой на мобиле */
export function readAnchorScrollOffset(): number {
  const navbar = document.getElementById("site-navbar");
  if (navbar) {
    return Math.ceil(navbar.getBoundingClientRect().bottom) + ANCHOR_GAP_PX;
  }
  return readScrollOffset() + ANCHOR_GAP_PX;
}

/** Якорь секции: заголовок; для «Связаться» — блок contact-cta */
export function getSectionAnchorTarget(section: HTMLElement): HTMLElement {
  if (section.id === "collaboration") {
    const contactCta = section.querySelector<HTMLElement>("#contact-cta");
    if (contactCta) {
      return contactCta.querySelector<HTMLElement>(".section-head") ?? contactCta;
    }
  }

  return section.querySelector<HTMLElement>(".section-head") ?? section;
}

export function computeAnchorScrollTop(
  target: HTMLElement,
  offset = readAnchorScrollOffset(),
): number {
  const anchor = getSectionAnchorTarget(target);
  return Math.max(0, anchor.getBoundingClientRect().top + window.scrollY - offset);
}

/** Активна ли секция для подсветки пункта меню. */
export function isNavSectionActive(section: HTMLElement, marker: number): boolean {
  if (section.id === "collaboration") {
    const rect = section.getBoundingClientRect();
    const contactCta = section.querySelector<HTMLElement>("#contact-cta");
    if (!contactCta) return rect.top <= marker + 0.5;

    const ctaRect = contactCta.getBoundingClientRect();
    const ctaHeadTop =
      contactCta.querySelector<HTMLElement>(".section-head")?.getBoundingClientRect().top ??
      ctaRect.top;

    if (rect.top <= marker + 0.5) return true;
    if (ctaHeadTop <= marker + 36) return true;
    if (ctaRect.top < window.innerHeight * 0.88 && ctaRect.bottom > marker + 12) return true;
    return false;
  }

  const head = section.querySelector<HTMLElement>(".section-head");
  const spyTop = (head ?? section).getBoundingClientRect().top;
  return spyTop <= marker + 0.5;
}
