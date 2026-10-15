import { ServiceIcon } from "@/components/ui/ServiceIcon";
import Link from "next/link";
import type { ContentPage, Service } from "@/lib/content/schemas";
import { servicePath, absoluteUrl } from "@/lib/seo/urls";
import { renderMarkdown } from "@/lib/content/markdown";
import { site } from "@/config/site";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Sources } from "@/components/directory/Sources";
import { LocalPhoto } from "@/components/home/LocalPhoto";
import { Icon } from "@/components/ui/Icon";
import styles from "./service.module.css";

export function ServicePage({ page, service, localPages }: {
  page: Extract<ContentPage, { kind: "service" }>;
  service: Service;
  localPages: { label: string; county: string; href: string }[];
}) {
  const path = servicePath(service);
  const counties = localPages.toSorted((a, b) => a.county.localeCompare(b.county, "ro"));
  return <article className={styles.page}>
    <div className={styles.heroBand}>
      <div className={`container ${styles.heroContainer}`}>
        <Breadcrumbs items={[{ label: "Acasă", href: "/" }, { label: "Servicii", href: "/servicii/" }, { label: service.name, href: path }]} />
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}><ServiceIcon serviceIds={[service.id]} />Servicii locale</span>
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
            {counties.length ? <a className="button" href="#judete-documentate">Alege județul <Icon name="arrow" /></a> : null}
          </div>
          {service.slug === "curatare-canapele" ? <figure className={styles.heroPhoto}>
            <LocalPhoto kind="sofa" sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1200px) 40vw, 450px" priority />
            <figcaption>Fotografie ilustrativă</figcaption>
          </figure> : null}
        </div>
      </div>
    </div>
    <div className={`container ${styles.content}`}>
      {counties.length ? <section id="judete-documentate" className={styles.counties} aria-labelledby="counties-title">
        <div className={styles.sectionHead}><h2 id="counties-title">Județe documentate</h2><p>Alege județul pentru a consulta paginile locale.</p></div>
        <ul className={styles.countyGrid} data-item-list>{counties.map(county => <li key={county.href}>
          <span className={styles.roundIcon}><ServiceIcon serviceIds={[service.id]} /></span>
          <h3><Link href={county.href} aria-label={county.label}>{county.county}</Link></h3>
          <span className={styles.cardHint} aria-hidden="true">Vezi pagina județului <Icon name="arrow" /></span>
        </li>)}</ul>
        <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: counties.map((county, i) => ({ "@type": "ListItem", position: i + 1, name: county.county, url: site.url ? absoluteUrl(county.href, site.url) : county.href })) }} />
      </section> : null}
      <div className={styles.guideLayout}>
        <div className={`prose ${styles.guide}`} dangerouslySetInnerHTML={{ __html: renderMarkdown(page.body) }} />
        <aside className={styles.methodology} aria-labelledby="methodology-title">
          <span className={styles.roundIcon}><Icon name="file" /></span>
          <h2 id="methodology-title">Cum verificăm informațiile</h2>
          <p>Profilul separă sediul declarat de zona deservită. Consultă website-ul și data verificării înainte de a contacta firma.</p>
          <Link href="/metodologie/">Vezi metodologia <Icon name="arrow" /></Link>
        </aside>
      </div>
      <div className={styles.sources}><Sources sources={page.sources} path={path} /></div>
    </div>
  </article>;
}
