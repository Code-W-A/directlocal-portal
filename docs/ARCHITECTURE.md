# Arhitectură

Fișiere locale → Zod și validare de relații/surse → registru public → adaptoare App Router și șabloane → export HTML/CSS/JS în `out`.

Rutele sunt `/`, `/servicii/`, `/servicii/[serviciu]/`, `/servicii/[serviciu]/[judet]/`, `/servicii/[serviciu]/[judet]/[oras]/`, `/firme/[firma]/`, `/cauta/`, `/despre-noi/`, `/contact/`, `/metodologie/`. Pagina 404, sitemap și robots completează exportul.

`generateStaticParams` provine exclusiv din paginile publicate; `dynamicParams=false`. Taxonomia nu produce automat combinații. O firmă are o singură identitate și ofertă cu dovezi per serviciu/localitate. Șabloanele primesc date din același catalog validat.

Căutarea primește la build un index minimal serializat. Filtrarea este client-side; toate cele trei criterii trebuie să corespundă aceleiași asocieri serviciu–oraș. Stările nu se scriu în URL. Lista inițială rămâne vizibilă fără JavaScript.

Registrul public include atât index cât și noindex. Sitemap folosește doar subsetul indexabil efectiv. Metadata folosește politica globală, indexStatus și mediul de preview. Fără SITE_URL nu se emit adrese canonice fictive; referințele interne JSON-LD sunt relative în exportul local, absolute cu domeniu configurat.

Nu există backend, API, CMS, baze de date, autentificare, ISR, server actions sau middleware. `npm start` este un server local pentru fișierele exportate. Imaginile sunt locale; optimizatorul runtime este dezactivat. Schimbarea unui slug public cere redirect permanent la hosting, nu JavaScript.

Ofertele pot declara separat orașe și județe, fiecare cu surse. Județele nu sunt convertite în orașe fictive; căutarea după oraș cere acoperire explicită. Pagina de județ poate afișa direct firme și ItemList înainte de textul editorial. Regula de minimum trei firme a fost înlocuită cu evaluare editorială documentată, fără modificarea blocării globale a indexării.
