"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { copyText } from "@/lib/clipboard";
import { maskAccount } from "@/features/bankqr/normalize";
export function CopyFieldRow({
  label,
  value,
  masked = false,
  prominent = false,
  pasteHint,
}: {
  label: string;
  value: string;
  masked?: boolean;
  prominent?: boolean;
  pasteHint?: string;
}) {
  const hintId = useId();
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
    <div className={`detail-row${prominent ? " detail-row-prominent" : ""}`}>
      <div className="detail-value">
        <span className="field-caption">{label}</span>
        <span className="numeric">
          {masked && !revealed ? maskAccount(value) : value}
        </span>
      </div>
      <div className="row-actions">
        {masked && (
          <button
            className={prominent ? "detail-reveal" : "icon-button"}
            type="button"
            onClick={() => setRevealed(!revealed)}
            aria-label={`${revealed ? "Hide" : "Show"} account number`}
            aria-pressed={revealed}
          >
            {revealed ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            {prominent && <span>{revealed ? "Hide number" : "Show number"}</span>}
          </button>
        )}
        <button
          type="button"
          className={prominent ? "detail-copy" : "icon-button"}
          aria-label={`Copy ${label.toLowerCase()}`}
          aria-describedby={pasteHint ? hintId : undefined}
          onClick={copy}
        >
          {state === "copied" ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          {prominent && (
            <span>
              {state === "copied"
                ? "Copied"
                : `Copy ${["IFSC", "UPI ID"].includes(label) ? label : label.toLowerCase()}`}
            </span>
          )}
        </button>
      </div>
      {pasteHint && <p className="paste-hint" id={hintId}>{pasteHint}</p>}
      <span className="sr-only" role="status">
        {state === "copied" ? `${label} copied. ${pasteHint ?? ""}` : ""}
      </span>
      {state === "copied" && !prominent && (
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
