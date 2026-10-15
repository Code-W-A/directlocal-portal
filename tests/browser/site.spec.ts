import { companyCount, companyNames } from './helpers/catalog';
import { chooseOption, expectOptionCount } from "./helpers/search-select";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const origin = `http://127.0.0.1:${process.env.DIRECTORY_TEST_PORT ?? "4173"}`;
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
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Găsește firme locale, simplu.");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /^index, follow$/);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Sari la conținut" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: "Județe" }).click();
  await expect(page).toHaveURL(/#judete$/);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect((await new AxeBuilder({ page }).withRules(["label-content-name-mismatch"]).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("homepage.png"), fullPage: true });
});
test("HTML works without JavaScript and missing pages return 404", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  await page.goto(`${origin}/`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: "Județe" }).click();
  await expect(page).toHaveURL(/#judete$/);
  const response = await page.goto(`${origin}/pagina-inexistenta/`);
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pagina nu a fost găsită.");
  await page.getByRole("link", { name: "Caută o firmă", exact: true }).click();
  await expect(page).toHaveURL(`${origin}/cauta/`);
  await context.close();
});

test("directory navigation, evidence and local page order", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/servicii/");
  await page.getByRole("link", { name: "Curățare canapele: servicii și furnizori locali" }).click();
  await page.getByRole("link", { name: "Curățare canapele în județul Brașov" }).click();
  await page.getByRole("link", { name: "Brașov", exact: true }).click();
  await expect(page).toHaveURL(/\/servicii\/curatare-canapele\/brasov\/brasov\/$/);
  expect(await page.locator("h1").count()).toBe(1);
  const headings = await page.locator("h2").allTextContents();
  expect(headings.indexOf("Firme care declară serviciul în Brașov")).toBeLessThan(headings.indexOf("Serviciul disponibil în Brașov"));
  await expect(page.getByRole("heading", { name: "Surse și verificare" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Cum documentăm firmele" })).toHaveAttribute("href", "/metodologie/");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("local-page.png"), fullPage: true });
  await page.getByRole("link", { name: "Igienizare Tapițerie", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Igienizare Tapițerie");
  await expect(page.locator('a[href="tel:0723316469"]').first()).toHaveText("0723 316 469");
  await expect(page.locator("time")).toHaveAttribute("datetime", "2026-10-12");
  await expect(page.getByText("Adresa stradală nu este confirmată", { exact: false }).first()).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("static search filters, empty results and reset", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/cauta/");
  await chooseOption(page.getByRole("button", { name: /^Serviciu / }), "curatare-canapele");
  await chooseOption(page.getByRole("button", { name: /^Județ / }), "brasov");
  await chooseOption(page.getByRole("button", { name: /^Oraș / }), "brasov");
  await expect(page.getByRole("status")).toHaveText("1 firmă găsită");
  await page.getByLabel("Nume sau descriere").fill("inexistent");
  await expect(page.getByRole("status")).toHaveText("0 firme găsite");
  await expect(page.getByText("Nu există firme pentru selecția ta.", { exact: false })).toBeVisible();
  await expect(page).toHaveURL(/\/cauta\/$/);
  await page.getByRole("button", { name: "Resetează filtrele" }).click();
  await expect(page.getByRole("status")).toHaveText(`${companyCount} firme găsite`);
  await expect(page.getByRole("button", { name: /^Oraș / })).toHaveText("Toate orașele");
  await page.getByLabel("Nume sau descriere").fill("igienizare tapiterie");
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
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /^index, follow$/);
  }
  await page.goto("/contact/");
  await expect(page.getByRole("link", { name: "webdynamicx@gmail.com", exact: true }).first()).toHaveAttribute("href", "mailto:webdynamicx@gmail.com");
  await expect(page.locator("form")).toHaveCount(1);
  for (const path of ["/servicii/curatare-canapele/brasov/sacele/", "/firme/inexistenta/"]) expect((await page.goto(path))?.status()).toBe(404);
});


test("new cities and county coverage have working listings and profiles", async ({ page }, testInfo) => {
  for (const [path, name] of [
    ["/servicii/curatare-canapele/timis/timisoara/", "Zoom Cleaning"],
    ["/servicii/curatare-canapele/constanta/constanta/", "Alpha Cleaning"],
    ["/servicii/curatare-canapele/ilfov/", "Detailing Mobil"],
  ]) {
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /^index, follow$/);
    await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole("link", { name, exact: true }).click();
    await expect(page.locator("h1")).toHaveText(name);
  }
  await page.goto("/cauta/");
  await chooseOption(page.getByRole("button", { name: /^Județ / }), "ilfov");
  await expect(page.getByRole("status")).toHaveText("1 firmă găsită");
  await expectOptionCount(page.getByRole("button", { name: /^Oraș / }), 1);
  await expect(page.getByRole("link", { name: "Detailing Mobil", exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("ilfov-search.png"), fullPage: true });
  await chooseOption(page.getByRole("button", { name: /^Județ / }), "timis");
  await chooseOption(page.getByRole("button", { name: /^Oraș / }), "timisoara");
  await expect(page.getByRole("link", { name: "Zoom Cleaning", exact: true })).toBeVisible();
  expect((await page.goto("/servicii/curatare-canapele/ilfov/voluntari/"))?.status()).toBe(404);
});

test('homepage search navigates to service, county and city and resets dependent filters', async ({ page }) => {
  await page.goto('/');
  const service = page.getByRole('button', { name: /^Serviciu / });
  const county = page.getByRole('button', { name: /^Județ / });
  const city = page.getByRole('button', { name: /^Oraș / });
  await expect(county).toBeDisabled();
  await expect(city).toBeDisabled();
  await page.getByRole('button', { name: 'Caută', exact: true }).click();
  await expect(page).toHaveURL(/\/cauta\/$/);
  for (const [c, l, href] of [['', '', '/servicii/curatare-canapele/'], ['timis', '', '/servicii/curatare-canapele/timis/'], ['timis', 'timisoara', '/servicii/curatare-canapele/timis/timisoara/'], ['ilfov', '', '/servicii/curatare-canapele/ilfov/']]) {
    await page.goto('/');
    await chooseOption(service, 'curatare-canapele');
    if (c) await chooseOption(county, c);
    if (l) await chooseOption(city, l);
    if (c === 'ilfov') { await expect(city).toBeDisabled(); await expect(page.getByRole('status')).toContainText('la nivel de județ'); }
    await page.getByRole('button', { name: 'Caută', exact: true }).click();
    await expect(page).toHaveURL(`${origin}${href}`);
  }
  await page.goto('/');
  await chooseOption(service, 'curatare-canapele');
  await chooseOption(county, 'timis');
  await chooseOption(city, 'timisoara');
  await chooseOption(county, 'brasov');
  await expect(city).toHaveText(/^(Oraș|Toate orașele)$/);
  await chooseOption(service, '');
  await expect(county).toHaveText(/^(Județ|Toate județele)$/);
  await expect(city).toBeDisabled();
  await chooseOption(service, 'curatare-canapele');
  await service.focus();
  await page.keyboard.press('Tab');
  await expect(county).toBeFocused();
  await page.getByRole('button', { name: 'Caută', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${origin}/servicii/curatare-canapele/`);
});

test('homepage contact, images and small viewports', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.locator('#firme h3')).toHaveText(companyNames.slice(0,6));
  await expect(page.getByRole('link', { name: 'Înscrie firma', exact: true }).first()).toHaveAttribute('href', '/inscriere-firma/');
  await expect(page.locator('#firme a[href^="tel:"]')).toHaveCount(6);
  await expect(page.locator('main img')).toHaveCount(0);
  await expect(page.locator('svg[data-romania-map]')).toHaveCount(1);
  const widths = testInfo.project.name === 'mobile' ? [360, 390] : [768, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`homepage-${width}.png`), fullPage: true });
  }
});

test('search cards, dependent filters, keyboard and responsive layout', async ({ page }, testInfo) => {
  await page.goto('/cauta/');
  const service = page.getByRole('button', { name: /^Serviciu / });
  const county = page.getByRole('button', { name: /^Județ / });
  const city = page.getByRole('button', { name: /^Oraș / });
  await expect(page.locator('#results-title')).toHaveText('Firme din director');
  await expect(page.locator('main h3')).toHaveText(companyNames);
  await chooseOption(service, 'curatare-canapele');
  await chooseOption(county, 'timis');
  await chooseOption(city, 'timisoara');
  await chooseOption(county, 'brasov');
  await expect(city).toHaveText(/^(Oraș|Toate orașele)$/);
  await chooseOption(city, 'brasov');
  await chooseOption(service, '');
  await expect(county).toHaveText(/^(Județ|Toate județele)$/);
  await expect(city).toHaveText(/^(Oraș|Toate orașele)$/);
  await service.focus();
  await page.keyboard.press('Tab');
  await expect(county).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(city).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Nume sau descriere')).toBeFocused();
  for (const query of ['igienizare tapiterie', 'Igienizare Tapițerie']) {
    await page.getByLabel('Nume sau descriere').fill(query);
    await expect(page.getByRole('status')).toHaveText('1 firmă găsită');
  }
  await page.getByRole('button', { name: 'Resetează filtrele' }).click();
  await chooseOption(county, 'ilfov');
  await expect(page.getByText('Județul Ilfov', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Vezi profilul Detailing Mobil' })).toHaveAttribute('href', '/firme/detailing-mobil/');
  await expectOptionCount(city, 1);
  await page.getByRole('button', { name: 'Resetează filtrele' }).click();
  const widths = testInfo.project.name === 'mobile' ? [360, 390] : [768, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const cards = page.locator('main li').filter({ has: page.getByRole('link', { name: /^Vezi profilul / }) });
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    if (width <= 760) expect(second!.y).toBeGreaterThan(first!.y);
    else expect(second!.y).toBe(first!.y);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`search-cards-${width}.png`), fullPage: true });
  }
  await page.getByLabel('Nume sau descriere').fill('inexistent');
  await page.getByRole('button', { name: 'Vezi toate firmele', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText(`${companyCount} firme găsite`);
  await expect(page.getByLabel('Nume sau descriere')).toHaveValue('');
  await page.getByRole('link', { name: 'Vezi profilul Alpha Cleaning' }).click();
  await expect(page.locator('h1')).toHaveText('Alpha Cleaning');
});

test('search lists real profiles without JavaScript', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  await page.goto(`${origin}/cauta/`);
  await expect(page.getByRole('status')).toHaveText(`${companyCount} firme găsite`);
  await expect(page.locator('main noscript p')).toBeVisible();
  await expect(page.locator('main noscript p')).toContainText('Filtrele necesită JavaScript.');
  await expect(page.getByRole('link', { name: /^Vezi profilul / })).toHaveCount(companyCount);
  await page.getByRole('link', { name: 'Vezi profilul Zoom Cleaning' }).click();
  await expect(page.locator('h1')).toHaveText('Zoom Cleaning');
  await context.close();
});
