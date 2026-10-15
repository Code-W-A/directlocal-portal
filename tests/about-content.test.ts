import test from "node:test";
import assert from "node:assert/strict";
import { loadCatalog } from "../src/lib/content/load";
import { validateCatalog } from "../src/lib/content/validate";

test("platform content can omit unrelated external sources while provider evidence stays required", async () => {
  const catalog = await loadCatalog();
  const page = catalog.pages.find(p => p.slug === "despre-noi");
  assert(page?.kind === "editorial" && page.about);
  assert.equal(page.indexStatus, "index");
  assert.deepEqual(page.sources, []);
  const missingCompanyEvidence = structuredClone(catalog);
  missingCompanyEvidence.companies[0].sources = [];
  assert.throws(() => validateCatalog(missingCompanyEvidence));
  const missingServiceEvidence = structuredClone(catalog);
  missingServiceEvidence.pages.find(p => p.kind === "service")!.sources = [];
  assert.throws(() => validateCatalog(missingServiceEvidence));
});

test("content validation also rejects unsupported claims in about cards", async () => {
  const catalog = await loadCatalog();
  const page = catalog.pages.find(p => p.slug === "despre-noi");
  assert(page?.kind === "editorial" && page.about);
  page.about.principles.items[0].description = "Cei mai buni furnizori.";
  assert.throws(() => validateCatalog(catalog), /Forbidden claim/);
});
