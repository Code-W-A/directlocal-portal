import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { validateCatalog } from "../src/lib/content/validate";
import { loadCatalog } from "../src/lib/content/load";
import { renderMarkdown } from "../src/lib/content/markdown";
import { getPublicPages } from "../src/lib/seo/registry";
import { resolveSiteConfig } from "../src/config/site";

const site = resolveSiteConfig({});
import type { Catalog } from "../src/lib/content/schemas";
import { similarity } from "../src/lib/content/validate";
export function fixture(): Catalog {
  const base = { status: "published" as const, updatedAt: "2026-10-07" };
  const source = { id: "source", url: "https://example.org/", checkedAt: "2026-10-07", note: "Test evidence only" };
  const editorial = { ...base, indexStatus: "noindex" as const, intro: Array.from({ length: 75 }, (_, i) => `cuvant${i}`).join(" "), sources: [source], editorialReviewed: false };
  return {
    services: [{ ...base, id: "test-service", slug: "test-service", name: "Serviciu de test", summary: "Exclusiv pentru teste." }],
    counties: [{ ...base, id: "test-county", slug: "test-county", name: "Județ de test" }],
    locations: [{ ...base, id: "test-city", slug: "test-city", name: "Localitate de test", countyId: "test-county" }],
    companies: [{ ...base, id: "test-company", slug: "test-company", indexStatus: "noindex", sponsored: false, name: "Firmă de test", description: "Date fictive numai pentru teste.", seo: { title: "Firmă test", description: "Descriere test." }, website: "https://example.org/", evidence: { name: ["source"], description: ["source"], website: ["source"] }, offerings: [{ serviceId: "test-service", sourceIds: ["source"], coverage: [{ locationId: "test-city", sourceIds: ["source"] }] }], sources: [source] }],
    pages: [
      { ...editorial, id: "test-hub", slug: "test-hub", kind: "service", title: "Serviciu test", seo: { title: "Serviciu test", description: "Descriere serviciu." }, serviceId: "test-service", body: "## Despre\nConținut pentru teste." },
      { ...editorial, id: "test-local", slug: "test-local", kind: "local", title: "Pagină locală test", seo: { title: "Pagină locală test", description: "Descriere locală." }, serviceId: "test-service", locationId: "test-city", companyIds: ["test-company"], body: "## Informații locale\nConținut local pentru teste." },
      { ...editorial, id: "test-county-page", slug: "test-county-page", kind: "county", title: "Județ test", seo: { title: "Județ test", description: "Descriere județ." }, serviceId: "test-service", countyId: "test-county", body: "## Localități\nDirector pentru județ." },
    ],
  };
}
test("real PoC has ten routes and all remain noindex", async () => {
  const catalog = await loadCatalog();
  assert.equal(catalog.companies.length, 1); assert.equal(catalog.locations.length, 1);
  const pages = getPublicPages(catalog, site);
  assert.equal(pages.length, 10); assert(pages.every(p => p.indexStatus === "noindex"));
});
test("published pages derive stable service, county, local and company URLs", () => {
  const paths = getPublicPages(validateCatalog(fixture()), site).map(p => p.path);
  for (const path of ["/firme/test-company/", "/servicii/test-service/", "/servicii/test-service/test-county/", "/servicii/test-service/test-county/test-city/"]) assert(paths.includes(path));
});
test("draft content never enters public registry", () => {
  const data = fixture();
  for (const entries of Object.values(data)) for (const entry of entries) entry.status = "draft";
  assert.equal(getPublicPages(validateCatalog(data), site).length, 3);
});
test("reject duplicate IDs, non-ASCII slugs and missing fields", () => {
  const data = fixture(); data.services.push({ ...data.services[0] });
  assert.throws(() => validateCatalog(data), /Duplicate/);
  const invalid = fixture(); invalid.services[0].slug = "Târgoviște";
  assert.throws(() => validateCatalog(invalid), /ASCII/);
  assert.throws(() => validateCatalog({ ...fixture(), companies: [{ id: "incomplete" }] }));
});
test("same city name in different counties is allowed", () => {
  const data = fixture();
  data.counties.push({ ...data.counties[0], id: "other-county", slug: "other-county" });
  data.locations.push({ ...data.locations[0], id: "second-city", countyId: "other-county" });
  assert.doesNotThrow(() => validateCatalog(data));
});
test("reject duplicate page URLs even with distinct IDs and slugs", () => {
  const data = fixture(); data.pages.push({ ...data.pages[0], id: "other-page", slug: "other-page" });
  assert.throws(() => validateCatalog(data), /page URL/);
});
test("reject missing references and published references to drafts", () => {
  const data = fixture(); data.companies[0].offerings[0].serviceId = "missing";
  assert.throws(() => validateCatalog(data), /Missing reference/);
  const draft = fixture(); draft.companies[0].status = "draft";
  assert.throws(() => validateCatalog(draft), /references draft/);
});
test("local page requires a published parent service page", () => {
  const data = fixture(); data.pages[0].status = "draft";
  assert.throws(() => validateCatalog(data), /published parent/);
});
test("local listing requires matching service coverage", () => {
  const data = fixture();
  data.locations.push({ ...data.locations[0], id: "other-city", slug: "other-city" });
  data.companies[0].offerings[0].coverage = [{ locationId: "other-city", sourceIds: ["source"] }];
  assert.throws(() => validateCatalog(data), /does not cover/);
});
test("metadata timestamps do not become build timestamps", () => {
  const data = fixture(); data.pages[1].updatedAt = "2026-10-01";
  const pages = getPublicPages(validateCatalog(data), site);
  assert.equal(pages.at(-1)?.updatedAt, "2026-10-07");
});
test("Markdown frontmatter is loaded and validated from files", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "director-content-"));
  try {
    for (const folder of ["services", "counties", "locations", "companies", "pages"]) await mkdir(path.join(root, folder));
    const data = fixture();
    for (const key of ["services", "counties", "locations", "companies"] as const) {
      for (const entry of data[key]) await writeFile(path.join(root, key, `${entry.id}.json`), JSON.stringify(entry));
    }
    for (const page of data.pages) {
      const { body, ...metadata } = page;
      await writeFile(path.join(root, "pages", `${page.id}.md`), `---\n${JSON.stringify(metadata)}\n---\n${body}`);
    }
    assert.equal((await loadCatalog(root)).pages.length, 3);
  } finally { await rm(root, { recursive: true, force: true }); }
});
test("Markdown disallows H1, raw HTML and javascript links", () => {
  assert.throws(() => renderMarkdown("# A second H1"), /H2/);
  const html = renderMarkdown('<script>alert(1)</script>\n\n[Bad](javascript:alert(1))');
  assert(!html.includes("<script>"));
  assert(!html.includes('href="javascript:'));
});

