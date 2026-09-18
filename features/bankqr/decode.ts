import { payloadSchema } from "./schema";
import { MAX_FRAGMENT_LENGTH, MAX_JSON_BYTES } from "./constants";
import type { BankQrPayloadV1 } from "./types";
export function decode(hash: string): BankQrPayloadV1 | null {
  try {
    if (hash.length > MAX_FRAGMENT_LENGTH || !/^#v1=[A-Za-z0-9_-]+$/.test(hash))
      return null;
    const encoded = hash.slice(4);
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
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
