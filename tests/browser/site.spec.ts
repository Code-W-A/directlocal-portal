import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("home is readable, accessible and responsive", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("requestfailed", request => {
    // axe probes the page with HEAD and intentionally aborts after receiving headers.
    if (request.method() === "HEAD" && request.failure()?.errorText === "net::ERR_ABORTED") return;
    errors.push(`Request failed: ${request.url()} (${request.failure()?.errorText})`);
  });
  page.on("response", response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Serviciul potrivit.");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Sari la conținut" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("link", { name: "Descoperă directorul" }).click();
  await expect(page).toHaveURL(/#despre$/);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("homepage.png"), fullPage: true });
});
test("HTML works without JavaScript and missing pages return 404", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "Descoperă directorul" }).click();
  await expect(page).toHaveURL(/#despre$/);
  const response = await page.goto("http://127.0.0.1:4173/pagina-inexistenta/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pagina nu a fost găsită.");
  await page.getByRole("link", { name: "Înapoi la pagina principală" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:4173/");
  await context.close();
});

test("directory navigation, evidence and local page order", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/servicii/");
  await page.getByRole("link", { name: "Curățare canapele: servicii și furnizori locali" }).click();
  await page.getByRole("link", { name: "Curățare canapele în județul Brașov" }).click();
  await page.getByRole("link", { name: "Curățare canapele în Brașov — furnizor documentat" }).click();
  await expect(page).toHaveURL(/\/servicii\/curatare-canapele\/brasov\/brasov\/$/);
  expect(await page.locator("h1").count()).toBe(1);
  const headings = await page.locator("h2").allTextContents();
  expect(headings.indexOf("Firme care declară serviciul în Brașov")).toBeLessThan(headings.indexOf("Serviciul disponibil în Brașov"));
  await expect(page.getByRole("link", { name: "Raportează o eroare" })).toHaveAttribute("href", /^mailto:webdynamicx@gmail.com\?subject=/);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("local-page.png"), fullPage: true });
  await page.getByRole("link", { name: "Igienizare Tapițerie", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Igienizare Tapițerie");
  await expect(page.locator('a[href="tel:0723316469"]')).toHaveText("0723 316 469");
  await expect(page.locator("time")).toHaveAttribute("datetime", "2026-10-12");
  await expect(page.getByText("Adresa stradală nu este confirmată", { exact: false }).first()).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("static search filters, empty results and reset", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/cauta/");
  await page.getByLabel("Serviciu", { exact: true }).selectOption("curatare-canapele");
  await page.getByLabel("Județ", { exact: true }).selectOption("brasov");
  await page.getByLabel("Oraș", { exact: true }).selectOption("brasov");
  await expect(page.getByRole("status")).toHaveText("1 firmă găsită");
  await page.getByLabel("Nume sau descriere").fill("inexistent");
  await expect(page.getByRole("status")).toHaveText("0 firme găsite");
  await expect(page.getByText("Nu există firme pentru selecția ta.", { exact: false })).toBeVisible();
  await expect(page).toHaveURL(/\/cauta\/$/);
  await page.getByRole("button", { name: "Resetează filtrele" }).click();
  await expect(page.getByRole("status")).toHaveText("1 firmă găsită");
  await expect(page.getByLabel("Oraș", { exact: true })).toHaveValue("");
  await page.getByLabel("Nume sau descriere").fill("tapiterie");
  await expect(page.getByRole("status")).toHaveText("1 firmă găsită");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("search.png"), fullPage: true });
  expect(errors).toEqual([]);
});

test("editorial pages and nested unknown URLs", async ({ page }) => {
  for (const path of ["/despre-noi/", "/contact/", "/metodologie/"]) {
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
  await page.goto("/contact/");
  await expect(page.getByRole("link", { name: "webdynamicx@gmail.com", exact: true })).toHaveAttribute("href", "mailto:webdynamicx@gmail.com");
  await expect(page.locator("form")).toHaveCount(0);
  for (const path of ["/servicii/curatare-canapele/brasov/sacele/", "/firme/inexistenta/"]) expect((await page.goto(path))?.status()).toBe(404);
});
