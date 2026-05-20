import { fireConfetti } from "./confetti";
import { playClickSound, playSuccessSound, setSoundEnabled, unlockSound } from "./sound";

type Reply = { text: string; actions?: { label: string; href?: string; action?: string }[] };

const replies: Record<string, Reply> = {
  start: {
    text: "Привет! Помогу быстро дойти до нужного блока: кейсы, демо процесса или контакт.",
    actions: [
      { label: "Кейсы", action: "cases" },
      { label: "Бриф → релиз", action: "pipeline" },
      { label: "Интервью", action: "contact" },
    ],
  },
  cases: {
    text: "Открываю кейсы с живыми механиками: Growfood, Приём, Nasha и другие проекты.",
    actions: [{ label: "Перейти к кейсам", action: "cases" }],
  },
  pipeline: {
    text: "Покажу демо: бриф → дизайн → живая страница.",
    actions: [{ label: "Открыть демо", action: "pipeline" }],
  },
  contact: {
    text: "Лучший следующий шаг — короткий созвон или сообщение в Telegram.",
    actions: [
      { label: "Telegram", href: "https://t.me/ElaneDmitrievna" },
      { label: "Email", href: "mailto:elenasamanchuk@gmail.com" },
    ],
  },
};

export function initChatbot(scrollTo: (selector: string) => void) {
  const root = document.querySelector<HTMLElement>("[data-chatbot]");
  if (!root) return;

  const panel = root.querySelector<HTMLElement>(".chatbot-panel");
  const messages = root.querySelector<HTMLElement>(".chatbot-messages");
  const toggle = root.querySelector<HTMLButtonElement>(".chatbot-toggle");
  const close = root.querySelector<HTMLButtonElement>(".chatbot-close");
  const form = root.querySelector<HTMLFormElement>(".chatbot-form");
  const input = root.querySelector<HTMLInputElement>(".chatbot-input");
  const soundToggle = root.querySelector<HTMLInputElement>("#chatbot-sound");

  const pushMessage = (text: string, outgoing = false) => {
    if (!messages) return;
    const node = document.createElement("p");
    node.className = outgoing ? "chatbot-msg chatbot-msg--out" : "chatbot-msg";
    node.textContent = text;
    messages.append(node);
    messages.scrollTop = messages.scrollHeight;
  };

  const pushReply = (key: keyof typeof replies) => {
    const reply = replies[key];
    if (!reply) return;
    pushMessage(reply.text);

    if (!reply.actions?.length) return;

    const actions = document.createElement("div");
    actions.className = "chatbot-actions";
    reply.actions.forEach((action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chatbot-action";
      button.textContent = action.label;
      button.addEventListener("click", () => {
        unlockSound();
        playClickSound();
        if (action.href) window.open(action.href, "_blank", "noopener,noreferrer");
        if (action.action === "cases") scrollTo("#cases");
        if (action.action === "pipeline") scrollTo("#pipeline");
        if (action.action === "contact") scrollTo("#collaboration");
        if (action.action === "contact") {
          fireConfetti(0.7);
          playSuccessSound();
        }
      });
      actions.append(button);
    });
    if (messages) {
      messages.append(actions);
      messages.scrollTop = messages.scrollHeight;
    }
  };

  const open = () => {
    panel?.classList.add("is-open");
    toggle?.setAttribute("aria-expanded", "true");
    if (messages && messages.childElementCount === 0) pushReply("start");
  };

  const closePanel = () => {
    panel?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  };

  toggle?.addEventListener("click", () => {
    unlockSound();
    playClickSound();
    if (panel?.classList.contains("is-open")) closePanel();
    else open();
  });

  close?.addEventListener("click", closePanel);

  soundToggle?.addEventListener("change", () => {
    setSoundEnabled(Boolean(soundToggle.checked));
    unlockSound();
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input?.value.trim().toLowerCase() ?? "";
    if (!value) return;
    pushMessage(value, true);
    if (input) input.value = "";

    if (value.includes("кейс")) pushReply("cases");
    else if (
      value.includes("бриф") ||
      value.includes("демо") ||
      value.includes("процесс") ||
      value.includes("лендинг")
    )
      pushReply("pipeline");
    else if (
      value.includes("контакт") ||
      value.includes("интерв") ||
      value.includes("telegram") ||
      value.includes("созвон")
    )
      pushReply("contact");
    else pushReply("start");
  });
}
