import { expect, it } from "vitest";
import { createPayload } from "@/features/bankqr/draft";
import { amountText } from "@/lib/currency";
import { maskAccount } from "@/features/bankqr/normalize";
import { qrFilename } from "@/lib/download";
import { encode } from "@/features/bankqr/encode";
const form = {
  merchantName: "Kiran Store",
  accountHolderName: "Kiran Rao",
  accountNumber: "001234567890",
  confirmAccountNumber: "001234567890",
  ifsc: "hdfc0001234",
  bankName: "",
  mode: "static" as const,
  amount: "100",
  reference: "INV-1",
  confirmed: true,
};
it("builds static payload without hidden payment values or empty optional bank", () => {
  const { payload, profile } = createPayload(form);
  expect(payload).not.toHaveProperty("amountPaise");
  expect(payload).not.toHaveProperty("reference");
  expect(profile).not.toHaveProperty("bankName");
  expect(profile).not.toHaveProperty("mode");
});
it("builds fixed payment and optional reference", () => {
  expect(
    createPayload({ ...form, mode: "payment", bankName: "HDFC Bank" }).payload,
  ).toMatchObject({
    mode: "payment",
    amountPaise: 10000,
    reference: "INV-1",
    bankName: "HDFC Bank",
  });
  expect(
    createPayload({ ...form, mode: "payment", reference: "" }).payload,
  ).not.toHaveProperty("reference");
});
it("rejects invalid amounts and references at form boundary", () => {
  expect(() =>
    createPayload({ ...form, mode: "payment", amount: "0" }),
  ).toThrow();
  expect(() =>
    createPayload({ ...form, mode: "payment", reference: "<script>" }),
  ).toThrow();
});
it("masks account and sanitizes portable filenames", () => {
  expect(maskAccount("001234567890")).toBe("•••• •••• 7890");
  expect(qrFilename("../Kiran Store", new Date("2026-09-18"))).toBe(
    "bankqr-kiran-store-20260918.png",
  );
  expect(qrFilename("किरण", new Date("2026-09-18"))).toBe(
    "bankqr-merchant-20260918.png",
  );
});
it.each([0, -1, 1.1, Infinity, Number.MAX_SAFE_INTEGER + 1])(
  "rejects invalid internal currency %s",
  (value) => expect(() => amountText(value)).toThrow(),
);
it("encoder rejects invalid schema", () =>
  expect(() => encode({ v: 2 })).toThrow());
