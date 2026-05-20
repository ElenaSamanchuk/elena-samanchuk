import { bentoSpans, capabilities, stack } from "./data/capabilities";
import { topCases, type CaseCard } from "./data/cases";
import { getCaseDisplayTags } from "./data/caseDisplayTags";
import { contactLinks, EXTERNAL_REL } from "./data/contacts";
import { agencies, brands } from "./data/clients";
import { pageJourney, siteCopy } from "./data/siteCopy";
import { escapeHtml } from "./lib/escapeHtml";
import { safeHref } from "./lib/safeUrl";
import { collaborationRoadmapsMarkup } from "./markup/collaborationRoadmap";
import { heroPipelineCardMarkup } from "./markup/heroPipelineCard";

const metrics = siteCopy.metrics;

const sectionHeadMarkup = (num: string, kicker: string, title: string, lead: string) => `
  <header class="section-head">
    <span class="section-head__num" aria-hidden="true">${num}</span>
    <p class="section-kicker">${escapeHtml(kicker)}</p>
    <h2>${escapeHtml(title)}</h2>
    <p class="block-lead">${escapeHtml(lead)}</p>
  </header>
`;

const caseTagsMarkup = (item: CaseCard) => {
  const tags = getCaseDisplayTags(item.niches, item.tech);
  if (!tags.length) return "";

  return `<div class="case-tags" aria-label="Ниша и стек">
    ${tags.map((tag) => `<span class="case-tag case-tag--${tag.kind}">${escapeHtml(tag.label)}</span>`).join("")}
  </div>`;
};

const caseLinksMarkup = (item: CaseCard) => `
  <ul class="case-links" aria-label="Живые примеры">
    ${item.links
      .map(
        (link) => `
      <li>
        <a href="${safeHref(link.href)}" target="_blank" rel="${EXTERNAL_REL}">
          <span class="case-links__label">${escapeHtml(link.label)}</span>
          <span class="case-links__icon" aria-hidden="true">↗</span>
        </a>
      </li>
    `,
      )
      .join("")}
  </ul>
`;

const caseMetricsMarkup = (item: CaseCard) => {
  if (!item.metrics.length) return "";

  return `<div class="case-card-metrics">
    ${item.metrics
      .map(
        (metric) => `
      <div class="case-card-metric">
        <span>${escapeHtml(metric.label)}</span>
        <strong>${escapeHtml(metric.value)}</strong>
      </div>
    `,
      )
      .join("")}
  </div>`;
};

const caseDetailsMarkup = (item: CaseCard) => `
  <dl class="case-details">
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

  return `<aside class="case-preview is-loading" data-case-preview aria-label="Превью ${escapeHtml(item.title)}">
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

const capabilityMarkup = capabilities
  .map(
    (item, index) => `
      <article class="capability-card reveal-card bento-item ${bentoSpans[index] ?? ""}">
        <p class="capability-card__index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</p>
        <div class="capability-icon" aria-hidden="true"></div>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="capability-card__lead">${escapeHtml(item.lead)}</p>
        <div class="capability-groups">
          ${item.groups
            .map(
              (group) => `
            <div class="capability-group">
              <span class="capability-group__label">${escapeHtml(group.label)}</span>
              <span class="capability-group__items">${escapeHtml(group.items)}</span>
            </div>
          `,
            )
            .join("")}
        </div>
      </article>
    `,
  )
  .join("");

const stackMarkup = stack.map((item) => `<li class="skill-pill">${escapeHtml(item)}</li>`).join("");

const metricsMarkup = metrics
  .map(
    (item) => `
      <li class="metric-item" data-metric-end="${item.end}" data-metric-suffix="${escapeHtml(item.suffix)}">
        <strong>
          <span class="metric-value">0</span>${item.suffix ? `<span class="metric-suffix">${escapeHtml(item.suffix)}</span>` : ""}
        </strong>
        <span>${escapeHtml(item.label)}</span>
      </li>
    `,
  )
  .join("");

