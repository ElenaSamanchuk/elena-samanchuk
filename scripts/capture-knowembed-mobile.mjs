#!/usr/bin/env node
/**
 * Mobile viewport previews for KnowEmbed portfolio steps (Embed + CI).
 */
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/previews");
const PREVIEW_WIDTH = 704;
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const base = (process.env.CAPTURE_BASE ?? "https://elenasamanchuk.github.io/knowembed/").replace(/\/?$/, "/");

mkdirSync(outDir, { recursive: true });

async function captureViewport(name, url, beforeShot) {
  const raw = `/tmp/${name}-raw.png`;
  const out = path.join(outDir, `${name}.png`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: MOBILE_VIEWPORT,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    locale: "ru-RU",
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(2500);
  if (beforeShot) await beforeShot(page);
  await page.screenshot({ path: raw, fullPage: false, type: "png" });
  await browser.close();

  execSync(`sips --resampleWidth ${PREVIEW_WIDTH} "${raw}" --out "${out}"`, { stdio: "pipe" });
  console.log(`Saved ${out}`);
}

await captureViewport(
  "knowembed-mobile",
  `${base}`,
);

await captureViewport(
  "knowembed-embed-mobile",
  `${base}embed-demo.html`,
  async (page) => {
    await page.evaluate(() => {
      const host = document.querySelector("#knowembed-root");
      const launcher = host?.shadowRoot?.querySelector(".launcher");
      launcher?.click();
    });
    await page.waitForTimeout(1200);
  },
);
