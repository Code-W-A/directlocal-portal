# Publicarea conținutului

Catalogul este local: `services`, `counties`, `locations`, `companies` sunt JSON; `pages` este Markdown cu frontmatter YAML (JSON este valid YAML). Schemele stricte sunt în `src/lib/content/schemas.ts`.

Catalogul `/servicii/` citește textele de prezentare și ghidul din `src/content/service-directory.json`, validate cu Zod în `src/lib/content/service-directory.ts` și incluse în `validate:content`. Cardurile folosesc numele și descrierea serviciilor publicate cu pagină de serviciu publicată. Legăturile de județ provin numai din paginile publicate pentru serviciul respectiv; listele sunt alfabetice. Catalogul folosește iconuri; fotografia ilustrativă a canapelei apare doar în pagina dedicată serviciului. ItemList enumeră serviciile vizibile, iar metadata și politica de indexare provin din registrul SEO existent.

Pagina `/despre-noi/` folosește șablonul `AboutPage`: titlul, introducerea, cele trei paragrafe de prezentare și secțiunile structurate `about` provin din `src/content/pages/despre-noi.md`. Schema validează cardurile și textele; regulile pentru afirmații se aplică și acestora. Paginile editoriale despre funcțiile platformei pot avea `sources: []`; firmele și paginile de servicii păstrează cerința surselor externe. Pagina Despre trimite către metodologia directorului, fără a atribui descrierea platformei unui website de firmă.

Fiecare înregistrare are id, slug ASCII, status și updatedAt. Localitatea referă countyId. Paginile au kind `service`, `county`, `local` sau `editorial`, title, seo, intro, body, sources, editorialReviewed și indexStatus. Profilurile au indexStatus și sponsored explicit.

Sursele au id, URL, checkedAt și note. Profilurile referă sursele pentru contact, sediu, serviciu și fiecare localitate. Vezi profilul PoC pentru forma concretă. Nu extrapola acoperirea tuturor serviciilor dintr-o listă generică de orașe.

Publică explicit întâi pagina serviciului, apoi județul și localitatea. Adaptoarele generează doar parametrii paginilor publicate; drafturile nu apar în HTML, căutare sau sitemap. Editorialele acceptate sunt despre-noi, contact, metodologie și inscriere-firma; un tip nou cere adaptor și verificare de export.

Rulează `npm run check` și `npm run test:browser`. Verifică sursele manual înainte de a marca editorialReviewed. `indexStatus: index` nu elimină blocarea globală. Numărul de firme nu blochează singur eligibilitatea; documentează evaluarea în reviewNote. Indexarea pentru producție a fost autorizată pentru domeniul directlocal.ro.

Contactul folosește API-ul SMTP, cu telefon/email ca alternativă. Înscrierea minimală cere numele firmei, reprezentantul și telefonul; publicarea este manuală.

Acoperire: `offerings[].coverage` conține orașe explicite; `countyCoverage` conține `{ countyId, sourceIds }`. Cel puțin una dintre liste trebuie să fie nevidă. Acoperirea județeană nu generează orașe sau pagini. Paginile de județ pot avea `companyIds` pentru liste directe; cele fără firme rămân huburi de navigare. Filtrarea pe oraș nu folosește implicit acoperirea județeană.

### Imagini ilustrative și rezumate locale

Profilurile publicate folosesc iconuri și nu necesită fotografii. imageId este opțional; dacă există, trebuie să refere src/content/images.json, iar validarea verifică proveniența și fișierele. Cardurile și profilurile nu afișează fotografiile generice. Fotografii reale ale firmelor vor putea fi introduse după verificarea sursei și a drepturilor de utilizare, printr-un flux separat de imaginile ilustrative. Imaginile nu constituie dovezi despre firme. Textele alternative descriu fotografia, fără nume de firmă sau localitate deduse.

Introducerile locale au 20–60 de cuvinte pentru acces rapid la listări. Detaliile documentate și limitele rămân în corpul editorial de după firme. Acest interval este o convenție UX, nu o cerință Google.

## Politică de indexare — 2026-10-15

Nu există prag numeric obligatoriu. Pagina trebuie să aibă firmă relevantă cu contact, dovezi pentru serviciu/acoperire și informație distinctă. Paginile incomplete rămân brief-uri interne. Similaritatea excesivă nu se rezolvă prin sinonime: se consolidează intențiile într-un URL util.

## Profiluri simplificate — 2026-10-15

Profilurile afișează contactele oficiale, data consultării și un singur link „Propune o corectură”, cu adresa profilului inclusă în subiectul emailului. Notele documentare și URL-urile de dovezi rămân în conținutul sursă, validate la build, fără bloc public detaliat. Data afișată este cea mai veche dintre datele surselor folosite, pentru a nu sugera că toate informațiile au fost reverificate la data celei mai recente surse. Limitele generale ale listării sunt explicate în Metodologie.
