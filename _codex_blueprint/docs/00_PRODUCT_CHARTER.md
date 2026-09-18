
# 00 — Product Charter

## Product name
BankQR

## V0 promise
Turn merchant-provided bank-transfer details into a scannable, mobile-friendly payment instruction that any customer can open in a browser without installing BankQR.

## Primary actors
### Merchant
Creates either:
1. Static BankQR — merchant details only; customer enters payment amount after scanning.
2. Payment BankQR — merchant details + fixed amount + optional reference.

### Customer
Scans with normal phone camera / Google Lens / QR scanner, sees payment details, copies required fields, opens their own banking app, and completes NEFT/IMPS manually inside that official banking environment.

## Core value proposition
Reduce errors and friction when sharing account number, IFSC, amount, and payment reference. Keep authentication and money movement entirely inside the customer's bank.

## V0 validation questions
- Will merchants display/share BankQR for high-value transfers?
- Can customers understand the page without explanation?
- Can customers complete bank transfer successfully using their existing bank app?
- Is the copy/open-bank workflow meaningfully better than WhatsApp/manual bank details?
- Which banking apps create the most friction?

## Success is behavioral, not vanity
Do not optimize for signups. V0 has none. Optimize for QR generation, scan-to-detail comprehension, copy actions, and observed completion in field tests.
