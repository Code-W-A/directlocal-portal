import { expect, type Locator } from '@playwright/test';

export async function chooseOption(field: Locator, value: string) {
  await field.click();
  await field.page().getByRole('dialog').locator(`[role="option"][data-value="${value}"]`).click();
  await expect(field).toHaveAttribute('aria-expanded', 'false');
}

export async function expectOptionCount(field: Locator, count: number) {
  await field.click();
  await expect(field.page().getByRole('option')).toHaveCount(count);
  await field.press('Escape');
}
