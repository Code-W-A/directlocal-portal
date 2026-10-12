import { CompanyList } from "@/components/directory/CompanyList";
import { PageLinks } from "@/components/directory/PageLinks";
import type { Catalog, ContentPage } from "@/lib/content/schemas";
import { contentPath, servicePath, countyPath } from "@/lib/seo/urls";
import { EditorialPage } from "./EditorialPage";
import { LocalServicePage } from "./LocalServicePage";
import { ServicePage } from "./ServicePage";
export function ContentView({ page, catalog }: { page: ContentPage; catalog: Catalog }) {
  const path = contentPath(page, catalog);
  if (page.kind === "editorial") return <EditorialPage page={page} crumbs={[{ label: "Acasă", href: "/" }, { label: page.title, href: path }]} />;
  const service = catalog.services.find(s => s.id === page.serviceId)!;
  if (page.kind === "local") {
    const location = catalog.locations.find(l => l.id === page.locationId)!;
    return <LocalServicePage page={page} service={service} location={location} county={catalog.counties.find(c => c.id === location.countyId)!} companies={catalog.companies} />;
  }
  if (page.kind === "service") return <ServicePage page={page} service={service} localPages={catalog.pages.filter(p => p.kind === "county" && p.serviceId === service.id && p.status === "published").map(p => ({ label: p.title, href: contentPath(p, catalog) }))} />;
  const county = catalog.counties.find(c => c.id === page.countyId)!;
  const children = catalog.pages.filter(p => p.kind === "local" && p.serviceId === service.id && p.status === "published" && catalog.locations.find(l => l.id === p.locationId)?.countyId === county.id);
  return <EditorialPage page={page} crumbs={[{ label: "Acasă", href: "/" }, { label: "Servicii", href: "/servicii/" }, { label: service.name, href: servicePath(service) }, { label: `Județul ${county.name}`, href: countyPath(service, county) }]}>
    {page.companyIds.length ? <section><h2>Firme pentru {service.name.toLowerCase()} în {county.name}</h2><CompanyList companies={catalog.companies.filter(c => page.companyIds.includes(c.id))} /></section> : null}
    {children.length ? <section><h2>Localități documentate</h2><PageLinks items={children.map(p => ({ href: contentPath(p, catalog), label: p.title }))} /></section> : null}
  </EditorialPage>;
}
