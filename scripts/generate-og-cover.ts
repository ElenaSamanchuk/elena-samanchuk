import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_REPO, SITE_TITLE } from "../src/data/siteMeta";

const root = resolve(import.meta.dirname, "..");
const svgPath = resolve(root, "public/og-cover.svg");
const pngPath = resolve(root, "public/og-cover.png");

const headlineLines = splitHeadline(SITE_TITLE);
const descriptionLines = splitDescription(SITE_DESCRIPTION);

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(SITE_AUTHOR)} — страницы для кампаний">
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
    ${headlineLines.map((line, index) => `<tspan x="64" dy="${index === 0 ? 0 : 58}">${escapeXml(line)}</tspan>`).join("")}
  </text>

  <text x="64" y="340" fill="#b8c0d4" font-family="Segoe UI, system-ui, sans-serif" font-size="24" font-weight="400">
    ${descriptionLines.map((line, index) => `<tspan x="64" dy="${index === 0 ? 0 : 36}">${escapeXml(line)}</tspan>`).join("")}
  </text>

  <rect x="64" y="448" width="520" height="56" rx="28" fill="url(#accent)" opacity="0.95"/>
  <text x="324" y="485" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, system-ui, sans-serif" font-size="19" font-weight="600">Growfood · Приём · Nasha · EdTech</text>
  <text x="64" y="560" fill="#6b7694" font-family="Segoe UI, system-ui, sans-serif" font-size="17">elenasamanchuk.github.io/${SITE_REPO}</text>
</svg>`;

writeFileSync(svgPath, svg, "utf8");

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { loadSystemFonts: true, defaultFontFamily: "Segoe UI" },
});

writeFileSync(pngPath, resvg.render().asPng());
console.info(`[og:cover] ${svgPath}`);
console.info(`[og:cover] ${pngPath}`);

function splitHeadline(title: string): string[] {
  const comma = title.indexOf(",");
  if (comma === -1) return [title];
  return [title.slice(0, comma + 1), title.slice(comma + 1).trim()];
}

function splitDescription(text: string): string[] {
  const dash = text.indexOf(" — ");
  if (dash === -1) return [text];
  return [text.slice(0, dash + 3), text.slice(dash + 3).trim()];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
