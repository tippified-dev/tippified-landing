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
    }, 2400);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const activeGem = GEMS[activeGemIndex];

  return (
    <>
      {/* Floating banner */}
      <div className="fixed inset-x-0 top-3 z-100 flex justify-center px-3 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-85 sm:max-w-95.5">
          <div className="relative rounded-full bg-linear-to-r from-[#18072f] via-[#30105a] to-[#24103f] p-px shadow-[0_12px_36px_-12px_rgba(45,16,85,0.65)]">
            <div className="relative flex items-center gap-3 overflow-hidden rounded-full border border-white/8 bg-[#211039]/95 px-3 py-2.5 backdrop-blur-2xl">
              {/* Subtle ambient glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-purple-500/13 via-transparent to-fuchsia-400/8"
              />

              {/* Clickable animated Gem */}
              <Link
                href="/send-gem"
                aria-label={`Send a Gem to a creator. Current Gem: ${activeGem.name}`}
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-300/20 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors hover:bg-white/13 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeGem.name}
                    src={activeGem.icon}
                    alt={activeGem.name}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : {
                            opacity: 0,
                            y: 20,
                            scale: 0.65,
                            rotate: -12,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      rotate: 0,
                    }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            y: -15,
                            scale: 0.8,
                            rotate: 10,
                          }
                    }
                    transition={{
                      duration: 0.42,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-8 w-8 object-contain"
                  />
                </AnimatePresence>

                {/* Gem glow */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/6"
                />
              </Link>

              {/* Text */}
              <Link
                href="/send-gem"
                className="relative min-w-0 flex-1 py-0.5 focus-visible:outline-none"
              >
                <span className="block truncate text-[12px] font-extrabold tracking-[-0.02em] text-white sm:text-[13px]">
                  Send a Gem to a creator
                </span>

                <span className="mt-0.5 block truncate text-[10px] font-medium text-purple-200/65">
                  Celebrate the creators you love
                </span>
              </Link>

              {/* Fine decorative accent */}
              <div
                aria-hidden="true"
                className="relative mr-1 h-7 w-px shrink-0 bg-linear-to-b from-transparent via-purple-300/30 to-transparent"
              />

              <span
                aria-hidden="true"
                className="relative mr-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.8)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reserve space when the component is first placed in the page.
          The fixed banner itself does not occupy layout space. */}
      <div aria-hidden="true" className="mb-4 h-0" />
    </>
  );
}
