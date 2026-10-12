import test from "node:test";
import assert from "node:assert/strict";
import { load } from "cheerio";
import { loadCatalog } from "../src/lib/content/load";
import { verifyStructuredData } from "../src/lib/seo/verify-schema";

test("schema validator rejects business schema on non-profile pages", async () => {
  const catalog = await loadCatalog();
  const $ = load('<main><script type="application/ld+json">{"@type":"LocalBusiness","name":"Inventat"}</script></main>');
  assert.throws(() => verifyStructuredData($, "/", catalog), /outside company/);
});
test("schema validator rejects list entries absent from visible list", async () => {
  const catalog = await loadCatalog();
  const $ = load('<main><ul data-item-list><li><a href="/servicii/curatare-canapele/">Curățare canapele</a></li></ul><script type="application/ld+json">{"@type":"ItemList","itemListElement":[]}</script></main>');
  assert.throws(() => verifyStructuredData($, "/servicii/", catalog), /Page list mismatch/);
});
test("schema validator rejects breadcrumbs that contradict visible navigation", async () => {
  const catalog = await loadCatalog();
  const $ = load('<nav aria-label="Fir de navigare"><ol><li>Servicii</li></ol></nav><script type="application/ld+json">{"@type":"BreadcrumbList","itemListElement":[]}</script>');
  assert.throws(() => verifyStructuredData($, "/servicii/", catalog), /Breadcrumb mismatch/);
});
