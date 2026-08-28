"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
interface Creator {
  username: string;
  referral_code: string;
  niche: string;
  profile_image_url: string | null;
}
interface ApiResponse {
  results: Creator[];
  next: string | null;
}
interface CreatorTipBannerProps {
  className?: string;
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
  writing: "Writing & Literature",
  podcasting: "Podcasting",
  travel: "Travel",
  faith_inspiration: "Faith & Inspiration",
  Adult_content: "Adult Content",
  other: "Other",
};
const capitalizeWords = (text: string) => {
  if (!text) return "";
  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
const getInitials = (username: string) => {
  const words = username.trim().split(/\s+/);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
};
export default function CreatorTipBanner({
  className = "",
}: CreatorTipBannerProps) {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    const loadCreator = async () => {
      try {
        const res = await fetch(
          "https://api.tippified.com/api/auth/creators/explore/?page=1",
          {
            cache: "no-store",
          },
        );
        if (!res.ok) return;
        const data: ApiResponse = await res.json();
        if (!data.results?.length) return;
        const randomCreator =
          data.results[Math.floor(Math.random() * data.results.length)];
        if (!cancelled) {
          setCreator(randomCreator);
        }
      } catch (error) {
        console.error("Failed to load creator banner:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    loadCreator();
    return () => {
      cancelled = true;
    };
  }, []);
  if (loading) {
    return (
      <div
        className={`mx-4 overflow-hidden rounded-2xl border border-purple-100/80 bg-white shadow-[0_10px_35px_-20px_rgba(124,58,237,0.3)] sm:mx-6 ${className}`}
      >
        <div className="flex h-16 items-center gap-3 px-3 sm:px-4">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-purple-100" />
          <div className="min-w-0 flex-1">
            <div className="h-3 w-28 animate-pulse rounded-full bg-purple-100" />
            <div className="mt-2 h-2.5 w-20 animate-pulse rounded-full bg-purple-50" />
          </div>
          <div className="h-9 w-16 shrink-0 animate-pulse rounded-full bg-purple-100" />
        </div>
      </div>
    );
  }
  if (!creator) {
    return null;
  }
  const username = capitalizeWords(creator.username);
  const niche = NICHE_LABELS[creator.niche] || creator.niche;
  const tippingUrl = `https://app.tippified.com/tip/${creator.referral_code}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`mx-4 overflow-hidden rounded-2xl border border-purple-100/80 bg-white shadow-[0_12px_40px_-20px_rgba(124,58,237,0.3)] sm:mx-6 ${className}`}
    >
      <div className="flex h-16 min-w-0 items-center gap-2.5 px-3 sm:gap-3 sm:px-4">
        {/* Profile image */}
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-purple-600 to-indigo-600 shadow-sm ring-2 ring-purple-50">
          {creator.profile_image_url ? (
            <Image
              src={creator.profile_image_url}
              alt={`${creator.username} profile picture`}
              fill
              className="object-cover"
              sizes="36px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-extrabold text-white">
              {getInitials(creator.username)}
            </div>
          )}
        </div>
        {/* Username */}
        <div className="min-w-0 max-w-[35%]">
          <p className="truncate text-[12px] font-extrabold tracking-tight text-purple-950 sm:text-[13px]">
            {username}
          </p>
        </div>
        {/* Separator */}
        <span
          className="shrink-0 text-sm font-medium text-purple-200"
          aria-hidden="true"
        >
          |
        </span>
        {/* Niche */}
        <div className="min-w-0 max-w-[28%]">
          <p className="truncate text-[10px] font-bold text-purple-400 sm:text-[11px]">
            {niche}
          </p>
        </div>
        {/* Separator */}
        <span
          className="shrink-0 text-sm font-medium text-purple-200"
          aria-hidden="true"
        >
          |
        </span>
        {/* Tippified */}
        <span className="shrink-0 text-[10px] font-extrabold tracking-wide text-purple-500 sm:text-[11px]">
          Tippified
        </span>
        {/* Separator */}
        <span
          className="shrink-0 text-sm font-medium text-purple-200"
          aria-hidden="true"
        >
          |
        </span>
        {/* CTA */}
        <Link
          href={tippingUrl}
          aria-label={`Tip ${creator.username}`}
          className="flex h-9 shrink-0 items-center rounded-full bg-purple-700 px-4 text-[11px] font-extrabold text-white shadow-md shadow-purple-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-purple-800 hover:shadow-lg active:translate-y-0"
        >
          Tip
        </Link>
      </div>
    </motion.div>
  );
}
