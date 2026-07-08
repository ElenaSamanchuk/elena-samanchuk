const { chromium } = require("playwright");

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
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
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

  if (/job-radar/i.test(url)) {
    await page.screenshot({ path: raw, fullPage: false, timeout: 120000 });
  } else {
    await page.screenshot({ path: raw, fullPage: true, timeout: 120000 });
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
