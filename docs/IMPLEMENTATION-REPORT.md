> Raport istoric al PoC-ului inițial. Pentru starea extinsă și politica editorială actuală, vezi [extinderea](research/three-local-opportunities.md).

# Raport de implementare — 12 octombrie 2026

## Rezultat

Proiectul existent a fost extins într-un PoC static funcțional: un serviciu, un județ, un oraș, o firmă. Fără CMS, API, bază de date, autentificare sau backend de e-mail.

## Oportunitate și firmă

„curatare canapele brasov”: Semrush România — volum estimat 140/lună, KD 8/100, CPC 0,48 (monedă neprecizată). Analiza, concurenții și limitele sunt în [raportul de cercetare](research/initial-seo-opportunity.md).

[Igienizare Tapițerie](https://www.igienizaretapiterie.ro/), 0723 316 469: nume comercial, contact, serviciu în Brașov și sediu declarat în oraș documentate din website. Adresa stradală și denumirea juridică rămân neconfirmate. Nu au fost efectuate apeluri, vizite sau verificări ale lucrărilor. Firecrawl a returnat Unknown tool; fallback-ul web a fost aprobat de utilizator.

## URL-uri și indexare

Toate paginile următoare există în export și au `noindex`:

- `/`
- `/servicii/`
- `/servicii/curatare-canapele/`
- `/servicii/curatare-canapele/brasov/`
- `/servicii/curatare-canapele/brasov/brasov/`
- `/firme/igienizare-tapiterie/`
- `/cauta/`
- `/despre-noi/`
- `/contact/`
- `/metodologie/`

Nicio pagină nu este `index`. Pagina locală are un singur furnizor; pragul este trei plus revizuire editorială și conținut distinct. Sitemap este gol. Robots permite citirea noindex. Fără domeniu real, canonical și OG URL sunt omise; constructorii sunt testați cu configurații controlate. Căutarea este permanent noindex și nu scrie filtrele în URL.

## Fișiere și subsisteme

Modificate:

- Modele, încărcare și validare: `src/lib/content/schemas.ts`, `load.ts`, `validate.ts`.
- URL, registru și metadata: `src/lib/seo/urls.ts`, `registry.ts`, `metadata.ts`; sitemap în `src/app/sitemap.ts`.
- Configurație, homepage, stiluri: `src/config/site.ts`, `src/app/page.tsx`, `globals.css`.
- Șabloane existente: `src/templates/EditorialPage.tsx`, `ServicePage.tsx`, `LocalServicePage.tsx`, `CompanyPage.tsx`.
- Liste, carduri, breadcrumbs, footer și layout CSS existente.
- `scripts/verify-export.ts`, testele de conținut/SEO și suita browser.
- README, documentația de arhitectură, conținut, SEO și verificare.

Create:

- Adaptoarele celor nouă rute suplimentare în `src/app`.
- `src/lib/content/public.ts`, `search.ts`, `src/lib/seo/verify-schema.ts`.
- `src/templates/ContentView.tsx`; `src/components/directory/Search.tsx`, `Sources.tsx`, `PageLinks.tsx`.
- JSON pentru serviciu, județ, oraș și firmă; șase pagini Markdown în `src/content/pages`.
- `public/images/canapea.svg` și `canapea.webp`; proveniența în `docs/IMAGES.md`.
- `tests/search.test.ts`, `tests/schema.test.ts`.
- `AGENTS.md`, raport de audit/cercetare, trei ghiduri în `docs/seo`, prezentul raport.

## Verificări

`npm run check` a trecut: lint, 29 teste, validatorul de conținut, Next.js build, verificarea exportului și typecheck. `npm run test:browser`: 10/10 desktop/mobil. Detalii și limite în [VERIFICATION.md](VERIFICATION.md).

## Livrare și limite externe

Branch local: `feat/local-directory-poc`. Nu există remote Git, proiect Vercel conectat sau domeniu configurat. Nu a fost creat PR/Preview și nu s-a făcut deploy în producție.

Contact: `mailto:webdynamicx@gmail.com`. Nicio credențială SMTP nu a fost salvată. Mailto deschide aplicația de e-mail, fără trimitere din site.

Pornire locală a exportului: `npm start`, apoi http://127.0.0.1:4173.
