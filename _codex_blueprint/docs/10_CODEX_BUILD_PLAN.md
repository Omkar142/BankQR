
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
