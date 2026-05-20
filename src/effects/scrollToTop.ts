import { registerScrollTask } from "../lib/scrollRuntime";

/** Стрелка вверх как в webdev-studio — без круга */
export function initScrollToTop(reducedMotion: boolean) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "scroll-top";
  button.setAttribute("aria-label", "Наверх");
  button.innerHTML = "&#5123;";

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
