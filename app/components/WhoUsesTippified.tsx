"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const roles = [
  "Musicians",
  "Social Media Influencers",
  "Actors",
  "Skit Makers",
  "Content Creators",
  "Dancers",
  "Podcasters",
  "Anyone with fans and supporters",
];

export default function WhoUsesTippified() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#FCFAFF] py-24 px-6">
      {/* premium background */}
      <div className="absolute inset-0 bg-linear-to-b from-white via-[#F5F0FF]/80 to-white pointer-events-none" />
      <div className="absolute left-1/2 -top-32 -translate-x-1/2 h-150 w-200 rounded-full bg-linear-to-br from-[#E9D5FF]/60 via-[#DDD6FE]/40 to-[#C4B5FD]/30 blur-[80px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E9D5FF] shadow-[0_2px_10px_-4px_rgba(76,29,149,0.15)] mb-6">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-[#4C1D95] to-[#6D28D9] flex items-center justify-center">
            <UserGroupIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#4C1D95]">
            Built for every creator
          </span>
          <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
        </div>

        <h2 className="text-3xl md:text-[42px] font-extrabold tracking-tight text-[#15052E] mb-8">
          Who uses{" "}
          <span className="bg-linear-to-r from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] bg-clip-text text-transparent">
            Tippified?
          </span>
        </h2>

        {/* main rotator card - premium */}
        <div className="relative mx-auto max-w-3xl">
          <div className="relative rounded-4xl bg-linear-to-br from-white to-[#FAF5FF] border border-[#E9D5FF] shadow-[0_20px_60px_-20px_rgba(76,29,149,0.25),0_0_0_1px_rgba(255,255,255,0.8)_inset] p-8 md:p-12 overflow-hidden">
            {/* inner glow */}
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#6D28D9]/10 blur-3xl pointer-events-none" />

            <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#7C3AED] mb-6">
              Creator spotlight
            </p>

            <div className="relative h-14 md:h-16 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={roles[index]}
                  initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -30, opacity: 0, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1E0B4B]"
                >
                  {roles[index]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="h-1 w-24 rounded-full bg-linear-to-r from-[#4C1D95] to-[#7C3AED]" />
            </div>
          </div>
        </div>

        {/* interactive chips - uses your dashboard colors */}
        <div className="flex flex-wrap justify-center gap-2.5 mt-10 max-w-2xl mx-auto">
          {roles.map((role, i) => (
            <button
              key={role}
              onClick={() => setIndex(i)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-300 ${
                index === i
                  ? "bg-[#4C1D95] text-white border-[#4C1D95] shadow-[0_6px_16px_-4px_rgba(76,29,149,0.4)] scale-[1.02]"
                  : "bg-white text-[#3B1F8A] border-[#E9D5FF] hover:border-[#C4B5FD] hover:bg-[#F5F0FF]"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <p className="text-[15px] leading-6 text-[#3F3F46] mt-10 max-w-xl mx-auto font-medium">
          If you create content and have people who support you,{" "}
          <span className="text-[#4C1D95] font-bold">
            Tippified is for you.
          </span>
        </p>
      </div>
    </section>
  );
}
