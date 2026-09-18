
# 12 — Deployment

## Hosting target
Cloudflare Pages or equivalent static host.

## Build
Use Next static export and deploy generated static output.

## V0 domain
A free provider subdomain is acceptable for internal/merchant validation.
Before broader public use, use a short branded HTTPS domain to improve trust.

## Environment variables
V0 should require none.

## Headers
Where static host supports configuration:
- `Referrer-Policy: no-referrer`
- `X-Content-Type-Options: nosniff`
- sensible CSP limited to self and required inline/generated styles if unavoidable
- `Permissions-Policy` denying unrelated sensors/features

Do not break QR download/share behavior with over-restrictive CSP; test production output.

## Release checklist
- clean production build
- scan real QR from second phone
- confirm URL fragment survives common scanners
- confirm raw account not present in network request URLs
- test clipboard permission behavior
- test bank launcher fallbacks
- test legal pages
