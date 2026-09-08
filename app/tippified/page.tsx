import { Metadata } from "next";
import Script from "next/script";
import TippifiedArticleContent from "./TippifiedArticleContent";

export const metadata: Metadata = {
  title: "What Is Tippified? | Nigeria&apos;s Creator Tipping Platform",
  description:
    "Learn what Tippified is, how Tippified works, and how Nigerian creators can receive tips, create goals, share their creator pages, and connect with fans.",
  keywords: [
    "Tippified",
    "What is Tippified",
    "Tippified Nigeria",
    "Tippified tipping platform",
    "Tippified creator platform",
    "creator tipping platform Nigeria",
    "tip creators in Africa",
    "support creators in Nigeria",
    "Tippified.com",
    "tippified",
  ],
  alternates: {
    canonical: "https://www.tippified.com/tippified",
  },
  openGraph: {
    title: "What Is Tippified? | Africa&apos;s Creator Tipping Platform",
    description:
      "Learn what Tippified is, how it works, and how creators can receive direct support from their fans.",
    url: "https://www.tippified.com/tippified",
    siteName: "Tippified",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "What Is Tippified? | Africa&apos;s Creator Tipping Platform",
    description:
      "Learn what Tippified is, how it works, and how creators can receive direct support from their fans.",
  },
};

export default function TippifiedArticlePage() {
  return (
    <>
      <Script id="tippified-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",

          headline:
            "What Is Tippified? How Tippified Works for Creators and Fans",

          description:
            "Learn what Tippified is, how Tippified works, and how creators can receive tips, create goals, and connect with fans.",

          url: "https://www.tippified.com/tippified",

          author: {
            "@type": "Organization",
            name: "Grundex Limited",
            url: "https://www.tippified.com",
          },

          publisher: {
            "@type": "Organization",
            name: "Tippified",
            url: "https://www.tippified.com",
            logo: {
              "@type": "ImageObject",
              url: "https://www.tippified.com/logo.png",
            },
          },

          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://www.tippified.com/tippified",
          },

          datePublished: "2026-09-01",
          dateModified: "2026-09-07",

          inLanguage: "en-NG",

          about: {
            "@type": "Thing",
            name: "Creator monetization",
          },

          keywords: [
            "Tippified",
            "creator tipping",
            "tipping platform",
            "Nigeria creators",
            "creator monetization",
          ],
        })}
      </Script>

      <main className="max-w-4xl mx-auto px-6 py-20 text-gray-800 leading-relaxed">
        <TippifiedArticleContent />
      </main>
    </>
  );
}
