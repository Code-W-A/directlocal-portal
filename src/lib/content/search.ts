import type { Catalog } from "./schemas";
import { companyPath } from "../seo/urls";
export type SearchRow = { id: string; name: string; href: string; description: string; imageId?: string; phone?: string; email?: string; checkedAt?: string; sponsored?: boolean; coverage: { serviceId: string; service: string; countyId: string; county: string; cityId?: string; city?: string }[] };
export type Filters = { service: string; county: string; city: string; query: string };
const normalize = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
export function buildSearchIndex(catalog: Catalog): SearchRow[] {
  return catalog.companies.filter(c => c.status === "published").map(c => ({ id: c.id, name: c.name, href: companyPath(c), description: c.description, imageId: c.imageId, phone: c.phone, email: c.email, sponsored: c.sponsored, checkedAt: c.sources.map(s => s.checkedAt).sort()[0], coverage: c.offerings.flatMap(o => [...o.coverage.map(a => {
    const city = catalog.locations.find(l => l.id === a.locationId)!;
    const county = catalog.counties.find(x => x.id === city.countyId)!;
    return { serviceId: o.serviceId, service: catalog.services.find(s => s.id === o.serviceId)!.name, countyId: county.id, county: county.name, cityId: city.id, city: city.name };
  }), ...o.countyCoverage.map(a => {
    const county = catalog.counties.find(c => c.id === a.countyId)!;
    return { serviceId: o.serviceId, service: catalog.services.find(s => s.id === o.serviceId)!.name, countyId: county.id, county: county.name };
  })]) })).sort((a, b) => a.name.localeCompare(b.name, "ro"));
}
export function filterSearch(rows: SearchRow[], filters: Filters) {
  return rows.filter(row => normalize(`${row.name} ${row.description}`).includes(normalize(filters.query)) && row.coverage.some(a => (!filters.service || a.serviceId === filters.service) && (!filters.county || a.countyId === filters.county) && (!filters.city || a.cityId === filters.city)));
}
