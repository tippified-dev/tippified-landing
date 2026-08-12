"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Baloo_2 } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiTarget, FiX, FiZap } from "react-icons/fi";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["700", "800"] });

export default function GlobalNotification() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const unlock = () => {
      setUnlocked(true);
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/notification-beep.mp3");
    audioRef.current.volume = 0.7;
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    const interval = setInterval(() => {
      setShow(true);
      audioRef.current?.play().catch(() => {});
      setTimeout(() => setShow(false), 6000);
    }, 60000);
    return () => clearInterval(interval);
  }, [unlocked]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -20, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          className="fixed top-4 right-4 left-4 md:left-auto md:w-90 z-9999"
        >
          <div
            onClick={() => router.push("/search-goals")}
            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-black/6 bg-white/90 p-1 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.25)] backdrop-blur-2xl"
          >
            {/* progress bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 6, ease: "linear" }}
              className="absolute left-0 top-0 h-0.75 bg-[#0a0a0a]"
            />

            <div className="flex items-center gap-3 rounded-[1.2rem] bg-white px-4 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#0a0a0a] text-white shadow-[0_8px_16px_-8px_rgba(0,0,0,0.6)]">
                <FiZap size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <div className={`flex items-center gap-1.5 ${baloo.className}`}>
                  <FiTarget size={12} className="text-zinc-400" />
                  <span className="text-[12px] font-extrabold tracking-tight text-zinc-900 leading-none">
                    New Goal Live
                  </span>
                  <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
                </div>
                <p
                  className={`${baloo.className} mt-1 text-[13px] font-bold leading-4 tracking-tight text-zinc-900`}
                >
                  A creator just dropped a new goal, tap to view.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-white group-hover:bg-black transition">
                  <FiArrowUpRight size={14} />
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShow(false);
                  }}
                  className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition"
                >
                  <FiX size={14} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
