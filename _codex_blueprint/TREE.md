
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
