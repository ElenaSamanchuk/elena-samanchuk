const storageKey = "site-theme";

export function initTheme() {
  const toggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
  const stored = localStorage.getItem(storageKey);
  const theme = stored === "light" || stored === "dark" ? stored : "dark";

  applyTheme(theme);

  toggle?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    if (document.startViewTransition) {
      document.startViewTransition(() => applyTheme(next));
    } else {
      applyTheme(next);
    }
  });
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(storageKey, theme);

  const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (metaTheme) metaTheme.content = theme === "light" ? "#ffffff" : "#181e2e";

  const toggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
  if (toggle) {
    toggle.textContent = theme === "light" ? "Тёмная" : "Светлая";
    toggle.setAttribute("aria-label", theme === "light" ? "Включить тёмную тему" : "Включить светлую тему");
  }
}
