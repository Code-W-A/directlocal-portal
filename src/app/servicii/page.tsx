import { PageLinks } from "@/components/directory/PageLinks";
import { loadCatalog } from "@/lib/content/load";
import { metadataFor } from "@/lib/content/public";
import { contentPath } from "@/lib/seo/urls";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
export async function generateMetadata() { return metadataFor("/servicii/"); }
export default async function Page() {
  const catalog = await loadCatalog();
  return <article className="container content-page"><Breadcrumbs items={[{ label: "Acasă", href: "/" }, { label: "Servicii", href: "/servicii/" }]} /><h1>Servicii locale</h1><p>Alege serviciul pentru a vedea județele și localitățile documentate.</p><PageLinks items={catalog.pages.filter(p => p.kind === "service" && p.status === "published").map(p => ({ href: contentPath(p, catalog), label: p.title }))} /></article>;
}
