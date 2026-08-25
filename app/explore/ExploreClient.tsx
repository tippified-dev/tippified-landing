"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiGift, FiMapPin, FiStar, FiZap } from "react-icons/fi";

interface Creator {
  username: string;
  referral_code: string;
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

export default function ExploreClient({
  initialData,
}: {
  initialData: ApiResponse;
}) {
  const [creators, setCreators] = useState<Creator[]>(
    initialData.results || [],
  );
  const [nextUrl, setNextUrl] = useState<string | null>(initialData.next);
  const [loading, setLoading] = useState<boolean>(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchMore = useCallback(async () => {
    if (!nextUrl || loading) return;
    setLoading(true);
    try {
      const res = await fetch(nextUrl);
      const data: ApiResponse = await res.json();
      setCreators((prev) => [...prev, ...data.results]);
      setNextUrl(data.next);
    } finally {
      setLoading(false);
    }
  }, [nextUrl, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchMore();
      },
      { threshold: 0.1 },
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchMore]);

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator, i) => (
          <motion.div
            key={`${creator.referral_code}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i % 12) * 0.04 }}
            whileHover={{ y: -6 }}
          >
            <Link
              href={`/tip/${creator.referral_code}`}
              className="group relative block bg-white rounded-[1.9rem] border border-purple-100/70 p-px shadow-[0_12px_40px_-18px_rgba(124,58,237,0.15)] hover:shadow-[0_24px_60px_-18px_rgba(124,58,237,0.28)] transition-all"
            >
              <div className="rounded-[1.9rem] bg-white p-6 h-full relative overflow-hidden">
                <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-purple-200/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Top */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-[13px]">
                      {creator.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[14px] font-extrabold text-purple-900 tracking-tight">
                          @{creator.username}
                        </p>
                        {creator.bvn_verified && (
                          <FiCheckCircle size={14} className="text-green-500" />
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-purple-400 mt-0.5 tracking-wide">
                        {creator.referral_code}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${creator.is_online ? "bg-green-50 text-green-700 border border-green-100" : "bg-zinc-50 text-zinc-400 border border-zinc-100"}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${creator.is_online ? "bg-green-500 animate-pulse" : "bg-zinc-300"}`}
                    />
                    {creator.is_online ? "Online" : "Offline"}
                  </div>
                </div>

                {/* Badges */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f8f5ff] border border-purple-100 text-[11px] font-semibold text-purple-700">
                    <FiMapPin size={12} /> {creator.location}
                  </span>
                  {creator.hero_badge && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-linear-to-r from-amber-400 to-orange-400 text-white text-[11px] font-bold">
                      <FiStar size={12} /> Hero
                    </span>
                  )}
                  {creator.is_birthday_today && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-linear-to-r from-pink-500 to-purple-600 text-white text-[11px] font-bold">
                      <FiGift size={12} /> Birthday Today
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-purple-400 flex items-center gap-1">
                    <FiZap size={12} /> Tip Creator
                  </span>
                  <div className="h-8 w-8 rounded-full bg-purple-900 text-white flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    →
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div ref={loaderRef} className="mt-12 flex justify-center">
        {loading && (
          <div className="h-6 w-6 rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin" />
        )}
      </div>

      {!nextUrl && creators.length > 0 && (
        <p className="text-center text-[12px] text-purple-300 mt-10">
          You&apos;ve seen all creators
        </p>
      )}
    </>
  );
}
