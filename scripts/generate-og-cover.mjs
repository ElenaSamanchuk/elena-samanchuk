import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const svgPath = resolve(root, "public/og-cover.svg");
const pngPath = resolve(root, "public/og-cover.png");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="Елена Саманчук — страницы для кампаний">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0f"/>
      <stop offset="45%" stop-color="#161829"/>
      <stop offset="100%" stop-color="#1a1030"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0"/>
      <stop offset="50%" stop-color="#818cf8" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="48"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <ellipse cx="220" cy="140" rx="260" ry="200" fill="#6366f1" opacity="0.18" filter="url(#soft)"/>
  <ellipse cx="980" cy="90" rx="220" ry="170" fill="#ec4899" opacity="0.14" filter="url(#soft)"/>
  <rect x="0" y="300" width="1200" height="2" fill="url(#glow)"/>

  <rect x="64" y="64" width="76" height="76" rx="22" fill="url(#accent)"/>
  <text x="102" y="114" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, system-ui, sans-serif" font-size="30" font-weight="700">ES</text>

  <text x="160" y="98" fill="#9aa3b8" font-family="Segoe UI, system-ui, sans-serif" font-size="20" font-weight="500" letter-spacing="0.08em">ВЕБ-ПРОДАКШН · КАМПАНИИ</text>

  <text x="64" y="196" fill="#ffffff" font-family="Segoe UI, system-ui, sans-serif" font-size="46" font-weight="700">
    <tspan x="64" dy="0">Страницы для кампаний,</tspan>
    <tspan x="64" dy="58">которые можно запускать завтра</tspan>
  </text>

  <text x="64" y="340" fill="#b8c0d4" font-family="Segoe UI, system-ui, sans-serif" font-size="24" font-weight="400">
    <tspan x="64" dy="0">Полный цикл или промежуточный этап —</tspan>
    <tspan x="64" dy="36">без разрыва между текстом, макетом и кодом</tspan>
  </text>

  <rect x="64" y="448" width="520" height="56" rx="28" fill="url(#accent)" opacity="0.95"/>
  <text x="324" y="485" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, system-ui, sans-serif" font-size="19" font-weight="600">Growfood · Приём · Nasha · EdTech</text>

  <text x="64" y="560" fill="#6b7694" font-family="Segoe UI, system-ui, sans-serif" font-size="17">elenasamanchuk.github.io/elena-samanchuk</text>
</svg>`;

writeFileSync(svgPath, svg, "utf8");

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: {
    loadSystemFonts: true,
    defaultFontFamily: "Segoe UI",
  },
});

writeFileSync(pngPath, resvg.render().asPng());
console.info(`[og:cover] ${svgPath}`);
console.info(`[og:cover] ${pngPath}`);
