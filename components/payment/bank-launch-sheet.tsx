"use client";
import { Dialog } from "@base-ui/react/dialog";
import { Landmark, X } from "lucide-react";
export function BankLaunchSheet() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="bq-button primary full">
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
          <Dialog.Description>Open your banking app manually</Dialog.Description>
          <p className="muted">
            For account-and-IFSC transfers, BankQR cannot open or fill your bank
            app automatically. Keep this page open to copy each detail.
          </p>
          <ol className="transfer-steps">
            <li>
              Open your official bank app and choose an account-and-IFSC transfer,
              such as IMPS or NEFT.
            </li>
            <li>
              Add the beneficiary using the account number, IFSC and name above.
            </li>
            <li>
              Enter the amount and reference, if shown. Review the beneficiary
              shown by your bank before authorising.
            </li>
          </ol>
          <p className="small muted">
            Your bank may require beneficiary activation. BankQR cannot confirm
            whether a transfer was made.
          </p>
          <Dialog.Close className="bq-button secondary full">
            Back to payment details
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
