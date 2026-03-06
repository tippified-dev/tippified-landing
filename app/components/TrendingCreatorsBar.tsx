"use client";

import { useEffect, useRef, useState } from "react";

interface Creator {
  username: string;
  referral_code: string;
  current_amount: string;
}

export default function TrendingCreatorsBar() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll index
  const scrollInterval = useRef<number | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("https://api.tippified.com/api/auth/goals/trending/");
        const data = await res.json();
        setCreators(data);
      } catch (err) {
        console.error("Failed to fetch trending creators", err);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    if (!creators.length) return;

    scrollInterval.current = window.setInterval(() => {
      setActiveIndex((prev) => {
        if (prev === null || prev === creators.length - 1) return 0;
        return prev + 1;
      });
    }, 4000); // auto scroll every 4s

    return () => {
      if (scrollInterval.current !== null) {
        clearInterval(scrollInterval.current)};
    };
  }, [creators]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    setTimeout(() => setActiveIndex(null), 2000); // auto close after 2s
  };

  return (
    <div className="overflow-x-auto scrollbar-hide py-4 bg-purple-50">
      <div
        ref={containerRef}
        className="flex gap-4 items-center px-4"
      >
        {creators.map((creator, i) => (
          <div
            key={creator.referral_code}
            onClick={() => handleClick(i)}
            className={`
              shrink-0 rounded-full bg-purple-600 text-white px-4 py-2 cursor-pointer
              transition-all duration-500 ease-in-out
              ${activeIndex === i ? "w-56 bg-purple-700" : "w-20"}
            `}
          >
            {activeIndex === i ? (
              <div className="flex justify-between items-center">
                <span className="font-semibold">{creator.username}</span>
                <span className="text-xs ml-2">{creator.referral_code}</span>
              </div>
            ) : (
              <span className="text-sm text-center">{creator.referral_code}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}