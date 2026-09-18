

---

<!-- SOURCE: README.md -->

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


---

<!-- SOURCE: AGENTS.md -->

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


---

<!-- SOURCE: TREE.md -->

# Intended Runtime Repository Structure

```text
bankqr/
├── AGENTS.md
├── README.md
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── components.json
├── .gitignore
├── .nvmrc
├── public/
│   ├── brand/
│   │   ├── mark.svg
│   │   ├── wordmark.svg
│   │   └── icon-512.png
│   ├── manifest.webmanifest
│   └── favicon.ico
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── create/
│   │   └── page.tsx
│   ├── pay/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   ├── terms/
│   │   └── page.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/                       # shadcn generated primitives only
│   ├── brand/
│   │   ├── brand-mark.tsx
│   │   └── wordmark.tsx
│   ├── layout/
│   │   ├── app-shell.tsx
│   │   ├── mobile-header.tsx
│   │   └── page-container.tsx
│   ├── merchant/
│   │   ├── merchant-form.tsx
│   │   ├── mode-switcher.tsx
│   │   ├── merchant-preview-card.tsx
│   │   ├── qr-result-card.tsx
│   │   └── local-profile-actions.tsx
│   ├── payment/
│   │   ├── payment-hero.tsx
│   │   ├── payment-details-card.tsx
│   │   ├── copy-field-row.tsx
│   │   ├── amount-entry.tsx
│   │   ├── bank-launch-sheet.tsx
│   │   ├── safety-note.tsx
│   │   └── invalid-payload-state.tsx
│   └── feedback/
│       ├── copy-toast.tsx
│       ├── inline-alert.tsx
│       └── loading-shell.tsx
├── features/
│   └── bankqr/
│       ├── types.ts
│       ├── schema.ts
│       ├── encode.ts
│       ├── decode.ts
│       ├── normalize.ts
│       ├── constants.ts
│       └── fixtures.ts
├── banks/
│   ├── types.ts
│   ├── registry.ts
│   └── launch.ts
├── lib/
│   ├── clipboard.ts
│   ├── currency.ts
│   ├── local-storage.ts
│   ├── device.ts
│   ├── download.ts
│   └── invariant.ts
├── styles/
│   ├── tokens.css
│   └── motion.ts
├── tests/
│   ├── unit/
│   │   ├── encode-decode.test.ts
│   │   ├── schema.test.ts
│   │   ├── currency.test.ts
│   │   └── bank-launch.test.ts
│   └── e2e/
│       ├── merchant-create.spec.ts
│       ├── customer-pay.spec.ts
│       ├── privacy.spec.ts
│       └── accessibility.spec.ts
└── docs/
    └── ...planning files
```

## Architecture boundary
`components/*` render UI. `features/bankqr/*` owns payload/domain logic. `banks/*` owns bank-launch capability data. `lib/*` owns generic browser/util functions. No business logic in route pages beyond composition.


---

<!-- SOURCE: docs/00_PRODUCT_CHARTER.md -->

# 00 — Product Charter

## Product name
BankQR

## V0 promise
Turn merchant-provided bank-transfer details into a scannable, mobile-friendly payment instruction that any customer can open in a browser without installing BankQR.

## Primary actors
### Merchant
Creates either:
1. Static BankQR — merchant details only; customer enters payment amount after scanning.
2. Payment BankQR — merchant details + fixed amount + optional reference.

### Customer
Scans with normal phone camera / Google Lens / QR scanner, sees payment details, copies required fields, opens their own banking app, and completes NEFT/IMPS manually inside that official banking environment.

## Core value proposition
Reduce errors and friction when sharing account number, IFSC, amount, and payment reference. Keep authentication and money movement entirely inside the customer's bank.

## V0 validation questions
- Will merchants display/share BankQR for high-value transfers?
- Can customers understand the page without explanation?
- Can customers complete bank transfer successfully using their existing bank app?
- Is the copy/open-bank workflow meaningfully better than WhatsApp/manual bank details?
- Which banking apps create the most friction?

