import { z } from "zod";
import { normalizeAccount, normalizeIfsc } from "./normalize";
import { parseAmount } from "@/lib/currency";

// Reject invisible controls and directional overrides that could disguise receiving details.
const safeText = (min: number, max: number) =>
  z
    .string()
    .trim()
    .refine((value) => {
      const length = Array.from(value).length;
      return length >= min && length <= max;
    }, `Use ${min}–${max} characters.`)
    .refine(
      (value) => !/[\p{Cc}\p{Cf}\p{Cs}]/u.test(value),
      "Remove invisible or control characters.",
    );
const account = z
  .string()
  .transform(normalizeAccount)
  .pipe(
    z.string().regex(/^\d{6,20}$/, "Enter an account number with 6–20 digits."),
  );
const ifsc = z
  .string()
  .transform(normalizeIfsc)
  .pipe(
    z
      .string()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid 11-character IFSC."),
  );
const reference = safeText(1, 40).refine(
  (value) => /^[\p{L}\p{N} _\-/]+$/u.test(value),
  "Use letters, numbers, spaces, - _ or /.",
);
const fields = {
  merchantName: safeText(2, 80),
  accountHolderName: safeText(2, 100),
  accountNumber: account,
  ifsc,
  bankName: safeText(2, 80).optional(),
};
export const profileSchema = z.object(fields).strict();
const common = {
  ...fields,
  v: z.literal(1),
  createdAt: z.iso.datetime({ offset: true }),
  reference: reference.optional(),
};
export const payloadSchema = z.discriminatedUnion("mode", [
  z.object({ ...common, mode: z.literal("static") }).strict(),
  z
    .object({
      ...common,
      mode: z.literal("payment"),
      amountPaise: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
    })
    .strict(),
]);
export const merchantFormSchema = z
  .object({
    ...fields,
    bankName: z.union([z.literal(""), safeText(2, 80)]),
    confirmAccountNumber: account,
    mode: z.enum(["static", "payment"]),
    amount: z.string(),
    reference: z.string(),
    confirmed: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (value.accountNumber !== value.confirmAccountNumber)
      ctx.addIssue({
        code: "custom",
        path: ["confirmAccountNumber"],
        message: "The account numbers do not match.",
      });
    if (!value.confirmed)
      ctx.addIssue({
        code: "custom",
        path: ["confirmed"],
        message: "Confirm the receiving details before generating your QR.",
      });
    if (value.mode === "payment" && parseAmount(value.amount) === null)
      ctx.addIssue({
        code: "custom",
        path: ["amount"],
        message:
          "Enter an amount greater than ₹0, with up to 2 decimal places.",
      });
    if (
      value.mode === "payment" &&
      value.reference.trim() &&
      !reference.safeParse(value.reference).success
    )
      ctx.addIssue({
        code: "custom",
        path: ["reference"],
        message: "Use up to 40 letters, numbers, spaces, - _ or /.",
      });
  });
