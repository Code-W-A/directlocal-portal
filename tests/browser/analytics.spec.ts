import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const site = 'https://directlocal.ro';
async function isolate(page: Page, baseURL: string) {
  await page.route('https://directlocal.ro/**', async route => {
    const url = new URL(route.request().url());
    const response = await route.fetch({ url: baseURL + url.pathname + url.search });
    await route.fulfill({ response });
  });
  await page.route('https://www.googletagmanager.com/**', route => route.fulfill({ contentType: 'application/javascript', body: '/* mocked Google tag: no telemetry leaves test */' }));
  await page.route(/https:\/\/[^/]*google-analytics\.com\//, route => route.abort());
}
async function entries(page: Page) {
  return page.evaluate(() => (window.dataLayer ?? []).map(entry => Array.from(entry as ArrayLike<unknown>)));
}
async function eventCount(page: Page, name: string) { return (await entries(page)).filter(e => e[0] === 'event' && e[1] === name).length; }
async function accept(page: Page) { await page.getByRole('button', {name: 'Accept statisticile', exact: true}).click(); await expect.poll(() => eventCount(page, 'page_view')).toBe(1); }
test('optional analytics: no Google before agreement, clean events, revocation and no duplicates', async ({page, baseURL}) => {
  await isolate(page, baseURL!);
  let tagRequests = 0; page.on('request', request => { if(request.url().includes('googletagmanager.com')) tagRequests++; });
  await page.goto(site + '/?email=private@example.org');
  await expect(page.getByRole('button', {name:'Refuz statisticile',exact:true})).toBeVisible();
  expect(tagRequests).toBe(0);
  for (const width of [360,390,1440]) { await page.setViewportSize({width,height:900}); expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBeTruthy(); }
  expect((await new AxeBuilder({page}).include('[aria-labelledby="analytics-consent-title"]').analyze()).violations).toEqual([]);
  await page.getByRole('button',{name:'Refuz statisticile',exact:true}).click();
  await page.reload(); await expect(page.getByRole('button',{name:'Preferințe cookies'})).toBeVisible(); expect(tagRequests).toBe(0);
  await page.getByRole('button',{name:'Preferințe cookies'}).click(); await accept(page);
  expect(tagRequests).toBe(1); expect(JSON.stringify(await entries(page))).not.toContain('private@example.org');
  await page.locator('header').getByRole('link', {name:'Servicii',exact:true}).click();
  await expect.poll(()=>eventCount(page,'page_view')).toBe(1);
  await page.evaluate(()=>{ document.cookie='_ga=returning-visitor; path=/; Secure'; });
  await page.reload(); await expect.poll(()=>eventCount(page,'page_view')).toBe(1);
  expect(await page.evaluate(()=>document.cookie)).toContain('_ga=returning-visitor');
  await page.goto(site+'/firme/zoom-cleaning/');
  await expect.poll(()=>eventCount(page,'page_view')).toBe(1);
  await page.locator('a[data-analytics-event]').evaluateAll(links=>links.forEach(link=>link.addEventListener('click',event=>event.preventDefault())));
  await page.locator('a[data-analytics-event="phone_click"]').first().click();
  await page.locator('a[data-analytics-event="company_website_click"]').click();
  expect(await eventCount(page,'phone_click')).toBe(1); expect(await eventCount(page,'company_website_click')).toBe(1);
  expect((await entries(page)).find(e=>e[1]==='phone_click')?.[2]).toMatchObject({company_id:'zoom-cleaning'});
  await page.locator('main a[href="/servicii/curatare-canapele/"]').first().click();
  await expect.poll(()=>eventCount(page,'page_view')).toBe(2);
  await page.goBack(); await expect.poll(()=>eventCount(page,'page_view')).toBe(3);
  await page.evaluate(()=>{ document.cookie='_ga=test; path=/; Secure'; });
  await page.getByRole('button',{name:'Preferințe cookies'}).click(); await page.getByRole('button',{name:'Refuz statisticile',exact:true}).click();
  await page.locator('a[data-analytics-event="phone_click"]').first().click();
  expect(await eventCount(page,'phone_click')).toBe(1); expect(await page.evaluate(()=>document.cookie)).not.toContain('_ga=');
  await page.getByRole('button',{name:'Preferințe cookies'}).click(); await page.getByRole('button',{name:'Accept statisticile',exact:true}).click();
  await expect.poll(()=>eventCount(page,'page_view')).toBe(4);
});
test('successful forms and empty search emit no submitted personal text',async({page,baseURL})=>{
  await isolate(page,baseURL!); await page.goto(site+'/firme/zoom-cleaning/#mesaj'); await accept(page);
  const form=page.getByRole('form',{name:'Mesaj către Zoom Cleaning'});
  await form.getByLabel('Numele tău').fill('Private Person'); await form.getByLabel('Email pentru răspuns').fill('private@example.org'); await form.getByLabel('Mesaj',{exact:true}).fill('Private message for test only'); await form.getByRole('checkbox').check();
  await page.route('**/api/contact/',route=>route.fulfill({status:503,json:{message:'Test failure'}}));
  await form.getByRole('button',{name:'Trimite mesajul'}).click(); await expect(form.getByRole('alert')).toBeVisible(); expect(await eventCount(page,'company_message_accepted')).toBe(0);
  await page.route('**/api/contact/',route=>route.fulfill({status:200,json:{message:'Mesaj acceptat'}}));
  await form.getByRole('button',{name:'Trimite mesajul'}).click(); await expect(form.getByRole('status')).toBeVisible(); expect(await eventCount(page,'company_message_accepted')).toBe(1);
  expect(JSON.stringify(await entries(page))).not.toMatch(/Private Person|private@example|Private message/);
  await page.goto(site+'/inscriere-firma/'); await expect.poll(()=>eventCount(page,'page_view')).toBe(1);
  await page.getByLabel('Denumirea firmei').fill('Private Company'); await page.getByLabel('Numele reprezentantului').fill('Private Person'); await page.getByLabel('Telefon de contact',{exact:true}).fill('0700000000'); await page.getByRole('checkbox').check();
  await page.getByRole('button',{name:'Vreau să fiu contactat'}).click(); await expect(page.getByRole('status')).toBeVisible(); expect(await eventCount(page,'company_submission_accepted')).toBe(1);
  expect(JSON.stringify(await entries(page))).not.toMatch(/Private Company|Private Person|0700000000/);
  await page.goto(site+'/cauta/'); await expect.poll(()=>eventCount(page,'page_view')).toBe(1);
  await page.getByLabel('Nume sau descriere').fill('private@example.org'); await expect.poll(()=>eventCount(page,'search_no_results')).toBe(1);
  expect(JSON.stringify(await entries(page))).not.toContain('private@example.org');
});