## Success is behavioral, not vanity
Do not optimize for signups. V0 has none. Optimize for QR generation, scan-to-detail comprehension, copy actions, and observed completion in field tests.


---

<!-- SOURCE: docs/01_SCOPE_AND_NON_GOALS.md -->

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


---

<!-- SOURCE: docs/02_USER_FLOWS.md -->

# 02 — User Flows

## Merchant flow A — Static QR
1. Open `/create`.
2. Default tab = `Static QR`.
3. Enter merchant display name.
4. Enter account-holder name.
5. Enter account number.
6. Confirm account number.
7. Enter IFSC.
8. Optional: choose bank display name from neutral list, or leave blank.
9. Accept confirmation: "I confirm these receiving details are correct."
10. Preview customer-facing card.
11. Generate QR.
12. Show QR result screen with:
   - QR
   - merchant name
   - masked account
   - Download PNG
   - Share
   - Open test page
13. Save merchant profile locally only after explicit `Save on this device` action.

## Merchant flow B — Payment QR
Same as Static QR plus:
- Amount required.
- Reference optional.
- QR label clearly says `Payment QR`.
- Preview shows fixed amount prominently.

## Customer flow — Static QR
1. Scan HTTPS QR in normal scanner.
2. Browser opens `/pay#v1=<payload>`.
3. Client decodes and validates payload.
4. Show merchant-provided identity and masked receiving account.
5. Customer enters amount.
6. Show copy rows:
   - Account number
   - IFSC
   - Amount
   - Reference if provided
7. CTA: `Open banking app`.
8. Bottom sheet lists banks only as launch shortcuts, not as integrations.
9. Customer completes transfer inside bank app.
10. No "payment successful" state exists in V0.

## Customer flow — Payment QR
Same as above, except amount is fixed from merchant payload and rendered read-only.

## Invalid QR flow
If payload is absent, malformed, unsupported version, or invalid:
- Never partially render bank details.
- Show neutral failure state: `This BankQR link is invalid or incomplete.`
- CTA: `Ask the merchant to generate a new QR`.

## Bank app launch failure
- Never loop.
- Never claim app opened.
- Show `Couldn't open this app automatically. Open your banking app manually and use the copied details.`


---

<!-- SOURCE: docs/03_DESIGN_SYSTEM.md -->

# 03 — Design System

## Design intent
Premium banking utility: calm, precise, restrained, trustworthy. The interface must look deliberate even though the product is technically small.

Do NOT visually copy ICICI, SBI, HDFC, Razorpay, PhonePe, or any other brand. Use an original neutral financial design language.

## Theme
V0 is light-first. No dark mode in initial scope. The customer payment surface must prioritize legibility and trust over visual novelty.

## Typography
Primary family: `Inter Variable`.
- Use local/system delivery through Next font tooling; do not load fonts at runtime from third-party font CDNs.
- UI text: 14–16px.
- Merchant name: 20px / 28px, 650 weight.
- Payment amount: 40px / 44px, 700 weight.
- Section heading: 18px / 26px, 650.
- Small label: 12px / 16px, 550, uppercase only when semantically useful.
- Numerical payment/account presentation uses `font-variant-numeric: tabular-nums`.

## Color tokens
Use semantic CSS variables. Never place raw color hex values inside components.

```css
:root {
  --bq-bg: #f6f8fb;
  --bq-surface: #ffffff;
  --bq-surface-subtle: #f0f4f8;
  --bq-ink: #102a43;
  --bq-ink-strong: #071726;
  --bq-muted: #62748a;
  --bq-border: #dfe7ef;
  --bq-primary: #1769e0;
  --bq-primary-hover: #115bc5;
  --bq-primary-soft: #eaf2ff;
  --bq-success: #16794a;
  --bq-success-soft: #e9f7ef;
  --bq-warning: #a15c08;
  --bq-warning-soft: #fff5df;
  --bq-danger: #b42318;
  --bq-danger-soft: #fff0ee;
  --bq-focus: #3b82f6;
}
```

