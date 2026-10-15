# Reguli de lucru

- Extinde proiectul existent: Next.js App Router, TypeScript, CSS Modules cu pagini pregenerate.
- Fără CMS, Server Actions, baze de date sau autentificare. Excepții autorizate: POST /api/contact/ pentru SMTP, fără stocare persistentă, și redirectul de domeniu din src/proxy.ts, limitat la www.directlocal.ro.
- Conținutul real este în `src/content`; datele fictive sunt exclusiv în teste.
- Citește `docs/seo/SEO-PLAYBOOK.md` și șablonul relevant înainte de redactare.
- Publicarea (`status`) și indexarea (`indexStatus`) sunt decizii independente. Producția https://directlocal.ro și indexarea paginilor revizuite sunt autorizate. Fără prag numeric de firme; nu indexa pagini fără date utile verificate. Preview și căutare rămân noindex.
- Nu fabrica date, contacte, arii deservite, recenzii sau rezultate. Leagă afirmațiile despre firme de surse și date de verificare.
- Păstrează lista firmelor înaintea textului editorial lung și diferențiază sediul de acoperirea serviciului.
- Fără parole, credențiale SMTP sau alte secrete în fișiere, documentație și export.
- Contact prin API SMTP, cu alternativă mailto/tel. Confirmă numai acceptarea SMTP, nu livrarea/citirea.
- Rulează lint, typecheck, teste, validarea conținutului, build și testele browser când implementezi rute sau fluxuri.
- Nu face deploy în producție fără autorizare explicită.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
