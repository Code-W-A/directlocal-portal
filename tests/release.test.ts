import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolveSiteConfig } from '../src/config/site';
import { loadCatalog } from '../src/lib/content/load';
import { getPublicPages, indexablePages } from '../src/lib/seo/registry';
import { contactOrigin } from '../src/lib/contact/origin';
import { NextRequest } from 'next/server';
import { proxy, config } from '../src/proxy';

test('approved production defaults and preview override keep the canonical origin consistent', () => {
  const production = resolveSiteConfig({NODE_ENV:'production'});
  assert.equal(production.url, 'https://directlocal.ro'); assert(production.indexable);
  const preview = resolveSiteConfig({NODE_ENV:'production',VERCEL_ENV:'preview',INDEXING_ENABLED:'true'});
  assert.equal(preview.url, production.url); assert.equal(preview.indexable, false);
  assert.equal(resolveSiteConfig({NODE_ENV:'development',SITE_URL:production.url,INDEXING_ENABLED:'true'}).indexable,false);
  assert.equal(resolveSiteConfig({NODE_ENV:'production',INDEXING_ENABLED:'false'}).indexable,false);
});
test('www redirect preserves root, trailing slash, files and query without touching localhost', () => {
  assert.deepEqual(config.matcher[0].has, [{type:'host',value:'www.directlocal.ro'}]);
  for(const path of ['/', '/servicii/?a=1&b=2', '/robots.txt', '/images/directlocal-social.jpg']) {
    const response=proxy(new NextRequest('http://www.directlocal.ro'+path,{headers:{host:'www.directlocal.ro'}}));
    assert.equal(response.status,308); assert.equal(response.headers.get('location'),'https://directlocal.ro'+path);
  }
  assert.equal(proxy(new NextRequest('http://localhost:3000/',{headers:{host:'localhost:3000'}})).headers.get('location'),null);
});
test('production forms ignore stale localhost configuration and untrusted request host', () => {
  assert.equal(contactOrigin('https://hostile.example/api/contact/', 'https://directlocal.ro', {NODE_ENV:'production',CONTACT_ORIGIN:'http://127.0.0.1:3000'}),'https://directlocal.ro');
  assert.equal(contactOrigin('http://127.0.0.1:3000/api/contact/',undefined,{NODE_ENV:'development'}),'http://127.0.0.1:3000');
});
test('all 40 registry opportunities have an accountable decision and no blocked URL is published', async () => {
  const report = JSON.parse(await readFile('docs/research/opportunity-inventory-2026-10-15.json','utf8'));
  assert.equal(report.opportunities.length,40);
  assert.equal(new Set(report.opportunities.map((o: {key:string})=>o.key)).size,40);
  const site=resolveSiteConfig({NODE_ENV:'production'}), catalog=await loadCatalog();
  const pages=getPublicPages(catalog,site), urls=new Set(indexablePages(pages,site).map(p=>p.path));
  for (const opportunity of report.opportunities) {
    assert(opportunity.reason);
    if(opportunity.targetUrl) { assert(urls.has(opportunity.targetUrl)); assert(opportunity.companyIds.length); }
    else { assert.equal(opportunity.decision,'blocked'); assert.equal(opportunity.indexStatus,'noindex'); }
  }
  assert(!urls.has('/cauta/')); assert(pages.every(p=>p.updatedAt <= '2026-10-15'));
  const domains=catalog.companies.filter(c=>c.website).map(c=>new URL(c.website!).hostname.replace(/^www\./,''));
  assert.equal(new Set(domains).size, domains.length);
});
