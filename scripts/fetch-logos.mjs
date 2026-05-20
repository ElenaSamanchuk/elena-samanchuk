import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "logos");

/** @type {{ id: string; name: string; domain: string; href: string }[]} */
const brands = [
  { id: "growfood", name: "Growfood", domain: "growfood.pro", href: "https://growfood.pro/" },
  { id: "priem", name: "Приём", domain: "priem.menu", href: "https://priem.menu/" },
  { id: "nasha", name: "Nasha", domain: "nashashop.ru", href: "https://nashashop.ru/" },
  { id: "popovichfit", name: "Popovichfit", domain: "popovichfit.ru", href: "https://popovichfit.ru/" },
  { id: "kochfit", name: "Kochfit", domain: "kochfit.ru", href: "https://kochfit.ru/" },
  { id: "kinezio", name: "Kinezio", domain: "kineziofitness.online", href: "https://kineziofitness.online/" },
  { id: "forma", name: "Forma Fitness", domain: "yourforma.ru", href: "https://yourforma.ru/" },
  { id: "yasnost", name: "Система Ясности", domain: "sistemayasnosti.com", href: "https://sistemayasnosti.com/" },
  { id: "bi13", name: "BI13", domain: "bi13pro.ru", href: "https://bi13pro.ru/" },
  { id: "platformax", name: "Platformax", domain: "platformax.pro", href: "https://platformax.pro/" },
  { id: "mostovoy", name: "Mostovoy", domain: "mostovoyvv.com", href: "https://mostovoyvv.com/" },
  { id: "gf-gift", name: "GF Gift", domain: "gf-gift.ru", href: "https://gf-gift.ru/" },
];

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function fetchBuffer(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
  });
  if (!response.ok) return null;
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("image") && !type.includes("octet-stream")) return null;
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 120) return null;
  return buffer;
}

const MAX_BYTES = 96_000;

function parseLinkTags(html, baseUrl) {
  /** @type {{ href: string; rel: string; sizes: string; score: number }[]} */
  const found = [];
  const re = /<link\b[^>]*>/gi;
  let tag;
  while ((tag = re.exec(html))) {
    const chunk = tag[0];
    const href = chunk.match(/\bhref=["']([^"']+)["']/i)?.[1];
    const rel = chunk.match(/\brel=["']([^"']+)["']/i)?.[1]?.toLowerCase() ?? "";
    const sizes = chunk.match(/\bsizes=["']([^"']+)["']/i)?.[1] ?? "";
    if (!href) continue;

    let score = 0;
    if (rel.includes("apple-touch-icon")) score += 100;
    else if (rel.includes("icon")) score += 40;
    else if (rel.includes("shortcut")) score += 20;
    else continue;

    const px = Number.parseInt(sizes, 10);
    if (px >= 128) score += 30;
    else if (px >= 64) score += 20;
    else if (px >= 32) score += 10;

    try {
      found.push({ href: new URL(href, baseUrl).href, rel, sizes, score });
    } catch {
      /* skip */
    }
  }

  found.sort((a, b) => b.score - a.score);
  return found.map((item) => item.href);
}

async function pickBestIconUrl(domain) {
  const pageUrl = `https://${domain}/`;
  try {
    const page = await fetch(pageUrl, { redirect: "follow", headers: { "User-Agent": UA } });
    if (!page.ok) return null;
    const html = await page.text();
    for (const iconUrl of parseLinkTags(html, page.url)) {
      const buffer = await fetchBuffer(iconUrl);
      if (buffer && buffer.length <= MAX_BYTES) return { url: iconUrl, buffer };
    }
  } catch {
    /* fallback */
  }
  return null;
}

async function downloadLogo(brand) {
  const fromPage = await pickBestIconUrl(brand.domain);
  if (fromPage) {
    const file = join(outDir, `${brand.id}.png`);
    await writeFile(file, fromPage.buffer);
    return { ...brand, file: `/logos/${brand.id}.png`, source: fromPage.url };
  }

  const candidates = [
    `https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${brand.domain}.ico`,
  ];

  for (const url of candidates) {
    try {
      const buffer = await fetchBuffer(url);
      if (buffer && buffer.length <= MAX_BYTES) {
        const ext = url.includes(".ico") ? "ico" : "png";
        const file = join(outDir, `${brand.id}.${ext}`);
        await writeFile(file, buffer);
        return { ...brand, file: `/logos/${brand.id}.${ext}`, source: url };
      }
    } catch {
      /* next */
    }
  }
  return { ...brand, file: null, source: null };
}

await mkdir(outDir, { recursive: true });
const results = [];
for (const brand of brands) {
  const result = await downloadLogo(brand);
  results.push(result);
  console.log(result.file ? `OK  ${brand.id} <- ${result.source}` : `FAIL ${brand.id}`);
}

await writeFile(
  join(outDir, "manifest.json"),
  JSON.stringify(
    results.map(({ id, name, href, file }) => ({ id, name, href, file })),
    null,
    2,
  ),
);
