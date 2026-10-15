import { companySchema, countySchema, locationSchema, pageSchema, serviceSchema, type Catalog } from "./schemas";
import { companyPath, contentPath } from "../seo/urls";
import { renderMarkdown } from "./markdown";
const normalize = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export function similarity(a: string, b: string): number {
  function shingles(s: string) { const words = normalize(s).split(/\s+/); return new Set(words.length < 5 ? [words.join(" ")] : words.slice(0, -4).map((_, i) => words.slice(i, i + 5).join(" "))); }
  const aa = shingles(a), bb = shingles(b);
  return [...aa].filter(s => bb.has(s)).length / new Set([...aa, ...bb]).size;
}
export function validateCatalog(input: { services: unknown[]; counties: unknown[]; locations: unknown[]; companies: unknown[]; pages: unknown[] }): Catalog {
  const catalog: Catalog = { services: input.services.map(v => serviceSchema.parse(v)), counties: input.counties.map(v => countySchema.parse(v)), locations: input.locations.map(v => locationSchema.parse(v)), companies: input.companies.map(v => companySchema.parse(v)), pages: input.pages.map(v => pageSchema.parse(v)) };
  function unique(values: string[], label: string) { if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label}.`); }
  function ref<T extends { id: string; status: string }>(items: T[], id: string, published: boolean): T {
    const item = items.find(e => e.id === id);
    if (!item) throw new Error(`Missing reference: ${id}.`);
    if (published && item.status !== "published") throw new Error(`Published content references draft: ${id}.`);
    return item;
  }
  for (const [kind, entries] of Object.entries(catalog)) {
    unique(entries.map(e => e.id), `${kind} ID`);
    unique(entries.map(e => "countyId" in e && !('kind' in e) ? `${e.countyId}/${e.slug}` : e.slug), `${kind} slug`);
  }
  for (const l of catalog.locations) ref(catalog.counties, l.countyId, l.status === "published");
  for (const c of catalog.companies) {
    if (c.indexStatus === "index" && (!c.editorialReviewed || !c.reviewNote)) throw new Error(`Index requires documented editorial review: ${c.id}`);
    unique(c.sources.map(s => s.id), `sources in ${c.id}`);
    const sources = new Set(c.sources.map(s => s.id));
    function evidence(ids: string[] | undefined) { if (!ids?.length || ids.some(id => !sources.has(id))) throw new Error(`Missing source evidence in ${c.id}.`); }
    evidence(c.evidence.name); evidence(c.evidence.description);
    for (const field of ["website", "phone", "email"] as const) if (c[field]) evidence(c.evidence[field]);
    if (c.headquarters) evidence(c.headquarters.sourceIds);
    unique(c.offerings.map(o => o.serviceId), `offerings in ${c.id}`);
    for (const o of c.offerings) {
      ref(catalog.services, o.serviceId, c.status === "published"); evidence(o.sourceIds);
      if (!o.coverage.length && !o.countyCoverage.length) throw new Error(`Missing coverage: ${c.id}`);
      unique(o.countyCoverage.map(a => a.countyId), `county coverage in ${c.id}`);
      for (const a of o.countyCoverage) { ref(catalog.counties, a.countyId, c.status === "published"); evidence(a.sourceIds); }
      unique(o.coverage.map(a => a.locationId), `coverage in ${c.id}`);
      for (const a of o.coverage) { ref(catalog.locations, a.locationId, c.status === "published"); evidence(a.sourceIds); }
    }
  }
  for (const p of catalog.pages) {
    const published = p.status === "published";
    renderMarkdown(p.body);
    if (p.indexStatus === "index" && (!p.editorialReviewed || !p.reviewNote)) throw new Error(`Index requires editorial review: ${p.id}`);
    if (p.kind === "editorial") {
      if (!["despre-noi", "contact", "metodologie", "inscriere-firma"].includes(p.slug)) throw new Error(`Unsupported editorial route: ${p.slug}`);
      if (p.about && p.slug !== "despre-noi") throw new Error(`About layout belongs to despre-noi: ${p.id}`);
      if (published && p.slug === "despre-noi" && !p.about) throw new Error(`About page needs structured content: ${p.id}`);
      continue;
    }
    ref(catalog.services, p.serviceId, published);
    if (p.kind === "service") continue;
    if (published && !catalog.pages.some(parent => parent.kind === "service" && parent.serviceId === p.serviceId && parent.status === "published")) throw new Error(`Needs published parent service: ${p.id}`);
    if (p.kind === "county") {
      ref(catalog.counties, p.countyId, published);
      unique(p.companyIds, `company references in ${p.id}`);
      if (p.indexStatus === "index" && !p.companyIds.length) throw new Error(`Index requires a sourced company: ${p.id}`);
      for (const id of p.companyIds) {
        const c = ref(catalog.companies, id, published);
        if (!c.offerings.some(o => o.serviceId === p.serviceId && (o.countyCoverage.some(a => a.countyId === p.countyId) || o.coverage.some(a => catalog.locations.find(l => l.id === a.locationId)?.countyId === p.countyId)))) throw new Error(`Company ${id} does not cover ${p.id}`);
      }
      continue;
    }
    const location = ref(catalog.locations, p.locationId, published);
    if (published && !catalog.pages.some(parent => parent.kind === "county" && parent.serviceId === p.serviceId && parent.countyId === location.countyId && parent.status === "published")) throw new Error(`Needs published parent county: ${p.id}`);
    unique(p.companyIds, `company references in ${p.id}`);
    if (p.indexStatus === "index" && !p.companyIds.length) throw new Error(`Index requires a sourced company: ${p.id}`);
    for (const id of p.companyIds) {
      const c = ref(catalog.companies, id, published);
      if (!c.offerings.some(o => o.serviceId === p.serviceId && o.coverage.some(a => a.locationId === p.locationId))) throw new Error(`Company ${id} does not cover ${p.id}`);
    }
    const count = p.intro.split(/\s+/).length;
    if (count < 20 || count > 60) throw new Error(`Local introduction needs 20–60 words: ${p.id}`);
  }
  unique([...catalog.companies.map(companyPath), ...catalog.pages.map(p => contentPath(p, catalog))], "page URL");
  const visible = [...catalog.companies, ...catalog.pages].filter(p => p.status === "published");
  unique(visible.map(p => normalize(p.seo.title)), "title"); unique(visible.map(p => normalize(p.seo.description)), "description");
  unique(visible.map(p => normalize("title" in p ? p.title : p.name)), "H1");
  for (const p of visible) {
    const copy = "body" in p ? `${p.title} ${p.intro} ${p.body} ${p.seo.title} ${p.seo.description} ${p.kind === "editorial" && p.about ? JSON.stringify(p.about) : ""}` : `${p.name} ${p.description} ${p.seo.title} ${p.seo.description}`;
    if (/\b(cea mai buna|cel mai bun|cei mai buni|cele mai bune|garantat|100 procent)\b/.test(normalize(copy))) throw new Error(`Forbidden claim: ${p.id}`);
    const dates = [p.updatedAt, ...p.sources.map(s => s.checkedAt)];
    if (dates.some(d => d > new Date().toISOString().slice(0, 10))) throw new Error(`Future verification date: ${p.id}`);
  }
  const local = catalog.pages.filter(p => (p.kind === "local" || p.kind === "county") && p.status === "published");
  for (let i = 0; i < local.length; i++) for (let j = i + 1; j < local.length; j++) {
    if (similarity(`${local[i].intro} ${local[i].body}`, `${local[j].intro} ${local[j].body}`) >= 0.8) throw new Error(`Excessive geographic similarity: ${local[i].id}, ${local[j].id}`);
  }
  return catalog;
}
