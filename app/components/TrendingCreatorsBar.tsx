"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiStar,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

interface Creator {
  username: string;
  referral_code: string;
  current_amount: string;
  target_amount?: string;
}

export default function TrendingCreatorsBar() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<number | null>(null);

  useEffect(() => {
    const fetchTrending = async (): Promise<void> => {
      try {
        const res: Response = await fetch(
          "https://api.tippified.com/api/auth/goals/trending/",
        );
        const data = await res.json();
        const creatorsArray: Creator[] = Array.isArray(data)
          ? data
          : (data.results ?? []);
        setCreators(creatorsArray);
      } catch (err: unknown) {
        console.error("Failed to fetch trending creators", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const maxAmount: number = Math.max(
    ...creators.map((c: Creator) => Number(c.current_amount) || 0),
    1,
  );

  const getProgress = (amount: string): number => {
    const num: number = Number(amount) || 0;
    const pct: number = (num / maxAmount) * 100;
    return Math.max(25, Math.min(100, pct));
  };

  const startAutoScroll = useCallback(() => {
    if (scrollInterval.current) clearInterval(scrollInterval.current);
    scrollInterval.current = window.setInterval(() => {
      if (!containerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        containerRef.current.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 3500);
  }, []);

  const stopAutoScroll = (): void => {
    if (scrollInterval.current !== null) clearInterval(scrollInterval.current);
  };

  useEffect(() => {
    if (!creators.length) return;
    startAutoScroll();
    return () => stopAutoScroll();
  }, [creators, startAutoScroll]);

  const scroll = (dir: "left" | "right"): void => {
    containerRef.current?.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  const capitalizeWords = (text: string): string =>
    text
      ?.trim()
      .split(/\s+/)
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "";

  const formatAmount = (amount: string): string => {
    const num: number = Number(amount);
    return isNaN(num) ? amount : num.toLocaleString("en-NG");
  };

  if (!loading && creators.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#fdfcff] border-y border-purple-100/60 py-7">
      <div className="absolute left-0 top-0 h-1 w-linear-to-r from-purple-600 via-violet-500 to-indigo-500" />
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-linear-to-br from-purple-100 to-violet-100 blur-2xl opacity-60 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative max-w-6xl mx-auto px-6"
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-purple-100 shadow-sm mb-3">
              <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
              <FiZap className="w-3.5 h-3.5 text-purple-700" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-purple-700">
                Live now
              </span>
            </div>
            <h2 className="flex items-center gap-3 text-2xl md:text-[26px] font-extrabold tracking-tight text-purple-900">
              <span className="h-9 w-9 rounded-xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_8px_16px_-8px_rgba(124,58,237,0.6)]">
                <FiTrendingUp className="w-5 h-5 text-white" />
              </span>
              Trending Creators
            </h2>
            <p className="text-[13px] text-purple-400 font-medium mt-1.5">
              Most tipped creators this week
            </p>
          </div>

          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="h-9 w-9 rounded-full bg-white border border-purple-100 flex items-center justify-center text-purple-700 hover:bg-[#f8f5ff] transition"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => scroll("right")}
              className="h-9 w-9 rounded-full bg-white border border-purple-100 flex items-center justify-center text-purple-700 hover:bg-[#f8f5ff] transition"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          onMouseEnter={stopAutoScroll}
          onMouseLeave={startAutoScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-6 px-6 pb-6"
        >
          <AnimatePresence mode="popLayout">
            {loading
              ? [...Array(4)].map((_, i: number) => (
                  <motion.div
                    key={`sk-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="min-w-75 h-37 rounded-3xl bg-white border border-purple-100 animate-pulse shrink-0"
                  />
                ))
              : creators.map((creator: Creator, idx: number) => {
                  const progress: number = getProgress(creator.current_amount);
                  return (
                    <motion.a
                      key={creator.referral_code}
                      href={`https://app.tippified.com/tip/${creator.referral_code}`}
                      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: idx * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{ y: -3 }}
                      className="group min-w-75 w-75 snap-start shrink-0 rounded-3xl border border-purple-100/70 bg-white p-px shadow-[0_20px_60px_-24px_rgba(124,58,237,0.2)]"
                    >
                      <div className="rounded-[1.45rem] bg-linear-to-br from-white to-[#f8f5ff] p-4 h-full flex flex-col">
                        {/* TOP ROW */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-11 w-11 shrink-0 rounded-xl bg-linear-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-[14px] shadow">
                              {creator.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="flex items-center gap-1 font-bold text-purple-900 text-[14px] truncate">
                                {capitalizeWords(creator.username)}
                                <FiStar className="w-3 h-3 text-purple-500 fill-purple-500 shrink-0" />
                              </span>
                              <span className="text-[11px] text-purple-400 truncate block">
                                @{creator.referral_code}
                              </span>
                            </div>
                          </div>
                          <motion.span
                            whileHover={{ rotate: 20 }}
                            className="h-8 w-8 shrink-0 rounded-full bg-white border border-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors"
                          >
                            <FiArrowUpRight className="w-4 h-4" />
                          </motion.span>
                        </div>

                        {/* AMOUNT ROW - FIXED, NOT NESTED IN TOP */}
                        <div className="mt-4 flex items-center justify-between gap-2">
                          <div className="min-w-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 text-white shadow-[0_8px_16px_-8px_rgba(124,58,237,0.6)]">
                            <FiHeart className="w-3 h-3 text-purple-100 shrink-0" />
                            <span className="text-[12px] font-bold truncate">
                              ₦{formatAmount(creator.current_amount)}
                            </span>
                            <span className="text-[10px] text-purple-100/80 hidden sm:inline">
                              raised
                            </span>
                          </div>
                          <span className="shrink-0 text-[11px] font-bold tracking-widest uppercase text-purple-600 flex items-center gap-1">
                            <FiTrendingUp className="w-3 h-3" />{" "}
                            {Math.round(progress)}%
                          </span>
                        </div>

                        {/* PROGRESS */}
                        <div className="mt-3 h-2.5 w-full rounded-full bg-purple-50 overflow-hidden ring-1 ring-purple-50">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1.2,
                              delay: 0.3 + idx * 0.1,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="h-full rounded-full bg-linear-to-r from-purple-600 to-violet-500 relative overflow-hidden"
                          >
                            <motion.div
                              animate={{ x: ["-100%", "200%"] }}
                              transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                repeatDelay: 1.5,
                              }}
                              className="absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/30 to-transparent"
                            />
                          </motion.div>
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
