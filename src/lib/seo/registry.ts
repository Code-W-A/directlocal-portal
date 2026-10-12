import type { Catalog } from "../content/schemas";
import type { SiteConfig } from "../../config/site";
import { companyPath, contentPath } from "./urls";
export type PublicPage = { path: string; title: string; h1: string; description: string; updatedAt: string; indexStatus: "index" | "noindex" };
export function getPublicPages(catalog: Catalog, site: SiteConfig): PublicPage[] {
  const pages: PublicPage[] = [
    { path: "/", title: "Servicii locale, într-un singur loc", h1: "Serviciul potrivit.Mai aproape.", description: site.description, updatedAt: site.homeUpdatedAt, indexStatus: "noindex" },
    { path: "/servicii/", title: "Catalog de servicii locale", h1: "Servicii locale", description: "Explorează serviciile documentate și paginile locale ale directorului.", updatedAt: site.homeUpdatedAt, indexStatus: "noindex" },
    { path: "/cauta/", title: "Caută firme după serviciu și localitate", h1: "Caută o firmă", description: "Filtrează firmele documentate după serviciu, județ și oraș. Consultă profilurile și contactează direct furnizorii.", updatedAt: site.homeUpdatedAt, indexStatus: "noindex" },
  ];
  for (const c of catalog.companies.filter(c => c.status === "published")) pages.push({ path: companyPath(c), ...c.seo, h1: c.name, updatedAt: [c.updatedAt, ...c.sources.map(s => s.checkedAt)].sort().at(-1)!, indexStatus: c.indexStatus });
  for (const p of catalog.pages.filter(p => p.status === "published")) {
    const dates = [p.updatedAt, ...p.sources.map(s => s.checkedAt)];
    if (p.kind !== "editorial") dates.push(catalog.services.find(s => s.id === p.serviceId)!.updatedAt);
    if (p.kind === "county") dates.push(catalog.counties.find(c => c.id === p.countyId)!.updatedAt);
    if (p.kind === "local") {
      const city = catalog.locations.find(l => l.id === p.locationId)!;
      dates.push(city.updatedAt, catalog.counties.find(c => c.id === city.countyId)!.updatedAt);
      for (const id of p.companyIds) { const c = catalog.companies.find(c => c.id === id)!; dates.push(c.updatedAt, ...c.sources.map(s => s.checkedAt)); }
    }
    if (p.kind === "county") for (const id of p.companyIds) { const c = catalog.companies.find(c => c.id === id)!; dates.push(c.updatedAt, ...c.sources.map(s => s.checkedAt)); }
    pages.push({ path: contentPath(p, catalog), ...p.seo, h1: p.title, updatedAt: dates.sort().at(-1)!, indexStatus: p.indexStatus });
  }
  return pages;
}
export function indexablePages(pages: PublicPage[], site: SiteConfig) { return site.indexable && site.url ? pages.filter(p => p.indexStatus === "index") : []; }
