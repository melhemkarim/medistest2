import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

// Playfair Display (italic) gives the elegant, editorial headline feel —
// the same family of look used for names/dates in the reference design.
const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

// Poppins stays for small caps labels, buttons, and body copy —
// matches the MedisPharm wordmark typeface.
const body = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Medispharm & AWMU — You're Invited",
  description: "Medispharm and AWMU invite you to celebrate with us.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-body bg-brand-deep text-ivory antialiased`}>
        {children}
      </body>
    </html>
  );
}
