import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { loadCatalog } from "@/lib/content/load";
import { getPublicPages, indexablePages } from "@/lib/seo/registry";
import { absoluteUrl } from "@/lib/seo/urls";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.indexable || !site.url) return [];
  const origin = site.url;
  return indexablePages(getPublicPages(await loadCatalog(), site), site).map(page => ({ url: absoluteUrl(page.path, origin), lastModified: page.updatedAt }));
}
