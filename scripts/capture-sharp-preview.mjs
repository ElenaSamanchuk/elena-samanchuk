#!/usr/bin/env node
/**
 * Sharp portfolio preview: desktop capture → 704px PNG (pan-friendly, Retina-ready).
 * Usage: node scripts/capture-sharp-preview.mjs <url> <name> [--max-height=3200]
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const PREVIEW_WIDTH = 704;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/previews");

const [, , url, name, ...flags] = process.argv;
if (!url || !name) {
  console.error("Usage: node scripts/capture-sharp-preview.mjs <url> <name> [--max-height=N]");
  process.exit(1);
}

const maxHeightFlag = flags.find((f) => f.startsWith("--max-height="));
const maxHeight = maxHeightFlag ? Number(maxHeightFlag.split("=")[1]) : 3600;
const mobile = flags.includes("--mobile");

const raw = `/tmp/${name}-sharp-raw.png`;
const resized = `/tmp/${name}-sharp-704.png`;
const out = path.join(outDir, `${name}.png`);

mkdirSync(outDir, { recursive: true });

async function scrollForLazyLoad(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.min(12, Math.max(4, Math.ceil(height / 900)));
  for (let i = 0; i <= steps; i += 1) {
    const y = Math.floor((height * i) / steps);
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(350);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

const browser = await chromium.launch({
  args: ["--disable-blink-features=AutomationControlled"],
});
const context = await browser.newContext({
  viewport: mobile ? { width: 430, height: 932 } : { width: 1280, height: 900 },
  deviceScaleFactor: 2,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  locale: "ru-RU",
});
await context.addInitScript(() => {
  Object.defineProperty(navigator, "webdriver", { get: () => undefined });
});

const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 }).catch(async () => {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
});
await page.waitForTimeout(2500);
if (!mobile) await scrollForLazyLoad(page);
await page.screenshot({
  path: raw,
  fullPage: !mobile,
  type: "png",
  timeout: 120000,
});
await browser.close();

execSync(`sips --resampleWidth ${PREVIEW_WIDTH} "${raw}" --out "${resized}"`, { stdio: "pipe" });

const meta = execSync(`sips -g pixelWidth -g pixelHeight "${resized}"`, { encoding: "utf8" });
const height = Number(meta.match(/pixelHeight:\s*(\d+)/)?.[1] ?? 0);
const width = Number(meta.match(/pixelWidth:\s*(\d+)/)?.[1] ?? 0);

if (height > maxHeight) {
  execSync(
    `python3 - <<'PY'\nfrom PIL import Image\nsrc="${resized}"\nim=Image.open(src)\nw,h=im.size\ncrop=im.crop((0,0,w,${maxHeight}))\ncrop.save(src)\nPY`,
    { stdio: "pipe" },
  );
}

execSync(`cp "${resized}" "${out}"`, { stdio: "pipe" });
rmSync(raw, { force: true });
rmSync(resized, { force: true });

if (!existsSync(out)) throw new Error("Capture failed");

const info = execSync(`sips -g pixelWidth -g pixelHeight "${out}"`, { encoding: "utf8" });
const size = execSync(`stat -f%z "${out}"`, { encoding: "utf8" }).trim();
console.log(info.trim());
console.log(`Saved ${out} (${size} bytes)`);
