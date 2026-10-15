import Link from 'next/link';
import type { Catalog, ContentPage } from '@/lib/content/schemas';
import { contentPath, servicePath, countyPath } from '@/lib/seo/urls';
import { renderMarkdown } from '@/lib/content/markdown';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { CompanyList } from '@/components/directory/CompanyList';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { Icon } from '@/components/ui/Icon';
import styles from './area-service.module.css';
type AreaPage = Extract<ContentPage, { kind: 'county' | 'local' }>;
export function AreaServicePage({ page, catalog }: { page: AreaPage; catalog: Catalog }) {
  const service = catalog.services.find(s => s.id === page.serviceId)!;
  const location = page.kind === 'local' ? catalog.locations.find(l => l.id === page.locationId)! : undefined;
  const county = catalog.counties.find(c => c.id === (page.kind === 'county' ? page.countyId : location!.countyId))!;
  const path = contentPath(page, catalog);
  const companies = catalog.companies.filter(c => c.status === 'published' && page.companyIds.includes(c.id));
  const children = catalog.pages.filter(p => p.kind === 'local' && p.status === 'published' && p.serviceId === service.id && catalog.locations.find(l => l.id === p.locationId)?.countyId === county.id && p.id !== page.id);
  const related = catalog.pages.filter(p => p.status === 'published' && p.kind === 'county' && p.serviceId === service.id && p.countyId !== county.id);
  const otherServices = catalog.pages.filter(p => p.status === 'published' && p.kind === page.kind && p.serviceId !== service.id && (p.kind === 'local' && location ? p.locationId === location.id : p.kind === 'county' && p.countyId === county.id));
  const crumbs = [{ label: 'Acasă', href: '/' }, { label: 'Servicii', href: '/servicii/' }, { label: service.name, href: servicePath(service) }, { label: `Județul ${county.name}`, href: countyPath(service, county) }, ...(location ? [{ label: location.name, href: path }] : [])];
  return <article className={styles.page}>
    <header className={styles.hero}><div className="container">
      <Breadcrumbs items={crumbs} />
      <div className={styles.heroContent}><span className={styles.serviceIcon}><ServiceIcon serviceIds={[service.id]} /></span><div><p className={styles.eyebrow}>{location ? 'SERVICII ÎN ORAȘUL TĂU' : 'SERVICII ÎN JUDEȚ'}</p><h1>{page.title}</h1><p className={styles.intro}>{page.intro}</p>
      <div className={styles.heroLinks}><a href={companies.length ? '#firme-locale' : '#localitati'}><Icon name={companies.length ? 'people' : 'pin'} />{companies.length ? 'Vezi firmele' : 'Alege localitatea'}<Icon name="arrow" /></a><Link href="/cauta/">Caută în director</Link></div></div></div>
    </div></header>
    <div className={`container ${styles.layout}`}>
      <div className={styles.main}>
        {companies.length ? <section id="firme-locale" className={styles.firms} aria-labelledby="firms-heading"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>CONTACTE ȘI SERVICII</p><h2 id="firms-heading">{location ? `Firme care declară serviciul în ${location.name}` : `Firme pentru ${service.name.toLowerCase()} în ${county.name}`}</h2></div><span className={styles.count}>{companies.length} {companies.length === 1 ? 'firmă' : 'firme'}</span></div><p className={styles.note}>Ordine alfabetică. Confirmă direct cu firma disponibilitatea și deplasarea la adresa ta.</p><CompanyList companies={companies} catalog={catalog} /></section> : null}
        {children.length ? <section id="localitati" className={styles.locations} aria-labelledby="locations-heading"><p className={styles.eyebrow}>ALEGE ZONA</p><h2 id="locations-heading">{location ? 'Alte localități documentate' : 'Localități documentate'}</h2><p>Accesează pagina localității pentru firmele și contactele disponibile.</p><div className={styles.locationGrid}>{children.map(p => <Link key={p.id} aria-label={p.kind === "local" ? catalog.locations.find(l => l.id === p.locationId)!.name : undefined} href={contentPath(p, catalog)}><ServiceIcon serviceIds={[service.id]} /><span><strong>{catalog.locations.find(l => p.kind === 'local' && l.id === p.locationId)!.name}</strong><small>{service.name}</small></span><Icon name="arrow" /></Link>)}</div></section> : null}
        {otherServices.length ? <section className={styles.locations} aria-labelledby="other-services-title"><h2 id="other-services-title">Alte servicii în {location?.name ?? `județul ${county.name}`}</h2><div className={styles.locationGrid}>{otherServices.map(p => <Link key={p.id} href={contentPath(p, catalog)}><ServiceIcon serviceIds={[p.kind !== 'editorial' ? p.serviceId : '']} /><span>{catalog.services.find(s => p.kind !== 'editorial' && s.id === p.serviceId)!.name}</span><Icon name="arrow" /></Link>)}</div></section> : null}
        <section className={styles.editorial} aria-label="Informații despre serviciul local"><div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(page.body) }} /></section>
        <div className={styles.transparency}><Icon name="file" /><p>Contactele și data consultării informațiilor sunt disponibile în profilul fiecărei firme. <Link href="/metodologie/">Cum documentăm firmele</Link></p></div>
      </div>
      <aside className={styles.sidebar} aria-label="Navigare și informații utile">
        <section className={styles.sideCard}><span className={styles.sideIcon}><Icon name="pin" /></span><h2>Zona căutată</h2><p className={styles.areaName}>{location?.name ?? `Județul ${county.name}`}</p><p>Sediul firmei și zona în care lucrează pot fi diferite. Confirmă adresa intervenției înainte de programare.</p>{location ? <Link href={countyPath(service, county)}>Vezi județul {county.name}<Icon name="arrow" /></Link> : null}<Link href={servicePath(service)}>Toate zonele pentru acest serviciu<Icon name="arrow" /></Link></section>
        <section className={`${styles.sideCard} ${styles.addCard}`}><Icon name="company" /><h2>Oferi acest serviciu?</h2><p>Propune firma pentru verificare și includere în director.</p><Link href="/inscriere-firma/" className="button">Înscrie firma<Icon name="arrow" /></Link></section>
      </aside>
    </div>
    {related.length ? <section className={`container ${styles.related}`} aria-labelledby="related-heading"><p className={styles.eyebrow}>CONTINUĂ CĂUTAREA</p><h2 id="related-heading">Același serviciu în alte județe</h2><div className={styles.relatedGrid}>{related.map(p => <Link key={p.id} aria-label={p.kind === "local" ? catalog.locations.find(l => l.id === p.locationId)!.name : undefined} href={contentPath(p, catalog)}><ServiceIcon serviceIds={[service.id]} /><span>{catalog.counties.find(c => p.kind === 'county' && c.id === p.countyId)!.name}</span><Icon name="arrow" /></Link>)}</div></section> : null}
  </article>;
}
