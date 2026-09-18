import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : join(dir, e.name),
      ),
    )
  ).flat();
}
const htmlFiles = (await walk("out")).filter((file) => file.endsWith(".html"));
const hashes = new Set();
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!/\bsrc=/.test(match[1]))
      hashes.add(
        `'sha256-${createHash("sha256").update(match[2]).digest("base64")}'`,
      );
  }
}
const csp = `default-src 'self'; script-src 'self' ${[...hashes].join(" ")}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`;
const metaCsp = csp.replace("; frame-ancestors 'none'", "");
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  if (!html.includes('http-equiv="Content-Security-Policy"')) {
    await writeFile(
      file,
      html.replace(
        "<head>",
        `<head><meta http-equiv="Content-Security-Policy" content="${metaCsp}">`,
      ),
    );
  }
}
await writeFile(
  "out/_headers",
  `/*\n  Content-Security-Policy: ${csp}\n  Referrer-Policy: no-referrer\n  X-Content-Type-Options: nosniff\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: DENY\n`,
);
console.log("Generated static hosting security headers and CSP meta fallback.");
