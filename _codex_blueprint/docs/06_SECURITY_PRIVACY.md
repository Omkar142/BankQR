
# 06 — Security and Privacy

## Security boundary
BankQR is a payment-instruction utility only. Customer bank credentials and payment authorization remain entirely inside the official banking app/site.

## Never collect
- UPI PIN
- MPIN
- OTP
- Bank password
- Card PIN
- CVV
- Biometric templates/data
- Customer balance/account login

## Merchant bank information
Merchant voluntarily places receiving details into the generated QR payload. Treat this as sensitive financial contact information even though it is intended to be shared with payers.

## Privacy-by-design rules
- Payment payload in URL fragment, not query string.
- No analytics on `/pay` in V0.
- No third-party scripts on `/pay`.
- No remote fonts on `/pay`.
- Use `Referrer-Policy: no-referrer` where deployment permits.
- Add CSP restricting scripts/styles/connect origins to self where practical for static deployment.
- Do not cache decoded payment data in storage.
- Do not log decoded payload to console in production.
- Do not put full account number in page title, OpenGraph metadata, or share preview.

## Display policy
- Mask account number by default in summary: e.g. `•••• •••• 4821`.
- `Copy account number` copies full value.
- Optional reveal control requires explicit user action.
- Merchant preview before generating QR displays full account number so the merchant can catch errors.

## Trust language
Allowed:
- `Details provided by merchant`
- `Confirm the beneficiary name shown by your bank before authorising payment.`

Forbidden unless actual verification is later implemented:
- `Verified merchant`
- `Bank verified`
- `Secure payment verified`
- `Payment successful`

## QR replacement risk
A malicious person can physically replace a printed QR. V0 cannot cryptographically prove physical merchant identity. The customer must verify the beneficiary returned by their bank before authorising.

## Payment confirmation
V0 provides none. Never ask for screenshots. Never treat a customer-entered UTR as confirmed settlement.
