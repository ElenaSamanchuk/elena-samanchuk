/** Базовый URL (без слэша в конце). Задайте VITE_SITE_URL при деплое. */
export const SITE_ORIGIN =
  import.meta.env.VITE_SITE_URL ?? "https://elenasamanchuk.github.io/tochka-site-marketer-new";

export const SITE_PATH = import.meta.env.BASE_URL;

export const SITE_URL = `${SITE_ORIGIN}${SITE_PATH.replace(/\/$/, "")}/`.replace(
  /([^:]\/)\/+/g,
  "$1",
);

export const SITE_TITLE = "Елена Саманчук — лендинги под ключ и по этапам";
export const SITE_DESCRIPTION =
  "Маркетинговые страницы до релиза: под ключ или один этап. Tilda, свой код, промо-механики, QA. Кейсы Growfood, Приём, Nasha.";
export const SITE_KEYWORDS =
  "лендинги, маркетинговые страницы, Tilda, веб-продакшн, промо-механики, FoodTech, UX, конверсия, Елена Саманчук";

export const OG_IMAGE = `${SITE_ORIGIN}${SITE_PATH}og-cover.svg`.replace(/([^:]\/)\/+/g, "$1");
export const THEME_COLOR = "#0a0a0f";

export const seoJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      inLanguage: "ru-RU",
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}#person`,
      name: "Елена Саманчук",
      jobTitle: "Маркетинговые страницы · веб-продакшн",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      image: OG_IMAGE,
      email: "mailto:elenasamanchuk@gmail.com",
      sameAs: ["https://t.me/ElaneDmitrievna", "https://github.com/ElenaSamanchuk"],
      knowsAbout: ["лендинги", "Tilda", "промо-механики", "UX/UI", "конверсия", "SEO", "QA"],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}#service`,
      name: "Лендинги и маркетинговые страницы",
      url: SITE_URL,
      description: "Под ключ или по этапам: бриф, дизайн, Tilda, свой код, релиз и поддержка.",
      areaServed: "RU",
      serviceType: ["лендинги", "промо-страницы", "веб-продакшн"],
      provider: { "@id": `${SITE_URL}#person` },
    },
  ],
} as const;
