
# 07 — Component Contracts

## MerchantForm
Responsibilities:
- Collect normalized merchant/payment fields.
- Validate on blur + submit.
- Keep account/confirm-account separate.
- Never generate QR until confirmation checkbox is checked.

Inputs:
`initialProfile?`

Outputs:
`onValidSubmit(payloadDraft)`

## ModeSwitcher
Two options only:
- Static QR
- Payment QR

Switching from payment -> static must clear amount/reference only after a small confirm if non-empty.

## MerchantPreviewCard
Customer-style preview before generation.
Must include `Details provided by merchant` indicator.

## QrResultCard
Shows QR, type, masked merchant data, Download, Share, Test.
Download filename format:
`bankqr-<sanitized-merchant>-<YYYYMMDD>.png`

## PaymentHero
Inputs:
- merchantName
- mode
- amount if fixed/customer-entered

Displays amount as strongest visual element when known.

## PaymentDetailsCard
Rows:
- Account holder
- Account number
- IFSC
- Amount
- Reference

Each copyable row must have screen-reader label including the field name.

## CopyFieldRow
States:
`idle | copied | failed`

Copied state lasts ~1.2s; no persistent success that could be confused with payment success.

## AmountEntry
Static QR only.
Use numeric decimal keyboard hints.
Store amount internally as integer paise after parsing.

## BankLaunchSheet
Contains only banks present in `banks/registry.ts`.
Bank entry contract:
```ts
type BankLaunchCapability = {
  id: string
  displayName: string
  shortName: string
  launchUri: string | null
  verifiedOn?: string
  notes?: string
}
```

If `launchUri` is null, do not render a fake deep-link button. Render `Open your banking app manually` guidance.

## SafetyNote
Compact information surface near the final bank CTA:
`Confirm the beneficiary name shown by your bank before authorising payment.`
