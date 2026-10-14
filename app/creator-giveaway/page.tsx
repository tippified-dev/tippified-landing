import type { Metadata } from "next";
import CreatorGiveawayPage from "./CreatorGiveawayPage";

export const metadata: Metadata = {
  title: "₦50,000 Creator Giveaway in Nigeria | Tippified",

  description:
    "Tippified is giving away ₦50,000 to an eligible content creator. Sign up, discover creator monetization in Nigeria, and participate in the giveaway. Terms and conditions apply.",

  alternates: {
    canonical: "https://tippified.com/creator-giveaway",
  },

  openGraph: {
    title: "Win ₦50,000 | Tippified Creator Giveaway",
    description:
      "Are you a content creator in Nigeria? Join Tippified's ₦50,000 creator giveaway. Sign up and explore new ways to earn from your audience. Terms and conditions apply.",
    url: "https://tippified.com/creator-giveaway",
    siteName: "Tippified",
    type: "website",
    images: [
      {
        url: "https://tippified.com/creator-giveaway-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Tippified ₦50,000 Content Creator Giveaway",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Win ₦50,000 | Tippified Creator Giveaway",
    description:
      "Join Tippified's ₦50,000 content creator giveaway. Sign up and explore new ways to monetize your creativity. Terms and conditions apply.",
    images: ["https://tippified.com/creator-giveaway-banner2.jpeg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <CreatorGiveawayPage />;
}
