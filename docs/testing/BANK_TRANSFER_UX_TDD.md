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
