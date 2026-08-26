import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiGift, FiMapPin, FiStar, FiZap } from "react-icons/fi";

interface Creator {
  username: string;
  referral_code: string;
  location: string;
  bvn_verified: boolean;
  hero_badge: boolean;
  is_online: boolean;
  is_birthday_today: boolean;
  profile_image_key: string | null;
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

  const title = `${creator.username} | Nigerian Creator | Tippified`;

  const description =
    `Discover ${creator.username} on Tippified. ` +
    `Support this creator with tips and gifts and connect with their community.`;

  const canonicalUrl = `https://tippified.com/creator/${creator.referral_code}`;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Tippified",
      type: "profile",
    },

    twitter: {
      card: "summary",
      title,
      description,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: creator.username,
    url: canonicalUrl,
    jobTitle: "Content Creator",
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
            <div className="h-24 w-24 rounded-4xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg">
              {creator.username.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <div className="mt-6 flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-purple-950">
                {creator.username}
              </h1>

              {creator.bvn_verified && (
                <span
                  className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold"
                  title="Verified creator"
                >
                  ✓
                </span>
              )}
            </div>

            {/* Creator description */}
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-gray-600">
              Discover {creator.username} on Tippified, a platform where fans
              can discover and support creators through tips, gifts and
              exclusive creator experiences.
            </p>

            {/* Information */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f8f5ff] border border-purple-100 text-[11px] font-semibold text-purple-700">
                <FiMapPin size={12} />
                {creator.location}
              </span>

              {creator.hero_badge && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-linear-to-r from-amber-400 to-orange-400 text-white text-[11px] font-bold">
                  <FiStar size={12} />
                  Hero Creator
                </span>
              )}

              {creator.is_online && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-[11px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Online
                </span>
              )}

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

        {/* SEO content */}
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-purple-950">
            Support {creator.username} on Tippified
          </h2>

          <p className="mt-4 text-[15px] leading-8 text-gray-600">
            Tippified gives fans a simple way to support creators they enjoy.
            Visit {creator.username}&apos;s Tippified page to send a tip, send a
            gift and show your support directly.
          </p>

          <p className="mt-4 text-[15px] leading-8 text-gray-600">
            Discover more Nigerian creators on Tippified and find new creators
            whose work you enjoy and want to support.
          </p>
        </section>
      </div>
    </main>
  );
}
