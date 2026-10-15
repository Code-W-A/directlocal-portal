import Link from 'next/link';
import type { ContentPage } from '@/lib/content/schemas';
import { renderMarkdown } from '@/lib/content/markdown';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import styles from './methodology.module.css';
const icons = {
  'Găsirea și verificarea firmelor': 'search',
  'Ordinea rezultatelor': 'people',
  'Limitele verificării': 'shield',
  'Publicarea paginilor': 'file',
  'Raportarea erorilor': 'mail',
  'Înscrieri și mesaje': 'company',
} as const;
export function MethodologyPage({ page }: { page: ContentPage }) {
  const sections = [...page.body.matchAll(/^## (.+)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)];
  return <article className={styles.page}>
    <header className={styles.hero}><div className="container">
      <Breadcrumbs items={[{ label: 'Acasă', href: '/' }, { label: 'Metodologie', href: '/metodologie/' }]} />
      <div className={styles.heroContent}><div><p className={styles.eyebrow}>CUM LUCRĂM</p><h1>{page.title}</h1><p className={styles.intro}>{page.intro}</p></div><div className={styles.heroIcon} aria-hidden="true"><Icon name="shield" /><span>Informații clare.<br />Surse documentate.</span></div></div>
    </div></header>
    <div className={`container ${styles.content}`}>
      {sections.map(([ , title, body], index) => <section className={styles.row} key={title} aria-labelledby={`method-${index}`}>
        <div className={styles.visual} aria-hidden="true"><span className={styles.number}>{String(index + 1).padStart(2, '0')}</span><Icon name={icons[title as keyof typeof icons] ?? 'file'} /></div>
        <div className={styles.copy}><h2 id={`method-${index}`}>{title}</h2><div dangerouslySetInnerHTML={{ __html: renderMarkdown(body.trim()) }} /></div>
      </section>)}
      <aside className={styles.cta}><div><h2>Ai o întrebare sau o corectură?</h2><p>Trimite-ne pagina și informația pe care vrei să o verificăm.</p></div><Link href="/contact/#formular" className="button">Contactează-ne<Icon name="arrow" /></Link></aside>
    </div>
  </article>;
}
