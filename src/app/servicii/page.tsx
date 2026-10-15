import { ServiceIcon } from "@/components/ui/ServiceIcon";
import Link from "next/link";
import { loadCatalog } from "@/lib/content/load";
import { serviceDirectoryCopy as copy, serviceDirectoryEntries } from "@/lib/content/service-directory";
import { metadataFor } from "@/lib/content/public";
import { absoluteUrl } from "@/lib/seo/urls";
import { site } from "@/config/site";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/Icon";
import styles from "./services.module.css";
export async function generateMetadata() { return metadataFor("/servicii/"); }
export default async function Page() {
  const services = serviceDirectoryEntries(await loadCatalog());
  return <article className={styles.page}>
    <div className={styles.heroBand}><div className={`container ${styles.heroContainer}`}>
      <Breadcrumbs items={[{ label: "Acasă", href: "/" }, { label: "Servicii", href: "/servicii/" }]} />
      <div className={styles.hero}><div><h1>{copy.title}</h1><p>{copy.intro}</p></div><Link className="button" href="/cauta/"><Icon name="search" />{copy.searchLabel}</Link></div>
    </div></div>
    <div className={`container ${styles.content}`}>
      <section aria-labelledby="catalog-title"><h2 id="catalog-title">{copy.catalogTitle}</h2>
        {services.length ? <>
          <ul className={styles.serviceList} data-item-list>{services.map(service => <li className={styles.serviceCard} key={service.id}>

            <div className={styles.serviceCopy}>
              <div className={styles.serviceHeading}><span className={styles.roundIcon}><ServiceIcon serviceIds={[service.id]} /></span><span className={styles.catalogLabel}>SERVICIU LOCAL</span></div>
              <h3><Link data-list-entry href={service.href} aria-label={service.pageTitle}>{service.name}</Link></h3>
              <p>{service.summary}</p>
              {service.counties.length ? <div className={styles.coverage}><h4>{copy.countiesLabel}</h4><ul className={styles.counties}>{service.counties.map(county => <li key={county.href}><Link href={county.href}><Icon name="pin" />{county.name}<Icon name="arrow" /></Link></li>)}</ul></div> : null}
              <Link className={`button ${styles.serviceButton}`} href={service.href}>{copy.serviceLabel}<Icon name="arrow" /></Link>
            </div>
          </li>)}</ul>
          <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: services.map((service, index) => ({ "@type": "ListItem", position: index + 1, name: service.name, url: site.url ? absoluteUrl(service.href, site.url) : service.href })) }} />
        </> : <p className={styles.empty}>{copy.emptyMessage}</p>}
      </section>
      <section className={styles.guide} aria-labelledby="guide-title"><div className={styles.guideHeading}><h2 id="guide-title">{copy.guide.title}</h2><p>{copy.guide.intro}</p></div>
        <ol className={styles.steps}>{copy.guide.steps.map((step, index) => <li key={step.title}><span aria-hidden="true">{index + 1}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
        <Link className={styles.methodology} href="/metodologie/"><Icon name="file" />{copy.guide.methodologyLabel}<Icon name="arrow" /></Link>
      </section>
    </div>
  </article>;
}
