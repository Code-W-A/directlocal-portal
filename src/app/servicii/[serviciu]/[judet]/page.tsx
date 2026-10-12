import { loadCatalog } from "@/lib/content/load";
import { contentPath } from "@/lib/seo/urls";
import { contentFor, metadataFor } from "@/lib/content/public";
import { ContentView } from "@/templates/ContentView";
export const dynamicParams = false;
type Props = { params: Promise<{ serviciu: string; judet: string }> };
export async function generateStaticParams() {
  const catalog = await loadCatalog();
  return catalog.pages.filter(p => p.kind === "county" && p.status === "published").map(p => { const parts = contentPath(p, catalog).split("/").filter(Boolean); return { serviciu: parts[1], judet: parts[2] }; });
}
export async function generateMetadata({ params }: Props) { const p = await params; return metadataFor(`/servicii/${p.serviciu}/${p.judet}/`); }
export default async function Page({ params }: Props) { const p = await params; return <ContentView {...await contentFor(`/servicii/${p.serviciu}/${p.judet}/`)} />; }
