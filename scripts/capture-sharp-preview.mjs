#!/usr/bin/env node
/**
 * Sharp mobile preview: scroll to load lazy blocks → full-page → 704px PNG.
 * Usage: node scripts/capture-sharp-preview.mjs <url> <name> [--max-height=4000]
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const PREVIEW_WIDTH = 704;
const MOBILE_VIEWPORT = { width: 390, height: 844 };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/previews");

const [, , url, name, ...flags] = process.argv;
if (!url || !name) {
  console.error("Usage: node scripts/capture-sharp-preview.mjs <url> <name> [--max-height=N]");
  process.exit(1);
}

const maxHeightFlag = flags.find((f) => f.startsWith("--max-height="));
const maxHeight = maxHeightFlag ? Number(maxHeightFlag.split("=")[1]) : 4500;

const raw = `/tmp/${name}-sharp-raw.png`;
const resized = `/tmp/${name}-sharp-704.png`;
const out = path.join(outDir, `${name}.png`);

mkdirSync(outDir, { recursive: true });

async function scrollForLazyLoad(page) {
  let lastHeight = 0;
  for (let pass = 0; pass < 3; pass += 1) {
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const viewport = await page.evaluate(() => window.innerHeight);
    const step = Math.max(280, Math.floor(viewport * 0.75));
    for (let y = 0; y <= height; y += step) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(700);
    }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1200);
    const nextHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    if (nextHeight <= lastHeight + 20) break;
    lastHeight = nextHeight;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}

const browser = await chromium.launch({
  args: ["--disable-blink-features=AutomationControlled"],
});
const context = await browser.newContext({
  viewport: MOBILE_VIEWPORT,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  locale: "ru-RU",
});
await context.addInitScript(() => {
  Object.defineProperty(navigator, "webdriver", { get: () => undefined });
});

const page = await context.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(3000);
await scrollForLazyLoad(page);
await page.screenshot({
  path: raw,
  fullPage: true,
  type: "png",
  timeout: 180000,
});
await browser.close();

execSync(`sips --resampleWidth ${PREVIEW_WIDTH} "${raw}" --out "${resized}"`, { stdio: "pipe" });

const meta = execSync(`sips -g pixelWidth -g pixelHeight "${resized}"`, { encoding: "utf8" });
const height = Number(meta.match(/pixelHeight:\s*(\d+)/)?.[1] ?? 0);

if (height > maxHeight) {
  execSync(
    `python3 -c "from PIL import Image; im=Image.open('${resized}'); im.crop((0,0,im.width,${maxHeight})).save('${resized}')"`,
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