const caseMarkup = topCases
  .map(
    (item, index) => `
      <article class="resume-card timeline-card reveal-card${item.previewImage ? " has-case-preview" : ""}">
        <div class="timeline-card__main">
          <div class="case-card__head">
            <span class="case-card__index">${String(index + 1).padStart(2, "0")}</span>
            ${caseTagsMarkup(item)}
            <h3>${escapeHtml(item.title)}</h3>
            <p class="case-card__sector">${escapeHtml(item.sector)}</p>
            <p class="case-outcome">${escapeHtml(item.outcome)}</p>
          </div>
          ${caseDetailsMarkup(item)}
          ${caseMetricsMarkup(item)}
          ${caseLinksMarkup(item)}
        </div>
        ${casePreviewMarkup(item)}
      </article>
    `,
  )
  .join("");

const partnerNames = [...new Set([...agencies, ...brands])];

const pageJourneyMarkup = `
  <nav class="page-journey" aria-label="Маршрут по странице">
    <div class="container">
    <ol class="page-journey__list">
      ${pageJourney
        .map(
          (item) => `
        <li>
          <a class="page-journey__link" href="${item.href}">
            <span class="page-journey__dot" aria-hidden="true"></span>
            <span class="page-journey__label">${escapeHtml(item.label)}</span>
          </a>
        </li>
      `,
        )
        .join("")}
    </ol>
    </div>
  </nav>
`;

const partnersLineMarkup = partnerNames
  .slice(0, 10)
  .map((name) => escapeHtml(name))
  .join('<span class="partners-strip__sep" aria-hidden="true"> · </span>');

const navbarMarkup = `
  <nav class="navbar" id="site-navbar" aria-label="Главная навигация">
    <a class="logo" href="#top">
      <span>ES</span>
      <span class="logo__text">
        <strong>Елена Саманчук</strong>
        <span class="logo__role">Маркетинг · веб-продакшн</span>
      </span>
    </a>
    <div class="nav-status" aria-label="Открыта к предложениям">
      <span class="status-pulse" aria-hidden="true"></span>
      Доступна · удалённо
    </div>
    <div class="nav-links">
      ${siteCopy.nav.map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`).join("")}
    </div>
  </nav>
`;

const contactHubMarkup = `
  <section
    class="main-block final-conversion contact-hub collaboration-block reveal-card vt-section"
    id="${siteCopy.contact.sectionId}"
    style="view-transition-name: contact"
    aria-labelledby="contact-formats-title"
  >
    <div class="contact-hub__collab">
      <p class="hero-label">${escapeHtml(siteCopy.contact.formatsKicker)}</p>
      <h2 id="contact-formats-title" class="contact-hub__collab-title">${escapeHtml(siteCopy.contact.formatsTitle)}</h2>
      <p class="block-lead">${escapeHtml(siteCopy.contact.formatsLead)}</p>
      <p class="collab-legend" aria-hidden="true">
        <span>Сообщение</span>
        <span class="collab-legend__line" aria-hidden="true"></span>
        <span>Согласование</span>
        <span class="collab-legend__line" aria-hidden="true"></span>
        <span>Старт работ</span>
      </p>
      <div class="collab-roadmaps">
        ${collaborationRoadmapsMarkup}
      </div>
    </div>
    <div class="contact-hub__divider" aria-hidden="true"></div>
    <div class="contact-hub__cta" id="contact-cta">
      <p class="hero-label">${escapeHtml(siteCopy.contact.ctaKicker)}</p>
      <h3 class="contact-hub__cta-title">${escapeHtml(siteCopy.contact.ctaTitle)}</h3>
      <p class="contact-hub__cta-lead">${escapeHtml(siteCopy.contact.ctaLead)}</p>
      <div class="hero-actions">
        <a class="btn btn-accent" href="${safeHref(contactLinks.telegram)}" target="_blank" rel="${EXTERNAL_REL}"><span class="btn__label">Написать в Telegram</span></a>
        <a class="btn btn-glass" href="${safeHref(contactLinks.email)}"><span class="btn__label">Написать на email</span></a>
      </div>
    </div>
  </section>
