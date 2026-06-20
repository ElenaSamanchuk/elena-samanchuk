import { escapeHtml } from "../lib/escapeHtml";
import { bindTypography } from "../lib/typography";
import { safeHref } from "../lib/safeUrl";

const t = (text: string) => escapeHtml(bindTypography(text));

type CasePreviewOptions = {
  src: string;
  alt: string;
  overlayMarkup?: string;
};

/** Разметка превью — 1:1 как у Nasha / Growfood / Priem. */
export function casePreviewAsideMarkup({
  src,
  alt,
  overlayMarkup = "",
}: CasePreviewOptions): string {
  return `<aside class="case-preview is-loading box-border w-full max-w-full max-lg:order-first max-lg:h-[200px] max-lg:min-h-[200px] max-lg:max-h-[200px]" data-case-preview aria-label="Превью ${t(alt)}">
    <div class="case-preview__viewport">
      <div class="case-preview__skeleton" aria-hidden="true"></div>
      ${overlayMarkup}
      <div class="case-preview__stage" data-preview-stage>
        <div class="case-preview__track" data-preview-track>
          <img
            data-preview-img
            src="${safeHref(src)}"
            alt="Скриншот ${t(alt)}"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
        </div>
      </div>
    </div>
  </aside>`;
}
