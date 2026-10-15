import { AreaServicePage } from "./AreaServicePage";
import type { Catalog, ContentPage } from "@/lib/content/schemas";
import { contentPath } from "@/lib/seo/urls";
import { EditorialPage } from "./EditorialPage";
import { LocalServicePage } from "./LocalServicePage";
import { ServicePage } from "./ServicePage";
export function ContentView({ page, catalog }: { page: ContentPage; catalog: Catalog }) {
  const path = contentPath(page, catalog);
  if (page.kind === "editorial") return <EditorialPage page={page} crumbs={[{ label: "Acasă", href: "/" }, { label: page.title, href: path }]} />;
  const service = catalog.services.find(s => s.id === page.serviceId)!;
  if (page.kind === "local") return <LocalServicePage page={page} catalog={catalog} />;
  if (page.kind === "service") return <ServicePage page={page} service={service} localPages={catalog.pages.filter(p => p.kind === "county" && p.serviceId === service.id && p.status === "published").map(p => ({ label: p.title, county: catalog.counties.find(c => p.kind === "county" && c.id === p.countyId)!.name, href: contentPath(p, catalog) }))} />;
  return <AreaServicePage page={page} catalog={catalog} />;
}
