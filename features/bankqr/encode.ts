import { payloadSchema } from "./schema";
import { MAX_FRAGMENT_LENGTH, MAX_JSON_BYTES } from "./constants";
export function encode(value: unknown): string {
  const payload = payloadSchema.parse(value);
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  if (bytes.length > MAX_JSON_BYTES)
    throw new Error("QR details are too long. Shorten optional fields.");
  const encoded = btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
  const fragment = `#v1=${encoded}`;
  if (fragment.length > MAX_FRAGMENT_LENGTH)
    throw new Error("QR details are too long.");
  return fragment;
}
export function paymentUrl(value: unknown, origin: string): string {
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
  return `${parsed.origin}/pay/${encode(value)}`;
}
