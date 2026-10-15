import sharp from 'sharp';
// Download the licensed source photographs documented in docs/IMAGES.md first.
// Usage: node scripts/prepare-home-images.mjs /path/to/brasov.jpg /path/to/sofa.jpg
const [city, sofa] = process.argv.slice(2);
if (!city || !sofa) throw new Error('Provide the two local source image paths (Brașov, sofa).');
for (const [name, source, ratio, position, widths] of [
  ['brasov-panorama', city, 1.22, 'centre', [480,800,1200]],
  ['canapea-albastra', sofa, 1.5, 'south', [360,720]],
]) {
  for (const width of widths) for (const format of ['webp','avif']) {
    await sharp(source).resize(width, Math.round(width/ratio), { fit:'cover', position }).toFormat(format, { quality:format === 'avif' ? 52 : 78 }).toFile(`public/images/${name}-${width}.${format}`);
  }
}
// The social image is generated separately by prepare-romania-map.mjs.
