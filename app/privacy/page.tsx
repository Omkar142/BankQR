import { AppShell } from "@/components/layout/app-shell";
export default function Privacy() {
  return (
    <AppShell>
      <main id="main" className="legal-container">
        <h1>Privacy</h1>
        <p className="lead">
          Your receiving details are shared through your QR. Be deliberate about
          where you share it.
        </p>
        <h2>What a QR contains</h2>
        <p>
          A BankQR link contains the merchant name, account holder, account
          number, IFSC, optional bank name, creation time and any payment amount
          or reference. These details are encoded, not encrypted or verified.
          Anyone with the link or QR can read and change them.
        </p>
        <h2>What stays on your device</h2>
        <p>
          Receiving details are carried in the URL fragment, after the #.
          Browsers do not normally send that fragment to the hosting server. The
          payment page reads it in memory and does not save it to local or
          session storage. Browser history, synced history, shared messages and
          downloaded QR files can still retain the link or details.
        </p>
        <h2>Optional merchant saving</h2>
        <p>
          Only choosing “Save on this device” stores your merchant receiving
          profile in this browser. It does not save the payment amount or
          reference. Use “Delete saved profile” on the creation page to remove
          it, or clear this site’s data in your browser settings. Avoid saving
          on shared devices.
        </p>
        <h2>Clipboard and sharing</h2>
        <p>
          Copy actions put the selected details on your system clipboard, which
          your operating system or other applications may retain. Sharing passes
          the link to the app you choose. Share it only with intended payers.
        </p>
        <h2>Hosting and third parties</h2>
        <p>
          BankQR has no analytics, advertising trackers, remote fonts or
          external API calls on the payment page. The static hosting provider
          may process ordinary request information such as IP address and
          browser details. Banking services and apps you use have their own
          privacy practices.
        </p>
        <h2>Bank credentials</h2>
        <p>
          BankQR never requests your banking password, OTP, PIN, card security
          code or biometric information. Enter banking credentials only in your
          official banking environment.
        </p>
      </main>
    </AppShell>
  );
}
