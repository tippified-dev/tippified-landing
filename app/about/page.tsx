import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Tippified | Nigerian Creator Tipping Platform",
  description:
    "Tippified is a Nigerian tipping platform that enables creators to receive financial support from fans worldwide. Payments are processed via Paystack and creator wallets are provided by OPay. A product of Grundex Limited.",
  keywords: [
    "Tippified",
    "Nigerian creators",
    "creator tipping platform",
    "Paystack",
    "OPay",
    "fan support platform",
    "Grundex Limited",
  ],
  openGraph: {
    title: "About Tippified",
    description:
      "Tippified helps Nigerian creators receive tips from fans worldwide using Paystack and OPay wallets.",
    url: "https://tippified.com/about",
    siteName: "Tippified",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-800 px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-purple-700">
          About Tippified
        </h1>

        <p className="text-lg mb-6">
          <span className="font-semibold text-purple-600">Tippified</span> is a
          Nigerian-built digital tipping platform designed to help content
          creators, influencers, writers, musicians, educators, and other
          digital professionals receive financial support directly from their
          fans and supporters.
        </p>

        <p className="mb-6">
          Tippified provides creators with a unique tipping link that can be
          shared across social media platforms, websites, and messaging apps.
          Supporters can send tips from anywhere in the world using secure and
          trusted payment methods, while creators receive their funds directly
          into their wallets.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Secure Payments & Wallet Infrastructure
        </h2>

        <p className="mb-6">
          All payments on Tippified are processed through{" "}
          <span className="font-semibold">Paystack</span>, a leading licensed
          payment gateway in Nigeria, enabling supporters to pay using cards,
          bank transfers, and other supported methods.
        </p>

        <p className="mb-6">
          Creator wallets on Tippified are provided by{" "}
          <span className="font-semibold">OPay</span>. Funds are settled directly
          into creators’ OPay wallets, giving them fast access to their earnings
          and the flexibility to transfer or use their funds within the OPay
          ecosystem or their preferred bank accounts.
        </p>

        <p className="mb-6">
          Tippified does not operate as a bank and does not hold customer funds.
          All transactions are handled by our licensed payment and wallet
          partners to ensure transparency, compliance, and security.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Our Mission
        </h2>

        <p className="mb-6">
          Our mission is to empower Nigerian creators with reliable financial
          tools that make it easy to monetize their audience, receive support
          from fans globally, and grow sustainable digital careers.
        </p>

        <p className="mb-6">
          We aim to strengthen the Nigerian creator economy by providing
          infrastructure that is simple to use, compliant with local
          regulations, and trusted by both creators and supporters.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Company Information
        </h2>

        <p className="mb-3">
          Tippified is a product of{" "}
          <span className="font-semibold">Grundex Limited</span>, a Nigerian
          registered company.
        </p>

        <p className="mb-6">
          Grundex Limited is registered with the Corporate Affairs Commission
          (CAC), Nigeria. You can verify our registration here:{" "}
          <Link
            href="https://search.cac.gov.ng/home"
            target="_blank"
            className="text-purple-600 underline font-medium"
          >
            CAC Business Registry
          </Link>
          .
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Why Trust Tippified
        </h2>

        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Payments processed by Paystack</li>
          <li>Creator wallets powered by OPay</li>
          <li>No storage or custody of user funds by Tippified</li>
          <li>Built specifically for Nigerian creators</li>
          <li>Transparent and secure transaction flow</li>
        </ul>

        <p className="mt-10 text-sm text-gray-500">
          © {new Date().getFullYear()} Tippified. All rights reserved. Tippified
          is a product of Grundex Limited.
        </p>
      </div>
    </main>
  );
}