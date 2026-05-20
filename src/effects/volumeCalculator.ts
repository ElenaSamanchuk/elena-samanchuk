type Tier = "mvp" | "standard" | "complex";

const TIER_COPY: Record<
  Tier,
  { badge: string; desc: string; items: string[] }
> = {
  mvp: {
    badge: "MVP",
    desc: "Быстрый релиз: один сильный сценарий, минимум интеграций.",
    items: [
      "3–6 блоков, один основной CTA",
      "1 форма или простой квиз",
      "Базовый QA и адаптив",
      "Ориентир: 1–2 недели на цикл",
    ],
  },
  standard: {
    badge: "Стандарт",
    desc: "Полноценный лендинг под кампанию с формами и доверием.",
    items: [
      "6–10 блоков, несколько точек конверсии",
      "1–2 формы, возможен квиз",
      "1 промо-механика при необходимости",
      "QA, SEO-база, цели в аналитике",
      "Ориентир: 2–4 недели",
    ],
  },
  complex: {
    badge: "Сложный релиз",
    desc: "Много блоков, несколько механик и согласований — как в FoodTech-кейсах.",
    items: [
      "10+ блоков или длинная структура",
      "Несколько форм / ветвлений",
      "2+ промо-механики на коде",
      "Кросс-функция: дизайн, dev, QA, аналитика",
      "Ориентир: от 4 недель, итерации после релиза",
    ],
  },
};

function getTier(blocks: number, forms: number, mech: number): Tier {
  const score = blocks + forms * 2 + mech * 3;
  if (score <= 8) return "mvp";
  if (score <= 16) return "standard";
  return "complex";
}

export function initVolumeCalculator() {
  const root = document.querySelector<HTMLElement>("[data-volume-calc]");
  if (!root) return;

  const blocksInput = root.querySelector<HTMLInputElement>("[data-volume-blocks]");
  const formsInput = root.querySelector<HTMLInputElement>("[data-volume-forms]");
  const mechInput = root.querySelector<HTMLInputElement>("[data-volume-mech]");
  const blocksVal = root.querySelector<HTMLElement>("[data-volume-blocks-val]");
  const formsVal = root.querySelector<HTMLElement>("[data-volume-forms-val]");
  const mechVal = root.querySelector<HTMLElement>("[data-volume-mech-val]");
  const badge = root.querySelector<HTMLElement>("[data-volume-badge]");
  const desc = root.querySelector<HTMLElement>("[data-volume-desc]");
  const list = root.querySelector<HTMLElement>("[data-volume-list]");
  const tierBox = root.querySelector<HTMLElement>("[data-volume-tier]");

  const update = () => {
    const blocks = Number(blocksInput?.value ?? 6);
    const forms = Number(formsInput?.value ?? 1);
    const mech = Number(mechInput?.value ?? 1);
    const tier = getTier(blocks, forms, mech);
    const copy = TIER_COPY[tier];

    if (blocksVal) blocksVal.textContent = String(blocks);
    if (formsVal) formsVal.textContent = String(forms);
    if (mechVal) mechVal.textContent = String(mech);
    if (badge) badge.textContent = copy.badge;
    if (desc) desc.textContent = copy.desc;
    if (list) {
      list.innerHTML = copy.items.map((item) => `<li>${item}</li>`).join("");
    }
    tierBox?.classList.remove("is-mvp", "is-standard", "is-complex");
    tierBox?.classList.add(
      tier === "mvp" ? "is-mvp" : tier === "standard" ? "is-standard" : "is-complex",
    );
  };

  [blocksInput, formsInput, mechInput].forEach((input) => {
    input?.addEventListener("input", update);
  });

  update();
}
