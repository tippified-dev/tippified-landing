"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactElement } from "react";
import {
  FiArrowUp,
  FiClock,
  FiDollarSign,
  FiHeart,
  FiInfo,
  FiSearch,
  FiTarget,
  FiTrendingUp,
  FiX,
  FiZap,
} from "react-icons/fi";
import NavBar from "../components/NavBar";

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
interface AboutModalProps {
  goal: PublicGoal | null;
  onClose: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled: T[] = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function SearchGoalsClient(): ReactElement {
  const [goals, setGoals] = useState<PublicGoal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [modalGoal, setModalGoal] = useState<PublicGoal | null>(null);

  const fetchGoals = async (
    pageNum: number = 1,
    query: string = "",
  ): Promise<void> => {
    try {
      setLoading(true);
      const res: Response = await fetch(
        `https://api.tippified.com/api/auth/public-goals/?page=${pageNum}&search=${query}`,
      );
      if (!res.ok) {
        setHasMore(false);
        return;
      }
      const data: { results: PublicGoal[] } = await res.json();
      const results: PublicGoal[] = Array.isArray(data.results)
        ? data.results
        : [];
      const finalResults: PublicGoal[] =
        pageNum === 1 ? shuffleArray(results) : results;
      if (pageNum === 1) setGoals(finalResults);
      else setGoals((prev) => [...prev, ...finalResults]);
      setHasMore(results.length === 10);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchGoals(1, searchQuery);
  }, [searchQuery]);
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore)
          setPage((p) => p + 1);
      },
      { threshold: 1 },
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);
  useEffect(() => {
    if (page !== 1) fetchGoals(page, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const capitalizeWords = (text: string) =>
    text
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const getProgress = (c: string, t: string) =>
    Math.min((Number(c || 0) / Number(t || 1)) * 100, 100);

  const premiumIcon =
    "h-10 w-10 rounded-full bg-gradient-to-br from-[#15052E] to-[#4C1D95] text-white grid place-items-center font-bold text-sm shadow-[0_8px_20px_rgba(21,5,46,0.3)]";
  const premiumBtn =
    "bg-gradient-to-br from-[#15052E] to-[#4C1D95] text-white shadow-[0_10px_24px_-12px_rgba(21,5,46,0.6)]";

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#fdfcff] pb-20">
        {/* SEARCH BAR - fixed */}
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-purple-100/60 bg-white/90 backdrop-blur-xl">
          <div className="absolute left-0 top-0 h-0.5 w-full bg-linear-to-r from-[#15052E] via-[#4C1D95] to-[#7C3AED]" />
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2.5 rounded-full bg-[#f8f5ff] px-4 py-2.5 ring-1 ring-purple-100">
              <FiSearch className="text-[#4C1D95] shrink-0" size={16} />
              <input
                type="text"
                placeholder="Search goals, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-[#15052E] placeholder:text-purple-400 focus:outline-none"
              />
            </div>
            <button
              className={`h-10 w-10 rounded-full ${premiumBtn} grid place-items-center active:scale-95 transition`}
            >
              <FiSearch size={16} />
            </button>
          </div>
        </div>

        {/* GOALS - pushed lower to not hide under search */}
        <section className="mx-auto max-w-5xl px-4 pt-22 md:pt-24">
          {goals.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 rounded-3xl border border-dashed border-purple-200 bg-[#f8f5ff] p-10 text-center"
            >
              <div className={`mx-auto ${premiumIcon}`}>
                <FiTarget size={18} />
              </div>
              <p className="mt-3 text-sm font-bold text-[#15052E]">
                No goals found
              </p>
              <p className="text-xs text-purple-400">Try another keyword</p>
            </motion.div>
          )}

          <div className="flex flex-col gap-4 mt-2">
            {goals.map((goal, idx) => {
              const progress = getProgress(
                goal.current_amount,
                goal.target_amount,
              );
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ y: -2 }}
                  className="group relative overflow-hidden rounded-[1.6rem] border border-purple-100/70 bg-white p-px shadow-[0_12px_32px_-20px_rgba(21,5,46,0.25)]"
                >
                  <div className="rounded-[1.55rem] bg-linear-to-br from-white to-[#f8f5ff] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={premiumIcon}>
                          <FiTarget size={16} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-extrabold text-[15px] leading-tight tracking-tight text-[#15052E] truncate">
                            {capitalizeWords(goal.title)}
                          </h3>
                          <p className="text-[11px] text-purple-500 mt-0.5">
                            by{" "}
                            <span className="font-bold text-[#15052E]">
                              {capitalizeWords(goal.username)}
                            </span>{" "}
                            •
                            <span className="font-mono text-[10px] bg-purple-50 px-1.5 py-0.5 rounded-full ring-1 ring-purple-100 ml-1">
                              {goal.referral_code}
                            </span>
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white ${premiumBtn}`}
                      >
                        <FiZap size={10} /> {progress.toFixed(0)}%
                      </span>
                    </div>

                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#15052E]/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full bg-linear-to-r from-[#15052E] to-[#4C1D95]"
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2.5">
                      <div className="rounded-2xl bg-[#f8f5ff] px-3 py-3 ring-1 ring-purple-50">
                        <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-purple-400">
                          <FiArrowUp size={10} /> Target
                        </p>
                        <p className="mt-1 text-[13px] font-extrabold text-[#15052E]">
                          ₦{Number(goal.target_amount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#f8f5ff] px-3 py-3 ring-1 ring-purple-50">
                        <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-purple-400">
                          <FiTrendingUp size={10} /> Local
                        </p>
                        <p className="mt-1 text-[13px] font-extrabold text-[#15052E]">
                          ₦{Number(goal.current_amount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div
                        className={`rounded-2xl px-3 py-3 text-white ${premiumBtn}`}
                      >
                        <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-purple-200">
                          <FiDollarSign size={10} /> USD
                        </p>
                        <p className="mt-1 text-[13px] font-extrabold">
                          $
                          {Number(
                            goal.current_foreign_usd || 0,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="flex items-center gap-1 text-[11px] text-purple-400">
                        <FiClock size={11} />{" "}
                        {new Date(goal.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={`https://app.tippified.com/tip/${goal.referral_code}`}
                          className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-[11px] font-bold ${premiumBtn} hover:opacity-95 active:scale-[0.97] transition`}
                        >
                          <FiHeart size={12} /> Support
                        </a>
                        <button
                          onClick={() => setModalGoal(goal)}
                          className="inline-flex items-center gap-1 rounded-full border border-purple-100 bg-white px-4 py-2 text-[11px] font-bold text-[#15052E] hover:bg-purple-50 active:scale-[0.97] transition"
                        >
                          <FiInfo size={12} /> About
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div
            ref={loaderRef}
            className="h-16 mt-6 flex justify-center items-center"
          >
            {loading && (
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-purple-100 shadow-sm">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-100 border-t-[#4C1D95]" />
                <p className="text-[12px] font-bold text-[#15052E]">
                  Loading more goals...
                </p>
              </div>
            )}
          </div>
        </section>

        <AboutModal goal={modalGoal} onClose={() => setModalGoal(null)} />

        <a
          href="/about"
          className={`fixed right-4 bottom-20 md:bottom-10 z-50 grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full ${premiumBtn} hover:scale-105 active:scale-95 transition`}
        >
          <FiInfo className="w-5 h-5" />
        </a>
      </main>
    </>
  );
}

const AboutModal: React.FC<AboutModalProps> = ({ goal, onClose }) => {
  if (!goal) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-120 flex items-center justify-center bg-[#15052E]/40 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 24, scale: 0.94, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 24, scale: 0.94, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md overflow-hidden rounded-[1.8rem] border border-purple-100 bg-white shadow-[0_24px_64px_-20px_rgba(21,5,46,0.5)]"
        >
          <div className="h-1.5 w-full bg-linear-to-r from-[#15052E] to-[#4C1D95]" />
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-[#15052E] to-[#4C1D95] text-white">
                  <FiTarget size={16} />
                </div>
                <h2 className="text-[16px] font-extrabold text-[#15052E] leading-tight">
                  {goal.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 grid place-items-center rounded-full bg-purple-50 text-purple-400 hover:bg-purple-100"
              >
                <FiX size={14} />
              </button>
            </div>
            <p className="mt-2 text-[11px] text-purple-500">
              By{" "}
              <span className="font-bold text-[#15052E]">{goal.username}</span>{" "}
              • {goal.referral_code}
            </p>
            <div className="mt-5 max-h-[60vh] overflow-y-auto rounded-2xl bg-[#f8f5ff] p-4 ring-1 ring-purple-50">
              <p className="whitespace-pre-wrap text-[13.5px] leading-6 text-[#15052E]/80">
                {goal.about || "No description provided."}
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={onClose}
                className="rounded-full bg-linear-to-br from-[#15052E] to-[#4C1D95] px-6 py-2.5 text-sm font-bold text-white shadow hover:opacity-95"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
