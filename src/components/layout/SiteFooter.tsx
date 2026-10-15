import Link from 'next/link';
import { site, addCompanyHref } from '@/config/site';
import { Brand } from './Brand';
import { Icon } from '@/components/ui/Icon';
import styles from './layout.module.css';
export function SiteFooter() {
  return <footer className={styles.footer}><div className="container">
    <div className={styles.footerGrid}>
      <div><Brand /><p>Găsește servicii locale, consultă informațiile disponibile și ia legătura direct cu firma.</p></div>
      <nav aria-label="Linkuri utile"><h2>Linkuri utile</h2><Link href="/">Acasă</Link><Link href="/servicii/">Servicii</Link><Link href="/#judete">Județe</Link><Link href="/cauta/">Firme</Link></nav>
      <div><h2>Contact</h2><a className={styles.email} href={`mailto:${site.contactEmail}`}><Icon name="mail" />Scrie-ne un email</a><p className={styles.address}>{site.contactEmail}</p><a href={addCompanyHref}>Propune o firmă</a></div>
      <nav aria-label="Informații despre director"><h2>Despre director</h2><Link href="/despre-noi/">Despre noi</Link><Link href="/metodologie/">Cum verificăm datele</Link><Link href="/contact/">Contact și corecturi</Link><p>Datele de contact și data consultării sunt disponibile pe fiecare profil.</p></nav>
    </div>
    <div className={styles.footerBottom}><span>© {new Date().getUTCFullYear()} {site.name}</span><span>Un director administrat de <a href="https://webdynamicx.ro/" rel="external">Web Dynamicx</a>.</span></div>
  </div></footer>;
}
