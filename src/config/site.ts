import { isIP } from "node:net";

export function resolveSiteConfig(env: Record<string, string | undefined>) {
  const production = env.NODE_ENV === "production" && (!env.VERCEL_ENV || env.VERCEL_ENV === "production");
  const requested = env.INDEXING_ENABLED ?? (production ? "true" : "false");
  if (!["true", "false"].includes(requested)) {
    throw new Error("INDEXING_ENABLED must be true or false.");
  }
  let url: string | undefined;
  const configuredUrl = env.SITE_URL?.trim() || (env.NODE_ENV === "production" ? "https://directlocal.ro" : undefined);
  if (configuredUrl) {
    const parsed = new URL(configuredUrl);
    const host = parsed.hostname.toLowerCase();
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port ||
        parsed.pathname !== "/" || parsed.search || parsed.hash ||
        !host.includes(".") || isIP(host) !== 0 || host.startsWith("[") ||
        /(^|\.)(example\.(com|org|net)|localhost|test|invalid)$/.test(host)) {
      throw new Error("SITE_URL must be a real HTTPS origin, without path, port or credentials.");
    }
    url = parsed.origin;
  }
  const indexable = requested === "true" && env.NODE_ENV !== "development" && env.NODE_ENV !== "test" && env.VERCEL_ENV !== "preview" && env.VERCEL_ENV !== "development";
  if (requested === "true" && !url) {
    throw new Error("Set a real SITE_URL before enabling indexation.");
  }
  return {
    name: "DirectLocal.ro",
    description: "Firme și servicii locale cu surse publice, date de contact și zone de acoperire documentate.",
    language: "ro", locale: "ro_RO", url, indexable,
    // Editorial date, never a build timestamp.
    homeUpdatedAt: "2026-10-15",
    contactEmail: "webdynamicx@gmail.com",
    navigation: [{ label: "Servicii", href: "/servicii/" }, { label: "Județe", href: "/#judete" }, { label: "Firme", href: "/cauta/" }, { label: "Despre", href: "/despre-noi/" }, { label: "Contact", href: "/contact/" }],
  } as const;
}
export const site = resolveSiteConfig(process.env);
export type SiteConfig = ReturnType<typeof resolveSiteConfig>;

export const addCompanyHref = "/inscriere-firma/";
