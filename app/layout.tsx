import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tippified- Nigeria's No 1 tipping platform for creators",
  description: "Tippified is a Nigerian creator tipping platform that let fans tip their favorite content creators quickly and without stress",
};

export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
