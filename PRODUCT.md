# Product
<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
User-approved blueprint: Next.js static export, strict TypeScript, React, Tailwind v4, Base UI shadcn, Motion, Zod, React Hook Form, qrcode, Lucide, pnpm.

## Users
Merchants sharing receiving bank details and an optional UPI ID; customers scanning with normal cameras and primarily completing NEFT/IMPS or another available account-and-IFSC transfer inside their bank app. UPI is a secondary option.

## Product Purpose
Reduce bank-transfer transcription errors by generating portable payment-instruction QR links with readable account-and-IFSC details and one-tap copying.

## Capabilities and Constraints
Static and fixed-amount QR; bank-details-first payer view; optional, secondary UPI intent; optional merchant profile saved only by explicit action. No backend, login, merchant verification, payment processing or payment confirmation. No generic bank-app chooser or account-and-IFSC prefill is claimed. Customer payload stays in memory and the URL fragment. No analytics, remote fonts or third-party requests on the payer page.

## Brand Commitments
Blueprint section 03 is the approved visual authority: light, calm, precise financial utility, local Inter, blue accent, restrained motion and semantic tokens.

## Accessibility & Inclusion
Keyboard-accessible controls, 44px minimum targets, trapped modal focus, reduced motion, 320px mobile layout, AA text contrast.

## Evidence on Hand
Master blueprint and 19 extracted planning files. No verified bank-app launch URIs or merchant verification evidence supplied. Examples must be labeled illustrative.
