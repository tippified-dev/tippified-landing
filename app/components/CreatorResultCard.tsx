"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiMapPin } from "react-icons/fi";
import type { GemCreator } from "../lib/gems/api";

interface CreatorResultCardProps {
  creator: GemCreator;
  index?: number;
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

function getInitials(name: string, username: string) {
  const displayName = name.trim();

  if (displayName) {
    const words = displayName.split(/\s+/);

    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }

    return displayName.slice(0, 2).toUpperCase();
  }

  return username.slice(0, 2).toUpperCase();
}

export default function CreatorResultCard({
  creator,
  index = 0,
}: CreatorResultCardProps) {
  const displayName = creator.display_name?.trim() || creator.username;

  const niche = NICHE_LABELS[creator.niche] || creator.niche;

  const tippingUrl = `https://app.tippified.com/tip/${encodeURIComponent(
    creator.referral_code,
  )}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.045, 0.2),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative min-w-0 overflow-hidden rounded-2xl border border-purple-100/80 bg-white shadow-[0_8px_30px_-20px_rgba(91,33,182,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-[0_18px_40px_-22px_rgba(91,33,182,0.42)]"
    >
      {/* Subtle purple background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-br from-purple-50 via-white to-fuchsia-50/50 opacity-80"
      />

      <div className="relative p-4 sm:p-5">
        {/* Featured badge */}
        {creator.hero_badge && (
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-amber-700">
            <span aria-hidden="true">✦</span>
            Featured creator
          </div>
        )}

        {/* Creator identity */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Profile image */}
          <div className="relative h-14.5 w-14.5 shrink-0 rounded-2xl bg-linear-to-br from-purple-600 via-violet-600 to-fuchsia-500 p-0.5 shadow-sm shadow-purple-200/60">
            <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-purple-50">
              {creator.profile_image_url ? (
                <Image
                  src={creator.profile_image_url}
                  alt={`${displayName}'s profile picture`}
                  fill
                  sizes="58px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-100 to-fuchsia-100 text-sm font-black tracking-wide text-purple-700">
                  {getInitials(displayName, creator.username)}
                </div>
              )}
            </div>

            {/* Online indicator */}
            {creator.is_online && (
              <span
                aria-label="Online"
                title="Online"
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500"
              />
            )}
          </div>

          {/* Name and username */}
          <div className="min-w-0 flex-1">
            <h3
              className="truncate text-[14px] font-extrabold tracking-tight text-purple-950 sm:text-[15px]"
              title={displayName}
            >
              {displayName}
            </h3>

            <p className="mt-1 truncate text-xs font-medium text-purple-400">
              @{creator.username}
            </p>

            <div className="mt-2 flex min-w-0 items-center gap-1.5">
              <span className="inline-flex max-w-full items-center truncate rounded-full border border-purple-100 bg-purple-50/80 px-2 py-1 text-[10px] font-bold text-purple-700 sm:text-[11px]">
                {niche}
              </span>
            </div>
          </div>
        </div>

        {/* Creator bio */}
        {creator.bio?.trim() && (
          <p className="mt-4 line-clamp-2 min-h-9 text-xs leading-[1.65] text-gray-500">
            {creator.bio.trim()}
          </p>
        )}

        {/* Location and status */}
        <div className="mt-3 flex min-w-0 items-center justify-between gap-2 border-t border-purple-50 pt-3">
          <span className="flex min-w-0 items-center gap-1 text-[10px] font-semibold text-gray-400">
            <FiMapPin
              size={12}
              className="shrink-0 text-purple-300"
              aria-hidden="true"
            />
            <span className="truncate">{creator.location}</span>
          </span>

          {creator.is_online ? (
            <span className="shrink-0 text-[10px] font-bold text-emerald-600">
              Online now
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-medium text-gray-400">
              Creator
            </span>
          )}
        </div>

        {/* Send Gem action */}
        <Link
          href={tippingUrl}
          aria-label={`Send a Gem to ${displayName}`}
          className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-700 to-violet-700 px-4 py-3 text-xs font-extrabold text-white shadow-[0_6px_18px_-8px_rgba(109,40,217,0.7)] transition-all duration-200 hover:from-purple-800 hover:to-violet-800 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
        >
          <span>Send Gem</span>
          <FiArrowUpRight
            size={15}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </motion.article>
  );
}
