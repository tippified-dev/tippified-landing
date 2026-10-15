import AdBannerSlider from "@/app/components/AdBannerSlider";
import GemBanner from "@/app/components/GemBanner";
import ProfileImageViewer from "@/app/components/ProfileImageViewer";
import VerifiedBadge from "@/app/components/VerifiedBadge";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiCalendar,
  FiGift,
  FiLock,
  FiMapPin,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiVideo,
  FiZap,
} from "react-icons/fi";

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
  params: Promise<{ referral_code: string }>;
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
  instagram: { label: "Instagram", icon: FaInstagram },
  twitter: { label: "Twitter / X", icon: FaXTwitter },
  facebook: { label: "Facebook", icon: FaFacebookF },
  youtube: { label: "YouTube", icon: FaYoutube },
  whatsapp: { label: "WhatsApp", icon: FaWhatsapp },
  snapchat: { label: "Snapchat", icon: FaSnapchat },
  tiktok: { label: "TikTok", icon: FaTiktok },
  threads: { label: "Threads", icon: FaThreads },
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
      `https://api.tippified.com/api/auth/creators/seo/${encodeURIComponent(referralCode)}/`,
      { next: { revalidate: 60 } },
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch creator");
    return await res.json();
  } catch {
    return null;
  }
}
async function getCreatorContent(referralCode: string): Promise<PaidContent[]> {
  try {
    const res = await fetch(
      `https://api.tippified.com/api/auth/creator_fan/${encodeURIComponent(referralCode)}/paid-content/`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
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
      `https://api.tippified.com/api/auth/active-goal/${encodeURIComponent(referralCode)}/`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.active_goal ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { referral_code } = await params;
  const creator = await getCreator(referral_code);
  if (!creator)
    return {
      title: "Creator Not Found | Tippified",
      description: "This creator could not be found on Tippified.",
    };
  const nicheLabel = NICHE_LABELS[creator.niche] || creator.niche;
  const title = `${creator.username} | ${nicheLabel} | Tippified`;
  const description =
    creator.bio ||
    `Discover ${creator.username} on Tippified. Support this creator with tips, gifts and exclusive content.`;
  const canonicalUrl = `https://www.tippified.com/creator/${creator.referral_code}`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
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
        ? { images: [creator.profile_image_url] }
        : {}),
    },
    robots: { index: true, follow: true },
  };
}

