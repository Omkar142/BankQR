import Link from "./static-link";
import { BrandMark } from "@/components/brand/brand-mark";
import { SkipLink } from "./skip-link";
export function AppShell({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <>
      <SkipLink />
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="BankQR home">
            <BrandMark />
            <span>BankQR</span>
          </Link>
          {!compact && (
            <Link href="/create/" className="header-link">
              Create a QR <span aria-hidden="true">↗</span>
            </Link>
          )}
          {compact && (
            <span className="header-note">Bank transfer details</span>
          )}
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <span>Details shared simply. Transfers stay with your bank.</span>
        <nav aria-label="Legal">
          <Link href="/privacy/">Privacy</Link>
          <Link href="/terms/">Terms</Link>
        </nav>
      </footer>
    </>
  );
}
