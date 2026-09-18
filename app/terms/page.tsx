import { AppShell } from "@/components/layout/app-shell";
export default function Terms() {
  return (
    <AppShell>
      <main id="main" className="legal-container">
        <h1>Terms of use</h1>
        <p className="lead">
          BankQR is a bank-transfer instruction utility. Your bank performs the
          payment.
        </p>
        <h2>Merchant-provided details</h2>
        <p>
          Merchants are responsible for entering accurate receiving details and
          testing each QR before sharing or printing it. BankQR does not verify
          the merchant, account ownership or beneficiary. A QR is a snapshot:
          changing your form or saved profile does not update a QR you have
          already shared.
        </p>
        <h2>Before making a transfer</h2>
        <p>
          Check the merchant, amount, account and IFSC. Confirm the beneficiary
          name shown by your bank before authorising payment. Physical QR codes
          can be replaced and links can be modified. Do not rely on the QR as
          proof of identity.
        </p>
        <h2>Payment responsibility</h2>
        <p>
          BankQR does not initiate, authorise, hold, clear, settle, verify or
          confirm payments. It does not select payment rails, enforce their
          limits or determine fees. NEFT/IMPS availability, beneficiary setup,
          processing times and limits are determined by your bank.
        </p>
        <h2>Bank apps and confirmation</h2>
        <p>
          Bank names in the guidance sheet do not imply integration, partnership
          or endorsement. Open your official banking app manually. Check payment
          status with your bank and recipient; copying details or opening an app
          is not payment confirmation.
        </p>
        <h2>Use and availability</h2>
        <p>
          Use BankQR only for receiving details you are entitled to share. Keep
          shared links and downloaded QR files appropriately protected. This
          validation release may change or become unavailable. Keep another way
          to exchange receiving details.
        </p>
        <h2>Problems with a transfer</h2>
        <p>
          Contact your bank and intended recipient about incorrect transfers,
          delays or payment disputes. BankQR cannot reverse transfers or recover
          funds.
        </p>
      </main>
    </AppShell>
  );
}
