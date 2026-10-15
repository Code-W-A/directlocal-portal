import type { Metadata } from "next";
import { site, type SiteConfig } from "../../config/site";
import { absoluteUrl } from "./urls";
export function pageMetadata(input: { path: string; title: string; description: string; noindex?: boolean; indexStatus?: "index" | "noindex"; omitCanonical?: boolean }, config: SiteConfig = site): Metadata {
  const url = config.url ? absoluteUrl(input.path, config.url) : undefined;
  const index = config.indexable && !input.noindex && input.indexStatus !== "noindex";
  return {
    title: input.title, description: input.description,
    alternates: url && !input.omitCanonical ? { canonical: url } : undefined,
    robots: { index, follow: true },
    openGraph: { title: input.title, description: input.description, siteName: config.name, locale: config.locale, type: "website", ...(url ? { url } : {}), ...(url && input.path === "/" ? { images: [{ url: absoluteUrl("/images/directlocal-social.jpg", config.url!), width: 1200, height: 630, alt: "Harta ilustrativă a României și DirectLocal.ro" }] } : {}) },
    twitter: { card: url && input.path === "/" ? "summary_large_image" : "summary", ...(url && input.path === "/" ? { images: [absoluteUrl("/images/directlocal-social.jpg", config.url!)] } : {}), title: input.title, description: input.description },
  };
}
