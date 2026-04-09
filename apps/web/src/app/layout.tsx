import type { Metadata } from "next";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";

import { AppWalletProvider } from "../components/wallet-provider";
import { getPublicRpcUrl } from "../lib/config";

export const metadata: Metadata = {
  title: "Blinkfy",
  description: "Blink generator and Blink-aware client for Solana Actions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider endpoint={getPublicRpcUrl()}>{children}</AppWalletProvider>
      </body>
    </html>
  );
}
