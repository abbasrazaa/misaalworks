import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "MISAAL WORKS — Pakistan, within reach", template: "%s | MISAAL WORKS" },
  description: "Bespoke craft, personal shopping from Pakistani brands and B2B sourcing. Lahore operations, Canadian-facing service.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body><Navbar /><main>{children}</main><Footer /></body>
    </html>
  );
}
