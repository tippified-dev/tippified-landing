"use client";

import { useEffect, useRef, useState } from "react";

interface Creator {
  username: string;
  referral_code: string;
  current_amount: string;
}

export default function TrendingCreatorsBar() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<number | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          "https://api.tippified.com/api/auth/goals/trending/"
        );
        const data = await res.json();
        const creatorsArray = Array.isArray(data) ? data : data.results ?? [];
        setCreators(creatorsArray);
      } catch (err) {
        console.error("Failed to fetch trending creators", err);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    if (!creators.length) return;

    scrollInterval.current = window.setInterval(() => {
      if (!containerRef.current) return;

      const firstChild = containerRef.current.children[0] as HTMLElement;

      containerRef.current.scrollBy({
        left: firstChild.offsetWidth + 16,
        behavior: "smooth",
      });
    }, 4000);

    return () => {
      if (scrollInterval.current !== null) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [creators]);

  
  const capitalizeWords = (text: string): string =>
    text
      ?.trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "";

   const formatAmount = (amount: string) => {
  const num = Number(amount);
  if (isNaN(num)) return amount;
  return num.toLocaleString("en-NG");
};


  return (
    <section className="py-4 bg-purple-50">
      <h2 className="text-2xl font-bold text-center mb-5 text-purple-700">
        Trending Creators
      </h2>

      <div className="overflow-x-auto scrollbar-hide px-4">
        <div ref={containerRef} className="flex gap-4 items-center">

          {creators.map((creator) => (
            <a
              key={creator.referral_code}
              href={`https://app.tippified.com/tip/${creator.referral_code}`}
              className="min-w-55 bg-white border border-purple-100 rounded-xl p-4 shadow hover:shadow-lg transition shrink-0"
            >

              <div className="flex items-center gap-3">

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  {creator.username?.charAt(0).toUpperCase()}
                </div>

                {/* Creator info */}
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 text-sm">
                    {capitalizeWords(creator.username)}
                  </span>

                  <span className="text-xs text-gray-500">
                    @{creator.referral_code}
                  </span>
                </div>
              </div>

              {/* amount */}
              <div className="mt-3 text-sm text-purple-700 font-semibold">
                ₦{formatAmount(creator.current_amount)} raised
              </div>

            </a>
          ))}

        </div>
      </div>
    </section>
  );
}