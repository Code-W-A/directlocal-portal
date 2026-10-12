import Link from "next/link";
import { site } from "@/config/site";
import { absoluteUrl } from "@/lib/seo/urls";
import { JsonLd } from "./JsonLd";
import styles from "./seo.module.css";
export type Crumb = { label: string; href: string };
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return <>
    <nav aria-label="Fir de navigare"><ol className={styles.breadcrumbs}>
      {items.map((item, index) => <li key={item.href}>{index === items.length - 1 ? <span aria-current="page">{item.label}</span> : <Link href={item.href}>{item.label}</Link>}</li>)}
    </ol></nav>
    {<JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, item: site.url ? absoluteUrl(item.href, site.url) : item.href })) }} />}
  </>;
}
