import { test, expect } from '@playwright/test';
import { chooseOption } from './helpers/search-select';
import { catalog } from './helpers/catalog';

test('production redirects preserve path and query while localhost and apex stay local', async ({ request }) => {
  const response = await request.get('/servicii/?serviciu=test&zona=brasov', {headers:{host:'www.directlocal.ro'},maxRedirects:0});
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe('https://directlocal.ro/servicii/?serviciu=test&zona=brasov');
  expect((await request.get('/servicii/',{maxRedirects:0})).status()).toBe(200);
  expect((await request.get('/servicii/',{headers:{host:'directlocal.ro'},maxRedirects:0})).status()).toBe(200);
});
test('API is noindex and production rejects local origin before SMTP', async ({ request }) => {
  const get=await request.get('/api/contact/');
  expect(get.status()).toBe(405); expect(get.headers()['x-robots-tag']).toContain('noindex');
  const denied=await request.post('/api/contact/',{headers:{origin:'http://127.0.0.1:3000'},data:{}});
  expect(denied.status()).toBe(403);
  const invalid=await request.post('/api/contact/',{headers:{origin:'https://directlocal.ro'},data:{}});
  expect(invalid.status()).toBe(400); // Invalid input never reaches transport.
});
test('all service identities and multiservice filtering use the selected service', async ({page}) => {
  await page.goto('/servicii/');
  for(const service of catalog.services.filter(s=>s.status==='published')) {
    const icon=service.id==='curatare-canapele'?'upholstery-cleaning':service.id;
    expect(await page.locator(`[data-service-icon="${icon}"]`).count(),service.name).toBeGreaterThan(0);
  }
  await page.goto('/cauta/');
  await chooseOption(page.getByRole('button',{name: /^Serviciu /}),'panouri-fotovoltaice');
  await chooseOption(page.getByRole('button',{name: /^Județ /}),'bacau');
  await chooseOption(page.getByRole('button',{name: /^Oraș /}),'bacau');
  await expect(page.getByRole('status')).toHaveText('1 firmă găsită');
  await expect(page.getByRole('link',{name:'Vezi profilul Voltecon'})).toBeVisible();
  await chooseOption(page.getByRole('button',{name: /^Serviciu /}),'electrician-auto');
  await expect(page.getByRole('button',{name: /^Județ /})).toHaveText('Toate județele');
  await expect(page.getByRole('button',{name: /^Oraș /})).toHaveText('Toate orașele');
  await expect(page.getByRole('status')).toHaveText('2 firme găsite');
  await page.getByRole('link',{name:'Vezi profilul BEDA IMPEX'}).click();
  await expect(page.locator('h1')).toHaveText('BEDA IMPEX');
  await expect(page.getByRole('region',{name:'Servicii și localități deservite'}).locator('h3')).toHaveCount(4);
});
test('consolidated service route and new company remain navigable without JavaScript', async ({browser},info) => {
  const context=await browser.newContext({javaScriptEnabled:false,baseURL:info.project.use.baseURL,viewport:info.project.use.viewport});
  try {
    const page=await context.newPage(); await page.goto('/servicii/electricieni/');
    await page.locator('main a[href="/servicii/electricieni/dambovita/"]').click();
    await expect(page.locator('main')).toContainText('Găești');
    await page.locator('a[data-list-entry][href="/firme/mdc-instal-clima-expert/"]').click();
    await expect(page.locator('h1')).toHaveText('MDC Instal Clima Expert');
    await expect(page.getByRole('region',{name:'Pagini asociate'}).getByRole('link',{name:'Electricieni în județul Dâmbovița'})).toBeVisible();
  } finally {await context.close();}
});
