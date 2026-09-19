"use client";
import { useState, useSyncExternalStore } from "react";
import { AlertCircle, ArrowLeft, Landmark, Smartphone } from "lucide-react";
import Link from "@/components/layout/static-link";
import { decode } from "@/features/bankqr/decode";
import { INVALID_LINK } from "@/features/bankqr/constants";
import type { BankQrPayload } from "@/features/bankqr/types";
import { buildAndroidUpiIntent, buildUpiIntent } from "@/features/bankqr/upi";
import { parseAmount, amountText, formatCurrency } from "@/lib/currency";
import { CopyFieldRow } from "./copy-field-row";
import { SafetyNote } from "./safety-note";
import { BankLaunchSheet } from "./bank-launch-sheet";
const subscribe = (listener: () => void) => {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
};
const snapshot = () => window.location.hash;
const serverSnapshot = () => null;
function ValidPayment({ payload }: { payload: BankQrPayload }) {
  const [amount, setAmount] = useState("");
  const amountPaise =
    payload.mode === "payment" ? payload.amountPaise : parseAmount(amount);
  const upiInput =
    payload.v === 2 && amountPaise
      ? {
          upiId: payload.upiId,
          payeeName: payload.accountHolderName,
          amountPaise,
          ...(payload.reference ? { note: payload.reference } : {}),
        }
      : null;
  const upiIntent = upiInput ? buildUpiIntent(upiInput) : null;
  const androidUpiIntent = upiInput ? buildAndroidUpiIntent(upiInput) : null;
  return (
    <>
      <div className="payment-hero">
        <p className="muted">Pay to</p>
        <h1>{payload.merchantName}</h1>
        <p className="merchant-disclosure">
          These receiving details were provided by the merchant.
        </p>
        {payload.mode === "payment" ? (
          <p className="payment-amount numeric">
            {formatCurrency(payload.amountPaise)}
          </p>
        ) : (
          <div className="amount-entry">
            <label htmlFor="customer-amount">Amount to pay</label>
            <div className="amount-input">
              <span aria-hidden="true">₹</span>
              <input
                id="customer-amount"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0.00"
                value={amount}
                maxLength={20}
                onChange={(e) => setAmount(e.target.value)}
                aria-invalid={!!amount && !amountPaise}
                aria-describedby={
                  amount && !amountPaise ? "amount-error" : undefined
                }
              />
            </div>
            {amount && !amountPaise && (
              <p id="amount-error" className="error">
                Enter an amount greater than ₹0, with up to 2 decimal places.
              </p>
            )}
          </div>
        )}
      </div>
      <section className="bank-transfer-guide" aria-labelledby="transfer-heading">
        <h2 id="transfer-heading"><Landmark size={24} aria-hidden="true" />Pay by bank transfer</h2>
        <p className="transfer-intro">Use IMPS or NEFT in your banking app.</p>
        <ol className="transfer-guide-steps">
          <li>
            <strong>Open your banking app</strong>
            <p>Choose Money transfer, then IMPS or NEFT. Add a new receiver (beneficiary) if asked.</p>
          </li>
          <li>
            <strong>Copy here. Paste in your bank app.</strong>
            <p>Copy one detail below. Switch to your bank app, touch and hold the matching box, then tap Paste. Come back for the next detail.</p>
          </li>
          <li>
            <strong>Check the name and amount. Then send.</strong>
            <p>Check the receiver shown by your bank before you send money.</p>
          </li>
        </ol>
      </section>
      <section className="payment-details" aria-labelledby="details-heading">
        <h2 id="details-heading">Bank transfer details</h2>
        <p className="payment-details-intro">
          Copy and paste one detail at a time. Your phone keeps only the last detail copied.
        </p>
        <CopyFieldRow
          label="Account number"
          value={payload.accountNumber}
          masked
          prominent
          pasteHint="Copies the full number. Paste into Account number in your bank app."
        />
        <CopyFieldRow label="IFSC" value={payload.ifsc} prominent pasteHint="Paste into IFSC in your bank app." />
        <CopyFieldRow
          label="Account holder"
          value={payload.accountHolderName}
          prominent
          pasteHint="Paste into Beneficiary name or Account holder name in your bank app."
        />
        {payload.bankName && (
          <div className="detail-row">
            <div className="detail-value">
              <span className="field-caption">Bank</span>
              <span>{payload.bankName}</span>
            </div>
          </div>
        )}
        {amountPaise && (
          <CopyFieldRow label="Amount" value={amountText(amountPaise)} prominent pasteHint="Paste into Amount in your bank app. The amount is in rupees." />
        )}{" "}
        {payload.reference && (
          <CopyFieldRow label="Reference" value={payload.reference} prominent pasteHint="Paste into Remarks or Reference, if your bank asks for it." />
        )}
      </section>
      <SafetyNote />
      <BankLaunchSheet />
      {payload.v === 2 && (
        <section className="upi-action" aria-labelledby="upi-action-title">
          <h2 id="upi-action-title">Or, you can pay via UPI</h2>
          <p className="upi-choice-note">Choose this if you prefer to use a UPI app.</p>
          {upiIntent ? (
            <a className="bq-button secondary full" href={upiIntent}>
              <Smartphone size={20} aria-hidden="true" />
              Pay with UPI app
            </a>
          ) : (
            <button className="bq-button secondary full" type="button" disabled>
              <Smartphone size={20} aria-hidden="true" />
              Enter an amount to use UPI
            </button>
          )}
          <p className="small muted">
            Your phone may open a UPI app or let you choose one. Check the
            receiver and amount in that app before paying.
          </p>
          <CopyFieldRow label="UPI ID" value={payload.upiId} prominent pasteHint="You can also paste this into Pay to UPI ID in your UPI app." />
          <details className="upi-help">
            <summary>UPI app not opening?</summary>
            <p>Using Chrome on Android? Try the button below.</p>
            {androidUpiIntent ? (
              <a className="bq-button secondary full" href={androidUpiIntent}>
                Try opening UPI apps on Android
              </a>
            ) : (
              <p>Enter an amount above to try opening a UPI app.</p>
            )}
            <p>If it still does not open, copy the UPI ID above. Open your UPI app yourself, choose Pay to UPI ID and paste it. Check the receiver and amount before paying.</p>
          </details>
        </section>
      )}
      <p className="payment-footnote">
        Complete your transfer inside your bank app.
        <br />
        BankQR does not move money or confirm payments.
      </p>
    </>
  );
}
export function PaymentPage() {
  const hash = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  if (hash === null)
    return (
      <div className="empty-state" role="status">
        Loading payment details…
      </div>
    );
  const payload = decode(hash);
  return payload ? (
    <ValidPayment key={hash} payload={payload} />
  ) : (
    <div className="empty-state">
      <AlertCircle size={40} aria-hidden="true" />
      <h1>{INVALID_LINK}</h1>
      <p>Ask the merchant to generate a new QR.</p>
      <Link href="/" className="text-link">
        <ArrowLeft size={16} />
        About BankQR
      </Link>
    </div>
  );
}
