import {
  collaborationFormats,
  collaborationQuadrants,
  formatMapCopy,
  type CollaborationFormat,
  type FormatMapQuadrant,
} from "../data/collaboration";
import { escapeHtml } from "../lib/escapeHtml";
import { bindTypography } from "../lib/typography";

const t = (text: string) => escapeHtml(bindTypography(text));

const pillClass = (kind: CollaborationFormat["pillKind"]) => {
  if (kind === "niche") return "pill-niche";
  if (kind === "tech") return "pill-tech";
  return "pill-badge";
};

const formatById = (id: CollaborationFormat["id"]) =>
  collaborationFormats.find((f) => f.id === id)!;

const formatCardMarkup = (format: CollaborationFormat) => `
  <article class="format-map__card format-map__card--${format.id}">
    <span class="${pillClass(format.pillKind)} format-map__badge">${t(format.badge)}</span>
    <h3 class="format-map__title">${t(format.title)}</h3>
    <p class="format-map__summary">${t(format.summary)}</p>
    <ul class="format-map__hints">
      ${format.hints.map((hint) => `<li>${t(hint)}</li>`).join("")}
    </ul>
  </article>
`;

const customCardMarkup = (
  badge: string,
  pillKind: CollaborationFormat["pillKind"],
  title: string,
  summary: string,
  hints: string[],
) => `
  <article class="format-map__card format-map__card--custom">
    <span class="${pillClass(pillKind)} format-map__badge">${t(badge)}</span>
    <h3 class="format-map__title">${t(title)}</h3>
    <p class="format-map__summary">${t(summary)}</p>
    <ul class="format-map__hints">
      ${hints.map((hint) => `<li>${t(hint)}</li>`).join("")}
    </ul>
  </article>
`;

const quadrantMarkup = (quad: FormatMapQuadrant) => {
  const cellClass = `format-map__quadrant format-map__quadrant--${quad.position}`;

  if (quad.kind === "custom") {
    return `
      <div class="${cellClass}">
        ${customCardMarkup(quad.badge, quad.pillKind, quad.title, quad.summary, quad.hints)}
      </div>
    `;
  }

  return `
    <div class="${cellClass}">
      ${formatCardMarkup(formatById(quad.formatId))}
    </div>
  `;
};

export const collaborationMatrixMarkup = `
  <div
    class="format-map mt-5"
    data-diagram="format-map"
    role="group"
    aria-describedby="contact-formats-title"
    aria-label="Схема выбора формата: срочность и длительность"
  >
    <div class="format-map__frame">
      <div class="format-map__plane">
        <div class="format-map__axes" aria-hidden="true">
          <span class="format-map__axis-line format-map__axis-line--y"></span>
          <span class="format-map__axis-line format-map__axis-line--x"></span>
        </div>
        <span class="format-map__axis-label format-map__axis-label--top">${t(formatMapCopy.axisUrgencyLow)}</span>
        <span class="format-map__axis-label format-map__axis-label--bottom">${t(formatMapCopy.axisUrgencyHigh)}</span>
        <span class="format-map__axis-label format-map__axis-label--left">${t(formatMapCopy.axisDurationShort)}</span>
        <span class="format-map__axis-label format-map__axis-label--right">${t(formatMapCopy.axisDurationLong)}</span>
        <div class="format-map__quadrants">
          ${collaborationQuadrants.map(quadrantMarkup).join("")}
        </div>
      </div>
    </div>
  </div>
`;
