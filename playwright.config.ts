import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

const defaultServerCommand = `NEXT_PUBLIC_SITE_URL=${baseURL} npm run dev -- --hostname 127.0.0.1 --port ${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 10_000
  },
  reporter: process.env.CI
    ? [["github"], ["line"], ["html", { outputFolder: "coverage/playwright-report", open: "never" }]]
    : [["list"], ["html", { outputFolder: "coverage/playwright-report", open: "never" }]],
  outputDir: "coverage/test-results/playwright",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: {
    command: process.env.PLAYWRIGHT_SERVER_COMMAND ?? defaultServerCommand,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"]
      }
    }
  ]
});
