#!/usr/bin/env node
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runner = path.join(root, "scripts/capture-sharp-preview.mjs");
const outDir = path.join(root, "public/previews");
const backupDir = path.join(root, ".preview-backup");

const targets = [
  { url: "https://amb.growfood.pro/food-selection-1", name: "growfood", minHeight: 1400, minBytes: 150_000, maxHeight: 3200 },
  { url: "https://priem.menu/?cmz=Kdw5", name: "priem", minHeight: 1400, minBytes: 150_000, maxHeight: 3200 },
  { url: "https://nn99.ru/", name: "nn99", minHeight: 1200, minBytes: 100_000, maxHeight: 3200 },
  { url: "https://yourforma.ru/", name: "fitness", minHeight: 1400, minBytes: 150_000, maxHeight: 3200 },
  { url: "https://nashashop.ru/catalog", name: "nasha", minHeight: 900, minBytes: 120_000, maxHeight: 1400 },
  { url: "https://sistemayasnosti.com/", name: "education", minHeight: 1200, minBytes: 120_000, maxHeight: 2200 },
  { url: "https://elenasamanchuk.github.io/yandex-pet-day/", name: "yandex-pet-day", minHeight: 1200, minBytes: 120_000, maxHeight: 2800 },
  { url: "https://elenasamanchuk.github.io/still-store/", name: "still-store", minHeight: 900, minBytes: 80_000, maxHeight: 2000 },
  { url: "https://elenasamanchuk.github.io/videohost/", name: "videohost", minHeight: 900, minBytes: 100_000, maxHeight: 2000 },
  { url: "https://elenasamanchuk.github.io/learn-atlas/", name: "learn-atlas", minHeight: 600, minBytes: 60_000, maxHeight: 1200 },
  { url: "https://elenasamanchuk.github.io/vital-coach/onboarding/", name: "vital-coach", minHeight: 700, minBytes: 100_000, maxHeight: 1400 },
  { url: "https://elenasamanchuk.github.io/republic-2077/", name: "republic-2077", minHeight: 700, minBytes: 80_000, maxHeight: 1400 },
  { url: "https://elenasamanchuk.github.io/job-radar/", name: "job-radar", minHeight: 700, minBytes: 80_000, maxHeight: 1600 },
];

mkdirSync(backupDir, { recursive: true });

function readMeta(file) {
  const info = execSync(`sips -g pixelHeight -g pixelWidth "${file}"`, { encoding: "utf8" });
  const height = Number(info.match(/pixelHeight:\s*(\d+)/)?.[1] ?? 0);
  const width = Number(info.match(/pixelWidth:\s*(\d+)/)?.[1] ?? 0);
  const bytes = readFileSync(file).length;
  return { height, width, bytes };
}

function meanBrightness(file) {
  try {
    const out = execSync(
      `python3 - <<'PY'\nfrom PIL import Image\nimport sys\nim=Image.open(sys.argv[1]).convert('L')\npixels=list(im.getdata())\nprint(sum(pixels)/len(pixels))\nPY\n"${file}"`,
      { encoding: "utf8" },
    );
    return Number(out.trim());
  } catch {
    return 128;
  }
}

const report = [];

for (const { url, name, minHeight, minBytes, maxHeight } of targets) {
  const out = path.join(outDir, `${name}.png`);
  const backup = path.join(backupDir, `${name}.png`);

  if (existsSync(out)) copyFileSync(out, backup);

  console.log(`\n=== ${name} ===`);
  try {
    execSync(`node "${runner}" "${url}" "${name}" --max-height=${maxHeight}`, {
      stdio: "inherit",
      cwd: root,
    });
    const meta = readMeta(out);
    const brightness = meanBrightness(out);
    const ok =
      meta.width >= 700 &&
      meta.height >= minHeight &&
      meta.bytes >= minBytes &&
      brightness >= 25;
    if (!ok) {
      console.warn(
        `REJECT ${name}: ${meta.width}x${meta.height}, ${meta.bytes}B, brightness=${brightness.toFixed(1)}`,
      );
      if (existsSync(backup)) {
        copyFileSync(backup, out);
        console.warn(`Restored previous ${name}.png`);
      }
      report.push({ name, status: "kept-old", brightness, ...meta });
    } else {
      report.push({ name, status: "updated", brightness, ...meta });
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

writeFileSync(path.join(root, "scripts/last-sharp-capture-report.json"), JSON.stringify(report, null, 2));
console.log("\n--- summary ---");
for (const row of report) console.log(row);
