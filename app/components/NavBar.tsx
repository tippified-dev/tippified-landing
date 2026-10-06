"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Baloo_2 } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactElement } from "react";
import {
  FiCompass,
  FiFileText,
  FiHome,
  FiInfo,
  FiShield,
  FiTarget,
  FiUsers,
} from "react-icons/fi";
const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["700", "800"],
});
interface NavBarProps {
  onNavigate?: () => void;
}
interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}
export default function NavBar({ onNavigate }: NavBarProps): ReactElement {
  const pathname: string = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  /*
   * Main navigation
   * These appear directly in the mobile bottom navbar
   */
  const links: NavLink[] = [
    {
      label: "Home",
      href: "/",
      icon: FiHome,
    },
    {
      label: "Goals",
      href: "/search-goals",
      icon: FiTarget,
    },
    {
      label: "Explore",
      href: "/explore",
      icon: FiCompass,
    },
    {
      label: "Privacy",
      href: "/privacy-policy",
      icon: FiShield,
    },
    {
      label: "T&C",
      href: "/terms-conditions",
      icon: FiFileText,
    },
  ];
  /*
   * Hamburger menu
   *
   * Add more items here whenever you want.
   */
  const menuLinks: NavLink[] = [
    {
      label: "About",
      href: "/about",
      icon: FiInfo,
    },
    {
      label: "Privacy",
      href: "/privacy-policy",
      icon: FiShield,
    },
    {
      label: "T&C",
      href: "/terms-conditions",
      icon: FiFileText,
    },
    {
      label: "Signup",
      href: "/signup",
      icon: FiUsers,
    },
  ];
  const closeMenu = () => {
    setIsMenuOpen(false);
    onNavigate?.();
  };
  return (
    <>
      {/* Desktop */}
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
      {/* Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50 w-full border-t border-black/10 bg-white/95 backdrop-blur-2xl">
        <div className="relative flex items-center justify-between gap-1 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {/* Main navigation */}
          {links
            .filter((link) => link.label !== "T&C")
            .map((link: NavLink) => {
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
                      className={`${baloo.className} text-[11px] font-bold leading-none tracking-tight ${
                        isActive ? "text-[#0a0a0a]" : "text-zinc-400"
                      }`}
                    >
                      {link.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          {/* Hamburger Menu */}
          <div className="relative flex-1">
            {/* Upward menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.85,
                    y: 20,
                    transformOrigin: "bottom right",
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.85,
                    y: 20,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 28,
                  }}
                  className="absolute bottom-17 right-0 w-52 overflow-hidden rounded-3xl border border-black/10 bg-white/95 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
                >
                  {menuLinks.map((link: NavLink, index: number) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMenu}
                      >
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: 0.06 + index * 0.05,
                          }}
                          whileTap={{
                            scale: 0.97,
                          }}
                          className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors ${
                            isActive ? "bg-purple-50" : "hover:bg-zinc-100"
                          }`}
                        >
                          <span
                            className={`grid h-9 w-9 place-items-center rounded-xl ${
                              isActive
                                ? "bg-purple-600 text-white"
                                : "bg-zinc-100 text-zinc-500"
                            }`}
                          >
                            <Icon size={16} />
                          </span>
                          <span
                            className={`${baloo.className} text-sm font-bold ${
                              isActive ? "text-purple-700" : "text-zinc-800"
                            }`}
                          >
                            {link.label}
                          </span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Hamburger / Collapse button */}
            <motion.button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              whileTap={{ scale: 0.88 }}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="mx-auto flex flex-col items-center gap-1.5 py-1"
            >
              <motion.div
                animate={isMenuOpen ? "open" : "closed"}
                className="relative grid h-9 w-9 place-items-center rounded-full bg-zinc-100"
              >
                {/* Top line */}
                <motion.span
                  variants={{
                    closed: {
                      rotate: 0,
                      y: -5,
                    },
                    open: {
                      rotate: 45,
                      y: 0,
                    },
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="absolute h-0.5 w-4 rounded-full bg-zinc-500"
                />
                {/* Middle line */}
                <motion.span
                  variants={{
                    closed: {
                      opacity: 1,
                    },
                    open: {
                      opacity: 0,
                    },
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                  className="absolute h-0.5 w-4 rounded-full bg-zinc-500"
                />
                {/* Bottom line */}
                <motion.span
                  variants={{
                    closed: {
                      rotate: 0,
                      y: 5,
                    },
                    open: {
                      rotate: -45,
                      y: 0,
                    },
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="absolute h-0.5 w-4 rounded-full bg-zinc-500"
                />
              </motion.div>
              <span
                className={`${baloo.className} text-[11px] font-bold leading-none tracking-tight text-zinc-400`}
              >
                {isMenuOpen ? "Close" : "Menu"}
              </span>
            </motion.button>
          </div>
        </div>
      </nav>
    </>
  );
}
