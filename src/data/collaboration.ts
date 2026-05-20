export type CollaborationPillKind = "niche" | "tech" | "badge";

export type CollaborationStep = {
  label: string;
  hint: string;
};

export type CollaborationFormat = {
  badge: string;
  pillKind: CollaborationPillKind;
  title: string;
  summary: string;
};

export const collaborationIntro = {
  kicker: "Сотрудничество",
  title: "Спринт, ретейнер или роль в команде",
  lead: "Первое сообщение — про задачу и срок. Отвечаю рамкой scope и форматом отчётности. Старт после согласования.",
};

/** Общий путь старта — один раз в блоке «Связаться» */
export const collaborationSteps: CollaborationStep[] = [
  {
    label: "Заявка · созвон · бриф",
    hint: "Первое сообщение или слот на созвон: задача, контекст, ссылки на референсы",
  },
  {
    label: "Дедлайн · критерии · смета",
    hint: "Рамка по срокам и границам scope, критерии приёмки; смета после согласования",
  },
  {
    label: "Приоритеты · спринты · скрам",
    hint: "Старт работ: очередь, спринты с демо, встраивание в ваши ритуалы",
  },
];

export const collaborationFormats: CollaborationFormat[] = [
  {
    badge: "проект",
    pillKind: "niche",
    title: "Спринт",
    summary: "Лендинг, посадочная или блок механик — с ясным финишем и сроком.",
  },
  {
    badge: "пакеты часов",
    pillKind: "tech",
    title: "Ретейнер",
    summary: "Пакет часов: очередь задач, правки, сезонные посадочные без поиска подрядчика каждый раз.",
  },
  {
    badge: "обсуждаемо",
    pillKind: "badge",
    title: "Роль в команде",
    summary: "Штат или контракт: витрина, релизы, встраивание в ваши ритуалы.",
  },
];
