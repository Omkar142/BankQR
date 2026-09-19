---
name: BankQR
description: Calm, legible bank-transfer instructions
colors:
  primary: "#1769e0"
  primary-hover: "#115bc5"
  primary-soft: "#eaf2ff"
  background: "#f6f8fb"
  surface: "#ffffff"
  surface-subtle: "#f0f4f8"
  ink: "#102a43"
  ink-strong: "#071726"
  muted: "#52677e"
  border: "#dfe7ef"
  input-border: "#788b9e"
  warning: "#925308"
  warning-soft: "#fff5df"
  danger: "#b42318"
  success: "#16794a"
typography:
  display:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "clamp(40px, 5vw, 64px)"
    fontWeight: 650
    lineHeight: 1.06
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 650
    lineHeight: 1.25
  amount:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "16px"
    lineHeight: 1.6
  caption:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "14px"
rounded:
  small: "10px"
  input: "12px"
  button: "14px"
  card: "18px"
  hero: "22px"
  sheet: "24px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "20px"
  s6: "24px"
  s8: "32px"
  s10: "40px"
  s12: "48px"
  s16: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.button}"
    height: "52px"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    height: "52px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    height: "52px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "20px"
---

# Design System: BankQR

## Overview

**Creative North Star: "A clear receiving slip"**

The supplied blueprint defines a light, restrained financial utility. The implemented system uses local Inter, blue actions and readable receiving details. Task clarity leads; it does not imitate a bank or imply account verification.

The source of truth is `styles/tokens.css` and its use in `styles/app.css`. The darker muted and warning colors and distinct input border improve contrast while preserving the approved palette.

## Colors

Primary blue identifies actions and neutral line icons. Cool white and pale blue-gray establish surfaces. Ink colors carry information; muted text carries explanations. Pale rules separate rows. The darker input-boundary color is reserved for editable controls. Amber communicates the beneficiary-check guidance; green is limited to transient copy feedback.

**The Receiving Details Rule.** Neither accent color nor a bank name means the receiving account was verified.

## Typography

Inter Variable is bundled locally. Headings use restrained negative tracking; body text favors readable line height. The payment amount has the strongest hierarchy on the payer page. Account numbers and monetary values use tabular numerals and wrap safely.

## Layout

The shared site shell is capped at 1120px. Merchant content is capped at 720px with a 640px form. Payer content is capped at 480px. The landing page moves from a two-column explanation and illustrative payment surface to a single column below 760px. Form grids collapse below 480px. Payer gutters decrease to 16px below 390px. Spacing follows the supplied 4px-based scale.

## Elevation & Depth

Most surfaces use a single border. The illustrative landing card uses the restrained card shadow; bottom sheets use an elevated shadow and dimmed backdrop. Tonal contrast separates the form preview from its containing form.

## Shapes

Rounded corners follow the supplied control, card, hero and sheet roles. Scan-corner brand geometry remains crisp and monochrome-capable. Detail rows use separators rather than separate cards.

## Components

Primary buttons are at least 52px tall; icon copy/reveal controls are 44px. Inputs have labels, explicit errors and a higher-contrast boundary. Keyboard focus uses a visible blue outline. Merchant modes are a labeled radio group. Confirmation is explicit.

Payment rows expose a visible field-specific Copy label, a matching accessible name and a plain-language paste destination. Prominent rows stack values and controls so narrow screens do not squeeze account numbers. Copy state lasts 1.2 seconds and never implies payment completion. A pale-blue numbered guide explains switching to a bank app and copying one field at a time before the receiving details. Additional bank help uses Base UI's modal dialog and returns focus on dismissal. The optional UPI section follows a clear divider and includes expandable app-opening help. Motion is limited to QR-result appearance and short control transitions; reduced-motion settings remove transforms and animation.

## Do's and Don'ts

- Do use semantic tokens for new surfaces and controls.
- Do preserve large touch targets, visible focus, wrapping and field labels.
- Do keep merchant-provided disclosures and beneficiary guidance legible.
- Don't add remote fonts, decorative motion, bank-logo imitation or verification badges.
- Don't use low-contrast separator borders as the only boundary of an editable field.

This records the shipped design. Generic preset colors in generated shadcn scaffolding are not the BankQR visual authority.
