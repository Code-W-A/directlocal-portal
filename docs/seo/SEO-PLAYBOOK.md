# Reguli editoriale și SEO

1. Satisface intenția de găsire și comparare a firmelor; nu pretinde comparație completă când există un singur profil.
2. Lista firmelor apare înaintea textului editorial lung.
3. Introducerea locală are 70–120 de cuvinte.
4. Folosește expresia principală natural, fără densitate prestabilită.
5. Nu folosi keyword stuffing.
6. Nu introduce informații turistice irelevante.
7. Nu copia și nu rescrie textele concurenților.
8. Nu publica pagini care diferă doar prin numele orașului.
9. Nu inventa prețuri sau statistici.
10. Susține orice afirmație concretă despre o firmă cu surse.
11. Nu utiliza superlative nesusținute.
12. Include numai secțiuni cu informație utilă.
13. Fiecare pagină locală trebuie să aibă valoare distinctă.
14. Marchează explicit listările sponsorizate. PoC-ul nu are sponsorizări.
15. Informațiile insuficiente impun `noindex`.

## Publicare și indexare

`status: published` produce HTML; `indexStatus: index` cere eligibilitate și revizuire editorială. O pagină poate avea o singură firmă dacă oferă contact utilizabil, serviciu și zonă susținute de surse, informații distincte și fără afirmații nesusținute. Numărul de firme nu este o cerință Google și nu mai constituie un prag automat. Paginile și profilurile eligibile necesită editorialReviewed și reviewNote cu justificarea verificării. Indexarea efectivă cere și `INDEXING_ENABLED=true`, domeniu real și mediu non-preview. Indexarea globală rămâne dezactivată; eligibilitatea din date nu activează singură indexarea HTML.

Similarity: Jaccard pe secvențe de cinci cuvinte, text normalizat din introducere și corp pentru toate paginile de oraș și județ; componentele comune nu intră în comparație. Pragul ≥0,80 blochează publicarea. Această euristică nu înlocuiește revizuirea umană și verificarea factuală.

## URL și metadata

Sluguri ASCII lowercase, cratime și slash final. O singură adresă pentru fiecare intenție. Canonical propriu și OG URL numai cu domeniu real. Căutarea nu are canonical și rămâne noindex; stările filtrelor nu schimbă URL-ul. Sitemap derivat din registru, numai pagini efectiv indexabile. Roboții trebuie să poată citi noindex.

## Imagini

Numai imagini proprii ori licențe comerciale explicite verificate. Fișiere locale WebP/AVIF, dimensiuni și alt descriptiv; proveniența include autor, sursă, licență și data consultării/creării. Fără fotografii generice prezentate ca echipa ori sediul firmei.

## Limitele automatizării

Validarea surselor verifică prezența și legăturile lor, nu adevărul unei propoziții. Lista de expresii interzise detectează exemple, nu toate exagerările. Confirmarea factuală și aprobarea indexării rămân editoriale.


## Redactare naturală și surse metodologice

Scrie pentru o persoană care caută un furnizor: contact, acoperire, ce include serviciul și ce trebuie clarificat. Folosește paragrafe scurte și verbe concrete. Evită jargonul, introducerile promoționale și repetarea artificială a expresiei serviciu–oraș. Revizuiește fiecare pagină independent; nu folosi numai înlocuirea numelui localității.

Introducerea de 70–120 de cuvinte este un reper editorial al proiectului, nu o regulă de clasare Google. Nu umple paginile pentru a atinge un număr de cuvinte. Nu promite poziții SEO pe baza KD.

Surse consultate la 2026-10-12:
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content — utilitate, originalitate, surse și lipsa unui număr preferat de cuvinte.
- https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse — evitarea paginilor similare care intermediază inutil accesul la informație.

Aplicare: paginile țintă oferă contact și detalii direct; paginile părinte restrânse rămân noindex. Scrierea naturală nu constituie dovadă de verificare factuală și nu garantează clasarea.
