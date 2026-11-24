import { expect, test } from "@playwright/test";

async function skipPreloader(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(7000);
}

test("GLB and single WebGL canvas in configurator", async ({ page, baseURL }) => {
  test.skip(!baseURL, "Set AUREL_BASE_URL or run against dev server");

  await skipPreloader(page);

  const webgl = await page.evaluate(() => {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  });
  expect(webgl).toBe(true);

  await page.locator("#experience").scrollIntoViewIfNeeded();
  await expect(page.locator("#experience canvas").first()).toBeVisible({ timeout: 60_000 });

  const canvasCount = await page.locator("canvas").count();
  expect(canvasCount).toBe(1);

  await expect(page.getByText(/WebGL unavailable|3D scene failed/i)).toHaveCount(0);
});

test("Configurator updates exposed material state", async ({ page, baseURL }) => {
  test.skip(!baseURL, "Set AUREL_BASE_URL or run against dev server");

  await skipPreloader(page);
  await page.goto("/#experience", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  await page.waitForSelector("#experience canvas", { timeout: 60_000 });

  const click = async (name: string) => {
    await page.getByRole("button", { name, exact: true }).click({ force: true });
  };

  await click("Racing Red");
  await page.waitForFunction(() => window.__AUREL_TEST__?.bodyHex === "#8f1f24");

  const snap = await page.evaluate(() => window.__AUREL_TEST__);
  expect(snap?.bodyHex).toBe("#8f1f24");

  await click("Signature");
  await page.waitForFunction(() => window.__AUREL_TEST__?.wheelScale === 1.05);
  expect((await page.evaluate(() => window.__AUREL_TEST__))?.wheelScale).toBe(1.05);

  await click("Sand");
  await page.waitForFunction(() => window.__AUREL_TEST__?.interiorHex === "#b8a992");
  expect((await page.evaluate(() => window.__AUREL_TEST__))?.interiorHex).toBe("#b8a992");

  await click("Night");
  await page.waitForFunction(() => window.__AUREL_TEST__?.envPreset === "night");
  expect((await page.evaluate(() => window.__AUREL_TEST__))?.envPreset).toBe("night");
});

test("Orbit drag on configurator canvas", async ({ page, baseURL }) => {
  test.skip(!baseURL, "Set AUREL_BASE_URL or run against dev server");

  await skipPreloader(page);
  await page.locator("#experience").scrollIntoViewIfNeeded();
  const canvas = page.locator("#experience canvas").first();
  await expect(canvas).toBeVisible({ timeout: 60_000 });

  const box = await canvas.boundingBox();
  expect(box).toBeTruthy();
  if (!box) return;

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 140, box.y + box.height / 2 - 60, { steps: 16 });
  await page.mouse.up();
});