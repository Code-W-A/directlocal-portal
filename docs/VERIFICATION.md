# Verificare locală — 12 octombrie 2026

- `npm run check`: PASS — lint, 29 teste unitare, validare conținut, Next.js build Webpack, verificare export și TypeScript.
- `npm run test:browser`: PASS — 10 teste, câte cinci pe Chromium desktop (1440×1000) și mobil (390×844).
- Export: 10 pagini publice, 404, sitemap și robots. Toate paginile sunt noindex; sitemap gol.
- Browser: navigare serviciu → județ → oraș → firmă, surse și data verificării, mailto și telefon, ordine listări/editorial, filtre combinate, căutare fără diacritice, rezultat gol, resetare, pagini editoriale și URL-uri necunoscute.
- Homepage fără JavaScript, navigare cu tastatura și skip link. Axe: fără încălcări pe homepage, pagina locală, profil și căutare în scenariile testate. Fără depășirea orizontală a viewport-ului pe paginile măsurate.
- Capturi generate în `test-results/`: homepage, pagina locală și căutare. Inspectate vizual: homepage mobil, căutare mobil și pagina locală desktop.
- Corecții în timpul verificării: etichete explicite pentru filtre; spațiere și împărțire pe rânduri a meniului mobil.
- Teste negative pentru surse, verificări lipsă, date viitoare, duplicate, relații greșite, conținut local similar și JSON-LD nealiniat.
- Teste controlate pentru canonical cu domeniu, indexStatus noindex în configurație global indexabilă și filtrarea sitemap. Configurația reală nu are SITE_URL; nu s-a configurat niciun domeniu fictiv.

## Limite

Testele sunt locale; nu reprezintă validare în producție, verificare telefonică a firmei sau control al calității serviciilor. Nu a fost rulat un audit npm nou; eventualele rezultate istorice de audit nu trebuie interpretate ca actuale.

Node utilizat: 25.6.1; Next.js 16.4.0. Exportul folosește fișiere și fonturi locale. Operațiunile tsx și serverul browser au necesitat permisiunea acordată pentru IPC/port local în afara sandbox-ului.