WCAG contrast must be checked before release. Adjust tokens if any normal text fails AA.

## Spacing
Use a 4px base grid.
Allowed spacing tokens:
`4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.

No arbitrary values unless required for device safe areas.

## Radius
- Small controls: 10px
- Inputs: 12px
- Buttons: 14px
- Standard card: 18px
- Hero/payment card: 22px
- Bottom sheet top corners: 24px

## Shadows
Use sparingly.
- Card: `0 8px 28px rgba(16, 42, 67, 0.07)`
- Elevated sheet: `0 -12px 40px rgba(16, 42, 67, 0.12)`
- Focus is handled with rings, never shadows alone.

## Layout
Customer payment page:
- Max content width: 480px.
- Horizontal padding: 16px on small phones, 20px >= 390px.
- Large screens center the mobile payment surface; do not stretch banking content across desktop.

Merchant create page:
- Max width: 720px.
- Form card max width: 640px.

## Buttons
Primary:
- 52px min height mobile.
- full-width on customer page.
- icon + label only if icon adds meaning.
- pressed state scale 0.985.

Secondary:
- neutral surface, 1px border.

Copy buttons:
- compact 40x40 minimum touch target.
- icon switches `Copy` -> `Check` for 1.2s.
- accompanying toast confirms exact field copied.

## Cards
Never nest more than two visual card layers.
Payment detail rows use subtle separators instead of separate cards for every field.

## Motion system
Use Motion for React only when animation communicates state or hierarchy. Use CSS transitions for simple color/opacity hover states.

Motion tokens:
- instant feedback: 120ms
- standard UI: 180ms
- content entrance: 240ms
- bottom sheet: 280ms
- page transition maximum: 320ms

Primary easing:
`cubic-bezier(0.2, 0, 0, 1)`

Motion recipes:
### Page content entrance
- opacity 0 -> 1
- y 8px -> 0
- 240ms

### QR generated
- opacity 0 -> 1
- scale .985 -> 1
- 240ms

### Copy feedback
- button scale 1 -> .97 -> 1
- icon crossfade
- 120–180ms

### Bottom sheet
- y 24px -> 0
- opacity .6 -> 1
- 280ms
- backdrop fade 180ms

### Inline validation
- no shake animations.
- message fades in 120ms.

### Reduced motion
When `prefers-reduced-motion: reduce`, remove transforms and non-essential animation. Preserve only instant opacity/state transitions.

## Premium behavior rules
- No confetti.
- No bouncing QR.
- No excessive gradients.
- No glassmorphism.
- No animated background blobs.
- No fintech-casino styling.
- Haptics cannot be assumed on web; do not depend on them.
- Every motion must have a functional reason.

## Brand mark direction
Abstract scan corners + simple bank/payment geometry. Monochrome first. Must remain legible at 24px. Do not imitate NPCI, UPI, or a bank logo.


---

<!-- SOURCE: docs/04_TECH_ARCHITECTURE.md -->

# 04 — Technical Architecture

## Stack
- Next.js, latest stable at project creation.
- React + TypeScript strict.
- Tailwind CSS v4 path.
- shadcn/ui using the current default Base UI setup unless an accessibility regression is discovered.
- Motion for React (`motion/react`).
- Zod for all form and payload validation.
- React Hook Form for merchant form state.
- QR generation: one lightweight maintained QR package; prefer `qrcode` if it satisfies PNG generation cleanly.
- Lucide React for neutral icons.
- pnpm.

After scaffolding, pin all resolved versions in `pnpm-lock.yaml`. Do not chase new package releases during the build.

## Rendering model
Static-export application.

`next.config.ts` should target static export. No API routes, server actions, server database calls, or dynamic server rendering.

## Client/server boundaries
- Landing/privacy/terms may render statically.
- `/create` is client-heavy because it uses local storage, QR generation, clipboard/share APIs.
- `/pay` must decode the URL fragment on the client. Never attempt to read payment payload server-side.

## No payment data in request URL query
Correct:
`https://bankqr.example/pay#v1=<base64url>`

