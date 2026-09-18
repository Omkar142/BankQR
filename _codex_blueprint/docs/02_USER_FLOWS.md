
# 02 — User Flows

## Merchant flow A — Static QR
1. Open `/create`.
2. Default tab = `Static QR`.
3. Enter merchant display name.
4. Enter account-holder name.
5. Enter account number.
6. Confirm account number.
7. Enter IFSC.
8. Optional: choose bank display name from neutral list, or leave blank.
9. Accept confirmation: "I confirm these receiving details are correct."
10. Preview customer-facing card.
11. Generate QR.
12. Show QR result screen with:
   - QR
   - merchant name
   - masked account
   - Download PNG
   - Share
   - Open test page
13. Save merchant profile locally only after explicit `Save on this device` action.

## Merchant flow B — Payment QR
Same as Static QR plus:
- Amount required.
- Reference optional.
- QR label clearly says `Payment QR`.
- Preview shows fixed amount prominently.

## Customer flow — Static QR
1. Scan HTTPS QR in normal scanner.
2. Browser opens `/pay#v1=<payload>`.
3. Client decodes and validates payload.
4. Show merchant-provided identity and masked receiving account.
5. Customer enters amount.
6. Show copy rows:
   - Account number
   - IFSC
   - Amount
   - Reference if provided
7. CTA: `Open banking app`.
8. Bottom sheet lists banks only as launch shortcuts, not as integrations.
9. Customer completes transfer inside bank app.
10. No "payment successful" state exists in V0.

## Customer flow — Payment QR
Same as above, except amount is fixed from merchant payload and rendered read-only.

## Invalid QR flow
If payload is absent, malformed, unsupported version, or invalid:
- Never partially render bank details.
- Show neutral failure state: `This BankQR link is invalid or incomplete.`
- CTA: `Ask the merchant to generate a new QR`.

## Bank app launch failure
- Never loop.
- Never claim app opened.
- Show `Couldn't open this app automatically. Open your banking app manually and use the copied details.`
