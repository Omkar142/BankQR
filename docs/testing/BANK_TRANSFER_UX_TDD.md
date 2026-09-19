# Bank-transfer-first payer UX evidence

Customer direction: account-and-IFSC transfer via the customer's own bank app is BankQR's primary route. Optional UPI remains secondary.

## RED

The new browser check for a prominent bank-transfer heading, visible Copy controls and a beneficiary-guidance sheet failed against the old UI on desktop and mobile. Checkpoint: `0f7f1a7 test: reproduce bank detail readability gap`.

## GREEN

- Account number, IFSC and account-holder name are shown first with larger values and visible Copy controls. The account number is masked until revealed, while Copy still copies the full value.
- The primary bank-transfer action opens numbered IMPS/NEFT guidance; the former list of banks, which did not launch apps, is gone.
- Optional UPI appears after bank guidance with a secondary action. Existing UPI-intent behavior remains unchanged.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:coverage` and `pnpm test:e2e` passed. Coverage: 87 unit tests, 97.43% statements, 92.85% branches, 100% functions, 97.22% lines. E2E: 28 desktop/mobile checks passed.
- `node tooling/visual-qa.mjs` passed at 1440px, 390px and 320px with no horizontal overflow or browser errors. `pnpm audit --audit-level high` reported no known vulnerabilities.

## Limit

No generic account-and-IFSC app chooser or prefill is claimed. A bank app must expose a validated integration before BankQR can launch or fill its transfer flow. Browser tests cannot prove completion of a real bank transfer; customers must review the beneficiary in their bank app, and BankQR does not confirm payment.

## Visible customer guidance and Android recovery

The next revision makes the bank-transfer instructions visible without opening help. It uses numbered steps, field-specific Copy buttons and paste destinations, and explicitly explains that only the last copied detail stays on the clipboard. Values and controls stack on narrow screens. UPI details now live in a separate optional section.

The customer reported Android Chrome. The original `upi://pay` link remains a direct user-tapped anchor. Expandable help adds an Android `intent://pay?...#Intent;scheme=upi;end` retry, generated from the same validated input. It deliberately has no app package restriction and no automatic redirect. This uses [Chrome's documented Intent URI format](https://developer.chrome.com/docs/android/intents). If launch still fails, the screen explains how to copy the UPI ID into an app manually. A chooser or successful launch is not guaranteed or detected.

Verification: 89 unit tests and 30 desktop/mobile E2E checks passed, including exact Android URI generation, intent-extra injection resistance, full-value clipboard behavior, always-visible guidance, UPI recovery and accessibility at 320px. Production build, lint, typecheck and dependency audit passed. The screenshot batch had no horizontal overflow or console errors at 320px, 390px and 1440px. Physical Android app launch remains a device-test requirement.

Review: Claude returned no output in two bounded review attempts, so a separate single-vendor adversarial review covered clipboard semantics, unsafe intent input, launch claims, privacy and the manual bank-transfer boundary. No blocking issue remained. The UI detector only flagged two pre-existing typography advisories outside the payer changes.
