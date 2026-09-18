import { z } from "zod";
import { amountText } from "@/lib/currency";
import { upiIdSchema } from "./schema";

const upiIntentSchema = z
  .object({
    upiId: upiIdSchema,
    payeeName: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .refine((value) => !/[\p{Cc}\p{Cf}\p{Cs}]/u.test(value)),
    amountPaise: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
    note: z
      .string()
      .trim()
      .min(1)
      .max(40)
      .refine((value) => /^[\p{L}\p{N} _\-/]+$/u.test(value))
      .optional(),
  })
  .strict();

export function buildUpiIntent(input: z.input<typeof upiIntentSchema>): string {
  const value = upiIntentSchema.parse(input);
  const query = new URLSearchParams([
    ["pa", value.upiId],
    ["pn", value.payeeName],
    ["am", amountText(value.amountPaise)],
    ["cu", "INR"],
  ]);
  if (value.note) query.set("tn", value.note);
  return `upi://pay?${query.toString()}`;
}
