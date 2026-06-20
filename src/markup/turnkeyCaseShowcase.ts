import { briefTheses, turnkeyCaseMeta, turnkeyCaseSteps } from "../data/turnkeyCase";
import { pageBuilderCoreMarkup } from "./pageBuilderCore";
import { casePreviewAsideMarkup } from "./casePreview";
import { EXTERNAL_REL } from "../data/contacts";
import { escapeHtml } from "../lib/escapeHtml";
import { bindTypography } from "../lib/typography";
import { safeHref } from "../lib/safeUrl";

const t = (text: string) => escapeHtml(bindTypography(text));

const stepPlates = turnkeyCaseSteps
  .map(
    (step, index) => `
    <button
      type="button"
      class="turnkey-plate${index === 0 ? " is-active" : ""}"
      role="tab"
      aria-selected="${index === 0 ? "true" : "false"}"
      aria-controls="turnkey-visual-${step.id}"
      id="turnkey-tab-${step.id}"
      data-turnkey-step="${step.id}"
      data-turnkey-index="${index}"
    >
      <span class="turnkey-plate__focus">${t(step.focus)}</span>
      <strong class="turnkey-plate__title">${t(step.title)}</strong>
    </button>
  `,
  )
  .join("");

const briefChips = briefTheses
  .map((thesis) => `<span class="turnkey-brief-chip" data-turnkey-brief-chip>${t(thesis)}</span>`)
  .join("");

const caseLinks = `
  <ul class="case-links case-links--grid case-links--inline" aria-label="Ссылки проекта">
    ${turnkeyCaseMeta.links
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

const turnkeyOverlaysMarkup = `
  <div class="turnkey-overlays" data-turnkey-overlays>
    <div
      class="turnkey-visual turnkey-visual--brief is-active"
      id="turnkey-visual-brief"
      role="tabpanel"
      aria-labelledby="turnkey-tab-brief"
      data-turnkey-visual="brief"
    >
      <div class="turnkey-brief-scroll" data-turnkey-brief-viewport>
        <div class="turnkey-brief-cloud" data-turnkey-brief-track>${briefChips}</div>
      </div>
    </div>

    <div
      class="turnkey-visual"
      id="turnkey-visual-figma"
      role="tabpanel"
      aria-labelledby="turnkey-tab-figma"
      data-turnkey-visual="figma"
      hidden
    >
      <div class="page-builder page-builder--turnkey" data-turnkey-figma-builder aria-hidden="true">
        ${pageBuilderCoreMarkup}
      </div>
    </div>

    <div
      class="turnkey-visual"
      id="turnkey-visual-code"
      role="tabpanel"
      aria-labelledby="turnkey-tab-code"
      data-turnkey-visual="code"
      hidden
    >
      <div class="turnkey-code-editor" data-turnkey-code-editor>
        <div class="turnkey-code-editor__tabs" aria-hidden="true">
          <span class="is-active">index.html</span>
          <span>style.css</span>
        </div>
        <pre class="turnkey-code-editor__pre" aria-hidden="true"><code data-turnkey-code-output></code><span class="turnkey-code-editor__caret" data-turnkey-code-caret aria-hidden="true"></span></pre>
      </div>
    </div>
  </div>
`;

export const turnkeyCaseShowcaseMarkup = `
  <article
    class="timeline-card has-case-preview turnkey-showcase min-w-0 grid lg:grid-cols-[minmax(0,1fr)_minmax(240px,38%)] lg:items-stretch"
    id="turnkey-case"
    data-case-card
    data-turnkey-showcase
    data-reveal
    aria-labelledby="turnkey-case-title"
  >
    <div class="min-w-0 p-7 pb-6 turnkey-showcase__copy">
      <div>
        <h3 id="turnkey-case-title" class="type-h3 type-h3--lg">${t(turnkeyCaseMeta.title)}</h3>
        <div class="mt-3 flex flex-wrap gap-2" aria-label="Ниша и стек">
          <span class="pill-badge">${t("демо")}</span>
          <span class="pill-badge">${t("под ключ")}</span>
          <span class="pill-niche">${t("event")}</span>
          <span class="pill-tech">${t("Figma Play")}</span>
        </div>
      </div>

      <div class="turnkey-plates" role="tablist" aria-label="Этапы кейса под ключ">
        ${stepPlates}
      </div>

      ${caseLinks}
    </div>

    ${casePreviewAsideMarkup({
      src: turnkeyCaseMeta.previewImage,
      alt: turnkeyCaseMeta.title,
      overlayMarkup: turnkeyOverlaysMarkup,
    })}
  </article>
`;
