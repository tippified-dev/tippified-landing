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

  const scrollInterval = useRef<number | null>(null);

  // Fetch trending creators
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

  // Auto scroll horizontally
  useEffect(() => {
    if (!creators.length) return;
    scrollInterval.current = window.setInterval(() => {
      if (!containerRef.current) return;
      const firstChild = containerRef.current.children[0] as HTMLElement;
      if (!firstChild) return;

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

  const handleClick = (index: number) => {
    setActiveIndex(index);
    setTimeout(() => setActiveIndex(null), 3000); // auto close after 3s
  };

  const handleClose = () => {
    setActiveIndex(null);
  };

  return (
    <div className="py-6 bg-purple-50">
      <h2 className="text-2xl font-bold text-center mb-4 text-purple-700">
        Trending Creators
      </h2>

      <div className="overflow-x-auto scrollbar-hide px-4">
        <div ref={containerRef} className="flex gap-4 items-center">
          {Array.isArray(creators) &&
            creators.map((creator, i) => (
              <div key={creator.referral_code} className="relative">
                {/* Collapsed view */}
                <div
                  onClick={() => handleClick(i)}
                  className={`shrink-0 rounded-full bg-purple-600 text-white px-4 py-2 cursor-pointer text-sm text-center transition-all duration-500 ease-in-out ${
                    activeIndex === i ? "opacity-0 pointer-events-none" : ""
                  }`}
                >
                  {creator.referral_code}
                </div>

                {/* Expanded view */}
                {activeIndex === i && (
                  <div className="absolute top-12 left-0 w-56 bg-purple-700 text-white rounded-xl p-4 shadow-lg z-10 flex flex-col gap-2 animate-slideDown">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{creator.username}</span>
                      <button
                        onClick={handleClose}
                        className="text-white hover:text-gray-200 font-bold"
                      >
                        ✖
                      </button>
                    </div>
                    <span className="text-sm">{creator.referral_code}</span>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      <style jsx>{`
        .animate-slideDown {
          animation: slideDown 0.3s ease forwards;
        }

        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}