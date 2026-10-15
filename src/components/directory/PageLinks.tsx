import { ServiceIcon } from "@/components/ui/ServiceIcon";
import Link from "next/link";
import { site } from "@/config/site";
import { absoluteUrl } from "@/lib/seo/urls";
import { JsonLd } from "@/components/seo/JsonLd";
export function PageLinks({ items, serviceId }: { items: { href: string; label: string }[]; serviceId?: string }) {
  return <><ul data-item-list>{items.map(p => <li key={p.href}><Link href={p.href}>{serviceId ? <ServiceIcon serviceIds={[serviceId]} /> : null}{p.label}</Link></li>)}</ul>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.label, url: site.url ? absoluteUrl(p.href, site.url) : p.href })) }} />
  </>;
}
