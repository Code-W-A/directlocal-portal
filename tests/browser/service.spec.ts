import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const servicePath = "/servicii/curatare-canapele/";

test("service layout is accessible, responsive and links to documented counties", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
  expect((await page.goto(servicePath))?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("Curățare canapele: servicii și furnizori locali");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /^index, follow$/);
  const image = page.getByRole("img", { name: /Canapea albastră/ });
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator("figcaption")).toHaveText("Fotografie ilustrativă");
  const counties = page.getByRole("region", { name: "Județe documentate" });
  await expect(counties.locator("h3")).toHaveText(["Brașov", "Constanța", "Ilfov", "Timiș"]);
  expect(await counties.evaluate(section => Boolean(section.compareDocumentPosition(document.querySelector(".prose")!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await page.getByRole("link", { name: "Alege județul" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#judete-documentate$/);
  await page.getByRole("link", { name: "Curățare canapele în județul Brașov", exact: true }).focus();
  await expect(page.getByRole("link", { name: "Curățare canapele în județul Brașov", exact: true })).toBeFocused();
  await expect(page.getByRole("link", { name: "Raportează o eroare" })).toHaveAttribute("href", /^mailto:.*subject=Corectur/);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect((await new AxeBuilder({ page }).withRules(["label-content-name-mismatch"]).analyze()).violations).toEqual([]);
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `overflow at ${width}px`).toBe(true);
  }
  await page.setViewportSize(testInfo.project.use.viewport!);
  await page.goto(servicePath);
  await page.screenshot({ path: testInfo.outputPath("service-page.png"), fullPage: true });
  expect(errors).toEqual([]);
});

test("service to company navigation works without JavaScript", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: testInfo.project.use.viewport, baseURL: testInfo.project.use.baseURL });
  const page = await context.newPage();
  await page.goto(servicePath);
  await page.getByRole("link", { name: "Alege județul" }).click();
  await expect(page).toHaveURL(/#judete-documentate$/);
  await page.getByRole("link", { name: "Curățare canapele în județul Brașov", exact: true }).click();
  await page.getByRole("link", { name: "Brașov", exact: true }).click();
  await page.getByRole("link", { name: "Igienizare Tapițerie", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Igienizare Tapițerie");
  await expect(page.locator('a[href="tel:0723316469"]').first()).toBeVisible();
  await context.close();
});
