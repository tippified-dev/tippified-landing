"use client";

import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import NavBar from "../components/NavBar";

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
  return (
    <>
      <NavBar />

      {/* Structured Data for SEO */}
      <Script id="tippified-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Tippified – What is Tippified and How It Works",
          "description":
            "Learn what Tippified is, how Tippified works, and why Tippified is Nigeria’s tipping platform for creators.",
          "author": {
            "@type": "Organization",
            "name": "Grundex Limited",
            "url": "https://www.tippified.com"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Tippified",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.tippified.com/logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.tippified.com/tippified"
          },
          "datePublished": new Date().toISOString(),
          "dateModified": new Date().toISOString()
        })}
      </Script>

      <main className="max-w-4xl mx-auto px-6 py-20 text-gray-800 leading-relaxed">
        <article>
          <h1 className="text-4xl font-bold text-purple-700 mb-6">
            Tippified – The Nigerian Tipping Platform for Creators
          </h1>

          <p className="mb-5">
            <strong>Tippified</strong> is a Nigerian digital tipping platform that allows fans to financially support their favorite creators. 
            With <strong>Tippified</strong>, creators can receive tips for their content while fans can contribute easily using secure payment methods.
          </p>

          <p className="mb-5">
            Unlike traditional monetization methods, <strong>Tippified</strong> focuses on direct fan support. This means creators do not have to rely solely on ads or sponsorships to earn income. 
            Instead, fans who enjoy their content can send small or large tips using <strong>Tippified</strong>.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            What is Tippified Used For?
          </h2>

          <p className="mb-4">
            <strong>Tippified</strong> is used by musicians, social media influencers, skit makers, podcasters, dancers, and other content creators who want a simple way to receive support from fans.
          </p>

          <p className="mb-4">
            Fans use <strong>Tippified</strong> to contribute money toward creator goals such as buying equipment, funding projects, or supporting daily creative work.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            How Does Tippified Work?
          </h2>

          <ul className="list-disc pl-6 mb-5">
            <li>Creators sign up on <strong>Tippified</strong> and create a goal.</li>
            <li>They share their Tippified link with fans.</li>
            <li>Fans open the link and tip using Paystack.</li>
            <li>Funds go to the creator’s OPay wallet.</li>
          </ul>

          <p className="mb-5">
            This makes <strong>Tippified</strong> simple, fast, and transparent for both creators and supporters.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            Is Tippified Safe?
          </h2>

          <p className="mb-5">
            Yes. <strong>Tippified</strong> uses Paystack for secure payments and OPay wallets for creator withdrawals. 
            This ensures that all transactions are handled by trusted financial service providers.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            Who Owns Tippified?
          </h2>

          <p className="mb-5">
            <strong>Tippified</strong> is a product of Grundex Limited, a Nigerian registered company. 
            The platform is built to support Nigeria’s growing creator economy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            Where Can I Use Tippified?
          </h2>

          <p className="mb-5">
            <strong>Tippified</strong> can be accessed online at{" "}
            <a href="https://www.tippified.com" className="text-purple-600 underline">
              www.tippified.com
            </a>
            . Creators and fans can use Tippified on mobile or desktop devices.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-3">
            Start Using Tippified
          </h2>

          <p className="mb-6">
            If you are a creator looking for support or a fan who wants to help creators financially, 
            <strong> Tippified</strong> is the right platform for you.
          </p>

          <div className="mt-8 flex gap-4 flex-wrap">
            <Link
              href="/creator/signup"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Create a Tippified Account
            </Link>

            <Link
              href="/search-goals"
              className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition"
            >
              Find Creators on tippified
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}