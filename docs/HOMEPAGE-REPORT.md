> Istoric: raport anterior extinderii din 15.10.2026. Cifrele, exportul static și politica noindex descriu versiunea de atunci. Politica actuală este în docs/seo/SEO-PLAYBOOK.md și auditul datat.

# Homepage DirectLocal.ro — implementare și verificări

Data: 2026-10-12. Implementare locală pe branch-ul existent `feat/local-directory-poc`, fără deploy. Referința vizuală: imaginea furnizată de utilizator. Brandul DirectLocal.ro este identitate vizuală; nu reprezintă configurarea sau verificarea deținerii unui domeniu.

## Ce s-a implementat

- Header cu logo original pin, favicon și identitate DirectLocal.ro, navigație și CTA mailto. Footer comun cu datele reale de contact și paginile existente.
- Homepage alb/albastru, hero fotografic, căutare serviciu–județ–oraș, beneficii formulate factual, serviciul real, patru zone, patru firme în ordine alfabetică, pași de utilizare și propunere de firmă prin email.
- Numai formularul de selecție este Client Component; conținutul, profilurile și legăturile sunt prezente în HTML static. Selectorii dependenți se resetează, iar Ilfov nu primește un oraș fictiv.
- Fără selecție: `/cauta/`. Serviciu: pagina serviciului. Județ: pagina județului. Oraș: pagina locală exactă publicată. Fără parametri de filtrare în URL. Navigația directă rămâne accesibilă fără JavaScript.
- Două fotografii Pexels cu proveniență în [IMAGES.md](IMAGES.md), 10 derivate AVIF/WebP și o imagine socială JPEG 1200×630. Dimensiuni, srcset/sizes, hero eager/high și fotografie secundară lazy. Logo și pictograme SVG originale.
- Titlu, H1 și metadata în registrul centralizat; două ItemList sincronizate cu listele vizibile. WebSite și adresele absolute pentru imaginea socială se emit numai cu SITE_URL. LocalBusiness rămâne exclusiv pe profiluri.
- Serverul de preview servește MIME AVIF/JPEG corect, gzip pentru text și cache pentru active. Acesta este exclusiv un utilitar local, nu backend-ul aplicației și nu configurația hostingului viitor.

## URL-uri

Nu s-au adăugat rute. Cele 18 pagini publice rămân:

```text
/
/servicii/
/servicii/curatare-canapele/
/servicii/curatare-canapele/brasov/
/servicii/curatare-canapele/brasov/brasov/
/servicii/curatare-canapele/timis/
/servicii/curatare-canapele/timis/timisoara/
/servicii/curatare-canapele/constanta/
/servicii/curatare-canapele/constanta/constanta/
/servicii/curatare-canapele/ilfov/
/firme/igienizare-tapiterie/
/firme/zoom-cleaning/
/firme/alpha-cleaning/
/firme/detailing-mobil/
/cauta/
/despre-noi/
/contact/
/metodologie/
```

## Verificări

- `npm run check`: lint fără avertismente, **35 teste unitare**, conținut valid, build static, verificarea celor 18 HTML-uri și TypeScript — toate trecute.
- `DIRECTORY_TEST_PORT=4174 npm run test:browser`: **16 teste trecute**, desktop și mobil, inclusiv filtre, resetări, Ilfov, navigare cu tastatura, listare alfabetică, email/telefon, JavaScript dezactivat, profiluri, surse și 404.
- Lățimi verificate: 360, 390, 768 și 1440 px. Fără overflow orizontal. Axe fără încălcări în scenariile testate; verificare suplimentară pentru corespondența textului vizibil cu numele accesibil.
- Verificator export: un singur H1/pagină, metadata unică, legături și ancore, surse și date, ItemList/WebSite/LocalBusiness, existența derivatelor srcset, dimensiuni, alt, prioritatea hero, robots și sitemap.
- Teste cu configurații controlate pentru canonical, imagine socială, WebSite și indexare; nicio activare în configurația reală.
- `npm audit --omit=dev`: **0 vulnerabilități**. Auditul complet semnalează 5 intrări high în lanțul existent de dezvoltare ESLint → fast-glob → micromatch → braces. Nu s-a aplicat downgrade-ul major sugerat automat. Aceste pachete nu se livrează în exportul static.

## Capturi

- [Desktop 1440 px](reports/homepage/homepage-desktop.png)
- [Mobil 390 px](reports/homepage/homepage-mobile.png)

## Limite păstrate

Toate paginile sunt efectiv noindex și sitemap-ul este gol, conform politicii aprobate. Nu s-a configurat SITE_URL și nu s-a făcut deploy. Canonical și OG absolute necesită domeniu real; testele controlate nu confirmă configurația unui site public.

