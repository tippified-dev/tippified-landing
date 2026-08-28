"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiArrowRight,
  FiGift,
  FiMapPin,
  FiSearch,
  FiStar,
  FiX,
  FiZap,
} from "react-icons/fi";
import NavBar from "../components/NavBar";
import ProfileImageViewer from "../components/ProfileImageViewer";
import VerifiedBadge from "../components/VerifiedBadge";
interface Creator {
  username: string;
  referral_code: string;
  niche: string;
  is_online: boolean;
  location: string;
  bvn_verified: boolean;
  profile_image_url: string | null;
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

const capitalizeWords = (text: string) => {
  if (!text) return "";
  return text
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export default function ExploreClient({ initialData }: ExploreClientProps) {
  const [creators, setCreators] = useState<Creator[]>(
    initialData.results || [],
  );
  const [nextUrl, setNextUrl] = useState<string | null>(initialData.next);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
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
  useEffect(() => {
    if (searchOpen) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [searchOpen]);
  const filteredCreators = creators.filter((creator) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const username = creator.username?.toLowerCase() || "";
    const referralCode = creator.referral_code?.toLowerCase() || "";
    const niche =
      NICHE_LABELS[creator.niche]?.toLowerCase() ||
      creator.niche?.toLowerCase() ||
      "";
    const location = creator.location?.toLowerCase() || "";
    return (
      username.includes(query) ||
      referralCode.includes(query) ||
      niche.includes(query) ||
      location.includes(query)
    );
  });
  return (
    <>
      <NavBar />
      {/* Sticky Explore Header */}
      <div className="sticky top-0 z-40 -mx-4 border-b border-purple-100/80 bg-[#fcfbff]/92 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          {/* Live on Tippified */}
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-purple-600" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-extrabold tracking-tight text-purple-950 sm:text-base">
                Live on Tippified
              </h1>
              <p className="hidden text-[10px] font-medium text-purple-400 sm:block">
                Discover creators worth supporting
              </p>
            </div>
          </div>
          {/* Search */}
          <div className="flex shrink-0 items-center justify-end">
            <motion.div
              initial={false}
              animate={{
                width: searchOpen ? "min(52vw, 300px)" : "42px",
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
              }}
              className="relative overflow-hidden rounded-full border border-purple-100 bg-white shadow-[0_8px_30px_-16px_rgba(124,58,237,0.35)]"
            >
              <div className="flex h-10 items-center">
                {/* Search icon */}
                <button
                  type="button"
                  onClick={() => {
                    if (searchOpen && searchQuery) {
                      setSearchQuery("");
                    } else {
                      setSearchOpen((prev) => !prev);
                    }
                  }}
                  className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center text-purple-600 transition-colors hover:text-purple-800"
                  aria-label={searchOpen ? "Clear search" : "Search creators"}
                >
                  {searchOpen && searchQuery ? (
                    <FiX size={16} />
                  ) : (
                    <FiSearch size={16} />
                  )}
                </button>
                {/* Input */}
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search creators..."
                  className="h-full min-w-0 flex-1 bg-transparent pr-4 text-base font-semibold text-purple-950 outline-none placeholder:text-purple-300"
                  aria-label="Search creators"
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setSearchQuery("");
                      setSearchOpen(false);
                    }
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Creator Results */}
      {filteredCreators.length > 0 ? (
        <div
          className="grid min-w-0 max-w-full gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Tippified creators"
        >
          {filteredCreators.map((creator, i) => (
            <motion.article
              key={`${creator.referral_code}-${i}`}
              className="min-w-0 max-w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: (i % 12) * 0.04,
              }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={`/creator/${creator.referral_code}`}
                className="group relative block min-w-0 max-w-full overflow-hidden rounded-[1.9rem] border border-purple-100/70 bg-white p-px shadow-[0_12px_40px_-18px_rgba(124,58,237,0.15)] transition-all hover:shadow-[0_24px_60px_-18px_rgba(124,58,237,0.28)]"
                aria-label={`Support ${creator.username} on Tippified`}
              >
                <div className="relative h-full overflow-hidden rounded-[1.9rem] bg-white p-6">
                  {/* Decorative top line */}
                  <div
                    className="absolute left-6 right-6 top-0 h-px bg-linear-to-r from-transparent via-purple-200/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  {/* Creator identity */}
                  <div className="flex min-w-0 w-full items-start justify-between gap-3">
                    {/* Left side: profile + name */}
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                      {/* Profile Image Viewer */}
                      <div
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onMouseDown={(event) => {
                          event.stopPropagation();
                        }}
                        className="shrink-0"
                      >
                        <ProfileImageViewer
                          imageUrl={creator.profile_image_url}
                          username={creator.username}
                        />
                      </div>

                      {/* Creator name */}
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <h3 className="min-w-0 flex-1 truncate text-[14px] font-extrabold tracking-tight text-purple-900">
                            {capitalizeWords(creator.username)}
                          </h3>

                          {creator.bvn_verified && (
                            <span className="shrink-0">
                              <VerifiedBadge size={16} />
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 truncate text-[11px] font-bold tracking-wide text-purple-400">
                          {creator.referral_code}
                        </p>
                      </div>
                    </div>

                    {/* Online status */}
                    <div
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        creator.is_online
                          ? "border border-green-100 bg-green-50 text-green-700"
                          : "border border-zinc-100 bg-zinc-50 text-zinc-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          creator.is_online
                            ? "animate-pulse bg-green-500"
                            : "bg-zinc-300"
                        }`}
                        aria-hidden="true"
                      />

                      {creator.is_online ? "Online" : "Offline"}
                    </div>
                  </div>
                  {/* Creator information */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-[#f8f5ff] px-3 py-1.5 text-[11px] font-semibold text-purple-700">
                      <FiMapPin size={12} aria-hidden="true" />
                      {creator.location}
                    </span>
                    {creator.niche && (
                      <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1.5 text-[10px] font-bold text-purple-600 ring-1 ring-purple-100">
                        {NICHE_LABELS[creator.niche] || creator.niche}
                      </span>
                    )}
                    {creator.hero_badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-400 to-orange-400 px-3 py-1.5 text-[11px] font-bold text-white">
                        <FiStar size={12} aria-hidden="true" />
                        Hero Creator
                      </span>
                    )}
                    {creator.is_birthday_today && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-pink-500 to-purple-600 px-3 py-1.5 text-[11px] font-bold text-white">
                        <FiGift size={12} aria-hidden="true" />
                        Birthday Today
                      </span>
                    )}
                  </div>
                  {/* CTA */}
                  <div className="mt-6 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-purple-400">
                      <FiZap size={12} aria-hidden="true" />
                      Support Creator
                    </span>
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 text-white transition-colors group-hover:bg-purple-600"
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-20 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-purple-500">
            <FiSearch size={22} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-purple-900">
            No creators found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            We couldn&apos;t find a creator matching &quot;{searchQuery}&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSearchOpen(false);
            }}
            className="mt-5 rounded-full bg-purple-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-200 transition-all hover:-translate-y-0.5 hover:bg-purple-800"
          >
            Clear Search
          </button>
        </motion.div>
      )}
      {/* Infinite scroll trigger */}
      {!searchQuery && (
        <div
          ref={loaderRef}
          className="mt-12 flex min-h-8 justify-center"
          aria-hidden={!loading}
        >
          {loading && (
            <div
              className="h-6 w-6 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600"
              role="status"
              aria-label="Loading more creators"
            />
          )}
        </div>
      )}
      {/* End of results */}
      {!nextUrl && creators.length > 0 && !searchQuery && (
        <p className="mt-10 text-center text-[12px] text-purple-300">
          You&apos;ve discovered all creators in public state.
        </p>
      )}
    </>
  );
}
