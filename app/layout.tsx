import type { Metadata } from "next";
import "./globals.css";
import "@fontsource-variable/inter";

export const metadata: Metadata = {
  title: "BankQR — Bank transfer details",
  description: "Share merchant-provided bank transfer details with a QR.",
  referrer: "no-referrer",
  icons: { icon: "/brand/mark.svg" },
  manifest: "/manifest.webmanifest",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
