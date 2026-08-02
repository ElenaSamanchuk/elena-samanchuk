import type { DemoShowcaseConfig } from "../demoShowcaseTypes";

export const knowembedShowcase: DemoShowcaseConfig = {
  id: "knowembed",
  title: "KnowEmbed · AI chatbot builder",
  previewImage: "/previews/knowembed.png",
  pills: [
    { kind: "badge", label: "full-stack MVP" },
    { kind: "badge", label: "B2B SaaS" },
    { kind: "niche", label: "AI support" },
    { kind: "tech", label: "Supabase" },
    { kind: "tech", label: "Groq" },
    { kind: "tech", label: "Stripe" },
  ],
  links: [
    { label: "Демо", href: "https://elenasamanchuk.github.io/knowembed/" },
    { label: "Guide", href: "https://elenasamanchuk.github.io/knowembed/guide" },
    { label: "Кейс", href: "https://elenasamanchuk.github.io/knowembed/case.html" },
    { label: "Embed", href: "https://elenasamanchuk.github.io/knowembed/embed-demo.html" },
    { label: "GitHub", href: "https://github.com/ElenaSamanchuk/knowembed" },
  ],
  steps: [
    {
      id: "brief",
      tab: "Задача",
      focus: "Продукт",
      title: "Docs → chatbot → embed",
      visual: "chips",
      chips: [
        "Загрузка FAQ и PDF → AI-чат в приложении",
        "Supabase Auth + Postgres + Edge Functions",
        "RAG: chunks в БД → Groq Llama 3.3",
        "Publish public_id → Shadow DOM widget",
        "Stripe Checkout + webhook → тариф Pro",
        "Demo store с embed-виджетом",
      ],
    },
    {
      id: "upload",
      tab: "Knowledge",
      focus: "Ingest",
      title: "Upload FAQ · PDF · pgvector",
      previewImage: "/previews/knowembed-knowledge.png",
      chips: [
        ".txt / .md / .pdf → chunks",
        "Keyword search или pgvector (OpenAI embeddings)",
        "Re-index demo FAQ для Store Assistant",
      ],
    },
    {
      id: "embed",
      tab: "Widget",
      focus: "Embed",
      title: "Still store + launcher",
      previewImage: "/previews/knowembed-embed.png",
      chips: [
        "embed-demo.html — каталог, фильтры, корзина",
        "Виджет bottom-right, те же ответы что in-app",
        "Analytics: app vs widget questions",
      ],
    },
    { id: "ship", tab: "Релиз", focus: "CI", title: "GitHub Pages + Vercel deploy" },
  ],
  codeTabs: ["widget.js", "ingest-document"],
  codeLines: [
    '// Shadow DOM embed · Supabase public-chat',
    '<script src="/widget.js"',
    '  data-bot-id="demo-store-assistant"',
    '  data-api="https://....supabase.co"',
    '  defer></script>',
  ],
};
