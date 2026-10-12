import { verifyStructuredData } from "../src/lib/seo/verify-schema";
import nextEnv from "@next/env";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { load } from "cheerio";
nextEnv.loadEnvConfig(process.cwd());
const { loadCatalog } = await import("../src/lib/content/load");
const { site } = await import("../src/config/site");
const { getPublicPages, indexablePages } = await import("../src/lib/seo/registry");
const { absoluteUrl, contentPath, companyPath } = await import("../src/lib/seo/urls");
const root = path.resolve("out");
const catalog = await loadCatalog();
const pages = getPublicPages(catalog, site);
const titleSet = new Set<string>();
const h1Set = new Set<string>();
const descriptionSet = new Set<string>();
const links = new Map<string, Set<string>>();
async function exists(file: string) { try { return (await stat(file)).isFile(); } catch { return false; } }
function htmlFile(route: string) { return path.join(root, route, "index.html"); }
for (const page of pages) {
  const file = htmlFile(page.path);
  links.set(page.path, new Set());
  assert(await exists(file), `Published page has no exported HTML: ${page.path}. Activate its route before publishing.`);
  const $ = load(await readFile(file, "utf8"));
  assert.equal($("html").attr("lang"), "ro");
  assert.equal($("h1").length, 1, `Expected one H1: ${page.path}`);
  const h1 = $("h1").text().replace(/\s+/g, " ").trim();
  assert.equal(h1, page.h1, `Wrong H1: ${page.path}`);
  assert(!h1Set.has(h1), `Duplicate H1: ${page.path}`); h1Set.add(h1);
  const title = $("title").text();
  const description = $('meta[name="description"]').attr("content");
  assert(title.includes(page.title), `Wrong title: ${page.path}`);
  assert.equal(description, page.description);
  assert(!titleSet.has(title), `Duplicate title: ${page.path}`); titleSet.add(title);
  assert(!descriptionSet.has(description!), `Duplicate description: ${page.path}`); descriptionSet.add(description!);
  const robots = $('meta[name="robots"]').map((_, e) => $(e).attr("content")).get().join(",");
  assert.equal(robots.includes("noindex"), !(site.indexable && page.indexStatus === "index"), `Wrong indexing policy: ${page.path}`);
  if (site.url) {
    assert.equal($('link[rel="canonical"]').length, page.path === "/cauta/" ? 0 : 1);
    if (page.path !== "/cauta/") assert.equal($('link[rel="canonical"]').attr("href"), absoluteUrl(page.path, site.url));
    assert.equal($('meta[property="og:url"]').attr("content"), absoluteUrl(page.path, site.url));
  } else {
    assert.equal($('link[rel="canonical"]').length, 0, "Do not emit fictional canonicals.");
    assert.equal($('meta[property="og:url"]').length, 0);
  }
  assert($('meta[property="og:title"]').length === 1);
  verifyStructuredData($, page.path, catalog, site.url);
  const content = catalog.pages.find(p => contentPath(p, catalog) === page.path);
  const company = catalog.companies.find(c => companyPath(c) === page.path);
  for (const source of (content ?? company)?.sources ?? []) {
    assert($('a[href]').toArray().some(el => $(el).attr("href") === source.url), `Source not visible: ${page.path}`);
    assert($('time').toArray().some(el => $(el).attr("datetime") === source.checkedAt), `Verification date not visible: ${page.path}`);
  }
  if (content?.kind === "local") {
    const firstCard = $.html().indexOf('Firme care declară');
    const editorial = $.html().indexOf('Serviciul disponibil');
    assert(firstCard >= 0 && (editorial < 0 || firstCard < editorial), "Company list must precede long editorial copy");
  }
  for (const element of $('a[href]').toArray()) {
    const href = $(element).attr("href")!;
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    const target = new URL(href, `https://export.invalid${page.path}`);
    assert.equal(target.origin, "https://export.invalid", `Unexpected link: ${href}`);
    links.get(page.path)!.add(target.pathname);
    const targetFile = htmlFile(decodeURIComponent(target.pathname));
    assert(await exists(targetFile), `Broken internal link ${href} in ${page.path}`);
    if (target.hash) {
      const targetDoc = load(await readFile(targetFile, "utf8"));
      const id = decodeURIComponent(target.hash.slice(1));
      assert(targetDoc('[id]').toArray().some(e => targetDoc(e).attr("id") === id), `Missing anchor: ${href}`);
    }
  }
  for (const img of $("img").toArray()) {
    const src = $(img).attr("src")!;
    assert(src.startsWith("/") && !src.startsWith("//"), "Images must be local");
    assert(await exists(path.join(root, src)), `Missing local image: ${src}`);
    assert($(img).attr("alt") !== undefined, "Image needs alt.");
    assert($(img).attr("width") && $(img).attr("height"), "Image needs dimensions.");
  }
}
const reachable = new Set<string>();
const pending = ["/"];
while (pending.length) {
  const current = pending.pop()!;
  if (reachable.has(current)) continue;
  reachable.add(current);
  for (const target of links.get(current) ?? []) pending.push(target);
}
for (const page of pages) assert(reachable.has(page.path), `Orphan page: ${page.path}. Link it from homepage or a reachable hub.`);
async function listHtml(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? listHtml(path.join(dir, e.name)) : Promise.resolve(e.name.endsWith(".html") ? [path.join(dir, e.name)] : [])))).flat();
}
const allowed = new Set([...pages.map(p => htmlFile(p.path)), path.join(root, "404.html"), path.join(root, "404/index.html"), path.join(root, "_not-found/index.html")]);
for (const file of await listHtml(root)) assert(allowed.has(file), `Unregistered page exported (possible draft): ${file}`);
const notFound = load(await readFile(path.join(root, "404.html"), "utf8"));
assert(notFound('meta[name="robots"]').toArray().some(e => notFound(e).attr("content")?.includes("noindex")), "404 must be noindex.");
assert.equal(notFound("h1").length, 1);
const sitemap = load(await readFile(path.join(root, "sitemap.xml"), "utf8"), { xml: true });
const actualUrls = sitemap("url > loc").map((_, el) => sitemap(el).text()).get().sort();
const expectedUrls = indexablePages(pages, site).map(p => absoluteUrl(p.path, site.url!)).sort();
assert.deepEqual(actualUrls, expectedUrls, "Sitemap must match published, indexable pages exactly.");
for (const entry of sitemap("url").toArray()) {
  const loc = sitemap(entry).find("loc").text();
  const expected = pages.find(p => absoluteUrl(p.path, site.url!) === loc)!;
  assert.equal(sitemap(entry).find("lastmod").text(), expected.updatedAt);
}
const robots = await readFile(path.join(root, "robots.txt"), "utf8");
assert(robots.includes("Allow: /"), "Allow bots to see noindex.");
assert.equal(robots.includes("Sitemap:"), site.indexable);
console.log(`Export verified: ${pages.length} public HTML page(s), 404, internal links, metadata, JSON-LD and sitemap parity.`);
