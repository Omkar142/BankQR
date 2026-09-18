import { AppShell } from "@/components/layout/app-shell";
import { MerchantForm } from "@/components/merchant/merchant-form";
export default function Create() {
  return (
    <AppShell>
      <main id="main" className="create-container">
        <div className="page-intro">
          <h1>Create your BankQR</h1>
          <p>Turn your receiving bank details into a QR customers can scan.</p>
        </div>
        <MerchantForm />
      </main>
    </AppShell>
  );
}
