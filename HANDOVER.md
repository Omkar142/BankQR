# BankQR build handoff

Project: `C:\Users\omkar\Bankqr`.

The user authorized copying the planning pack into this project and fully implementing V0. Original master and `_codex_blueprint/` preserved; working specs in `docs/`.

Implemented all V0 routes, domain logic and browser flows. Final local verification passed: lint, strict typecheck, 67 unit tests, 22 desktop/mobile Chromium browser tests, static production export and dependency audit. Unit-domain coverage: 97% statements, 94.02% branches, 100% functions, 96.77% lines. Use `README.md` for run/build commands. Production export is `out/`. Local preview: http://127.0.0.1:4173.

Important decisions: exact integer paise; strict bounded fragment decode; ordinary document links avoid static RSC prefetch; opt-in merchant-only storage; no verified bank app URI available so all use manual guidance; generated CSP hashes in hosting headers. No backend, analytics, payment confirmation or credentials.

Cross-vendor review could not run: Claude returned HTTP 401 invalid API key. Separate adversarial self-review performed. Independent visual review requested higher-contrast input boundaries and verification of modal focus at 320px; both resolved, final disposition `ship`. The modal screenshot anomaly was full-page stitching; viewport capture and focus tests confirm correct behavior. The documentation subagent hit a usage limit, so the primary agent wrote DESIGN.md and its sidecar.

Source is published at `https://github.com/Omkar142/BankQR`. A GitHub Pages workflow and `/BankQR` deployment path are implemented and browser-verified locally. GitHub Pages may still need its repository source enabled once under Settings > Pages before the workflow can deploy. Physical phone scans, banking-app compatibility and merchant timing remain field-validation gates.
