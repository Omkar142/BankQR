import { z } from "zod";
import { profileSchema } from "@/features/bankqr/schema";
import type { MerchantProfile } from "@/features/bankqr/types";
export const PROFILE_KEY = "bankqr:merchant:v1";
type StoragePort = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const envelope = z.object({ v: z.literal(1), profile: profileSchema }).strict();
export function loadProfile(storage: StoragePort): MerchantProfile | null {
  try {
    const raw = storage.getItem(PROFILE_KEY);
    if (!raw || raw.length > 4096) return null;
    const parsed = envelope.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data.profile : null;
  } catch {
    return null;
  }
}
export function saveProfile(
  storage: StoragePort,
  profile: MerchantProfile,
): boolean {
  try {
    storage.setItem(
      PROFILE_KEY,
      JSON.stringify(envelope.parse({ v: 1, profile })),
    );
    return true;
  } catch {
    return false;
  }
}
export function clearProfile(storage: StoragePort): boolean {
  try {
    storage.removeItem(PROFILE_KEY);
    return true;
  } catch {
    return false;
  }
}
