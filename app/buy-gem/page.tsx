import type { Metadata } from "next";
import BuyGemsPage from "./BuyGemsPage";

export const metadata: Metadata = {
  title: "Buy Gems on Tippified | Support Your Favourite Creators",
  description:
    "Buy Gems on Tippified to support your favourite African creators. Explore available Gems, choose your quantities and securely purchase Gems for your Gem Vault.",
  alternates: {
    canonical: "https://tippified.com/buy-gem",
  },
  openGraph: {
    title: "Buy Gems on Tippified",
    description:
      "Purchase Gems on Tippified and use them to appreciate and support your favourite creators.",
    url: "https://tippified.com/buy-gem",
    siteName: "Tippified",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <BuyGemsPage />;
}
