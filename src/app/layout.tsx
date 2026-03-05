import type { Metadata } from "next";
import { Public_Sans, Source_Serif_4 } from "next/font/google";

import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustFeed MVP",
  description: "Trust-first local roofing discovery concept demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} ${sourceSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
