import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Offline regeneration from the checked-in Natural Earth county features.
const factor = Math.cos(46 * Math.PI / 180);
const project = ([lon, lat]) => [lon * factor, -lat];
// County polygons are also Natural Earth data, stored locally for offline builds.
const countySource = JSON.parse(await readFile(new URL('./data/romania-counties-natural-earth.geojson', import.meta.url), 'utf8'));
const countyPolygons = geometry => geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
const countyPoints = countySource.features.flatMap(feature => countyPolygons(feature.geometry).flat(2)).map(project);
const countyXs = countyPoints.map(point => point[0]), countyYs = countyPoints.map(point => point[1]);
const countyMinX = Math.min(...countyXs), countyMaxX = Math.max(...countyXs), countyMinY = Math.min(...countyYs), countyMaxY = Math.max(...countyYs);
const countyScale = Math.min(600 / (countyMaxX - countyMinX), 380 / (countyMaxY - countyMinY));
const countyOffsetX = (640 - (countyMaxX - countyMinX) * countyScale) / 2;
const countyOffsetY = (420 - (countyMaxY - countyMinY) * countyScale) / 2;
const countyProject = point => {
  const [x, y] = project(point);
  return [(x - countyMinX) * countyScale + countyOffsetX, (y - countyMinY) * countyScale + countyOffsetY];
};
const segmentDistanceSquared = (point, a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = dx || dy ? Math.max(0, Math.min(1, ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / (dx * dx + dy * dy))) : 0;
  return (point[0] - a[0] - t * dx) ** 2 + (point[1] - a[1] - t * dy) ** 2;
};
function simplify(points) {
  const last = points.length - 1;
  let furthest = -1, distance = .35 ** 2;
  for (let i = 1; i < last; i++) {
    const current = segmentDistanceSquared(points[i], points[0], points[last]);
    if (current > distance) { distance = current; furthest = i; }
  }
  return furthest < 0 ? [points[0], points[last]] : [...simplify(points.slice(0, furthest + 1)).slice(0, -1), ...simplify(points.slice(furthest))];
}
function insideRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a[1] > point[1]) !== (b[1] > point[1]) && point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}
// Place abbreviations inside the widest part of each county, respecting holes
// such as Bucharest inside Ilfov. This is label placement, not a location pin.
function labelPosition(polygons) {
  const rings = polygons.flat();
  const vertices = rings.flat();
  const minX = Math.min(...vertices.map(point => point[0])), maxX = Math.max(...vertices.map(point => point[0]));
  const minY = Math.min(...vertices.map(point => point[1])), maxY = Math.max(...vertices.map(point => point[1]));
  let best = [(minX + maxX) / 2, (minY + maxY) / 2], bestDistance = -1;
  let bounds = [minX, minY, maxX, maxY];
  for (let round = 0; round < 3; round++) {
    const stepX = (bounds[2] - bounds[0]) / 16, stepY = (bounds[3] - bounds[1]) / 16;
    for (let x = bounds[0]; x <= bounds[2]; x += stepX) for (let y = bounds[1]; y <= bounds[3]; y += stepY) {
      const point = [x, y];
      if (!polygons.some(polygon => insideRing(point, polygon[0]) && !polygon.slice(1).some(hole => insideRing(point, hole)))) continue;
      let distance = Infinity;
      for (const ring of rings) for (let i = 1; i < ring.length; i++) distance = Math.min(distance, segmentDistanceSquared(point, ring[i - 1], ring[i]));
      if (distance > bestDistance) { best = point; bestDistance = distance; }
    }
    bounds = [best[0] - stepX, best[1] - stepY, best[0] + stepX, best[1] + stepY];
  }
  return best.map(value => Number(value.toFixed(2)));
}
const counties = countySource.features.map(feature => {
  const polygons = countyPolygons(feature.geometry).map(polygon => polygon.map(ring => simplify(ring.map(countyProject))));
  const d = polygons.flatMap(polygon => polygon.map(ring => ring.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`).join('') + 'Z')).join('');
  const [x, y] = labelPosition(polygons);
  return { code: feature.properties.code, name: feature.properties.name, path: d, x, y };
}).sort((a, b) => a.code.localeCompare(b.code));
const outline = { viewBox: '0 0 640 420', counties };
await writeFile(new URL('../src/components/ui/romania-outline.json', import.meta.url), JSON.stringify(outline) + '\n');
const boundaries = counties.map(county => `<path d="${county.path}"/>`).join('');
const labels = counties.map(county => `<text x="${county.x}" y="${county.y}"${county.code === 'B' ? ' font-size="13"' : ''}>${county.code}</text>`).join('');
const artwork = `<g fill="#fcfdff" stroke="#6c8bb7" stroke-width="1.15" stroke-linejoin="round">${boundaries}</g><g font-family="Arial, sans-serif" font-size="16" font-weight="650" text-anchor="middle" dominant-baseline="central" fill="#17437d" stroke="#fcfdff" stroke-width="1.8" paint-order="stroke">${labels}</g>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">${artwork}</svg>`;
await writeFile(new URL('../public/images/romania-map.svg', import.meta.url), svg + '\n');
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f5f9ff"/><rect x="0" y="0" width="1200" height="8" fill="#075bea"/>
<g transform="translate(70 100) scale(1.1)"><path fill="#0861ee" d="M17.5 1A16 16 0 0 0 1.5 17c0 11 16 25 16 25s16-14 16-25a16 16 0 0 0-16-16Z"/><circle cx="17.5" cy="17" r="6.5" fill="white"/></g>
<g font-family="Arial, sans-serif" fill="#0a173c"><text x="124" y="137" font-size="38" font-weight="700">DirectLocal.ro</text>
<text x="70" y="282" font-size="58" font-weight="700">Găsește firme</text><text x="70" y="354" font-size="58" font-weight="700">locale, simplu.</text>
<text x="70" y="422" font-size="25" fill="#566681">Firme locale. Oameni reali.</text></g>
<svg x="625" y="105" width="540" height="390" viewBox="0 0 640 420">${artwork}</svg>
<path d="M70 510H1130" stroke="#d8e5f7"/><text x="70" y="557" font-family="Arial, sans-serif" font-size="22" fill="#566681">Servicii în orașul sau județul tău</text></svg>`;
await writeFile(new URL('../public/images/directlocal-social.svg', import.meta.url), social + '\n');
await sharp(Buffer.from(social)).jpeg({ quality: 86, mozjpeg: true }).toFile(new URL('../public/images/directlocal-social.jpg', import.meta.url).pathname);
console.log('Romania county map and 1200×630 social image generated from local Natural Earth data.');
