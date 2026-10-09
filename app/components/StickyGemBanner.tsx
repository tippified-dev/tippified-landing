"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";

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

export default function StickyGemBanner() {
  const [activeGemIndex, setActiveGemIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveGemIndex((current) => (current + 1) % GEMS.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const activeGem = GEMS[activeGemIndex];

  return (
    <div className="sticky top-0 z-100 w-full">
      <Link
        href="/send-gem"
        aria-label="Send a Gem to a creator on Tippified"
        className="group block w-full"
      >
        <div className="relative overflow-hidden border-b border-white/10 bg-[#21103f] shadow-[0_8px_24px_-12px_rgba(40,12,75,0.55)]">
          {/* Ambient background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-purple-700/20 via-transparent to-fuchsia-500/10"
          />

          <div className="relative mx-auto flex min-h-15.5 max-w-7xl items-center justify-center gap-3 px-3 py-2 sm:gap-4 sm:px-6">
            {/* Animated Gem */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.07] sm:h-11 sm:w-11">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeGem.name}
                  src={activeGem.icon}
                  alt={activeGem.name}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 24, scale: 0.7, rotate: -12 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -18, scale: 0.8, rotate: 12 }
                  }
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-8 w-8 object-contain sm:h-9 sm:w-9"
                />
              </AnimatePresence>
            </div>

            {/* Banner text */}
            <div className="flex min-w-0 flex-col justify-center">
              <span className="text-[12px] font-extrabold tracking-tight text-white sm:text-sm">
                Send a Gem to a creator
              </span>

              <span className="mt-0.5 hidden text-[10px] font-medium text-purple-200/80 sm:block sm:text-[11px]">
                Celebrate the creators you love
              </span>
            </div>

            {/* CTA */}
            <div className="ml-auto flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/8 py-2 pl-3 pr-2.5 transition duration-300 group-hover:border-purple-300/40 group-hover:bg-white/[0.14] sm:ml-3 sm:pl-4 sm:pr-3">
              <span className="text-[10px] font-bold text-white sm:text-xs">
                Explore
              </span>

              <FiArrowRight
                size={14}
                className="text-purple-200 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </div>
          </div>

          {/* Fine accent line */}
          <div
            aria-hidden="true"
            className="h-px w-full bg-linear-to-r from-transparent via-purple-400/60 to-transparent"
          />
        </div>
      </Link>
    </div>
  );
}
