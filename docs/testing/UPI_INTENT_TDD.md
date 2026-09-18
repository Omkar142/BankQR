# UPI intent TDD evidence

## Source and journeys

Journeys were derived from the user request during this TDD run.

- As a merchant, I can add an optional UPI ID without removing the account/IFSC fallback.
- As a payer, I can send an exact amount to a compatible UPI app and still access manual bank-transfer instructions.
- As either party, I am never shown a false payment-success state.

## RED evidence

Command: `pnpm exec vitest run tests/unit/domain.test.ts tests/unit/upi.test.ts`

The run failed as intended: the UPI module did not exist, V2 was rejected by the V1 schema, and malformed UPI IDs were ignored by the merchant form. Result: 2 failed files, 2 failed tests, 65 passed.

Checkpoint: `22697cc test: add failing UPI intent coverage`.

## GREEN evidence

The same focused command passed after implementation: 2 files and 73 tests passed. The full unit suite then passed 87 tests. The final browser suite contains 26 desktop/mobile Chromium checks, including the static-amount gate.

| Guarantee | Evidence | Type | Result |
|---|---|---|---|
| Existing V1 links remain valid while strict V2 requires a bounded UPI ID | `tests/unit/domain.test.ts` | Unit | PASS |
| Fragment version must match the embedded payload version | `tests/unit/domain.test.ts` | Unit | PASS |
| Unsafe or malformed UPI IDs fail closed | `tests/unit/domain.test.ts` | Unit | PASS |
| UPI URI contains exact VPA, payee name, INR amount and optional note | `tests/unit/upi.test.ts` | Unit | PASS |
| Account number and IFSC never enter the UPI URI | `tests/unit/upi.test.ts`, `tests/e2e/flows.spec.ts` | Unit/E2E | PASS |
| Payer receives a UPI action and an honest manual-transfer fallback | `tests/e2e/flows.spec.ts` | E2E | PASS |
| Static UPI remains disabled until the customer enters a valid positive amount | `tests/e2e/flows.spec.ts` | E2E | PASS |
| Payment UI remains accessible at desktop and mobile sizes | full Playwright suite and visual captures | E2E/visual | PASS |

## Known gaps

Browser automation can validate the URI but cannot emulate an installed mobile UPI handler. A physical Android phone must confirm the operating-system chooser and at least one real PSP app. iOS behavior depends on the installed app and its registered schemes. BankQR has no backend and therefore cannot verify or confirm payment status.

The exported `/BankQR` build was published to GitHub Pages. The public merchant-to-payer run generated a V2 link, entered a customer amount and verified the resulting `upi://pay` URI without resource or console errors.
