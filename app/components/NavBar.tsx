"use client";

import { motion } from "framer-motion";
import { Baloo_2 } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactElement } from "react";
import {
  FiCompass,
  FiFileText,
  FiHome,
  FiShield,
  FiTarget,
} from "react-icons/fi";

const baloo = Baloo_2({ subsets: ["latin"], weight: ["700", "800"] });

interface NavBarProps {
  onNavigate?: () => void;
}

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export default function NavBar({ onNavigate }: NavBarProps): ReactElement {
  const pathname: string = usePathname();

  const links: NavLink[] = [
    { label: "Home", href: "/", icon: FiHome },
    { label: "Goals", href: "/search-goals", icon: FiTarget },
    { label: "Explore", href: "/explore", icon: FiCompass },
    { label: "Privacy", href: "/privacy-policy", icon: FiShield },
    { label: "T&C", href: "/terms-conditions", icon: FiFileText },
  ];

  return (
    <>
      {/* Desktop - bolder, cleaner, no highlighter */}
      <nav className="hidden md:flex justify-center sticky top-0 z-50">
        <div className="mt-5 flex items-center gap-1 rounded-full border border-black/8 bg-white/80 p-1.5 backdrop-blur-2xl shadow-[0_16px_40px_-16px_rgba(0,0,0,0.2)]">
          {links.map((link: NavLink) => {
            const Icon = link.icon;
            const isActive: boolean = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
                    isActive
                      ? "bg-[#0a0a0a] text-white"
                      : "text-zinc-400 hover:text-zinc-900"
                  }`}
                >
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full transition ${
                      isActive
                        ? "bg-white text-black"
                        : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    <Icon size={14} />
                  </span>
                  <span
                    className={`${baloo.className} text-[14px] font-extrabold tracking-tight leading-none pt-0.5`}
                  >
                    {link.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile - no active bg pill, only icon flips to black */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50 w-full border-t border-black/10 bg-white/95 backdrop-blur-2xl">
        <div className="flex justify-between gap-1 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {links.map((link: NavLink) => {
            const Icon = link.icon;
            const isActive: boolean = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate}
                className="flex-1"
              >
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="flex flex-col items-center gap-1.5 py-1"
                >
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-purple-600 text-white shadow-[0_8px_16px_-8px_rgba(0,0,0,0.6)]"
                        : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    className={`${baloo.className} text-[11px] font-bold leading-none tracking-tight ${isActive ? "text-[#0a0a0a]" : "text-zinc-400"}`}
                  >
                    {link.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
