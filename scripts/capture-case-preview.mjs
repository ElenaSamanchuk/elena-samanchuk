#!/usr/bin/env node
/**
 * Превью как у Nasha: desktop full-page → ширина 352 → JPEG (без crop, pan с верха).
 * Usage: node scripts/capture-case-preview.mjs <url> <output-name> [--crop]
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PREVIEW_WIDTH = 352;
const PREVIEW_HEIGHT = 1024;

const [, , url, name, cropFlag] = process.argv;
if (!url || !name) {
  console.error("Usage: node scripts/capture-case-preview.mjs <url> <output-name> [--crop]");
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/previews");
const raw = `/tmp/${name}-raw.png`;
const resized = `/tmp/${name}-352.png`;
const out = path.join(outDir, `${name}.png`);
const runner = path.join(root, "scripts/capture-case-preview-run.cjs");

mkdirSync(outDir, { recursive: true });

execSync(`node "${runner}" "${url}" "${raw}"`, { stdio: "inherit", cwd: root });

execSync(`sips --resampleWidth ${PREVIEW_WIDTH} "${raw}" --out "${resized}"`);
if (cropFlag === "--crop") {
  execSync(`sips -c ${PREVIEW_HEIGHT} ${PREVIEW_WIDTH} "${resized}" --cropOffset 0 0 --out "${resized}"`);
}
execSync(`sips -s format jpeg -s formatOptions 78 "${resized}" --out "${out}"`);

rmSync(raw, { force: true });
rmSync(resized, { force: true });

if (!existsSync(out)) throw new Error("Capture failed");

const info = execSync(`sips -g pixelWidth -g pixelHeight "${out}"`, { encoding: "utf8" });
const size = execSync(`stat -f%z "${out}"`, { encoding: "utf8" }).trim();
console.log(info.trim());
console.log(`Saved ${out} (${size} bytes)`);
