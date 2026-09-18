
# 11 — Acceptance Criteria

## Merchant
- New merchant reaches generated QR in <= 90 seconds without instructions.
- Account confirmation prevents accidental single-entry typo.
- Static/payment mode difference is obvious.
- QR is readable at normal mobile display size.
- Downloaded QR scans successfully from another device.
- Merchant can test the generated customer page before printing.

## Customer
- Normal camera/scanner opens HTTPS BankQR page.
- Merchant name visible above the fold.
- Fixed amount visible above the fold for payment QR.
- Copy account/IFSC/amount each take one tap.
- Copy feedback is immediate and specific.
- Customer is told to verify beneficiary in bank app.
- No BankQR login/install required.
- No payment-success claim exists.

## Visual
- Premium, calm financial appearance.
- No generic template feel.
- Consistent token use.
- Smooth but restrained motion.
- 320px phone remains usable.
- Tap targets >= 44px.

## Performance
Target, not absolute contractual SLA:
- Static-export page should feel instant on normal 4G.
- Avoid large hero imagery/video.
- Keep third-party JS at zero on payment route.

## Privacy
- Bank details absent from server request query/path.
- No decoded payload logs.
- No analytics on payment route.
