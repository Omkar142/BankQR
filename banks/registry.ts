import type { BankLaunchCapability } from "./types";
// No independently validated launch URIs were supplied. Entries are guidance, not integrations.
export const banks: readonly BankLaunchCapability[] = [
  {
    id: "sbi",
    displayName: "State Bank of India",
    shortName: "SBI",
    launchUri: null,
  },
  { id: "hdfc", displayName: "HDFC Bank", shortName: "HDFC", launchUri: null },
  {
    id: "icici",
    displayName: "ICICI Bank",
    shortName: "ICICI",
    launchUri: null,
  },
  { id: "axis", displayName: "Axis Bank", shortName: "Axis", launchUri: null },
  {
    id: "kotak",
    displayName: "Kotak Mahindra Bank",
    shortName: "Kotak",
    launchUri: null,
  },
];
