
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
