import { describe, expect, it } from "vitest";
import { buildUpiIntent } from "@/features/bankqr/upi";

describe("UPI intent", () => {
  it("builds an exact INR payment URI without bank-account leakage", () => {
    const intent = buildUpiIntent({
      upiId: "kiran.store@bank",
      payeeName: "Kiran Rao & Co",
      amountPaise: 125,
      note: "INV-1/2_A",
    });
    const url = new URL(intent);
    expect(url.protocol).toBe("upi:");
    expect(url.host).toBe("pay");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      pa: "kiran.store@bank",
      pn: "Kiran Rao & Co",
      am: "1.25",
      cu: "INR",
      tn: "INV-1/2_A",
    });
    expect(intent).not.toContain("001234567890");
    expect(intent).not.toContain("HDFC0001234");
  });

  it.each([0, -1, 1.2, Number.MAX_SAFE_INTEGER + 1])(
    "rejects unsafe paise value %s",
    (amountPaise) =>
      expect(() =>
        buildUpiIntent({
          upiId: "kiran@bank",
          payeeName: "Kiran Rao",
          amountPaise,
        }),
      ).toThrow(),
  );

  it("omits an empty payment note", () => {
    const url = new URL(
      buildUpiIntent({
        upiId: "kiran@bank",
        payeeName: "Kiran Rao",
        amountPaise: 100,
      }),
    );
    expect(url.searchParams.has("tn")).toBe(false);
  });
});
