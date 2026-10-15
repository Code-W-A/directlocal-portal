// Local-only test server for exported files. Never deployed as an application backend.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";
const root = path.resolve("out");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".jpg": "image/jpeg", ".ico": "image/x-icon" };
const server = createServer(async (request, response) => {
  try {
    if (!["GET", "HEAD"].includes(request.method ?? "")) { response.writeHead(405); response.end(); return; }
    const url = new URL(request.url ?? "/", "http://localhost");
    let target = path.resolve(root, "." + decodeURIComponent(url.pathname));
    if (target !== root && !target.startsWith(root + path.sep)) { response.writeHead(403); response.end(); return; }
    try {
      if ((await stat(target)).isDirectory()) {
        if (!url.pathname.endsWith("/")) { response.writeHead(308, { Location: url.pathname + "/" + url.search }); response.end(); return; }
        target = path.join(target, "index.html");
      }
      const body = await readFile(target);
      const type = types[path.extname(target)] ?? "application/octet-stream";
      const compressed = /text\/|javascript|json|xml|svg/.test(type) && /\bgzip\b/.test(request.headers['accept-encoding'] ?? '');
      const payload = compressed ? gzipSync(body) : body;
      const cache = target.includes(`${path.sep}_next${path.sep}static${path.sep}`) ? 'public, max-age=31536000, immutable' : /\.(avif|webp|jpg|woff2)$/.test(target) ? 'public, max-age=86400' : 'no-cache';
      response.writeHead(200, { "Content-Type": type, "Content-Length": payload.length, "Vary": "Accept-Encoding", "Cache-Control": cache, ...(compressed ? { "Content-Encoding": "gzip" } : {}) });
      response.end(request.method === "HEAD" ? undefined : payload);
    } catch {
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(request.method === "HEAD" ? undefined : await readFile(path.join(root, "404.html")));
    }
  } catch { response.writeHead(400); response.end("Bad request"); }
});
server.listen(Number(process.env.PORT ?? 4173), "127.0.0.1", () => console.log("Static export at http://127.0.0.1:" + (process.env.PORT ?? 4173)));
