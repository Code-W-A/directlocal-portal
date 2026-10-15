import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ContactForm } from "@/components/contact/ContactForm";
import { CompanyIdentity } from "@/components/directory/CompanyIdentity";
import { companyAreas } from "@/lib/content/areas";
import Link from "next/link";
import type { Company, Catalog } from "@/lib/content/schemas";
import { companyPath, contentPath, servicePath, absoluteUrl } from "@/lib/seo/urls";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import { Icon } from "@/components/ui/Icon";
import styles from "./company.module.css";
export function CompanyPage({ company, catalog }: { company: Company; catalog: Catalog }) {
  const checkedAt = company.sources.map(source => source.checkedAt).sort()[0];
  const areas = companyAreas(company, catalog);
  const hq = company.headquarters;
  const offerings = company.offerings.map(offering => ({
    ...offering,
    service: catalog.services.find(service => service.id === offering.serviceId)!,
  }));
  const relatedPages = catalog.pages.filter(page => (page.kind === "local" || page.kind === "county") && page.status === "published" && page.companyIds.includes(company.id));
  const phoneHref = company.phone ? `tel:${company.phone.replace(/[^+\d]/g, "")}` : undefined;
  return <article className={styles.page}>
    <header className={styles.hero}>
      <div className="container">
        <Breadcrumbs items={[{ label: "Acasă", href: "/" }, { label: "Firme", href: "/cauta/" }, { label: company.name, href: companyPath(company) }]} />
        <div className={styles.heroCopy}><p className={styles.eyebrow}>PROFIL DE FIRMĂ</p>
        <CompanyIdentity serviceIds={company.offerings.map(offering => offering.serviceId)}><h1>{company.name}</h1></CompanyIdentity>
        <p className={styles.intro}>{company.description}</p>
        <ul className={styles.tags} aria-label="Servicii documentate">
          {offerings.map(({ service }) => <li key={service.id}>{catalog.pages.some(p => p.kind === "service" && p.serviceId === service.id && p.status === "published") ? <Link href={servicePath(service)}><ServiceIcon serviceIds={[service.id]} />{service.name}</Link> : service.name}</li>)}
        </ul>
        <p className={styles.heroArea}><Icon name="pin" />{areas.map(area => area.name).join(" · ")}</p>
        {phoneHref ? <a href={phoneHref} className="button"><Icon name="phone" />{company.phone}</a> : null}
        {company.sponsored ? <p className={styles.sponsored}>Sponsorizat</p> : null}
        </div>
      </div>
    </header>
    <div className={`container ${styles.content}`}>
      <div className={styles.overview}>
        <section className={`${styles.card} ${styles.contact}`} aria-labelledby="contact-title">
          <span className={styles.icon}><Icon name={company.phone ? "phone" : company.email ? "mail" : "arrow"} /></span>
          <h2 id="contact-title">Contactează firma</h2>
          <p>Discută direct cu furnizorul despre preț, disponibilitate și detaliile lucrării.</p>
          {company.phone ? <>
            <a className={styles.phone} href={phoneHref}>{company.phone}</a>
            <a className={`button ${styles.call}`} href={phoneHref}><Icon name="phone" />Sună firma</a>
          </> : null}
          {company.website ? <a className={styles.secondary} href={company.website} rel="external">Website-ul firmei<Icon name="arrow" /></a> : null}
          {company.email ? <a className={styles.secondary} href={`mailto:${company.email}`}><Icon name="mail" />{company.email}</a> : null}
        </section>
        <section className={`${styles.card} ${styles.services}`} aria-labelledby="services-title">
          <div className={styles.heading}><span className={styles.icon}><Icon name="company" /></span><h2 id="services-title">Servicii și localități deservite</h2></div>
          <ul className={styles.offerings}>{offerings.map(offering => <li key={offering.serviceId}>
            <h3><ServiceIcon serviceIds={[offering.service.id]} />{offering.service.name}</h3>
            {offering.coverage.length ? <><p className={styles.label}>Localități declarate</p><ul className={styles.coverage}>{offering.coverage.map(area => <li key={area.locationId}><Icon name="pin" />{catalog.locations.find(location => location.id === area.locationId)!.name}</li>)}</ul></> : null}
            {offering.countyCoverage.length ? <><p className={styles.label}>Acoperire județeană declarată</p><ul className={styles.coverage}>{offering.countyCoverage.map(area => <li key={area.countyId}><Icon name="pin" />Județul {catalog.counties.find(county => county.id === area.countyId)!.name}</li>)}</ul><p className={styles.note}>Confirmă localitatea exactă direct cu firma.</p></> : null}
          </li>)}</ul>
          <p className={styles.coverageNote}>Acoperirea este declarată pe website. Confirmă unde se desfășoară serviciul și oferta.</p>
        </section>
      </div>
      {company.email ? <section id="mesaj" aria-labelledby="message-title"><h2 id="message-title">Trimite mesaj către {company.name}</h2><ContactForm type="company-message" companyId={company.id} companyName={company.name} fallbackEmail={company.email} page={companyPath(company)} /></section> : null}
      <section className={styles.card} aria-labelledby="hq-title">
        <div className={styles.heading}><span className={styles.icon}><Icon name="city" /></span><h2 id="hq-title">{hq?.kind === "workplace" ? "Punct de lucru declarat" : "Sediu declarat"}</h2></div>
        {hq ? <><p className={styles.address}>{hq.street ? `${hq.street}, ` : ""}{hq.locality}, {hq.county}.</p>{!hq.street ? <p className={styles.note}>Adresa stradală nu este confirmată în director.</p> : null}</> : <p className={styles.note}>Localitatea sediului nu este confirmată.</p>}
        <p className={styles.note}>Adresa declarată este distinctă de zona pentru care firma oferă serviciul.</p>
      </section>
      {relatedPages.length ? <section className={styles.related} aria-labelledby="related-title">
        <h2 id="related-title">Pagini asociate</h2>
        <ul>{relatedPages.map(page => <li key={page.id}><Link href={contentPath(page, catalog)}><ServiceIcon serviceIds={[page.kind !== "editorial" ? page.serviceId : ""]} /><span>{page.title}</span><Icon name="arrow" /></Link></li>)}</ul>
      </section> : null}
      <section className={styles.profileMeta} aria-label="Data consultării și corecturi">
        <p>Date consultate la <time dateTime={checkedAt}>{checkedAt.split("-").reverse().join(".")}</time></p>
        <a href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(`Corectură: ${companyPath(company)}`)}`}>Propune o corectură<Icon name="arrow" /></a>
      </section>
    </div>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "LocalBusiness", ...(site.url ? { "@id": absoluteUrl(companyPath(company), site.url) + "#business" } : {}), name: company.name, description: company.description, ...(company.website ? { url: company.website } : {}), ...(company.phone ? { telephone: company.phone } : {}), ...(company.email ? { email: company.email } : {}), ...(hq ? { address: { "@type": "PostalAddress", addressLocality: hq.locality, addressRegion: hq.county, addressCountry: "RO", ...(hq.street ? { streetAddress: hq.street } : {}) } } : {}), areaServed: areas }} />
  </article>;
}
