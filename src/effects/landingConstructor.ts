const NICHE_LABELS: Record<string, string> = {
  food: "FoodTech",
  ecom: "E-commerce",
  edtech: "EdTech",
  b2b: "B2B",
  expert: "эксперт / личный бренд",
};

const GOAL_LABELS: Record<string, string> = {
  lead: "лид / заявка",
  buy: "покупка",
  reg: "регистрация",
  event: "запись на событие",
};

const CTA_LABELS: Record<string, string> = {
  apply: "Оставить заявку",
  buy: "Купить / заказать",
  book: "Записаться",
  tg: "Написать в Telegram",
};

const BLOCK_WF: Record<string, string> = {
  hero: '<div class="bw bw-hero"></div>',
  proof: '<div class="bw bw-proof"></div>',
  product: '<div class="bw bw-product"></div>',
  faq: '<div class="bw bw-faq"></div>',
  form: '<div class="bw bw-form"></div>',
  promo: '<div class="bw bw-promo"></div>',
};

export function initLandingConstructor() {
  const root = document.querySelector<HTMLElement>("[data-landing-builder]");
  if (!root) return;

  const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-builder-step]"));
  const dots = Array.from(root.querySelectorAll<HTMLElement>("[data-builder-dot]"));
  const backBtn = root.querySelector<HTMLButtonElement>("[data-builder-back]");
  const nextBtn = root.querySelector<HTMLButtonElement>("[data-builder-next]");
  const nav = root.querySelector<HTMLElement>(".tool-wizard__nav");
  const result = root.querySelector<HTMLElement>("[data-builder-result]");
  const wireframe = root.querySelector<HTMLElement>("[data-builder-wireframe]");
  const summary = root.querySelector<HTMLElement>("[data-builder-summary]");

  const state = {
    niche: "",
    goal: "",
    cta: "",
    blocks: new Set(["hero", "proof", "form"]),
  };

  let step = 0;

  const bindChips = (container: HTMLElement | null, key: "niche" | "goal" | "cta") => {
    container?.querySelectorAll<HTMLButtonElement>(".tool-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        container.querySelectorAll(".tool-chip").forEach((c) => c.classList.remove("is-selected"));
        chip.classList.add("is-selected");
        state[key] = chip.dataset.value ?? "";
      });
    });
  };

  bindChips(root.querySelector("[data-builder-niche]"), "niche");
  bindChips(root.querySelector("[data-builder-goal]"), "goal");
  bindChips(root.querySelector("[data-builder-cta]"), "cta");

  root.querySelector("[data-builder-blocks]")?.addEventListener("change", (event) => {
    const input = event.target as HTMLInputElement;
    if (input.type !== "checkbox") return;
    if (input.checked) state.blocks.add(input.value);
    else state.blocks.delete(input.value);
  });

  const showStep = (index: number) => {
    step = index;
    steps.forEach((s, i) => {
      s.hidden = i !== index;
      s.classList.toggle("is-active", i === index);
    });
    dots.forEach((d, i) => d.classList.toggle("is-active", i <= index));
    if (backBtn) backBtn.hidden = index === 0;
    if (nextBtn) {
      nextBtn.querySelector(".btn__label")!.textContent =
        index === steps.length - 1 ? "Показать итог" : "Далее";
    }
  };

  const validateStep = () => {
    if (step === 0) return Boolean(state.niche);
    if (step === 1) return Boolean(state.goal);
    if (step === 2) return state.blocks.size > 0;
    if (step === 3) return Boolean(state.cta);
    return true;
  };

  const renderResult = () => {
    const blocks = ["hero", "proof", "product", "faq", "form", "promo"].filter((b) =>
      state.blocks.has(b),
    );
    if (wireframe) {
      wireframe.innerHTML = blocks.map((b) => BLOCK_WF[b] ?? "").join("");
    }
    const niche = NICHE_LABELS[state.niche] ?? state.niche;
    const goal = GOAL_LABELS[state.goal] ?? state.goal;
    const cta = CTA_LABELS[state.cta] ?? state.cta;
    if (summary) {
      summary.textContent = `Так бы я собрала страницу: ниша ${niche}, цель — ${goal}. Блоки: ${blocks.join(" → ")}. Главный CTA: «${cta}». Дальше — прототип, Tilda/код, QA и цели в Метрике.`;
    }
    steps.forEach((s) => {
      s.hidden = true;
    });
    if (nav) nav.hidden = true;
    if (result) result.hidden = false;
  };

  backBtn?.addEventListener("click", () => {
    if (step > 0) showStep(step - 1);
  });

  nextBtn?.addEventListener("click", () => {
    if (!validateStep()) {
      nextBtn.classList.add("is-shake");
      window.setTimeout(() => nextBtn.classList.remove("is-shake"), 400);
      return;
    }
    if (step < steps.length - 1) {
      showStep(step + 1);
      return;
    }
    renderResult();
  });

  root.querySelector("[data-builder-restart]")?.addEventListener("click", () => {
    state.niche = "";
    state.goal = "";
    state.cta = "";
    state.blocks = new Set(["hero", "proof", "form"]);
    root.querySelectorAll(".tool-chip").forEach((c) => c.classList.remove("is-selected"));
    root.querySelectorAll<HTMLInputElement>("[data-builder-blocks] input").forEach((input) => {
      input.checked = ["hero", "proof", "form"].includes(input.value);
    });
    if (nav) nav.hidden = false;
    if (result) result.hidden = true;
    showStep(0);
  });

  showStep(0);
}
