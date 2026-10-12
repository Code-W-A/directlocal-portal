import { loadCatalog } from "./load";
import { getPublicPages } from "../seo/registry";
import { site } from "../../config/site";
import { pageMetadata } from "../seo/metadata";
import { contentPath } from "../seo/urls";
import { notFound } from "next/navigation";
export async function metadataFor(path: string) {
  const entry = getPublicPages(await loadCatalog(), site).find(p => p.path === path);
  if (!entry) notFound();
  return pageMetadata({ ...entry, omitCanonical: path === "/cauta/" });
}
export async function contentFor(path: string) {
  const catalog = await loadCatalog();
  const page = catalog.pages.find(p => p.status === "published" && contentPath(p, catalog) === path);
  if (!page) notFound();
  return { page, catalog };
}
