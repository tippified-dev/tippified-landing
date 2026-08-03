"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactElement } from "react";
import {
  FiBookOpen,
  FiFileText,
  FiHome,
  FiSearch,
  FiShield,
} from "react-icons/fi";

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
    { label: "Search", href: "/search-goals", icon: FiSearch },
    { label: "Blog", href: "/blog", icon: FiBookOpen },
    { label: "Privacy", href: "/privacy-policy", icon: FiShield },
    { label: "T&C", href: "/terms-conditions", icon: FiFileText },
  ];

  const activeIndex: number = links.findIndex(
    (link: NavLink) => link.href === pathname,
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex justify-center sticky top-0 z-50">
        <div className="mt-3 flex items-center gap-1.5 rounded-full border border-purple-100/60 bg-white/80 backdrop-blur-xl p-1.5 shadow-[0_12px_32px_-16px_rgba(124,58,237,0.3)]">
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
                {isActive && (
                  <motion.div
                    layoutId="desktopNav"
                    className="absolute inset-0 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 shadow-[0_8px_16px_-8px_rgba(124,58,237,0.6)]"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
                <span
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all ${
                    isActive
                      ? "text-white"
                      : "text-purple-700/60 hover:text-purple-700 hover:bg-[#f8f5ff]"
                  }`}
                >
                  <Icon size={16} /> {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <div className="mx-auto mb-3 max-w-105 px-3">
          <div className="relative flex justify-around rounded-[1.8rem] border border-purple-100 bg-white/95 backdrop-blur-xl p-2 shadow-[0_16px_40px_-12px_rgba(124,58,237,0.35)]">
            {/* sliding indicator */}
            <motion.div
              className="absolute top-2 bottom-2 rounded-full bg-[#f8f5ff] ring-1 ring-purple-100"
              initial={false}
              animate={{
                left: `calc(${(100 / links.length) * activeIndex}% + 4px)`,
                width: `calc(${100 / links.length}% - 8px)`,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />

            {links.map((link: NavLink) => {
              const Icon = link.icon;
              const isActive: boolean = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className="relative flex-1"
                >
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className={`relative flex flex-col items-center justify-center gap-1 rounded-full py-2.5 transition-all ${
                      isActive ? "text-purple-700" : "text-purple-400"
                    }`}
                  >
                    <div
                      className={`grid place-items-center h-7 w-7 rounded-full transition-all ${
                        isActive
                          ? "bg-linear-to-br from-purple-600 to-indigo-600 text-white shadow-[0_6px_12px_-6px_rgba(124,58,237,0.6)]"
                          : "bg-transparent"
                      }`}
                    >
                      <Icon size={isActive ? 14 : 16} />
                    </div>
                    <span
                      className={`text-[10px] font-bold tracking-wide ${
                        isActive ? "text-purple-700" : "text-purple-400"
                      }`}
                    >
                      {link.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
