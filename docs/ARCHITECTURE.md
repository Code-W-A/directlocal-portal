# Arhitectură curentă — 15.10.2026

Next.js App Router cu pagini pregenerate și TypeScript. Datele locale sunt validate cu Zod. `src/lib/content/load.ts` încarcă serviciile, județele, localitățile, firmele și paginile editoriale. `status: draft` nu generează rute publice.

URL-uri: `/servicii/` → `/servicii/{serviciu}/` → `/servicii/{serviciu}/{judet}/` → `/servicii/{serviciu}/{judet}/{oras}/`. Firma are profil unic `/firme/{slug}/`. Firmele cu mai multe servicii nu sunt duplicate. Orașele fără informație distinctă pot fi acoperite de pagina județului, fără rută goală.

Registrul SEO generează metadata și subsetul sitemap din aceleași pagini publicate. În producție originea implicită este https://directlocal.ro și indexarea este activă pentru paginile aprobate. Preview-urile și dezvoltarea rămân noindex; căutarea nu are canonical și nu intră în sitemap. `lastmod` folosește schimbări editoriale și datele dependențelor vizibile, nu timpul build-ului.

Schema include WebSite și editorul Web Dynamicx pe homepage, BreadcrumbList și ItemList când informațiile sunt vizibile, LocalBusiness numai în profil. ID-urile entităților folosesc originea canonică. Sediul și punctul de lucru au etichete separate; aria de servicii nu stabilește adresa. Nu emitem ratings, recenzii, prețuri sau certificări.

Căutarea primește un index minim la build și filtrează în browser. Condițiile serviciu/județ/oraș se aplică aceleiași oferte a firmei. HTML-ul inițial conține toate firmele. Homepage-ul navighează numai spre rute publicate. Dropdownurile căutabile sunt comune; harta decorativă apare numai pe desktop.

`src/proxy.ts` redirecționează exclusiv domeniul www, păstrând calea și parametrii. `POST /api/contact/` este singura rută dinamică de aplicație. Validează formularul, originea, limitele de lungime, honeypot și frecvența pe instanță. Destinatarul firmei este rezolvat din catalog. SMTP are expeditor pe server, Reply-To pentru utilizator și copie ascunsă administratorului. Nu persistăm mesaje în fișiere sau bază de date. Acceptarea SMTP nu înseamnă citire sau livrare garantată. Limitarea pe instanță nu este un sistem distribuit anti-abuz.

`npm run build` verifică toate paginile HTML, referințele interne, lipsa paginilor orfane, metadata, datele structurate și sitemap-ul. Browserul testează serverul Next.js, nu un export static. Secretele SMTP se configurează separat în mediul de găzduire.
