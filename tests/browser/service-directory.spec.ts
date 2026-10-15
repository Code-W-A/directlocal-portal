import { serviceNames } from './helpers/catalog';
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("service directory is accessible, responsive and keeps visible catalog schema and safe metadata", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
  expect((await page.goto("/servicii/"))?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText("Servicii locale");
  await expect(page).toHaveTitle("Catalog de servicii locale | DirectLocal.ro");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /^index, follow$/);
  await expect(page.locator('link[rel="canonical"], meta[property="og:url"]')).toHaveCount(2);
  await expect(page.locator("main h3 a[data-list-entry]")).toHaveText(serviceNames);
  await expect(page.getByRole("region", { name: "Servicii disponibile" }).getByRole("link", { name: "Brașov", exact: true })).toHaveAttribute("href", "/servicii/curatare-canapele/brasov/");
  await expect(page.locator("main img, main figcaption")).toHaveCount(0);
  const widths = testInfo.project.name === "mobile" ? [360, 390] : [768, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}px`).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect((await new AxeBuilder({ page }).withRules(["label-content-name-mismatch"]).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`service-directory-${width}.png`), fullPage: true });
  }
  await page.locator('main a[href="/servicii/curatare-canapele/"]').last().focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/servicii\/curatare-canapele\/$/);
  expect(errors).toEqual([]);
});

test("service directory to county, local page and company works without JavaScript", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport, baseURL: testInfo.project.use.baseURL });
  const page = await context.newPage();
  try {
    expect((await page.goto("/servicii/"))?.status()).toBe(200);
    await page.getByRole("link", { name: "Curățare canapele: servicii și furnizori locali", exact: true }).click();
    await expect(page).toHaveURL(/\/servicii\/curatare-canapele\/$/);
    await page.getByRole("link", { name: "Curățare canapele în județul Brașov", exact: true }).click();
    await page.getByRole("link", { name: "Brașov", exact: true }).click();
    await page.getByRole("link", { name: "Igienizare Tapițerie", exact: true }).click();
    await expect(page.locator("h1")).toHaveText("Igienizare Tapițerie");
    await expect(page.locator('a[href="tel:0723316469"]').first()).toBeVisible();
  } finally { await context.close(); }
});
