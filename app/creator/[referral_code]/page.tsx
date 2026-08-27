import VerifiedBadge from "@/app/components/VerifiedBadge";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiCalendar,
  FiGift,
  FiLock,
  FiMapPin,
  FiPlay,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiUser,
  FiVideo,
  FiZap,
} from "react-icons/fi";

interface Creator {
  username: string;
  referral_code: string;
  location: string;
  bio: string;
  niche: string;
  bvn_verified: boolean;
  hero_badge: boolean;
  is_online: boolean;
  is_birthday_today: boolean;
  wishlist_active: boolean;
}

interface PaidContent {
  id: number;
  title: string;
  content_type: "image" | "video";
  file_size: number | null;
  price: string;
  currency: string;
  expires_at: string;
  uploaded_at: string;
  duration_seconds: number | null;
  purchase_count: number;
  is_active: boolean;
  is_expired: boolean;
  thumbnail_url: string | null;
}

interface CreatorGoal {
  title: string;
  target_amount: string;
  current_amount: string;
  current_foreign_usd: string;
  about: string | null;
  is_active: boolean;
  created_at: string;
  progress_percent: number;
}

interface Props {
  params: Promise<{
    referral_code: string;
  }>;
}

const NICHE_LABELS: Record<string, string> = {
  content_creator: "Content Creator",
  music: "Music",
  comedy: "Comedy",
  fashion: "Fashion",
  beauty_style: "Beauty & Style",
  memes: "Memes",
  film_tv: "Film & TV",
  lifestyle: "Lifestyle",
  food_cooking: "Food & Cooking",
  fitness_wellness: "Fitness & Wellness",
  sports: "Sports",
  gaming: "Gaming",
  technology: "Technology",
  education: "Education",
  business_finance: "Business & Finance",
  real_estate: "Real Estate",
  dance: "Dance",
  hot_topics: "Hot Topics",
  artificial_intelligence: "Artificial Intelligence",
  news_gossips: "News & Gossips",
  cars: "Cars",
  forex: "Forex",
  events: "Events",
  social_media: "Social Media",
  art_design: "Art & Design",
  photography: "Photography",
  writing_literature: "Writing & Literature",
  podcasting: "Podcasting",
  travel: "Travel",
  faith_inspiration: "Faith & Inspiration",
  Adult_content: "Adult Content",
  other: "Other",
};

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

async function getCreatorContent(referralCode: string): Promise<PaidContent[]> {
  try {
    const res = await fetch(
      `https://api.tippified.com/api/auth/creator_fan/${encodeURIComponent(
        referralCode,
      )}/paid-content/`,
      {
        next: {
          revalidate: 60,
        },
      },
    );

    if (!res.ok) {
      return [];
    }

    const data: PaidContent[] = await res.json();

    return data ?? [];
  } catch {
    return [];
  }
}

