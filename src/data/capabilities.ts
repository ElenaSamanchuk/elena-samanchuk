export type CapabilityGroup = {
  label: string;
  items: string;
};

export type Capability = {
  title: string;
  lead: string;
  groups: CapabilityGroup[];
};

export const capabilities: Capability[] = [
  {
    title: "Постановка",
    lead: "Фиксируем цель страницы и рамки — до первого макета.",
    groups: [
      { label: "Стратегия", items: "оффер · KPI · гипотезы · конверсия" },
      { label: "Документы", items: "бриф · ТЗ по блокам" },
      { label: "Управление", items: "координация · бюджет · сроки" },
    ],
  },
  {
    title: "Контент и интерфейс",
    lead: "Структура, копирайт и UI ведут к целевому действию.",
    groups: [
      { label: "Смысл", items: "структура · копирайт · сценарий блоков" },
      { label: "Дизайн", items: "прототип · UI · креатив · адаптив · UX" },
    ],
  },
  {
    title: "Разработка",
    lead: "Макет становится рабочей страницей: Tilda, Zero Block, свой код.",
    groups: [
      { label: "Сборка", items: "Tilda · Zero Block · HTML/CSS/JS" },
      { label: "Платформа", items: "механики · формы · админка · API · боты" },
    ],
  },
  {
    title: "После релиза",
    lead: "Стабильность, метрики и итерации без поломки витрины.",
    groups: [
      { label: "Качество", items: "QA · адаптив · кросс-браузер" },
      { label: "Рост", items: "SEO · аналитика · контент · рефакторинг" },
    ],
  },
];

export const bentoSpans = ["bento-span-7", "bento-span-5", "bento-span-6", "bento-span-6"];

export const stack = [
  "Figma",
  "Cursor",
  "HTML / CSS / JS",
  "Tilda",
  "SEO",
  "QA",
  "GitHub",
  "Яндекс.Метрика",
  "Google Analytics",
  "HTML5-баннеры",
];
