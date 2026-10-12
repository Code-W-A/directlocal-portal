import type { Company } from "@/lib/content/schemas";
import { CompanyCard } from "./CompanyCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { companyPath, absoluteUrl } from "@/lib/seo/urls";
import { site } from "@/config/site";
import styles from "./directory.module.css";
export function CompanyList({ companies }: { companies: Company[] }) {
  const sorted = companies.filter(c => c.status === "published").toSorted((a, b) => a.name.localeCompare(b.name, "ro"));
  return <><div className={styles.list}>{sorted.map(company => <CompanyCard key={company.id} company={company} />)}</div>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: sorted.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: site.url ? absoluteUrl(companyPath(c), site.url) : companyPath(c) })) }} />
  </>;
}
