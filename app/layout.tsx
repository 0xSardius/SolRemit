import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers";
import { CdpProvider } from "./components/cdp-provider";
import { LangProvider } from "./components/lang-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolRemit — transparent US→Mexico remittance on Solana",
  description:
    "Send money to Mexico with stablecoins. Transparent FX via Jupiter — see the mid-market rate, every fee, and what your recipient actually receives.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body
          suppressHydrationWarning
          className={`${inter.variable} ${geistMono.variable} antialiased`}
        >
          <LangProvider>
            <CdpProvider>{children}</CdpProvider>
          </LangProvider>
        </body>
      </Providers>
    </html>
  );
}
