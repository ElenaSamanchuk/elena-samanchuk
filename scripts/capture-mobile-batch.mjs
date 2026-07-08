#!/usr/bin/env node
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runner = path.join(root, "scripts/capture-sharp-preview.mjs");
const outDir = path.join(root, "public/previews");
const backupDir = path.join(root, ".preview-backup");

/** User URLs → portfolio preview filenames */
const targets = [
  { url: "https://elenasamanchuk.github.io/yandex-pet-day/", name: "yandex-pet-day", maxHeight: 5000 },
  { url: "https://gf-gift.ru/#podari", name: "growfood", maxHeight: 5000 },
  { url: "https://priem.menu/?cmz=Kdw5", name: "priem", maxHeight: 5000 },
  { url: "https://elenasamanchuk.github.io/job-radar/", name: "job-radar", maxHeight: 3500 },
  { url: "https://elenasamanchuk.github.io/videohost/", name: "videohost", maxHeight: 4500 },
  { url: "https://elenasamanchuk.github.io/still-store/", name: "still-store", maxHeight: 4000 },
  { url: "https://elenasamanchuk.github.io/learn-atlas/", name: "learn-atlas", maxHeight: 2500 },
  { url: "https://platformax.pro/", name: "nn99", maxHeight: 5000 },
  { url: "https://yourforma.ru/", name: "fitness", maxHeight: 5000 },
  { url: "https://nashashop.ru/catalog", name: "nasha", maxHeight: 4500 },
  { url: "https://sistemayasnosti.com/", name: "education", maxHeight: 5000 },
  { url: "https://elenasamanchuk.github.io/vital-coach/onboarding/", name: "vital-coach", maxHeight: 2500 },
  { url: "https://elenasamanchuk.github.io/republic-2077/", name: "republic-2077", maxHeight: 2500 },
];

mkdirSync(backupDir, { recursive: true });

function readMeta(file) {
  const info = execSync(`sips -g pixelHeight -g pixelWidth "${file}"`, { encoding: "utf8" });
  return {
    height: Number(info.match(/pixelHeight:\s*(\d+)/)?.[1] ?? 0),
    width: Number(info.match(/pixelWidth:\s*(\d+)/)?.[1] ?? 0),
    bytes: readFileSync(file).length,
  };
}

const report = [];

for (const { url, name, maxHeight } of targets) {
  const out = path.join(outDir, `${name}.png`);
  const backup = path.join(backupDir, `${name}.png`);
  if (existsSync(out)) copyFileSync(out, backup);

  console.log(`\n=== ${name} ← ${url} ===`);
  try {
    execSync(`node "${runner}" "${url}" "${name}" --max-height=${maxHeight}`, {
      stdio: "inherit",
      cwd: root,
    });
    const meta = readMeta(out);
    const ok = meta.width >= 700 && meta.height >= 500 && meta.bytes >= 40_000;
    if (!ok) {
      console.warn(`REJECT ${name}: ${meta.width}x${meta.height} ${meta.bytes}B`);
      if (existsSync(backup)) copyFileSync(backup, out);
      report.push({ name, url, status: "kept-old", ...meta });
    } else {
      report.push({ name, url, status: "updated", ...meta });
    }
  } catch (error) {
    console.error(`FAILED ${name}`, error.message);
    if (existsSync(backup)) copyFileSync(backup, out);
    report.push({ name, url, status: "failed-kept-old" });
  }
}

writeFileSync(path.join(root, "scripts/last-mobile-capture-report.json"), JSON.stringify(report, null, 2));
console.log("\n--- summary ---");
for (const row of report) console.log(row);
