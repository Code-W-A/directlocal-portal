import type { Catalog } from './schemas';
import { contentPath } from '../seo/urls';
export type HomeDestination = { href: string; serviceId: string; service: string; countyId?: string; county?: string; cityId?: string; city?: string };
export function homeDestinations(catalog: Catalog): HomeDestination[] {
  return catalog.pages.filter(p => p.status === 'published' && p.kind !== 'editorial').map(p => {
    if (p.kind === 'editorial') throw new Error('Editorial pages cannot be search destinations');
    const service = catalog.services.find(s => s.id === p.serviceId)!;
    const city = p.kind === 'local' ? catalog.locations.find(l => l.id === p.locationId) : undefined;
    const county = p.kind === 'county' ? catalog.counties.find(c => c.id === p.countyId) : city ? catalog.counties.find(c => c.id === city.countyId) : undefined;
    return { href: contentPath(p, catalog), serviceId: service.id, service: service.name, ...(county ? { countyId: county.id, county: county.name } : {}), ...(city ? { cityId: city.id, city: city.name } : {}) };
  });
}
export function homeSearchHref(destinations: HomeDestination[], service: string, county: string, city: string) {
  if (!service) return '/cauta/';
  return destinations.find(d => d.serviceId === service && (d.countyId ?? '') === county && (d.cityId ?? '') === city)?.href ?? '/cauta/';
}
