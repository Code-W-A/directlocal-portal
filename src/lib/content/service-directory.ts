import { z } from "zod";
import copy from "../../content/service-directory.json";
import type { Catalog } from "./schemas";
import { contentPath } from "../seo/urls";

const text = z.string().trim().min(1);
export const serviceDirectoryCopy = z.object({
  title: text, intro: text, searchLabel: text, catalogTitle: text,
  countiesLabel: text, serviceLabel: text, photoCaption: text, emptyMessage: text,
  guide: z.object({
    title: text, intro: text, methodologyLabel: text,
    steps: z.array(z.object({ title: text, description: text }).strict()).length(3),
  }).strict(),
}).strict().parse(copy);

export function serviceDirectoryEntries(catalog: Catalog) {
  return catalog.pages.flatMap(page => {
    if (page.kind !== "service" || page.status !== "published") return [];
    const service = catalog.services.find(s => s.id === page.serviceId && s.status === "published");
    if (!service) return [];
    const counties = catalog.pages.flatMap(localPage => {
      if (localPage.kind !== "county" || localPage.status !== "published" || localPage.serviceId !== service.id) return [];
      const county = catalog.counties.find(c => c.id === localPage.countyId && c.status === "published");
      return county ? [{ name: county.name, href: contentPath(localPage, catalog) }] : [];
    }).toSorted((a, b) => a.name.localeCompare(b.name, "ro"));
    return [{ id: service.id, name: service.name, summary: service.summary, pageTitle: page.title, href: contentPath(page, catalog), counties }];
  }).toSorted((a, b) => a.name.localeCompare(b.name, "ro"));
}
