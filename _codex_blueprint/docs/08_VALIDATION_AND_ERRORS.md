
# 08 — Validation and Error Handling

## Merchant field validation
Merchant name:
- trim
- 2–80 chars

Account holder name:
- trim
- 2–100 chars

Account number:
- remove spaces/hyphens during normalization
- digits only after normalization
- 6–20 digits
- confirmation must match exactly

IFSC:
- trim
- uppercase
- `^[A-Z]{4}0[A-Z0-9]{6}$`

Amount:
- positive
- max 2 decimal places
- parse to integer paise
- do not enforce payment-rail limits because BankQR is not selecting the rail

Reference:
- optional
- trim
- max 40

## Error style
Inline, precise, neutral.
Examples:
- `Enter the account number again.`
- `The account numbers do not match.`
- `Enter a valid 11-character IFSC.`
- `Enter an amount greater than ₹0.`

Avoid:
- red full-page errors for simple form mistakes
- technical stack traces
- generic `Something went wrong` when a specific recovery is possible

## Decode errors
Map internal exceptions to one public state:
`This BankQR link is invalid or incomplete.`

Do not reveal parser internals.
