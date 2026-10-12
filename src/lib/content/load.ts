import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { validateCatalog } from "./validate";

export async function loadCatalog(root = path.join(process.cwd(), "src/content")) {
  async function readFolder(folder: string, extension: string) {
    const directory = path.join(root, folder);
    const files = (await readdir(directory)).filter(name => name.endsWith(extension)).sort();
    return Promise.all(files.map(async name => {
      try {
        const source = await readFile(path.join(directory, name), "utf8");
        if (extension === ".json") return JSON.parse(source) as unknown;
        const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source);
        if (!match) throw new Error("Markdown needs YAML frontmatter between --- delimiters.");
        const data: unknown = parse(match[1], { maxAliasCount: 0 });
        if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Expected a metadata object.");
        return { ...data, body: match[2].trim() };
      } catch (error) { throw new Error(`${folder}/${name}: ${String(error)}`); }
    }));
  }
  const [services, counties, locations, companies, pages] = await Promise.all([
    readFolder("services", ".json"), readFolder("counties", ".json"), readFolder("locations", ".json"),
    readFolder("companies", ".json"), readFolder("pages", ".md"),
  ]);
  return validateCatalog({ services, counties, locations, companies, pages });
}
