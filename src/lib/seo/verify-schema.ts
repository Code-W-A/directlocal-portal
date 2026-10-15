import assert from "node:assert/strict";
import type { CheerioAPI } from "cheerio";
import type { Catalog } from "../content/schemas";
import { companyPath, contentPath, absoluteUrl } from "./urls";
export function verifyStructuredData($: CheerioAPI, path: string, catalog: Catalog, origin?: string) {
  const data = $('script[type="application/ld+json"]').toArray().map(el => JSON.parse($(el).text()));
  const url = (p: string) => origin ? absoluteUrl(p, origin) : p;
  const crumbs = $('nav[aria-label="Fir de navigare"] li').toArray();
  const breadcrumb = data.filter(d => d['@type'] === "BreadcrumbList");
  assert.equal(breadcrumb.length, crumbs.length ? 1 : 0, `Breadcrumb schema count: ${path}`);
  if (crumbs.length) assert.deepEqual(breadcrumb[0].itemListElement, crumbs.map((el, i) => ({ '@type': 'ListItem', position: i + 1, name: $(el).text(), item: url($(el).find('a').attr('href') ?? path) })), `Breadcrumb mismatch: ${path}`);
  const company = catalog.companies.find(c => companyPath(c) === path);
  const business = data.filter(d => d['@type'] === "LocalBusiness");
  assert.equal(business.length, company ? 1 : 0, `LocalBusiness outside company profile: ${path}`);
  if (company) {
    const expected = { '@context': 'https://schema.org', '@type': 'LocalBusiness', ...(origin ? { '@id': url(companyPath(company)) + '#business' } : {}), name: company.name, description: company.description,
      ...(company.website ? { url: company.website } : {}), ...(company.phone ? { telephone: company.phone } : {}), ...(company.email ? { email: company.email } : {}),
      ...(company.headquarters ? { address: { '@type': 'PostalAddress', addressLocality: company.headquarters.locality, addressRegion: company.headquarters.county, addressCountry: 'RO', ...(company.headquarters.street ? { streetAddress: company.headquarters.street } : {}) } } : {}),
      areaServed: catalog.locations.filter(l => company.offerings.some(o => o.coverage.some(a => a.locationId === l.id))).map(l => ({ '@type': 'City', name: l.name })).concat(catalog.counties.filter(c => company.offerings.some(o => o.countyCoverage.some(a => a.countyId === c.id))).map(c => ({ '@type': 'AdministrativeArea', name: c.name }))) };
    assert.deepEqual(business[0], expected, `Business schema mismatch: ${path}`);
    const visible = $('main').text();
    for (const value of [company.name, company.description, company.phone, company.email, company.headquarters?.locality, company.headquarters?.county, company.headquarters?.street].filter(Boolean)) assert(visible.includes(value!), `Business fact absent from visible content: ${path}`);
    if (company.website) assert($('a[href]').toArray().some(a => $(a).attr('href') === company.website));
    for (const area of expected.areaServed) assert(visible.includes(area.name));
  }
  const local = catalog.pages.find(p => (p.kind === "local" || (p.kind === "county" && p.companyIds.length > 0)) && contentPath(p, catalog) === path);
  const itemLists = data.filter(d => d['@type'] === 'ItemList');
  const groups = $('[data-item-list]').toArray();
  assert.equal(itemLists.length, (local ? 1 : 0) + groups.length, `ItemList count: ${path}`);
  groups.forEach((group, index) => {
    const marked = $(group).find('a[data-list-entry]');
    const pageLinks = (marked.length ? marked : $(group).find('a')).toArray();
    assert.deepEqual(itemLists[index + (local ? 1 : 0)].itemListElement, pageLinks.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: $(a).text(), url: url($(a).attr('href')!) })), `Page list mismatch: ${path}`);
  });
  if (local && (local.kind === "local" || local.kind === "county")) {
    const companies = catalog.companies.filter(c => local.companyIds.includes(c.id)).toSorted((a,b) => a.name.localeCompare(b.name, 'ro'));
    assert.deepEqual(itemLists[0].itemListElement, companies.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, url: url(companyPath(c)) })), `ItemList mismatch: ${path}`);
    for (const c of companies) assert($('h3 a').toArray().some(a => $(a).attr('href') === companyPath(c) && $(a).text() === c.name));
  }
  const websites = data.filter(d => d['@type'] === 'WebSite');
  assert.equal(websites.length, origin && path === '/' ? 1 : 0, `WebSite count: ${path}`);
  if (websites.length) assert.deepEqual(websites[0], { '@context': 'https://schema.org', '@type': 'WebSite', '@id': origin + '/#website', publisher: { '@id': origin + '/#organization' }, name: 'DirectLocal.ro', url: origin + '/', inLanguage: 'ro' });
  const organizations = data.filter(d => d['@type'] === 'Organization');
  assert.equal(organizations.length, origin && path === '/' ? 1 : 0);
  if (organizations.length) assert.deepEqual(organizations[0], { '@context':'https://schema.org', '@type':'Organization', '@id':origin+'/#organization', name:'Web Dynamicx', url:'https://webdynamicx.ro/', email:'webdynamicx@gmail.com' });
  assert(data.every(d => ['BreadcrumbList', 'ItemList', 'LocalBusiness', 'WebSite', 'Organization'].includes(d['@type'])), `Unsupported schema: ${path}`);
}
