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
      {/* Desktop - same token as trending card header */}
      <nav className="hidden md:flex justify-center sticky top-0 z-50">
        <div className="relative mt-4 flex items-center gap-1.5 rounded-full border border-purple-100/70 bg-white p-1 shadow-[0_20px_60px_-24px_rgba(124,58,237,0.2)]">
          <div className="absolute left-0 top-0 h-0.5 w-full bg-linear-to-r from-purple-600 via-violet-500 to-indigo-500 rounded-full" />
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
                    layoutId="desktopNavCreatorSample"
                    className="absolute inset-0 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 shadow-[0_8px_16px_-8px_rgba(124,58,237,0.6)]"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
                <span
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition ${
                    isActive
                      ? "text-white"
                      : "text-purple-700/60 hover:text-purple-700 hover:bg-[#f8f5ff]"
                  }`}
                >
                  <Icon size={15} /> {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Tab - creator bottom tab style, built from trending card */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <div className="mx-auto mb-3 max-w-105 px-3">
          <div className="relative rounded-3xl border border-purple-100/70 bg-white p-px shadow-[0_20px_60px_-24px_rgba(124,58,237,0.2)]">
            <div className="absolute left-0 top-0 h-0.5 w-full bg-linear-to-r from-purple-600 via-violet-500 to-indigo-500 rounded-full" />
            <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-linear-to-br from-purple-100 to-violet-100 blur-2xl opacity-60 pointer-events-none" />

            <div className="relative flex justify-around rounded-[1.45rem] bg-linear-to-br from-white to-[#f8f5ff] p-2">
              {/* active bg */}
              <motion.div
                className="absolute top-2 bottom-2 rounded-full bg-white border border-purple-100 shadow-sm"
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
                      className={`relative flex flex-col items-center justify-center gap-1 rounded-full py-2.5 transition`}
                    >
                      <div
                        className={`grid place-items-center h-8 w-8 rounded-xl transition-all ${
                          isActive
                            ? "bg-linear-to-br from-purple-600 to-indigo-600 text-white shadow-[0_8px_16px_-8px_rgba(124,58,237,0.6)]"
                            : "bg-[#f8f5ff] text-purple-400 ring-1 ring-purple-100"
                        }`}
                      >
                        <Icon size={15} />
                      </div>
                      <span
                        className={`text-[10px] font-bold tracking-wide ${
                          isActive ? "text-purple-900" : "text-purple-400"
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
        </div>
      </nav>
    </>
  );
}
