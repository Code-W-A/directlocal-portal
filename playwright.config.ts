import { defineConfig } from "@playwright/test";
const port = process.env.DIRECTORY_TEST_PORT ?? "4173";
const baseURL = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: "./tests/browser", fullyParallel: true,
  use: { baseURL, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { browserName: "chromium", viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { browserName: "chromium", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: { command: `PORT=${port} npm start`, url: baseURL, reuseExistingServer: false },
});
