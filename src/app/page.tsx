import { ServiceIcon } from '@/components/ui/ServiceIcon';
import Link from 'next/link';
import { CompanyCard } from '@/components/directory/CompanyCard';
import { loadCatalog } from '@/lib/content/load';
import { homeDestinations } from '@/lib/content/home-search';
import { buildSearchIndex } from '@/lib/content/search';
import { contentPath, companyPath, absoluteUrl } from '@/lib/seo/urls';
import { metadataFor } from '@/lib/content/public';
import { site, addCompanyHref } from '@/config/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { Icon } from '@/components/ui/Icon';
import { HomeSearch } from '@/components/home/HomeSearch';
import { RomaniaMap } from '@/components/ui/RomaniaMap';
import styles from '@/components/home/home.module.css';
export async function generateMetadata() { return metadataFor('/'); }
export default async function HomePage() {
  const catalog = await loadCatalog();
  const destinations = homeDestinations(catalog);
  const services = destinations.filter(d => !d.countyId);
  const counties = destinations.filter(d => d.countyId && !d.cityId).toSorted((a,b) => a.county!.localeCompare(b.county!, 'ro'));
  const pages = catalog.pages.filter(p => p.status === 'published' && (p.kind === 'local' || (p.kind === 'county' && p.companyIds.length > 0))).toSorted((a,b) => {
    const area = (p: typeof a) => { const d = destinations.find(d => d.href === contentPath(p,catalog))!; return d.city ?? d.county!; };
    return area(a).localeCompare(area(b), 'ro');
  });
  const companies = catalog.companies.filter(c => c.status === 'published').toSorted((a,b) => a.name.localeCompare(b.name, 'ro'));
  const searchRows = buildSearchIndex(catalog);
  const list = (items: {name:string; href:string}[]) => ({ '@context':'https://schema.org', '@type':'ItemList', itemListElement:items.map((item,i) => ({ '@type':'ListItem', position:i+1, name:item.name, url:site.url ? absoluteUrl(item.href,site.url) : item.href })) });
  return <>
    <section className={styles.heroBand} aria-labelledby="titlu"><div className={`container ${styles.hero}`}>
      <div className={styles.heroCopy}><h1 id="titlu">Găsește firme locale, simplu.</h1><p>Caută servicii în orașul sau județul tău.<br className={styles.desktopBreak} /> Consultă informațiile și vorbește direct cu firma.</p></div>
      <div className={styles.heroMap}><RomaniaMap /></div>
      <HomeSearch destinations={destinations} />
    </div></section>
    <div className={`container ${styles.benefits}`}>
      <div><span className={styles.roundIcon}><Icon name="shield" /></span><div><strong>Surse publice</strong><p>Datele firmelor au surse documentate.</p></div></div>
      <div><span className={styles.roundIcon}><Icon name="file" /></span><div><strong>Verificare datată</strong><p>Vezi când au fost consultate informațiile.</p></div></div>
      <div><span className={styles.roundIcon}><Icon name="people" /></span><div><strong>Contact direct</strong><p>Discuți oferta chiar cu furnizorul.</p></div></div>
    </div>
    <div className="container">
      <section className={styles.section} aria-labelledby="services-title">
        <div className={styles.sectionHead}><h2 id="services-title">Servicii disponibile</h2><Link href="/servicii/">Vezi toate serviciile <Icon name="arrow" /></Link></div>
        <div className={styles.serviceGrid} id="judete">{services.map(service => <article key={service.href} className={styles.servicePanel}>
          <div className={styles.serviceText}><h3><Link href={service.href}><ServiceIcon serviceIds={[service.serviceId]} />{service.service}</Link></h3>
          <p>Alege județul pentru servicii și date de contact.</p><div className={styles.counties}>{counties.filter(c => c.serviceId === service.serviceId).map(c => <Link key={c.href} href={c.href} aria-label={`${service.service} în ${c.county}`}><Icon name="pin" />{c.county}<Icon name="arrow" /></Link>)}</div></div>
        </article>)}</div>
      </section>
      <section className={styles.section} aria-labelledby="pages-title">
        <div className={styles.sectionHead}><h2 id="pages-title">Găsește servicii în zona ta</h2><Link href="/servicii/">Vezi toate zonele <Icon name="arrow" /></Link></div>
        <ul className={styles.pageGrid} data-item-list>{pages.slice(0,8).map(p => {
          const destination = destinations.find(d => d.href === contentPath(p,catalog))!;
          const label = `${destination.service} în ${destination.city ?? destination.county}`;
          return <li key={p.id}><span className={styles.pageIcon}><ServiceIcon serviceIds={[destination.serviceId]} /></span><div><h3><Link href={destination.href}>{label}</Link></h3><p>{destination.city ? 'Furnizor, contact și informații locale.' : 'Firme și localități documentate în județ.'}</p><span className={styles.cardHint} aria-hidden="true">Vezi pagina <Icon name="arrow" /></span></div></li>;
        })}</ul>
        <JsonLd data={list(pages.slice(0,8).map(p => { const d = destinations.find(d => d.href === contentPath(p,catalog))!; return { name:`${d.service} în ${d.city ?? d.county}`, href:d.href }; }))} />
      </section>
      <section className={styles.section} id="firme" aria-labelledby="companies-title">
        <div className={styles.sectionHead}><h2 id="companies-title">Firme din director</h2><Link href="/cauta/">Vezi toate firmele <Icon name="arrow" /></Link></div>
        <p className={styles.sectionNote}>Listare alfabetică. Date verificate din surse publice; <Link href="/metodologie/">vezi metodologia</Link>.</p>
        <ul className={styles.companyGrid} data-item-list>{companies.slice(0,6).map(c => <li key={c.id}><CompanyCard row={searchRows.find(r => r.id === c.id)!} /></li>)}</ul>
        <JsonLd data={list(companies.slice(0,6).map(c => ({name:c.name,href:companyPath(c)})))} />
      </section>
      <section className={styles.section} id="despre" aria-labelledby="how-title"><h2 id="how-title">Cum funcționează</h2><ol className={styles.steps}>
        <li><span>1</span><div><h3>Cauți</h3><p>Selectezi serviciul, județul și orașul care te interesează.</p></div></li>
        <li><span>2</span><div><h3>Consulți informațiile</h3><p>Vezi ce oferă firma, unde se deplasează și cum o contactezi.</p></div></li>
        <li><span>3</span><div><h3>Contactezi firma</h3><p>Suni direct pentru preț, disponibilitate și detaliile lucrării.</p></div></li>
      </ol></section>
      <section className={styles.cta} aria-labelledby="add-title"><div><h2 id="add-title">Ești o firmă locală?</h2><p>Trimite-ne datele firmei pentru a propune un profil în director.</p></div><a href={addCompanyHref} className="button">Adaugă firma <Icon name="arrow" /></a></section>
    </div>
    {site.url ? <JsonLd data={{'@context':'https://schema.org','@type':'Organization','@id':site.url+'/#organization',name:'Web Dynamicx',url:'https://webdynamicx.ro/',email:site.contactEmail}} /> : null}
    {site.url ? <JsonLd data={{'@context':'https://schema.org','@type':'WebSite', '@id': site.url+'/#website', publisher: {'@id':site.url+'/#organization'}, name:site.name, url:site.url+'/', inLanguage:site.language}} /> : null}
  </>;
}
