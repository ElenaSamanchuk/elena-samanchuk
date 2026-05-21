/**
 * SEO и Open Graph — править здесь.
 * index.html подхватывает эти данные через vite.seoPlugin.ts при dev и build.
 * После смены og-текста: npm run og:cover
 */
import { capabilities } from "./capabilities";
import { topCases } from "./cases";
import { contactLinks } from "./contacts";

/** Имя репозитория на GitHub Pages → https://elenasamanchuk.github.io/elena-samanchuk/ */
export const SITE_REPO = "elena-samanchuk";

export const SITE_TITLE = "Страницы для кампаний, которые можно запускать завтра";
export const SITE_DESCRIPTION =
  "Полный цикл или промежуточный этап — без разрыва между текстом, макетом и кодом.";

export const SITE_AUTHOR = "Елена Саманчук";
export const SITE_KEYWORDS =
  "лендинги, промо-страницы, веб-продакшн, Tilda, Zero Block, HTML CSS JS, кампании, UX, QA, Елена Саманчук";

export const OG_TITLE = SITE_TITLE;
export const OG_DESCRIPTION = SITE_DESCRIPTION;
export const OG_IMAGE_ALT = "Елена Саманчук — страницы для кампаний · кейсы · веб-продакшн";
export const THEME_COLOR = "#181e2e";

export const PERSON_JOB_TITLE = "Веб-продакшн · страницы для кампаний";
export const PERSON_DESCRIPTION =
  "Полный цикл или один этап: стратегия, копирайт, Tilda, HTML/CSS/JS, промо-механики, QA и аналитика.";

export type SiteUrlConfig = {
  siteUrl: string;
  basePath: string;
};

function normalizeBasePath(basePath: string): string {
  const withSlash = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return withSlash.endsWith("/") ? withSlash : `${withSlash}/`;
}

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
}

/** URL-контекст: в рантайме — из env Vite, в build-плагине — из loadEnv. */
export function resolveSiteUrls(overrides?: Partial<SiteUrlConfig>): SiteUrlConfig {
  const defaultBase = normalizeBasePath(`/${SITE_REPO}/`);
  const defaultSiteUrl = normalizeSiteUrl(`https://elenasamanchuk.github.io/${SITE_REPO}`);

  const basePath = normalizeBasePath(
    overrides?.basePath ??
      (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL
        ? import.meta.env.BASE_URL
        : defaultBase),
  );

  const siteUrl = normalizeSiteUrl(
    overrides?.siteUrl ??
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL
        ? import.meta.env.VITE_SITE_URL
        : defaultSiteUrl),
  );

  return { siteUrl, basePath };
}

export function buildOgImageUrl(urls: SiteUrlConfig): string {
  return `${urls.siteUrl}og-cover.png`.replace(/([^:]\/)\/+/g, "$1");
}

export function buildSeoJsonLd(urls: SiteUrlConfig): Record<string, unknown> {
  const { siteUrl } = urls;
  const ogImage = buildOgImageUrl(urls);
  const personId = `${siteUrl}#person`;
  const websiteId = `${siteUrl}#website`;
  const profileId = `${siteUrl}#profile`;
  const serviceId = `${siteUrl}#service`;
  const capabilitiesId = `${siteUrl}#capabilities`;
  const casesId = `${siteUrl}#cases`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: "ru-RU",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": profileId,
        url: siteUrl,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: "ru-RU",
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: SITE_AUTHOR,
        jobTitle: PERSON_JOB_TITLE,
        description: PERSON_DESCRIPTION,
        url: siteUrl,
        image: ogImage,
        email: contactLinks.email,
        sameAs: [contactLinks.telegram, contactLinks.github],
        knowsAbout: [
          "лендинги",
          "промо-страницы",
          "Tilda",
          "Zero Block",
          "HTML/CSS/JS",
          "UX/UI",
          "QA",
          "SEO",
          "FoodTech",
          "EdTech",
        ],
      },
      {
        "@type": "ProfessionalService",
        "@id": serviceId,
        name: "Страницы для кампаний и промо",
        url: siteUrl,
        description:
          "Под ключ или по этапам: бриф, структура, дизайн, Tilda, свой код, релиз, QA и поддержка.",
        areaServed: "RU",
        serviceType: ["лендинги", "промо-страницы", "веб-продакшн", "копирайт"],
        provider: { "@id": personId },
      },
      {
        "@type": "ItemList",
        "@id": capabilitiesId,
        name: "Четыре зоны ответственности",
        description: "Постановка, контент и интерфейс, разработка, сопровождение после релиза.",
        itemListElement: capabilities.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          description: item.lead,
        })),
      },
      {
        "@type": "ItemList",
        "@id": casesId,
        name: "Избранные проекты",
        description: "Кейсы с живыми URL: Growfood, Приём, Nasha, фитнес, EdTech.",
        itemListElement: topCases.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CreativeWork",
            "@id": `${siteUrl}#case-${item.id}`,
            name: item.title,
            description: item.proof,
            url: item.links[0]?.href,
            author: { "@id": personId },
          },
        })),
      },
    ],
  };
}

