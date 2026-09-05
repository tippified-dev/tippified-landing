import AdBannerSlider from "@/app/components/AdBannerSlider";
import NativeBannerAd from "@/app/components/NativeBannerAd";
import ProfileImageViewer from "@/app/components/ProfileImageViewer";
import VerifiedBadge from "@/app/components/VerifiedBadge";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiCalendar,
  FiGift,
  FiImage,
  FiLock,
  FiMapPin,
  FiPlay,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiVideo,
  FiZap,
} from "react-icons/fi";

import {
  FaFacebookF,
  FaInstagram,
  FaSnapchat,
  FaThreads,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

interface SocialLink {
  id: number;
  platform: string;
  url: string;
}

interface Creator {
  username: string;
  referral_code: string;
  profile_image_url: string | null;
  location: string;
  bio: string;
  niche: string;
  bvn_verified: boolean;
  hero_badge: boolean;
  is_online: boolean;
  is_birthday_today: boolean;
  wishlist_active: boolean;
  social_links: SocialLink[];
  paid_community: PaidCommunity | null;
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

interface PaidCommunity {
  name: string;
  description: string;
  image_url: string;
  price: string;
  currency: "NGN" | "GHS" | "KES";
  access_token: string;
  is_active: boolean;
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

const TIPPIFIED_PROMOTIONAL_COPY = [
  "Tippified gives fans a simple way to support creators directly through monetary tips and gifts. Creators can share their Tippified page with their audience and receive support from the people who enjoy their work.",

  "With Tippified, creators can turn audience support into real income. Fans can send tips and gifts directly to creators, making it easier to support the people behind the content they enjoy.",

  "Tippified helps creators monetize their audience beyond traditional brand deals. Creators can receive tips, gifts and other forms of support directly from their fans.",

  "Creators on Tippified can give their fans more ways to support them. From sending a simple tip or gift to contributing toward a creator's goal, fans can support creators directly through the platform.",

  "Tippified also gives creators a way to raise money for personal or professional goals. Fans can contribute to an active creator goal and help turn an idea, project or ambition into something real.",

  "Creators can use Tippified to offer paid exclusive content to their audience. Fans can purchase access to eligible creator content while creators earn from the content they choose to make available.",

  "Tippified is built around helping creators earn directly from their communities. Whether through tips, gifts, crowdfunding goals or paid content, creators can choose the ways they want their audience to support them.",

  "When creators receive support through Tippified, their earnings can be settled to their verified payout bank account, giving creators a straightforward way to access the funds generated through their audience.",

  "For fans, supporting a creator on Tippified goes beyond simply following their content. Fans can send monetary tips, give gifts, contribute to creator goals and purchase exclusive content when available.",

  "Tippified brings different creator monetization tools together in one place. Creators can receive tips and gifts, raise funds toward goals and monetize selected exclusive content while building a stronger relationship with their audience.",

  "A creator's audience can be an important part of their journey. Tippified gives fans practical ways to contribute financially, whether they want to send a quick tip, support a specific goal or access exclusive content.",

  "Tippified is designed for creators who want more direct ways to monetize the support they receive from their audience. Fans can choose how they want to support creators, while creators manage their available monetization options from one platform.",
];

const SOCIAL_PLATFORMS = {
  instagram: {
    label: "Instagram",
    icon: FaInstagram,
  },
  twitter: {
    label: "Twitter / X",
    icon: FaXTwitter,
  },
  facebook: {
    label: "Facebook",
    icon: FaFacebookF,
  },
  youtube: {
    label: "YouTube",
    icon: FaYoutube,
  },
  whatsapp: {
    label: "WhatsApp",
    icon: FaWhatsapp,
  },
  snapchat: {
    label: "Snapchat",
    icon: FaSnapchat,
  },
  tiktok: {
    label: "TikTok",
    icon: FaTiktok,
  },
  threads: {
    label: "Threads",
    icon: FaThreads,
  },
} as const;

function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

function getTippifiedCopy(referralCode: string): string {
  let hash = 0;

  for (let i = 0; i < referralCode.length; i++) {
    hash = (hash << 5) - hash + referralCode.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % TIPPIFIED_PROMOTIONAL_COPY.length;

  return TIPPIFIED_PROMOTIONAL_COPY[index];
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

      ...(creator.profile_image_url
        ? {
            images: [
              {
                url: creator.profile_image_url,
                width: 800,
                height: 800,
                alt: `${creator.username} on Tippified`,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: creator.profile_image_url ? "summary_large_image" : "summary",
      title,
      description,

      ...(creator.profile_image_url
        ? {
            images: [creator.profile_image_url],
          }
        : {}),
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

  const tippifiedCopy = getTippifiedCopy(creator.referral_code);

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
    sameAs: creator.social_links?.map((social) => social.url) || [],
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

      <div className="mx-auto max-w-4xl px-6 pb-12 pt-0">
        {/* Sticky Navigation */}
        <div className="sticky top-0 z-50 -mx-6 mb-10 border-b border-purple-100/80 bg-[#fcfbff]/95 px-6 py-3 backdrop-blur-md sm:mx-0 sm:rounded-b-2xl">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            {/* Back to Explore */}
            <Link
              href="/explore"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-purple-600 transition-colors hover:text-purple-800"
            >
              <FiArrowLeft size={16} />
              <span>Back to Explore</span>
            </Link>

            {/* Creator Signup */}
            <Link
              href="https://app.tippified.com/creator/signup"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-purple-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-purple-200 transition-all hover:-translate-y-0.5 hover:bg-purple-800 hover:shadow-lg sm:px-5 sm:text-sm"
            >
              Become a Creator
            </Link>
          </div>
        </div>

        {/* Profile */}
        <section className="rounded-4xl border border-purple-100 bg-white p-8 shadow-[0_20px_60px_-25px_rgba(124,58,237,0.2)] sm:p-10">
          <div className="flex flex-col items-center text-center">
            {/* Premium Profile Image Viewer */}
            <ProfileImageViewer
              imageUrl={creator.profile_image_url}
              username={creator.username}
            />
            {/* Name */}
            <div className="mt-6 flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-purple-950 sm:text-4xl">
                {getFirstName(creator.username)}
              </h1>

              {creator.bvn_verified && <VerifiedBadge />}
            </div>

            {/* Niche */}
            {creator.niche && (
              <div className="mt-3 inline-flex items-center rounded-full bg-purple-50 px-3.5 py-1.5 text-xs font-bold text-purple-700 ring-1 ring-purple-100">
                {nicheLabel}
              </div>
            )}
            <b className="font-bold text-center mt-3 text-sm text-black">
              {creator.username.toUpperCase()}
            </b>

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
              Support {getFirstName(creator.username)}
            </Link>
          </div>
        </section>

        {/* Social Media */}
        {creator.social_links?.length > 0 && (
          <div className="mt-7 w-full border-t border-purple-50 pt-6">
            {/* Social heading */}
            <div className="text-center">
              <h3 className="text-[12px] font-extrabold uppercase tracking-widest text-purple-600">
                Stay connected with {creator.username}
              </h3>

              <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-gray-500">
                Follow them on social media for the latest updates, content and
                happenings.
              </p>
            </div>

            {/* Social icons */}
            <div className="mt-4 flex flex-wrap justify-center gap-2.5">
              {creator.social_links.map((social) => {
                const platform =
                  SOCIAL_PLATFORMS[
                    social.platform as keyof typeof SOCIAL_PLATFORMS
                  ];

                if (!platform) return null;

                const Icon = platform.icon;

                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow ${creator.username} on ${platform.label}`}
                    title={`Follow ${creator.username} on ${platform.label}`}
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-purple-100 bg-[#f8f5ff] text-purple-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-700 hover:text-white hover:shadow-md hover:shadow-purple-100"
                  >
                    <Icon
                      size={16}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        )}

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
                  Send {getFirstName(creator.username)} a gift
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
                    {creator.username} has a wishlist with things they would
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

        {/* WhatsApp Community */}
        {creator.paid_community?.is_active && (
          <section className="mt-8">
            <Link
              href={`/community/${creator.paid_community.access_token}`}
              className="group block"
              aria-label={`Join ${creator.paid_community.name}`}
            >
              <div className="relative overflow-hidden rounded-[1.8rem] border border-purple-100 bg-white shadow-[0_14px_40px_-22px_rgba(88,28,174,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-22px_rgba(88,28,174,0.45)]">
                {/* Banner */}
                <div className="relative aspect-video overflow-hidden bg-purple-100">
                  <Image
                    src={creator.paid_community.image_url}
                    alt={`${creator.paid_community.name} WhatsApp community`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />

                  {/* Premium overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                  {/* WhatsApp badge */}
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white backdrop-blur-md">
                    <FaWhatsapp size={13} />
                    WhatsApp Community
                  </div>

                  {/* Community name on image */}
                  <div className="absolute inset-x-0 bottom-0 px-5 pb-6">
                    <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                      {creator.paid_community.name}
                    </h2>

                    <p className="mt-1.5 text-[11px] font-medium text-white/80 sm:text-xs">
                      Exclusive community by {creator.username}
                    </p>
                  </div>
                </div>

                {/* Information */}
                <div className="p-5 sm:p-6">
                  {creator.paid_community.description && (
                    <p className="line-clamp-2 text-[13px] leading-6 text-gray-600">
                      {creator.paid_community.description}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-4">
                    {/* Price */}
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-purple-400">
                        Community Access
                      </p>

                      <p className="mt-1 text-lg font-extrabold text-purple-950">
                        {creator.paid_community.currency === "NGN"
                          ? "₦"
                          : creator.paid_community.currency === "GHS"
                            ? "GH₵"
                            : "KSh"}
                        {Number(creator.paid_community.price).toLocaleString(
                          "en-NG",
                        )}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="flex shrink-0 items-center gap-2 rounded-full bg-purple-700 px-5 py-3 text-xs font-extrabold text-white shadow-md shadow-purple-200 transition-all group-hover:bg-purple-800 group-hover:shadow-lg">
                      Join Community
                      <FaWhatsapp
                        size={15}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
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
                  Help {getFirstName(creator.username)} Reach This Goal
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
                          <FiImage size={17} />
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
        <NativeBannerAd />
        <AdBannerSlider />

        {/* SEO content */}
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-purple-950">
            Support {getFirstName(creator.username)} on Tippified
          </h2>

          <p className="mt-4 text-[15px] leading-8 text-black font-bold">
            {creator.username} is a {nicheLabel.toLowerCase()}{" "}
            {nicheLabel === "Content Creator" ? "" : "creator"} based in{" "}
            {creator.location}.
          </p>

          <p className="mt-4 text-[15px] leading-8 text-gray-600">
            {tippifiedCopy}
          </p>

          <p className="mt-4 text-[15px] leading-8 text-gray-600">
            Fans can support {creator.username} on Tippified by sending tips,
            gifts and accessing exclusive creator content when available.
          </p>

          <p className="mt-4 text-[15px] leading-8 text-gray-600">
            Discover more {creator.location} creators on Tippified and find
            creators whose work you enjoy and want to support.
          </p>
        </section>
      </div>
    </main>
  );
}