test("reject missing sources and invalid verification dates", () => {
  const data = fixture(); data.companies[0].offerings[0].coverage[0].sourceIds = ["missing"];
  assert.throws(() => validateCatalog(data), /source evidence/);
  const missing = fixture(); missing.companies[0].sources = []; assert.throws(() => validateCatalog(missing));
  const future = fixture(); future.companies[0].sources[0].checkedAt = "2999-01-01"; assert.throws(() => validateCatalog(future), /Future/);
  const noDate = fixture(); noDate.companies[0].sources[0].checkedAt = ""; assert.throws(() => validateCatalog(noDate));
});
test("index gate requires review and at least three sourced companies", () => {
  const data = fixture(); data.pages[1].indexStatus = "index";
  assert.throws(() => validateCatalog(data), /review/);
  data.pages[1].editorialReviewed = true; assert.throws(() => validateCatalog(data), /three/);
  for (const id of ["second", "third"]) data.companies.push({ ...data.companies[0], id, slug: id, name: id, seo: { title: id, description: id } });
  if (data.pages[1].kind === "local") data.pages[1].companyIds = data.companies.map(c => c.id);
  assert.doesNotThrow(() => validateCatalog(data));
});
test("reject duplicate titles, H1 and unsupported claims", () => {
  const titles = fixture(); titles.pages[1].seo.title = titles.pages[0].seo.title; assert.throws(() => validateCatalog(titles), /title/);
  const h1 = fixture(); h1.pages[1].title = h1.pages[0].title; assert.throws(() => validateCatalog(h1), /H1/);
  const bad = fixture(); bad.companies[0].description = "Cea mai bună firmă"; assert.throws(() => validateCatalog(bad), /Forbidden/);
});
test("duplicate local editorial copy blocks publication", () => {
  const data = fixture(); const first = data.pages[1]; assert.equal(first.kind, "local");
  if (first.kind !== "local") return;
  data.locations.push({ ...data.locations[0], id: "other-city", slug: "other-city" });
  data.companies[0].offerings[0].coverage.push({ locationId: "other-city", sourceIds: ["source"] });
  data.pages.push({ ...first, id: "other-page", slug: "other-page", title: "Alt oraș", seo: { title: "Alt oraș", description: "Altă descriere" }, locationId: "other-city" });
  assert.throws(() => validateCatalog(data), /similarity/);
  assert.equal(similarity("unu doi trei patru cinci", "unu doi trei patru cinci"), 1);
  assert(similarity("unu doi trei patru cinci", "alte vorbe fara legatura aici") < .8);
});
