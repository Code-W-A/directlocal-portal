import Link from "next/link";
import { site } from "@/config/site";
import styles from "./layout.module.css";
export function SiteFooter() {
  return <footer className={styles.footer}><div className={`container ${styles.footerInner}`}>
    <span>{site.name}</span><nav aria-label="Informații despre director"><Link href="/despre-noi/">Despre noi</Link> · <Link href="/contact/">Contact</Link> · <Link href="/metodologie/">Metodologie</Link></nav><span>Informații locale. Alegeri informate.</span>
  </div></footer>;
}
