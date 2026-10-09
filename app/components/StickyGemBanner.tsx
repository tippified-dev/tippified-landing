"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    }, 3200);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const activeGem = GEMS[activeGemIndex];

  return (
    <div className="sticky top-3 z-100 mb-8 flex w-full justify-center px-3">
      <Link
        href="/send-gem"
        aria-label={`Send a Gem to a creator. Current gem: ${activeGem.name}`}
        className="group relative block w-full max-w-105 rounded-2xl outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 active:scale-[0.99]"
      >
        {/* Premium glass-style container */}
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#21103f]/95 shadow-[0_12px_35px_-12px_rgba(46,16,101,0.55)] backdrop-blur-xl">
          {/* Ambient lighting */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-violet-600/20 via-purple-500/10 to-fuchsia-500/20"
          />

          <div className="relative flex min-h-19 items-center justify-between gap-3 px-4 py-3 sm:px-5">
            {/* Text first */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold tracking-tight text-white sm:text-[15px]">
                Send a Gem to a creator
              </p>

              {/* Animated gem name */}
              <div className="mt-1 flex h-5 items-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={activeGem.name}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -8 }
                    }
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="text-xs font-semibold tracking-wide text-purple-200"
                  >
                    {activeGem.name}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Animated gem icon */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.07] sm:h-13 sm:w-13">
              <div
                aria-hidden="true"
                className="absolute inset-1 rounded-full bg-purple-400/10 blur-md transition-colors duration-300 group-hover:bg-purple-400/25"
              />

              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeGem.name}
                  src={activeGem.icon}
                  alt={activeGem.name}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 28, scale: 0.72 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -16, scale: 0.82 }
                  }
                  transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative h-9 w-9 object-contain sm:h-10 sm:w-10"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom accent */}
          <div
            aria-hidden="true"
            className="h-px bg-linear-to-r from-transparent via-purple-400/70 to-transparent"
          />
        </div>

        {/* Subtle outer glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl bg-purple-600/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
        />
      </Link>
    </div>
  );
}
