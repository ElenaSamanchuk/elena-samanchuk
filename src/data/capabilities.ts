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
    lead: "Фиксирую цель страницы, KPI и границы — пока команда не ушла в макет.",
    groups: [
      { label: "Стратегия", items: "оффер · гипотезы · конверсия · сегмент" },
      { label: "Документы", items: "бриф · ТЗ по блокам · критерии приёмки" },
      { label: "Управление", items: "сроки · бюджет · координация стейкхолдеров" },
    ],
  },
  {
    title: "Контент и интерфейс",
    lead: "Структура и тексты ведут к действию; UI не спорит с оффером.",
    groups: [
      { label: "Смысл", items: "иерархия блоков · копирайт · сценарий CTA" },
      { label: "Дизайн", items: "прототип · UI · адаптив · UX-связки" },
    ],
  },
  {
    title: "Разработка",
    lead: "Макет становится страницей: Tilda, Zero Block или свой код под задачу.",
    groups: [
      { label: "Сборка", items: "Tilda · Zero Block · HTML / CSS / JS" },
      { label: "Платформа", items: "механики · формы · админка · интеграции" },
    ],
  },
  {
    title: "После релиза",
    lead: "Стабильность витрины, метрики и итерации без поломки продакшена.",
    groups: [
      { label: "Качество", items: "QA · кросс-браузер · адаптив · регресс" },
      { label: "Рост", items: "SEO · аналитика · контент · рефакторинг" },
    ],
  },
];

export const bentoSpans = ["bento-span-7", "bento-span-5", "bento-span-6", "bento-span-6"];

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
