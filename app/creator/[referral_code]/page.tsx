import VerifiedBadge from "@/app/components/VerifiedBadge";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiGift,
  FiMapPin,
  FiStar,
  FiTag,
  FiUser,
  FiZap,
} from "react-icons/fi";

interface Creator {
  username: string;
  referral_code: string;
  location: string;
  bvn_verified: boolean;
  hero_badge: boolean;
  is_online: boolean;
  is_birthday_today: boolean;

  bio: string | null;
  niche: string | null;
  niche_display: string | null;
  date_joined: string | null;
}

interface Props {
  params: Promise<{
    referral_code: string;
  }>;
}

async function getCreator(referralCode: string): Promise<Creator | null> {
  try {
    const res = await fetch(
      `https://api.tippified.com/api/auth/creators/seo/${encodeURIComponent(
        referralCode,
      )}/`,
      {
        next: {
          revalidate: 60,
        },
      },
    );

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error("Failed to fetch creator");
    }

    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { referral_code } = await params;

  const creator = await getCreator(referral_code);

  if (!creator) {
    return {
      title: "Creator Not Found | Tippified",
      description: "This creator could not be found on Tippified.",
    };
  }

  const niche = creator.niche_display || "Content Creator";

  const title = `${creator.username} | ${niche} | Tippified`;

  const description =
    creator.bio?.trim() ||
    `Discover ${creator.username}, a ${niche.toLowerCase()} on Tippified. ` +
      `Support their work with tips, gifts and exclusive creator content.`;

  const canonicalUrl = `https://tippified.com/creator/${creator.referral_code}`;

  return {
    title,
    description: description.slice(0, 160),

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description: description.slice(0, 200),
      url: canonicalUrl,
      siteName: "Tippified",
      type: "profile",
    },

    twitter: {
      card: "summary",
      title,
      description: description.slice(0, 200),
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CreatorPage({ params }: Props) {
  const { referral_code } = await params;

  const creator = await getCreator(referral_code);

  if (!creator) {
    notFound();
  }

  const tippingUrl = `https://app.tippified.com/tip/${creator.referral_code}`;

  const canonicalUrl = `https://tippified.com/creator/${creator.referral_code}`;

  const niche = creator.niche_display || "Content Creator";

  const bio =
    creator.bio?.trim() ||
    `I am a creator on Tippified, I create quality content and available for tips and support. You can watch my paid content if available as this will encourage me to keep creating.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: creator.username,
    url: canonicalUrl,
    description: bio,
    jobTitle: niche,
    homeLocation: {
      "@type": "Place",
      name: creator.location,
    },
  };

  return (
    <main className="min-h-screen bg-[#fcfbff]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back */}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors mb-10"
        >
          <FiArrowLeft size={16} />
          Back to Explore
        </Link>

        {/* Profile */}
        <section className="bg-white rounded-4xl border border-purple-100 shadow-[0_20px_60px_-25px_rgba(124,58,237,0.2)] p-8 sm:p-10">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="h-24 w-24 rounded-4xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <FiUser size={42} strokeWidth={1.7} />
            </div>

            {/* Name */}
            <div className="mt-6 flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-purple-950">
                {creator.username}
              </h1>

              {creator.bvn_verified && <VerifiedBadge />}
            </div>

            {/* Niche */}
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-100 px-3.5 py-1.5 text-[12px] font-bold text-purple-700">
                <FiTag size={12} />
                {niche}
              </span>
            </div>

            {/* Bio */}
            <div className="mt-6 max-w-2xl">
              <p className="text-[15px] leading-7 text-gray-600">{bio}</p>
            </div>

            {/* Information */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {/* Location */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f8f5ff] border border-purple-100 text-[11px] font-semibold text-purple-700">
                <FiMapPin size={12} />
                {creator.location}
              </span>

              {/* Hero */}
              {creator.hero_badge && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-linear-to-r from-amber-400 to-orange-400 text-white text-[11px] font-bold">
                  <FiStar size={12} />
                  Hero Creator
                </span>
              )}

              {/* Online */}
              {creator.is_online ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-[11px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Online
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-700 text-[11px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                  Offline
                </span>
              )}

              {/* Birthday */}
              {creator.is_birthday_today && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-700 text-[11px] font-bold">
                  <FiGift size={12} />
                  Birthday Today
                </span>
              )}
            </div>

            {/* CTA */}
            <Link
              href={tippingUrl}
              className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-purple-700 text-white text-sm font-bold hover:bg-purple-800 transition-colors shadow-lg"
            >
              <FiZap size={16} />
              Support {creator.username}
            </Link>
          </div>
        </section>

        {/* Creator-specific SEO content */}
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-purple-950">
            {creator.username} — {niche}
          </h2>

          <p className="mt-4 text-[15px] leading-8 text-gray-600">
            {creator.username} is a {niche.toLowerCase()} based in{" "}
            {creator.location}. {creator.username} uses Tippified to connect
            with fans and receive direct support for their creative work.
          </p>

          <p className="mt-4 text-[15px] leading-8 text-gray-600">
            Fans can support {creator.username} by sending a tip or gift
            directly through Tippified. Where available, fans can also access
            exclusive paid content created by {creator.username}.
          </p>

          {/* Creator Bio */}
          <div className="mt-8 rounded-3xl border border-purple-100 bg-white p-6 sm:p-7">
            <h3 className="text-lg font-extrabold text-purple-950">
              About {creator.username}
            </h3>

            <p className="mt-3 text-[14px] leading-7 text-gray-600">{bio}</p>
          </div>

          {/* Explore more */}
          <div className="mt-8 rounded-3xl bg-[#f8f5ff] border border-purple-100 p-6">
            <h3 className="text-lg font-extrabold text-purple-950">
              Discover more Nigerian creators
            </h3>

            <p className="mt-2 text-[14px] leading-7 text-gray-600">
              Explore creators on Tippified across different niches including{" "}
              music, comedy, fashion, beauty, lifestyle, sports, technology,
              business and more.
            </p>

            <Link
              href="/explore"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800"
            >
              Explore creators
              <FiArrowLeft className="rotate-180" size={15} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
