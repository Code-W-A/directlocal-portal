import Link from "next/link";
import type { Company, ContentPage, Location, Service, County } from "@/lib/content/schemas";
import { localPath, countyPath, servicePath } from "@/lib/seo/urls";
import { CompanyList } from "@/components/directory/CompanyList";
import { EditorialPage } from "./EditorialPage";
export function LocalServicePage({ page, service, county, location, companies }: { page: Extract<ContentPage, { kind: "local" }>; service: Service; county: County; location: Location; companies: Company[] }) {
  return <><EditorialPage page={page} crumbs={[{ label: "Acasă", href: "/" }, { label: "Servicii", href: "/servicii/" }, { label: service.name, href: servicePath(service) }, { label: `Județul ${county.name}`, href: countyPath(service, county) }, { label: location.name, href: localPath(service, county, location) }]}>
    <section><h2>Firme care declară serviciul în {location.name}</h2><p>Ordine alfabetică. Listarea nu este o recomandare.</p><CompanyList companies={companies.filter(c => page.companyIds.includes(c.id))} /></section>
  </EditorialPage><div className="container"><p><Link href="/metodologie/">Cum verificăm informațiile</Link></p></div></>;
}
