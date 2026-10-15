# DirectLocal — Analytics

Configurare verificată la 2026-10-15. Codul este publicat pe https://directlocal.ro din branch main (commitul funcțional 081dbd3). Vercel a confirmat Ready în Production, iar GA4 Realtime a confirmat colectarea reală.

## Cont și asociere

- Cont existent: Web-Dynamicx-New-Site, ID 367543320.
- Proprietate separată: DirectLocal.ro, ID 559112900.
- Flux web: DirectLocal — Web, ID 16135119650, https://directlocal.ro.
- Measurement ID public: G-1EK33H5G21.
- Search Console: proprietatea Domain directlocal.ro asociată cu acest flux; Google a confirmat „Link created successfully”.
- Enhanced measurement dezactivat pentru a evita colectarea automată a căutărilor, formularelor și dublarea evenimentelor proprii.
- Vercel, proiect directlocal-portal: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-1EK33H5G21, Config, exclusiv Production. Salvat și inclus în deploymentul de producție verificat.

## Evenimente

| Eveniment | Declanșare | Interpretare |
| --- | --- | --- |
| phone_click | Click pe telefonul unei firme | Intenție de contact; apelul efectiv nu poate fi confirmat |
| company_website_click | Click pe website din profilul firmei | Acces către furnizor; nu dovedește o solicitare |
| company_message_accepted | API-ul confirmă acceptarea mesajului | Acceptare la trimitere; nu livrare sau citire |
| company_submission_accepted | API-ul confirmă acceptarea înscrierii | Solicitare de contact, nu publicare automată |
| search_no_results | Selecție fără rezultate, stabilă timp de 800 ms | Lipsă de rezultate în catalog, nu dovadă a cererii pieței |

Cele două evenimente `*_accepted` sunt configurate drept key events în GA4, o dată per eveniment, fără valoare monetară prestabilită. Clickurile nu sunt prezentate ca leaduri confirmate.

Dimensiuni personalizate la nivel de eveniment: Firma (`company_id`), Serviciu (`service_id`), Județ (`county_id`), Localitate (`city_id`). Identificatorii sunt cei publici din catalog; identificatorii geografici/serviciului se trimit când filtrele îi furnizează. Parametrii de căutare includ numai `has_text_query` și `query_length`, fără textul introdus.

## Acord și minimizarea datelor

- Google tag nu este încărcat înainte de acceptarea explicită. Refuzul permite folosirea normală a site-ului.
- Alegerea se păstrează local 180 zile; poate fi schimbată din „Preferințe cookies” în footer.
- Retragerea acordului oprește evenimentele, setează dezactivarea GA și șterge cookie-urile Analytics accesibile site-ului.
- Nu transmitem nume, email, telefon, mesaj, denumirea introdusă în formular sau textul liber al căutării.
- `page_location` elimină query string și fragment. Referrerul extern este redus la origine.
- Google Signals și personalizarea publicității sunt dezactivate în configurația tagului; stocarea și datele publicitare rămân denied.
- Codul rulează numai în producție pe hostname exact `directlocal.ro`; localhost, preview și aliasurile Vercel sunt excluse.
- Informarea utilizatorilor este în /contact/#statistici. Nu reprezintă o certificare juridică a întregului site.

## Verificări locale

- `npm run check`: lint, 57 teste unitare/API, validare conținut, build, verificarea HTML a 104 pagini, tipuri — trecute.
- 12 teste browser pentru Analytics și formulare, desktop/mobil — trecute.
- Testele acoperă navigarea client, revenirea pe site, cookie existent păstrat cu acord, refuz/reacceptare fără dublări și încărcarea întârziată a tagului. Evenimentele intră în coadă imediat după acord; un callback întârziat nu poate reactiva colectarea după refuz.
- Layout fără overflow la 360/390/1440 px; analiza Axe a panoului de acord fără încălcări detectate.
- Testele interceptează Google tag și API-ul de contact: fără telemetrie de test trimisă Google și fără emailuri reale firmelor.

## Verificare live

- Deployment Vercel `3PT1Ede3jmDN3x4h7KB4biWVZ1vK`, Production, Ready, branch main, commit 081dbd3.
- Domeniul https://directlocal.ro încarcă versiunea nouă.
- Înainte de acord: zero elemente script Google Tag. După acceptare: tagul G-1EK33H5G21 este prezent, iar panoul se închide.
- GA4 Realtime a afișat un utilizator activ, un `page_view`, `user_engagement` și `company_website_click` după navigarea reală spre profilul Alpha Cleaning și click pe website.
- Nu am inițiat apeluri și nu am trimis formulare fictive firmelor. Evenimentele telefon/formulare sunt validate în testele automate izolate.
- Verificarea este o vizită de control, nu dovada existenței unui trafic organic sau a unui client câștigat.
- Rapoartele standard și datele Search Console pot avea întârziere; asocierea nu creează retroactiv date GA4.

Dovezi suplimentare: `docs/reports/ga4-production-deployment-2026-10-15.jpg`, `docs/reports/ga4-realtime-live-2026-10-15.jpg`.

Dovezi UI: `docs/reports/ga4-search-console-2026-10-15.jpg`, `ga4-key-events-2026-10-15.jpg`, `ga4-custom-dimensions-2026-10-15.jpg`, `ga4-vercel-variable-2026-10-15.jpg`.

Documentație oficială: [Analytics și Search Console](https://support.google.com/analytics/answer/10737381), [consimțământ pentru Google tag](https://developers.google.com/tag-platform/security/guides/consent), [parametri GA4](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters).
