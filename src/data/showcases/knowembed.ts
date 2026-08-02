import type { DemoShowcaseConfig } from "../demoShowcaseTypes";

const previewV = "?v=20260802";

export const knowembedShowcase: DemoShowcaseConfig = {
  id: "knowembed",
  title: "KnowEmbed · AI chatbot builder",
  previewImage: `/previews/knowembed-mobile.png${previewV}`,
  pills: [
    { kind: "badge", label: "full-stack MVP" },
    { kind: "badge", label: "B2B SaaS" },
    { kind: "niche", label: "AI" },
    { kind: "tech", label: "Android APK" },
    { kind: "tech", label: "DB" },
    { kind: "tech", label: "Stripe" },
  ],
  links: [
    { label: "Демо", href: "https://elenasamanchuk.github.io/knowembed/" },
    { label: "Embed", href: "https://elenasamanchuk.github.io/knowembed/embed-demo.html" },
    { label: "APK", href: "https://elenasamanchuk.github.io/knowembed/downloads/knowembed.apk" },
  ],
  steps: [
    {
      id: "brief",
      tab: "Задача",
      focus: "Продукт",
      title: "Docs → chatbot → embed",
      visual: "chips",
      chips: [
        "Загрузка FAQ, PDF и markdown в knowledge base",
        "Chunking + keyword / vector search в Postgres",
        "In-app chat: тест ответов до публикации",
        "Publish → public_id для embed-snippet",
        "Shadow DOM widget — один script tag",
        "Starter free · Pro через Stripe Checkout",
        "Demo store: каталог + AI support launcher",
        "Analytics: in-app vs widget questions",
        "Supabase Auth + RLS + Edge Functions",
        "GitHub Pages + Vercel deploy",
        "Android app · Capacitor · APK download",
        "User guide со скриншотами каждого шага",
        "White-label widget на Pro",
      ],
    },
    {
      id: "landing",
      tab: "Landing",
      focus: "Web",
      title: "Mobile marketing + APK promo",
      previewImage: `/previews/knowembed-mobile.png${previewV}`,
    },
    {
      id: "embed",
      tab: "Store",
      focus: "Widget",
      title: "Still store · widget open",
      previewImage: `/previews/knowembed-embed-mobile.png${previewV}`,
    },
    {
      id: "app",
      tab: "App",
      focus: "Android",
      title: "Native admin · bottom tabs",
      previewImage: `/previews/knowembed-app-mobile.png${previewV}`,
    },
  ],
  codeLines: ['// Shadow DOM embed · one script tag'],
};
