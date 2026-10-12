import Link from "next/link";
import { site } from "@/config/site";
import styles from "./layout.module.css";
export function SiteHeader() {
  return <header className={styles.header}>
    <div className={`container ${styles.bar}`}>
      <Link href="/" className={styles.brand} aria-label={`${site.name} — acasă`}>
        <span className={styles.mark} aria-hidden="true">d.</span><span>{site.name}</span>
      </Link>
      <nav aria-label="Navigare principală">{site.navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
    </div>
  </header>;
}
