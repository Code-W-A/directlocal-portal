import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const directory = process.argv[2];
if (!directory) throw new Error('Provide the directory containing licensed <photoId>.jpg originals.');
const images = JSON.parse(await fs.readFile('src/content/images.json', 'utf8'));
for (const image of images) {
  for (const width of image.widths) {
    for (const format of ['avif', 'webp']) {
      await sharp(path.join(directory, image.photoId + '.jpg'))
        .resize(width, width * image.height / image.width, { fit: 'cover', position: image.photoId === 2986011 ? 'south' : 'centre' })
        .toFormat(format, { quality: format === 'avif' ? 48 : 76 })
        .toFile('public/images/' + image.basename + '-' + width + '.' + format);
    }
  }
}
