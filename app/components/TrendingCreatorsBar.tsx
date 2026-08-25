"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import { bricolage, fredoka } from "../font";

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
    ...creators.map((c) => Number(c.current_amount) || 0),
    1,
  );
  const getProgress = (amount: string): number =>
    Math.max(25, Math.min(100, (Number(amount) / maxAmount) * 100));

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
    <section className="relative overflow-hidden bg-[#FCFAFF] border-y border-[#E9D5FF]/60 py-10">
      <div className="pointer-events-none absolute left-1/2 top-0 h-75 w-200 -translate-x-1/2 rounded-full bg-linear-to-b from-[#E9D5FF]/50 to-transparent blur-[60px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative max-w-6xl mx-auto px-6"
      >
        <div className="flex items-end justify-between mb-7">
          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-[#E9D5FF] shadow-sm mb-3 ${bricolage.className}`}
            >
              <span className="h-2 w-2 rounded-full bg-[#7C3AED] animate-pulse" />
              <FiZap className="w-3.5 h-3.5 text-[#4C1D95]" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#4C1D95]">
                Live now
              </span>
            </div>
            <h2
              className={`${fredoka.className} flex items-center gap-3 text-[26px] md:text-[32px] leading-none tracking-tight text-[#15052E]`}
            >
              <span className="h-9 w-9 rounded-xl bg-linear-to-br from-[#15052E] to-[#4C1D95] flex items-center justify-center shadow-[0_8px_16px_-8px_rgba(21,5,46,0.6)]">
                <FiTrendingUp className="w-5 h-5 text-white" />
              </span>
              Trending Creators
            </h2>
            <p
              className={`${bricolage.className} text-[13px] font-medium text-[#71717A] mt-2`}
            >
              Most tipped creators this week
            </p>
          </div>

          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="h-9 w-9 rounded-full bg-white ring-1 ring-[#E9D5FF] flex items-center justify-center text-[#4C1D95] hover:bg-[#F5F0FF] transition"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => scroll("right")}
              className="h-9 w-9 rounded-full bg-white ring-1 ring-[#E9D5FF] flex items-center justify-center text-[#4C1D95] hover:bg-[#F5F0FF] transition"
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
                    className="min-w-75 h-37 rounded-4xl bg-white border border-[#E9D5FF] animate-pulse shrink-0"
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
                      whileHover={{ y: -4 }}
                      className="group min-w-75 w-75 snap-start shrink-0 rounded-4xl bg-white p-px shadow-[0_16px_40px_-20px_rgba(76,29,149,0.25)] hover:shadow-[0_20px_50px_-18px_rgba(76,29,149,0.35)] transition-all"
                    >
                      <div className="rounded-[1.95rem] bg-linear-to-b from-white to-[#FDFAFF] p-5 h-full flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-11 w-11 shrink-0 rounded-xl bg-linear-to-br from-[#15052E] to-[#4C1D95] text-white flex items-center justify-center font-extrabold text-[14px] shadow">
                              {creator.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span
                                className={`${fredoka.className} flex items-center gap-1 font-bold text-[#15052E] text-[15px] truncate`}
                              >
                                {capitalizeWords(creator.username)}
                              </span>
                              <span
                                className={`${bricolage.className} text-[11px] font-medium text-[#A1A1AA] truncate block`}
                              >
                                {creator.referral_code}
                              </span>
                            </div>
                          </div>
                          <motion.span
                            whileHover={{ rotate: 20 }}
                            className="h-8 w-8 shrink-0 rounded-full bg-white ring-1 ring-[#E9D5FF] flex items-center justify-center text-[#4C1D95] group-hover:bg-[#15052E] group-hover:text-white transition-colors"
                          >
                            <FiArrowUpRight className="w-4 h-4" />
                          </motion.span>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-2">
                          <div
                            className={`${bricolage.className} min-w-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#15052E] text-white shadow-[0_8px_16px_-8px_rgba(21,5,46,0.6)]`}
                          >
                            <FiHeart className="w-3 h-3 text-[#DDD6FE] shrink-0" />
                            <span className="text-[12px] font-bold truncate">
                              ₦{formatAmount(creator.current_amount)}
                            </span>
                          </div>
                          <span
                            className={`${bricolage.className} shrink-0 text-[11px] font-bold tracking-widest uppercase text-[#7C3AED] flex items-center gap-1`}
                          >
                            <FiTrendingUp className="w-3 h-3" />{" "}
                            {Math.round(progress)}%
                          </span>
                        </div>

                        <div className="mt-3 h-2.5 w-full rounded-full bg-[#F3E8FF] overflow-hidden ring-1 ring-[#F3E8FF] p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1.2,
                              delay: 0.3 + idx * 0.1,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="h-full rounded-full bg-linear-to-r from-[#4C1D95] to-[#7C3AED] relative overflow-hidden"
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
