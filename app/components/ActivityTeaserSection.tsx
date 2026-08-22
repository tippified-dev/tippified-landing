"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";
import { bricolage, fredoka } from "../font";

export default function ActivityTeaserSection() {
  return (
    <section className="relative overflow-hidden bg-[#FCFAFF] px-6 py-16">
      {/* premium soft orbs */}
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#E9D5FF]/50 blur-[70px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#DDD6FE]/60 blur-[70px]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-4xl rounded-[2.5rem] border border-[#E9D5FF] bg-white p-px shadow-[0_20px_60px_-24px_rgba(76,29,149,0.25)]"
      >
        <div className="rounded-[2.4rem] bg-linear-to-b from-white to-[#FDFAFF] px-6 py-10 sm:px-10 sm:py-12 text-center">
          {/* pill */}
          <div className="mb-5 inline-flex items-center rounded-full bg-[#F5F0FF] px-3 py-1 ring-1 ring-[#E9D5FF]">
            <span
              className={`text-[11px] font-bold uppercase tracking-widest text-[#6D28D9] ${bricolage.className}`}
            >
              Live right now
            </span>
          </div>

          <h2
            className={`${fredoka.className} text-[32px] sm:text-[44px] leading-[0.95] tracking-tight text-[#15052E]`}
          >
            New creator goals are
            <span className="relative mx-2 inline-block">
              <span className="relative z-10 bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
                added every day
              </span>
              <div className="absolute bottom-1 left-0 right-0 h-3 bg-[#E9D5FF]/60 -rotate-1" />
            </span>
          </h2>

          <p
            className={`${bricolage.className} mx-auto mt-4 max-w-xl text-[15px] sm:text-[16px] leading-7 font-medium text-[#52525B]`}
          >
            Fans are supporting creators across Nigeria in real time. Find
            someone to cheer on today.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3">
            <Link
              id="discover"
              href="/search-goals"
              className={`${bricolage.className} group inline-flex items-center gap-2 rounded-full bg-[#15052E] px-7 py-3.5 text-[14px] font-bold text-white shadow-[0_10px_24px_-12px_rgba(21,5,46,0.7)] transition hover:bg-[#1e1065]`}
            >
              Discover creators
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#15052E] transition group-hover:translate-x-0.5">
                <ArrowRightIcon className="h-4 w-4" />
              </span>
            </Link>
            <p
              className={`${bricolage.className} text-[11px] font-semibold text-[#A1A1AA]`}
            >
              2,000+ goals live • updated every minute
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
