/** Базовый URL для Open Graph (задайте VITE_SITE_URL при деплое). */
export const SITE_ORIGIN =
  import.meta.env.VITE_SITE_URL ?? "https://elenasamanchuk.github.io/tochka-site-marketer-new";

export const SITE_TITLE = "Елена Саманчук — страницы и лендинги под ключ · по этапам";
export const SITE_DESCRIPTION =
  "Маркетинговые страницы и лендинги: полный цикл или отдельный этап. Tilda, свой код, промо-механики, QA. Кейсы Growfood, Приём, Nasha.";

export const OG_IMAGE = `${SITE_ORIGIN}/og-cover.svg`;
