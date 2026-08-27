"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiArrowRight, FiGift, FiMapPin, FiStar, FiZap } from "react-icons/fi";

import NavBar from "../components/NavBar";
import VerifiedBadge from "../components/VerifiedBadge";

interface Creator {
  username: string;
  referral_code: string;
  niche: string;
  is_online: boolean;
  location: string;
  bvn_verified: boolean;
  is_birthday_today: boolean;
  hero_badge: boolean;
}

interface ApiResponse {
  results: Creator[];
  next: string | null;
}

interface ExploreClientProps {
  initialData: ApiResponse;
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

export default function ExploreClient({ initialData }: ExploreClientProps) {
  const [creators, setCreators] = useState<Creator[]>(
    initialData.results || [],
  );

  const [nextUrl, setNextUrl] = useState<string | null>(initialData.next);

  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchMore = useCallback(async () => {
    if (!nextUrl || loading) return;

    setLoading(true);

    try {
      const res = await fetch(nextUrl);

      if (!res.ok) {
        return;
      }

      const data: ApiResponse = await res.json();

      setCreators((prev) => [...prev, ...(data.results || [])]);

      setNextUrl(data.next);
    } catch (error) {
      console.error("Failed to load more creators:", error);
    } finally {
      setLoading(false);
    }
  }, [nextUrl, loading]);

  useEffect(() => {
    const element = loaderRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchMore();
        }
      },
      {
        rootMargin: "400px",
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [fetchMore]);

  return (
    <>
      <NavBar />

      {creators.length > 0 ? (
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Tippified creators"
        >
          {creators.map((creator, i) => (
            <motion.article
              key={`${creator.referral_code}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: (i % 12) * 0.04,
              }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={`/creator/${creator.referral_code}`}
                className="group relative block bg-white rounded-[1.9rem] border border-purple-100/70 p-px shadow-[0_12px_40px_-18px_rgba(124,58,237,0.15)] hover:shadow-[0_24px_60px_-18px_rgba(124,58,237,0.28)] transition-all"
                aria-label={`Support ${creator.username} on Tippified`}
              >
                <div className="rounded-[1.9rem] bg-white p-6 h-full relative overflow-hidden">
                  {/* Decorative top line */}
                  <div
                    className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-purple-200/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  />

                  {/* Creator identity */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="h-10 w-10 shrink-0 rounded-2xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-[13px]"
                        aria-hidden="true"
                      >
                        {creator.username.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-[14px] font-extrabold text-purple-900 tracking-tight truncate">
                            {creator.username}
                          </h3>

                          {creator.bvn_verified && <VerifiedBadge size={16} />}
                        </div>

                        <p className="text-[11px] font-bold text-purple-400 mt-0.5 tracking-wide">
                          {creator.referral_code}
                        </p>
                      </div>
                    </div>

                    {/* Online status */}
                    <div
                      className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        creator.is_online
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-zinc-50 text-zinc-400 border border-zinc-100"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          creator.is_online
                            ? "bg-green-500 animate-pulse"
                            : "bg-zinc-300"
                        }`}
                        aria-hidden="true"
                      />

                      {creator.is_online ? "Online" : "Offline"}
                    </div>
                  </div>

                  {/* Creator information */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f8f5ff] border border-purple-100 text-[11px] font-semibold text-purple-700">
                      <FiMapPin size={12} aria-hidden="true" />
                      {creator.location}
                    </span>

                    {creator.niche && (
                      <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1.5 text-[10px] font-bold text-purple-600 ring-1 ring-purple-100">
                        {NICHE_LABELS[creator.niche] || creator.niche}
                      </span>
                    )}

                    {creator.hero_badge && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-linear-to-r from-amber-400 to-orange-400 text-white text-[11px] font-bold">
                        <FiStar size={12} aria-hidden="true" />
                        Hero Creator
                      </span>
                    )}

                    {creator.is_birthday_today && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-linear-to-r from-pink-500 to-purple-600 text-white text-[11px] font-bold">
                        <FiGift size={12} aria-hidden="true" />
                        Birthday Today
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-purple-400 flex items-center gap-1">
                      <FiZap size={12} aria-hidden="true" />
                      Support Creator
                    </span>

                    <div
                      className="h-8 w-8 rounded-full bg-purple-700 text-white flex items-center justify-center group-hover:bg-purple-600 transition-colors"
                      aria-hidden="true"
                    >
                      <FiArrowRight />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <h2 className="text-lg font-bold text-purple-900">
            No creators found
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Check back soon to discover creators on Tippified.
          </p>
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div
        ref={loaderRef}
        className="mt-12 min-h-8 flex justify-center"
        aria-hidden={!loading}
      >
        {loading && (
          <div
            className="h-6 w-6 rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin"
            role="status"
            aria-label="Loading more creators"
          />
        )}
      </div>

      {/* End of results */}
      {!nextUrl && creators.length > 0 && (
        <p className="text-center text-[12px] text-purple-300 mt-10">
          You&apos;ve discovered all available creators.
        </p>
      )}
    </>
  );
}
