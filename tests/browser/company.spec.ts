import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { loadCatalog } from "../../src/lib/content/load";
import { contentPath } from "../../src/lib/seo/urls";

test("company profiles preserve contact, evidence and distinct service areas", async ({ page }) => {
  test.setTimeout(300000);
  const catalog = await loadCatalog();
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const company of catalog.companies.filter(company => company.status === "published")) {
    const path = `/firme/${company.slug}/`;
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(company.name);
    const crumbs = page.getByRole("navigation", { name: "Fir de navigare" });
    await expect(crumbs.getByRole("link", { name: "Firme", exact: true })).toHaveAttribute("href", "/cauta/");
    await expect(crumbs.locator('[aria-current="page"]')).toHaveText(company.name);
    const contact = page.getByRole("region", { name: "Contactează firma" });
    if (company.phone) await expect(contact.getByRole("link", { name: "Sună firma", exact: true })).toHaveAttribute("href", `tel:${company.phone.replace(/[^+\d]/g, "")}`);
    if (company.website) await expect(contact.getByRole("link", { name: "Website-ul firmei" })).toHaveAttribute("href", company.website);
    if (!company.email) await expect(contact.locator('a[href^="mailto:"]')).toHaveCount(0);
    const hq = page.getByRole("region", { name: company.headquarters?.kind === "workplace" ? "Punct de lucru declarat" : "Sediu declarat", exact: true });
    if (company.headquarters) {
      await expect(hq).toContainText(company.headquarters.locality);
      if (!company.headquarters.street) await expect(hq).toContainText("Adresa stradală nu este confirmată în director.");
    } else await expect(hq).toContainText("Localitatea sediului nu este confirmată.");
    const coverage = page.getByRole("region", { name: "Servicii și localități deservite" });
    if (company.slug === "detailing-mobil") {
      await expect(coverage).toContainText("Acoperire județeană declarată");
      await expect(coverage).toContainText("Județul Ilfov");
      await expect(coverage).not.toContainText("București");
      await expect(coverage).not.toContainText("Localități declarate");
      await expect(coverage).toContainText("Confirmă localitatea exactă direct cu firma.");
    }
    const meta = page.getByRole("region", { name: "Data consultării și corecturi" });
    await expect(meta.locator("time")).toHaveAttribute("datetime", company.sources.map(source => source.checkedAt).sort()[0]);
    await expect(page.getByRole("heading", { name: "Surse și verificare" })).toHaveCount(0);
    for (const source of company.sources) await expect(page.locator("main")).not.toContainText(source.note);
    await expect(meta.getByRole("link", { name: "Propune o corectură" })).toHaveAttribute("href", `mailto:webdynamicx@gmail.com?subject=${encodeURIComponent(`Corectură: ${path}`)}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /^index, follow$/);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const related = catalog.pages.find(p => (p.kind === "local" || p.kind === "county") && p.status === "published" && p.companyIds.includes(company.id));
    if (related) {
      await page.getByRole("region", { name: "Pagini asociate" }).getByRole("link", { name: related.title }).click();
      await expect(page).toHaveURL(new RegExp(`${contentPath(related, catalog)}$`));
    }
  }
  expect(errors).toEqual([]);
});

test("company layout, keyboard and screenshots at mobile and desktop widths", async ({ page }, testInfo) => {
  await page.goto("/firme/alpha-cleaning/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Sari la conținut" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const contact = page.getByRole("region", { name: "Contactează firma" });
  await contact.getByRole("link", { name: "0724 304 419", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(contact.getByRole("link", { name: "Sună firma", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(contact.getByRole("link", { name: "Website-ul firmei" })).toBeFocused();
  await page.locator("h1").click();
  const widths = testInfo.project.name === "mobile" ? [360, 390] : [768, 899, 900, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.evaluate(async () => { window.scrollTo(0, 0); await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); });
    const contactBox = (await contact.boundingBox())!;
    const servicesBox = (await page.getByRole("region", { name: "Servicii și localități deservite" }).boundingBox())!;
    const hqBox = (await page.getByRole("region", { name: "Sediu declarat", exact: true }).boundingBox())!;
    if (width < 900) {
      expect(servicesBox.y).toBeGreaterThan(contactBox.y + contactBox.height);
      expect(servicesBox.x).toBe(contactBox.x);
    } else {
      expect(servicesBox.y).toBe(contactBox.y);
      expect(contactBox.x).toBeGreaterThan(servicesBox.x + servicesBox.width);
    }
    expect(hqBox.y).toBeGreaterThan(Math.max(contactBox.y + contactBox.height, servicesBox.y + servicesBox.height));
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`alpha-cleaning-${width}.png`), fullPage: true });
  }
});

test("company profiles work without JavaScript", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  const catalog = await loadCatalog();
  try {
    for (const company of catalog.companies.filter(company => company.status === "published")) {
      await page.goto(`http://127.0.0.1:${process.env.DIRECTORY_TEST_PORT ?? "4173"}/firme/${company.slug}/`);
      await expect(page.locator("h1")).toHaveText(company.name);
      await expect(page.getByRole("region", { name: "Contactează firma" })).toBeVisible();
      await expect(page.getByRole("region", { name: "Data consultării și corecturi" })).toBeVisible();
      await page.getByRole("navigation", { name: "Fir de navigare" }).getByRole("link", { name: "Firme", exact: true }).click();
      await expect(page).toHaveURL(/\/cauta\/$/);
    }
  } finally { await context.close(); }
});
