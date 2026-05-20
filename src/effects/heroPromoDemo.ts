const QUIZ_STEPS = [
  {
    question: "Какая цель страницы?",
    options: [
      { label: "Лид / заявка", value: "lead" },
      { label: "Покупка", value: "buy" },
      { label: "Регистрация", value: "reg" },
    ],
  },
  {
    question: "Что важнее в первом экране?",
    options: [
      { label: "Срочность (таймер)", value: "timer" },
      { label: "Сегментация (квиз)", value: "quiz" },
      { label: "Вовлечение (колесо)", value: "wheel" },
    ],
  },
];

const QUIZ_RESULTS: Record<string, string> = {
  "lead-timer": "Таймер + форма: дедлайн ведёт к заявке — как в промо Приём.",
  "lead-quiz": "Квиз с ветвлением: сегмент лида до контакта с командой.",
  "lead-wheel": "Колесо + лид-магнит: вовлечение и сбор контакта в одном сценарии.",
  "buy-timer": "Ограниченное предложение и CTA «заказать» до конца таймера.",
  "buy-quiz": "Квиз подбирает продукт → персональный оффер в корзину.",
  "buy-wheel": "Приз скидки → переход к оформлению — типично для FoodTech.",
  "reg-timer": "Регистрация до даты события: таймер + форма на одном экране.",
  "reg-quiz": "Квиз квалифицирует аудиторию перед регистрацией.",
  "reg-wheel": "Геймификация регистрации — приз за подписку.",
};

const WHEEL_PRIZES = ["−15%", "Подарок", "Бесплатная доставка", "Бонус", "Скидка 10%", "Сюрприз"];

export function initHeroPromoDemo(reducedMotion: boolean) {
  const root = document.querySelector<HTMLElement>("[data-hero-promo]");
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-promo-tab]"));
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-promo-panel]"));

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.promoTab;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      panels.forEach((panel) => {
        const show = panel.dataset.promoPanel === id;
        panel.classList.toggle("is-active", show);
        panel.hidden = !show;
      });
    });
  });

  const timerNode = root.querySelector<HTMLElement>("[data-promo-timer]");
  let secondsLeft = 14 * 60 + 59;
  let timerId: number | undefined;

  const renderTimer = () => {
    if (!timerNode) return;
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    timerNode.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const tickTimer = () => {
    secondsLeft = secondsLeft > 0 ? secondsLeft - 1 : 14 * 60 + 59;
    renderTimer();
  };

  if (!reducedMotion) {
    renderTimer();
    timerId = window.setInterval(tickTimer, 1000);
  }

  root.querySelector("[data-promo-timer-cta]")?.addEventListener("click", () => {
    secondsLeft = Math.max(0, secondsLeft - 37);
    renderTimer();
  });

  const quizOpts = root.querySelector<HTMLElement>("[data-promo-quiz-opts]");
  const quizQ = root.querySelector<HTMLElement>("[data-promo-quiz-q]");
  const quizStageQ = root.querySelector<HTMLElement>('[data-promo-quiz-stage="questions"]');
  const quizStageR = root.querySelector<HTMLElement>('[data-promo-quiz-stage="result"]');
  const quizResult = root.querySelector<HTMLElement>("[data-promo-quiz-result]");
  let quizStep = 0;
  const quizAnswers: string[] = [];

  const renderQuizStep = () => {
    const step = QUIZ_STEPS[quizStep];
    if (!quizQ || !quizOpts || !step) return;
    quizQ.textContent = step.question;
    quizOpts.innerHTML = step.options
      .map(
        (opt) =>
          `<button type="button" class="promo-quiz__opt" data-quiz-value="${opt.value}">${opt.label}</button>`,
      )
      .join("");

    quizOpts.querySelectorAll<HTMLButtonElement>(".promo-quiz__opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        quizAnswers[quizStep] = btn.dataset.quizValue ?? "";
        quizStep += 1;
        if (quizStep < QUIZ_STEPS.length) {
          renderQuizStep();
          return;
        }
        const key = `${quizAnswers[0]}-${quizAnswers[1]}`;
        if (quizStageQ) quizStageQ.hidden = true;
        if (quizStageR) quizStageR.hidden = false;
        if (quizResult) {
          quizResult.textContent =
            QUIZ_RESULTS[key] ?? "Связка цели и механики — подбираю под кампанию и KPI.";
        }
      });
    });
  };

  renderQuizStep();

  root.querySelector("[data-promo-quiz-reset]")?.addEventListener("click", () => {
    quizStep = 0;
    quizAnswers.length = 0;
    if (quizStageQ) quizStageQ.hidden = false;
    if (quizStageR) quizStageR.hidden = true;
    renderQuizStep();
  });

  const wheel = root.querySelector<HTMLElement>("[data-promo-wheel]");
  const prizeNode = root.querySelector<HTMLElement>("[data-promo-wheel-prize]");
  let wheelRotation = 0;

  if (wheel) {
    const segment = 360 / WHEEL_PRIZES.length;
    wheel.style.background = `conic-gradient(${WHEEL_PRIZES.map((_, i) => {
      const hue = 250 + i * 18;
      return `hsl(${hue} 70% 48%) ${i * segment}deg ${(i + 1) * segment}deg`;
    }).join(", ")})`;
  }

  root.querySelector("[data-promo-wheel-spin]")?.addEventListener("click", () => {
    if (!wheel) return;
    const index = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const extra = reducedMotion ? 0 : 4 * 360;
    wheelRotation += extra + (360 - index * (360 / WHEEL_PRIZES.length) - 30);
    wheel.style.transform = `rotate(${wheelRotation}deg)`;
    if (prizeNode) {
      prizeNode.textContent = reducedMotion
        ? `Приз: ${WHEEL_PRIZES[index]}`
        : `Выпало: ${WHEEL_PRIZES[index]}`;
    }
  });

  return () => {
    if (timerId) window.clearInterval(timerId);
  };
}
