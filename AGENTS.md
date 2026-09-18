
# AGENTS.md — Mandatory Instructions for Codex

## Mission
Build the BankQR V0 exactly as specified in this planning pack. Optimize for correctness, clarity, privacy, mobile usability, and minimal infrastructure.

## Non-negotiable constraints
- Use TypeScript strict mode.
- No `any` unless a third-party type defect makes it unavoidable; document every exception.
- No backend/API routes/server actions in V0.
- No database.
- No login/authentication.
- No payment gateway, UPI SDK, Banking Connect SDK, bank API, scraping, automation, accessibility-service hacks, or credential capture.
- Never request or store UPI PIN, MPIN, OTP, CVV, bank password, card PIN, biometric data, or customer bank credentials.
- Never claim a merchant is verified.
- Never claim a payment is successful based on user input.
- Never imply that BankQR moves money.
- Never invent bank deep links. Only add an app-launch URI after it has been independently validated and documented.
- No bank account data in query parameters. Payment payload is carried in the URL fragment only.
- No third-party analytics, advertising, trackers, pixels, remote fonts, or chat widgets on `/pay`.
- All UI colors, spacing, radius, shadows, and motion values must come from shared tokens.
- Respect `prefers-reduced-motion`.
- Keep all payment-domain logic outside React presentation components.
- Every decoding path must be schema-validated before rendering.
- Build must pass lint, typecheck, unit tests, e2e smoke tests, and production build before completion.

## Preferred implementation discipline
- Prefer small pure functions.
- Prefer immutable data.
- Prefer composition over large components.
- Use semantic HTML first.
- Use client components only where browser APIs are needed.
- Avoid premature abstractions.
- Do not add dependencies without a concrete need.
- Do not create features not listed in scope.

## Definition of done
`pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build` all pass.
