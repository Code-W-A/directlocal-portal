import { ContactForm } from "@/components/contact/ContactForm";
import Link from "next/link";
import { site, addCompanyHref } from "@/config/site";
import type { ContentPage } from "@/lib/content/schemas";
import { renderMarkdown } from "@/lib/content/markdown";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import styles from "./contact.module.css";

const emailHref = `mailto:${site.contactEmail}?subject=${encodeURIComponent("Mesaj pentru DirectLocal.ro")}`;
const correctionHref = `mailto:${site.contactEmail}?subject=${encodeURIComponent("Corectură pentru DirectLocal.ro")}&body=${encodeURIComponent("Bună ziua,\n\nAm observat o informație care trebuie corectată.\nAdresa paginii: \nInformația de corectat: \nSursa publică a modificării: \n")}`;

export function ContactPage({ page }: { page: ContentPage }) {
  return <article className={styles.page}>
    <header className={styles.hero}>
      <div className="container">
        <Breadcrumbs items={[{ label: "Acasă", href: "/" }, { label: "Contact", href: "/contact/" }]} />
        <p className={styles.eyebrow}>SUNTEM AICI PENTRU ÎNTREBĂRILE TALE</p>
        <h1>{page.title}</h1>
        <p className={styles.intro}>{page.intro}</p>
      </div>
    </header>

    <div className={`container ${styles.content}`}>
      <div className={styles.contactGrid}>
        <section className={styles.emailCard} aria-labelledby="email-title">
          <span className={styles.emailIcon}><Icon name="mail" /></span>
          <h2 id="email-title">Scrie-ne</h2>
          <p>Ai o întrebare despre director sau o sugestie pentru paginile publicate? Ne poți contacta prin email.</p>
          <a className={styles.emailAddress} href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          <a className={`button ${styles.emailButton}`} href={emailHref}>Trimite un email <Icon name="arrow" /></a>
          <p className={styles.emailNote}>Linkul deschide aplicația ta de email. Mesajul este trimis după ce îl verifici și apeși „Trimite” în aplicație.</p>
        </section>

        <div className={styles.actions}>
          <section className={styles.actionCard} aria-labelledby="correction-title">
            <span className={styles.icon}><Icon name="file" /></span>
            <div><h2 id="correction-title">Raportează o informație greșită</h2>
              <p>Ai găsit un telefon schimbat, o zonă de acoperire incorectă sau un link care nu funcționează? Trimite-ne pagina și detaliile.</p>
              <a href={correctionHref} className={styles.textLink}>Trimite o corectură <Icon name="arrow" /></a>
            </div>
          </section>
          <section className={styles.actionCard} aria-labelledby="company-title">
            <span className={styles.icon}><Icon name="people" /></span>
            <div><h2 id="company-title">Propune o firmă</h2>
              <p>Spune-ne ce servicii oferă firma și unde lucrează. Include o sursă publică, pentru a putea verifica informațiile.</p>
              <a href={addCompanyHref} className={styles.textLink}>Propune un profil <Icon name="arrow" /></a>
            </div>
          </section>
        </div>
      </div>

      <section id="formular" className={styles.formSection} aria-labelledby="form-title"><h2 id="form-title">Trimite un mesaj echipei</h2><p><a href="tel:+40774550758">Sună: 0774 550 758</a></p><ContactForm type="platform-contact" fallbackEmail={site.contactEmail} page="/contact/" /></section>
      <section id="date-personale" className={styles.dataSection}><h2>Folosirea datelor din formular</h2><p>Numele, datele de contact și mesajul sunt folosite pentru a răspunde solicitării. Mesajele adresate unei firme sunt trimise acelei firme, iar echipa DirectLocal.ro primește o copie. Solicitările de înscriere și corecturile ajung numai la echipa platformei. Nu trimite date sensibile sau informații care nu sunt necesare. Datele reprezentantului nu sunt publicate automat.</p><p>Mesajele sunt procesate prin furnizorul de email și păstrate în căsuțele destinatarilor pentru gestionarea solicitării. Pentru întrebări sau solicitări privind datele, scrie la <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. Formularul nu te înscrie la mesaje de marketing.</p></section>
      <section id="statistici" className={styles.dataSection}><h2>Statistici și preferințe cookies</h2><p>Cu acordul tău, folosim Google Analytics pentru a înțelege vizitele și acțiunile din director: accesarea contactelor firmelor, trimiterea formularelor și căutările fără rezultate. Statisticile sunt administrate de Web Dynamicx și procesate cu serviciul Google Analytics.</p><p>Scriptul Google se încarcă numai după „Accept statisticile”. Poți refuza și poți schimba alegerea din „Preferințe cookies” în subsol. Alegerea se păstrează pe acest browser pentru cel mult 180 de zile. Refuzul nu împiedică folosirea directorului sau trimiterea formularelor.</p><p>Nu trimitem în evenimente numele, emailul, telefonul sau mesajul completat în formulare și nici textul liber al căutării. Google Analytics poate folosi identificatori de browser și cookies pentru statistici. La retragerea acordului, oprim măsurarea și eliminăm cookies Analytics accesibile acestui site.</p><p>Un click pe „Sună” indică intenția de contact; nu confirmă un apel sau o programare. Un formular este numărat după acceptarea trimiterii de către server, fără a confirma citirea mesajului. <a href="https://policies.google.com/technologies/partner-sites" rel="external">Cum folosește Google informațiile de pe site-urile partenere</a>.</p></section>
      <section className={styles.messageGuide} aria-labelledby="message-title">
        <div className={styles.guideHeading}><span className={styles.icon}><Icon name="file" /></span><div><h2 id="message-title">Ce să incluzi în mesaj</h2><p>Câteva detalii ne ajută să înțelegem și să verificăm solicitarea.</p></div></div>
        <div className={styles.guideBody} dangerouslySetInnerHTML={{ __html: renderMarkdown(page.body) }} />
        <p className={styles.privacyNote}><Icon name="shield" />Trimite numai informațiile necesare solicitării. Evită datele personale care nu sunt relevante.</p>
      </section>

      <aside className={styles.providerNote} aria-labelledby="provider-title">
        <span className={styles.icon}><Icon name="phone" /></span>
        <div><h2 id="provider-title">Cauți o ofertă sau o programare?</h2><p>Contactează direct firma din profil pentru preț, disponibilitate și detaliile serviciului.</p></div>
        <Link href="/cauta/" className={styles.textLink}>Găsește o firmă <Icon name="arrow" /></Link>
      </aside>


    </div>
  </article>;
}
