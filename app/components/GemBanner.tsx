"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiHexagon } from "react-icons/fi";

interface GemBannerProps {
  creatorName: string;
  referralCode: string;
}

const GEMS = [
  {
    name: "Quartz",
    icon: "https://10ml9n8mcm.ucarecd.net/22f58663-ac09-4ee5-83ee-ae34988b8318/Quartz.png",
  },
  {
    name: "Amethyst",
    icon: "https://10ml9n8mcm.ucarecd.net/61516a08-d672-44c5-b6f4-cafcb80d0466/Amethyst.png",
  },
  {
    name: "Sapphire",
    icon: "https://10ml9n8mcm.ucarecd.net/554ea701-9b79-4b66-9b24-9f3a05890e7d/Sapphire.png",
  },
  {
    name: "Emerald",
    icon: "https://10ml9n8mcm.ucarecd.net/d5c36259-67c8-4e9d-bc56-a4b418b9f6ee/Emerald.png",
  },
  {
    name: "Ruby",
    icon: "https://10ml9n8mcm.ucarecd.net/b3cdde23-26ec-43e8-9501-16883698b22a/Ruby.png",
  },
  {
    name: "Diamond",
    icon: "https://10ml9n8mcm.ucarecd.net/e3387dad-d1f2-4fb2-975e-d11f91d248fc/Diamond.png",
  },
];

export default function GemBanner({
  creatorName,
  referralCode,
}: GemBannerProps) {
  const [activeGemIndex, setActiveGemIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveGemIndex((current) => (current + 1) % GEMS.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const activeGem = GEMS[activeGemIndex];

  const tipPageUrl = `https://app.tippified.com/tip/${encodeURIComponent(
    referralCode,
  )}`;

  return (
    <Link
      href={tipPageUrl}
      aria-label={`Send a Gem to ${creatorName}. Current gem: ${activeGem.name}`}
      className="group relative block w-full overflow-hidden rounded-[1.75rem] border border-purple-100/80 bg-white text-[#211536] shadow-[0_16px_45px_-28px_rgba(91,33,182,0.3)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-[0_22px_50px_-28px_rgba(91,33,182,0.4)] focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
    >
      {/* Subtle ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-purple-50/90 via-white to-violet-50/70"
      />

      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-purple-200/30 blur-3xl transition-colors duration-500 group-hover:bg-purple-300/40"
      />

      <div className="relative flex min-h-28 items-center justify-between gap-4 p-4 sm:p-5">
        {/* Creator-specific text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-purple-700 text-white shadow-[0_5px_12px_-5px_rgba(109,40,217,0.7)]">
              <FiHexagon size={15} />
            </div>

            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-purple-700/65">
              Show your appreciation
            </span>
          </div>

          <h3 className="mt-3 text-[15px] font-extrabold tracking-tight text-purple-950 sm:text-base">
            Send a Gem to {creatorName}
          </h3>

          <div className="mt-1.5 flex min-h-5 items-center gap-1.5 text-xs text-zinc-500">
            <span>Make their day with</span>

            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={activeGem.name}
                initial={
                  prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 7 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -7 }
                }
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="font-bold text-purple-700"
              >
                {activeGem.name}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Animated Gem */}
        <div className="relative grid h-17 w-17 shrink-0 place-items-center rounded-2xl border border-purple-100 bg-white/80 shadow-[0_8px_24px_-16px_rgba(91,33,182,0.5)] transition-all duration-300 group-hover:border-purple-200 group-hover:bg-white sm:h-19 sm:w-19">
          <div
            aria-hidden="true"
            className="absolute inset-2 rounded-full bg-purple-100/70 blur-xl transition-colors duration-300 group-hover:bg-purple-200/80"
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={activeGem.name}
              src={activeGem.icon}
              alt={activeGem.name}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 15, scale: 0.8 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -10, scale: 0.85 }
              }
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative h-12 w-12 object-contain sm:h-14 sm:w-14"
            />
          </AnimatePresence>
        </div>

        {/* Action indicator */}
        <div className="absolute bottom-3 right-3 grid h-7 w-7 place-items-center rounded-full border border-purple-100 bg-white/90 text-purple-700 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-purple-700 group-hover:text-white sm:bottom-4 sm:right-4">
          <FiArrowUpRight size={14} />
        </div>
      </div>

      {/* Refined bottom accent */}
      <div
        aria-hidden="true"
        className="relative h-px bg-linear-to-r from-transparent via-purple-200 to-transparent transition-all duration-300 group-hover:via-purple-400"
      />
    </Link>
  );
}
