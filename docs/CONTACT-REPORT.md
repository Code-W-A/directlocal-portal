# Pagina Contact DirectLocal.ro

Implementare locală, 2026-10-12, pe ruta existentă `/contact/`.

## UI și comportament

Pagina folosește un șablon dedicat cu hero bleu, breadcrumbs, H1 „Contact DirectLocal.ro”, card principal cu email și două carduri pentru corecturi și propuneri de firme. Layout-ul are două coloane pe desktop și o coloană pe mobil. Culorile, pictogramele, butoanele și spațierea folosesc stilul DirectLocal.ro.

- Adresa vizibilă: `webdynamicx@gmail.com`, cu mailto simplu.
- „Trimite un email”: subiect „Mesaj pentru DirectLocal.ro”.
- „Trimite o corectură”: subiect distinct și corp cu adresa paginii, modificarea și sursa publică.
- „Propune un profil”: reutilizează solicitarea de firmă din configurația centralizată.
- „Găsește o firmă”: `/cauta/`, pentru oferte și programări direct cu furnizorul.
- Sursele existente sunt păstrate într-un disclosure nativ details/summary, cu data consultării. Nota explică faptul că sursa documentează o firmă din catalog.

Nu există formular, backend sau confirmare fictivă de trimitere. Linkurile deschid aplicația de email; utilizatorul trimite mesajul din aplicație.

## Metadata și export

Titlul, descrierea și introducerea au fost actualizate în conținutul centralizat. BreadcrumbList corespunde navigației vizibile. Ruta, numărul de pagini și politica de indexare rămân cele existente: 18 pagini, indexare globală dezactivată, Contact noindex. Canonical și OG absolute sunt guvernate de SITE_URL real configurat.

## Verificări efectuate

- `npm run check`: lint, 35 teste unitare, validare de conținut, build static, verificarea exportului și TypeScript — trecute.
- `DIRECTORY_TEST_PORT=4174 npm run test:browser -- --grep 'editorial pages|home is readable'`: 4 teste trecute, desktop și mobil, inclusiv Contact, componente comune, metadata și accesibilitatea homepage-ului.
- Verificare directă Chromium a paginii Contact la 360, 390, 768 și 1440 px: H1 unic, noindex, email și subiecte distincte, corp pentru corecturi, lipsa formularului, focus prin Tab, deschiderea și închiderea surselor cu Enter, legătura spre căutare, lipsa overflow-ului și lipsa erorilor JavaScript.
- Axe: nicio încălcare detectată pe pagina Contact la toate cele patru lățimi, inclusiv cu sursele extinse.
- JavaScript dezactivat: conținutul, linkurile de email și disclosure-ul surselor funcționează.
- Capturi desktop/mobil inspectate vizual. `git diff --check` trecut.

Verificarea mailto controlează adresa, subiectul și corpul precompletat; nu s-au trimis emailuri reale. Nu s-a făcut deploy sau audit de producție.

## Capturi și fișiere

[Desktop](reports/contact/contact-desktop.png) · [Mobil](reports/contact/contact-mobile.png)

Fișiere ale implementării: `src/app/contact/page.tsx`, `src/templates/ContactPage.tsx`, `src/templates/contact.module.css`, `src/content/pages/contact.md`, acest raport și capturile.
