import { merchantFormSchema, payloadSchema, profileSchema } from "./schema";
import { parseAmount } from "@/lib/currency";
import type { MerchantFormValues } from "./types";
export function createPayload(values: MerchantFormValues) {
  const form = merchantFormSchema.parse(values);
  const profile = profileSchema.parse({
    merchantName: form.merchantName,
    accountHolderName: form.accountHolderName,
    accountNumber: form.accountNumber,
    ifsc: form.ifsc,
    ...(form.bankName ? { bankName: form.bankName } : {}),
  });
  const payload = payloadSchema.parse({
    ...profile,
    v: 1,
    mode: form.mode,
    createdAt: new Date().toISOString(),
    ...(form.mode === "payment"
      ? {
          amountPaise: parseAmount(form.amount),
          ...(form.reference.trim()
            ? { reference: form.reference.trim() }
            : {}),
        }
      : {}),
  });
  return { profile, payload };
}
