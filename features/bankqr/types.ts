import type { z } from "zod";
import type {
  payloadSchema,
  merchantFormSchema,
  profileSchema,
} from "./schema";
export type BankQrPayloadV1 = z.infer<typeof payloadSchema>;
export type MerchantFormValues = z.input<typeof merchantFormSchema>;
export type MerchantProfile = z.infer<typeof profileSchema>;
