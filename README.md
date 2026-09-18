# BankQR

Mobile-first bank-transfer instructions via QR. Built from [the supplied blueprint](BANKQR_MASTER_BLUEPRINT.md); the complete original planning pack is preserved under `_codex_blueprint/`, with working specifications in `docs/`.

## Run locally

Requires Node 22.14+ and pnpm 9.15.4.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

For the actual static production output:

```sh
pnpm build
pnpm preview
```

Open http://127.0.0.1:4173. A localhost QR works only on the same computer. Generate shareable QRs from the final HTTPS site.

## Checks

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm exec playwright install chromium
pnpm build
pnpm test:e2e
```

Browser tests use the static `out/` output, so rebuild after code changes. They run desktop and mobile Chromium, test PNG QR decoding, keyboard and accessibility behavior, and assert fragment privacy and storage boundaries.

## Deploy

The repository includes `.github/workflows/pages.yml`, which verifies and deploys `main` to GitHub Pages with the `/BankQR` base path. In GitHub, open **Settings → Pages**, select **GitHub Actions** as the source once, then run or re-run **Deploy BankQR to GitHub Pages**. The expected URL is `https://omkar142.github.io/BankQR/`.

For another static HTTPS host, build with `pnpm build` and upload `out/`. No API routes, database or server process are required. The build generates `out/_headers` with CSP script hashes and other headers. On a host that does not understand `_headers`, configure equivalent response headers. Root hosting needs no environment variable; subpath hosting must set `NEXT_PUBLIC_BASE_PATH` to that path while building.

GitHub Pages ignores `_headers`, so the build also injects a CSP meta fallback. Response-only protections such as `frame-ancestors` still require a host that supports custom headers. The GitHub Pages deployment is appropriate for phone validation; use a header-capable host before broader production use.

Before merchant field testing, validate a QR scan from a second physical phone, scanner fragment preservation, native share/clipboard behavior and the relevant banking-app workflow. These device and deployment checks cannot be substituted by browser emulation.

## What it does

- Static or fixed-amount QR with optional reference, strict input validation and explicit receiving-details preview.
- PNG download, native link sharing with clipboard fallback, and test-page link.
- Optional versioned merchant-profile save/load/delete on the current device.
- Client-side fragment decoding, masked account with reveal, exact-value copy and selectable fallback.
- Manual bank-app guidance, privacy and terms pages.

BankQR does not initiate, verify or confirm transfers. Receiving details are merchant-provided and QR payloads are encoded, not encrypted or authenticated. All bank launch URIs are deliberately null until independently validated.

## Structure

`app/` composes routes. `components/` owns UI; `features/bankqr/` owns validation and the protocol; `lib/` contains browser adapters and exact currency parsing; `banks/` defines capabilities; `styles/` owns design tokens. `tooling/` builds hosting headers and serves the local export. No analytics or runtime remote fonts.

See [verification evidence](docs/testing/BUILD_EVIDENCE.md), [build plan](BUILD_PLAN.md), and [handoff](HANDOVER.md).
