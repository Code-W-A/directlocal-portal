import Link from "next/link";
import Image from "next/image";
import { loadCatalog } from "@/lib/content/load";
import { contentPath } from "@/lib/seo/urls";
import { metadataFor } from "@/lib/content/public";

import { ActionLink } from "@/components/ui/ActionLink";
import styles from "./page.module.css";
export async function generateMetadata() { return metadataFor("/"); }
export default async function HomePage() {
  const catalog = await loadCatalog();
  const destinations = catalog.pages.filter(p => p.status === "published" && (p.kind === "local" || (p.kind === "county" && p.companyIds.length > 0)));
  return <>
    <section className={`container ${styles.hero}`} aria-labelledby="titlu">
      <div className={styles.intro}>
        <p className={styles.eyebrow}><span />Director de servicii locale</p>
        <h1 id="titlu">Serviciul potrivit.<br /><span>Mai aproape.</span></h1>
        <p className={styles.lead}>Un loc pentru a descoperi firme, a înțelege ce oferă și a găsi datele de contact de care ai nevoie.</p>
        <ActionLink href="#despre">Descoperă directorul</ActionLink>
      </div>
      <aside className={styles.note} aria-label="Stadiul directorului">
        <span className={styles.noteLabel}>LA ÎNCEPUT DE DRUM</span>
        <div className={styles.symbol} aria-hidden="true">↗</div>
        <h2>Curățare canapele în Brașov</h2>
        <p>Contact, serviciu declarat și surse publice pentru fiecare furnizor.</p><Link href="/servicii/curatare-canapele/brasov/brasov/">Vezi pagina din Brașov</Link>
        <Image src="/images/canapea.webp" width={800} height={400} alt="Ilustrație generică a unei canapele verzi cu două perne" className="sofa-image" /><p className={styles.noteFoot}>Ilustrație generică, nu fotografia unei firme.</p>
      </aside>
    </section>
    <section className="container content-page"><h2>Curățare canapele: alege zona</h2><ul>{destinations.map(p => <li key={p.id}><Link href={contentPath(p, catalog)}>{p.title}</Link></li>)}</ul></section>
    <section id="despre" className={styles.about} aria-labelledby="despre-titlu">
      <div className="container">
        <p className={styles.eyebrow}>DESPRE DIRECTOR</p>
        <h2 id="despre-titlu">Mai multă claritate.<br />Un punct de plecare simplu.</h2>
        <div className={styles.steps}>
          <article><span>01 / DESCOPERĂ</span><h3>Servicii în zona ta</h3><p>Pagini organizate după serviciu și localitate, pentru a ajunge ușor la informația relevantă.</p></article>
          <article><span>02 / INFORMEAZĂ-TE</span><h3>Detalii despre firme</h3><p>Profiluri cu descrierea serviciilor, zonele acoperite și informațiile disponibile despre fiecare firmă.</p></article>
          <article><span>03 / IA LEGĂTURA</span><h3>Contact direct</h3><p>Datele de contact într-un singur loc, pentru a discuta direct cu firma despre ceea ce ai nevoie.</p></article>
        </div>
      </div>
    </section>
  </>;
}
