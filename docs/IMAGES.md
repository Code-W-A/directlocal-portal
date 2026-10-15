# Proveniența imaginilor

- Fișier: `public/images/canapea.webp`; sursă editabilă: `public/images/canapea.svg`.
- Autor: ilustrație originală realizată în acest proiect cu forme geometrice; fără active externe.
- Creată: 2026-10-12. Nu există URL extern sau dată de acces la o bibliotecă.
- Drept de utilizare: activ original al proiectului, disponibil inclusiv pentru utilizare comercială; fără atribuire externă necesară.
- Generare: SVG 800×400 convertit cu sharp în WebP, calitate 85. Fără hotlink.
- Alt: „Ilustrație generică a unei canapele verzi cu două perne”. Caption vizibil precizează că nu este fotografia unei firme.

## Fotografii inițiale — arhivă 2026-10-12

| Utilizare | Fișiere | Autor și sursă |
| --- | --- | --- |
| Hero: vedere reală din Brașov | `brasov-panorama-{480,800,1200}.{avif,webp}` | Ferencz Istvan, [Pexels 12138592](https://www.pexels.com/photo/cityscape-of-brasov-romania-and-the-view-of-saint-nicholas-church-12138592/) |
| Serviciul curățare canapele, fotografie ilustrativă | `canapea-albastra-{360,720}.{avif,webp}` | shirin olyaei, [Pexels 2986011](https://www.pexels.com/photo/blue-sofa-2986011/) |
| Imagine socială inițială (înlocuită pe 2026-10-15) | `directlocal-social.jpg`, 1200×630 | Inițial decupaj al fotografiei din Brașov; versiunea actuală este documentată mai jos |

Licență consultată la 2026-10-12: https://www.pexels.com/license/ — permite utilizare și modificare gratuită, inclusiv comercială; nu prezentăm autorii ca susținători ai directorului. Fotografiile nu reprezintă lucrări, sedii sau echipe ale firmelor listate. Fotografia de canapea are legendă ilustrativă; fotografia orașului are localitate reală, distinctă de acoperirea furnizorilor.

Surse descărcate:
- https://images.pexels.com/photos/12138592/pexels-photo-12138592.jpeg?w=1800
- https://images.pexels.com/photos/2986011/pexels-photo-2986011.jpeg?w=1200

Reproducere: `node scripts/prepare-home-images.mjs /cale/brasov.jpg /cale/canapea.jpg` după descărcarea surselor. Sharp este dependență de dezvoltare explicită. Scriptul redimensionează, decupează și comprimă; build-ul nu depinde de internet. AVIF calitate 52, WebP 78. Scriptul nu mai regenerează imaginea socială. Hero folosește raport 1,22 și decupaj central, canapeaua 1,5 și decupaj inferior. Fără hotlink sau metadate EXIF private în derivate.

`LocalPhoto` folosește picture/source AVIF și img WebP cu srcset/sizes, dimensiuni și alt. Este utilizat acum doar pentru fotografia ilustrativă din pagina serviciului, cu eager + fetchpriority high. Imaginea socială emite URL absolut numai dacă există SITE_URL real configurat.

Logo-ul pin și favicon-ul sunt desene SVG originale realizate în proiect, fără active externe.

## Pagina Despre — 2026-10-12

`src/components/about/LocalIllustration.tsx` conține o ilustrație vectorială originală de 520×350, realizată în proiect din forme geometrice, cu clădiri, arbori și pini. Activ propriu pentru utilizare comercială; fără active sau surse externe. Rețeaua este abstractă și nu reprezintă o hartă geografică ori zonele de acoperire ale firmelor. SVG-ul este inline, decorativ (`aria-hidden`), cu dimensiuni explicite; nu necesită descărcarea unei imagini raster. Imaginea atașată de utilizator a fost referință pentru compoziție, nu activ redistribuit în export.

## Fotografii tematice pentru firme — 2026-10-12

Registrul versionat este în src/content/images.json. Aceste fotografii generice nu mai sunt asociate firmelor și nu mai sunt afișate în homepage, căutare, paginile locale sau profiluri începând cu 2026-10-15. Fișierele și proveniența sunt păstrate; randarea curentă folosește CompanyIdentity cu icon neutru. Nu reprezintă lucrările, angajații sau sediile firmelor și nu sunt incluse în LocalBusiness.image.

| Firmă | Fotografie / autor | Sursă |
| --- | --- | --- |
| Alpha Cleaning | Aspirare canapea bej — Mohammad abasi | https://www.pexels.com/photo/efficient-sofa-cleaning-with-handheld-vacuum-30238384/ |
| Detailing Mobil | Curățare fotoliu verde — Jesus Arias | https://www.pexels.com/photo/cleaner-vacuuming-a-sofa-chair-4401538/ |
| Igienizare Tapițerie | Curățare pernă — Jesus Arias | https://www.pexels.com/photo/person-cleaning-a-throw-pillow-4401537/ |
| Zoom Cleaning | Canapea albastră — shirin olyaei | https://www.pexels.com/photo/blue-sofa-2986011/ |

Licență Pexels: https://www.pexels.com/license/, consultată 2026-10-12. Permite folosire comercială și modificare; atribuirea nu este obligatorie. Nu presupunem asocierea sau susținerea firmelor de persoanele ori mărcile din imagini. Paginile fotografiilor au fost verificate; fotografia canapelei albastre are proveniența documentată și în secțiunea anterioară.

Derivate: 360×240, 720×480, 1080×720, AVIF (calitate 48) și WebP (76), fără metadate EXIF păstrate. Generare: node scripts/prepare-company-images.mjs /director/cu/originale; fișierele sursă sunt numite <photoId>.jpg. Fiecare derivat trebuie să rămână sub 160 KB, verificat prin teste. Fișierele mari originale nu sunt incluse în export.

Validarea conținutului verifică licența declarată, data, referințele opționale și prezența derivatelor. Nu impune o imagine sau o imagine distinctă per firmă. Aceasta nu înlocuiește verificarea umană a licenței.


## Harta României și imaginea socială — 2026-10-15

- Utilizare: harta decorativă din homepage și „Caută firme”; fără marcaje, județe selectabile, geolocalizare sau afirmații de acoperire.
- Sursă actuală: Natural Earth, 1:10m Admin 1 States Provinces, cele 42 de unități pentru România (41 de județe și municipiul București), din [fișierul oficial](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson). Conturul Admin 0 1:50m inițial rămâne arhivat în scripts/data/romania-natural-earth.geojson.
- Autorii datelor: Tom Patterson, Nathaniel Vaughn Kelso și colaboratorii Natural Earth.
- Licență: domeniul public; utilizarea comercială și adaptarea sunt permise. [Condiții verificate pe 2026-10-15](https://www.naturalearthdata.com/about/terms-of-use/).
- Copia locală a limitelor județelor și suma SHA-256 a fișierului sursă sunt în `scripts/data/romania-counties-natural-earth.geojson`. Proiecție equirectangulară, corecție de longitudine la 46°N; geometria este simplificată cu toleranță de 0,35 unități SVG. Abrevierile provin din codul ISO al fiecărei unități (B pentru București, IF pentru Ilfov). Etichetele sunt așezate în interiorul poligoanelor, respectând golul Bucureștiului din Ilfov. Stilizarea este proprie proiectului; imaginea și coordonatele ITP furnizate de utilizator sunt doar referință de aspect, fără copiere de active.
- Generare offline: `node scripts/prepare-romania-map.mjs`. Build-ul nu face solicitări către Natural Earth.
- Componentă: `RomaniaMap`, SVG inline cu dimensiuni și `aria-hidden=true`, fără ținte de focus. Contururile sunt fine, cu umplere aproape albă și abrevieri albastre. Pe mobil, înălțimea nu depășește 112 px; abrevierile sunt ascunse pentru a evita textul ilizibil. Limitele administrative rămân vizibile și nu indică acoperirea firmelor.
- Active generate: `src/components/ui/romania-outline.json`, `public/images/romania-map.svg`, `public/images/directlocal-social.svg` și `public/images/directlocal-social.jpg`.
- Imagine socială: 1200×630, JPEG calitate 86, hartă și identitatea DirectLocal.ro; fără fotografie din Brașov. URL-ul absolut este emis doar dacă există SITE_URL real configurat.
- Nu se copiază iconuri, imagini sau texte de pe med.ro. Iconul neutru al firmei este desenat în sistemul SVG existent.
