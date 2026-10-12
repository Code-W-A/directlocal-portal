import type { Catalog, Company } from "./schemas";
export function companyAreas(company: Company, catalog: Catalog) {
  return [
    ...catalog.locations.filter(l => company.offerings.some(o => o.coverage.some(a => a.locationId === l.id))).map(l => ({ "@type": "City", name: l.name })),
    ...catalog.counties.filter(c => company.offerings.some(o => o.countyCoverage.some(a => a.countyId === c.id))).map(c => ({ "@type": "AdministrativeArea", name: c.name })),
  ];
}
