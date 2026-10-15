import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { loadCatalog } from "../../src/lib/content/load";
import { getPublicPages } from "../../src/lib/seo/registry";
import { site } from "../../src/config/site";

test("every public route has stable responsive layout, accessible content and safe SEO", async ({ page }, info) => {
  test.setTimeout(900000);
  const catalog = await loadCatalog();
  const routes = getPublicPages(catalog, site);
  const widths = info.project.name === "mobile" ? [360,390] : [768,1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      expect((await page.goto(route.path))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route.path).toBe(true);
      await expect(page.locator("h1")).toHaveCount(1);
      const clipped = await page.locator('main h1, main h2, main h3, main a, main button, main input, main textarea, main select').evaluateAll(elements => elements.filter(el => {
        if (el.closest('[aria-hidden="true"]') || !el.getClientRects().length) return false;
        const box = el.getBoundingClientRect();
        return box.width > 0 && (box.left < -2 || box.right > innerWidth + 2);
      }).map(el => el.textContent?.trim().slice(0, 80) || el.tagName));
      expect(clipped, `Clipped content on ${route.path} at ${width}px`).toEqual([]);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", route.path === "/cauta/" ? /noindex/ : /^index, follow$/);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(route.path === "/cauta/" ? 0 : 1);
      for (const image of await page.locator("main img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveAttribute("alt", /.+/);
        await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      }
      expect((await new AxeBuilder({page}).analyze()).violations, route.path).toEqual([]);
      await page.screenshot({path:info.outputPath(route.path.replaceAll("/", "_") + width + ".png"),fullPage:true});
    }
  }
});

test("compact company identities and contact appear consistently and the county anchor is meaningful", async ({ page }) => {
  for (const path of ["/", "/cauta/", "/servicii/curatare-canapele/brasov/brasov/"]) {
    await page.goto(path);
    const cards = page.locator("[data-company-card]");
    expect(await cards.count()).toBeGreaterThan(0);
    for (const card of await cards.all()) {
      await expect(card.locator("img, figcaption")).toHaveCount(0);
      await expect(card.locator("[data-company-identity]")).toBeVisible();
      await expect(card.getByRole('link', { name: /^Vezi profilul / })).toHaveCount(1);
    }
  }
  await page.goto("/#judete");
  await expect(page.locator("#judete")).toContainText("Curățare canapele");
  await expect(page.locator("#judete")).toContainText("Panouri fotovoltaice");
  await page.goto("/servicii/");
  await expect(page.getByRole("navigation",{name:"Navigare principală"}).getByRole("link",{name:"Servicii"})).toHaveAttribute("aria-current","page");
  expect((await page.goto("/pagina-inexistenta/"))?.status()).toBe(404);
  await expect(page.getByRole("link",{name:"Caută o firmă",exact:true})).toHaveAttribute("href","/cauta/");
});

test("all geographic paths and provider contacts work without JavaScript", async ({browser},info) => {
  const context = await browser.newContext({javaScriptEnabled:false,viewport:info.project.use.viewport});
  const page = await context.newPage();
  const base = 'http://127.0.0.1:' + (process.env.DIRECTORY_TEST_PORT ?? '4173');
  for (const [county,city,company] of [["brasov","brasov","igienizare-tapiterie"],["constanta","constanta","alpha-cleaning"],["timis","timisoara","zoom-cleaning"],["ilfov","","detailing-mobil"]]) {
    await page.goto(base + "/servicii/curatare-canapele/");
    await page.locator('main a[href="/servicii/curatare-canapele/' + county + '/"]').click();
    if(city) await page.locator('main a[href="/servicii/curatare-canapele/' + county + '/' + city + '/"]').click();
    await page.locator('a[data-list-entry][href="/firme/' + company + '/"]').click();
    await expect(page.locator("main img, main figcaption")).toHaveCount(0);
    await expect(page.locator("[data-company-identity]")).toBeVisible();
    await expect(page.getByRole("region",{name:"Contactează firma"}).locator('a[href^="tel:"]').first()).toBeVisible();
  }
  await context.close();
});
