# Director static de servicii

Next.js App Router + TypeScript + CSS Modules. Export HTML în `out/`, fără server de aplicație, API, CMS sau baze de date. Firmele și paginile vor fi adăugate manual în fișiere locale.

## Pornire

Node.js 22+ și npm. Versiunile dependențelor sunt fixate în package-lock.json.

```sh
npm ci
npm run dev
```

Pentru exportul real:

```sh
npm run check
npm start
```

`npm start` servește local fișierele din `out/`, pe http://127.0.0.1:4173; nu reprezintă backend-ul aplicației. `npm run build` validează datele, generează exportul și verifică HTML-ul.

## Verificări

```sh
npm test
npm run lint
npm run build
npm run typecheck
npx playwright install chromium
npm run test:browser
```

Testele browser rulează exportul, pe desktop și mobil, inclusiv fără JavaScript, accesibilitate, navigare cu tastatura și HTTP 404. Build-ul trebuie rulat înaintea lor. Dovezile sunt în `test-results/` (ignorat în Git).

## Configurare și publicare

Copiază `.env.example` în `.env.local` numai dacă ai un domeniu real de configurat. Funcționează și fără variabile. `SITE_URL` este originea HTTPS a viitorului site, fără cale; `INDEXING_ENABLED=false` implicit. Domeniul nu se deduce din URL-ul temporar Vercel. Preview-urile Vercel rămân noindex.

PoC-ul conține zece pagini publice: homepage, servicii, serviciu, județ, oraș, firmă, căutare, despre noi, contact și metodologie. Există un serviciu (curățare canapele), județul și municipiul Brașov și un profil documentat. Toate paginile au indexStatus noindex. `sitemap.xml` rămâne gol cât indexarea e dezactivată. `robots.txt` permite accesul pentru citirea directivelor noindex.

Configurația Vercel este pregătită, dar nu s-a făcut deploy. La conectarea ulterioară: Root Directory = rădăcina acestui proiect; build `npm run build`; output `out`; versiune Node 22 sau mai nouă acceptată de Vercel. Publicarea și activarea indexării sunt pași separați.

- [Adăugarea conținutului](docs/CONTENT.md)
- [Reguli de redactare și SEO](docs/SEO.md)
- [Arhitectură și limite](docs/ARCHITECTURE.md)
- [Rezultatele verificării și auditul dependențelor](docs/VERIFICATION.md)

Numele „Director de servicii” este provizoriu și se schimbă centralizat în configurația site-ului. Nu există firme, metrici SEO sau recenzii fictive în export. Sursele și limitările sunt în docs/research/initial-seo-opportunity.md. Contactul folosește mailto:webdynamicx@gmail.com; nu sunt necesare credențiale SMTP.
