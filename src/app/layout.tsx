// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Unsent — For everything you never got to say.",
  description:
    "A private letter-writing space for the words you were never ready to send.",
  manifest: "/manifest.webmanifest",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="letter-shell">
        <div className="letter-shell-inner">
          <div className="max-w-4xl w-full">{children}</div>
        </div>
      </body>
    </html>
  );
}
