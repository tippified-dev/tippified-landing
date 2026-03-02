import { Metadata } from "next";
 

import Script from "next/script";

export const metadata: Metadata = {
  title: "Tippified – What is Tippified and How It Works",
  description:
    "Learn what Tippified is, how Tippified works, and why Tippified is Nigeria’s tipping platform for creators. Support creators easily with Tippified using Paystack and OPay.",
  keywords: [
    "Tippified",
    "What is Tippified",
    "Tippified Nigeria",
    "Tippified tipping platform",
    "Tip creators in Nigeria",
    "Support creators with Tippified",
    "Tippified.com",
  ],
  alternates: {
    canonical: "https://www.tippified.com/tippified",
  },
};

export default function TippifiedArticlePage() {
  const now = new Date().toISOString();

  return (
    <>
      {/* Client-side NavBar */}
     

      {/* Structured Data for SEO */}
      <Script id="tippified-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Tippified – What is Tippified and How It Works",
          description:
            "Learn what Tippified is, how Tippified works, and why Tippified is Nigeria’s tipping platform for creators.",
          author: {
            "@type": "Organization",
            name: "Grundex Limited",
            url: "https://www.tippified.com",
          },
          publisher: {
            "@type": "Organization",
            name: "Tippified",
            logo: {
              "@type": "ImageObject",
              url: "https://www.tippified.com/logo.png",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://www.tippified.com/tippified",
          },
          datePublished: now,
          dateModified: now,
        })}
      </Script>

      {/* Page Content */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-gray-800 leading-relaxed">
        <TippifiedArticleContent />
      </main>
    </>
  );
}

// Client Component for the interactive content
import TippifiedArticleContent from "./TippifiedArticleContent";
