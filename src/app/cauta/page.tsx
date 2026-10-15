import { loadCatalog } from "@/lib/content/load";
import { buildSearchIndex } from "@/lib/content/search";
import { metadataFor } from "@/lib/content/public";
import { RomaniaMap } from "@/components/ui/RomaniaMap";
import { Search } from "@/components/directory/Search";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import styles from "@/components/directory/search.module.css";
export async function generateMetadata() { return metadataFor("/cauta/"); }
export default async function Page() {
  // Build-time serialization only: no API, browser fetch or search service.
  const rows = buildSearchIndex(await loadCatalog());
  return <article className={`container ${styles.page}`}>
    <Breadcrumbs items={[{ label: "Acasă", href: "/" }, { label: "Caută", href: "/cauta/" }]} />
    <header className={styles.intro}><div><h1>Caută o firmă</h1><p>Alege serviciul și zona care te interesează. Consultă informațiile din profil și contactează direct firma.</p></div><div className={styles.introMap}><RomaniaMap /></div></header>
    <Search rows={rows} />
  </article>;
}
