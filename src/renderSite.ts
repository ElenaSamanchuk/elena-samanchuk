import { stack } from "./data/capabilities";
import { capabilityRoadmapMarkup } from "./markup/capabilityRoadmap";
import { getCaseDisplayTags } from "./data/caseDisplayTags";
import { topCases, type CaseCard } from "./data/cases";
import { contactLinks, EXTERNAL_REL } from "./data/contacts";
import { siteCopy } from "./data/siteCopy";
import { escapeHtml } from "./lib/escapeHtml";
import { safeHref } from "./lib/safeUrl";
import { collaborationFlowMarkup } from "./markup/collaborationFlow";
import { collaborationRoadmapsMarkup } from "./markup/collaborationRoadmap";
import { heroPipelineCardMarkup } from "./markup/heroPipelineCard";

const metrics = siteCopy.metrics;

const sectionHeadMarkup = (kicker: string, title: string, lead: string) => `
  <header class="section-head">
    <p class="kicker">${escapeHtml(kicker)}</p>
    <h2 class="type-h2 mt-2">${escapeHtml(title)}</h2>
    <p class="type-lead mt-3 max-w-2xl">${escapeHtml(lead)}</p>
  </header>
`;

const casePillsMarkup = (item: CaseCard) => {
  const tags = getCaseDisplayTags(item.niches, item.tech);
  const badges = item.badges ?? [];
  if (!tags.length && !badges.length) return "";

  const tagHtml = tags
    .map((tag) => {
      const tone = tag.kind === "niche" ? "pill-niche" : "pill-tech";
      return `<span class="${tone}">${escapeHtml(tag.label)}</span>`;
    })
    .join("");

  const badgeHtml = badges
    .map((badge) => `<span class="pill-badge">${escapeHtml(badge)}</span>`)
    .join("");

  return `<div class="mt-3 flex flex-wrap gap-2" aria-label="Ниша и стек">${tagHtml}${badgeHtml}</div>`;
};

const caseOutcomeMarkup = (item: CaseCard) => {
  if (!item.outcome) return "";

  return `<p class="case-outcome">${escapeHtml(item.outcome)}</p>`;
};

const caseLinksMarkup = (item: CaseCard) => `
  <ul class="mt-5 space-y-2" aria-label="Живые примеры">
    ${item.links
      .map(
        (link) => `
      <li>
        <a class="case-link" href="${safeHref(link.href)}" target="_blank" rel="${EXTERNAL_REL}">
          <span>${escapeHtml(link.label)}</span>
          <span aria-hidden="true">↗</span>
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
      <dd>${escapeHtml(item.proof)}</dd>
    </div>
    <div class="case-details__row">
      <dt>Вклад</dt>
      <dd>${escapeHtml(item.role)}</dd>
    </div>
  </dl>
`;

const casePreviewMarkup = (item: CaseCard) => {
  if (!item.previewImage) return "";

  return `<aside class="case-preview is-loading max-lg:order-first max-lg:m-5 max-lg:mb-0 max-lg:min-h-[min(300px,45vh)]" data-case-preview aria-label="Превью ${escapeHtml(item.title)}">
    <div class="case-preview__viewport">
      <div class="case-preview__skeleton" aria-hidden="true"></div>
      <div class="case-preview__stage" data-preview-stage>
        <div class="case-preview__track" data-preview-track>
          <img
            data-preview-img
            src="${safeHref(item.previewImage)}"
            alt="Скриншот ${escapeHtml(item.title)}"
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
  .map(
    (item) =>
      `<li class="type-caption fill-muted rounded-full px-3 py-1.5 font-medium">${escapeHtml(item)}</li>`,
  )
  .join("");

const metricsMarkup = metrics
  .map(
    (item) => `
      <li class="metric-tile" data-metric data-metric-end="${item.end}">
        <strong class="type-metric">
          <span data-metric-value>0</span>${item.suffix ? escapeHtml(item.suffix) : ""}
        </strong>
        <span class="type-caption mt-1 block">${escapeHtml(item.label)}</span>
      </li>
    `,
  )
  .join("");

