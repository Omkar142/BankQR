import type { z } from "zod";
import type {
  payloadSchema,
  merchantFormSchema,
  profileSchema,
} from "./schema";
export type BankQrPayload = z.infer<typeof payloadSchema>;
export type BankQrPayloadV1 = Extract<BankQrPayload, { v: 1 }>;
export type MerchantFormValues = z.input<typeof merchantFormSchema>;
export type MerchantProfile = z.infer<typeof profileSchema>;
