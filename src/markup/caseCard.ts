import type { CaseCard } from "../data/cases";
import { getCaseDisplayTags } from "../data/caseDisplayTags";
import { EXTERNAL_REL } from "../data/contacts";
import { escapeHtml } from "../lib/escapeHtml";
import { bindTypography } from "../lib/typography";
import { safeHref } from "../lib/safeUrl";
import { casePreviewAsideMarkup } from "./casePreview";

const t = (text: string) => escapeHtml(bindTypography(text));

const caseLinkLabelMarkup = (label: string, mobileLabel?: string) => {
  if (mobileLabel) {
    return `<span class="case-link-chip__label"><span class="case-link-chip__label--desktop">${t(label)}</span><span class="case-link-chip__label--mobile">${t(mobileLabel)}</span></span>`;
  }
  return `<span class="case-link-chip__label">${t(label)}</span>`;
};

function casePillsMarkup(item: CaseCard) {
  const tags = getCaseDisplayTags(item.niches, item.tech);
  const badges = item.badges ?? [];
  if (!tags.length && !badges.length) return "";

  const tagHtml = tags
    .map((tag) => {
      const tone = tag.kind === "niche" ? "pill-niche" : "pill-tech";
      if (tag.mobileLabel) {
        return `<span class="${tone}"><span class="pill-label pill-label--desktop">${t(tag.label)}</span><span class="pill-label pill-label--mobile" aria-hidden="true">${t(tag.mobileLabel)}</span></span>`;
      }
      return `<span class="${tone}">${t(tag.label)}</span>`;
    })
    .join("");

  const badgeHtml = badges
    .map((badge) => `<span class="pill-badge">${t(badge)}</span>`)
    .join("");

  return `<div class="mt-3 flex flex-wrap gap-2" aria-label="Ниша и стек">${tagHtml}${badgeHtml}</div>`;
}

function caseOutcomeMarkup(item: CaseCard) {
  if (!item.outcome) return "";
  return `<p class="case-outcome">${t(item.outcome)}</p>`;
}

function caseLinksMarkup(item: CaseCard) {
  return `
  <ul
    class="case-links case-links--grid${item.links.length === 1 ? " case-links--one" : ""}"
    aria-label="Живые примеры"
  >
    ${item.links
      .map(
        (link) => `
      <li class="case-links__item">
        <a class="case-link-chip" href="${safeHref(link.href)}" target="_blank" rel="${EXTERNAL_REL}">
          ${caseLinkLabelMarkup(link.label, link.mobileLabel)}
          <span class="case-link__icon" aria-hidden="true"></span>
        </a>
      </li>
    `,
      )
      .join("")}
  </ul>
`;
}

function caseDetailsMarkup(item: CaseCard) {
  return `
  <dl class="mt-5 space-y-3 case-details">
    <div class="case-details__row">
      <dt>Задача</dt>
      <dd>${t(item.proof)}</dd>
    </div>
    <div class="case-details__row">
      <dt>Вклад</dt>
      <dd>${t(item.role)}</dd>
    </div>
  </dl>
`;
}

export function caseCardMarkup(item: CaseCard): string {
  const preview = item.previewImage
    ? casePreviewAsideMarkup({ src: item.previewImage, alt: item.title })
    : "";

  return `
      <article class="timeline-card min-w-0${item.previewImage ? " has-case-preview grid lg:grid-cols-[minmax(0,1fr)_minmax(240px,38%)] lg:items-stretch" : ""}" data-case-card data-reveal>
        <div class="min-w-0 p-7 pb-6">
          <div>
            <h3 class="type-h3 type-h3--lg">${t(item.title)}</h3>
            ${casePillsMarkup(item)}
            ${caseOutcomeMarkup(item)}
          </div>
          ${caseDetailsMarkup(item)}
          ${caseLinksMarkup(item)}
        </div>
        ${preview}
      </article>
    `;
}
