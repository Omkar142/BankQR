import Link from "@/components/layout/static-link";
import { ArrowRight, Copy, Landmark, ScanLine } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { BrandMark } from "@/components/brand/brand-mark";
export default function Home() {
  return (
    <AppShell>
      <main id="main">
        <section className="landing-hero">
          <div className="hero-copy">
            <h1>
              Bank details.
              <br />
              One simple scan.
            </h1>
            <p className="hero-description">
              Give customers a clearer way to make a bank transfer. Share your
              receiving details in a QR. They copy, switch to their bank, and
              pay there.
            </p>
            <Link className="bq-button primary hero-cta" href="/create/">
              Create BankQR
              <ArrowRight size={20} />
            </Link>
            <p className="small muted">No login. No BankQR app to install.</p>
          </div>
          <div
            className="hero-demo"
            aria-label="Illustrative customer payment page"
          >
            <div className="demo-heading">
              <BrandMark />
              <span>Bank transfer details</span>
            </div>
            <div className="demo-pay">
              <p className="muted">Pay to</p>
              <h2>Your business</h2>
              <p className="demo-amount">
                ₹2,500<span>.00</span>
              </p>
              <span className="demo-caption">Illustrative payment QR</span>
            </div>
            <div className="demo-row">
              <span>Account number</span>
              <strong>•••• •••• 4821</strong>
              <Copy size={16} aria-hidden="true" />
            </div>
            <div className="demo-row">
              <span>Transfer in</span>
              <strong>Your banking app</strong>
              <Landmark size={16} aria-hidden="true" />
            </div>
            <p className="demo-note">
              Details provided by merchant.
              <br />
              Always confirm the beneficiary in your bank app.
            </p>
          </div>
        </section>
        <section className="how-section" aria-labelledby="how-title">
          <div className="how-intro">
            <h2 id="how-title">
              From your counter
              <br />
              to their banking app.
            </h2>
            <p className="muted">A familiar transfer, with less typing.</p>
          </div>
          <ol className="steps">
            <li>
              <ScanLine aria-hidden="true" />
              <div>
                <h3>Create & share</h3>
                <p>
                  Enter your receiving details. Download your QR or share the
                  payment link.
                </p>
              </div>
            </li>
            <li>
              <Copy aria-hidden="true" />
              <div>
                <h3>Scan & copy</h3>
                <p>
                  Customers scan with their camera and copy the account, IFSC
                  and amount.
                </p>
              </div>
            </li>
            <li>
              <Landmark aria-hidden="true" />
              <div>
                <h3>Transfer in the bank</h3>
                <p>
                  They confirm the beneficiary and complete NEFT or IMPS in
                  their official banking app.
                </p>
              </div>
            </li>
          </ol>
        </section>
        <section className="boundary-section">
          <h2>Your bank handles the transfer.</h2>
          <p>
            BankQR shares merchant-provided instructions. It does not initiate,
            verify or confirm payments, and never asks for banking passwords,
            PINs or OTPs.
          </p>
          <Link className="text-link" href="/create/">
            Create your first QR
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    </AppShell>
  );
}
