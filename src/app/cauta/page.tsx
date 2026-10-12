import { loadCatalog } from "@/lib/content/load";
import { buildSearchIndex } from "@/lib/content/search";
import { metadataFor } from "@/lib/content/public";
import { Search } from "@/components/directory/Search";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
export async function generateMetadata() { return metadataFor("/cauta/"); }
export default async function Page() {
  // Build-time serialization only: no API, browser fetch or search service.
  const rows = buildSearchIndex(await loadCatalog());
  return <article className="container content-page"><Breadcrumbs items={[{ label: "Acasă", href: "/" }, { label: "Caută", href: "/cauta/" }]} /><h1>Caută o firmă</h1><p>Filtrează catalogul documentat. Rezultatele sunt ordonate alfabetic.</p><Search rows={rows} /></article>;
}
