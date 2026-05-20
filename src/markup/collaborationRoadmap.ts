import { collaborationFormats } from "../data/collaboration";
import { contactLinks, EXTERNAL_REL } from "../data/contacts";
import { escapeHtml } from "../lib/escapeHtml";
import { safeHref } from "../lib/safeUrl";

const pathMarkup = (steps: (typeof collaborationFormats)[number]["path"]) =>
  steps
    .map(
      (step, index) => `
      <li class="collab-path__node">
        <span class="collab-path__dot" aria-hidden="true">${index + 1}</span>
        <div class="collab-path__copy">
          <strong>${escapeHtml(step.label)}</strong>
          <span>${escapeHtml(step.hint)}</span>
        </div>
      </li>
    `,
    )
    .join("");

export const collaborationRoadmapsMarkup = collaborationFormats
  .map(
    (format) => `
    <article class="collab-path reveal-card" data-collab-path>
      <header class="collab-path__head">
        <span class="collab-path__badge">${escapeHtml(format.badge)}</span>
        <h3>${escapeHtml(format.title)}</h3>
        <p class="collab-path__summary">${escapeHtml(format.summary)}</p>
        <p class="collab-path__when">${escapeHtml(format.when)}</p>
      </header>
      <ol class="collab-path__roadmap" aria-label="Путь: ${escapeHtml(format.title)}">
        ${pathMarkup(format.path)}
      </ol>
      <a class="btn btn-glass collab-path__cta" href="${safeHref(contactLinks.telegram)}" target="_blank" rel="${EXTERNAL_REL}">
        <span class="btn__label">Обсудить формат</span>
      </a>
    </article>
  `,
  )
  .join("");
