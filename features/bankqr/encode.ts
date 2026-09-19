import { payloadSchema } from "./schema";
import { MAX_FRAGMENT_LENGTH, MAX_JSON_BYTES } from "./constants";
import { compactPayload } from "./compact";
export function encode(value: unknown): string {
  const payload = payloadSchema.parse(value);
  const bytes = new TextEncoder().encode(JSON.stringify(compactPayload(payload)));
  if (bytes.length > MAX_JSON_BYTES)
    throw new Error("QR details are too long. Shorten optional fields.");
  const encoded = btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
  const fragment = `#c1=${encoded}`;
  if (fragment.length > MAX_FRAGMENT_LENGTH)
    throw new Error("QR details are too long.");
  return fragment;
}
export function paymentUrl(
  value: unknown,
  origin: string,
  basePath = "",
): string {
  const parsed = new URL(origin);
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(
    parsed.hostname,
  );
  if (
    (parsed.protocol !== "https:" &&
      !(parsed.protocol === "http:" && loopback)) ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    parsed.pathname !== "/"
  )
    throw new Error("Use an HTTPS site to generate a shareable QR.");
  const segments = basePath.split("/").filter(Boolean);
  if (
    basePath &&
    (!/^\/(?:[A-Za-z0-9._~-]+\/?)*$/.test(basePath) ||
      basePath.endsWith("/") ||
      segments.some((segment) => segment === "." || segment === ".."))
  )
    throw new Error("Invalid deployment base path.");
  return `${parsed.origin}${basePath}/pay/${encode(value)}`;
}
