

import { Metadata } from "next";
import Link from "next/link";
import NavBar from "../components/NavBar";
import ReturnToCreatorButton from "../components/ReturnToCreatorButton";

export const metadata: Metadata = {
  title: "About Tippified | Nigerian Creator Tipping Platform",
  description:
     "Tippified is Nigeria's all-in-one creator monetization platform where fans can send monetary tips, virtual gifts, support creator goals, fulfil wishlists, and participate in live streaming. Payments are securely processed by Paystack while settlements are handled through Wema Bank. A product of Grundex Limited.",
  keywords: [
    "Tippified",
    "tippified",
    "tips",
    "Nigerian influencers",
    "fans support",
    "No 1 tipping in Nigeria",
    "content creators in Nigeria",
    "Nigerian creators",
    "creator tipping platform",
    "Paystack",
    "Wema bank",
    "fan support platform",
    "Grundex Limited",
    "Support creators",
    "Virtual gifts",
    "Nigerian celebrities",
    "Crowd funding",
    "Nigerian contents",
    "tippified",
    "tips",
    "support goals",
  ],
  openGraph: {
    title: "About Tippified",
    description:
       "Nigeria's creator monetization platform where fans send tips, virtual gifts, support goals, fulfil wishlists and participate in live streams. Payments powered by Paystack. Settlements handled through Wema Bank.",
    url: "https://tippified.com/about",
    siteName: "Tippified",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
    <NavBar/>

    <main className="bg-white text-gray-800 px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <ReturnToCreatorButton/>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-purple-700">
          About Tippified
        </h1>

          <p className="text-lg mb-6">
  <span className="font-semibold text-purple-600">Tippified</span> is
  Nigeria&apos;s all-in-one creator monetization platform built to help
  content creators, influencers, musicians, artists, educators, gamers,
  public figures, streamers, writers and digital entrepreneurs earn money
  directly from their supporters.
</p>

<p className="mb-6">
  Rather than relying solely on advertising revenue or brand sponsorships,
  creators can receive direct financial support from their fans through
  multiple monetization tools available on Tippified.
</p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          Platform Infrastructure & Secure Payments
        </h2>

           <p className="mb-6">
  Every payment on Tippified is securely processed through Paystack,
  Nigeria&apos;s leading payment infrastructure provider, supporting cards,
  bank transfers, USSD and other supported payment methods.
 </p>

 <p className="mb-6">
  Creator balances are maintained securely within Tippified&apos;s internal
  ledger while settlement and payout services are provided through our
  regulated banking partner, Wema Bank.
 </p>

 <p className="mb-6">
  Tippified is not a bank, does not accept deposits and does not operate as
  a financial institution. We simply provide the technology that connects
  fans and creators while licensed financial institutions handle payment
  processing and settlement.
 </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">
Platform Features
</h2>

<p className="mb-6">
Tippified brings together multiple creator monetization features inside one
platform.
</p>

  <p className="mb-6">
While Tippified offers multiple monetization tools, creators enjoy all of
them from one creator dashboard, making it easy to earn, engage supporters,
and grow their community.
</p>

<p className="mb-6">
Tippified allows creators to:
</p>

<ul className="list-disc list-inside space-y-2 mb-6">
  <li>Receive direct monetary tips from fans.</li>
  <li>Receive beautiful virtual gifts from supporters.</li>
  <li>Create fundraising goals for projects, businesses or personal causes.</li>
  <li>Create wishlists that fans can fulfil during birthdays and special occasions.</li>
  <li>Host interactive live streaming sessions.</li>
  <li>Receive tips and virtual gifts during live broadcasts.</li>
  <li>Withdraw their earnings to their verified Nigerian bank account whenever they choose.</li>
</ul>

<p className="mb-6">
Every creator receives a unique Tippified profile and personal tipping link
that can be shared across Instagram, TikTok, YouTube, Facebook, X (Twitter),
WhatsApp, websites, blogs and every other online platform where supporters
can easily discover and support them.
</p>

<div className="grid md:grid-cols-2 gap-4 mb-8">

<div className="border rounded-lg p-5">
<h3 className="font-semibold text-lg mb-2">Monetary Tips</h3>
<p>
Fans can instantly support creators by sending direct monetary tips from
anywhere in the world.
</p>
</div>

<div className="border rounded-lg p-5">
<h3 className="font-semibold text-lg mb-2"> Virtual Gifts</h3>
<p>
Fans can purchase virtual gifts and send them to creators as appreciation,
celebration or encouragement.
</p>
</div>

<div className="border rounded-lg p-5">
<h3 className="font-semibold text-lg mb-2"> Creator Goals</h3>
<p>
Creators can launch fundraising goals for projects, equipment,
productions, education, charity or personal milestones.
</p>
</div>

<div className="border rounded-lg p-5">
<h3 className="font-semibold text-lg mb-2"> Wishlists</h3>
<p>
Creators can publish wishlists and allow fans to fulfil birthdays,
anniversaries and other special occasions.
</p>
</div>

<div className="border rounded-lg p-5">
<h3 className="font-semibold text-lg mb-2">Live Streaming</h3>
<p>
Creators can broadcast live while fans watch, interact, send monetary tips
and deliver virtual gifts in real time.
</p>
</div>

<div className="border rounded-lg p-5">
<h3 className="font-semibold text-lg mb-2">Fan Wallets</h3>
<p>
Fans can preload their Tip Wallet and Gift Wallet for instant gifting and
tipping during live streams without payment interruptions.
</p>
</div>

</div>

   <h2 className="text-2xl font-semibold mt-10 mb-4">
Fan Wallets
</h2>

<p className="mb-6">
Fans can create secure Tip Wallets and Gift Wallets using only their name
and email address.
</p>

<p className="mb-6">
These wallets allow supporters to preload funds, purchase virtual gifts in
advance and instantly support creators during live streams without leaving
the broadcast or completing repeated payment checkouts.
</p>

<p className="mb-6">
Purchased virtual gifts remain securely stored inside the fan&apos;s Gift
Wallet until they choose to send them to any creator on Tippified.
Likewise, funds loaded into a Tip Wallet remain available until the fan
decides to support a creator.
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
            href="https://icrp.cac.gov.ng/public-search"
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
<li>Payments securely processed by Paystack.</li>
<li>Settlements handled through Wema Bank.</li>
<li>No custody of customer deposits.</li>
<li>Real-time creator balances.</li>
<li>Secure fan Tip Wallets.</li>
<li>Secure fan Gift Wallets.</li>
<li>Virtual gifting.</li>
<li>Live streaming monetization.</li>
<li>Creator goals and crowdfunding.</li>
<li>Wishlist fulfilment.</li>
<li>Built specifically for Africa&apos; creator economy.</li>
</ul>

        <footer className="py-10 mt-16 border-t text-center">

<p className="font-semibold text-lg text-purple-700">
Tippified
</p>

<p className="text-gray-600 mt-2 max-w-2xl mx-auto">
Nigeria&apos; all-in-one creator monetization platform where fans support
creators through monetary tips, virtual gifts, creator goals, wishlists
and live streaming.
</p>

<p className="text-sm text-gray-500 mt-5">
Payments securely powered by Paystack.
Settlement services provided through our regulated banking partner,
Wema Bank.
</p>

<p className="text-sm text-gray-500 mt-3">
© {new Date().getFullYear()} Tippified. A product of Grundex Limited.
All Rights Reserved.
</p>

</footer>
      </div>
    </main>
    </>
  );
}