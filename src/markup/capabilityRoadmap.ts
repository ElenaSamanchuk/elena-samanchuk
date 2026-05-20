import { capabilities } from "../data/capabilities";
import { escapeHtml } from "../lib/escapeHtml";

const pillClass = (index: number) => {
  const kinds = ["pill-niche", "pill-tech", "pill-tech", "pill-badge"] as const;
  return kinds[index] ?? "pill-tech";
};

export const capabilityRoadmapMarkup = `
  <ol class="capability-roadmap" aria-label="Четыре зоны ответственности">
    ${capabilities
      .map(
        (item, index) => `
      <li class="capability-roadmap__node">
        <span class="capability-roadmap__dot" aria-hidden="true">${index + 1}</span>
        <div class="capability-roadmap__copy">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.lead)}</span>
          <div class="capability-roadmap__tags" aria-label="Направления">
            ${item.groups
              .map(
                (group) =>
                  `<span class="${pillClass(index)}">${escapeHtml(group.label)}</span>`,
              )
              .join("")}
          </div>
        </div>
      </li>
    `,
      )
      .join("")}
  </ol>
`;
