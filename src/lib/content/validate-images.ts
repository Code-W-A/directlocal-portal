import { imageSchema } from "./image-schema";
import { access } from "node:fs/promises";
import path from "node:path";
import { images, getImage } from "./images";
import type { Catalog } from "./schemas";
export async function validateImages(catalog: Catalog, publicRoot = path.resolve("public")) {
  if (new Set(images.map(image => image.id)).size !== images.length) throw new Error("Duplicate image ID");
  const today = new Date().toISOString().slice(0, 10);
  for (const image of images) {
    imageSchema.parse(image);
    if (image.checkedAt > today) throw new Error("Future image license verification: " + image.id);
    if (new Set(image.widths).size !== image.widths.length || image.widths.at(-1) !== image.width) throw new Error("Invalid image widths: " + image.id);
    for (const width of image.widths) for (const format of ["avif", "webp"]) {
      await access(path.join(publicRoot, "images", image.basename + "-" + width + "." + format));
    }
  }
  for (const company of catalog.companies) {
    if (!company.imageId) continue;
    if (!getImage(company.imageId)) throw new Error("Missing company image: " + company.id);
  }
}
