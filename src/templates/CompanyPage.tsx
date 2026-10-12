import Link from "next/link";
import type { Company, Catalog } from "@/lib/content/schemas";
import { companyPath, contentPath } from "@/lib/seo/urls";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Sources } from "@/components/directory/Sources";
import styles from "./templates.module.css";
export function CompanyPage({ company, catalog }: { company: Company; catalog: Catalog }) {
  const areas = catalog.locations.filter(l => company.offerings.some(o => o.coverage.some(a => a.locationId === l.id)));
  const hq = company.headquarters;
  return <article className={`container ${styles.page}`}>
    <Breadcrumbs items={[{ label: "Acasă", href: "/" }, { label: company.name, href: companyPath(company) }]} />
    <h1>{company.name}</h1><p className="prose">{company.description}</p>{company.sponsored ? <p>Sponsorizat</p> : null}
    <h2>Date de contact</h2><ul>
      {company.phone ? <li><a href={`tel:${company.phone.replace(/[ ()-]/g, "")}`}>{company.phone}</a></li> : null}
      {company.email ? <li><a href={`mailto:${company.email}`}>{company.email}</a></li> : null}
      {company.website ? <li><a href={company.website} rel="external">Website-ul firmei</a></li> : null}
    </ul>
    <h2>Sediu declarat</h2>{hq ? <p>{hq.street ? `${hq.street}, ` : ""}{hq.locality}, județul {hq.county}.{!hq.street ? " Adresa stradală nu este confirmată în director." : ""}</p> : <p>Localitatea sediului nu este confirmată.</p>}
    <h2>Servicii și localități deservite</h2><ul>{company.offerings.map(o => <li key={o.serviceId}>{catalog.services.find(s => s.id === o.serviceId)!.name}: {o.coverage.map(a => catalog.locations.find(l => l.id === a.locationId)!.name).join(", ")}</li>)}</ul>
    <p>Acoperirea este declarată pe website. Confirmă direct deplasarea și oferta. Listarea nu reprezintă o recomandare; denumirea afișată este comercială.</p>
    <ul>{catalog.pages.filter(p => p.kind === "local" && p.status === "published" && p.companyIds.includes(company.id)).map(p => <li key={p.id}><Link href={contentPath(p, catalog)}>{p.title}</Link></li>)}</ul>
    <Sources sources={company.sources} path={companyPath(company)} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "LocalBusiness", name: company.name, description: company.description, ...(company.website ? { url: company.website } : {}), ...(company.phone ? { telephone: company.phone } : {}), ...(company.email ? { email: company.email } : {}), ...(hq ? { address: { "@type": "PostalAddress", addressLocality: hq.locality, addressRegion: hq.county, addressCountry: "RO", ...(hq.street ? { streetAddress: hq.street } : {}) } } : {}), areaServed: areas.map(l => ({ "@type": "City", name: l.name })) }} />
  </article>;
}
