import { ServiceIcon } from "@/components/ui/ServiceIcon";
import type { ReactNode } from "react";
import type { ContentPage } from "@/lib/content/schemas";
import { renderMarkdown } from "@/lib/content/markdown";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { Sources } from "@/components/directory/Sources";
import styles from "./templates.module.css";
export function EditorialPage({ page, crumbs, children }: { page: ContentPage; crumbs: Crumb[]; children?: ReactNode }) {
  return <article className={`container ${styles.page}`}>
    <Breadcrumbs items={crumbs} /><div className={styles.titleRow}>{page.kind !== "editorial" ? <span className={styles.serviceBadge}><ServiceIcon serviceIds={[page.serviceId]} /></span> : null}<h1>{page.title}</h1></div><p className="prose">{page.intro}</p>
    {children}<div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(page.body) }} />
    {page.sources.length ? <Sources sources={page.sources} path={crumbs.at(-1)!.href} /> : null}
  </article>;
}
