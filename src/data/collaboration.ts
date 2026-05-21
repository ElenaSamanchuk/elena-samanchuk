export type CollaborationPillKind = "niche" | "tech" | "badge";

export type CollaborationFormat = {
  id: "sprint" | "retainer" | "role";
  badge: string;
  pillKind: CollaborationPillKind;
  title: string;
  summary: string;
  /** Подсказки для карточки на схеме */
  hints: string[];
};

export type FormatMapQuadrant =
  | {
      kind: "format";
      position: "tl" | "tr" | "bl";
      formatId: CollaborationFormat["id"];
    }
  | {
      kind: "custom";
      position: "br";
      badge: string;
      pillKind: CollaborationPillKind;
      title: string;
      summary: string;
      hints: string[];
    };

export const collaborationFormats: CollaborationFormat[] = [
  {
    id: "sprint",
    badge: "проект",
    pillKind: "niche",
    title: "Спринт",
    summary: "Лендинг, посадочная или блок механик — с ясным финишем и сроком.",
    hints: [
      "Жёсткий дедлайн и один понятный финиш",
      "Лендинг, посадочная, блок механик",
      "Фиксированный спринт",
      "Страница в проде, приёмка по ТЗ",
    ],
  },
  {
    id: "retainer",
    badge: "пакеты часов",
    pillKind: "tech",
    title: "Ретейнер",
    summary: "Пакет часов: очередь задач и правки без поиска подрядчика.",
    hints: [
      "Регулярные задачи без поиска подрядчика",
      "Очередь: правки, сезонные страницы",
      "Пакет часов / месяц",
      "Закрытые задачи из очереди",
    ],
  },
  {
    id: "role",
    badge: "трудоустройство",
    pillKind: "tech",
    title: "Роль в команде",
    summary: "Штат или контракт: витрина, релизы, встраивание в ваши ритуалы.",
    hints: [
      "Нужен веб внутри процессов команды",
      "Витрина, релизы, ваши ритуалы",
      "Контракт или штат",
      "Стабильный контур публикаций",
    ],
  },
];

/** Квадранты: срочность (↓) × длительность (→) */
export const collaborationQuadrants: FormatMapQuadrant[] = [
  { kind: "format", position: "tl", formatId: "retainer" },
  { kind: "format", position: "tr", formatId: "role" },
  { kind: "format", position: "bl", formatId: "sprint" },
  {
    kind: "custom",
    position: "br",
    badge: "обсуждаемо",
    pillKind: "badge",
    title: "Запрос клиента",
    summary: "Индивидуальный формат под задачу — не спринт, не ретейнер и не роль.",
    hints: ["Контекст и ограничения в первом сообщении", "Scope, срок и рамка — вместе", "Формат отчётности по ситуации"],
  },
];

export const formatMapCopy = {
  axisUrgencyLow: "низкая срочность",
  axisUrgencyHigh: "высокая срочность",
  axisDurationShort: "короткий цикл",
  axisDurationLong: "длительно",
} as const;
