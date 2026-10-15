import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("about page has accessible responsive content, safe metadata and real contact links", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
  expect((await page.goto("/despre-noi/"))?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText("Despre DirectLocal.ro");
  await expect(page).toHaveTitle("Despre platformă și cum funcționează directorul | DirectLocal.ro");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /cum documentăm firmele și zonele deservite/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /^index, follow$/);
  await expect(page.locator('link[rel="canonical"], meta[property="og:url"]')).toHaveCount(2);
  await expect(page.getByRole("link", { name: "Propune o firmă", exact: true }).first()).toHaveAttribute("href", "/inscriere-firma/");
  await expect(page.locator("main form")).toHaveCount(0);
  await expect(page.getByText("Sediul firmei și aria deservită sunt informații distincte.", { exact: false })).toBeVisible();
  await expect(page.getByText("Includerea în director nu reprezintă o certificare", { exact: false })).toBeVisible();
  const widths = testInfo.project.name === "mobile" ? [360, 390] : [768, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`about-${width}.png`), fullPage: true });
  }
  await page.getByRole("link", { name: "Citește metodologia și limitele verificării" }).click();
  await expect(page).toHaveURL(/\/metodologie\/$/);
  expect(errors).toEqual([]);
});

test("about page and its directory links work without JavaScript", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  const origin = `http://127.0.0.1:${process.env.DIRECTORY_TEST_PORT ?? "4173"}`;
  try {
    expect((await page.goto(`${origin}/despre-noi/`))?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Cum funcționează", exact: true })).toBeVisible();
    await expect(page.locator("main ol").last().locator("li")).toHaveCount(3);
    await page.getByRole("link", { name: "Caută o firmă în director" }).click();
    await expect(page).toHaveURL(`${origin}/cauta/`);
    await expect(page.getByRole("link", { name: "Alpha Cleaning", exact: true })).toBeVisible();
  } finally { await context.close(); }
});