Incorrect:
`https://bankqr.example/pay?account=...&ifsc=...`

Reason: URL fragments are processed client-side and are not included in the normal HTTP request to the hosting server.

## State
### Merchant form
React Hook Form state.

### Saved merchant profile
Optional local storage only, via a versioned adapter.
Never auto-save bank details without user action.

### Customer payment state
Memory only. Do not persist decoded payment payload in local storage/session storage.

## External calls
V0 payment page makes zero external API calls after page assets have loaded.

## Failure philosophy
Fail closed:
- Invalid payload -> render no bank data.
- Unknown version -> render unsupported state.
- Clipboard unavailable -> present selectable text and clear fallback.
- App launch unknown -> do not invent a URI.


---

<!-- SOURCE: docs/05_QR_PROTOCOL.md -->

# 05 — BankQR V0 Payload Protocol

## Goal
Portable HTTPS QR that any normal scanner can open while avoiding bank details in standard query strings/server request logs.

## URL shape
`https://<host>/pay#v1=<BASE64URL_JSON>`

## Schema
```ts
type BankQrPayloadV1 = {
  v: 1
  mode: "static" | "payment"
  merchantName: string
  accountHolderName: string
  accountNumber: string
  ifsc: string
  bankName?: string
  amountPaise?: number
  reference?: string
  createdAt: string // ISO timestamp
}
```

## Field rules
- `v`: exactly `1`.
- `merchantName`: 2–80 trimmed Unicode characters.
- `accountHolderName`: 2–100 trimmed Unicode characters.
- `accountNumber`: 6–20 digits; do not overfit to one bank's account length.
- `ifsc`: normalize uppercase; regex `^[A-Z]{4}0[A-Z0-9]{6}$`.
- `bankName`: optional 2–80 chars; merchant-provided.
- `amountPaise`: required for `payment`, omitted for `static`; positive safe integer.
- `reference`: optional, max 40 chars, allow letters/numbers/common `-_/` punctuation.
- `createdAt`: ISO 8601.

## Encoding
1. Normalize form data.
2. Validate with Zod.
3. JSON stringify without whitespace.
4. UTF-8 encode.
5. Base64URL encode.
6. Prefix fragment with `v1=`.

## Decoding
1. Read `window.location.hash`.
2. Require `#v1=` prefix.
3. Base64URL decode.
4. UTF-8 decode.
5. JSON parse inside try/catch.
6. Zod validate.
7. Normalize safe display values.
8. Only then render.

## Integrity limitation
V0 payload is NOT cryptographically authenticated. Base64URL is encoding, not encryption. Never label it secure/verified because of encoding.

## QR sizing
Keep payload deliberately small. If QR density becomes visually excessive, shorten optional merchant/reference fields before adding infrastructure.

## Static QR amount behavior
Customer-entered amount exists only in page state and clipboard output. It is not written back into the original QR.


---

<!-- SOURCE: docs/06_SECURITY_PRIVACY.md -->

# 06 — Security and Privacy

## Security boundary
BankQR is a payment-instruction utility only. Customer bank credentials and payment authorization remain entirely inside the official banking app/site.

## Never collect
- UPI PIN
- MPIN
- OTP
- Bank password
- Card PIN
- CVV
- Biometric templates/data
- Customer balance/account login

## Merchant bank information
Merchant voluntarily places receiving details into the generated QR payload. Treat this as sensitive financial contact information even though it is intended to be shared with payers.

