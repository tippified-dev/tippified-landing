import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gem Vault – View Your Gems | Tippified",
  description:
    "Access your Tippified Gem Vault, view your Gem collection, check your available Gems, and purchase more Gems to celebrate your favourite creators.",
  alternates: {
    canonical: "https://tippified.com/gem-vault",
  },
  openGraph: {
    title: "Gem Vault – View Your Gems | Tippified",
    description:
      "Access your Gem Vault, check your Gem collection, and discover more ways to celebrate your favourite creators on Tippified.",
    url: "https://tippified.com/gem-vault",
    siteName: "Tippified",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GemVaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
