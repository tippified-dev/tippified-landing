"use client";
import { useEffect, useRef, useState } from "react";
import {
  FiCreditCard,
  FiHelpCircle,
  FiInfo,
  FiLock,
  FiPhone,
  FiTarget,
  FiUserPlus,
} from "react-icons/fi";

export default function PremiumHero() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [mouse, setMouse] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const heroRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>): void => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const openModal = () => {
    setShowModal(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setShowModal(false), 620);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Inter:wght@700;800;900&display=swap');

  .pacifico {
    font-family: 'Pacifico', cursive;
  }

  @keyframes blobFloat1 {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(22px, -18px) scale(1.04);
    }
    66% {
      transform: translate(-8px, 12px) scale(0.98);
    }
  }

  @keyframes floatA {
    0%, 100% {
      transform: translate3d(0, 0, 0) rotate(-1.5deg);
    }
    50% {
      transform: translate3d(8px, -18px, 0) rotate(1deg);
    }
  }

  @keyframes modalIn {
    from {
      transform: scale(0.96) translateY(18px);
      filter: blur(20px);
      opacity: 0;
    }
    to {
      transform: scale(1) translateY(0);
      filter: blur(0);
      opacity: 1;
    }
  }

  @keyframes modalOut {
    from {
      transform: scale(1) translateY(0);
      filter: blur(0);
      opacity: 1;
    }
    to {
      transform: scale(0.94) translateY(16px);
      filter: blur(18px);
      opacity: 0;
    }
  }
`}</style>

      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <filter id="gooey-liquid">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="18"
              result="blur"
            />

            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 20 -8"
              result="goo"
            />

            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <section
        id="hero"
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden min-h-[92vh] bg-linear-to-br from-[#15052E] via-[#4C1D95] to-[#6D28D9] text-white isolate flex items-center py-16 px-6"
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,rgba(124,58,237,0.35),transparent_60%)]" />
        <div
          className="absolute pointer-events-none rounded-full mix-blend-screen"
          style={{
            width: 720,
            height: 720,
            left: `${mouse.x}%`,
            top: `${mouse.y}%`,
            transform: "translate(-50%,-50%)",
            background: `radial-gradient(closest-side, rgba(255,255,255,0.18), rgba(124,58,237,0.22) 18%, transparent 70%)`,
            filter: "blur(10px)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ filter: "url(#gooey-liquid)" }}
        >
          <div
            className="absolute rounded-[50%]"
            style={{
              width: 820,
              height: 820,
              right: "-16%",
              top: "-26%",
              background:
                "radial-gradient(60% 60% at 40% 40%, #9B6BFF 0%, #7C3AED 35%, #4C1D95 72%, transparent 78%)",
              opacity: 0.9,
              animation: "blobFloat1 14s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center w-full">
          <div>
            <p className="pacifico text-xl mb-4">tippified.</p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[0.95] tracking-tight mb-6">
              Get Tippified for What You Create
            </h1>
            <p className="text-[15px] md:text-[17px] leading-7 text-white/85 mb-8 max-w-xl font-medium">
              An all-in-one creator monetization platform. Receive tips, gifts,
              goal contributions, live streaming, crowd funding and wishlist
              purchases with secure payments.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#4C1D95] font-bold shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)] hover:bg-zinc-100 transition"
              >
                <FiUserPlus /> Become a Creator
              </a>
              <button
                onClick={openModal}
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-br from-white/[0.14] to-white/8 backdrop-blur-xl border border-white/20 text-white font-bold hover:from-white/18  transition-all shadow-[0_0_40px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]"
              >
                <FiTarget className="text-[18px]" /> Start Crowdfunding
                <span className="ml-1 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)] animate-pulse" />
              </button>
              <a
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2E1065]/60 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-[#3B1F8A] transition"
              >
                <FiInfo /> How it works
              </a>
              <a
                href="/faq"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2E1065]/60 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-[#3B1F8A] transition"
              >
                <FiHelpCircle /> FAQ
              </a>
              <a
                href="/tip-page"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E1040]/70 backdrop-blur-md border border-white/15 text-white font-semibold hover:bg-[#2A1760] transition"
              >
                <FiCreditCard /> Tip
              </a>
              <a
                href="/contact-us"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E1040]/70 backdrop-blur-md border border-white/15 text-white font-semibold hover:bg-[#2A1760] transition"
              >
                <FiPhone /> Contact
              </a>
            </div>
          </div>

          <div className="relative h-115 hidden md:flex items-center justify-center">
            <div
              className="absolute top-[8%] right-[8%] w-70 rounded-[22px] p-pxbg-linear-to-b from-white/30 to-transparent"
              style={{ animation: "floatA 6s ease-in-out infinite" }}
            >
              <div className="rounded-[21px] bg-white/8 backdrop-blur-x1 border border-white/15 p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-[#C4B5FD] to-[#8B5CF6] flex items-center justify-center font-bold">
                    A
                  </div>
                  <div>
                    <p className="text-[13px] font-bold">₦45,000 tipped</p>
                    <p className="text-[11px] text-white/60">
                      by Amaka • just now
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-4.5 rounded-full bg-black/40 blur-[10px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-5">
          <div
            className="absolute inset-0 bg-[#15052E]/60 backdrop-blur-x1"
            style={{ opacity: isModalOpen ? 1 : 0, transition: "all 600ms" }}
            onClick={() => setIsModalOpen(false)}
          />
          <div
            className="relative w-full max-w-105 rounded-4x1 overflow-hidden"
            style={{
              animation: isModalOpen
                ? "modalIn 0.62s cubic-bezier(0.16,1,0.3,1) forwards"
                : "modalOut 0.52s cubic-bezier(0.16,1,0.3,1) forwards",
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-linear-to-b from-white/[0.14] to-white/4 backdrop-blur-2x1 border border-white/20 rounded-4x1 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_30px_90px_-20px_rgba(0,0,0,0.8)]" />
            <div className="absolute top-0 inset-x-[18%] h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />
            <div className="relative p-8 pt-9">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-linear-to-b from-white/18 to-white/6 border border-white/20 flex items-center justify-center">
                  <div className="h-11 w-11 rounded-full bg-linear-to-br from-[#7C3AED] to-[#4C1D95] flex items-center justify-center text-white">
                    <FiLock className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-[22px] font-extrabold tracking-tight text-white">
                  Crowdfunding coming soon
                </h3>
                <p className="mt-5 text-[15px] leading-[1.6] font-semibold text-white">
                  Sorry, you can not use this feature at the moment
                </p>
                <p className="mt-3 text-[13.5px] leading-[1.6] text-white/60 max-w-[320px] mx-auto">
                  Check back later.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="relative mt-8 w-full h-12 rounded-full bg-white text-[#15052E] font-bold text-[14.5px] active:scale-[0.97] overflow-hidden"
              >
                <span className="absolute inset-x-0 top-0 h-[60%] bg-linear-to-b from-white to-white/80 rounded-full" />
                <span className="relative">Dismiss ✦</span>
              </button>
              <p className="mt-4 text-center text-[11px] text-white/40">
                Press Esc or tap outside to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
