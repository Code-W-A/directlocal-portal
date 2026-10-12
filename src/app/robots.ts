import type { MetadataRoute } from "next";
import { site } from "@/config/site";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  // Crawling stays allowed so bots can see page-level noindex.
  return { rules: { userAgent: "*", allow: "/" }, ...(site.indexable && site.url ? { sitemap: `${site.url}/sitemap.xml` } : {}) };
}
