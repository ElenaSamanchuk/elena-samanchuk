#!/usr/bin/env node
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runner = path.join(root, "scripts/capture-case-preview.mjs");

const targets = [
  ["https://amb.growfood.pro/food-selection-1", "growfood"],
  ["https://priem.menu/?cmz=Kdw5", "priem"],
  ["https://nn99.ru/", "nn99"],
  ["https://yourforma.ru/", "fitness"],
  ["https://nashashop.ru/catalog", "nasha"],
  ["https://sistemayasnosti.com/", "education"],
  ["https://elenasamanchuk.github.io/yandex-pet-day/", "yandex-pet-day"],
  ["https://elenasamanchuk.github.io/vital-coach/onboarding/", "vital-coach"],
  ["https://elenasamanchuk.github.io/republic-2077/", "republic-2077"],
  ["https://elenasamanchuk.github.io/job-radar/", "job-radar"],
  ["https://elenasamanchuk.github.io/still-store/", "still-store"],
  ["https://elenasamanchuk.github.io/videohost/", "videohost"],
  ["https://elenasamanchuk.github.io/learn-atlas/", "learn-atlas"],
];

for (const [url, name] of targets) {
  console.log(`\n=== ${name} ===`);
  execSync(`node "${runner}" "${url}" "${name}"`, { stdio: "inherit", cwd: root });
}
