import { z } from "zod";
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase ASCII slugs with hyphens.");
const text = z.string().trim().min(1);
const date = z.iso.date();
const base = { id: slug, slug, status: z.enum(["draft", "published"]), updatedAt: date };
const indexStatus = z.enum(["index", "noindex"]);
export const sourceSchema = z.object({ id: slug, url: z.url({ protocol: /^https?$/ }), checkedAt: date, note: text }).strict();
const refs = z.array(slug).min(1);
export const seoSchema = z.object({ title: text, description: text }).strict();
export const serviceSchema = z.object({ ...base, name: text, summary: text }).strict();
export const countySchema = z.object({ ...base, name: text }).strict();
export const locationSchema = z.object({ ...base, name: text, countyId: slug }).strict();
export const companySchema = z.object({
  ...base, indexStatus, editorialReviewed: z.boolean().default(false), reviewNote: text.optional(), name: text, description: text, seo: seoSchema, imageId: slug.optional(),
  website: z.url({ protocol: /^https?$/ }).optional(),
  phone: z.string().regex(/^\+?[0-9 ()-]{6,25}$/).optional(), email: z.email().optional(),
  evidence: z.object({ name: refs, description: refs, website: refs.optional(), phone: refs.optional(), email: refs.optional() }).strict(),
  headquarters: z.object({ kind: z.enum(["headquarters", "workplace"]).optional(), locality: text, county: text, street: text.optional(), sourceIds: refs }).strict().optional(),
  offerings: z.array(z.object({ serviceId: slug, sourceIds: refs, coverage: z.array(z.object({ locationId: slug, sourceIds: refs }).strict()), countyCoverage: z.array(z.object({ countyId: slug, sourceIds: refs }).strict()).default([]) }).strict()).min(1),
  sources: z.array(sourceSchema).min(1), sponsored: z.boolean(),
}).strict().refine(c => Boolean(c.website || c.phone || c.email), "A company needs a real contact method.");
const pageBase = { ...base, indexStatus, title: text, seo: seoSchema, intro: text, body: text, sources: z.array(sourceSchema).min(1), editorialReviewed: z.boolean(), reviewNote: text.optional() };
const aboutItem = z.object({ title: text, description: text }).strict();
const aboutSchema = z.object({
  illustrationCaption: text,
  overviewTitle: text,
  searchLabel: text,
  corrections: z.object({ text, label: text }).strict(),
  principles: z.object({ title: text, items: z.array(aboutItem).length(3) }).strict(),
  steps: z.object({ title: text, items: z.array(aboutItem).length(3) }).strict(),
  audiences: z.object({ title: text, items: z.array(z.object({ title: text, points: z.array(text).min(1) }).strict()).length(2) }).strict(),
  selection: z.object({ title: text, description: text, items: z.array(aboutItem).length(3), note: text, linkLabel: text }).strict(),
  cta: z.object({ title: text, description: text, label: text, note: text }).strict(),
}).strict();
export const pageSchema = z.discriminatedUnion("kind", [
  z.object({ ...pageBase, kind: z.literal("service"), serviceId: slug }).strict(),
  z.object({ ...pageBase, kind: z.literal("county"), serviceId: slug, countyId: slug, companyIds: z.array(slug).default([]) }).strict(),
  z.object({ ...pageBase, kind: z.literal("local"), serviceId: slug, locationId: slug, companyIds: z.array(slug).min(1) }).strict(),
  // Platform explanations can be based on the site's own behavior. External
  // evidence remains required for service pages and every company profile.
  z.object({ ...pageBase, kind: z.literal("editorial"), sources: z.array(sourceSchema), about: aboutSchema.optional() }).strict(),
]);
export type Service = z.infer<typeof serviceSchema>;
export type County = z.infer<typeof countySchema>;
export type Location = z.infer<typeof locationSchema>;
export type Company = z.infer<typeof companySchema>;
export type ContentPage = z.infer<typeof pageSchema>;
export type Catalog = { services: Service[]; counties: County[]; locations: Location[]; companies: Company[]; pages: ContentPage[] };
