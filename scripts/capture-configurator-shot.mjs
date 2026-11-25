/**
 * Capture configurator screenshots (lights on + engine start).
 * Usage: node scripts/capture-configurator-shot.mjs [baseUrl]
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const base = process.argv[2] ?? "http://127.0.0.1:5176";
const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, "..", "test-results", "visual-proof");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ["--use-gl=angle", "--enable-webgl"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "domcontentloaded", timeout: 120_000 });
await page.waitForTimeout(8000);
await page.locator("#experience").scrollIntoViewIfNeeded();
await page.waitForSelector("#experience canvas", { timeout: 90_000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(outDir, "01-configurator-idle.png") });

const lights = page.getByRole("button", { name: /LIGHTS OFF/i });
if (await lights.count()) {
  await lights.click();
  await page.waitForTimeout(1800);
}
const frontCam = page.getByRole("button", { name: /^FRONT$/i });
if (await frontCam.count()) await frontCam.click();
await page.waitForTimeout(900);
await page.screenshot({ path: path.join(outDir, "02-lights-on-front.png") });
await page.screenshot({ path: path.join(outDir, "02-lights-on.png") });

const engine = page.getByRole("button", { name: /^Start engine/i });
if (await engine.count()) {
  await engine.click();
  await page.waitForTimeout(2500);
}
await page.screenshot({ path: path.join(outDir, "03-engine-smoke.png") });

const experience = page.getByRole("button", { name: /Start experience/i });
if (await experience.count()) {
  await experience.click();
  await page.waitForTimeout(3200);
}
await page.screenshot({ path: path.join(outDir, "04-experience-roll.png") });

console.log(JSON.stringify({ outDir, files: fs.readdirSync(outDir) }, null, 2));
await browser.close();