# Build evidence

Source: `BANKQR_MASTER_BLUEPRINT.md`, especially documents 05–11.

## Test history

- Initial domain tests ran RED with missing `encode` and `local-storage` modules (new interfaces did not exist; no tests executed). This is missing-implementation/import evidence, not a runtime behavioral RED.
- Implemented domain and adapters: 57 tests GREEN.
- Added draft/currency boundary tests: 67 tests GREEN, 97% statements, 94.02% branches, 100% functions, 96.77% lines across domain, currency, clipboard, storage and bank adapters. UI behavior is exercised by Playwright, not included in this unit coverage denominator.
- Merchant browser test first failed on the blank export because the creation form did not exist; later passed with PNG generation and real QR decoding.
- Skip-navigation regression reproduced: keyboard activation changed the QR fragment to `#main`. Fixed by focusing the main element without fragment navigation. Same test passed on desktop and mobile.
- Browser checks caught radio accessible-name mismatch, asynchronous modal focus sentinel timing, and Next static RSC-prefetch 404s. Named radio controls, retrying focus containment assertions and ordinary document links address those causes without weakening functional assertions.

## Requirements and verification

| Requirement | Verification |
|---|---|
| Strict protocol, Unicode, amount bounds, normalization, fail closed | `tests/unit/domain.test.ts` |
| Separate static/payment drafts, consent and duplicate account | `tests/unit/draft.test.ts`, merchant browser flows |
| Explicit versioned profile save/load/clear, corrupt or blocked storage | `tests/unit/browser-adapters.test.ts`, hardening browser flows |
| QR PNG download actually decodes | `tests/e2e/flows.spec.ts`, jsQR over downloaded PNG |
| Masked account, full-value copy, selectable fallback | `tests/e2e/flows.spec.ts` |
| Fixed/static amounts, valid and invalid fragment changes | both browser suites |
| No raw account/IFSC in requests; no payer storage | `tests/e2e/flows.spec.ts` |
| Keyboard, modal containment, axe, reduced motion, 320px | `tests/e2e/flows.spec.ts` |
| Payment generation, share fallback, profile reload | `tests/e2e/hardening.spec.ts` |
| Production console/CSP errors | `tests/e2e/hardening.spec.ts` |
| Visual appearance and overflow | `tooling/visual-qa.mjs`, `artifacts/screenshots/` |

## Scope and honest limits

A public GitHub Pages validation deployment has occurred, but no real phone test has. Chrome mobile emulation is not Android, Samsung browser or iPhone Safari validation. The <=90-second merchant workflow criterion needs human observation. Native sharing and physical printed-QR readability need device testing. No bank integrations are claimed.

The phase plan was used as implementation order, but domain work and UI test preparation overlapped scaffold verification; individual phase gates were not all isolated commits. This empty workspace was not initialized as a Git repository. No checkpoint commits claimed. The primitive foundation is validated within actual screens rather than an added public test route.

Claude cross-check failed authentication (401 invalid API key); plan self-review fallback used. An independent Impeccable visual reviewer runs separately; final verdict recorded below when complete.

## Final gate

Final local results on Node 22.14.0 / pnpm 9.15.4:

| Gate | Result |
|---|---|
| `pnpm lint` | PASS, no findings |
| `pnpm typecheck` | PASS, strict production and test types included |
| `pnpm test:coverage` | PASS before deployment work, 67 tests; statements 97%, branches 94.02%, functions 100%, lines 96.77% |
| `pnpm test:e2e` | PASS, 22 tests in 18.4 seconds, desktop and mobile Chromium |
| `pnpm build` | PASS, all six page types statically exported, hosting headers generated |
| `pnpm audit` | PASS, no known vulnerabilities |
| Visual capture | No horizontal overflow or console errors at 320, 390, 1440px |
| Impeccable detector | No findings (`[]`) |
| Independent visual review | Final disposition: `ship` |

GitHub Pages deployment added afterward with a test-first base-path contract. The first focused run failed 5 new assertions because QR links ignored `/BankQR` and invalid base paths were accepted. After implementation, the focused suite passed 58 tests. A Pages-mode build and real browser flow then passed at `/BankQR` without resource errors: landing to creation, QR generation, and customer page navigation. The full unit suite now contains 72 tests.

The exported build was published to the repository's `gh-pages` branch at `https://omkar142.github.io/BankQR/`. The same merchant-to-customer browser journey passed against that public URL after the QA harness was hardened to wait for client hydration on a network host.

Review verdict: input boundaries resolved with shared `#788b9e` control border; modal capture resolved. `bank-small-viewport.png` confirms full backdrop coverage and no visible background skip link. Runtime bounds place the hidden skip link above the viewport and focus within the modal. Earlier full-page capture stitched fixed elements at an incorrect scroll position. No material findings remain.

The documenter subagent hit its usage limit. Primary agent completed `DESIGN.md` and `.impeccable/design.json`; visual review itself completed independently.

## Self-evaluation

| Axis | Score | Evidence / improvement |
|---|---|---|
| Accuracy | 5 | Actual gate results recorded; physical-device and cross-vendor limits explicit. |
| Completeness | 4 | Local V0 complete; physical scans, real banking-app workflow and merchant timing still need field validation. |
| Clarity | 4 | README provides run/deploy path; original planning pack and implementation evidence require separate navigation. |
| Actionability | 5 | Runnable preview and `out/` static deployment artifact supplied. |
| Conciseness | 4 | Detailed evidence is retained in docs so the final user handoff can stay short. |

Overall: 4.4/5. Highest-impact next checks: deploy to the selected HTTPS host, scan from a second phone, observe merchant completion time. Would the user agree? The implementation is ready to try locally; production field readiness remains explicitly unclaimed.
