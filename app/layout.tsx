import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import GlobalNotification from "./components/GlobalNotification";
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
  title: "Tippified- Nigeria's No 1 tipping platform for creators.",
  description: "Tippified is a Nigerian creator tipping platform that let fans tip their favorite content creators quickly and without stress.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const pathname = usePathname();
   const showNotification = pathname !== "/search-goals";
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png"/>
        <meta name="google-site-verification" content="7BRVgEDf0IMYDUZ6wuAcX_JzqvDBeUQmHwa_0Tz5LJM" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {showNotification && <GlobalNotification/>}
        {children}
      </body>
    </html>
  );
}
