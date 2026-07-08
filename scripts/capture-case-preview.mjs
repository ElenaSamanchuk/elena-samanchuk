#!/usr/bin/env node
/**
 * Full-page preview at 2× sidebar width. Same viewport as original — only sharper files.
 * Usage: node scripts/capture-case-preview.mjs <url> <output-name>
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** 2× original 352px column for Retina */
const PREVIEW_WIDTH = 704;

const [, , url, name] = process.argv;
if (!url || !name) {
  console.error("Usage: node scripts/capture-case-preview.mjs <url> <output-name>");
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/previews");
const raw = `/tmp/${name}-raw.png`;
const out = path.join(outDir, `${name}.png`);
const runner = path.join(root, "scripts/capture-case-preview-run.cjs");

mkdirSync(outDir, { recursive: true });

execSync(`node "${runner}" "${url}" "${raw}"`, { stdio: "inherit", cwd: root });
execSync(`sips --resampleWidth ${PREVIEW_WIDTH} "${raw}" --out "${out}"`);

const MAX_PREVIEW_HEIGHT = 4500;
const height = Number(
  execSync(`sips -g pixelHeight "${out}"`, { encoding: "utf8" })
    .match(/pixelHeight:\s*(\d+)/)?.[1] ?? "0",
);
if (height > MAX_PREVIEW_HEIGHT) {
  execSync(`sips -c ${MAX_PREVIEW_HEIGHT} ${PREVIEW_WIDTH} "${out}" --cropOffset 0 0 --out "${out}"`);
}

rmSync(raw, { force: true });

if (!existsSync(out)) throw new Error("Capture failed");

const info = execSync(`sips -g pixelWidth -g pixelHeight -g format "${out}"`, { encoding: "utf8" });
const size = Number(execSync(`stat -f%z "${out}"`, { encoding: "utf8" }).trim());
console.log(info.trim());
console.log(`Saved ${out} (${size} bytes)`);
