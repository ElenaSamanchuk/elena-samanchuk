import { collaborationFormats } from "../data/collaboration";
import { escapeHtml } from "../lib/escapeHtml";

const pillClass = (kind: (typeof collaborationFormats)[number]["pillKind"]) => {
  if (kind === "niche") return "pill-niche";
  if (kind === "tech") return "pill-tech";
  return "pill-badge";
};

export const collaborationRoadmapsMarkup = collaborationFormats
  .map(
    (format) => `
    <article class="collab-path" data-collab-path>
      <div class="flex flex-wrap gap-2" aria-label="Формат">
        <span class="${pillClass(format.pillKind)}">${escapeHtml(format.badge)}</span>
      </div>
      <h3 class="mt-3">${escapeHtml(format.title)}</h3>
      <p class="collab-path__summary">${escapeHtml(format.summary)}</p>
    </article>
  `,
  )
  .join("");