## Privacy-by-design rules
- Payment payload in URL fragment, not query string.
- No analytics on `/pay` in V0.
- No third-party scripts on `/pay`.
- No remote fonts on `/pay`.
- Use `Referrer-Policy: no-referrer` where deployment permits.
- Add CSP restricting scripts/styles/connect origins to self where practical for static deployment.
- Do not cache decoded payment data in storage.
- Do not log decoded payload to console in production.
- Do not put full account number in page title, OpenGraph metadata, or share preview.

## Display policy
- Mask account number by default in summary: e.g. `•••• •••• 4821`.
- `Copy account number` copies full value.
- Optional reveal control requires explicit user action.
- Merchant preview before generating QR displays full account number so the merchant can catch errors.

## Trust language
Allowed:
- `Details provided by merchant`
- `Confirm the beneficiary name shown by your bank before authorising payment.`

Forbidden unless actual verification is later implemented:
- `Verified merchant`
- `Bank verified`
- `Secure payment verified`
- `Payment successful`

## QR replacement risk
A malicious person can physically replace a printed QR. V0 cannot cryptographically prove physical merchant identity. The customer must verify the beneficiary returned by their bank before authorising.

## Payment confirmation
V0 provides none. Never ask for screenshots. Never treat a customer-entered UTR as confirmed settlement.


---

<!-- SOURCE: docs/07_COMPONENT_CONTRACTS.md -->

# 07 — Component Contracts

## MerchantForm
Responsibilities:
- Collect normalized merchant/payment fields.
- Validate on blur + submit.
- Keep account/confirm-account separate.
- Never generate QR until confirmation checkbox is checked.

Inputs:
`initialProfile?`

Outputs:
`onValidSubmit(payloadDraft)`

## ModeSwitcher
Two options only:
- Static QR
- Payment QR

Switching from payment -> static must clear amount/reference only after a small confirm if non-empty.

## MerchantPreviewCard
Customer-style preview before generation.
Must include `Details provided by merchant` indicator.

## QrResultCard
Shows QR, type, masked merchant data, Download, Share, Test.
Download filename format:
`bankqr-<sanitized-merchant>-<YYYYMMDD>.png`

## PaymentHero
Inputs:
- merchantName
- mode
- amount if fixed/customer-entered

Displays amount as strongest visual element when known.

## PaymentDetailsCard
Rows:
- Account holder
- Account number
- IFSC
- Amount
- Reference

Each copyable row must have screen-reader label including the field name.

## CopyFieldRow
States:
`idle | copied | failed`

Copied state lasts ~1.2s; no persistent success that could be confused with payment success.

## AmountEntry
Static QR only.
Use numeric decimal keyboard hints.
Store amount internally as integer paise after parsing.

## BankLaunchSheet
Contains only banks present in `banks/registry.ts`.
Bank entry contract:
```ts
type BankLaunchCapability = {
  id: string
  displayName: string
  shortName: string
  launchUri: string | null
  verifiedOn?: string
  notes?: string
}
```

If `launchUri` is null, do not render a fake deep-link button. Render `Open your banking app manually` guidance.

## SafetyNote
Compact information surface near the final bank CTA:
`Confirm the beneficiary name shown by your bank before authorising payment.`


---

<!-- SOURCE: docs/08_VALIDATION_AND_ERRORS.md -->

# 08 — Validation and Error Handling

## Merchant field validation
Merchant name:
- trim
- 2–80 chars

Account holder name:
- trim
- 2–100 chars

Account number:
- remove spaces/hyphens during normalization
- digits only after normalization
- 6–20 digits
- confirmation must match exactly

IFSC:
- trim
- uppercase
- `^[A-Z]{4}0[A-Z0-9]{6}$`

Amount:
- positive
- max 2 decimal places
- parse to integer paise
- do not enforce payment-rail limits because BankQR is not selecting the rail

Reference:
- optional
- trim
- max 40

## Error style
Inline, precise, neutral.
Examples:
- `Enter the account number again.`
- `The account numbers do not match.`
- `Enter a valid 11-character IFSC.`
- `Enter an amount greater than ₹0.`

