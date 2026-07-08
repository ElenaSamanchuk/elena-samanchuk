const { chromium } = require("playwright");

/** Max page height captured (CSS px) — avoids infinite-list fullPage shots */
const MAX_CAPTURE_HEIGHT = 4500;

const url = process.argv[2];
const raw = process.argv[3];

if (!url || !raw) {
  console.error("Usage: node scripts/capture-case-preview-run.cjs <url> <raw-output.png>");
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    locale: "ru-RU",
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(5000);

  await page.evaluate((maxHeight) => {
    for (const el of [document.documentElement, document.body]) {
      if (!el) continue;
      el.style.setProperty("max-height", `${maxHeight}px`, "important");
      el.style.setProperty("overflow", "hidden", "important");
    }
  }, MAX_CAPTURE_HEIGHT);

  await page.waitForTimeout(800);

  const useViewportOnly = /job-radar|learn-atlas|vital-coach|republic-2077/i.test(url);

  if (useViewportOnly) {
    await page.screenshot({ path: raw, fullPage: false, timeout: 120000 });
  } else {
    await page.screenshot({ path: raw, fullPage: true, timeout: 120000 });
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
