import type { ReactNode } from "react";
import type { ContentPage } from "@/lib/content/schemas";
import { renderMarkdown } from "@/lib/content/markdown";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { Sources } from "@/components/directory/Sources";
import styles from "./templates.module.css";
export function EditorialPage({ page, crumbs, children }: { page: ContentPage; crumbs: Crumb[]; children?: ReactNode }) {
  return <article className={`container ${styles.page}`}>
    <Breadcrumbs items={crumbs} /><h1>{page.title}</h1><p className="prose">{page.intro}</p>
    {children}<div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(page.body) }} />
    <Sources sources={page.sources} path={crumbs.at(-1)!.href} />
  </article>;
}