export default async function CreatorPage({ params }: Props) {
  const { referral_code } = await params;
  const creator = await getCreator(referral_code);
  if (!creator) notFound();

  const nicheLabel = NICHE_LABELS[creator.niche] || creator.niche;
  const tippifiedCopy = getTippifiedCopy(creator.referral_code);
  const [paidContents, goal] = await Promise.all([
    getCreatorContent(referral_code),
    getCreatorGoal(referral_code),
  ]);
  const availableContent = paidContents.slice(0, 4);
  const tippingUrl = `https://app.tippified.com/tip/${creator.referral_code}`;
  const canonicalUrl = `https://www.tippified.com/creator/${creator.referral_code}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: creator.username,
    description: creator.bio,
    url: canonicalUrl,
    jobTitle: nicheLabel,
    sameAs: creator.social_links?.map((s) => s.url) || [],
    homeLocation: { "@type": "Place", name: creator.location },
  };

  return (
    <main className="relative min-h-screen bg-[#fcfbff] text-[#211536]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative mx-auto max-w-300 px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        {/* NAV */}
        <div className="sticky top-0 z-50 flex justify-center">
          <div className="flex w-full max-w-225 items-center justify-between rounded-full border border-purple-100 bg-white/90 px-2 py-2 shadow-[0_12px_32px_-16px_rgba(124,58,237,0.3)] backdrop-blur-2xl">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-full bg-[#f5f3ff] px-4 py-2.5 text-xs font-bold text-purple-700 ring-1 ring-purple-100 transition hover:bg-purple-700 hover:text-white"
            >
              <FiArrowLeft size={14} /> Back
            </Link>
            <div className="hidden items-center gap-2 text-[11px] font-semibold text-purple-700/60 sm:flex">
              <span
                className={`h-2 w-2 rounded-full ${creator.is_online ? "bg-green-500" : "bg-zinc-300"}`}
              />
              {creator.location} • {creator.is_online ? "Online" : "Offline"}
            </div>
            <Link
              href="https://app.tippified.com/creator/signup"
              className="rounded-full bg-purple-700 px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-purple-800"
            >
              Become a Creator
            </Link>
          </div>
        </div>

        {/* PREMIUM PROFILE */}
        <section className="mt-7 overflow-hidden rounded-[2.6rem] border border-purple-100 bg-white shadow-[0_28px_80px_-36px_rgba(124,58,237,0.35)]">
          <div className="h-32 w-full bg-purple-700 sm:h-37" />
          <div className="px-5 pb-7 sm:px-8 lg:px-9">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end -mt-16 sm:-mt-14">
                <div className="relative shrink-0 self-start">
                  <div className="rounded-4xl bg-white p-2 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.2)] ring-1 ring-purple-100">
                    <div className="overflow-hidden rounded-[1.6rem]">
                      <ProfileImageViewer
                        imageUrl={creator.profile_image_url}
                        username={creator.username}
                      />
                    </div>
                  </div>
                  {creator.bvn_verified && (
                    <div className="absolute -right-2 -top-2 rounded-full bg-white p-1.5 shadow-lg ring-1 ring-purple-100">
                      <VerifiedBadge />
                    </div>
                  )}
                  {creator.is_online && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-purple-100 bg-white px-3 py-1 text-[10px] font-extrabold tracking-widest text-purple-700 shadow-sm">
                      ONLINE NOW
                    </div>
                  )}
                </div>
                <div className="min-w-0 pt-2 sm:pb-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-[2.2rem] font-black leading-[0.9] tracking-[-0.05em] text-purple-950 sm:text-[3rem]">
                      {getFirstName(creator.username)}
                    </h1>
                    {creator.hero_badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-700 px-3 py-1 text-[10px] font-black tracking-widest text-white">
                        <FiStar size={10} /> HERO
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-purple-950 px-3.5 py-1.5 text-xs font-bold text-white">
                      @{creator.username.toUpperCase()}
                    </span>
                    <span className="rounded-full bg-[#f5f3ff] px-3.5 py-1.5 text-xs font-bold text-purple-700 ring-1 ring-purple-100">
                      {nicheLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-100 bg-[#f8f5ff] px-3 py-1.5 text-xs font-semibold text-purple-700">
                      <FiMapPin size={12} /> {creator.location}
                    </span>
                    {creator.is_birthday_today && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-700 px-3 py-1.5 text-xs font-bold text-white">
                        <FiGift size={12} /> Birthday
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto lg:pt-3">
                <Link
                  href={tippingUrl}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-purple-700 px-7 py-4 text-sm font-extrabold text-white shadow-[0_12px_24px_-10px_rgba(124,58,237,0.6)] transition hover:bg-purple-800 lg:w-auto"
                >
                  <FiZap size={16} /> Support {getFirstName(creator.username)}{" "}
                  <FiArrowUpRight size={14} />
                </Link>
                <div className="flex items-center justify-center gap-2 lg:justify-end">
                  {creator.social_links?.slice(0, 5).map((social) => {
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
                        className="grid h-9 w-9 place-items-center rounded-full border border-purple-100 bg-white text-purple-700 transition hover:bg-purple-700 hover:text-white hover:border-purple-700"
                      >
                        <Icon size={14} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="mt-7 max-w-3xl text-[14.5px] leading-7 text-zinc-600">
              {creator.bio}
            </p>
          </div>
        </section>

        {/* BENTO */}
        <div className="mt-6 grid grid-cols-12 gap-5 lg:gap-6">
          <div className="col-span-12 space-y-6 lg:col-span-8">
            {availableContent.length > 0 && (
              <div className="rounded-4xl border border-purple-100 bg-white p-5 shadow-[0_16px_40px_-24px_rgba(124,58,237,0.2)] sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-purple-700 text-white">
                      <FiLock size={16} />
                    </div>
                    <div>
                      <h2 className="text-[15px] font-extrabold tracking-tight text-purple-950">
                        Exclusive Drops
                      </h2>
                      <p className="text-[11px] font-medium text-purple-700/60">
                        {paidContents.length} items • Premium
                      </p>
                    </div>
                  </div>
                  <Link
                    href={tippingUrl}
                    className="rounded-full bg-[#f5f3ff] px-3.5 py-1.5 text-xs font-bold text-purple-700 ring-1 ring-purple-100 transition hover:bg-purple-700 hover:text-white"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {availableContent.map((content) => (
                    <Link
                      key={content.id}
                      href={tippingUrl}
                      className="group overflow-hidden rounded-[1.6rem] border border-purple-100 bg-[#fcfbff]"
                    >
                      <div className="relative aspect-4/5 overflow-hidden bg-[#f5f3ff]">
                        {content.thumbnail_url ? (
                          <Image
                            src={content.thumbnail_url}
                            alt={content.title}
                            fill
                            className="object-cover opacity-80 blur-[10px] scale-110 transition duration-700 group-hover:scale-125"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-purple-300">
                            <FiVideo size={28} />
                          </div>
                        )}
                        <div className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[9px] font-black tracking-widest text-purple-700 ring-1 ring-purple-100">
                          {content.content_type === "video" ? "VIDEO" : "IMAGE"}
                        </div>
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="grid h-11 w-11 place-items-center rounded-full bg-purple-700 text-white shadow-lg transition group-hover:scale-110">
                            <FiLock size={16} />
                          </div>
                        </div>
                        <div className="absolute bottom-0 w-full bg-white/90 p-3 backdrop-blur">
                          <p className="line-clamp-1 text-[13px] font-bold text-purple-950">
                            {content.title || "Exclusive"}
                          </p>
                          <p className="text-xs font-extrabold text-purple-700">
                            {content.currency}{" "}
                            {Number(content.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {goal && goal.is_active && (
              <div className="rounded-4xl border border-purple-100 bg-[#f8f5ff] p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-700 px-3 py-1 text-[10px] font-black tracking-widest text-white">
                      <FiTarget size={12} /> ACTIVE GOAL
                    </span>
                    <h2 className="mt-3 max-w-[22ch] text-[20px] font-extrabold leading-[1.1] tracking-tight text-purple-950 sm:text-[22px]">
                      {goal.title}
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-purple-700 ring-1 ring-purple-100">
                    {Math.min(Number(goal.progress_percent || 0), 100).toFixed(
                      0,
                    )}
                    %
                  </span>
                </div>
                <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-white ring-1 ring-purple-100">
                  <div
                    className="h-full bg-purple-700"
                    style={{
                      width: `${Math.min(Number(goal.progress_percent || 0), 100)}%`,
                    }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-purple-100">
                    <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-purple-700/50">
                      <FiTrendingUp size={10} /> Raised
                    </p>
                    <p className="mt-1 text-[15px] font-black text-purple-950">
                      ₦
                      {Number(goal.current_amount || 0).toLocaleString("en-NG")}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-purple-700 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                      Target
                    </p>
                    <p className="mt-1 text-[15px] font-black text-white">
                      ₦{Number(goal.target_amount || 0).toLocaleString("en-NG")}
                    </p>
                  </div>
                </div>
                <Link
                  href={tippingUrl}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-purple-700 py-3.5 text-sm font-bold text-white transition hover:bg-purple-800"
                >
                  <FiTarget size={16} /> Help {getFirstName(creator.username)}{" "}
                  Reach This Goal
                </Link>
                <p className="mt-4 flex items-center justify-end gap-1 text-[10px] font-medium text-purple-700/50">
                  <FiCalendar size={10} /> Created:{" "}
                  {goal.created_at
                    ? new Date(goal.created_at).toLocaleDateString("en-NG")
                    : ""}
                </p>
              </div>
            )}

            <GemBanner />

            {/* SEO - FULL TEXT RESTORED */}
            <div className="rounded-4xl border border-purple-100 bg-white p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold tracking-tight text-purple-950">
                Support {getFirstName(creator.username)} on Tippified
              </h2>
              <p className="mt-4 text-[15px] font-bold leading-8 text-[#211536]">
                {creator.username} is a {nicheLabel.toLowerCase()}{" "}
                {nicheLabel === "Content Creator" ? "" : "creator"} based in{" "}
                {creator.location}.
              </p>
              <p className="mt-4 text-[15px] leading-8 text-zinc-600">
                {tippifiedCopy}
              </p>
              <p className="mt-4 text-[15px] leading-8 text-zinc-600">
                Fans can support {creator.username} on Tippified by sending
                tips, gifts and accessing exclusive creator content when
                available.
              </p>
              <p className="mt-4 text-[15px] leading-8 text-zinc-600">
                Discover more {creator.location} creators on Tippified and find
                creators whose work you enjoy and want to support.
              </p>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-22 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[1.9rem] border border-purple-100 bg-white p-5 shadow-[0_12px_24px_-16px_rgba(124,58,237,0.2)]">
                  <div className="flex items-center justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f5f3ff] text-purple-700 ring-1 ring-purple-100">
                      <FiGift size={18} />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-purple-700/40">
                      SUPPORT
                    </span>
                  </div>
                  <h3 className="mt-4 text-[15px] font-extrabold text-purple-950">
                    Send a Gift
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-5 text-zinc-500">
                    Appreciate {getFirstName(creator.username)} with a direct
                    gift.
                  </p>
                  <Link
                    href={tippingUrl}
                    className="mt-4 flex w-full items-center justify-center rounded-full bg-purple-700 py-3 text-xs font-bold text-white transition hover:bg-purple-800"
                  >
                    Send Gift
                  </Link>
                </div>
                {creator.wishlist_active && (
                  <div className="rounded-[1.9rem] border border-purple-100 bg-[#f5f3ff] p-5">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-purple-700 text-white">
                      <FiStar size={18} />
                    </div>
                    <h3 className="mt-4 text-[15px] font-extrabold text-purple-950">
                      Wishlist Active
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-5 text-zinc-600">
                      This creator has items they would love to receive.
                    </p>
                    <Link
                      href={tippingUrl}
                      className="mt-4 flex w-full items-center justify-center rounded-full bg-purple-400 py-3 text-xs font-bold text-white transition hover:bg-purple-800"
                    >
                      View Wishlist
                    </Link>
                  </div>
                )}
              </div>
              {creator.paid_community?.is_active && (
                <Link
                  href={`/community/${creator.paid_community.access_token}`}
                  className="group block overflow-hidden rounded-[1.9rem] border border-purple-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-[#f5f3ff]">
                    <Image
                      src={creator.paid_community.image_url}
                      alt={`${creator.paid_community.name} WhatsApp community`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-purple-700 px-3 py-1 text-[10px] font-black tracking-widest text-white">
                      WHATSAPP COMMUNITY
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-1 text-[14px] font-extrabold text-purple-950">
                      {creator.paid_community.name}
                    </h3>
                    {creator.paid_community.description && (
                      <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-zinc-500">
                        {creator.paid_community.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm font-black text-purple-700">
                        {creator.paid_community.currency === "NGN"
                          ? "₦"
                          : creator.paid_community.currency === "GHS"
                            ? "GH₵"
                            : "KSh"}
                        {Number(creator.paid_community.price).toLocaleString(
                          "en-NG",
                        )}
                      </p>
                      <span className="rounded-full bg-purple-700 px-4 py-1.5 text-xs font-bold text-white">
                        Join
                      </span>
                    </div>
                  </div>
                </Link>
              )}
              <AdBannerSlider />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
