import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadBuildArtifacts } from "../scripts/lib/build-artifacts";

for (const scoped of [false, true]) {
  test(`build artifacts resolve ${scoped ? "adapter" : "local"} pages and metadata`, async () => {
    const root = await mkdtemp(path.join(tmpdir(), "directory-build-"));
    try {
      const entries = ["index.html", "servicii/test.html", "_not-found.html", "sitemap.xml.body", "robots.txt.body"];
      for (const key of entries) {
        const kind = key.endsWith(".html") ? "APP_PAGE" : "APP_ROUTE";
        const directory = scoped ? `server/route-cache/${kind}/owner/$` : "server/app";
        const file = path.join(root, directory, key);
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file, "fixture");
      }
      const files = await loadBuildArtifacts(root);
      assert.deepEqual([...files.keys()].sort(), entries.sort());
      assert.equal(files.get("missing.html"), undefined);
      if (scoped) {
        await mkdir(path.join(root, "server/app"), { recursive: true });
        await writeFile(path.join(root, "server/app/index.html"), "duplicate");
        await assert.rejects(loadBuildArtifacts(root), /Ambiguous prerender artifact/);
      }
    } finally { await rm(root, { recursive: true, force: true }); }
  });
}
