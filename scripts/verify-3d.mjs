/**
 * Headless Chrome verification for AUREL WebGL + configurator (read-only checks).
 * Run: node scripts/verify-3d.mjs [baseUrl]
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:5176";

const report = {
  base,
  webgl: false,
  canvasCount: 0,
  fallbackVisible: false,
  glbRequestOk: false,
  preloaderCleared: false,
  configuratorClicks: [],
  consoleErrors: [],
  orbitPointerTest: "skipped",
};

const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--enable-webgl"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

page.on("console", (msg) => {
  if (msg.type() === "error") report.consoleErrors.push(msg.text());
});

const glbResp = page.waitForResponse(
  (r) => r.url().includes("aurel-type-01.glb") && r.status() === 200,
  { timeout: 120_000 }
).catch(() => null);

await page.goto(base, { waitUntil: "domcontentloaded", timeout: 120_000 });
await page.waitForTimeout(7500);

report.preloaderCleared = !(await page.getByText("BOOTING TYPE-01").isVisible().catch(() => false));

const glb = await glbResp;
report.glbRequestOk = Boolean(glb);

report.webgl = await page.evaluate(() => {
  const c = document.createElement("canvas");
  const gl = c.getContext("webgl2") ?? c.getContext("webgl");
  return Boolean(gl);
});

report.canvasCount = await page.locator("canvas").count();
report.fallbackVisible = await page
  .getByText(/WebGL unavailable|3D scene failed/i)
  .first()
  .isVisible()
  .catch(() => false);

await page.locator("#experience").scrollIntoViewIfNeeded();
await page.waitForSelector("#experience canvas", { timeout: 90_000 }).catch(() => null);
await page.waitForTimeout(1500);

const experienceCanvas = page.locator("#experience canvas").first();
if (await experienceCanvas.count()) {
  const box = await experienceCanvas.boundingBox();
  if (box) {
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 120, cy - 40, { steps: 12 });
    await page.mouse.up();
    report.orbitPointerTest = "pointer-drag-ok";
  }
}

const paints = ["Titanium Silver", "Racing Red", "Pearl White", "Obsidian Black"];
for (const label of paints) {
  const btn = page.getByRole("button", { name: label, exact: true });
  await btn.click();
  report.configuratorClicks.push({
    option: label,
    pressed: (await btn.getAttribute("aria-pressed")) === "true",
  });
}

await page.getByRole("button", { name: "Signature", exact: true }).click();
await page.getByRole("button", { name: "Sand", exact: true }).click();
await page.getByRole("button", { name: "Night", exact: true }).click();

report.materialState = await page.evaluate(() => window.__AUREL_TEST__ ?? null);
report.canvasCount = await page.locator("canvas").count();

report.mobileCanvas = await page.evaluate(() => document.querySelectorAll("canvas").length);

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(800);
report.mobileCanvasCount = await page.locator("canvas").count();
report.mobileFallback = await page
  .getByText(/WebGL unavailable/i)
  .first()
  .isVisible()
  .catch(() => false);

await browser.close();

console.log(JSON.stringify(report, null, 2));
const ok =
  report.webgl &&
  report.glbRequestOk &&
  !report.fallbackVisible &&
  report.canvasCount === 1 &&
  report.materialState?.bodyHex &&
  !report.consoleErrors.some((e) => /Could not load studio_small_03/.test(e));

process.exit(ok ? 0 : 1);