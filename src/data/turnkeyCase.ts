export type TurnkeyStep = {
  id: string;
  num: string;
  tab: string;
  focus: string;
  title: string;
  lead: string;
  tags: string[];
};

export const turnkeyCaseMeta = {
  id: "yandex-pet-day",
  title: "Yandex Pet Day",
  previewImage: "/previews/yandex-pet-day.png",
  links: [
    { label: "Figma", href: "https://www.figma.com/design/3xau5j9A2ixWs7YnfHCvXi/Untitled" },
    { label: "Демо", href: "https://elenasamanchuk.github.io/yandex-pet-day/" },
  ],
} as const;

/** Тезисы и требования — плашки на этапе брифа (структура ТЗ Яндекс Крауд) */
export const briefTheses: string[] = [
  "Тестовое Яндекс Крауд — event-лендинг конференции Yandex Pet Day",
  "Сдать: Figma 1440 + 360, ход мысли, шрифт Yandex Sans Text",
  "Тексты и структура строго по ТЗ — больше можно, меньше нет",
  "Hero: дата, время, формат, H1, описание, CTA «Участвовать»",
  "Вы сможете: 4 равные карточки с текстами из ТЗ",
  "Спикеры: 3 человека — должности и темы докладов",
  "Программа: расписание 10:00–16:30, адрес «Академия»",
  "Присоединяйтесь: форма — имя, почта, офлайн / онлайн",
  "FAQ: 5 вопросов и ответов дословно из PDF",
  "Modal «Остались вопросы»: имя, почта, описание вопроса",
  "Футер: © Yandex Pet Day, 2026 и политика конфиденциальности",
  "Организатор — Яндекс Реклама: текстом, без логотипа Яндекса",
  "Sub-brand PD · «Яндекс» только оранжевым #FC3F1D",
  "FAQ — accordion с иконками +/−, первый пункт открыт",
  "Radio офлайн/онлайн меняет подсказку под формат",
  "Офлайн: «Количество мест ограничено» + «Приду с питомцем»",
  "Онлайн: «Пришлем ссылку на трансляцию», чекбокс скрыт",
  "Submit → toast «Регистрация отправлена», не alert",
  "Gravity UI: event-тон, сетка 8 px, radius 12 / 16",
  "Чередование фона #FFFFFF и #F3F3F3 между секциями",
  "Primary CTA один — в hero; в шапке outline «Участвовать»",
  "Mobile-first 360 px — burger, touch от 44 px",
  "Desktop 1440 — container 1200, gutter 120 px",
  "Onest в макете — ближайший fallback для YS Text",
];

/** Строки кода — набор «верстки» для typewriter */
export const codeMarkupLines: string[] = [
  '<header class="site-header">',
  '  <nav aria-label="Навигация">',
  '  <a href="#hero">Pet Day</a>',
  "  </nav>",
  "</header>",
  '<section class="hero" id="hero">',
  '  <h1>Конференция pet-tech</h1>',
  '  <a class="btn btn-primary">Участвовать</a>',
  "</section>",
  '<section class="program" id="program">',
  '  <aside class="program-sidebar">…</aside>',
  "</section>",
  '<form class="register" data-format="offline">',
  '  <input type="text" name="name" required>',
  '  <button type="submit">Зарегистрироваться</button>',
  "</form>",
];

export const turnkeyCaseSteps: TurnkeyStep[] = [
  {
    id: "brief",
    num: "01",
    tab: "Бриф",
    focus: "Постановка",
    title: "Бриф и анализ ТЗ",
    lead: "Разбор PDF: блоки, тексты дословно, Gravity UI и mobile-first 360 — до первого фрейма.",
    tags: ["KPI", "бриф"],
  },
  {
    id: "figma",
    num: "02",
    tab: "Figma",
    focus: "Дизайн",
    title: "Figma · 1440 + 360",
    lead: "Kit, variants, Play ▶, Dev · States.",
    tags: ["UX", "прототип"],
  },
  {
    id: "code",
    num: "03",
    tab: "Код",
    focus: "Разработка",
    title: "HTML · CSS · JS",
    lead: "FAQ, форма offline/online, modal, toast.",
    tags: ["адаптив", "формы"],
  },
  {
    id: "ship",
    num: "04",
    tab: "Релиз",
    focus: "Релиз",
    title: "Деплой GitHub",
    lead: "GitHub Actions → Pages, QA, handoff.",
    tags: ["Pages", "CI"],
  },
];
