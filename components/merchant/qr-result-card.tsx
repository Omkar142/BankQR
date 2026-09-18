"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Download, Share2, ArrowUpRight, Pencil } from "lucide-react";
import { motionTokens } from "@/styles/motion";
import { maskAccount } from "@/features/bankqr/normalize";
import { copyText } from "@/lib/clipboard";
import { downloadPng, qrFilename } from "@/lib/download";
import { formatCurrency } from "@/lib/currency";
import type { BankQrPayloadV1 } from "@/features/bankqr/types";
export type QrResult = { payload: BankQrPayloadV1; url: string; image: string };
export function QrResultCard({
  result,
  onEdit,
  onSave,
}: {
  result: QrResult;
  onEdit: () => void;
  onSave: () => void;
}) {
  const [notice, setNotice] = useState("");
  const [fallback, setFallback] = useState(false);
  const reduce = useReducedMotion();
  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "BankQR — bank transfer details",
          url: result.url,
        });
        setNotice("Sharing finished.");
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
    const ok = await copyText(result.url, navigator.clipboard);
    setNotice(
      ok
        ? "Payment link copied. Share it only with intended payers."
        : "Select and copy the payment link below.",
    );
    setFallback(!ok);
  }
  return (
    <motion.section
      className="result-card"
      initial={reduce ? false : { opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: reduce ? 0 : motionTokens.enter,
        ease: motionTokens.ease,
      }}
      aria-labelledby="result-title"
    >
      <p className="status-tag">
        {result.payload.mode === "static" ? "Static QR" : "Payment QR"}
      </p>
      <h2 id="result-title" tabIndex={-1}>
        Your BankQR is ready
      </h2>
      <p className="muted">
        Scan with a phone camera to open the receiving details.
      </p>
      {/* A local generated data URL cannot use the image optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="qr-image"
        src={result.image}
        alt={`BankQR for ${result.payload.merchantName}`}
        width={720}
        height={720}
      />
      <h3>{result.payload.merchantName}</h3>
      <p className="numeric muted">
        {maskAccount(result.payload.accountNumber)}
      </p>
      {result.payload.mode === "payment" && (
        <p className="result-amount">
          {formatCurrency(result.payload.amountPaise)}
        </p>
      )}
      <div className="result-actions">
        <button
          className="bq-button primary"
          onClick={() =>
            downloadPng(result.image, qrFilename(result.payload.merchantName))
          }
        >
          <Download size={18} />
          Download QR
        </button>
        <button className="bq-button secondary" onClick={share}>
          <Share2 size={18} />
          Share
        </button>
      </div>
      <a
        className="bq-button secondary full"
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Test payment page
        <ArrowUpRight size={18} />
      </a>
      <p className="small muted">
        Anyone with this QR or link can read the receiving details. Test it
        before printing or sharing.
      </p>
      {result.url.startsWith("http:") && (
        <p className="notice">
          Local preview QR: other phones cannot open this address. Generate a
          new QR on your deployed HTTPS site for sharing.
        </p>
      )}
      <div role="status" className="small">
        {notice}
      </div>
      {fallback && (
        <textarea
          readOnly
          aria-label="Payment link to copy"
          value={result.url}
          onFocus={(e) => e.currentTarget.select()}
        />
      )}
      <div className="result-actions">
        <button className="text-button" onClick={onEdit}>
          <Pencil size={16} />
          Edit details
        </button>
        <button className="text-button" onClick={onSave}>
          Save on this device
        </button>
      </div>
    </motion.section>
  );
}
