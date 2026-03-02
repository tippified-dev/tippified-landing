"use client";

import Link from "next/link";

export default function TippifiedArticleContent() {
  return (
    <article>
      <h1 className="text-4xl font-bold text-purple-700 mb-6">
        Tippified – The Nigerian Tipping Platform for Creators
      </h1>

      <p className="mb-5">
        <strong>Tippified</strong> is a Nigerian digital tipping platform that allows fans to financially support their favorite creators. 
        With <strong>Tippified</strong>, creators can receive tips for their content while fans can contribute easily using secure payment methods.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">What is Tippified Used For?</h2>
      <p className="mb-4">
        <strong>Tippified</strong> is used by musicians, social media influencers, skit makers, podcasters, dancers, and other content creators who want a simple way to receive support from fans.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">How Does Tippified Work?</h2>
      <ul className="list-disc pl-6 mb-5">
        <li>Creators sign up on <strong>Tippified</strong> and create a goal.</li>
        <li>They share their Tippified link with fans.</li>
        <li>Fans open the link and tip using Paystack.</li>
        <li>Funds go to the creator’s OPay wallet.</li>
      </ul>

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
          Find Creators on Tippified
        </Link>
      </div>
    </article>
  );
}