export function parseAmount(value: string): number | null {
  const input = value.trim();
  if (input.length > 20 || !/^\d+(?:\.\d{1,2})?$/.test(input)) return null;
  const [whole, fraction = ""] = input.split(".");
  const paise = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
  return paise > 0n && paise <= BigInt(Number.MAX_SAFE_INTEGER)
    ? Number(paise)
    : null;
}
export function amountText(paise: number): string {
  if (!Number.isSafeInteger(paise) || paise <= 0)
    throw new Error("Invalid amount");
  const value = BigInt(paise);
  return `${value / 100n}.${String(value % 100n).padStart(2, "0")}`;
}
export function formatCurrency(paise: number): string {
  const [whole, fraction] = amountText(paise).split(".");
  return `₹${new Intl.NumberFormat("en-IN").format(BigInt(whole))}.${fraction}`;
}
