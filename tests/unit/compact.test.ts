import { describe, expect, it } from "vitest";
import { encode, paymentUrl } from "@/features/bankqr/encode";
import { decode } from "@/features/bankqr/decode";

const bank = {
  v: 1,
  mode: "static",
  merchantName: "Kiran Stores",
  accountHolderName: "Kiran Rao",
  accountNumber: "001234567890",
  ifsc: "HDFC0001234",
  createdAt: "2026-09-18T00:00:00.000Z",
} as const;
const fragment = (value: unknown, prefix = "c1") =>
  `#${prefix}=` + Buffer.from(JSON.stringify(value)).toString("base64url");
const tuple = [
  1, bank.merchantName, bank.accountHolderName, bank.accountNumber,
  bank.ifsc, bank.createdAt, null, null, null,
];

describe("compact sharing links", () => {
  it.each([
    bank,
    { ...bank, mode: "payment", amountPaise: 12500 },
    { ...bank, v: 2, upiId: "kiran@bank" },
    { ...bank, v: 2, upiId: "kiran@bank", mode: "payment", amountPaise: 12500 },
  ])("round trips all supported payload variants", (payload) => {
    expect(encode(payload)).toMatch(/^#c1=/);
    expect(decode(encode(payload))).toEqual(payload);
    expect(decode(fragment(payload, `v${payload.v}`))).toEqual(payload);
  });

  it("makes a representative shared link at least 35 percent shorter", () => {
    const origin = "https://omkar142.github.io";
    const legacy = `${origin}/BankQR/pay/${fragment(bank, "v1")}`;
    const compact = paymentUrl(bank, origin, "/BankQR");
    expect(compact.length).toBeLessThan(legacy.length * 0.65);
    expect(new URL(compact).search).toBe("");
    expect(decode(new URL(compact).hash)).toEqual(bank);
  });

  it("preserves Unicode, exact time offsets, optional values and safe-integer amounts", () => {
    const payload = {
      ...bank, mode: "payment", amountPaise: Number.MAX_SAFE_INTEGER,
      merchantName: "किरण दुकान", bankName: "Example Bank", reference: "INV-1/2_A",
      createdAt: "2026-09-18T05:30:00+05:30",
    };
    expect(decode(encode(payload))).toEqual(payload);
  });

  it.each([
    [], [...tuple, "discarded-extra"], tuple.slice(0, -1),
    [3, ...tuple.slice(1)], [2, ...tuple.slice(1)],
    [...tuple.slice(0, 6), 0, null, null],
    [...tuple.slice(0, 6), "12500", null, null],
    [...tuple.slice(0, 7), {}, null],
    [...tuple.slice(0, 8), "<script>"],
    [1, "Bad\u202ename", ...tuple.slice(2)],
    [1, ...tuple.slice(1, 3), 1234567890, ...tuple.slice(4)],
    bank,
  ])("rejects malformed compact data without discarding unknown fields: %j", (value) => {
    expect(decode(fragment(value))).toBeNull();
  });

  it.each(["#c2=abcd", "#c1=_w", "#c1=%%%", "#c1=" + "a".repeat(4096)])(
    "rejects bad transport or oversized input: %s", (value) => {
      expect(decode(value)).toBeNull();
    },
  );
});
