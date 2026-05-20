import "./style.css";
import "./cursor.css";
import "./effects-extra.css";
import { bentoSpans, capabilities, stack } from "./data/capabilities";
import { topCases, type CaseCard } from "./data/cases";
import { getCaseDisplayTags } from "./data/caseDisplayTags";
import { siteCopy } from "./data/siteCopy";
import { escapeHtml } from "./lib/escapeHtml";
import { collaborationRoadmapsMarkup } from "./markup/collaborationRoadmap";
import { initSite } from "./initSite";
import { agencies, brands } from "./data/clients";
import { heroPipelineCardMarkup } from "./markup/heroPipelineCard";

const metrics = siteCopy.metrics;

const caseTagsMarkup = (item: CaseCard) => {
  const tags = getCaseDisplayTags(item.niches, item.tech);
  if (!tags.length) return "";

  return `<div class="case-tags" aria-label="Ниша и стек">
    ${tags.map((tag) => `<span class="case-tag case-tag--${tag.kind}">${tag.label}</span>`).join("")}
  </div>`;
};

const caseLinksMarkup = (item: CaseCard) => `
  <ul class="case-links" aria-label="Живые примеры">
    ${item.links
      .map(
        (link) => `
      <li>
        <a href="${link.href}" target="_blank" rel="noopener noreferrer">
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

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) throw new Error("App root #app not found");

const casePreviewMarkup = (item: CaseCard) => {
  if (!item.previewImage) return "";

  return `<aside class="case-preview is-loading" data-case-preview aria-label="Превью ${escapeHtml(item.title)}">
    <div class="case-preview__viewport">
      <div class="case-preview__skeleton" aria-hidden="true"></div>
      <div class="case-preview__stage" data-preview-stage>
        <div class="case-preview__track" data-preview-track>
          <img
            data-preview-img
            src="${item.previewImage}"
            alt="Скриншот ${escapeHtml(item.title)}"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  </aside>`;
};