Lighthouse este o măsurare locală de laborator pe serverul gzip/cache descris mai sus. Hostingul, HTTP/2/3, cache-ul CDN, compresia efectivă și Core Web Vitals din trafic real necesită verificare după publicare. Scorurile nu garantează clasarea în Google. CTA de adăugare deschide clientul de email și nu trimite automat mesaje.

## Fișiere modificate

- Homepage și UI: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/icon.svg`, `src/components/home/*`, `src/components/layout/*`, `src/components/ui/Icon.tsx`. Vechiul `src/app/page.module.css` nefolosit a fost eliminat.
- Date derivate/config/SEO: `src/lib/content/home-search.ts`, `src/config/site.ts`, `src/lib/seo/{metadata,registry,verify-schema}.ts`.
- Active și tooling: `public/images/*`, `scripts/prepare-home-images.mjs`, `scripts/serve-export.mjs`, `scripts/verify-export.ts`, `package.json`, `package-lock.json`.
- Teste: `playwright.config.ts`, `tests/home-search.test.ts`, `tests/browser/site.spec.ts`, `tests/seo.test.ts`, `tests/schema.test.ts`.
- Documentație: README, ARCHITECTURE, IMAGES, acest raport și rapoartele/capturile din `docs/reports/homepage/`.

## Surse

- [Google: bune practici SEO pentru imagini](https://developers.google.com/search/docs/appearance/google-images) — imagini HTML, responsive, format, dimensiuni, context, alt descriptiv și metadata.
- [Licența Pexels](https://www.pexels.com/license/) și paginile celor doi fotografi documentate în IMAGES.md.
- Datele firmelor provin din catalogul existent și sursele sale publice. Nu s-au introdus noi afirmații comerciale, recenzii, tarife ori contacte WhatsApp.

## Lighthouse final — versiunea 13.5.0

URL local auditat: `http://127.0.0.1:4175/`, export static, Chrome headless, profil mobil implicit / preset desktop, compresie gzip activă. Rezultatele sunt punctuale și pot varia între rulări.

| Măsurare | Mobil | Desktop |
| --- | ---: | ---: |
| Performanță | 97/100 | 100/100 |
| Accesibilitate | 100/100 | 100/100 |
| Bune practici | 100/100 | 100/100 |
| SEO | 66/100 | 66/100 |
| LCP | 2,6 s | 0,5 s |
| CLS | 0 | 0 |
| TBT | 20 ms | 0 ms |

Singura verificare SEO aplicabilă care nu trece este `is-crawlable`, exclusiv din cauza `noindex` intenționat. Canonical este neaplicabil fără domeniu; schema este verificată separat prin validatorul proiectului. Nu am dezactivat noindex pentru a crește artificial scorul. LCP mobil 2,6 s rămâne puțin peste reperul de 2,5 s; nu declarăm Core Web Vitals din trafic real ca fiind validate. INP necesită măsurători de utilizare reală.

Prima rulare pe serverul local fără compresie a avut performanță mobil 80 și LCP 5,2 s. Optimizările includ preîncărcarea fonturilor și servirea locală gzip/cache; configurația de hosting trebuie verificată separat. Rămân sugestii Lighthouse pentru JavaScript neutilizat/compatibilitate din runtime-ul Next și durata cache-ului activelor. Nu am modificat framework-ul sau politica de indexare pentru scor.

- [Raport mobil HTML](reports/homepage/lighthouse-mobile.report.html) · [JSON](reports/homepage/lighthouse-mobile.report.json)
- [Raport desktop HTML](reports/homepage/lighthouse-desktop.report.html) · [JSON](reports/homepage/lighthouse-desktop.report.json)

## Ajustare navbar

Ordinea aprobată: Logo → Servicii → Județe → Firme → Despre → Contact → Adaugă firma. Linkul „Acasă” a fost eliminat din navigația principală; logo-ul duce la homepage. „Despre” deschide `/despre-noi/`. Logo-ul are zonă de apăsare de minimum 44 px.

Verificări: `npm run check` trecut (35 teste), build final cu paritate export trecut, 6 teste browser relevante trecute. Verificare directă în Chromium la 360/390/768/1440 px: ordinea și destinațiile exacte, focusul Tab până la CTA, zone de apăsare de minimum 44 px și lipsa overflow-ului. Capturile desktop/mobil au fost actualizate. Rapoartele Lighthouse de mai sus provin din versiunea homepage-ului anterioară acestei ajustări minore de navbar; auditul Lighthouse nu a fost repetat pentru această schimbare.
