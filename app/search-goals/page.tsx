"use client";

import { ArrowUpIcon, BanknotesIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
// import { Pacifico } from "next/font/google";

interface PublicGoal {
  id: number;
  username: string;
  referral_code: string;
  title: string;
  about: string;
  target_amount: string;
  current_amount: string;
  current_foreign_usd: string;
  created_at: string;
}

export default function SearchGoalsPage() {
  const [goals, setGoals] = useState<PublicGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
 
  const [modalGoal, setModalGoal] = useState<PublicGoal | null>(null);

  const fetchGoals = async (pageNum = 1, query = "") => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.tippified.com/api/auth/public-goals/?page=${pageNum}&search=${query}`
      );
      const data = await res.json();
      if (data.results) {
        if (pageNum === 1) setGoals(data.results);
        else setGoals((prev) => [...prev, ...data.results]);
        setHasMore(data.results.length === 10); // if less than 10 returned, no more pages
      } else {
        setGoals(data);
        setHasMore(data.length === 10);
      }
    } catch (err) {
      console.error("Failed to fetch goals", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and fetch on search query change
  useEffect(() => {
    setPage(1);
    fetchGoals(1, searchQuery);
  }, [searchQuery]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  // Fetch next page when page changes
  useEffect(() => {
    if (page === 1) return; 
    fetchGoals(page, searchQuery);
  }, 
   // eslint-disable-next-line react-hooks/exhaustive-deps
  [page]);

  const capitalizeWords = (text: string) => {
    if (!text) return "";
    return text
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <>
      <NavBar />

      <main className="bg-white text-gray-900 pt-16">
        {/* Fixed search bar */}
        <div className="fixed top-0 left-0 right-0 bg-white px-4 py-3 shadow z-50 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition">
            Search
          </button>
        </div>

        <section className="pt-20 px-4">
          {goals.length === 0 && !loading && (
            <p className="text-center text-gray-500 mt-10">No goals found</p>
          )}

          <div className="flex flex-col gap-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="border border-purple-500 rounded-lg p-4 shadow hover:shadow-lg transition"
              >
                <h3 className="font-bold text-lg mb-1">{capitalizeWords(goal.title)}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  by <span className="font-semibold">{capitalizeWords(goal.username)}</span> - (
                  <span className="font-semibold">{goal.referral_code}</span>)
                </p>

                <p className="text-sm mb-1 flex items-center gap-1">
                  <ArrowUpIcon className="w-4 h-4 text-purple-600" /> Target: ₦{goal.target_amount}
                </p>
                <p className="text-sm mb-1 flex items-center gap-1">
                  <BanknotesIcon className="w-4 h-4 text-purple-600" /> Local: ₦{goal.current_amount}
                </p>
                <p className="text-sm mb-1 flex items-center gap-1">
                  <CurrencyDollarIcon className="w-4 h-4 text-purple-600" /> Foreign: ${goal.current_foreign_usd}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  Created: {new Date(goal.created_at).toLocaleDateString()}
                </p>

                <div className="flex gap-2 mt-3">
                  <a
            href={`https://app.tippified.com/tip/${goal.referral_code}`}
            className="flex-1 text-center text-xs bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Support 
          </a>

          <button
            className="flex-1 text-center text-xs bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
            onClick={() => setModalGoal(goal)}
          >
            About
          </button>
                </div>
              </div>
            ))}
          </div>

          {modalGoal && (
  <div
    className="fixed inset-0 bg-purple-500 bg-opacity-50 flex items-center justify-center p-4 z-50"
    onClick={() => setModalGoal(null)}
  >
    <div
      className="bg-white rounded-lg max-w-md w-full p-6 relative"
      onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={() => setModalGoal(null)}
      >
        ✖
      </button>
      <h3 className="text-xl font-bold mb-4">{capitalizeWords(modalGoal.title)}</h3>
      <p className="text-gray-700 mb-2">
        By: <span className="font-semibold">{capitalizeWords(modalGoal.username)}</span>
      </p>
      <p className="text-gray-700">{modalGoal.about}</p>
    </div>
  </div>
 )}

          {/* Loader div for infinite scroll */}
          <div ref={loaderRef} className="h-10 mt-4 flex justify-center items-center">
            {loading && <p className="text-gray-500 text-sm">Loading more goals...</p>}
          </div>
        </section>
      </main>
    </>
  );
}