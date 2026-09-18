import { banks } from "./registry";
export function launchCapability(id: string): string | null {
  const bank = banks.find((item) => item.id === id);
  return bank?.verifiedOn ? bank.launchUri : null;
}
