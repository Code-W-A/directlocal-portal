# Contacte prin SMTP — implementare locală, 15 octombrie 2026

Directorul păstrează conținutul în fișiere și paginile pregenerate. Singura rută dinamică de aplicație este `POST /api/contact/`. Nu există conturi, bază de date sau publicare automată. `npm start` pornește Next.js, nu vechiul export din `out/`; fișierele vechi din `out/` nu sunt rezultatul curent.

## Configurare

Configurați exclusiv pe server: `SMTP_HOST`, `SMTP_PORT` (587 cu STARTTLS sau 465 cu TLS), `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`. Expeditorul trebuie autorizat de furnizor. În producție originea acceptată este `site.url` (implicit https://directlocal.ro); un CONTACT_ORIGIN local rămas nu o suprascrie. În development se folosește CONTACT_ORIGIN sau originea URL-ului cererii. Nu puneți secrete în variabile NEXT_PUBLIC. SMTP absent produce un răspuns 503 și o alternativă de contact, nu succes fictiv.

Administratorul este adresa `contactEmail` din configurația site-ului. Mesajele către firme sunt trimise doar la adresa verificată din catalog, cu BCC la administrator și Reply-To către utilizator. Browserul transmite identificatorul firmei, nu destinatarul. Înscrierile, corecturile și mesajele generale ajung doar la administrator. Înscrierea cere date minime de contact; serviciile și aria sunt clarificate ulterior manual.

## Evidență și limite

Emailul include un ID unic, data, firma și pagina de origine declarată de browser. Copia dovedește primirea unei solicitări prin formular, nu trafic unic, vânzare sau apel realizat. SMTP confirmă acceptarea mesajului, nu livrarea în inbox sau citirea. Respingerea copiei administrative este raportată în log numai cu ID-ul solicitării, fără date personale. O eroare de rețea după trimitere poate avea rezultat incert; formularul explică acest lucru și nu retrimite automat.

Limita de 5 încercări/10 minute folosește IP-ul transmis de proxy, hashed, în memoria instanței, cu maximum 10.000 de chei. Nu este o limită distribuită: se resetează la restart și nu se coordonează între instanțe. Hostingul trebuie să suprascrie antetul IP; adăugați protecție la proxy înainte de expunerea publică dacă nu poate fi garantat acest lucru. Originea și honeypot-ul completează protecția, nu înlocuiesc un filtru anti-abuz distribuit.

Fără JavaScript sunt disponibile linkurile HTML, numerele de telefon și emailurile. Formularele necesită JavaScript. Nu există stocare a drafturilor în browser sau fișiere; textul rămâne în formular după erori.

## Verificări și lansare

Testele injectează un transport fals sau interceptează răspunsul HTTP; nu trimit email firmelor. Activarea live cere SMTP configurat, test de livrare numai către adrese controlate, verificarea identității operatorului și a informării privind datele, domeniu aprobat și hosting cu runtime Next.js. Nu s-a făcut deploy. Indexarea rămâne o decizie separată.

### Rezultate istorice, înaintea extinderii registrului

La finalul implementării: lint, typecheck, validarea conținutului și build au trecut; 48 teste de logică/conținut și 66 teste browser au trecut. Verificatorul confirmă 19 pagini pregenerate, legături și ancore interne, lipsa paginilor orfane, metadata, JSON-LD și concordanța sitemapului. Browserul a verificat desktop și 360/390 px, accesibilitatea, erorile/succesul simulat și contactele fără JavaScript. Trimiterea SMTP reală și evoluția în Search Console nu au fost verificate. Nicio firmă nu a fost contactată în teste.

### Înscriere simplificată

Formularul de înscriere cere numai denumirea firmei, numele reprezentantului și telefonul, cu email opțional. Nu cere mesaj, servicii sau acoperire; acestea se clarifică ulterior cu reprezentantul. API-ul permite lipsa emailului/mesajului numai pentru înscriere și folosește adresa administratorului ca Reply-To dacă emailul nu este furnizat. Celelalte formulare păstrează emailul și mesajul obligatorii.
