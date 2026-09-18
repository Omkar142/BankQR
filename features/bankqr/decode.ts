import { payloadSchema } from "./schema";
import { MAX_FRAGMENT_LENGTH, MAX_JSON_BYTES } from "./constants";
import type { BankQrPayload } from "./types";
export function decode(hash: string): BankQrPayload | null {
  try {
    const match = hash.match(/^#v([12])=([A-Za-z0-9_-]+)$/);
    if (hash.length > MAX_FRAGMENT_LENGTH || !match)
      return null;
    const [, version, encoded] = match;
    const binary = atob(encoded.replaceAll("-", "+").replaceAll("_", "/"));
    if (
      binary.length > MAX_JSON_BYTES ||
      btoa(binary)
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replace(/=+$/, "") !== encoded
    )
      return null;
    const text = new TextDecoder("utf-8", { fatal: true }).decode(
      Uint8Array.from(binary, (char) => char.charCodeAt(0)),
    );
    const result = payloadSchema.safeParse(JSON.parse(text));
    return result.success && String(result.data.v) === version
      ? result.data
      : null;
  } catch {
    return null;
  }
}
