
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
