
# BankQR — Codex Build Blueprint

This repository is a planning pack for a zero-backend, web-first BankQR validation MVP.

## Product in one sentence
A merchant generates a QR containing a normal HTTPS payment link; any customer scans it with a normal camera/QR scanner, sees merchant-provided bank-transfer details in a premium mobile payment page, copies the required values, and completes NEFT/IMPS inside their own official banking app.

## Hard reality
BankQR V0 does NOT initiate, authorize, verify, clear, settle, or confirm bank payments. It does NOT claim bank integration. It does NOT claim merchant verification. It never asks for customer banking credentials.

## Read order for Codex
1. `AGENTS.md`
2. `docs/00_PRODUCT_CHARTER.md`
3. `docs/01_SCOPE_AND_NON_GOALS.md`
4. `docs/02_USER_FLOWS.md`
5. `docs/03_DESIGN_SYSTEM.md`
6. `docs/04_TECH_ARCHITECTURE.md`
7. `docs/05_QR_PROTOCOL.md`
8. `docs/06_SECURITY_PRIVACY.md`
9. `docs/07_COMPONENT_CONTRACTS.md`
10. `docs/08_VALIDATION_AND_ERRORS.md`
11. `docs/09_TEST_STRATEGY.md`
12. `docs/10_CODEX_BUILD_PLAN.md`
13. `docs/11_ACCEPTANCE_CRITERIA.md`
14. `docs/12_DEPLOYMENT.md`
15. `docs/13_FUTURE_ROADMAP.md`
16. `docs/14_MICROCOPY.md`
17. `docs/15_RISK_REGISTER.md`

## Build principle
Do not over-engineer. V0 is a static-export Next.js app with no backend, no database, no authentication, no payment SDK, no merchant KYC, and no third-party analytics on the payment page.

## Product quality bar
The app must feel like a premium banking utility: calm, trustworthy, fast, mobile-first, accessible, and visually consistent. UX quality is part of the functional acceptance criteria, not a later polish phase.
