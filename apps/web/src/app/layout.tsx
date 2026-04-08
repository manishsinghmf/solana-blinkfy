import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blinkfy",
  description: "Minimal Solana Blink generator for devnet SOL transfers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
