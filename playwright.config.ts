import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://127.0.0.1:5174", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    {
      name: "beratung",
      testDir: "./tests/e2e",
      testMatch: "**/*.pw.ts",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm exec vite --host 127.0.0.1 --port 5174 --strictPort",
    url: "http://127.0.0.1:5174/login",
    // Run only the frontend. Beratung requests are mocked; Worker handlers
    // are covered separately by the source-backed API tests.
    env: {
      VITEST: "true",
      VITE_MIETENCHECK_API_BASE_URL: "/api-mietencheck",
    },
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
