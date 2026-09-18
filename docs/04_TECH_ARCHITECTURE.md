
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
