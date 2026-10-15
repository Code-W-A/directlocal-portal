import Link from "next/link";
import { buildSearchIndex } from "@/lib/content/search";
import type { Company, Catalog } from "@/lib/content/schemas";
import { CompanyCard } from "./CompanyCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { companyPath, absoluteUrl } from "@/lib/seo/urls";
import { site } from "@/config/site";
import styles from "./directory.module.css";
export function CompanyList({ companies, catalog }: { companies: Company[]; catalog: Catalog }) {
  const sorted = companies.filter(c => c.status === "published").toSorted((a, b) => a.name.localeCompare(b.name, "ro"));
  const rows = buildSearchIndex(catalog);
  return <><div className={styles.list}>{sorted.map(company => <CompanyCard key={company.id} row={rows.find(row => row.id === company.id)!} />)}</div>
    <p>Reprezinți o firmă? <Link href="/inscriere-firma/">Înscrie firma pentru verificare</Link>.</p>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: sorted.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: site.url ? absoluteUrl(companyPath(c), site.url) : companyPath(c) })) }} />
  </>;
}
