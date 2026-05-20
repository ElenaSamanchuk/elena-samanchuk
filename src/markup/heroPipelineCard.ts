import { mechanicsWidgetMarkup } from "./mechanicsWidget";

export const heroPipelineCardMarkup = `
  <section
    class="code-card hero-pipeline-card reveal-card"
    data-tilt
    id="pipeline"
    style="view-transition-name: pipeline"
    aria-labelledby="pipeline-title"
  >
    <div class="dots" aria-hidden="true"><span></span><span></span><span></span></div>
    <h2 id="pipeline-title" class="hero-pipeline-card__title">Маршрут проекта</h2>
    <p class="hero-pipeline-card__lead">Бриф → дизайн → релиз — как на вкладках, не в презентации.</p>
    <div class="pipeline-demo" data-pipeline>
      <div class="pipeline-demo__tabs" role="tablist" aria-label="Этапы полного цикла">
        <button type="button" class="pipeline-tab is-active" role="tab" aria-selected="true" tabindex="0" data-pipeline-step="0">Бриф</button>
        <button type="button" class="pipeline-tab" role="tab" aria-selected="false" tabindex="-1" data-pipeline-step="1">Дизайн</button>
        <button type="button" class="pipeline-tab" role="tab" aria-selected="false" tabindex="-1" data-pipeline-step="2">Разработка</button>
      </div>
      <div class="pipeline-demo__track" aria-live="polite">
        <article class="pipeline-panel is-active" data-pipeline-panel="0">
          <div class="pipeline-panel__chrome">
            <span></span><span></span><span></span>
            <p>brief.md</p>
          </div>
          <ul class="pipeline-brief-list">
            <li><strong>Цель:</strong> лид / покупка / регистрация</li>
            <li><strong>Аудитория:</strong> сегмент и намерение</li>
            <li><strong>Блоки:</strong> первый экран · оффер · кейсы · CTA · FAQ</li>
            <li><strong>Метрики:</strong> KPI, события, гипотезы</li>
          </ul>
        </article>
        <article class="pipeline-panel" data-pipeline-panel="1">
          <div class="pipeline-panel__chrome pipeline-panel__chrome--figma">
            <span></span><span></span><span></span>
            <p>Figma · передача</p>
          </div>
          <div class="pipeline-wireframe">
            <div class="wf wf-hero"></div>
            <div class="wf wf-offer"></div>
            <div class="wf wf-grid"><i></i><i></i><i></i></div>
            <div class="wf wf-cta"></div>
          </div>
        </article>
        <article class="pipeline-panel pipeline-panel--dev" data-pipeline-panel="2">
          <div class="pipeline-panel__chrome pipeline-panel__chrome--live">
            <span></span><span></span><span></span>
            <p>Tilda + код · механики</p>
          </div>
          <div class="pipeline-dev">
            ${mechanicsWidgetMarkup}
          </div>
        </article>
      </div>
      <div class="pipeline-progress" aria-hidden="true">
        <span class="pipeline-progress__fill"></span>
      </div>
    </div>
  </section>
`;
