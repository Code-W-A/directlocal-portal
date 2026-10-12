import { PageLinks } from "@/components/directory/PageLinks";
import type { ContentPage, Service } from "@/lib/content/schemas";
import { servicePath } from "@/lib/seo/urls";
import { EditorialPage } from "./EditorialPage";
export function ServicePage({ page, service, localPages }: { page: Extract<ContentPage, { kind: "service" }>; service: Service; localPages: { label: string; href: string }[] }) {
  return <EditorialPage page={page} crumbs={[{ label: "Acasă", href: "/" }, { label: "Servicii", href: "/servicii/" }, { label: service.name, href: servicePath(service) }]}>
    {localPages.length ? <section><h2>Județe documentate</h2><PageLinks items={localPages} /></section> : null}
  </EditorialPage>;
}
