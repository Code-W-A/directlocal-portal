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

`status: published` produce HTML; `indexStatus: index` cere eligibilitate și revizuire editorială. O pagină locală are nevoie de minimum trei firme, surse pentru serviciu și localitate, conținut distinct și fără afirmații nesusținute. Indexarea efectivă cere și `INDEXING_ENABLED=true`, domeniu real și mediu non-preview. PoC-ul rămâne integral noindex.

Similarity: Jaccard pe secvențe de cinci cuvinte, text normalizat din introducere și corp; componentele comune nu intră în comparație. Pragul ≥0,80 blochează publicarea. Această euristică nu înlocuiește revizuirea umană și verificarea factuală.

## URL și metadata

Sluguri ASCII lowercase, cratime și slash final. O singură adresă pentru fiecare intenție. Canonical propriu și OG URL numai cu domeniu real. Căutarea nu are canonical și rămâne noindex; stările filtrelor nu schimbă URL-ul. Sitemap derivat din registru, numai pagini efectiv indexabile. Roboții trebuie să poată citi noindex.

## Imagini

Numai imagini proprii ori licențe comerciale explicite verificate. Fișiere locale WebP/AVIF, dimensiuni și alt descriptiv; proveniența include autor, sursă, licență și data consultării/creării. Fără fotografii generice prezentate ca echipa ori sediul firmei.

## Limitele automatizării

Validarea surselor verifică prezența și legăturile lor, nu adevărul unei propoziții. Lista de expresii interzise detectează exemple, nu toate exagerările. Confirmarea factuală și aprobarea indexării rămân editoriale.
