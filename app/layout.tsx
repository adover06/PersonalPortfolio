import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";

/*
  Newsreader rather than Geist/Inter. Those two ship as the default in every
  Next.js and v0 template, so they read as "generated" before a visitor has
  processed a single word. A text serif does the opposite.
*/
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Andrew Dover",
  description:
    "Andrew Dover — software engineer in San Jose. Backend systems, home infrastructure, and IoT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${newsreader.variable} antialiased`}>{children}</body>
    </html>
  );
}
