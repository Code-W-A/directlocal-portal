> Istoric: raport anterior extinderii din 15.10.2026. Cifrele, exportul static și politica noindex descriu versiunea de atunci. Politica actuală este în docs/seo/SEO-PLAYBOOK.md și auditul datat.

# DirectLocal.ro — implementare UX și SEO

Data: 2026-10-12. Implementare locală; domeniul și indexarea globală nu au fost activate.

## Modificări

- Homepage compact, căutare în fluxul paginii, secțiunea Județe cu legături către cele patru zone documentate.
- Card comun al firmei în homepage, căutare și pagini geografice: fotografie distinctă, serviciu, acoperire, descriere, dată documentară, telefon și profil.
- Patru fotografii tematice Pexels cu proveniență în src/content/images.json și docs/IMAGES.md. 24 de derivate AVIF/WebP; etichete „Imagine ilustrativă”; fără asociere falsă cu sediul/echipa și fără LocalBusiness.image.
- Profiluri cu telefon la început, fotografie compactă și contact înaintea detaliilor pe mobil. Sediul este separat de acoperire.
- Introduceri locale 20–60 de cuvinte, H1 simplificat, firme înaintea ghidului. Județele prezintă numai localități documentate; Ilfov păstrează acoperirea județeană.
- Navigare activă, footer lizibil pe mobil, surse nerelevante eliminate din Contact/Metodologie și 404 cu acces la căutare/servicii.
- Registru de imagini validat în prebuild, inclusiv fișiere, proveniență și asignarea distinctă. Schema de validare rămâne în codul de build, separat de datele folosite în browser.

## Rezultate verificări

| Verificare | Rezultat |
| --- | --- |
| Validare conținut | 1 serviciu, 4 firme, 3 orașe; 18 rute publice |
| Lint și TypeScript | Trecute |
| Teste unitare | 40/40 |
| Build static și verificare export | Trecute: HTML, linkuri, metadata, JSON-LD, sitemap, 404 |
| Teste browser | 44/44, un worker, Chromium desktop/mobil |
| Toate cele 18 pagini × 360, 390, 768, 1440 px | Fără overflow; imagini încărcate și zero încălcări axe detectate |
| Navigare fără JavaScript | Toate cele patru trasee geografice până la firmă trecute |
| Indexare | noindex în toate cele 18 pagini; fără canonical fictiv |
| Surse foto | Licențe și pagini originale consultate; fiecare derivat sub 160 KB |

Testele noi sunt în tests/images.test.ts și tests/browser/site-ux.spec.ts. Testele existente au fost adaptate pentru numele scurt al legăturilor locale, cele patru imagini suplimentare și noua navigare 404. Datele fictive rămân exclusiv în teste.

## Performanță locală

Lighthouse mobil, câte o rulare pe configurație; scorurile de laborator pot varia.

| Pagină/configurație | Performance | LCP | CLS | Transfer total |
| --- | ---: | ---: | ---: | ---: |
| Homepage înainte, serverul vechi fără compresie | 82 | 4,82 s | 0 | 722 KB |
| Homepage după, același server fără compresie | 80 | 5,27 s | 0 | 844 KB |
| Homepage după, serverul actual cu compresie | 96 | 2,80 s | 0 | 355 KB |
| Profil Alpha înainte, fără compresie | 86 | 4,14 s | 0 | 652 KB |
| Profil Alpha după, cu compresie | 98 | 2,35 s | 0 | 244 KB |

Serverul care era deja pornit la început nu aplicase actualizarea existentă pentru gzip/cache. A fost repornit cu scripts/serve-export.mjs din proiect. Diferența de scor include această schimbare de servire; nu este atribuită exclusiv redesignului. Fotografiile suplimentare cresc transferul brut. Pe configurația actuală, Accessibility și Best Practices sunt 100 pentru ambele pagini măsurate. LCP homepage de 2,80 s rămâne peste reperul de 2,5 s; nu există măsurători de trafic real sau dovadă de Core Web Vitals în producție.

Rapoarte JSON: docs/reports/site-ux/*performance*.json. Compresia/cache și statusul 404 trebuie păstrate de găzduirea statică la publicare.

## Capturi comparative

- [Homepage înainte](reports/site-ux/home-before.png) / [după](reports/site-ux/home-after.png)
- [Pagina locală înainte](reports/site-ux/local-before.png) / [după](reports/site-ux/local-after.png)
- [Profil înainte](reports/site-ux/profile-before.png) / [după](reports/site-ux/profile-after.png)
- [Căutare înainte](reports/site-ux/search-before.png) / [după](reports/site-ux/search-after.png)
- [Homepage 360 px](reports/site-ux/_360.png)
- [Profil 390 px](reports/site-ux/_firme_alpha-cleaning_390.png)

Capturile tuturor rutelor la toate lățimile sunt și în /tmp/directlocal-ux-final. Capturile au fost revizuite pentru homepage, pagină locală și profil pe desktop și mobil.

## Limite

Nu s-au publicat categorii, firme, localități, prețuri sau recenzii noi. Nu s-a activat indexarea globală și nu s-a făcut deploy. Eligibilitatea editorială individuală existentă rămâne distinctă de noindex efectiv. Modificările de design nu garantează poziții în Google.
