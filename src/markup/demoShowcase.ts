import type { DemoShowcaseConfig, DemoShowcaseStep } from "../data/demoShowcaseTypes";
import { pageBuilderCoreMarkup } from "./pageBuilderCore";
import { casePreviewAsideMarkup } from "./casePreview";
import { EXTERNAL_REL } from "../data/contacts";
import { escapeHtml } from "../lib/escapeHtml";
import { bindTypography } from "../lib/typography";
import { safeHref } from "../lib/safeUrl";

const t = (text: string) => escapeHtml(bindTypography(text));

const pillClass = (kind: DemoShowcaseConfig["pills"][number]["kind"]) => {
  if (kind === "badge") return "pill-badge";
  if (kind === "niche") return "pill-niche";
  return "pill-tech";
};

const chipsPanelMarkup = (configId: string, step: DemoShowcaseStep, isActive: boolean) => {
  const chips = (step.chips ?? [])
    .map((thesis) => `<span class="turnkey-brief-chip" data-turnkey-brief-chip>${t(thesis)}</span>`)
    .join("");

  return `
    <div
      class="turnkey-visual turnkey-visual--brief${isActive ? " is-active" : ""}"
      id="${configId}-visual-${step.id}"
      role="tabpanel"
      aria-labelledby="${configId}-tab-${step.id}"
      data-turnkey-visual="${step.id}"
      data-turnkey-visual-type="chips"
      ${isActive ? "" : "hidden"}
    >
      <div class="turnkey-brief-scroll" data-turnkey-brief-viewport>
        <div class="turnkey-brief-cloud" data-turnkey-brief-track>${chips}</div>
      </div>
    </div>
  `;
};

const figmaPanelMarkup = (configId: string, step: DemoShowcaseStep, isActive: boolean) => `
  <div
    class="turnkey-visual${isActive ? " is-active" : ""}"
    id="${configId}-visual-${step.id}"
    role="tabpanel"
    aria-labelledby="${configId}-tab-${step.id}"
    data-turnkey-visual="${step.id}"
    data-turnkey-visual-type="figma"
    ${isActive ? "" : "hidden"}
  >
    <div class="page-builder page-builder--turnkey" data-turnkey-figma-builder aria-hidden="true">
      ${pageBuilderCoreMarkup}
    </div>
  </div>
`;

const codePanelMarkup = (
  configId: string,
  step: DemoShowcaseStep,
  isActive: boolean,
  codeTabs: [string, string],
) => `
  <div
    class="turnkey-visual${isActive ? " is-active" : ""}"
    id="${configId}-visual-${step.id}"
    role="tabpanel"
    aria-labelledby="${configId}-tab-${step.id}"
    data-turnkey-visual="${step.id}"
    data-turnkey-visual-type="code"
    ${isActive ? "" : "hidden"}
  >
    <div class="turnkey-code-editor" data-turnkey-code-editor>
      <div class="turnkey-code-editor__tabs" aria-hidden="true">
        <span class="is-active">${t(codeTabs[0])}</span>
        <span>${t(codeTabs[1])}</span>
      </div>
      <pre class="turnkey-code-editor__pre" aria-hidden="true"><code data-turnkey-code-output></code><span class="turnkey-code-editor__caret" data-turnkey-code-caret aria-hidden="true"></span></pre>
    </div>
  </div>
`;

const visualPanelMarkup = (
  config: DemoShowcaseConfig,
  step: DemoShowcaseStep,
  isFirstInteractive: boolean,
) => {
  const codeTabs = config.codeTabs ?? ["index.html", "style.css"];

  if (step.visual === "chips") return chipsPanelMarkup(config.id, step, isFirstInteractive);
  if (step.visual === "figma") return figmaPanelMarkup(config.id, step, isFirstInteractive);
  if (step.visual === "code") return codePanelMarkup(config.id, step, isFirstInteractive, codeTabs);
  return "";
};

export function demoShowcaseMarkup(config: DemoShowcaseConfig): string {
  const interactiveSteps = config.steps.filter((step) => step.id !== "ship");
  const firstInteractiveId = interactiveSteps[0]?.id;

  const stepPlates = config.steps
    .map(
      (step, index) => `
    <button
      type="button"
      class="turnkey-plate${index === 0 ? " is-active" : ""}"
      role="tab"
      aria-selected="${index === 0 ? "true" : "false"}"
      aria-controls="${config.id}-visual-${step.id}"
      id="${config.id}-tab-${step.id}"
      data-turnkey-step="${step.id}"
      data-turnkey-index="${index}"
    >
      <span class="turnkey-plate__focus">${t(step.focus)}</span>
      <strong class="turnkey-plate__title">${t(step.title)}</strong>
    </button>
  `,
    )
    .join("");

  const pillsMarkup = config.pills
    .map((pill) => `<span class="${pillClass(pill.kind)}">${t(pill.label)}</span>`)
    .join("");

  const caseLinks = `
    <ul class="case-links case-links--grid case-links--inline" aria-label="Ссылки проекта">
      ${config.links
        .map(
          (link) => `
        <li class="case-links__item">
          <a class="case-link-chip" href="${safeHref(link.href)}" target="_blank" rel="${EXTERNAL_REL}">
            <span class="case-link-chip__label">${t(link.label)}</span>
            <span class="case-link__icon" aria-hidden="true"></span>
          </a>
        </li>
      `,
        )
        .join("")}
    </ul>
  `;

  const overlaysMarkup = `
    <div class="turnkey-overlays" data-turnkey-overlays>
      ${interactiveSteps
        .map((step) => visualPanelMarkup(config, step, step.id === firstInteractiveId))
        .join("")}
    </div>
  `;

  const platesLabel =
    config.id === "vital-coach" ? "Этапы разработки приложения" : "Этапы кейса под ключ";

  return `
    <article
      class="timeline-card has-case-preview turnkey-showcase min-w-0 grid lg:grid-cols-[minmax(0,1fr)_minmax(240px,38%)] lg:items-stretch"
      id="demo-${config.id}"
      data-case-card
      data-turnkey-showcase
      data-showcase-id="${config.id}"
      data-reveal
      aria-labelledby="demo-${config.id}-title"
    >
      <div class="min-w-0 p-7 pb-6 turnkey-showcase__copy">
        <div>
          <h3 id="demo-${config.id}-title" class="type-h3 type-h3--lg">${t(config.title)}</h3>
          <div class="mt-3 flex flex-wrap gap-2" aria-label="Ниша и стек">${pillsMarkup}</div>
        </div>

        <div class="turnkey-plates" role="tablist" aria-label="${t(platesLabel)}">
          ${stepPlates}
        </div>

        ${caseLinks}
      </div>

      ${casePreviewAsideMarkup({
        src: config.previewImage,
        alt: config.title,
        overlayMarkup: overlaysMarkup,
      })}
    </article>
  `;
}

export function demoShowcasesMarkup(configs: DemoShowcaseConfig[]): string {
  return configs.map((config) => demoShowcaseMarkup(config)).join("");
}