Avoid:
- red full-page errors for simple form mistakes
- technical stack traces
- generic `Something went wrong` when a specific recovery is possible

## Decode errors
Map internal exceptions to one public state:
`This BankQR link is invalid or incomplete.`

Do not reveal parser internals.


---

<!-- SOURCE: docs/09_TEST_STRATEGY.md -->

# 09 — Test Strategy

## Required scripts
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm build`

## Unit tests
### Protocol
- encode/decode round trip preserves Unicode merchant name.
- static payload omits amount.
- payment payload requires amount.
- invalid version rejected.
- malformed base64 rejected.
- malformed JSON rejected.
- schema-invalid JSON rejected.
- IFSC normalized uppercase.
- account spaces removed.

### Currency
- ₹1 -> 100 paise.
- ₹1.25 -> 125.
- more than two decimals rejected.
- very large unsafe values rejected.

### Local storage
- versioned load.
- corrupt storage safely ignored.
- clear profile works.

### Bank launch
- unknown bank cannot invent URI.
- null launch URI returns safe fallback.

## E2E
### Merchant create
- valid static QR generated.
- confirmation mismatch blocks generation.
- payment mode requires amount.
- local save only happens on explicit action.
- QR download action works.

### Customer pay
- direct navigation with valid fragment renders.
- account masked by default.
- copy account copies full number.
- fixed amount cannot be edited.
- static amount can be entered.
- invalid fragment reveals no partial bank details.

### Privacy
Intercept browser requests during `/pay` and assert raw account number and IFSC never appear in request URLs.

### Accessibility
- keyboard navigation.
- visible focus rings.
- labels associated with inputs.
- copy controls have accessible names.
- bottom sheet focus trapping.
- `prefers-reduced-motion` smoke test.

## Manual device matrix
Before field testing:
- Android Chrome current.
- Android Google Lens QR scan.
- Samsung browser if available.
- iPhone Safari if available, even though merchant is web-first.
- 320px, 360px, 390px, 430px widths.

## Visual QA
No horizontal scroll.
No clipped IFSC/account rows.
No layout shift on copy feedback.
No modal behind keyboard.


---

<!-- SOURCE: docs/10_CODEX_BUILD_PLAN.md -->

# 10 — Codex Build Plan

Codex should implement in strict phases. Do not start the next phase until the current gate passes.

## Phase 0 — Scaffold
- Create Next.js TypeScript app.
- Configure static export.
- Configure Tailwind v4.
- Initialize shadcn with current Base UI default.
- Add Motion, Zod, React Hook Form, QR package, Lucide.
- Create scripts for lint/typecheck/test/e2e/build.

Gate:
- blank app builds and exports.

## Phase 1 — Design foundation
- Add `tokens.css`.
- Create layout shell.
- Create Button/Input/Card customizations.
- Implement typography, focus, spacing, responsive container.
- Implement reduced-motion helper.

Gate:
- visual test page shows every primitive consistently.

## Phase 2 — Protocol/domain
- Implement types/schema/normalize/encode/decode.
- Unit-test thoroughly.

Gate:
- 100% expected protocol cases pass.

## Phase 3 — Merchant creation
- Mode switcher.
- Merchant form.
- Validation.
- Preview.
- Generate QR.
- Download/share/test.
- Optional local profile save.

Gate:
- merchant can generate both QR modes from a fresh browser with zero network API calls.

## Phase 4 — Customer payment page
- Hash decode.
- Invalid state.
- Payment hero.
- Detail rows.
- Copy feedback.
- Static amount entry.
- Safety messaging.

Gate:
- QR opened from another device produces correct customer page.

## Phase 5 — Bank launcher
- Neutral bottom sheet.
- Registry-driven entries.
- No invented URIs.
- Safe fallback text.

Gate:
- launch failures never break payment detail access.

## Phase 6 — Landing/legal
- Minimal landing page with `Create BankQR` primary CTA.
- How it works in three concise steps.
- Privacy/Terms explaining merchant-provided data and no payment processing.

Gate:
- no unsupported claims.

## Phase 7 — QA hardening
- Unit tests.
- Playwright.
- Accessibility checks.
- Mobile visual QA.
- Production console clean.

Final gate:
`pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build`


---

<!-- SOURCE: docs/11_ACCEPTANCE_CRITERIA.md -->

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


---

<!-- SOURCE: docs/12_DEPLOYMENT.md -->

# 12 — Deployment

## Hosting target
Cloudflare Pages or equivalent static host.

## Build
Use Next static export and deploy generated static output.

## V0 domain
A free provider subdomain is acceptable for internal/merchant validation.
Before broader public use, use a short branded HTTPS domain to improve trust.

## Environment variables
V0 should require none.

## Headers
Where static host supports configuration:
- `Referrer-Policy: no-referrer`
- `X-Content-Type-Options: nosniff`
- sensible CSP limited to self and required inline/generated styles if unavoidable
- `Permissions-Policy` denying unrelated sensors/features

Do not break QR download/share behavior with over-restrictive CSP; test production output.

## Release checklist
- clean production build
- scan real QR from second phone
- confirm URL fragment survives common scanners
- confirm raw account not present in network request URLs
- test clipboard permission behavior
- test bank launcher fallbacks
- test legal pages


---

<!-- SOURCE: docs/13_FUTURE_ROADMAP.md -->

# 13 — Future Roadmap (Not V0)

Only proceed after real merchant/customer validation.

## V1.1
- Better validated bank-app launch shortcuts.
- Optional local QR history.
- Print-ready A4/A5 merchant QR templates.
- Multiple merchant profiles on one device.

## V1.5
If persistent editable QR is validated:
- Minimal backend.
- opaque QR IDs instead of embedded payload.
- merchant authentication.
- server-side profile updates.

## V2
If direct bank-payment demand is validated:
- Explore official bank/NBBL/Banking Connect integration.
- Actual merchant onboarding/KYB through regulated partner.
- trusted payment initiation.
- callback-based payment state.

## V3
- invoice/POS integrations.
- reconciliation.
- merchant notifications.
- routing across supported direct-bank rails.

## Never add merely for feature parity
Wallet, cards, consumer social layer, rewards, lending, crypto, or ads unless the core direct-bank-payment thesis has already succeeded.


---

<!-- SOURCE: docs/14_MICROCOPY.md -->

# 14 — Microcopy

## Merchant create
Page title: `Create your BankQR`
Subtitle: `Turn your receiving bank details into a QR customers can scan.`

Mode labels:
- `Static QR`
- `Payment QR`

Static helper: `Customer enters the amount after scanning.`
Payment helper: `Set the amount before generating the QR.`

Confirmation checkbox:
`I confirm these receiving details are correct.`

Primary CTA:
`Generate BankQR`

Result:
`Your BankQR is ready`

Actions:
- `Download QR`
- `Share`
- `Test payment page`

## Customer pay
Header eyebrow: `Bank transfer details`
Merchant intro: `Pay to`

Static amount label: `Amount to pay`

Details heading: `Payment details`
Rows:
- `Account holder`
- `Account number`
- `IFSC`
- `Amount`
- `Reference`

Copy feedback:
- `Account number copied`
- `IFSC copied`
- `Amount copied`
- `Reference copied`

Bank CTA:
`Open banking app`

Safety note:
`Confirm the beneficiary name shown by your bank before authorising payment.`

Merchant disclosure:
`These receiving details were provided by the merchant.`

Invalid link:
`This BankQR link is invalid or incomplete.`
`Ask the merchant to generate a new QR.`

## Forbidden microcopy
Do not use:
- `Verified merchant`
- `Bank verified`
- `100% secure payment`
- `Payment successful`
- `Instant payment`
- `Zero-fee payment`
unless those facts are actually supported by a future integrated product.


---

<!-- SOURCE: docs/15_RISK_REGISTER.md -->

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
