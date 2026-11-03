"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiArrowUpRight,
  FiCreditCard,
  FiHelpCircle,
  FiInfo,
  FiLogIn,
  FiPhone,
  FiTarget,
  FiUserPlus,
  FiX,
} from "react-icons/fi";

export default function PremiumHero() {
  const [showCrowdfundingMenu, setShowCrowdfundingMenu] = useState(false);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 12,
  });

  const [mouse, setMouse] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });

  const heroRef = useRef<HTMLElement>(null);
  const crowdfundingRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>): void => {
    if (!heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();

    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const openCrowdfundingMenu = () => {
    if (showCrowdfundingMenu) {
      setShowCrowdfundingMenu(false);
      return;
    }

    const button = crowdfundingRef.current?.querySelector("button");

    if (!button) return;

    const rect = button.getBoundingClientRect();

    const menuWidth = Math.min(320, window.innerWidth - 24);
    const menuHeight = 390;

    const left = Math.max(
      12,
      Math.min(rect.left, window.innerWidth - menuWidth - 12),
    );

    const top = Math.max(
      12,
      Math.min(rect.bottom + 14, window.innerHeight - menuHeight - 12),
    );

    setMenuPosition({ top, left });
    setShowCrowdfundingMenu(true);
  };

  // Close menu with Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowCrowdfundingMenu(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
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

        @keyframes crowdfundingMenuIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        .crowdfunding-menu {
          animation: crowdfundingMenuIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top left;
        }

        @media (prefers-reduced-motion: reduce) {
          .crowdfunding-menu {
            animation: none;
          }
        }
      `}</style>

      {/* SVG FILTER */}
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

      {/* HERO SECTION */}
      <section
        id="hero"
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden min-h-[92vh] bg-linear-to-br from-[#15052E] via-[#4C1D95] to-[#6D28D9] text-white isolate flex items-center py-16 px-6"
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,rgba(124,58,237,0.35),transparent_60%)]" />

        {/* Mouse-following light */}
        <div
          className="absolute pointer-events-none rounded-full mix-blend-screen"
          style={{
            width: 720,
            height: 720,
            left: `${mouse.x}%`,
            top: `${mouse.y}%`,
            transform: "translate(-50%,-50%)",
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.18), rgba(124,58,237,0.22) 18%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />

        {/* Liquid background */}
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
          {/* LEFT CONTENT */}
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
              {/* BECOME A CREATOR */}
              <a
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#4C1D95] font-bold shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)] hover:bg-zinc-100 transition"
              >
                <FiUserPlus />
                Become a Creator
              </a>

              {/* CROWDFUNDING BUTTON */}
              <div ref={crowdfundingRef} className="relative inline-block">
                <button
                  type="button"
                  onClick={openCrowdfundingMenu}
                  aria-expanded={showCrowdfundingMenu}
                  aria-haspopup="dialog"
                  className={`group relative inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl border text-white font-bold transition-all duration-300 ${
                    showCrowdfundingMenu
                      ? "bg-white/20 border-white/40 shadow-[0_0_35px_rgba(196,181,253,0.35)]"
                      : "bg-linear-to-br from-white/[0.14] to-white/8 border-white/20 hover:bg-white/20 hover:border-white/40 shadow-[0_0_40px_rgba(124,58,237,0.35)]"
                  }`}
                >
                  <FiTarget className="text-[18px]" />
                  Start Crowdfunding
                  <span className="ml-1 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.9)] animate-pulse" />
                </button>
              </div>

              {/* HOW IT WORKS */}
              <a
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2E1065]/60 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-[#3B1F8A] transition"
              >
                <FiInfo />
                How it works
              </a>

              {/* FAQ */}
              <a
                href="/faq"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2E1065]/60 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-[#3B1F8A] transition"
              >
                <FiHelpCircle />
                FAQ
              </a>

              {/* TIP */}
              <a
                href="/tip-page"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E1040]/70 backdrop-blur-md border border-white/15 text-white font-semibold hover:bg-[#2A1760] transition"
              >
                <FiCreditCard />
                Tip
              </a>

              {/* CONTACT */}
              <a
                href="/contact-us"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E1040]/70 backdrop-blur-md border border-white/15 text-white font-semibold hover:bg-[#2A1760] transition"
              >
                <FiPhone />
                Contact
              </a>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative h-115 hidden md:flex items-center justify-center">
            <div
              className="absolute top-[8%] right-[8%] w-70 rounded-[22px] p-px bg-linear-to-b from-white/30 to-transparent"
              style={{ animation: "floatA 6s ease-in-out infinite" }}
            >
              <div className="rounded-[21px] bg-white/8 backdrop-blur-xl border border-white/15 p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]">
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

      {/* CROWDFUNDING MENU PORTAL */}
      {showCrowdfundingMenu &&
        createPortal(
          <div
            className="fixed inset-0 z-10000"
            onMouseDown={() => setShowCrowdfundingMenu(false)}
          >
            <div
              role="dialog"
              aria-modal="false"
              aria-label="Tippified Crowdfunding options"
              className="crowdfunding-menu fixed w-[320px] max-w-[calc(100vw-24px)]"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden rounded-3xl bg-white border border-white/80 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.35)]">
                {/* TOP ACCENT */}
                <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-[#A78BFA] via-[#7C3AED] to-[#4C1D95]" />

                <div className="p-5">
                  {/* HEADER */}
                  {/* HEADER */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="h-7 w-7 rounded-lg bg-[#F3EEFF] flex items-center justify-center">
                          <FiTarget className="text-[#7C3AED] text-sm" />
                        </span>

                        <span className="text-[10px] uppercase tracking-[1.8px] font-extrabold text-[#7C3AED]">
                          Tippified Crowdfunding
                        </span>
                      </div>

                      <h3 className="text-[19px] font-extrabold tracking-tight text-[#190D2E]">
                        Every contribution counts.
                      </h3>

                      <p className="text-[12px] leading-5 text-zinc-500 mt-1">
                        Raise funds for a cause and bring the public along every
                        step of the way.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowCrowdfundingMenu(false)}
                      className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition"
                      aria-label="Close crowdfunding menu"
                    >
                      <FiX size={16} />
                    </button>
                  </div>

                  {/* LOGIN OPTION */}
                  <a
                    href="/login"
                    className="group flex items-center gap-3 p-3.5 rounded-2xl border border-zinc-200 hover:border-[#C4B5FD] hover:bg-[#FAF8FF] transition-all duration-300 mb-3"
                  >
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-[#F3EEFF] flex items-center justify-center text-[#7C3AED] group-hover:scale-105 transition-transform">
                      <FiLogIn size={19} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#190D2E]">
                        Log into your account
                      </p>

                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Already have a Tippified account?
                      </p>
                    </div>

                    <FiArrowUpRight className="text-zinc-400 group-hover:text-[#7C3AED] transition" />
                  </a>

                  {/* START CAMPAIGN OPTION */}
                  <a
                    href="/signup"
                    className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-linear-to-br from-[#6D28D9] via-[#5B21B6] to-[#4C1D95] text-white overflow-hidden shadow-[0_8px_20px_-8px_rgba(109,40,217,0.55)] hover:shadow-[0_12px_28px_-8px_rgba(109,40,217,0.65)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative h-11 w-11 shrink-0 rounded-xl bg-white/15 border border-white/15 flex items-center justify-center">
                      <FiTarget size={19} />
                    </div>

                    <div className="relative flex-1 min-w-0">
                      <p className="text-[13px] font-bold">
                        Create a crowdfunding campaign
                      </p>

                      <p className="text-[11px] text-white/65 mt-0.5">
                        For yourself, someone else or an organisation.
                      </p>
                    </div>

                    <FiArrowUpRight className="relative text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  {/* FOOTER */}
                  <div className="flex items-center justify-center gap-1.5 mt-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    <p className="text-[10px] font-medium text-zinc-400">
                      Transparent fundraising. Real-time progress. Public
                      participation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
