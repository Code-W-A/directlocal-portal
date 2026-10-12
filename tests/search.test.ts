import test from "node:test";
import assert from "node:assert/strict";
import { buildSearchIndex, filterSearch, type SearchRow } from "../src/lib/content/search";
import { loadCatalog } from "../src/lib/content/load";
import { getPublicPages, indexablePages } from "../src/lib/seo/registry";
import { resolveSiteConfig } from "../src/config/site";
test("search supports real catalog, accents, empty results and combined filters", async () => {
  const rows = buildSearchIndex(await loadCatalog());
  assert.equal(filterSearch(rows, { service: "curatare-canapele", county: "brasov", city: "brasov", query: "tapiterie" }).length, 1);
  assert.equal(filterSearch(rows, { service: "", county: "", city: "", query: "inexistent" }).length, 0);
  const synthetic: SearchRow[] = [{ id: "test", name: "Test", description: "", href: "/firme/test/", coverage: [
    { serviceId: "a", service: "A", cityId: "x", city: "X", countyId: "j", county: "J" },
    { serviceId: "b", service: "B", cityId: "y", city: "Y", countyId: "k", county: "K" },
  ] }];
  assert.equal(filterSearch(synthetic, { service: "a", county: "k", city: "y", query: "" }).length, 0);
});
test("sitemap selector excludes noindex even with global indexing enabled", async () => {
  const config = resolveSiteConfig({ SITE_URL: "https://director.ro", INDEXING_ENABLED: "true" });
  const pages = getPublicPages(await loadCatalog(), config);
  assert.equal(indexablePages(pages, config).length, 6);
  const candidate = { ...pages[0], indexStatus: "index" as const };
  assert.deepEqual(indexablePages([...pages.slice(1), candidate], config), [...pages.slice(1).filter(p => p.indexStatus === "index"), candidate]);
  assert.equal(indexablePages([candidate], resolveSiteConfig({})).length, 0);
});

test("county filter finds Ilfov without fabricating cities", async () => {
  const rows = buildSearchIndex(await loadCatalog());
  const filters = { service: "curatare-canapele", county: "ilfov", city: "", query: "" };
  assert.deepEqual(filterSearch(rows, filters).map(r => r.id), ["detailing-mobil"]);
  assert.equal(filterSearch(rows, { ...filters, city: "voluntari" }).length, 0);
  assert.equal(filterSearch(rows, { ...filters, city: "brasov" }).length, 0);
  assert(rows.find(r => r.id === "detailing-mobil")!.coverage.every(a => !a.cityId));
  assert.deepEqual(filterSearch(rows, { ...filters, county: "timis", city: "timisoara" }).map(r => r.id), ["zoom-cleaning"]);
});
