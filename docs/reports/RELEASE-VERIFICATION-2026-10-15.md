# DirectLocal — verificare pentru lansare

Data: 15 octombrie 2026. Verificări locale pe build Next.js de producție. Domeniu configurat: **https://directlocal.ro**. Nu s-au făcut deploy, modificări DNS sau trimiteri de emailuri reale.

## Rezultat

Proiectul este pregătit local pentru lansare: **104 pagini publice, 103 indexabile în producție, 17 servicii și 31 profiluri unice**. Căutarea rămâne noindex. Cele 40 de oportunități au decizii documentate: 28 publicate, 9 mapate la pagini consolidate, 3 păstrate ca brief-uri interne.

## Verificări executate

| Verificare | Rezultat |
|---|---|
| Lint și TypeScript | Trecute, fără erori. |
| Teste automate | **53/53 trecute**, inclusiv validarea datelor, metadate, schema, destinatari și transport SMTP simulat. |
| Validarea conținutului | Trecută: surse, referințe, date, acoperire, contacte, revizie editorială și controlul duplicării. |
| Build de producție | Trecut; **104 documente HTML** verificate, plus 404, legături interne, pagini orfane, canonical, metadata, JSON-LD și concordanța sitemapului. |
| Browser | **74/74 trecute într-o rulare finală completă**, Chromium desktop și mobil. |
| Toate paginile | 104 rute × **360/390/768/1440 px**: status 200, un H1, fără depășiri sau elemente tăiate, imagini încărcate, metadata și axe fără încălcări detectate. |
| Fără JavaScript | HTML-ul tuturor paginilor verificat la build; în browser, catalog, navigare geografică, profiluri și contacte, inclusiv o rută nouă consolidată. |
| Preview | Build separat cu `VERCEL_ENV=preview` și `INDEXING_ENABLED=true`: noindex păstrat, sitemap gol, canonical spre originea aprobată; verificatorul celor 104 pagini a trecut. |
| Domeniu și API | Redirect 308 pentru www, cu cale și parametri păstrați; fără redirect localhost/apex. API noindex, origine locală respinsă în producție înainte de SMTP. |
| Secrete | Valoarea parolei SMTP locale nu apare în fișierele versionabile ale proiectului; nu a fost inclusă în rapoarte. |

Filtrele au fost verificate pentru toate cele 17 identități de serviciu, selecții cu mai multe servicii, resetări dependente, diacritice, lipsă rezultate, navigare cu tastatura și închidere fără schimbarea valorii. Numele accesibil al dropdownului include acum și valoarea vizibilă selectată.

Formularele au teste pentru validare, destinatar rezolvat pe server, copie administrator, erori și confirmarea acceptării SMTP. Niciun test nu trimite mesaje reale firmelor. Lipsa configurației sau eșecul păstrează alternativa de contact direct.

Jurnale: [verificări și build](release-2026-10-15/checks.log), [browser complet](release-2026-10-15/browser.log), [build preview](release-2026-10-15/preview-build.log). Capturi reprezentative: [home 360 px](release-2026-10-15/_360.png), [pagină locală 360 px](release-2026-10-15/_servicii_panouri-fotovoltaice_bacau_bacau_360.png), [profil 390 px](release-2026-10-15/_firme_voltecon_390.png), [catalog desktop](release-2026-10-15/_servicii_1440.png).

## Performanță de laborator

Lighthouse 13, Chromium, build de producție local, simulare mobilă. Nu sunt date Core Web Vitals de teren.

| Pagină | Performanță | Accesibilitate | Best practices | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---|---:|
| Homepage, două măsurători finale | 97 / 99 | 100 | 100 | 100 | 2,55 / 2,11 s | 0 |
| Panouri fotovoltaice Bacău | 99 | 100 | 100 | 100 | 2,20 s | 0 |
| Caută firme | 97 | 100 | 100 | 63 | 2,50 s | 0 |

Scorul SEO de 63 al căutării reflectă `noindex`, cerut de politică; nu trebuie eliminat pentru a obține 100 în Lighthouse. Timpul de blocare total a fost 49–79 ms în măsurătorile finale ale homepage-ului.

Prima măsurătoare a homepage-ului a fost 82, cu Speed Index 13,4 s; două repetări au dat 97 și 99, fără o optimizare a codului care să explice singură diferența. Păstrăm și rezultatul inițial, nu îl tratăm ca progres SEO demonstrat. Auditul a identificat separat eticheta accesibilă incompletă a dropdownurilor; aceasta a fost corectată și verificată din nou.

Rămân recomandările de laborator pentru JavaScript neutilizat (~51 KiB), compatibilitate JavaScript (~12 KiB) și CSS care blochează randarea. Nu au fost eliminate mecanisme ale frameworkului doar pentru scor. [Rezultate structurate și măsurători inițiale](performance-2026-10-15.json); rapoartele Lighthouse complete sunt salvate în același director.

## Limite și pași după publicare

- Testele mobile sunt simulări Chromium, nu o verificare pe telefoane fizice. Comportamentul tastaturii reale trebuie confirmat pe iOS/Android.
- Verificările locale nu confirmă DNS, HTTPS sau redirecturile de pe infrastructura publică.
- Variabilele SMTP trebuie configurate la găzduire; livrarea reală și copia administratorului se verifică ulterior cu o adresă controlată.
- Search Console se configurează pe domeniul public, apoi se trimite sitemapul și se inspectează URL-uri reprezentative. Indexarea și clasarea nu sunt garantate.
- Core Web Vitals de teren se urmăresc după apariția traficului și datelor suficiente.

Pentru lansare: preset Next.js, fără `Output Directory: out`, origine `https://directlocal.ro`, variabilele server din `.env.example`. Pe staging în afara Vercel se setează `INDEXING_ENABLED=false` înainte de build. Canonical și sitemap sunt pregenerate, deci schimbările de mediu cer rebuild.

Inventare: [toate URL-urile locale](../seo/URL-INVENTORY-2026-10-15.md), [cele 40 de decizii](../research/REGISTRY-RESULTS-2026-10-15.md), [audit SEO](../seo/AUDIT-2026-10-15.md), [ghidul editorial](../seo/SEO-PLAYBOOK.md).
