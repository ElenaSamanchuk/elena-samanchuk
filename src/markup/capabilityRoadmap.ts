import { capabilities } from "../data/capabilities";

import { escapeHtml } from "../lib/escapeHtml";
import { bindTypography } from "../lib/typography";

const t = (text: string) => escapeHtml(bindTypography(text));



const tagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-zа-яё0-9-]/gi, "");

const pillKinds = ["pill-niche", "pill-tech", "pill-badge"] as const;



const pillClass = (stepIndex: number, tagIndex: number) => {

  const kinds =

    stepIndex === 0

      ? (["pill-niche", "pill-niche", "pill-tech"] as const)

      : stepIndex === 3

        ? (["pill-tech", "pill-niche", "pill-badge"] as const)

        : pillKinds;

  return kinds[tagIndex % kinds.length];

};



export const capabilityRoadmapMarkup = `

  <div class="project-journey-map" data-diagram="journey-map">

    <div class="project-journey-map__rail" aria-hidden="true">

      <span class="project-journey-map__track project-journey-map__track--h"></span>

      <span class="project-journey-map__track project-journey-map__track--v"></span>

    </div>

    <ol class="project-journey-map__steps" aria-label="Карта пути проекта: 1 → 2 → 3 → 4">

      ${capabilities

        .map(

          (item, stepIndex) => `

        <li class="project-journey-map__step" data-step="${stepIndex + 1}">

          <span class="project-journey-map__marker" aria-hidden="true">${stepIndex + 1}</span>

          <div class="project-journey-map__body">

            <span class="project-journey-map__focus">${t(item.focus)}</span>

            <strong class="project-journey-map__title">${t(item.title)}</strong>

            <p class="project-journey-map__lead">${t(item.lead)}</p>

            <div class="project-journey-map__tags" aria-label="Ключевые навыки: ${t(item.title)}">

              ${item.tags

                .map(

                  (tag, tagIndex) =>

                    `<span class="${pillClass(stepIndex, tagIndex)}" data-tag="${tagSlug(tag)}">${t(tag)}</span>`,

                )

                .join("")}

            </div>

          </div>

        </li>

      `,

        )

        .join("")}

    </ol>

  </div>

`;


