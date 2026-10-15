'use client';
import { useId, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import styles from './contact-form.module.css';
const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
type Kind = 'company-message' | 'company-submission' | 'correction' | 'platform-contact';
export function ContactForm({ type, companyId, companyName, fallbackEmail, page }: { type: Kind; companyId?: string; companyName?: string; fallbackEmail: string; page: string }) {
  const prefix = useId();
  const hydrated = useSyncExternalStore(subscribe, clientReady, serverReady);
  const locked = useRef(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [success, setSuccess] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (locked.current) return;
    locked.current = true; setPending(true); setFeedback(''); setSuccess(false);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const kind = values.subject === 'Corectarea unei informații' ? 'correction' : type;
    delete values.subject;
    try {
      const response = await fetch('/api/contact/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, type: kind, companyId, page, acknowledged: values.acknowledged === 'on' }) });
      const result = await response.json();
      setSuccess(response.ok); setFeedback(result.message || 'Trimiterea nu este disponibilă. Folosește contactul direct.');
    } catch { setFeedback('Conexiunea a fost întreruptă. Nu putem confirma trimiterea. Verifică înainte să reîncerci sau folosește contactul direct.'); }
    finally { locked.current = false; setPending(false); }
  }
  const fields = type === 'company-submission' ? [
    ['companyName', 'Denumirea firmei', 160],
  ] as const : [];
  return <form method="post" action="/api/contact/" className={styles.form} onSubmit={submit} aria-label={type === 'company-submission' ? 'Înscriere firmă' : type === 'company-message' ? `Mesaj către ${companyName}` : 'Contact platformă'}>
    {type === 'company-message' ? <p>Mesajul ajunge la <strong>{companyName}</strong>. Echipa DirectLocal.ro primește o copie pentru evidența solicitărilor.</p> : <p>{type === "company-submission" ? "Lasă-ne datele de contact și revenim pentru detaliile înscrierii." : "Mesajul ajunge la echipa DirectLocal.ro. Pentru corecturi, include adresa paginii și sursa informației actualizate."}</p>}
    <div className={styles.fields}>
      {fields.map(([name, label, max]) => <label key={name} htmlFor={`${prefix}-${name}`}>{label}<input id={`${prefix}-${name}`} name={name} required maxLength={max} /></label>)}
      <label htmlFor={`${prefix}-name`}>{type === 'company-submission' ? 'Numele reprezentantului' : 'Numele tău'}<input id={`${prefix}-name`} name="name" autoComplete="name" required maxLength={160} /></label>
      <label htmlFor={`${prefix}-email`}>{type === "company-submission" ? "Email (opțional)" : "Email pentru răspuns"}<input id={`${prefix}-email`} name="email" type="email" autoComplete="email" required={type !== "company-submission"} maxLength={254} /></label>
      <label htmlFor={`${prefix}-phone`}>{type === "company-submission" ? "Telefon de contact" : "Telefon de contact (opțional)"}<input id={`${prefix}-phone`} name="phone" type="tel" autoComplete="tel" required={type === "company-submission"} maxLength={30} /></label>
      {type === 'platform-contact' ? <label htmlFor={`${prefix}-type`}>Subiect<select id={`${prefix}-type`} name="subject"><option>Întrebare despre platformă</option><option>Corectarea unei informații</option></select></label> : null}
    </div>
    {type !== "company-submission" ? <label htmlFor={`${prefix}-message`}>Mesaj<textarea id={`${prefix}-message`} name="message" required minLength={10} maxLength={4000} rows={5} /></label> : null}
    <div className={styles.trap} aria-hidden="true"><label htmlFor={`${prefix}-website`}>Lasă acest câmp gol<input id={`${prefix}-website`} name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className={styles.consent}><input type="checkbox" name="acknowledged" required /> <span>Am citit <a href="/contact/#date-personale">informațiile despre folosirea datelor</a> și înțeleg cui îi este trimis mesajul.</span></label>
    <button className="button" type="submit" disabled={!hydrated || pending || success}>{pending ? 'Se trimite…' : success ? 'Acceptat la trimitere' : type === 'company-submission' ? 'Vreau să fiu contactat' : 'Trimite mesajul'}</button>
    {feedback ? <p role={success ? 'status' : 'alert'} className={styles.feedback}>{feedback}</p> : null}
    <p className={styles.note}>Alternativ: <a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>. Pentru echipa platformei: <a href="tel:+40774550758">0774 550 758</a>.</p>
    <noscript><p>Formularul necesită JavaScript. Folosește adresa de email sau telefonul de mai sus.</p></noscript>
  </form>;
}
