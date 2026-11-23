# Conectarea directlocal.ro — 15 octombrie 2026

Configurare autorizată de proprietar și aplicată în conturile existente Romarg și Vercel.

- Registrar: Romarg; domeniul rămâne înregistrat și reînnoit acolo.
- Nameservere salvate la Romarg: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`. Confirmarea de salvare a fost afișată; valorile au fost recitite după navigare în afara formularului și revenire.
- DNS administrat în echipa Vercel `mobitoolsro-3247s-projects`.
- Proiect: `directlocal-portal`; domeniul `directlocal.ro` conectat la Production.
- `www.directlocal.ro`: redirect permanent 308 către `directlocal.ro`.
- A pentru rădăcină: `216.150.1.1`, valoarea recomandată de proiectul Vercel la configurare.
- CNAME pentru `www`: `de4770442318dad9.vercel-dns-016.com.`, valoarea recomandată de proiect.
- TTL înregistrări adăugate: 60 secunde. Înregistrările CAA și ALIAS administrate automat de Vercel au fost păstrate.
- Domeniul nou nu avea zonă DNS creată la Romarg. Nu a fost mutată o zonă de email existentă.

## Verificări

Serverele DNS Vercel răspund autoritativ pentru A și CNAME. Registrul .ro publică nameserverele Vercel, iar Google DNS (8.8.8.8) rezolvă A la 216.150.1.1. Unele cache-uri DNS locale păstrează temporar răspunsul negativ anterior; Chrome local a afișat încă ERR_NAME_NOT_RESOLVED la deschidere.

Build-ul public existent la `https://directlocal-portal-six.vercel.app/` a fost verificat: canonical `https://directlocal.ro/`, robots `index, follow`, sitemap cu 103 URL-uri pe domeniul final și robots.txt cu referința corectă la sitemap.

Verificarea finală Vercel indică **Valid Configuration** pentru ambele domenii. HTTPS pe directlocal.ro răspunde 200 cu validarea certificatului activă (conexiune explicită la IP-ul publicat pentru a evita cache-ul DNS local). HTTP redirecționează 308 către HTTPS. www răspunde pe HTTPS cu 308 și păstrează calea și query-ul: /servicii/?test=seo → https://directlocal.ro/servicii/?test=seo.

Canonical-ul a fost verificat direct pe hostul final pentru homepage, catalog și o pagină locală; toate indică URL-ul propriu pe https://directlocal.ro. Căutarea rămâne noindex, fără canonical. /robots.txt permite crawling și indică sitemapul final; /sitemap.xml are 103 URL-uri. Rezultatele sunt în domain-http-verification-2026-10-15.json. Certificatul este gestionat și reînnoit de Vercel. Rămâne numai expirarea cache-urilor DNS care nu au preluat încă delegarea nouă.

Dovezi: `romarg-nameservers-2026-10-15.jpg`, `vercel-domains-2026-10-15.jpg` în acest director. Nu s-a făcut un nou deploy și nu s-au trimis emailuri.
