import { companyCount } from './helpers/catalog';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { chooseOption } from './helpers/search-select';

for (const path of ['/', '/cauta/']) {
  test(`searchable dropdowns: filtering, selection, dismissal and accessibility on ${path}`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(path);
    const service = page.getByRole('button', { name: /^Serviciu / });
    const county = page.getByRole('button', { name: /^Județ / });
    const city = page.getByRole('button', { name: /^Oraș / });
    await service.click();
    await page.getByRole('combobox', { name: 'Caută serviciu', exact: true }).fill('CURATARE');
    await expect(page.getByRole('option')).toHaveText(['Curățare canapele']);
    await page.getByRole('option', { name: 'Curățare canapele', exact: true }).click();
    await expect(service).toHaveAccessibleName('Serviciu Curățare canapele');
    await county.click();
    await county.click();
    await expect(county).toHaveAttribute('aria-expanded', 'false');
    await county.click();
    const search = page.getByRole('combobox', { name: 'Caută județ', exact: true });
    if (info.project.name === 'mobile') await expect(search).not.toBeFocused();
    else await expect(search).toBeFocused();
    await search.fill('  BRASOV  ');
    await expect(page.getByRole('option')).toHaveText(['Brașov']);
    // Typing narrows choices without applying a filter or selecting a value.
    await expect(county).toHaveText(path === '/' ? 'Județ' : 'Toate județele');
    if (path === '/cauta/') await expect(page.getByRole('status')).toHaveText('4 firme găsite');
    await search.fill('nu-exista');
    await expect(page.getByRole('option')).toHaveCount(0);
    await expect(page.getByText('Niciun rezultat', { exact: true })).toBeVisible();
    await search.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await search.fill('brasov');
    await search.press('Enter');
    await expect(county).toHaveText('Brașov');
    await expect(county).toHaveAccessibleName('Județ Brașov');
    await expect(county).toBeFocused();
    await county.click();
    await expect(search).toHaveValue('');
    await expect(page.getByRole('option', { name: 'Brașov', exact: true })).toHaveAttribute('aria-selected', 'true');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await search.fill('timis');
    await search.press('Escape');
    await expect(county).toBeFocused();
    await expect(county).toHaveText('Brașov');
    await county.click();
    await page.getByRole('heading', { level: 1 }).click();
    await expect(county).toHaveAttribute('aria-expanded', 'false');
    await county.click();
    await service.click();
    await expect(page.getByRole('dialog')).toHaveCount(1);
    await expect(county).toHaveAttribute('aria-expanded', 'false');
    await service.press('Escape');
    await county.focus();
    await county.press('ArrowDown');
    await expect(search).toBeFocused();
    await search.press('Tab');
    await expect(city).toBeFocused();
    await county.press('ArrowUp');
    await search.press('Shift+Tab');
    await expect(service).toBeFocused();
    await county.press('ArrowDown');
    await search.fill('timis');
    await search.press('ArrowDown');
    await search.press('Enter');
    await expect(county).toHaveText('Timiș');
    await city.click();
    await page.getByRole('combobox', { name: 'Caută oraș', exact: true }).fill('TIMISOARA');
    await expect(page.getByRole('option')).toHaveCount(1);
    await page.getByRole('combobox', { name: 'Caută oraș', exact: true }).press('Enter');
    await expect(city).toContainText('Timișoara');
    await chooseOption(county, 'ilfov');
    if (path === '/') {
      await expect(city).toBeDisabled();
      await expect(city).toHaveText('La nivel de județ');
    } else {
      await expect(city).toHaveText('Toate orașele');
      await page.getByRole('button', { name: 'Resetează filtrele' }).click();
      await expect(county).toHaveText('Toate județele');
      await expect(page.getByRole('status')).toHaveText(`${companyCount} firme găsite`);
    }
    expect(errors).toEqual([]);
  });

  test(`open dropdown stays within viewport on ${path}`, async ({ page }, info) => {
    const widths = info.project.name === 'mobile' ? [360, 390] : [768, 1440];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(path);
      await chooseOption(page.getByRole('button', { name: /^Serviciu / }), 'curatare-canapele');
      await page.getByRole('button', { name: /^Județ / }).click();
      const panel = page.getByRole('dialog');
      const search = page.getByRole('combobox');
      const bounds = await panel.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const option of await page.getByRole('option').all()) expect((await option.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: info.outputPath(`dropdown-${path === '/' ? 'home' : 'search'}-${width}.png`), fullPage: false });
      if (info.project.name === 'mobile') {
        // Emulate the reduction in visible space caused by an on-screen keyboard.
        // A real device keyboard still needs physical-device acceptance.
        await search.focus();
        await page.setViewportSize({ width, height: 420 });
        await search.fill('constanta');
        const reduced = await panel.boundingBox();
        expect(reduced!.y + reduced!.height).toBeLessThanOrEqual(420);
        await page.getByRole('option', { name: 'Constanța', exact: true }).click();
        await expect(page.getByRole('button', { name: /^Județ / })).toHaveText('Constanța');
      }
    }
  });
}
