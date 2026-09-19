"use client";
import { useState, useSyncExternalStore } from "react";
import { AlertCircle, ArrowLeft, Smartphone } from "lucide-react";
import Link from "@/components/layout/static-link";
import { decode } from "@/features/bankqr/decode";
import { INVALID_LINK } from "@/features/bankqr/constants";
import type { BankQrPayload } from "@/features/bankqr/types";
import { buildUpiIntent } from "@/features/bankqr/upi";
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
  const upiIntent =
    payload.v === 2 && amountPaise
      ? buildUpiIntent({
          upiId: payload.upiId,
          payeeName: payload.accountHolderName,
          amountPaise,
          ...(payload.reference ? { note: payload.reference } : {}),
        })
      : null;
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
      <section className="payment-details" aria-labelledby="details-heading">
        <h2 id="details-heading">Bank transfer details</h2>
        <p className="payment-details-intro">
          Copy each detail as your bank asks for it.
        </p>
        <CopyFieldRow
          label="Account number"
          value={payload.accountNumber}
          masked
          prominent
        />
        <CopyFieldRow label="IFSC" value={payload.ifsc} prominent />
        <CopyFieldRow
          label="Account holder"
          value={payload.accountHolderName}
          prominent
        />
        {payload.v === 2 && <CopyFieldRow label="UPI ID" value={payload.upiId} />}
        {payload.bankName && (
          <div className="detail-row">
            <div className="detail-value">
              <span className="field-caption">Bank</span>
              <span>{payload.bankName}</span>
            </div>
          </div>
        )}
        {amountPaise && (
          <CopyFieldRow label="Amount" value={amountText(amountPaise)} />
        )}{" "}
        {payload.reference && (
          <CopyFieldRow label="Reference" value={payload.reference} />
        )}
      </section>
      <SafetyNote />
      <BankLaunchSheet />
      {payload.v === 2 && (
        <section className="upi-action" aria-labelledby="upi-action-title">
          <h2 id="upi-action-title">Or pay using UPI</h2>
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
            Your phone may show compatible UPI apps. Check the verified payee
            and amount inside your chosen app before authorising payment.
          </p>
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
