import test from "node:test";
import assert from "node:assert/strict";
import { loadCatalog } from "../src/lib/content/load";
import { serviceDirectoryEntries } from "../src/lib/content/service-directory";

test("directory omits unpublished service destinations and counties", async () => {
  const catalog = await loadCatalog();
  const baseline = serviceDirectoryEntries(catalog);
  assert(baseline.length > 0 && baseline[0].counties.length > 0);
  const countyDraft = structuredClone(catalog);
  const countyPage = countyDraft.pages.find(p => p.kind === "county" && p.serviceId === baseline[0].id)!;
  countyPage.status = "draft";
  assert.equal(serviceDirectoryEntries(countyDraft)[0].counties.length, baseline[0].counties.length - 1);
  const pageDraft = structuredClone(catalog);
  pageDraft.pages.find(p => p.kind === "service" && p.serviceId === baseline[0].id)!.status = "draft";
  assert(!serviceDirectoryEntries(pageDraft).some(s => s.id === baseline[0].id));
  const serviceDraft = structuredClone(catalog);
  serviceDraft.services.find(s => s.id === baseline[0].id)!.status = "draft";
  assert(!serviceDirectoryEntries(serviceDraft).some(s => s.id === baseline[0].id));
});
