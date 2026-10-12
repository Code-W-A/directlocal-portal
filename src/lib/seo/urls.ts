import type { Company, Location, Service, County, Catalog, ContentPage } from "../content/schemas";
export const servicePath = (service: Pick<Service, "slug">) => `/servicii/${service.slug}/`;
export const countyPath = (service: Pick<Service, "slug">, county: Pick<County, "slug">) => `${servicePath(service)}${county.slug}/`;
export const localPath = (service: Pick<Service, "slug">, county: Pick<County, "slug">, location: Pick<Location, "slug">) => `${countyPath(service, county)}${location.slug}/`;
export const companyPath = (company: Pick<Company, "slug">) => `/firme/${company.slug}/`;
export function contentPath(page: ContentPage, catalog: Catalog): string {
  if (page.kind === "editorial") return `/${page.slug}/`;
  const service = catalog.services.find(s => s.id === page.serviceId)!;
  if (page.kind === "service") return servicePath(service);
  if (page.kind === "county") return countyPath(service, catalog.counties.find(c => c.id === page.countyId)!);
  const city = catalog.locations.find(l => l.id === page.locationId)!;
  return localPath(service, catalog.counties.find(c => c.id === city.countyId)!, city);
}
export function absoluteUrl(path: string, origin: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) throw new Error("Expected a local absolute path.");
  return new URL(path, origin).href;
}