async function getCreatorGoal(
  referralCode: string,
): Promise<CreatorGoal | null> {
  try {
    const res = await fetch(
      `https://api.tippified.com/api/auth/active-goal/${encodeURIComponent(
        referralCode,
      )}/`,
      {
        next: {
          revalidate: 60,
        },
      },
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data.active_goal ?? null;
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

  const nicheLabel = NICHE_LABELS[creator.niche] || creator.niche;
  const title = `${creator.username} | ${nicheLabel} | Tippified`;

  const description =
    creator.bio ||
    `Discover ${creator.username} on Tippified. Support this creator with tips, gifts and exclusive content.`;

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

  const nicheLabel = NICHE_LABELS[creator.niche] || creator.niche;

  const [paidContents, goal] = await Promise.all([
    getCreatorContent(referral_code),
    getCreatorGoal(referral_code),
  ]);

  const availableContent = paidContents.slice(0, 4);

  const tippingUrl = `https://app.tippified.com/tip/${creator.referral_code}`;

  const canonicalUrl = `https://tippified.com/creator/${creator.referral_code}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: creator.username,
    description: creator.bio,
    url: canonicalUrl,
    jobTitle: nicheLabel,
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

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Back */}
        <Link
          href="/explore"
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 transition-colors hover:text-purple-800"
        >
          <FiArrowLeft size={16} />
          Back to Explore
        </Link>

        {/* Profile */}
        <section className="rounded-4xl border border-purple-100 bg-white p-8 shadow-[0_20px_60px_-25px_rgba(124,58,237,0.2)] sm:p-10">
          <div className="flex flex-col items-center text-center">
            {/* Default Person Avatar */}
            <div className="flex h-24 w-24 items-center justify-center rounded-4xl bg-linear-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
              <FiUser size={42} strokeWidth={1.8} />
            </div>

            {/* Name */}
            <div className="mt-6 flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-purple-950 sm:text-4xl">
                {creator.username}
              </h1>

              {creator.bvn_verified && <VerifiedBadge />}
            </div>

            {/* Niche */}
            {creator.niche && (
              <div className="mt-3 inline-flex items-center rounded-full bg-purple-50 px-3.5 py-1.5 text-xs font-bold text-purple-700 ring-1 ring-purple-100">
                {nicheLabel}
              </div>
            )}

            {/* Creator Bio */}
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-gray-600">
              {creator.bio}
            </p>

            {/* Information */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-[#f8f5ff] px-3 py-1.5 text-[11px] font-semibold text-purple-700">
                <FiMapPin size={12} />
                {creator.location}
              </span>

              {creator.hero_badge && (
                <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-400 to-orange-400 px-3 py-1.5 text-[11px] font-bold text-white">
                  <FiStar size={12} />
                  Hero Creator
                </span>
              )}

              {creator.is_online ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-[11px] font-bold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Online
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-[11px] font-bold text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                  Offline
                </span>
              )}

              {creator.is_birthday_today && (
                <span className="inline-flex items-center gap-1 rounded-full border border-pink-100 bg-pink-50 px-3 py-1.5 text-[11px] font-bold text-pink-700">
                  <FiGift size={12} />
                  Birthday Today
                </span>
              )}
            </div>

            {/* CTA */}
            <Link
              href={tippingUrl}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-purple-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-purple-800"
            >
              <FiZap size={16} />
              Support {creator.username}
            </Link>
          </div>
        </section>

        {/* Send a Gift */}

        <section className="mt-8">
          <div className="relative overflow-hidden rounded-[1.8rem] border border-purple-100 bg-white p-6 shadow-[0_12px_35px_-20px_rgba(88,28,174,0.25)]">
            {/* Decorative background */}

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-100/60 blur-2xl" />

            <div className="absolute -bottom-12 -left-10 h-24 w-24 rounded-full bg-pink-100/50 blur-2xl" />

            <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              {/* Text */}

              <div className="max-w-xl">
                <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-purple-50 text-purple-600 ring-1 ring-purple-100">
                    <FiGift size={17} />
                  </span>

                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-500">
                    Show Your Support
                  </span>
                </div>

                <h2 className="text-xl font-extrabold tracking-tight text-purple-950 sm:text-2xl">
                  Send {creator.username} a gift
                </h2>

                <p className="mt-2 text-[13px] leading-6 text-gray-600">
                  Appreciate {creator.username}&apos;s work by sending a gift
                  directly on Tippified. Your support helps creators continue
                  doing what they love.
                </p>
              </div>

              {/* Gift CTA */}

              <Link
                href={tippingUrl}
                aria-label={`Send ${creator.username} a gift on Tippified`}
                className="group mt-5 inline-flex shrink-0 items-center gap-2 rounded-full bg-purple-700 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5 hover:bg-purple-800 hover:shadow-xl sm:mt-0"
              >
                <FiGift
                  size={17}
                  className="transition-transform duration-300 group-hover:rotate-12"
                />
                Send Gift
              </Link>
            </div>
          </div>
        </section>

        {/* Wishlist */}
        {creator.wishlist_active && (
          <section className="mt-8">
            <div className="relative overflow-hidden rounded-[1.8rem] border border-purple-100 bg-white p-6 shadow-[0_12px_35px_-20px_rgba(88,28,174,0.25)]">
              {/* Decorative background */}
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-100/60 blur-2xl" />

              <div className="absolute -bottom-12 -left-10 h-24 w-24 rounded-full bg-pink-100/50 blur-2xl" />

              <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                {/* Text */}
                <div className="max-w-xl">
                  <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-purple-50 text-purple-600 ring-1 ring-purple-100">
                      <FiStar size={17} />
                    </span>

                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-500">
                      Wishlist
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold tracking-tight text-purple-950 sm:text-2xl">
                    This creator has a wishlist
                  </h2>

                  <p className="mt-2 text-[13px] leading-6 text-gray-600">
                    {creator.username} has a wishlist with things they&apos;d
                    love to receive. Check it out and see how you can support
                    them.
                  </p>
                </div>

                {/* Wishlist CTA */}
                <Link
                  href={tippingUrl}
                  aria-label={`Check out ${creator.username}'s wishlist`}
                  className="group mt-5 inline-flex shrink-0 items-center gap-2 rounded-full bg-purple-700 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5 hover:bg-purple-800 hover:shadow-xl sm:mt-0"
                >
                  <FiStar
                    size={17}
                    className="transition-transform duration-300 group-hover:rotate-12"
                  />
                  Check It Out
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Creator Goal */}
        {goal && goal.is_active && (
          <section className="mt-10">
            <div className="relative overflow-hidden rounded-[1.8rem] border border-purple-100 bg-linear-to-br from-[#f8f5ff] to-white p-5 shadow-[0_12px_35px_-20px_rgba(88,28,174,0.3)]">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-100/60 blur-2xl" />

              <div className="relative">
                {/* Goal Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    {/* Label */}
                    <div className="mb-2 flex items-center gap-1.5">
                      <FiTarget size={12} className="text-purple-500" />

                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-500">
                        {creator.username}&apos;s Goal
                      </span>
                    </div>

                    {/* Goal Title */}
                    <h2 className="text-[17px] font-extrabold tracking-tight text-purple-950 sm:text-lg">
                      {goal.title}
                    </h2>
                  </div>

                  {/* Progress */}
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-purple-600 ring-1 ring-purple-100">
                    <FiZap size={10} />
                    {Math.min(Number(goal.progress_percent || 0), 100).toFixed(
                      0,
                    )}
                    %
                  </span>
                </div>
                <p className="relative mt-4 text-[13px] leading-6 text-gray-600">
                  <span className="font-bold text-purple-900">
                    {creator.username} has a goal
                  </span>{" "}
                  that they want you to help achieve. They are counting on your
                  support to make it happen.
                </p>

                {/* Target + Current */}
                <div className="relative mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white p-3.5 ring-1 ring-purple-50">
                    <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-purple-400">
                      <FiTarget size={10} />
                      Goal Target
                    </p>

                    <p className="mt-1.5 text-[14px] font-extrabold text-purple-950">
                      ₦{Number(goal.target_amount || 0).toLocaleString("en-NG")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-3.5 ring-1 ring-purple-50">
                    <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-purple-400">
                      <FiTrendingUp size={10} />
                      Current
                    </p>

                    <p className="mt-1.5 text-[14px] font-extrabold text-purple-950">
                      ₦
                      {Number(goal.current_amount || 0).toLocaleString("en-NG")}
                    </p>
                  </div>
                </div>
                <Link
                  href={tippingUrl}
                  className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-purple-700 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-purple-100 transition-all hover:-translate-y-0.5 hover:bg-purple-800"
                >
                  <FiTarget size={16} />
                  Help {creator.username} Reach This Goal
                </Link>

                {/* Created Date */}
                <p className="relative mt-4 flex items-center justify-end gap-1 text-[10px] font-medium text-purple-400">
                  <FiCalendar size={10} />
                  Created:{" "}
                  {goal.created_at
                    ? new Date(goal.created_at).toLocaleDateString("en-NG")
                    : ""}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Exclusive Content */}
        {availableContent.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8b03e6] text-white">
                  <FiLock size={14} />
                </div>

                <div>
                  <h2 className="text-[15px] font-extrabold tracking-tight text-[#1a1919]">
                    Exclusive Drops
                  </h2>

                  <p className="text-[11px] font-medium text-[#a78bfa]">
                    {paidContents.length} content • From {creator.username}
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-1 rounded-full bg-[#f5f3ff] px-2.5 py-1 text-[10px] font-bold text-[#7c3aed]">
                <FiStar size={10} />
                PREMIUM
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {availableContent.map((content) => (
                <Link
                  key={content.id}
                  href={tippingUrl}
                  className="group overflow-hidden rounded-[1.6rem] border border-[#ede9fe] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-square overflow-hidden bg-[#f5f3ff]">
                    {content.thumbnail_url ? (
                      <Image
                        src={content.thumbnail_url}
                        alt={`${content.title || "Exclusive content"} by ${creator.username}`}
                        className="h-full w-full scale-110 object-cover blur-[5px] transition-transform duration-500 group-hover:scale-115"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-100 to-indigo-100">
                        {content.content_type === "video" ? (
                          <FiVideo size={42} className="text-purple-400" />
                        ) : (
                          <FiLock size={42} className="text-purple-400" />
                        )}
                      </div>
                    )}

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/15" />

                    {/* Lock */}
                    <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                      <FiLock size={14} />
                    </div>

                    {/* Content type */}
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[9px] font-bold text-purple-700 backdrop-blur-sm">
                      {content.content_type === "video" ? (
                        <>
                          <FiPlay size={9} />
                          VIDEO
                        </>
                      ) : (
                        "IMAGE"
                      )}
                    </div>

                    {/* Center play/lock */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                        {content.content_type === "video" ? (
                          <FiPlay size={18} fill="currentColor" />
                        ) : (
                          <FiLock size={17} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content information */}
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-[13px] font-extrabold leading-5 text-gray-900">
                      {content.title || "Exclusive Content"}
                    </h3>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[12px] font-bold text-purple-700">
                        {content.currency}{" "}
                        {Number(content.price).toLocaleString("en-NG")}
                      </span>

                      <span className="rounded-full bg-[#f5f3ff] px-2.5 py-1 text-[10px] font-bold text-purple-600">
                        Unlock
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View all CTA */}
            {paidContents.length > 4 && (
              <Link
                href={tippingUrl}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[#ede9fe] bg-white py-3.5 text-sm font-bold text-[#6d28d9] shadow-sm transition-colors hover:bg-[#f8f5ff]"
              >
                <FiLock size={15} />
                View all exclusive content
              </Link>
            )}
          </section>
        )}

        {/* SEO content */}
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-purple-950">
            Support {creator.username} on Tippified
          </h2>

          <p className="mt-4 text-[15px] leading-8 text-black font-bold">
            {creator.username} is a {nicheLabel.toLowerCase()}{" "}
            {nicheLabel === "Content Creator" ? "" : "creator"} based in{" "}
            {creator.location}.
          </p>

          <p className="mt-4 text-[15px] leading-8 text-gray-600">
            {creator.bio}
          </p>

          <p className="mt-4 text-[15px] leading-8 text-gray-600">
            Fans can support {creator.username} on Tippified by sending tips,
            gifts and accessing exclusive creator content when available.
          </p>

          <p className="mt-4 text-[15px] leading-8 text-gray-600">
            Discover more Nigerian creators on Tippified and find creators whose
            work you enjoy and want to support.
          </p>
        </section>
      </div>
    </main>
  );
}
