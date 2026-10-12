import test from "node:test";
import assert from "node:assert/strict";
import { resolveSiteConfig } from "../src/config/site";
import { pageMetadata } from "../src/lib/seo/metadata";
import { absoluteUrl } from "../src/lib/seo/urls";
import { serializeJsonLd } from "../src/components/seo/JsonLd";
const page = { path: "/servicii/test/", title: "Test", description: "Descriere test" };
test("default is noindex with no fictional canonical or OG URL", () => {
  const config = resolveSiteConfig({});
  assert.equal(config.indexable, false);
  const meta = pageMetadata(page, config);
  assert.deepEqual(meta.robots, { index: false, follow: true });
  assert.equal(meta.alternates, undefined);
  assert.equal((meta.openGraph as { url?: string }).url, undefined);
});
test("indexing requires a real HTTPS domain", () => {
  assert.throws(() => resolveSiteConfig({ INDEXING_ENABLED: "true" }), /SITE_URL/);
  for (const url of ["https://example.com", "http://real.ro", "https://localhost", "https://real.ro/path", "https://real.ro?x=1", "https://user:password@real.ro", "https://real.ro:444", "https://127.0.0.1", "https://192.168.1.1"]) {
    assert.throws(() => resolveSiteConfig({ SITE_URL: url, INDEXING_ENABLED: "true" }));
  }
  assert.throws(() => resolveSiteConfig({ INDEXING_ENABLED: "yes" }));
});
test("production config enables self canonical metadata", () => {
  const config = resolveSiteConfig({ SITE_URL: "https://director.ro/", INDEXING_ENABLED: "true", VERCEL_ENV: "production" });
  assert.equal(config.indexable, true);
  const meta = pageMetadata(page, config);
  assert.deepEqual(meta.alternates, { canonical: "https://director.ro/servicii/test/" });
  assert.deepEqual(meta.robots, { index: true, follow: true });
});
test("Vercel previews and development stay noindex even if production flag leaks", () => {
  for (const environment of ["preview", "development"]) {
    assert.equal(resolveSiteConfig({ SITE_URL: "https://director.ro", INDEXING_ENABLED: "true", VERCEL_ENV: environment }).indexable, false);
  }
});
test("search omits canonical while noindex content keeps a self canonical", () => {
  const config = resolveSiteConfig({ SITE_URL: "https://director.ro", INDEXING_ENABLED: "true" });
  const meta = pageMetadata({ ...page, noindex: true, omitCanonical: true }, config);
  assert.equal(meta.alternates, undefined);
  assert.deepEqual(meta.robots, { index: false, follow: true });
});
test("URL builder rejects external paths", () => {
  assert.throws(() => absoluteUrl("//evil.org/", "https://director.ro"));
  assert.throws(() => absoluteUrl("https://evil.org/", "https://director.ro"));
});
test("JSON-LD cannot break out of the script element", () => {
  const value = { name: '</script><script>alert("x")</script>&' };
  const json = serializeJsonLd(value);
  assert(!json.includes("<"));
  assert.deepEqual(JSON.parse(json), value);
});

test("global indexing never overrides per-page noindex", () => {
  const config = resolveSiteConfig({ SITE_URL: "https://director.ro", INDEXING_ENABLED: "true" });
  const meta = pageMetadata({ ...page, indexStatus: "noindex" }, config);
  assert.deepEqual(meta.robots, { index: false, follow: true });
  assert.deepEqual(meta.alternates, { canonical: "https://director.ro/servicii/test/" });
});
