"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@base-ui/react/dialog";
import QRCode from "qrcode";
import { QrCode, Landmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { merchantFormSchema } from "@/features/bankqr/schema";
import { createPayload } from "@/features/bankqr/draft";
import { paymentUrl } from "@/features/bankqr/encode";
import { normalizeAccount, normalizeIfsc } from "@/features/bankqr/normalize";
import type { MerchantFormValues } from "@/features/bankqr/types";
import { clearProfile, loadProfile, saveProfile } from "@/lib/local-storage";
import { basePath } from "@/lib/base-path";
import { parseAmount, formatCurrency } from "@/lib/currency";
import { QrResultCard, type QrResult } from "./qr-result-card";
const defaults: MerchantFormValues = {
  merchantName: "",
  accountHolderName: "",
  accountNumber: "",
  confirmAccountNumber: "",
  ifsc: "",
  bankName: "",
  mode: "static",
  amount: "",
  reference: "",
  confirmed: false,
};
export function MerchantForm() {
  const form = useForm<MerchantFormValues>({
    defaultValues: defaults,
    resolver: zodResolver(merchantFormSchema),
    mode: "onBlur",
  });
  const values = useWatch({ control: form.control });
  const [result, setResult] = useState<QrResult | null>(null);
  const [notice, setNotice] = useState("");
  const [confirmSwitch, setConfirmSwitch] = useState(false);
  const { errors } = form.formState;
  function setMode(mode: "static" | "payment") {
    if (mode === values.mode) return;
    if (mode === "static" && (values.amount || values.reference)) {
      setConfirmSwitch(true);
      return;
    }
    form.setValue("mode", mode);
  }
  function clearPayment() {
    form.setValue("mode", "static");
    form.setValue("amount", "");
    form.setValue("reference", "");
    form.clearErrors(["amount", "reference"]);
    setConfirmSwitch(false);
  }
  async function generate(input: MerchantFormValues) {
    setNotice("");
    try {
      const { payload } = createPayload(input);
      const url = paymentUrl(payload, location.origin, basePath);
      const image = await QRCode.toDataURL(url, {
        width: 720,
        margin: 4,
        errorCorrectionLevel: "M",
      });
      setResult({ payload, url, image });
      requestAnimationFrame(() => {
        const heading = document.getElementById("result-title");
        heading?.scrollIntoView({ block: "start" });
        heading?.focus();
      });
    } catch {
      setNotice(
        "Could not generate this QR. Check your details, shorten optional fields, and try again on an HTTPS site.",
      );
    }
  }
  function save() {
    try {
      const { profile } = createPayload(form.getValues());
      setNotice(
        saveProfile(window.localStorage, profile)
          ? "Merchant profile saved on this device."
          : "This browser could not save the profile. You can still use your QR.",
      );
    } catch {
      setNotice("Check and confirm the receiving details before saving.");
    }
  }
  function load() {
    try {
      const profile = loadProfile(window.localStorage);
      if (!profile) {
        setNotice("No valid saved profile found on this device.");
        return;
      }
      form.reset({
        ...defaults,
        ...profile,
        bankName: profile.bankName ?? "",
        confirmAccountNumber: profile.accountNumber,
      });
      setNotice(
        "Saved profile loaded. Check the details and confirm them again.",
      );
    } catch {
      setNotice("Local storage is unavailable in this browser.");
    }
  }
  function clear() {
    try {
      setNotice(
        clearProfile(window.localStorage)
          ? "Saved profile deleted from this device."
          : "This browser could not delete the profile. Clear site data in browser settings.",
      );
    } catch {
      setNotice("Local storage is unavailable in this browser.");
    }
  }
  function field(
    name: keyof Pick<
      MerchantFormValues,
      | "merchantName"
      | "accountHolderName"
      | "accountNumber"
      | "confirmAccountNumber"
      | "ifsc"
      | "bankName"
      | "amount"
      | "reference"
    >,
    label: string,
    options: {
      placeholder?: string;
      numeric?: boolean;
      maxLength?: number;
    } = {},
  ) {
    return (
      <div className="form-field">
        <label htmlFor={name}>{label}</label>
        <Input
          id={name}
          {...form.register(name)}
          placeholder={options.placeholder}
          inputMode={options.numeric ? "decimal" : "text"}
          maxLength={options.maxLength ?? 100}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
          className="bq-input"
        />
        {errors[name] && (
          <p id={`${name}-error`} className="error">
            {errors[name]?.message}
          </p>
        )}
      </div>
    );
  }
  const previewAmount = parseAmount(values.amount ?? "");
  return (
    <>
      {!result && (
        <>
          <fieldset className="mode-switcher">
            <legend className="sr-only">QR type</legend>
            {(["static", "payment"] as const).map((mode) => (
              <label
                key={mode}
                className={values.mode === mode ? "selected" : ""}
              >
                <input
                  type="radio"
                  name="qr-mode"
                  disabled={form.formState.isSubmitting}
                  aria-label={mode === "static" ? "Static QR" : "Payment QR"}
                  checked={values.mode === mode}
                  onChange={() => setMode(mode)}
                />
                <span>{mode === "static" ? "Static QR" : "Payment QR"}</span>
                <small>
                  {mode === "static"
                    ? "Customer enters the amount"
                    : "You set a fixed amount"}
                </small>
              </label>
            ))}
          </fieldset>
          <form
            onSubmit={form.handleSubmit(generate)}
            noValidate
            className="merchant-form"
          >
            <fieldset
              disabled={form.formState.isSubmitting}
              className="form-fields"
            >
              <section>
                <div className="section-heading">
                  <Landmark size={20} aria-hidden="true" />
                  <h2>Receiving details</h2>
                </div>
                <p className="section-description">
                  Use the details of the account you want customers to pay.
                </p>
                {field("merchantName", "Merchant name", {
                  placeholder: "Your shop or business name",
                  maxLength: 160,
                })}
                {field("accountHolderName", "Account holder name", {
                  placeholder: "As shown on the bank account",
                  maxLength: 200,
                })}
                <div className="form-grid">
                  {field("accountNumber", "Account number", {
                    numeric: true,
                    maxLength: 30,
                  })}
                  {field("confirmAccountNumber", "Confirm account number", {
                    numeric: true,
                    maxLength: 30,
                  })}
                </div>
                <div className="form-grid">
                  {field("ifsc", "IFSC", {
                    placeholder: "e.g. HDFC0001234",
                    maxLength: 15,
                  })}
                  {field("bankName", "Bank name (optional)", {
                    placeholder: "e.g. HDFC Bank",
                    maxLength: 80,
                  })}
                </div>
              </section>
              {values.mode === "payment" && (
                <section className="payment-fields">
                  <h2>Payment details</h2>
                  <div className="form-grid">
                    {field("amount", "Amount (₹)", {
                      placeholder: "0.00",
                      numeric: true,
                      maxLength: 20,
                    })}
                    {field("reference", "Reference (optional)", {
                      placeholder: "e.g. INV-104",
                      maxLength: 40,
                    })}
                  </div>
                </section>
              )}
              <section
                className="merchant-preview"
                aria-label="Receiving details preview"
              >
                <span className="field-caption">Customer preview</span>
                <h3>{values.merchantName?.trim() || "Your merchant name"}</h3>
                <p>
                  {values.accountHolderName?.trim() || "Account holder name"}
                </p>
                <p className="numeric">
                  {normalizeAccount(values.accountNumber ?? "") ||
                    "Account number"}{" "}
                  <span aria-hidden="true">·</span>{" "}
                  {normalizeIfsc(values.ifsc ?? "") || "IFSC"}
                </p>
                {values.mode === "payment" && previewAmount && (
                  <p className="preview-amount">
                    {formatCurrency(previewAmount)}
                  </p>
                )}
                <p className="small muted">Details provided by merchant</p>
              </section>
              <label className="confirmation">
                <input
                  type="checkbox"
                  {...form.register("confirmed")}
                  aria-describedby={
                    errors.confirmed ? "confirmed-error" : undefined
                  }
                />
                <span>I confirm these receiving details are correct.</span>
              </label>
              {errors.confirmed && (
                <p className="error" id="confirmed-error">
                  {errors.confirmed.message}
                </p>
              )}
              <button
                className="bq-button primary full"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                <QrCode size={20} />
                {form.formState.isSubmitting
                  ? "Generating QR…"
                  : "Generate BankQR"}
              </button>
              <p className="small muted form-footnote">
                Your bank details will be readable by anyone with the QR.
              </p>
            </fieldset>
          </form>
        </>
      )}
      <div>
        {result && (
          <QrResultCard
            result={result}
            onEdit={() => {
              setResult(null);
              form.setValue("confirmed", false);
            }}
            onSave={save}
          />
        )}
      </div>
      <div className="profile-actions">
        {!result && (
          <button className="text-button" onClick={load}>
            Load saved profile
          </button>
        )}
        <button className="text-button" onClick={clear}>
          Delete saved profile
        </button>
      </div>
      <p className="small muted centered">
        Saving is optional. Only save on a device you trust.
      </p>
      <p role="status" className="notice-text">
        {notice}
      </p>
      <Dialog.Root open={confirmSwitch} onOpenChange={setConfirmSwitch}>
        <Dialog.Portal>
          <Dialog.Backdrop className="sheet-backdrop" />
          <Dialog.Popup className="bank-sheet" initialFocus={true}>
            <Dialog.Title>Switch to a static QR?</Dialog.Title>
            <Dialog.Description>
              This clears the amount and reference you entered.
            </Dialog.Description>
            <button className="bq-button primary full" onClick={clearPayment}>
              Clear and switch
            </button>
            <Dialog.Close className="bq-button secondary full">
              Keep payment QR
            </Dialog.Close>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
