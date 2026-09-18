
# 01 — Scope and Non-Goals

## In scope
- Mobile-first landing page.
- Merchant QR generator.
- Static and payment-specific QR modes.
- Merchant details stored locally on the merchant device for convenience.
- QR encoded as a normal HTTPS URL.
- Customer payment detail page.
- Copy account number, IFSC, amount, and reference.
- Optional bank-picker sheet.
- Only validated generic bank-app launching where possible.
- Download QR as PNG.
- Share QR/payment link using Web Share API when available.
- Clear disclaimers and beneficiary-verification guidance.
- Privacy and Terms pages.
- Responsive desktop layout for merchant creation.

## Explicitly out of scope
- Payment initiation.
- Automatic beneficiary creation.
- Automatic beneficiary verification.
- Merchant KYC/KYB.
- Payment confirmation.
- UTR verification.
- QR scanner inside BankQR.
- Customer accounts.
- Merchant accounts.
- Backend.
- Database.
- Cloud storage.
- SMS/email.
- Push notifications.
- Soundbox.
- POS integration.
- Banking Connect.
- Bank APIs.
- UPI payments.
- Cards.
- Wallet.
- Refunds.
- Settlement.
- Reconciliation.
- iOS/Android native apps.

## Kill rule
Do not expand V0 because a feature is "nice to have." Every addition must directly improve the merchant-create or customer-pay validation loop.
