export const heroPromoMarkup = `
  <div class="promo-playground reveal-card" data-hero-promo>
    <p class="promo-playground__label">Потрогайте, как я делаю промо</p>
    <div class="promo-playground__tabs" role="tablist" aria-label="Демо механик">
      <button type="button" class="promo-tab is-active" role="tab" aria-selected="true" data-promo-tab="timer">Таймер</button>
      <button type="button" class="promo-tab" role="tab" aria-selected="false" data-promo-tab="quiz">Квиз</button>
      <button type="button" class="promo-tab" role="tab" aria-selected="false" data-promo-tab="wheel">Колесо</button>
    </div>
    <div class="promo-playground__panel is-active" data-promo-panel="timer">
      <p class="promo-panel__hint">Дедлайн кампании — срочность до CTA</p>
      <div class="promo-timer" data-promo-timer aria-live="polite">14:59</div>
      <button type="button" class="promo-mini-cta" data-promo-timer-cta>Забрать предложение</button>
    </div>
    <div class="promo-playground__panel" data-promo-panel="quiz" hidden>
      <div data-promo-quiz-stage="questions">
        <p class="promo-panel__hint" data-promo-quiz-q>Какая цель страницы?</p>
        <div class="promo-quiz__opts" data-promo-quiz-opts></div>
      </div>
      <div data-promo-quiz-stage="result" hidden>
        <p class="promo-quiz__result" data-promo-quiz-result></p>
        <button type="button" class="promo-mini-cta" data-promo-quiz-reset>Сбросить квиз</button>
      </div>
    </div>
    <div class="promo-playground__panel" data-promo-panel="wheel" hidden>
      <p class="promo-panel__hint">Клик — вращение и приз</p>
      <div class="promo-wheel-wrap">
        <div class="promo-wheel" data-promo-wheel aria-hidden="true"></div>
        <span class="promo-wheel__pointer" aria-hidden="true"></span>
      </div>
      <button type="button" class="promo-mini-cta" data-promo-wheel-spin>Крутить</button>
      <p class="promo-wheel__prize" data-promo-wheel-prize></p>
    </div>
  </div>
`;

export const landingBuilderMarkup = `
  <section class="main-block tool-block reveal-card vt-section" id="landing-builder" style="view-transition-name: builder">
    <p class="hero-label">Конструктор</p>
    <h2>Соберите лендинг под бриф</h2>
    <p class="block-lead">4 шага — ниша, цель, блоки и CTA. В конце увидите, как бы я собрала страницу под ваш запрос.</p>
    <div class="tool-wizard" data-landing-builder>
      <div class="tool-wizard__progress" aria-hidden="true">
        <span class="tool-wizard__dot is-active" data-builder-dot="0"></span>
        <span class="tool-wizard__dot" data-builder-dot="1"></span>
        <span class="tool-wizard__dot" data-builder-dot="2"></span>
        <span class="tool-wizard__dot" data-builder-dot="3"></span>
      </div>
      <div class="tool-wizard__step is-active" data-builder-step="0">
        <h3>1. Ниша</h3>
        <div class="tool-chips" data-builder-niche>
          <button type="button" class="tool-chip" data-value="food">FoodTech</button>
          <button type="button" class="tool-chip" data-value="ecom">E-commerce</button>
          <button type="button" class="tool-chip" data-value="edtech">EdTech</button>
          <button type="button" class="tool-chip" data-value="b2b">B2B</button>
          <button type="button" class="tool-chip" data-value="expert">Эксперт / личный бренд</button>
        </div>
      </div>
      <div class="tool-wizard__step" data-builder-step="1" hidden>
        <h3>2. Цель страницы</h3>
        <div class="tool-chips" data-builder-goal>
          <button type="button" class="tool-chip" data-value="lead">Лид / заявка</button>
          <button type="button" class="tool-chip" data-value="buy">Покупка</button>
          <button type="button" class="tool-chip" data-value="reg">Регистрация</button>
          <button type="button" class="tool-chip" data-value="event">Запись на событие</button>
        </div>
      </div>
      <div class="tool-wizard__step" data-builder-step="2" hidden>
        <h3>3. Блоки на странице</h3>
        <div class="tool-checks" data-builder-blocks>
          <label class="tool-check"><input type="checkbox" value="hero" checked /> Первый экран + оффер</label>
          <label class="tool-check"><input type="checkbox" value="proof" checked /> Кейсы / отзывы</label>
          <label class="tool-check"><input type="checkbox" value="product" /> Продукт / каталог</label>
          <label class="tool-check"><input type="checkbox" value="faq" /> FAQ</label>
          <label class="tool-check"><input type="checkbox" value="form" checked /> Форма / квиз</label>
          <label class="tool-check"><input type="checkbox" value="promo" /> Промо-механика</label>
        </div>
      </div>
      <div class="tool-wizard__step" data-builder-step="3" hidden>
        <h3>4. Главный CTA</h3>
        <div class="tool-chips" data-builder-cta>
          <button type="button" class="tool-chip" data-value="apply">Оставить заявку</button>
          <button type="button" class="tool-chip" data-value="buy">Купить / заказать</button>
          <button type="button" class="tool-chip" data-value="book">Записаться</button>
          <button type="button" class="tool-chip" data-value="tg">Написать в Telegram</button>
        </div>
      </div>
      <div class="tool-wizard__nav">
        <button type="button" class="btn btn-glass" data-builder-back hidden>Назад</button>
        <button type="button" class="btn btn-accent" data-builder-next><span class="btn__label">Далее</span></button>
      </div>
      <div class="builder-result" data-builder-result hidden>
        <p class="hero-label">Итог под ваш бриф</p>
        <div class="builder-wireframe" data-builder-wireframe aria-hidden="true"></div>
        <p class="builder-result__text" data-builder-summary></p>
        <button type="button" class="btn btn-glass" data-builder-restart>Собрать заново</button>
      </div>
    </div>
  </section>
`;

