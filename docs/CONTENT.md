# Publicarea conținutului

Catalogul este local: `services`, `counties`, `locations`, `companies` sunt JSON; `pages` este Markdown cu frontmatter YAML (JSON este valid YAML). Schemele stricte sunt în `src/lib/content/schemas.ts`.

Fiecare înregistrare are id, slug ASCII, status și updatedAt. Localitatea referă countyId. Paginile au kind `service`, `county`, `local` sau `editorial`, title, seo, intro, body, sources, editorialReviewed și indexStatus. Profilurile au indexStatus și sponsored explicit.

Sursele au id, URL, checkedAt și note. Profilurile referă sursele pentru contact, sediu, serviciu și fiecare localitate. Vezi profilul PoC pentru forma concretă. Nu extrapola acoperirea tuturor serviciilor dintr-o listă generică de orașe.

Publică explicit întâi pagina serviciului, apoi județul și localitatea. Adaptoarele generează doar parametrii paginilor publicate; drafturile nu apar în HTML, căutare sau sitemap. Editorialele acceptate sunt despre-noi, contact și metodologie; un tip nou cere adaptor și verificare de export.

Rulează `npm run check` și `npm run test:browser`. Verifică sursele manual înainte de a marca editorialReviewed. `indexStatus: index` nu elimină blocarea globală. Numărul de firme nu blochează singur eligibilitatea; documentează evaluarea în reviewNote și păstrează indexarea globală dezactivată până la lansarea autorizată.

Contactul folosește adresa publică din configurație, prin mailto. Nu necesită SMTP și nu conține un formular de trimitere.

Acoperire: `offerings[].coverage` conține orașe explicite; `countyCoverage` conține `{ countyId, sourceIds }`. Cel puțin una dintre liste trebuie să fie nevidă. Acoperirea județeană nu generează orașe sau pagini. Paginile de județ pot avea `companyIds` pentru liste directe; cele fără firme rămân huburi de navigare. Filtrarea pe oraș nu folosește implicit acoperirea județeană.
