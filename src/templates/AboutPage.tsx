import Link from "next/link";
import type { ContentPage } from "@/lib/content/schemas";
import { renderMarkdown } from "@/lib/content/markdown";
import { addCompanyHref } from "@/config/site";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { LocalIllustration } from "@/components/about/LocalIllustration";
import styles from "./about.module.css";

type Editorial = Extract<ContentPage, { kind: "editorial" }>;
const principleIcons = ["people", "shield", "phone"] as const;
const selectionIcons = ["file", "search", "shield"] as const;

export function AboutPage({ page, content }: { page: Editorial; content: NonNullable<Editorial["about"]> }) {
  return <article className={styles.page}>
    <div className={styles.heroBand}>
      <div className="container">
        <Breadcrumbs items={[{ label: "Acasă", href: "/" }, { label: "Despre", href: "/despre-noi/" }]} />
        <div className={styles.hero}>
          <div><h1>{page.title}</h1><p className={styles.lead}>{page.intro}</p></div>
          <div className={styles.illustration} aria-hidden="true"><LocalIllustration /><p className={styles.caption}>{content.illustrationCaption}</p></div>
        </div>
      </div>
    </div>
    <div className={`container ${styles.sections}`}>
      <section aria-labelledby="ce-este"><h2 id="ce-este">{content.overviewTitle}</h2><div className={styles.overview} dangerouslySetInnerHTML={{ __html: renderMarkdown(page.body) }} /></section>
      <section aria-labelledby="principii"><h2 id="principii">{content.principles.title}</h2><div className={styles.principles}>
        {content.principles.items.map((item, index) => <div className={styles.principle} key={item.title}><span className={styles.icon}><Icon name={principleIcons[index]} /></span><h3>{item.title}</h3><p>{item.description}</p></div>)}
      </div></section>
      <section aria-labelledby="pasi"><h2 id="pasi">{content.steps.title}</h2><ol className={styles.steps}>
        {content.steps.items.map((item, index) => <li key={item.title}><span className={styles.number} aria-hidden="true">{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div>{index < 2 ? <Icon name="arrow" className={styles.stepArrow} /> : null}</li>)}
      </ol><Link className={styles.textLink} href="/cauta/">{content.searchLabel} <Icon name="arrow" /></Link></section>
      <section aria-labelledby="audienta"><h2 id="audienta">{content.audiences.title}</h2><div className={styles.audiences}>
        {content.audiences.items.map((item, index) => <div className={index === 0 ? styles.userPanel : styles.companyPanel} key={item.title}><div className={styles.panelHeading}><span className={styles.icon}><Icon name={index === 0 ? "people" : "city"} /></span><h3>{item.title}</h3></div><ul>{item.points.map(point => <li key={point}><span className={styles.check} aria-hidden="true">✓</span>{point}</li>)}</ul></div>)}
      </div></section>
      <section aria-labelledby="verificare"><h2 id="verificare">{content.selection.title}</h2><p>{content.selection.description}</p><div className={styles.selection}>
        {content.selection.items.map((item, index) => <div key={item.title}><span className={styles.icon}><Icon name={selectionIcons[index]} /></span><div><h3>{item.title}</h3><p>{item.description}</p></div></div>)}
      </div><p className={styles.note}>{content.selection.note}</p><Link className={styles.textLink} href="/metodologie/">{content.selection.linkLabel} <Icon name="arrow" /></Link></section>
      <section className={styles.cta} aria-labelledby="propune"><div><h2 id="propune">{content.cta.title}</h2><p>{content.cta.description}</p><small>{content.cta.note}</small></div><a className="button" href={addCompanyHref}>{content.cta.label}<Icon name="arrow" /></a></section>
      <p className={styles.corrections}>{content.corrections.text} <Link href="/contact/">{content.corrections.label}</Link></p>
    </div>
  </article>;
}
