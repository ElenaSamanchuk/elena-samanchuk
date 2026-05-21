export type Capability = {
  title: string;
  /** Роль/фокус для сканирования блока */
  focus: string;
  lead: string;
  tags: string[];
};

export const capabilities: Capability[] = [
  {
    title: "Постановка",
    focus: "Маркетинг",
    lead: "Цель кампании, оффер и KPI — в брифе и ТЗ до макета. Чтобы страница сразу отвечала на «зачем» и «для кого».",
    tags: ["KPI", "бриф", "ТЗ", "сроки"],
  },
  {
    title: "Контент и интерфейс",
    focus: "Копирайт · дизайн",
    lead: "Иерархия блоков и тексты ведут к действию. UI и прототип не перебивают оффер — усиливают его.",
    tags: ["CTA", "UX", "UI", "прототип"],
  },
  {
    title: "Разработка",
    focus: "Разработка",
    lead: "Макет в прод: Tilda, Zero Block или свой код. Формы, механики, API и боты — без разрыва с макетом.",
    tags: ["Tilda", "JS", "формы"],
  },
  {
    title: "Релиз",
    focus: "QA · продвижение",
    lead: "Запуск без сюрпризов в проде: проверки, SEO, аналитика и итерации по метрикам витрины.",
    tags: ["SEO", "QA", "аналитика"],
  },
];

export const stack = [
  "Figma",
  "Tilda · Zero Block",
  "HTML / CSS / JS",
  "Cursor",
  "SEO",
  "QA",
  "GitHub",
  "Метрика · GA4",
  "HTML5-баннеры",
];
