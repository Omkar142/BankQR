# Payer method-choice redesign: TDD evidence

Source: customer request to reduce payer-page bulk, improve readability, and make optional UPI easy to find while keeping bank transfer primary.

## Journey and acceptance

A customer scanning a V2 QR can see Bank transfer and UPI together beside the amount, understand the bank-app copy/paste path, switch to UPI without losing the payment context, and switch back. A V1 QR remains bank-only. Neither route claims BankQR can verify a recipient or complete a transfer.

| Guarantee | Evidence | Result |
| --- | --- | --- |
| V2 starts on bank transfer with both method choices visible | `tests/e2e/flows.spec.ts: payer can find and switch between bank transfer and UPI` | RED: no method-choice group (5-second locator failure); GREEN: passes on desktop and mobile |
| Selecting UPI reveals the direct app link and hides bank details; returning restores bank details | Same E2E test; merchant UPI-intent test | Pass |
| UPI URI, Android retry, manual ID copy, bank clipboard masking, and sheet focus remain intact | Existing payment E2E tests | Pass |
| No horizontal overflow or browser errors at 1440, 390, and 320 px | `node tooling/visual-qa.mjs` | Pass |

RED checkpoint: `4c91b14 test: reproduce hidden UPI choice on payer page`. GREEN checkpoint: `b985fd3 feat: make payment methods clear and reduce payer page density`. The compact-control refinement followed after screenshot inspection.

Validation: `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test:e2e` (32/32), `pnpm test:coverage` (111 tests; 97.69% statements, 94.64% branches, 100% functions, 97.47% lines), `node tooling/visual-qa.mjs`, `node .../detect.mjs --json --scope layout components/payment/payment-page.tsx styles/app.css` (no findings), and `pnpm audit --audit-level high` (no known vulnerabilities).

Limits: Browser automation validates the UPI URL and fallback, not a physical Android UPI-app launch or an actual transfer. Account-and-IFSC data cannot launch or prefill an arbitrary bank app. Claude cross-check timed out twice; a single-vendor review checked method visibility, beneficiary warning, merchant disclosure, clipboard privacy, and no false app-launch claims.
