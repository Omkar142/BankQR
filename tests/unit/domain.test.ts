import { describe, it, expect } from "vitest";
import { encode, paymentUrl } from "@/features/bankqr/encode";
import { decode } from "@/features/bankqr/decode";
import { payloadSchema, merchantFormSchema } from "@/features/bankqr/schema";
import { parseAmount, amountText, formatCurrency } from "@/lib/currency";
import { normalizeAccount } from "@/features/bankqr/normalize";
import { launchCapability } from "@/banks/launch";

const base = {
  v: 1,
  mode: "static",
  merchantName: "किरण Store",
  accountHolderName: "Kiran Rao",
  accountNumber: "001234567890",
  ifsc: "HDFC0001234",
  createdAt: "2026-09-18T00:00:00.000Z",
};
const raw = (value: unknown, version = 1) =>
  `#v${version}=` + Buffer.from(JSON.stringify(value)).toString("base64url");
describe("fragment protocol", () => {
  it("round trips Unicode and leading zeros", () => {
    expect(decode(encode(base))).toEqual(base);
  });
  it("normalizes merchant inputs", () => {
    const parsed = payloadSchema.parse({
      ...base,
      merchantName: "  Kiran Store  ",
      accountNumber: "0012-3456 7890",
      ifsc: " hdfc0001234 ",
    });
    expect(parsed.accountNumber).toBe("001234567890");
    expect(parsed.ifsc).toBe("HDFC0001234");
    expect(parsed.merchantName).toBe("Kiran Store");
  });
  it("creates same-origin fragment-only URLs", () => {
    const url = new URL(paymentUrl(base, "https://bankqr.example"));
    expect(url.pathname).toBe("/pay/");
    expect(url.search).toBe("");
    expect(decode(url.hash)).toEqual(base);
  });
  it("creates fragment-only URLs under a static hosting base path", () => {
    const url = new URL(paymentUrl(base, "https://omkar142.github.io", "/BankQR"));
    expect(url.pathname).toBe("/BankQR/pay/");
    expect(url.search).toBe("");
    expect(decode(url.hash)).toEqual(base);
  });
  it.each(["BankQR", "/../BankQR", "/BankQR?x=1", "/Bank QR"])(
    "rejects unsafe base path %s",
    (basePath) => expect(() => paymentUrl(base, "https://bankqr.example", basePath)).toThrow(),
  );
  it.each([
    "http://example.com",
    "https://u:p@example.com",
    "javascript:alert(1)",
    "https://example.com/path",
    "https://example.com?x=1",
  ])("rejects unsafe origin %s", (origin) =>
    expect(() => paymentUrl(base, origin)).toThrow(),
  );
  it("allows loopback preview", () =>
    expect(paymentUrl(base, "http://127.0.0.1:4173")).toContain("/pay/#c1="));
  it("accepts fixed amount and optional reference", () =>
    expect(
      decode(
        encode({
          ...base,
          mode: "payment",
          amountPaise: 125,
          reference: "INV-1/2_A",
        }),
      ),
    ).toMatchObject({ amountPaise: 125 }));
  it("round trips a V2 payload with a UPI payment address", () => {
    const upiPayload = {
      ...base,
      v: 2,
      upiId: "kiran.store@bank",
      mode: "payment",
      amountPaise: 125,
    } as const;
    expect(encode(upiPayload)).toMatch(/^#c1=/);
    expect(decode(encode(upiPayload))).toEqual(upiPayload);
  });
  it("keeps fragment and payload versions consistent", () => {
    expect(decode(raw({ ...base, v: 2, upiId: "kiran@bank" }, 1))).toBeNull();
    expect(decode(raw(base, 2))).toBeNull();
  });
  it.each([
    "",
    "missing-at",
    "two@@bank",
    "space name@bank",
    "name@",
    "name@bank<script>",
    `name@${"b".repeat(65)}`,
  ])("rejects unsafe UPI ID %j", (upiId) =>
    expect(
      payloadSchema.safeParse({ ...base, v: 2, upiId }).success,
    ).toBe(false),
  );
  it.each([
    { v: 2 },
    { mode: "payment" },
    { amountPaise: 100 },
    { mode: "payment", amountPaise: 0 },
    { mode: "payment", amountPaise: 1.2 },
    { mode: "payment", amountPaise: Number.MAX_SAFE_INTEGER + 1 },
    { ifsc: "BAD" },
    { accountNumber: "123" },
    { accountNumber: "12345x" },
    { merchantName: "x" },
    { merchantName: "a".repeat(81) },
    { merchantName: "ab\u202Ecd" },
    { reference: "<script>" },
    { createdAt: "yesterday" },
    { extra: "secret" },
  ])("rejects schema violation %j", (patch) =>
    expect(decode(raw({ ...base, ...patch }))).toBeNull(),
  );
  it.each([
    "",
    "#v2=abcd",
    "#v1=%%%",
    "#v1=abc=",
    "#v1=e30",
    "#v1=" + Buffer.from("{oops").toString("base64url"),
    "#v1=_w",
    "#v1=" + "a".repeat(5000),
  ])("fails closed on invalid encoding", (hash) =>
    expect(decode(hash)).toBeNull(),
  );
  it("normalizes accounts without losing zeros", () =>
    expect(normalizeAccount(" 0012-3456 ")).toBe("00123456"));
  it("requires matching account and consent", () => {
    const form = {
      merchantName: "Kiran Store",
      accountHolderName: "Kiran Rao",
      accountNumber: "001234567890",
      confirmAccountNumber: "001234567899",
      ifsc: "HDFC0001234",
      bankName: "",
      mode: "static",
      amount: "",
      reference: "",
      upiId: "",
      confirmed: false,
    };
    expect(merchantFormSchema.safeParse(form).success).toBe(false);
    expect(
      merchantFormSchema.safeParse({
        ...form,
        confirmAccountNumber: "001234567890",
        confirmed: true,
      }).success,
    ).toBe(true);
    expect(
      merchantFormSchema.safeParse({
        ...form,
        confirmAccountNumber: "001234567890",
        confirmed: true,
        upiId: "not a vpa",
      }).success,
    ).toBe(false);
  });
});
describe("exact currency", () => {
  it.each([
    ["1", 100],
    ["1.25", 125],
    ["0.01", 1],
    ["0001.20", 120],
    ["90071992547409.91", Number.MAX_SAFE_INTEGER],
  ])("parses %s", (input, expected) =>
    expect(parseAmount(input)).toBe(expected),
  );
  it.each([
    "",
    "0",
    "-1",
    "1.001",
    "NaN",
    "1e3",
    "1,000",
    "Infinity",
    "90071992547409.92",
    "1.",
    ".",
  ])("rejects %s", (input) => expect(parseAmount(input)).toBeNull());
  it("formats values without float rounding", () => {
    expect(amountText(125)).toBe("1.25");
    expect(amountText(Number.MAX_SAFE_INTEGER)).toBe("90071992547409.91");
    expect(formatCurrency(125)).toContain("1.25");
  });
});
describe("bank capabilities", () => {
  it("never invents bank links", () => {
    expect(launchCapability("unknown")).toBeNull();
    expect(launchCapability("sbi")).toBeNull();
  });
});
