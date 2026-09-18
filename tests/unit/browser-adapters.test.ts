import { it, expect } from "vitest";
import {
  loadProfile,
  saveProfile,
  clearProfile,
  PROFILE_KEY,
} from "@/lib/local-storage";
import { copyText } from "@/lib/clipboard";
const profile = {
  merchantName: "Kiran Store",
  accountHolderName: "Kiran Rao",
  accountNumber: "001234567890",
  ifsc: "HDFC0001234",
  bankName: "HDFC Bank",
};
function memory() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
}
it("saves only on request and loads a versioned merchant-only profile", () => {
  const storage = memory();
  expect(loadProfile(storage)).toBeNull();
  expect(saveProfile(storage, profile)).toBe(true);
  expect(loadProfile(storage)).toEqual(profile);
  expect(JSON.parse(storage.getItem(PROFILE_KEY)!)).toEqual({ v: 1, profile });
  expect(clearProfile(storage)).toBe(true);
  expect(loadProfile(storage)).toBeNull();
});
it("ignores corrupt unknown and oversized profiles", () => {
  const storage = memory();
  for (const value of [
    "oops",
    JSON.stringify({ v: 2, profile }),
    JSON.stringify({ v: 1, profile: { ...profile, amountPaise: 20 } }),
    "a".repeat(10000),
  ]) {
    storage.setItem(PROFILE_KEY, value);
    expect(loadProfile(storage)).toBeNull();
  }
});
it("handles blocked storage without throwing", () => {
  const storage = {
    getItem: () => {
      throw Error();
    },
    setItem: () => {
      throw Error();
    },
    removeItem: () => {
      throw Error();
    },
  };
  expect(loadProfile(storage)).toBeNull();
  expect(saveProfile(storage, profile)).toBe(false);
  expect(clearProfile(storage)).toBe(false);
});
it("copies full value or reports a selectable fallback", async () => {
  let copied = "";
  expect(
    await copyText("001234567890", {
      writeText: async (value) => {
        copied = value;
      },
    }),
  ).toBe(true);
  expect(copied).toBe("001234567890");
  expect(await copyText("x", undefined)).toBe(false);
  expect(
    await copyText("x", {
      writeText: async () => {
        throw Error();
      },
    }),
  ).toBe(false);
});
