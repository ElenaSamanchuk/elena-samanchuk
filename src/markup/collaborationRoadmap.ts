import { collaborationFormats } from "../data/collaboration";

const pathMarkup = (steps: (typeof collaborationFormats)[number]["path"]) =>
  steps
    .map(
      (step, index) => `
      <li class="collab-path__node">
        <span class="collab-path__dot" aria-hidden="true">${index + 1}</span>
        <div class="collab-path__copy">
          <strong>${step.label}</strong>
          <span>${step.hint}</span>
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
        <span class="collab-path__badge">${format.badge}</span>
        <h3>${format.title}</h3>
        <p class="collab-path__summary">${format.summary}</p>
        <p class="collab-path__when">${format.when}</p>
      </header>
      <ol class="collab-path__roadmap" aria-label="Путь: ${format.title}">
        ${pathMarkup(format.path)}
      </ol>
      <a class="btn btn-glass collab-path__cta" href="https://t.me/ElaneDmitrievna" target="_blank" rel="noreferrer">
        <span class="btn__label">Обсудить формат</span>
      </a>
    </article>
  `,
  )
  .join("");
