import { ContactForm } from '@/components/contact/ContactForm';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import { site } from '@/config/site';
import { metadataFor } from '@/lib/content/public';
import styles from './signup.module.css';
export async function generateMetadata() { return metadataFor('/inscriere-firma/'); }
export default function Page() {
  return <article className={styles.page}>
    <header className={styles.hero}><div className="container">
      <Breadcrumbs items={[{ label: 'Acasă', href: '/' }, { label: 'Înscrie firma', href: '/inscriere-firma/' }]} />
      <div className={styles.heroContent}><span className={styles.heroIcon} aria-hidden="true"><Icon name="company" /></span><div><p className={styles.eyebrow}>PENTRU FIRME LOCALE</p><h1>Înscrie firma în DirectLocal.ro</h1><p>Vrei să apară firma ta în director? Lasă-ne un nume și un telefon, iar noi te contactăm pentru detalii.</p></div></div>
    </div></header>
    <div className={`container ${styles.content}`}>
      <ol className={styles.steps}>{['Lași datele de contact', 'Discutăm despre firmă', 'Verificăm și pregătim profilul'].map((step, index) => <li key={step}><span aria-hidden="true">{index + 1}</span>{step}</li>)}</ol>
      <p className={styles.note}>Solicităm clarificări dacă este nevoie. Nu promitem un termen de publicare sau un număr de clienți.</p>
      <a className={styles.phone} href="tel:+40774550758"><Icon name="phone" />Preferi să discutăm? 0774 550 758</a>
      <ContactForm type="company-submission" fallbackEmail={site.contactEmail} page="/inscriere-firma/" />
    </div>
  </article>;
}
