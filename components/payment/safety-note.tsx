import { ShieldAlert } from "lucide-react";
export function SafetyNote() {
  return (
    <aside className="safety-note">
      <ShieldAlert size={20} aria-hidden="true" />
      <p>
        Confirm the beneficiary name shown by your bank before authorising
        payment.
      </p>
    </aside>
  );
}
