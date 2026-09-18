import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("out");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".webmanifest": "application/manifest+json",
};
createServer(async (req, res) => {
  const headers = {};
  try {
    for (const line of (
      await readFile(resolve(root, "_headers"), "utf8")
    ).split("\n")) {
      const match = line.match(/^  ([\w-]+): (.+)$/);
      if (match) headers[match[1]] = match[2];
    }
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    let file = resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + sep))
      throw new Error("Invalid path");
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const content = await readFile(file);
    res.writeHead(200, {
      ...headers,
      "Content-Type": mime[extname(file)] || "application/octet-stream",
    });
    res.end(content);
  } catch {
    res.writeHead(404, { ...headers, "Content-Type": "text/html" });
    res.end(await readFile(resolve(root, "404.html")).catch(() => "Not found"));
  }
}).listen(4173, "127.0.0.1", () =>
  console.log("BankQR preview: http://127.0.0.1:4173"),
);