const caseMarkup = topCases
  .map(
    (item) => `
      <article class="timeline-card${item.previewImage ? " has-case-preview grid lg:grid-cols-[minmax(0,1fr)_minmax(240px,38%)] lg:items-stretch" : ""}" data-case-card data-reveal>
        <div class="min-w-0 p-7 pb-6">
          <div>
            <h3 class="type-h3 type-h3--lg">${escapeHtml(item.title)}</h3>
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
        <span class="type-nav-tagline block">${escapeHtml(siteCopy.brand.tagline)}</span>
      </span>
    </a>
    <div class="nav-links ml-auto">
      ${siteCopy.nav.map((item) => `<a class="nav-link" href="${item.href}">${escapeHtml(item.label)}</a>`).join("")}
    </div>
  </nav>
`;

const contactHubMarkup = `
  <section
    class="contact-hub content-section flex flex-col gap-0 overflow-hidden p-7 lg:p-8"
    id="${siteCopy.contact.sectionId}"
    style="view-transition-name: contact"
    aria-labelledby="contact-formats-title"
    data-reveal
  >
    <div class="contact-hub__collab min-w-0">
      <p class="kicker">${escapeHtml(siteCopy.contact.formatsKicker)}</p>
      <h2 id="contact-formats-title" class="type-h2 mt-2">${escapeHtml(siteCopy.contact.formatsTitle)}</h2>
      <p class="type-lead mt-3 max-w-3xl">${escapeHtml(siteCopy.contact.formatsLead)}</p>
      <div class="collab-roadmaps mt-5">${collaborationRoadmapsMarkup}</div>
    </div>
    <div class="contact-hub__cta mt-8 lg:mt-10" id="contact-cta">
      <p class="kicker">${escapeHtml(siteCopy.contact.ctaKicker)}</p>
      <h3 class="type-h3 mt-2">${escapeHtml(siteCopy.contact.ctaTitle)}</h3>
      <p class="type-lead mt-3 max-w-2xl">${escapeHtml(siteCopy.contact.ctaLead)}</p>
      ${collaborationFlowMarkup}
      <div class="contact-hub__actions mt-5">
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

  <header class="relative pt-[calc(var(--site-nav-offset)+1.5rem)] lg:min-h-[min(540px,72vh)]" id="top">
    <div class="site-container grid items-center gap-9 pb-14 pt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
      <div class="min-w-0" data-stagger>
        <h1 class="type-display max-w-3xl" data-reveal>${siteCopy.hero.titleHtml}</h1>
        <p class="type-lead mt-4 max-w-2xl" data-reveal>${escapeHtml(siteCopy.hero.forWhom)}</p>
        <div class="mt-6 flex flex-wrap gap-3" data-reveal>
          <a class="btn-primary" href="#collaboration">Обсудить проект</a>
          <a class="btn-secondary" href="#cases">Смотреть кейсы</a>
        </div>
        <ul class="mt-8 grid list-none gap-3 p-0 sm:grid-cols-3" data-reveal>${metricsMarkup}</ul>
      </div>
      <aside class="hero-side" data-reveal>
        ${heroPipelineCardMarkup}
      </aside>
    </div>
  </header>

  <main class="site-layout site-container pb-16 pt-10 lg:pb-[72px] lg:pt-14">
    <aside class="site-sidebar min-w-0" data-stagger>
      <div class="site-sidebar__sticky flex flex-col gap-5 lg:sticky lg:top-[108px]">
        <section class="surface-card p-5" data-reveal>
          <h2 class="kicker">${escapeHtml(siteCopy.sidebar.hireTitle)}</h2>
          <p class="type-body mt-3">${escapeHtml(siteCopy.sidebar.hireText)}</p>
          <a class="btn-primary mt-4 w-full" href="${safeHref(contactLinks.telegram)}" target="_blank" rel="${EXTERNAL_REL}">Написать в Telegram</a>
        </section>

        <section class="surface-card p-5" data-reveal>
          <h2 class="kicker">${escapeHtml(siteCopy.sidebar.stackTitle)}</h2>
          <ul class="mt-4 flex list-none flex-wrap gap-2 p-0">${stackMarkup}</ul>
        </section>

        <section class="surface-card p-5" id="contact" data-reveal>
          <h2 class="kicker">Контакты</h2>
          <div class="mt-4 flex flex-col gap-2">
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
        <div class="flex flex-col gap-5" data-stagger>${caseMarkup}</div>
      </section>

      <section class="content-section" id="${siteCopy.workProcess.id}" style="view-transition-name: capabilities">
        ${sectionHeadMarkup(siteCopy.workProcess.kicker, siteCopy.workProcess.title, siteCopy.workProcess.lead)}
        <div data-reveal>${capabilityRoadmapMarkup}</div>
      </section>

      ${contactHubMarkup}
    </div>
  </main>

  <footer class="site-footer border-line border-t py-8">
    <div class="site-container">
      <small class="type-caption">${escapeHtml(`© ${year} Елена Саманчук`)}</small>
    </div>
  </footer>
`;
}
