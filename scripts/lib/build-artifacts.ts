import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import path from "node:path";

// Next.js 16 adapters scope prerenders by route owner under server/route-cache.
// Standalone next build keeps the original server/app layout.
export async function loadBuildArtifacts(buildDir: string) {
  const files = new Map<string, string>();
  async function walk(directory: string, scoped: boolean): Promise<void> {
    let entries;
    try { entries = await readdir(directory, { withFileTypes: true }); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
      throw error;
    }
    for (const entry of entries) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await walk(file, scoped); continue; }
      if (!entry.isFile() || !/\.(html|body)$/.test(entry.name)) continue;
      let key = path.relative(path.join(buildDir, "server", "app"), file).split(path.sep).join("/");
      if (scoped) {
        const relative = path.relative(path.join(buildDir, "server", "route-cache"), file).split(path.sep).join("/");
        const match = /^(APP_PAGE|APP_ROUTE)\/[^/]+\/\$\/(.+)$/.exec(relative);
        assert(match, `Unrecognized prerender artifact: ${file}`);
        key = match[2];
      }
      assert(!files.has(key), `Ambiguous prerender artifact: ${key}`);
      files.set(key, file);
    }
  }
  await walk(path.join(buildDir, "server", "app"), false);
  await walk(path.join(buildDir, "server", "route-cache"), true);
  return files;
}
