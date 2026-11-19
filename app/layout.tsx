import type { Metadata, Viewport } from "next";
import { Lato, Patrick_Hand, Kaushan_Script } from "next/font/google";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

// Closest free match to the Groundy handwritten headings
const hand = Patrick_Hand({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
});

// Brush script for the logo wordmark
const logo = Kaushan_Script({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "ANOVEL — From India's villages to the world",
  description:
    "ANOVEL connects verified rural producers — farmers, weavers and artisans — with buyers across India and the world.",
};

export const viewport: Viewport = {
  themeColor: "#5f7a3a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${hand.variable} ${logo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
