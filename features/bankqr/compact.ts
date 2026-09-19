import type { BankQrPayload } from "./types";

// c1 is a transport version, independent of the V1/V2 payment schema.
// Keep slots explicit; account numbers remain strings and amounts remain paise.
export function compactPayload(payload: BankQrPayload): unknown[] {
  const fields: unknown[] = [
    payload.v,
    payload.merchantName,
    payload.accountHolderName,
    payload.accountNumber,
    payload.ifsc,
    payload.createdAt,
    payload.mode === "payment" ? payload.amountPaise : null,
    payload.bankName ?? null,
    payload.reference ?? null,
  ];
  if (payload.v === 2) fields.push(payload.upiId);
  return fields;
}

// This only expands the transport. The caller must validate the result with
// payloadSchema before returning any receiving details to the UI.
export function expandCompactPayload(value: unknown): unknown {
  if (!Array.isArray(value)) return null;
  const fields: unknown[] = value;
  const version = fields[0];
  if (
    (version !== 1 && version !== 2) ||
    fields.length !== (version === 1 ? 9 : 10)
  ) return null;
  return {
    v: version,
    merchantName: fields[1],
    accountHolderName: fields[2],
    accountNumber: fields[3],
    ifsc: fields[4],
    createdAt: fields[5],
    ...(fields[6] === null
      ? { mode: "static" }
      : { mode: "payment", amountPaise: fields[6] }),
    ...(fields[7] === null ? {} : { bankName: fields[7] }),
    ...(fields[8] === null ? {} : { reference: fields[8] }),
    ...(version === 2 ? { upiId: fields[9] } : {}),
  };
}
