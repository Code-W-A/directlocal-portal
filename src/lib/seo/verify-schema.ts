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
    const expected = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: company.name, description: company.description,
      ...(company.website ? { url: company.website } : {}), ...(company.phone ? { telephone: company.phone } : {}), ...(company.email ? { email: company.email } : {}),
      ...(company.headquarters ? { address: { '@type': 'PostalAddress', addressLocality: company.headquarters.locality, addressRegion: company.headquarters.county, addressCountry: 'RO', ...(company.headquarters.street ? { streetAddress: company.headquarters.street } : {}) } } : {}),
      areaServed: catalog.locations.filter(l => company.offerings.some(o => o.coverage.some(a => a.locationId === l.id))).map(l => ({ '@type': 'City', name: l.name })) };
    assert.deepEqual(business[0], expected, `Business schema mismatch: ${path}`);
    const visible = $('main').text();
    for (const value of [company.name, company.description, company.phone, company.email, company.headquarters?.locality, company.headquarters?.county, company.headquarters?.street].filter(Boolean)) assert(visible.includes(value!), `Business fact absent from visible content: ${path}`);
    if (company.website) assert($('a[href]').toArray().some(a => $(a).attr('href') === company.website));
    for (const area of expected.areaServed) assert(visible.includes(area.name));
  }
  const local = catalog.pages.find(p => p.kind === "local" && contentPath(p, catalog) === path);
  const itemLists = data.filter(d => d['@type'] === 'ItemList');
  const pageLinks = $('[data-item-list] a').toArray();
  assert.equal(itemLists.length, local || pageLinks.length ? 1 : 0, `ItemList count: ${path}`);
  if (pageLinks.length) assert.deepEqual(itemLists[0].itemListElement, pageLinks.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: $(a).text(), url: url($(a).attr('href')!) })), `Page list mismatch: ${path}`);
  if (local?.kind === "local") {
    const companies = catalog.companies.filter(c => local.companyIds.includes(c.id)).toSorted((a,b) => a.name.localeCompare(b.name, 'ro'));
    assert.deepEqual(itemLists[0].itemListElement, companies.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, url: url(companyPath(c)) })), `ItemList mismatch: ${path}`);
    for (const c of companies) assert($('h3 a').toArray().some(a => $(a).attr('href') === companyPath(c) && $(a).text() === c.name));
  }
  assert(data.every(d => ['BreadcrumbList', 'ItemList', 'LocalBusiness'].includes(d['@type'])), `Unsupported schema: ${path}`);
}
