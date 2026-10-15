import { companyCount } from './helpers/catalog';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const path of ['/', '/cauta/']) {
  test(`decorative Romania map and compact firm cards on ${path}`, async ({ page }, info) => {
    const widths = info.project.name === 'mobile' ? [360, 390] : [768, 1440];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(path);
      const map = page.locator('svg[data-romania-map]');
      await expect(map).toHaveCount(1);
      await expect(map).toHaveAttribute('aria-hidden', 'true');
      await expect(map).toHaveAttribute('focusable', 'false');
      await expect(map.locator('a, button, [tabindex]')).toHaveCount(0);
      await expect(map.locator('path[data-county]')).toHaveCount(42);
      await expect(map.locator('path[data-county="B"], path[data-county="IF"]')).toHaveCount(2);
      await expect(map.locator('text')).toHaveCount(42);
      const bounds = await map.boundingBox();
      if (width <= 760) await expect(map).toBeHidden();
      else { expect(bounds!.width).toBeGreaterThan(80); await expect(map).toBeVisible(); }
      const service = page.getByRole('button', { name: /^Serviciu / });
      expect((await service.boundingBox())!.y).toBeLessThan(844 * .8);
      await expect(page.locator('main img')).toHaveCount(0);
      await expect(page.locator('[data-company-card]')).toHaveCount(path === '/' ? 6 : companyCount);
      for (const card of await page.locator('[data-company-card]').all()) {
        await expect(card.locator('[data-company-identity]')).toBeVisible();
        await expect(card.getByRole('link', { name: /^Vezi profilul / })).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: info.outputPath(`${path === '/' ? 'home' : 'search'}-map-${width}.png`), fullPage: true });
      await page.screenshot({ path: info.outputPath(`${path === '/' ? 'home' : 'search'}-preview-${width}.png`), fullPage: false });
    }
  });
}

test('company profiles use an icon beside their name with no stock photograph', async ({ page }, info) => {
  for (const slug of ['alpha-cleaning', 'detailing-mobil', 'igienizare-tapiterie', 'zoom-cleaning']) {
    await page.goto(`/firme/${slug}/`);
    await expect(page.locator('main img, main figcaption')).toHaveCount(0);
    await expect(page.locator('[data-company-identity] h1')).toHaveCount(1);
    await expect(page.getByRole('region', { name: 'Pagini asociate' }).getByRole('link').first()).toBeVisible();
    await page.screenshot({ path: info.outputPath(`${slug}-identity.png`), fullPage: false });
  }
});

test('decorative map is available without JavaScript and navigation remains usable', async ({ browser }, info) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: info.project.use.viewport, baseURL: info.project.use.baseURL });
  try {
    const page = await context.newPage();
    for (const path of ['/', '/cauta/']) {
      await page.goto(path);
      if ((info.project.use.viewport?.width ?? 1440) <= 760) await expect(page.locator('svg[data-romania-map]')).toBeHidden();
      else await expect(page.locator('svg[data-romania-map]')).toBeVisible();
      await page.getByRole('link', { name: 'Vezi profilul Alpha Cleaning', exact: true }).click();
      await expect(page.locator('h1')).toHaveText('Alpha Cleaning');
      await expect(page.locator('main img')).toHaveCount(0);
    }
  } finally { await context.close(); }
});
