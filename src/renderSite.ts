import { stack } from "./data/capabilities";
import { capabilityRoadmapMarkup } from "./markup/capabilityRoadmap";
import { getCaseDisplayTags } from "./data/caseDisplayTags";
import { topCases, type CaseCard } from "./data/cases";
import { contactLinks, EXTERNAL_REL } from "./data/contacts";
import { siteCopy } from "./data/siteCopy";
import { escapeHtml } from "./lib/escapeHtml";
import { bindTypography } from "./lib/typography";
import { safeHref } from "./lib/safeUrl";
import { collaborationMatrixMarkup } from "./markup/collaborationMatrix";
import { heroPipelineCardMarkup } from "./markup/heroPipelineCard";

const metrics = siteCopy.metrics;

const t = (text: string) => escapeHtml(bindTypography(text));

const caseLinkLabelMarkup = (label: string, mobileLabel?: string) => {
  if (mobileLabel) {
    return `<span class="case-link-chip__label"><span class="case-link-chip__label--desktop">${t(label)}</span><span class="case-link-chip__label--mobile">${t(mobileLabel)}</span></span>`;
  }
  return `<span class="case-link-chip__label">${t(label)}</span>`;
};

const sectionHeadMarkup = (
  kicker: string,
  title: string,
  lead: string,
  titleId?: string,
) => `
  <header class="section-head">
    <p class="kicker">${t(kicker)}</p>
    <h2 class="type-h2 mt-2"${titleId ? ` id="${titleId}"` : ""}>${t(title)}</h2>
    <p class="type-lead mt-3 max-w-2xl">${t(lead)}</p>
  </header>
`;

const casePillsMarkup = (item: CaseCard) => {
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
};

const caseOutcomeMarkup = (item: CaseCard) => {
  if (!item.outcome) return "";

  return `<p class="case-outcome">${t(item.outcome)}</p>`;
};

const caseLinksMarkup = (item: CaseCard) => `
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

const caseDetailsMarkup = (item: CaseCard) => `
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

const casePreviewMarkup = (item: CaseCard) => {
  if (!item.previewImage) return "";

  return `<aside class="case-preview is-loading box-border w-full max-w-full max-lg:order-first max-lg:h-[200px] max-lg:min-h-[200px] max-lg:max-h-[200px]" data-case-preview aria-label="Превью ${t(item.title)}">
    <div class="case-preview__viewport">
      <div class="case-preview__skeleton" aria-hidden="true"></div>
      <div class="case-preview__stage" data-preview-stage>
        <div class="case-preview__track" data-preview-track>
          <img
            data-preview-img
            src="${safeHref(item.previewImage)}"
            alt="Скриншот ${t(item.title)}"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
        </div>
      </div>
    </div>
  </aside>`;
};

const stackMarkup = stack
  .map((item) => {
    if (item === "Cursor") {
      return `<li class="stack-chip type-caption fill-muted rounded-full px-3 py-1.5 font-medium">${t(item)}<span class="stack-chip__badge pill-badge">AI</span></li>`;
    }
    return `<li class="type-caption fill-muted rounded-full px-3 py-1.5 font-medium">${t(item)}</li>`;
  })
  .join("");

const metricsMarkup = metrics
  .map(
    (item) => `
      <li class="metric-tile" data-metric data-metric-end="${item.end}">
        <strong class="type-metric">
          <span data-metric-value>0</span>${item.suffix ? escapeHtml(item.suffix) : ""}
        </strong>
        <span class="type-caption mt-1 block">${t(item.label)}</span>
      </li>
    `,
  )
  .join("");

const caseMarkup = topCases
  .map(
    (item) => `
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
        ${casePreviewMarkup(item)}
      </article>
    `,
  )
  .join("");

const navbarMarkup = `
  <nav class="glass-nav" id="site-navbar" aria-label="Главная навигация">
    <a class="flex min-w-0 shrink items-center gap-2.5 leading-tight no-underline" href="#top">
      <span class="min-w-0">
        <span class="flex items-center gap-2">
          <strong class="type-nav-name">Елена Саманчук</strong>
          <span class="status-pulse shrink-0" title="Онлайн" aria-label="Онлайн"></span>
        </span>
        <span class="type-nav-tagline block">${t(siteCopy.brand.tagline)}</span>
      </span>
    </a>
    <button
      type="button"
      class="nav-burger"
      id="nav-burger"
      aria-expanded="false"
      aria-controls="site-nav-drawer"
      aria-label="Открыть меню"
    >
      <span class="nav-burger__bar" aria-hidden="true"></span>
      <span class="nav-burger__bar" aria-hidden="true"></span>
      <span class="nav-burger__bar" aria-hidden="true"></span>
    </button>
    <div class="nav-links" id="site-nav-drawer">
      ${siteCopy.nav.map((item) => `<a class="nav-link" href="${item.href}">${t(item.label)}</a>`).join("")}
    </div>
  </nav>
  <div class="nav-drawer-backdrop" id="nav-drawer-backdrop" hidden aria-hidden="true"></div>
`;