export function renderSeoHeadHtml(urls: SiteUrlConfig): string {
  const ogImage = buildOgImageUrl(urls);
  const jsonLd = JSON.stringify(buildSeoJsonLd(urls), null, 2).replace(/</g, "\\u003c");

  return `
    <title>${escapeHtml(SITE_TITLE)}</title>
    <meta name="description" content="${escapeAttr(SITE_DESCRIPTION)}" />
    <meta name="keywords" content="${escapeAttr(SITE_KEYWORDS)}" />
    <meta name="author" content="${escapeAttr(SITE_AUTHOR)}" />
    <link rel="canonical" href="${escapeAttr(urls.siteUrl)}" />

    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:site_name" content="${escapeAttr(SITE_AUTHOR)}" />
    <meta property="og:title" content="${escapeAttr(OG_TITLE)}" />
    <meta property="og:description" content="${escapeAttr(OG_DESCRIPTION)}" />
    <meta property="og:url" content="${escapeAttr(urls.siteUrl)}" />
    <meta property="og:image" content="${escapeAttr(ogImage)}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeAttr(OG_IMAGE_ALT)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(OG_TITLE)}" />
    <meta name="twitter:description" content="${escapeAttr(OG_DESCRIPTION)}" />
    <meta name="twitter:image" content="${escapeAttr(ogImage)}" />

    <script type="application/ld+json">${jsonLd}</script>
  `.trim();
}

export function renderNoscriptHtml(): string {
  return `
      <p style="max-width: 40rem; margin: 1.5rem auto; padding: 0 1rem; font-family: system-ui, sans-serif">
        ${escapeHtml(SITE_AUTHOR)} — ${escapeHtml(SITE_DESCRIPTION)}
        Кейсы Growfood, Приём, Nasha. Для полной версии включите JavaScript.
      </p>
  `.trim();
}

export function renderRobotsTxt(urls: SiteUrlConfig): string {
  const sitemapUrl = `${urls.siteUrl.replace(/\/$/, "")}/sitemap.xml`;
  return `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;
}

export function renderSitemapXml(
  urls: SiteUrlConfig,
  lastmod = new Date().toISOString().slice(0, 10),
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${urls.siteUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

export function renderWebManifest(urls: SiteUrlConfig): string {
  return JSON.stringify(
    {
      name: `${SITE_AUTHOR} — страницы для кампаний`,
      short_name: "ES · кампании",
      description: SITE_DESCRIPTION,
      start_url: urls.basePath,
      scope: urls.basePath,
      display: "standalone",
      lang: "ru",
      background_color: THEME_COLOR,
      theme_color: THEME_COLOR,
      icons: [
        {
          src: `${urls.basePath}favicon.svg`.replace(/\/{2,}/g, "/"),
          type: "image/svg+xml",
          sizes: "any",
        },
      ],
    },
    null,
    2,
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
