import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tippified.com"),

  title: "Tippified | Africa's No. 1 Tipping Platform for Creators",

  description:
    "Tippified is a creator tipping platform that lets fans support their favorite content creators through tips, gifts, goals, exclusive content and more.",

  openGraph: {
    title: "Tippified | Support the Creators You Love",
    description:
      "Tippified helps creators receive direct support from their fans through tips, gifts, goals, exclusive content and more.",
    url: "https://www.tippified.com",
    siteName: "Tippified",
    images: [
      {
        url: "/social_banner.jpeg",
        width: 1664,
        height: 936,
        alt: "Tippified - Support the creators you love",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Tippified | Support the Creators You Love",
    description:
      "Support your favorite creators through tips, gifts, goals, exclusive content and more.",
    images: ["/social_banner.jpeg"],
  },

  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="7BRVgEDf0IMYDUZ6wuAcX_JzqvDBeUQmHwa_0Tz5LJM"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9782370968070463"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <Script
          src="https://pl31195636.profitableratecpmnetwork.com/f2/29/77/f22977ce4dd1849011b54c890005f145.js"
          strategy="afterInteractive"
        />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
