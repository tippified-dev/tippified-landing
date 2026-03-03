import type { Metadata } from "next";
import SearchGoalsClient from "./SearchGoalsClient";

export const metadata: Metadata = {
  title: "Support Nigerian Creators | Tip a Creator in Nigeria – Tippified",
  description:
    "Support Nigerian creators by tipping them directly. Discover creator goals and contribute securely. Tippified makes tipping in Nigeria simple and fast.",
  keywords: [
    "support Nigerian creators",
    "tippified",
    "tip my creator",
    "content creators",
    "content-creators",
    "tip a creator",
    "Nigeria tips",
    "tipping in Nigeria",
    "creator support",
    "support a creator",
    "Nigerian creators",
    "send tips in Nigeria",
  ],
  openGraph: {
    title: "Support Nigerian Creators | Tippified",
    description:
      "Find Nigerian creators and support their goals with secure tipping. Built for the Nigerian creator economy.",
    url: "https://tippified.com/search-goals",
    siteName: "Tippified",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Support Nigerian Creators | Tippified",
    description:
      "Tip Nigerian creators and support their goals using Tippified.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SearchGoalsPage() {
  return <SearchGoalsClient />;
}