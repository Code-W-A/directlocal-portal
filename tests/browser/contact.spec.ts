import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('company message keeps draft after failure and only confirms API acceptance', async ({ page }) => {
  await page.goto('/firme/zoom-cleaning/#mesaj');
  const form = page.getByRole('form', { name: 'Mesaj către Zoom Cleaning' });
  await form.getByLabel('Numele tău').fill('Test local'); await form.getByLabel('Email pentru răspuns').fill('test@example.org');
  await form.getByLabel('Mesaj', { exact: true }).fill('Mesaj fictiv pentru test.'); await form.getByRole('checkbox').check();
  await page.route('**/api/contact/', route => route.fulfill({ status: 503, json: { message: 'Trimiterea nu este disponibilă.' } }));
  await form.getByRole('button', { name: 'Trimite mesajul' }).click(); await expect(form.getByRole('alert')).toBeVisible();
  await expect(form.getByLabel('Mesaj', { exact: true })).toHaveValue('Mesaj fictiv pentru test.');
  await page.route('**/api/contact/', route => route.fulfill({ status: 200, json: { message: 'Mesajul a fost acceptat la trimitere.' } }));
  await form.getByRole('button', { name: 'Trimite mesajul' }).click(); await expect(form.getByRole('status')).toContainText('acceptat');
  await expect(form.getByRole('button')).toBeDisabled();
});
test('submission fields, responsive layout, accessibility and static fallback', async ({ page, browser }) => {
  for (const width of [360,390,1440]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto('/inscriere-firma/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Înscrie firma');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
  await page.getByLabel('Denumirea firmei').fill('Test');
  await page.getByLabel('Numele reprezentantului').fill('Reprezentant test');
  await page.getByLabel('Telefon de contact', { exact: true }).fill('0700000000');
  await page.getByRole('checkbox').check();
  await expect(page.getByLabel('Email (opțional)')).not.toHaveAttribute('required');
  await expect(page.locator('textarea')).toHaveCount(0);
  await page.route('**/api/contact/', async route => {
    const payload = route.request().postDataJSON();
    expect(payload.phone).toBe('0700000000'); expect(payload.email).toBe('');
    expect(payload.services).toBeUndefined();
    await route.fulfill({ status: 200, json: { message: 'Solicitarea a fost acceptată la trimitere.' } });
  });
  await page.getByRole('button', { name: 'Vreau să fiu contactat' }).click();
  await expect(page.getByRole('status')).toContainText('acceptată');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const context = await browser.newContext({ javaScriptEnabled: false }); const staticPage = await context.newPage();
  await staticPage.goto('/inscriere-firma/'); await expect(staticPage.locator('noscript p')).toBeVisible(); await context.close();
});
test('companies without verified email have no message form', async ({ page }) => {
  await page.goto('/firme/alpha-cleaning/'); await expect(page.locator('#mesaj')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Propune o corectură' })).toBeVisible();
});
