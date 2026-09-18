import Link from "@/components/layout/static-link";
import { AppShell } from "@/components/layout/app-shell";
export default function NotFound() {
  return (
    <AppShell>
      <main id="main" className="empty-state">
        <h1>This page could not be found.</h1>
        <p>Check the link or return to BankQR.</p>
        <Link href="/" className="bq-button primary">
          Return to BankQR
        </Link>
      </main>
    </AppShell>
  );
}
