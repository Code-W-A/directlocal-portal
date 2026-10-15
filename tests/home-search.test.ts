import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCatalog } from '../src/lib/content/load';
import { homeDestinations, homeSearchHref } from '../src/lib/content/home-search';
test('home search resolves only exact published destinations', async () => {
  const catalog = await loadCatalog();
  const destinations = homeDestinations(catalog);
  assert.equal(homeSearchHref(destinations, '', '', ''), '/cauta/');
  assert.equal(homeSearchHref(destinations, 'curatare-canapele', '', ''), '/servicii/curatare-canapele/');
  assert.equal(homeSearchHref(destinations, 'curatare-canapele', 'timis', ''), '/servicii/curatare-canapele/timis/');
  assert.equal(homeSearchHref(destinations, 'curatare-canapele', 'timis', 'timisoara'), '/servicii/curatare-canapele/timis/timisoara/');
  assert.equal(homeSearchHref(destinations, 'curatare-canapele', 'ilfov', ''), '/servicii/curatare-canapele/ilfov/');
  assert.equal(homeSearchHref(destinations, 'curatare-canapele', 'ilfov', 'voluntari'), '/cauta/');
  assert(!destinations.some(d => d.countyId === 'ilfov' && d.cityId));
});
test('draft pages never appear in homepage search', async () => {
  const catalog = structuredClone(await loadCatalog());
  catalog.pages.forEach(p => { if (p.kind === 'local') p.status = 'draft'; });
  assert(!homeDestinations(catalog).some(d => d.cityId));
});
