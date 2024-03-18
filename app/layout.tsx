import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";

export const metadata: Metadata = {
  title: "Ham widget frame",
  description: "Ham widget frame that checks the eligibility for an NFT drop to isntall the widget",
};

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
