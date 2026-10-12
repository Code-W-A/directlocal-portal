import type { z } from "zod";
import type { sourceSchema } from "@/lib/content/schemas";
import { site } from "@/config/site";
export function Sources({ sources, path }: { sources: z.infer<typeof sourceSchema>[]; path: string }) {
  return <section aria-label="Surse și corecturi"><h2>Surse și verificare</h2><ul>{sources.map(s => <li key={s.id}><a href={s.url} rel="external">{new URL(s.url).hostname}</a> — consultat la <time dateTime={s.checkedAt}>{s.checkedAt}</time><p>{s.note}</p></li>)}</ul>
    <p>Verificare documentară; confirmă direct informațiile înainte de programare.</p>
    <a href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(`Corectură: ${path}`)}`}>Raportează o eroare</a>
  </section>;
}
