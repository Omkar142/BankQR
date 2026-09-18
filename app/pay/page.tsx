import { AppShell } from "@/components/layout/app-shell";
import { PaymentPage } from "@/components/payment/payment-page";
export default function Pay() {
  return (
    <AppShell compact>
      <main id="main" className="pay-container">
        <PaymentPage />
      </main>
    </AppShell>
  );
}