`;

export function renderSite(root: HTMLElement): void {
  const year = new Date().getFullYear();

  root.innerHTML = `
  <a class="skip-link" href="#cases">Перейти к контенту</a>
  <canvas id="webgl-bg" class="webgl-bg" aria-hidden="true"></canvas>

  <div class="scroll-progress" aria-hidden="true">
    <div class="scroll-progress__bar" id="scroll-progress-bar"></div>
  </div>

  ${navbarMarkup}

  <header class="hero-header" id="top">
    <div class="hero-noise" aria-hidden="true"></div>
    <div class="container hero-inner">
      <div class="hero-main">
        <p class="hero-label">${escapeHtml(siteCopy.hero.label)}</p>
        <h1>${siteCopy.hero.titleHtml}</h1>
        <p class="hero-for-whom">${escapeHtml(siteCopy.hero.forWhom)}</p>
        <p class="hero-modes__hint">${escapeHtml(siteCopy.hero.modesHint)}</p>
        <div class="hero-modes" role="group" aria-label="Форматы сотрудничества">
          <div class="hero-mode">
            <span class="hero-mode__label">${escapeHtml(siteCopy.hero.modeTurnkeyLabel)}</span>
            <p class="hero-mode__text">${escapeHtml(siteCopy.hero.leadTurnkey)}</p>
          </div>
          <div class="hero-mode">
            <span class="hero-mode__label hero-mode__label--modular">${escapeHtml(siteCopy.hero.modeModularLabel)}</span>
            <p class="hero-mode__text">${escapeHtml(siteCopy.hero.leadModular)}</p>
          </div>
        </div>
        <div class="hero-actions">
          <a class="btn btn-accent" href="${safeHref(contactLinks.telegram)}" target="_blank" rel="${EXTERNAL_REL}"><span class="btn__label">Обсудить проект</span></a>
          <a class="btn btn-glass" href="#cases"><span class="btn__label">Смотреть кейсы</span></a>
        </div>
        <ul class="hero-metrics">${metricsMarkup}</ul>
        <p class="hero-proof">${escapeHtml(siteCopy.hero.proofLine)}</p>
      </div>
      <aside class="hero-side">
        ${heroPipelineCardMarkup}
      </aside>
    </div>
  </header>

  ${pageJourneyMarkup}

  <main class="container resume-layout">
    <aside class="resume-sidebar">
      <section class="resume-card reveal-card decision-card">
        <h2>${escapeHtml(siteCopy.sidebar.hireTitle)}</h2>
        <p>${escapeHtml(siteCopy.sidebar.hireText)}</p>
        <a class="sidebar-cta" href="${safeHref(contactLinks.telegram)}" target="_blank" rel="${EXTERNAL_REL}"><span class="btn__label">Написать в Telegram</span></a>
      </section>

      <section class="resume-card reveal-card stack-card">
        <h2>${escapeHtml(siteCopy.sidebar.stackTitle)}</h2>
        <ul class="skill-list">${stackMarkup}</ul>
      </section>

      <section class="resume-card reveal-card" id="contact">
        <h2>Контакты</h2>
        <div class="link-col">
          <a href="${safeHref(contactLinks.telegram)}" target="_blank" rel="${EXTERNAL_REL}">Telegram</a>
          <a href="${safeHref(contactLinks.email)}">${escapeHtml("elenasamanchuk@gmail.com")}</a>
          <a href="${safeHref(contactLinks.github)}" target="_blank" rel="${EXTERNAL_REL}">GitHub</a>
        </div>
      </section>
    </aside>

    <section class="resume-main">
      <section class="main-block vt-section section-cases" id="cases" style="view-transition-name: cases">
        ${sectionHeadMarkup("01", siteCopy.cases.kicker, siteCopy.cases.title, siteCopy.cases.lead)}
        <div class="partners-strip reveal-card" aria-label="${escapeHtml(siteCopy.cases.partnersLabel)}">
          <p class="section-kicker partners-strip__label">${escapeHtml(siteCopy.cases.partnersLabel)}</p>
          <p class="partners-strip__line">${partnersLineMarkup}</p>
        </div>
        <div class="timeline">${caseMarkup}</div>
      </section>

      <section class="main-block vt-section" id="${siteCopy.workProcess.id}" style="view-transition-name: capabilities">
        ${sectionHeadMarkup("02", siteCopy.workProcess.kicker, siteCopy.workProcess.title, siteCopy.workProcess.lead)}
        <div class="capability-grid bento-grid">${capabilityMarkup}</div>
        <p class="work-process-footnote">${escapeHtml(siteCopy.workProcess.footnote)}</p>
      </section>

      ${contactHubMarkup}
    </section>
  </main>

  <footer class="site-footer">
    <div class="container site-footer__inner">
      <small>© ${year} Елена Саманчук</small>
      <span class="site-footer__role">${escapeHtml(siteCopy.footer.role)} · ${escapeHtml(siteCopy.footer.note)}</span>
    </div>
  </footer>
`;
}
