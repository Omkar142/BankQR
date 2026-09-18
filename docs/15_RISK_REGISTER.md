
# 15 — Risk Register

## R1 — User friction remains too high
Impact: existential.
Mitigation: field-test before backend/native app investment.
Kill criterion: customers overwhelmingly prefer UPI/manual alternatives and merchants cannot influence behavior.

## R2 — Beneficiary-addition friction
Impact: high.
Some bank apps may require adding a beneficiary before NEFT/IMPS.
Mitigation: observe by bank during validation; document conversion friction.

## R3 — Merchant enters wrong account
Impact: high.
Mitigation: account-number confirmation, merchant preview, mandatory confirmation checkbox, self-test flow.
No fake verification badge.

## R4 — Physical QR replacement
Impact: high.
Mitigation: beneficiary-name confirmation warning. V0 cannot eliminate this cryptographically.

## R5 — Users interpret BankQR as a payment processor
Impact: medium/high.
Mitigation: precise microcopy: payment details utility; bank performs payment.

## R6 — Bank app launch unreliable
Impact: medium.
Mitigation: registry only for validated launch behavior; manual fallback always available.

## R7 — Sensitive data in logs
Impact: medium.
Mitigation: URL fragment payload; no third-party analytics/pay-page scripts; no console logging.

## R8 — QR too dense
Impact: medium.
Mitigation: short payload fields; realistic print/scan testing; later opaque server IDs only after backend justification.

## R9 — Regulatory perception
Impact: medium.
Mitigation: do not initiate, hold, settle, or claim to verify payments in V0; obtain specialist advice before any future regulated payment integration.
