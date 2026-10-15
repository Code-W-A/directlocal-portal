import { site, addCompanyHref } from '@/config/site';
import { PrimaryNav } from './PrimaryNav';
import { Brand } from './Brand';
import styles from './layout.module.css';
export function SiteHeader() {
  return <header className={styles.header}><div className={`container ${styles.bar}`}>
    <Brand />
    <PrimaryNav items={site.navigation} />
    <a className={`button ${styles.add}`} href={addCompanyHref}>Înscrie firma</a>
  </div></header>;
}
