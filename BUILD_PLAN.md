# BankQR V0 implementation

Authority: user-approved master blueprint, preserved in `_codex_blueprint/` and working `docs/`.

1. Scaffold a strict TypeScript Next static export; verify blank production build.
2. Implement blueprint tokens and accessible primitives; verify primitive surface.
3. Test then implement bounded fragment protocol, exact paise parsing, versioned opt-in profile storage and bank capability fallback.
4. Implement merchant validation, preview, QR PNG/download/share/test and explicit save/delete.
5. Implement payer hash lifecycle, masked copy rows, amount and failure states.
6. Add accessible bank guidance, landing and legal pages.
7. Verify exported output with unit coverage, Playwright, QR image decoding, privacy requests/storage, accessibility and mobile screenshots. Record physical-device gates honestly.

Security additions: strict unknown-key rejection, bounded UTF-8 payload, no control characters, exact safe integers, stale QR invalidation, hash-change fail-closed rendering, HTTPS generation except explicit loopback development, no app URI without verified capability. A public HTTPS deployment and physical phone scan require a hosting destination/device outside local implementation.

Cross-check: Claude authentication failed (HTTP 401 invalid API key); separate adversarial self-review completed before domain/UI implementation. Implementation and local verification complete. Independent visual verdict: ship. See `docs/testing/BUILD_EVIDENCE.md` for actual sequencing, results and external field-validation limits.
