import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Quincy — Escrow micro-task bounties on Celo",
  description:
    "Post and complete micro-task bounties with cUSD rewards locked in escrow. MiniPay-first, built on Celo.",
  other: {
    "talentapp:project_verification":
      "a9a1a599f43e95fc611bdf5a57ace81bfe158fd4b47dca9d8399f9ea320e3809962a75cf0f8c5a35c0293840f4af691340206fe0b5ee1d81c104191d404ae736",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f9054",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
