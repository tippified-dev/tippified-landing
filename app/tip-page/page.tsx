import type { Metadata } from "next";
import AdsterraBanner from "../components/AdsterraBanner";
import TipCreators from "./TipCreators";

export const metadata: Metadata = {
  title: "Tip Creators on Tippified | Support Your Favorite Creators",
  description:
    "Support creators on Tippified by sending them a tip. Discover creators, learn about what they do and support their work directly.",
  keywords: [
    "Tippified",
    "tip creators",
    "tip a creator",
    "support creators",
    "support content creators",
    "send a tip",
    "creator tips",
    "Tippified tip",
    "tip creators in Nigeria",
    "support Nigerian creators",
    "Tippified creators",
  ],
  alternates: {
    canonical: "https://www.tippified.com/tip-page",
  },
  openGraph: {
    title: "Tip Creators on Tippified | Support Your Favorite Creators",
    description:
      "Discover creators on Tippified and support them directly with a tip.",
    url: "https://www.tippified.com/tip-page",
    siteName: "Tippified",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tip Creators on Tippified",
    description:
      "Discover creators on Tippified and support their work directly.",
  },
};

export default function TipPage() {
  return (
    <main className="min-h-screen bg-[#fcfbff]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        {/* SEO CONTENT */}
        <header className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white px-4 py-2 shadow-sm">
            <span
              className="h-2 w-2 rounded-full bg-green-500"
              aria-hidden="true"
            />

            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-purple-600">
              Support Creators on Tippified
            </span>
          </div>
          <AdsterraBanner />

          <h1 className="text-4xl font-extrabold tracking-tight text-purple-950 sm:text-5xl">
            Tip a creator on Tippified
          </h1>

          <p className="mt-5 text-[15px] leading-7 text-gray-600 sm:text-base">
            Discover creators on Tippified and support the people behind the
            content you enjoy. Choose a creator, enter your details and send a
            tip directly through Tippified.
          </p>
        </header>

        <section
          className="mx-auto mt-10 max-w-2xl"
          aria-labelledby="tip-creators-heading"
        >
          <TipCreators />
        </section>

        {/* Additional SEO CONTENT */}
        <section className="mx-auto mt-16 max-w-3xl border-t border-purple-100 pt-10">
          <h2 className="text-2xl font-extrabold text-purple-950">
            Support creators you love
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-600">
            A tip is a simple way to show appreciation for a creator&apos;s
            work. Whether you enjoy comedy, music, fashion, education, fitness,
            lifestyle, gaming, technology or other forms of content, Tippified
            makes it easy to support creators directly.
          </p>

          <h2 className="mt-8 text-2xl font-extrabold text-purple-950">
            How tipping works
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-600">
            Choose a creator from the list below, enter your name and email,
            select the amount you want to send and continue to payment. Your
            payment is securely processed.
          </p>
        </section>
      </div>
    </main>
  );
}
