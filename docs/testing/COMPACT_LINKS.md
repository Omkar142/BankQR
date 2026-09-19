# Compact payment links

New QR codes and shared links use `#c1=` followed by canonical base64url of a UTF-8 JSON tuple. Existing `#v1=` and `#v2=` object links still decode. The transport version is independent of the payment schema version.

| Slot | Value |
| --- | --- |
| 0 | Payment schema version: 1 or 2 |
| 1 | Merchant name |
| 2 | Account-holder name |
| 3 | Account number as a string, retaining leading zeros |
| 4 | IFSC |
| 5 | Original ISO creation timestamp, retaining its offset |
| 6 | Integer amount in paise, or null for a static QR |
| 7 | Bank name, or null |
| 8 | Reference, or null |
| 9 | UPI ID, present only for schema version 2 |

Version 1 requires exactly nine slots; version 2 requires exactly ten. The decoder expands these slots into a fixed object, then applies the existing strict payment schema. It rejects unknown versions, wrong tuple lengths, invalid UTF-8, noncanonical base64url, oversized input and invalid receiving details. The existing 4,096-character fragment and 3,000-byte decoded limits are unchanged. No decompression or external lookup is introduced.

For the Kiran Stores static fixture on GitHub Pages, the URL decreases from 277 to 177 characters (36% shorter). Savings vary with the receiving details. A separate Copy link button complements native sharing and retains a selectable-text fallback when clipboard access is unavailable.

Security properties remain unchanged: receiving details stay in the URL fragment; anyone holding the link can read them. Encoding is not encryption or authentication. Compact links do not claim merchant verification or payment confirmation. An opaque, very short lookup URL would require a separate storage and retention design.

## Verification

RED: five compact-format/length checks failed against the original encoder. GREEN: all 111 unit tests passed, including four payment variants, old links, Unicode, leading zeros, exact timestamps, safe-integer amounts and malformed tuples. Unit coverage is 97.69% statements, 94.64% branches, 100% functions and 97.47% lines.

The browser suite exercises real PNG decoding, copied links, bank instructions and optional UPI from newly generated compact links. Legacy links remain in the direct payer fixtures.

## Release order

Publish the updated decoder and generator together. Do not distribute new compact links while a host is still serving the previous decoder. The public Pages smoke check explicitly requires the compact link and visible bank instructions before a release is reported live.