export const volumeCalcMarkup = `
  <section class="main-block tool-block reveal-card" id="volume-calc">
    <p class="hero-label">Оценка объёма</p>
    <h2>Калькулятор релиза</h2>
    <p class="block-lead">Ползунки — без цены, только ориентир по сложности: MVP, стандарт или сложный релиз.</p>
    <div class="volume-calc" data-volume-calc>
      <label class="volume-calc__row">
        <span>Блоков на странице <strong data-volume-blocks-val>6</strong></span>
        <input type="range" min="3" max="14" value="6" data-volume-blocks />
      </label>
      <label class="volume-calc__row">
        <span>Форм / квизов <strong data-volume-forms-val>1</strong></span>
        <input type="range" min="0" max="4" value="1" data-volume-forms />
      </label>
      <label class="volume-calc__row">
        <span>Промо-механик <strong data-volume-mech-val>1</strong></span>
        <input type="range" min="0" max="5" value="1" data-volume-mech />
      </label>
      <div class="volume-calc__tier" data-volume-tier>
        <span class="volume-calc__badge" data-volume-badge>Стандарт</span>
        <p data-volume-desc></p>
        <ul data-volume-list></ul>
      </div>
    </div>
  </section>
`;

export const caseModalShellMarkup = `
  <div class="case-modal" data-case-modal hidden>
    <button type="button" class="case-modal__backdrop" data-case-close aria-label="Закрыть"></button>
    <div class="case-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="case-modal-title">
      <button type="button" class="case-modal__close" data-case-close aria-label="Закрыть">×</button>
      <div class="case-modal__preview" data-case-modal-preview hidden></div>
      <p class="hero-label" data-case-modal-sector></p>
      <h2 id="case-modal-title" data-case-modal-title></h2>
      <p class="case-modal__proof" data-case-modal-proof></p>
      <div class="case-modal__metrics" data-case-modal-metrics></div>
      <p data-case-modal-role></p>
      <p data-case-modal-outcome></p>
      <div class="case-modal__tags" data-case-modal-tags></div>
      <div class="link-row case-modal__links" data-case-modal-links></div>
    </div>
  </div>
`;
