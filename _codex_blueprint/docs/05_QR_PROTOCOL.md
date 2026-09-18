
# 05 — BankQR V0 Payload Protocol

## Goal
Portable HTTPS QR that any normal scanner can open while avoiding bank details in standard query strings/server request logs.

## URL shape
`https://<host>/pay#v1=<BASE64URL_JSON>`

## Schema
```ts
type BankQrPayloadV1 = {
  v: 1
  mode: "static" | "payment"
  merchantName: string
  accountHolderName: string
  accountNumber: string
  ifsc: string
  bankName?: string
  amountPaise?: number
  reference?: string
  createdAt: string // ISO timestamp
}
```

## Field rules
- `v`: exactly `1`.
- `merchantName`: 2–80 trimmed Unicode characters.
- `accountHolderName`: 2–100 trimmed Unicode characters.
- `accountNumber`: 6–20 digits; do not overfit to one bank's account length.
- `ifsc`: normalize uppercase; regex `^[A-Z]{4}0[A-Z0-9]{6}$`.
- `bankName`: optional 2–80 chars; merchant-provided.
- `amountPaise`: required for `payment`, omitted for `static`; positive safe integer.
- `reference`: optional, max 40 chars, allow letters/numbers/common `-_/` punctuation.
- `createdAt`: ISO 8601.

## Encoding
1. Normalize form data.
2. Validate with Zod.
3. JSON stringify without whitespace.
4. UTF-8 encode.
5. Base64URL encode.
6. Prefix fragment with `v1=`.

## Decoding
1. Read `window.location.hash`.
2. Require `#v1=` prefix.
3. Base64URL decode.
4. UTF-8 decode.
5. JSON parse inside try/catch.
6. Zod validate.
7. Normalize safe display values.
8. Only then render.

## Integrity limitation
V0 payload is NOT cryptographically authenticated. Base64URL is encoding, not encryption. Never label it secure/verified because of encoding.

## QR sizing
Keep payload deliberately small. If QR density becomes visually excessive, shorten optional merchant/reference fields before adding infrastructure.

## Static QR amount behavior
Customer-entered amount exists only in page state and clipboard output. It is not written back into the original QR.
