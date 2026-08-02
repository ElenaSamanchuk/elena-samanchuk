#!/usr/bin/env node
/**
 * Mobile admin screenshot for portfolio (native app UX simulation).
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/previews');
const PREVIEW_WIDTH = 704;
const MOBILE_VIEWPORT = { width: 390, height: 844 };

function loadEnv(file) {
  try {
    const text = readFileSync(file, 'utf8');
    for (const line of text.split('\n')) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* optional */
  }
}

loadEnv(path.join(root, '../paralect-chatbot-builder/.env.local'));

const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;
const base = process.env.CAPTURE_BASE ?? 'https://elenasamanchuk.github.io/knowembed';

if (!email || !password) {
  console.error('Need TEST_USER_EMAIL and TEST_USER_PASSWORD in env or .env.local');
  process.exit(1);
}

const raw = '/tmp/knowembed-app-admin-raw.png';
const out = path.join(outDir, 'knowembed-app-mobile.png');

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: MOBILE_VIEWPORT,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

await page.goto(`${base}/login`, { waitUntil: 'networkidle', timeout: 120000 });
await page.getByLabel('Work email').fill(email);
await page.getByLabel('Password').fill(password);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.waitForURL(/\/app/, { timeout: 30000 });
await page.waitForTimeout(2000);

await page.evaluate(() => {
  document.documentElement.classList.add('native-app');
  document.querySelector('.app-layout')?.classList.add('app-layout--native');
});

await page.screenshot({ path: raw, fullPage: false, type: 'png' });
await browser.close();

execSync(`sips --resampleWidth ${PREVIEW_WIDTH} "${raw}" --out "${out}"`, { stdio: 'pipe' });
console.log(`Saved ${out}`);
