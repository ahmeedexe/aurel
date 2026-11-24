import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.AUREL_BASE_URL ?? "http://127.0.0.1:5176";

export default defineConfig({
  testDir: "tests",
  timeout: 120_000,
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    launchOptions: {
      args: ["--use-gl=angle", "--enable-webgl"],
    },
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    {
      name: "chromium-mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "chromium-tablet",
      use: {
        browserName: "chromium",
        viewport: { width: 834, height: 1194 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});