const contactHubMarkup = `
  <section
    class="contact-hub content-section flex flex-col gap-0 overflow-hidden p-4 lg:p-8"
    id="${siteCopy.contact.sectionId}"
    style="view-transition-name: contact"
    aria-labelledby="contact-formats-title"
  >
    <div class="contact-hub__collab min-w-0">
      <p class="kicker">${t(siteCopy.contact.formatsKicker)}</p>
      <h2 id="contact-formats-title" class="type-h2 mt-2">${t(siteCopy.contact.formatsTitle)}</h2>
      <p class="type-lead mt-3 max-w-3xl">${t(siteCopy.contact.formatsLead)}</p>
      ${collaborationMatrixMarkup}
    </div>
    <div class="contact-hub__cta mt-6 lg:mt-10" id="contact-cta" data-section-anchor>
      <header class="section-head section-head--compact">
        <p class="kicker">${t(siteCopy.contact.ctaKicker)}</p>
        <h3 class="type-h3 mt-2">${t(siteCopy.contact.ctaTitle)}</h3>
        <p class="type-lead mt-3 max-w-2xl">${t(siteCopy.contact.ctaLead)}</p>
      </header>
      <div class="contact-hub__actions mt-4 lg:mt-5">
        <a class="btn-primary" href="${safeHref(contactLinks.telegram)}" target="_blank" rel="${EXTERNAL_REL}">Написать в Telegram</a>
        <a class="btn-secondary" href="${safeHref(contactLinks.email)}">Написать на email</a>
      </div>
    </div>
  </section>
`;

export function renderSite(root: HTMLElement): void {
  const year = new Date().getFullYear();

  root.innerHTML = `
  <a class="skip-link" href="#cases">Перейти к контенту</a>

  <div class="scroll-progress" aria-hidden="true">
    <div class="scroll-progress__bar" id="scroll-progress-bar"></div>
  </div>

  ${navbarMarkup}

  <header class="hero-header relative lg:min-h-[min(540px,72vh)]" id="top">
    <div class="site-container hero-header__inner grid items-center gap-6 pb-8 lg:gap-9 lg:pb-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
      <div class="hero-header__copy min-w-0" data-stagger>
        <h1 class="type-display max-w-3xl" data-reveal>${siteCopy.hero.titleHtml}</h1>
        <p class="type-lead max-w-2xl" data-reveal>${t(siteCopy.hero.forWhom)}</p>
        <div class="hero-header__actions" data-reveal>
          <a class="btn-primary" href="#collaboration">Обсудить проект</a>
          <a class="btn-secondary" href="#cases">Смотреть кейсы</a>
        </div>
        <ul class="metrics-row hero-header__metrics grid list-none grid-cols-3 p-0" data-reveal>${metricsMarkup}</ul>
      </div>
      <aside class="hero-side" data-reveal>
        ${heroPipelineCardMarkup}
      </aside>
    </div>
  </header>

  <main class="site-layout site-container lg:pb-[72px] lg:pt-14">
    <aside class="site-sidebar min-w-0">
      <div class="site-sidebar__inner flex flex-col gap-5">
        <section class="surface-card p-5">
          <h2 class="kicker">${t(siteCopy.sidebar.hireTitle)}</h2>
          <p class="type-body mt-3">${t(siteCopy.sidebar.hireText)}</p>
          <a class="btn-primary mt-4 w-full" href="${safeHref(contactLinks.telegram)}" target="_blank" rel="${EXTERNAL_REL}">Написать в Telegram</a>
        </section>

        <section class="surface-card p-5">
          <h2 class="kicker">${t(siteCopy.sidebar.stackTitle)}</h2>
          <ul class="mt-4 flex list-none flex-wrap gap-2 p-0">${stackMarkup}</ul>
        </section>

        <section class="surface-card p-5" id="contact">
          <h2 class="kicker">Контакты</h2>
          <div class="site-sidebar__contacts">
            <a class="link-accent type-body font-medium" href="${safeHref(contactLinks.telegram)}" target="_blank" rel="${EXTERNAL_REL}">Telegram</a>
            <a class="link-accent type-body font-medium" href="${safeHref(contactLinks.email)}">${escapeHtml("elenasamanchuk@gmail.com")}</a>
            <a class="link-accent type-body font-medium" href="${safeHref(contactLinks.github)}" target="_blank" rel="${EXTERNAL_REL}">GitHub</a>
          </div>
        </section>
      </div>
    </aside>

    <div class="content-stack min-w-0">
      <section class="content-section" id="cases" style="view-transition-name: cases">
        ${sectionHeadMarkup(siteCopy.cases.kicker, siteCopy.cases.title, siteCopy.cases.lead)}
        <div class="case-list flex flex-col" data-stagger>${caseMarkup}</div>
      </section>

      <section
        class="content-section"
        id="${siteCopy.workProcess.id}"
        style="view-transition-name: capabilities"
        aria-labelledby="capabilities-title"
      >
        ${sectionHeadMarkup(siteCopy.workProcess.kicker, siteCopy.workProcess.title, siteCopy.workProcess.lead, "capabilities-title")}
        <div class="collab-path collab-path--capabilities project-journey-map-panel" data-diagram="journey-panel">
          ${capabilityRoadmapMarkup}
        </div>
      </section>

      ${contactHubMarkup}
    </div>
  </main>

  <footer class="site-footer py-6 lg:py-8">
    <div class="site-container">
      <small class="type-caption">${escapeHtml(`© ${year} Елена Саманчук`)}</small>
    </div>
  </footer>
`;
}
