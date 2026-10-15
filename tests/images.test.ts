import test from "node:test";
import assert from "node:assert/strict";
import { loadCatalog } from "../src/lib/content/load";
import { stat } from "node:fs/promises";
import { imageSchema } from "../src/lib/content/image-schema";
import { images } from "../src/lib/content/images";
import { validateImages } from "../src/lib/content/validate-images";
import sharp from "sharp";
test("retained illustrations have licensed sources and optimized derivatives", async () => {
  const catalog = await loadCatalog();
  await validateImages(catalog);
  for (const image of images) {
    assert.match(image.alt, /ilustrativă/);
    for (const width of image.widths) for (const format of ["avif", "webp"]) {
      const { width: actual, height } = await sharp("public/images/" + image.basename + "-" + width + "." + format).metadata();
      assert.equal(actual, width);
      assert.equal(height, width * image.height / image.width);
      assert.ok((await stat("public/images/" + image.basename + "-" + width + "." + format)).size < 160000, "image budget <160KB");
    }
  }
});
test("company photos are optional while referenced images require valid provenance", async () => {
  const catalog = await loadCatalog();
  const missing = structuredClone(catalog);
  missing.companies[0].imageId = "missing-photo";
  await assert.rejects(validateImages(missing), /Missing company image/);
  const unassigned = structuredClone(catalog);
  for (const company of unassigned.companies) delete company.imageId;
  await validateImages(unassigned);
  const referenced = structuredClone(catalog);
  referenced.companies[0].imageId = images[0].id;
  await validateImages(referenced);
  assert.equal(imageSchema.safeParse({ ...images[0], licenseUrl: "" }).success, false);
  await assert.rejects(validateImages(catalog, "/tmp/nonexistent-directlocal-images"));
});
