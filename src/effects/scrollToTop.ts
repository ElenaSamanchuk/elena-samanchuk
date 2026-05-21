import { registerScrollTask } from "../lib/scrollRuntime";

/** Стрелка вверх как в webdev-studio — без круга */
export function initScrollToTop(reducedMotion: boolean) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "scroll-top";
  button.setAttribute("aria-label", "Наверх");
  button.innerHTML = `<svg class="scroll-top__icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M12 19V5M6 11l6-6 6 6"/>
  </svg>`;

  document.body.append(button);

  const update = () => {
    button.classList.toggle("is-visible", window.scrollY > 500);
  };

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  registerScrollTask(update);
  update();
}
