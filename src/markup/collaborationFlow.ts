import { collaborationSteps } from "../data/collaboration";
import { escapeHtml } from "../lib/escapeHtml";

export const collaborationFlowMarkup = `
  <ol class="collab-path__roadmap collab-path__roadmap--horizontal" aria-label="Как начинаем работу">
    ${collaborationSteps
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
      .join("")}
  </ol>
`;