const capabilityMarkup = capabilities
  .map(
    (item, index) => `
      <article class="capability-card reveal-card bento-item ${bentoSpans[index] ?? ""}" data-tilt data-spotlight>
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
const marqueeItems = [...stack, ...stack]
  .map((item) => `<span class="stack-marquee__item">${escapeHtml(item)}</span>`)
  .join("");
const metricsMarkup = metrics
  .map(
    (item) => `
      <li class="metric-item" data-metric-end="${item.end}" data-metric-suffix="${item.suffix}">
        <strong>
          <span class="metric-value">0</span>${item.suffix ? `<span class="metric-suffix">${item.suffix}</span>` : ""}
        </strong>
        <span>${escapeHtml(item.label)}</span>
      </li>
    `,
  )
  .join("");
const caseMarkup = topCases
  .map(
    (item) => `
      <article class="resume-card timeline-card reveal-card${item.previewImage ? " has-case-preview" : ""}" data-tilt>
        <div class="timeline-card__main">
          ${caseTagsMarkup(item)}
          <h3>${escapeHtml(item.title)}</h3>
          <p class="case-detail"><strong>Задача:</strong> ${escapeHtml(item.proof)}</p>
          <p class="case-detail"><strong>Вклад:</strong> ${escapeHtml(item.role)}</p>
          <p class="case-detail"><strong>Результат:</strong> ${escapeHtml(item.outcome)}</p>
          ${caseMetricsMarkup(item)}
          ${caseLinksMarkup(item)}
        </div>
        ${casePreviewMarkup(item)}
      </article>
    `,
  )
  .join("");

const year = new Date().getFullYear();

const textMarqueeItems = (items: string[]) =>
  [...items, ...items].map((name) => `<span class="clients-marquee__text">${escapeHtml(name)}</span>`).join("");

const partnerNames = [...new Set([...agencies, ...brands])];

const navbarMarkup = `
  <nav class="navbar" id="site-navbar" aria-label="Главная навигация">
    <a class="logo" href="#top">
      <span>ES</span>
      <strong>Елена Саманчук</strong>
    </a>
    <div class="nav-status" aria-label="Открыта к предложениям">
      <span class="status-pulse" aria-hidden="true"></span>
      Доступна · удалённо
    </div>
    <div class="nav-links">
      ${siteCopy.nav.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
    </div>
  </nav>
`;

const heroStackStripMarkup = `
  <div class="hero-stack-strip container" aria-hidden="true">
    <div class="stack-marquee">
      <div class="stack-marquee__track">${marqueeItems}</div>
    </div>
  </div>
`;

const contactHubMarkup = `
  <section
    class="main-block final-conversion contact-hub collaboration-block reveal-card vt-section"
    id="${siteCopy.contact.sectionId}"
    style="view-transition-name: contact"
    aria-labelledby="contact-formats-title"
  >
    <div class="contact-hub__collab">
      <p class="hero-label">${siteCopy.contact.formatsKicker}</p>
      <h2 id="contact-formats-title" class="contact-hub__collab-title">${siteCopy.contact.formatsTitle}</h2>
      <p class="block-lead">${siteCopy.contact.formatsLead}</p>
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
      <p class="hero-label">${siteCopy.contact.ctaKicker}</p>
      <h3 class="contact-hub__cta-title">${siteCopy.contact.ctaTitle}</h3>
      <p class="contact-hub__cta-lead">${siteCopy.contact.ctaLead}</p>
      <div class="hero-actions">
        <a class="btn btn-accent" href="https://t.me/ElaneDmitrievna" target="_blank" rel="noreferrer"><span class="btn__label">Написать в Telegram</span></a>
        <a class="btn btn-glass" href="mailto:elenasamanchuk@gmail.com"><span class="btn__label">Написать на email</span></a>
      </div>
    </div>
  </section>
`;

app.innerHTML = `
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
        <p class="hero-label">${siteCopy.hero.label}</p>
        <h1>${siteCopy.hero.titleHtml}</h1>
        <p class="hero-for-whom">${siteCopy.hero.forWhom}</p>
        <div class="hero-modes">
          <div class="hero-mode">
            <span class="hero-mode__label">${siteCopy.hero.modeTurnkeyLabel}</span>
            <p class="hero-mode__text">${siteCopy.hero.leadTurnkey}</p>
          </div>
          <div class="hero-mode">
            <span class="hero-mode__label hero-mode__label--modular">${siteCopy.hero.modeModularLabel}</span>
            <p class="hero-mode__text">${siteCopy.hero.leadModular}</p>
          </div>
        </div>
        <div class="hero-actions">
          <a class="btn btn-accent" href="https://t.me/ElaneDmitrievna" target="_blank" rel="noreferrer"><span class="btn__label">Написать в Telegram</span></a>
          <a class="btn btn-glass" href="#cases"><span class="btn__label">Смотреть кейсы</span></a>
          <a class="btn btn-glass" href="#capabilities"><span class="btn__label">Услуги</span></a>
        </div>
        <ul class="hero-metrics">${metricsMarkup}</ul>
      </div>
      <aside class="hero-side">
        ${heroPipelineCardMarkup}
      </aside>
    </div>
  </header>

  ${heroStackStripMarkup}

  <main class="container resume-layout">
    <aside class="resume-sidebar">
      <section class="resume-card reveal-card decision-card">
        <h2>${siteCopy.sidebar.hireTitle}</h2>
        <p>${siteCopy.sidebar.hireText}</p>
        <a class="sidebar-cta" href="https://t.me/ElaneDmitrievna" target="_blank" rel="noreferrer"><span class="btn__label">Написать в Telegram</span></a>
      </section>

      <section class="resume-card reveal-card stack-card">
        <h2>${siteCopy.sidebar.stackTitle}</h2>
        <ul class="skill-list">${stackMarkup}</ul>
      </section>

      <section class="resume-card reveal-card" id="contact">
        <h2>Контакты</h2>
        <div class="link-col">
          <a href="https://t.me/ElaneDmitrievna" target="_blank" rel="noreferrer">Telegram</a>
          <a href="mailto:elenasamanchuk@gmail.com">elenasamanchuk@gmail.com</a>
          <a href="https://github.com/ElenaSamanchuk" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </section>
    </aside>

    <section class="resume-main">
      <section class="main-block vt-section" id="cases" style="view-transition-name: cases">
        <p class="section-kicker">${siteCopy.cases.kicker}</p>
        <h2>${siteCopy.cases.title}</h2>
        <p class="block-lead">${siteCopy.cases.lead}</p>
        <div class="cases-partners reveal-card" aria-label="${siteCopy.cases.partnersLabel}">
          <p class="cases-partners__label">${siteCopy.cases.partnersLabel}</p>
          <div class="clients-marquee clients-marquee--text">
            <div class="clients-marquee__track">${textMarqueeItems(partnerNames)}</div>
          </div>
        </div>
        <div class="timeline">${caseMarkup}</div>
      </section>

      <section class="main-block vt-section" id="${siteCopy.workProcess.id}" style="view-transition-name: capabilities">
        <p class="section-kicker">${siteCopy.workProcess.kicker}</p>
        <h2>${siteCopy.workProcess.title}</h2>
        <p class="block-lead">${siteCopy.workProcess.lead}</p>
        <div class="capability-grid bento-grid">${capabilityMarkup}</div>
        <p class="work-process-footnote">${siteCopy.workProcess.footnote}</p>
      </section>

      ${contactHubMarkup}
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <small>© ${year} Елена Саманчук · маркетинговые страницы и веб-продакшн</small>
    </div>
  </footer>

`;

initSite();
