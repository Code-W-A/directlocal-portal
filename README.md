# DirectLocal.ro

Director românesc de servicii și firme. Next.js App Router, TypeScript și CSS Modules; pagini pregenerate din fișiere locale și un API SMTP pentru contact. Fără bază de date, conturi sau CMS.

## Pornire și verificare

Node.js 22+ și npm. Dependențele sunt fixate în `package-lock.json`.

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run test:browser
npm start
```

`npm start` rulează serverul Next.js pe portul 3000. Testele browser pornesc separat serverul de producție pe 4173. `verify:export` este numele istoric al verificării HTML-ului pregenerat în `.next/server/app`; proiectul nu mai produce un export static `out/`.

## Producție aprobată

Originea canonică este `https://directlocal.ro`. Build-ul de producție permite indexarea paginilor revizuite. `INDEXING_ENABLED=false` dezactivează indexarea pentru un mediu de staging. Mediile Vercel preview/development rămân neindexabile chiar dacă primesc accidental flagul de producție. Căutarea, API-ul și erorile sunt excluse de la indexare.

Sitemap-ul este generat din registrul public, numai cu URL-uri canonice indexabile și date editoriale reale. Redirectul permanent www → fără www păstrează calea și parametrii. Domeniul localhost nu este redirecționat.

La găzduire alege presetul **Next.js**, build `npm run build`, fără override `Output Directory: out`. SMTP este o funcție de server. Configurează în mediul de găzduire variabilele din `.env.example`; nu copia secrete în repository. Fișierul local existent nu este publicat automat.

## Conținut și cercetare

- [Ghid SEO și redactare în română](docs/seo/SEO-PLAYBOOK.md)
- [Audit și pregătirea lansării](docs/seo/AUDIT-2026-10-15.md)
- [Raportul verificărilor de lansare](docs/reports/RELEASE-VERIFICATION-2026-10-15.md)
- [Toate paginile și linkurile locale](docs/seo/URL-INVENTORY-2026-10-15.md)
- [Inventar oportunități](docs/research/opportunity-inventory-2026-10-15.json)
- [Snapshot registru Google, nemodificat la sursă](docs/research/registry-2026-10-15.json)
- [Dovezi și fapte verificate](docs/research/verified-companies-2026-10-15.json)
- [Administrarea conținutului](docs/CONTENT.md)
- [Arhitectură](docs/ARCHITECTURE.md)
- [Configurare SMTP](docs/CONTACT-SMTP.md)

Importul curatat în `scripts/expand-registry.mjs` reproduce lotul datat de conținut; nu importă automat orice rând din registru. Modificările editoriale ulterioare trebuie păstrate în sursa curată înainte de rerulare. Politica aprobată nu impune trei firme, dar cere informații verificate și valoare distinctă. Orașele cu aceeași selecție și fără detalii distincte sunt mapate la pagina județului.

Nu s-a făcut deploy. După publicare se verifică DNS, HTTPS, redirecturile publice, livrarea SMTP și Search Console. Testele automate nu trimit emailuri reale firmelor.
