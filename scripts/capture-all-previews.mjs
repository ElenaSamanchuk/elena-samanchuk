#!/usr/bin/env node
/**
 * Batch re-capture with validation — keeps old file if new shot looks broken.
 */
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runner = path.join(root, "scripts/capture-case-preview.mjs");
const outDir = path.join(root, "public/previews");
const backupDir = path.join(root, ".preview-backup");

const targets = [
  { url: "https://amb.growfood.pro/food-selection-1", name: "growfood", minHeight: 1800, minBytes: 120_000 },
  { url: "https://priem.menu/?cmz=Kdw5", name: "priem", minHeight: 1800, minBytes: 120_000 },
  { url: "https://nn99.ru/", name: "nn99", minHeight: 1800, minBytes: 80_000 },
  { url: "https://yourforma.ru/", name: "fitness", minHeight: 1800, minBytes: 120_000 },
  { url: "https://nashashop.ru/catalog", name: "nasha", minHeight: 1800, minBytes: 100_000 },
  { url: "https://sistemayasnosti.com/", name: "education", minHeight: 1800, minBytes: 100_000 },
  { url: "https://elenasamanchuk.github.io/yandex-pet-day/", name: "yandex-pet-day", minHeight: 1500, minBytes: 80_000 },
  { url: "https://elenasamanchuk.github.io/still-store/", name: "still-store", minHeight: 1200, minBytes: 80_000 },
  { url: "https://elenasamanchuk.github.io/videohost/", name: "videohost", minHeight: 1200, minBytes: 120_000 },
  { url: "https://elenasamanchuk.github.io/learn-atlas/", name: "learn-atlas", minHeight: 600, minBytes: 60_000 },
  { url: "https://elenasamanchuk.github.io/vital-coach/onboarding/", name: "vital-coach", minHeight: 400, minBytes: 80_000 },
  { url: "https://elenasamanchuk.github.io/republic-2077/", name: "republic-2077", minHeight: 400, minBytes: 60_000 },
  { url: "https://elenasamanchuk.github.io/job-radar/", name: "job-radar", minHeight: 700, minBytes: 60_000 },
];

mkdirSync(backupDir, { recursive: true });

function readMeta(file) {
  const info = execSync(`sips -g pixelHeight -g pixelWidth "${file}"`, { encoding: "utf8" });
  const height = Number(info.match(/pixelHeight:\s*(\d+)/)?.[1] ?? 0);
  const width = Number(info.match(/pixelWidth:\s*(\d+)/)?.[1] ?? 0);
  const bytes = readFileSync(file).length;
  return { height, width, bytes };
}

const report = [];

for (const { url, name, minHeight, minBytes } of targets) {
  const out = path.join(outDir, `${name}.png`);
  const backup = path.join(backupDir, `${name}.png`);

  if (existsSync(out)) copyFileSync(out, backup);

  console.log(`\n=== ${name} ===`);
  try {
    execSync(`node "${runner}" "${url}" "${name}"`, { stdio: "inherit", cwd: root });
    const meta = readMeta(out);
    const ok = meta.height >= minHeight && meta.bytes >= minBytes;
    if (!ok) {
      console.warn(`REJECT ${name}: ${meta.width}x${meta.height}, ${meta.bytes}B (need h>=${minHeight}, bytes>=${minBytes})`);
      if (existsSync(backup)) {
        copyFileSync(backup, out);
        console.warn(`Restored previous ${name}.png`);
      }
      report.push({ name, status: "kept-old", ...meta });
    } else {
      report.push({ name, status: "updated", ...meta });
    }
  } catch (error) {
    console.error(`FAILED ${name}`, error.message);
    if (existsSync(backup)) {
      copyFileSync(backup, out);
      console.warn(`Restored previous ${name}.png`);
    }
    report.push({ name, status: "failed-kept-old" });
  }
}

writeFileSync(path.join(root, "scripts/last-capture-report.json"), JSON.stringify(report, null, 2));
console.log("\n--- summary ---");
for (const row of report) console.log(row);
