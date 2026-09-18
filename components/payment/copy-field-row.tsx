"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { copyText } from "@/lib/clipboard";
import { maskAccount } from "@/features/bankqr/normalize";
export function CopyFieldRow({
  label,
  value,
  masked = false,
}: {
  label: string;
  value: string;
  masked?: boolean;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const [revealed, setRevealed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    clearTimeout(timer.current);
    const ok = await copyText(value, navigator.clipboard);
    setState(ok ? "copied" : "failed");
    if (ok) timer.current = setTimeout(() => setState("idle"), 1200);
  }
  return (
    <div className="detail-row">
      <div className="detail-value">
        <span className="field-caption">{label}</span>
        <span className="numeric">
          {masked && !revealed ? maskAccount(value) : value}
        </span>
      </div>
      <div className="row-actions">
        {masked && (
          <button
            className="icon-button"
            type="button"
            onClick={() => setRevealed(!revealed)}
            aria-label={`${revealed ? "Hide" : "Reveal"} account number`}
          >
            {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        <button
          type="button"
          className="icon-button"
          aria-label={`Copy ${label.toLowerCase()}`}
          onClick={copy}
        >
          {state === "copied" ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
      <span className="sr-only" role="status">
        {state === "copied" ? `${label} copied` : ""}
      </span>
      {state === "copied" && (
        <span className="copy-feedback" aria-hidden="true">
          Copied
        </span>
      )}
      {state === "failed" && (
        <div className="copy-fallback">
          <p>
            Copy is unavailable. Select and copy {label.toLowerCase()} below.
          </p>
          <input
            aria-label={`Select ${label.toLowerCase()}`}
            readOnly
            value={value}
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
      )}
    </div>
  );
}
