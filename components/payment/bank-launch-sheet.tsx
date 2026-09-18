"use client";
import { Dialog } from "@base-ui/react/dialog";
import { Landmark, X } from "lucide-react";
import { banks } from "@/banks/registry";
export function BankLaunchSheet() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="bq-button secondary full">
        <Landmark size={20} />
        How to make a bank transfer
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="sheet-backdrop" />
        <Dialog.Popup className="bank-sheet" initialFocus={true}>
          <div className="sheet-heading">
            <Dialog.Title>Continue in your bank</Dialog.Title>
            <Dialog.Close
              className="icon-button"
              aria-label="Close bank guidance"
            >
              <X size={20} />
            </Dialog.Close>
          </div>
          <Dialog.Description>
            Open your banking app manually
          </Dialog.Description>
          <p className="muted">
            Switch to your official bank app, choose NEFT or IMPS, and use the
            details you copied. Your bank may ask you to add a beneficiary
            first.
          </p>
          <ul className="bank-list">
            {banks.map((bank) => (
              <li key={bank.id}>
                <Landmark size={20} aria-hidden="true" />
                <span>{bank.displayName}</span>
                <span className="field-caption">Manual</span>
              </li>
            ))}
          </ul>
          <p className="small muted">
            Using another bank? The same steps apply. These names are guidance,
            not bank integrations. BankQR cannot confirm your transfer.
          </p>
          <Dialog.Close className="bq-button secondary full">
            Back to payment details
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
