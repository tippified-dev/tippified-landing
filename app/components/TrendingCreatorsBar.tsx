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
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<number | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          "https://api.tippified.com/api/auth/goals/trending/",
        );
        const data = await res.json();
        const creatorsArray = Array.isArray(data) ? data : (data.results ?? []);
        setCreators(creatorsArray);
      } catch (err) {
        console.error("Failed to fetch trending creators", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const maxAmount = Math.max(
    ...creators.map((c) => Number(c.current_amount) || 0),
    1,
  );

  const getProgress = (amount: string) => {
    const num = Number(amount) || 0;
    const pct = (num / maxAmount) * 100;
    return Math.max(25, Math.min(100, pct)); // min 25% so it looks good
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

  const stopAutoScroll = () => {
    if (scrollInterval.current !== null) clearInterval(scrollInterval.current);
  };

  useEffect(() => {
    if (!creators.length) return;
    startAutoScroll();
    return () => stopAutoScroll();
  }, [creators, startAutoScroll]);

  const scroll = (dir: "left" | "right") => {
    containerRef.current?.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  const capitalizeWords = (text: string) =>
    text
      ?.trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "";

  const formatAmount = (amount: string) => {
    const num = Number(amount);
    return isNaN(num) ? amount : num.toLocaleString("en-NG");
  };

  if (!loading && creators.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#FCFAFF] border-y border-[#F3E8FF] py-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 h-100 w-100 rounded-full bg-[#E9D5FF]/50 blur-[80px]" />
        <div className="absolute -bottom-24 left-10 h-75 w-75 rounded-full bg-[#DDD6FE]/40 blur-[70px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative max-w-6xl mx-auto px-6"
      >
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E9D5FF] shadow-sm mb-3"
            >
              <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
              <FiZap className="w-3.5 h-3.5 text-[#4C1D95]" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#4C1D95]">
                Live now
              </span>
            </motion.div>

            <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-extrabold tracking-tight text-[#15052E]">
              <span className="h-9 w-9 rounded-full bg-linear-to-br from-[#4C1D95] to-[#6D28D9] flex items-center justify-center shadow-[0_6px_14px_-6px_rgba(76,29,149,0.5)]">
                <FiTrendingUp className="w-5 h-5 text-white" />
              </span>
              Trending Creators
            </h2>
            <p className="text-[14px] text-[#52525B] font-medium mt-2">
              Most tipped creators this week
            </p>
          </div>

          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="h-9 w-9 rounded-full bg-white border border-[#E9D5FF] flex items-center justify-center text-[#4C1D95] hover:bg-[#F5F0FF] transition"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => scroll("right")}
              className="h-9 w-9 rounded-full bg-white border border-[#E9D5FF] flex items-center justify-center text-[#4C1D95] hover:bg-[#F5F0FF] transition"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={containerRef}
          onMouseEnter={stopAutoScroll}
          onMouseLeave={startAutoScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-6 px-6 pb-6"
        >
          <AnimatePresence mode="popLayout">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <motion.div
                    key={`sk-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="min-w-75 h-38 rounded-[20px] bg-white border border-[#F3E8FF] animate-pulse shrink-0"
                  />
                ))
              : creators.map((creator, idx) => {
                  const progress = getProgress(creator.current_amount);
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
                      className="group min-w-75 max-w-75.5 snap-start shrink-0 rounded-[20px] bg-white border border-[#E9D5FF] p-px shadow-[0_8px_30px_-18px_rgba(76,29,149,0.3)]"
                    >
                      <div className="rounded-[19px] bg-linear-to-b from-white to-[#FDFAFF] p-4 h-full">
                        {/* top */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-full bg-linear-to-br from-[#4C1D95] to-[#7C3AED] text-white flex items-center justify-center font-extrabold text-[14px]">
                              {creator.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="flex items-center gap-1 font-bold text-[#18181B] text-[14px]">
                                {capitalizeWords(creator.username)}
                                <FiStar className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                              </span>
                              <span className="text-[12px] text-[#71717A]">
                                @{creator.referral_code}
                              </span>
                            </div>
                            <motion.span
                              whileHover={{ rotate: 45 }}
                              className="h-7 w-7 rounded-full bg-[#F5F0FF] border border-[#E9D5FF] flex items-center justify-center text-[#4C1D95] group-hover:bg-[#4C1D95] group-hover:text-white transition-colors"
                            >
                              <FiArrowUpRight className="w-4 h-4" />
                            </motion.span>
                          </div>

                          {/* amount */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15052E] text-white">
                              <FiHeart className="w-3 h-3 text-[#E9D5FF]" />
                              <span className="text-[13px] font-bold">
                                ₦{formatAmount(creator.current_amount)}
                              </span>
                              <span className="text-[11px] text-white/60">
                                raised
                              </span>
                            </div>
                            <span className="text-[11px] font-bold tracking-widest uppercase text-[#6D28D9] flex items-center gap-1">
                              <FiTrendingUp className="w-3 h-3" />{" "}
                              {Math.round(progress)}%
                            </span>
                          </div>

                          {/* progress bar - framer motion */}
                          <div className="mt-3 h-2 w-full rounded-full bg-[#F3E8FF] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${progress}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 1.2,
                                delay: 0.3 + idx * 0.1,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="h-full rounded-full bg-linear-to-r from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] relative overflow-hidden"
                            >
                              {/* shimmer */}
                              <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{
                                  duration: 1.8,
                                  repeat: Infinity,
                                  repeatDelay: 1.5,
                                  ease: "easeInOut",
                                }}
                                className="absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/30 to-transparent"
                              />
                            </motion.div>
                          </div>
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
