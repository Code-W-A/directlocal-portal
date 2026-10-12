import Link from "next/link";
import { site } from "@/config/site";
import { absoluteUrl } from "@/lib/seo/urls";
import { JsonLd } from "@/components/seo/JsonLd";
export function PageLinks({ items }: { items: { href: string; label: string }[] }) {
  return <><ul data-item-list>{items.map(p => <li key={p.href}><Link href={p.href}>{p.label}</Link></li>)}</ul>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.label, url: site.url ? absoluteUrl(p.href, site.url) : p.href })) }} />
  </>;
}
