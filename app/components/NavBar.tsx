"use client";

import {
  BriefcaseIcon,
  DocumentTextIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-6 h-6" /> },
    { label: "Search", href: "/search-goals", icon: <MagnifyingGlassIcon className="w-6 h-6" /> },
    { label: "Privacy", href: "/privacy-policy", icon: <DocumentTextIcon className="w-6 h-6" /> },
    { label: "T&C", href: "/terms-conditions", icon: <BriefcaseIcon className="w-6 h-6" /> },
    { label: "FAQ", href: "/faq", icon: <QuestionMarkCircleIcon className="w-6 h-6" /> },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex justify-center gap-10 py-4 bg-white shadow-md sticky top-0 z-50">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              pathname === link.href
                ? "bg-purple-100 text-purple-700"
                : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Bottom FAB Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around md:hidden bg-white/95 backdrop-blur-md border-t shadow-lg py-3 safe-bottom z-50 rounded-t-xl">
        {links.map((link, idx) => {
          const isActive = pathname === link.href;
          return (
            <div key={idx} className="relative flex flex-col items-center">
              {/* Floating Glow Indicator */}
              {isActive && (
                <span className="absolute -top-2 w-10 h-10 bg-purple-600 rounded-full shadow-xl animate-pulse opacity-30"></span>
              )}

              <Link
                href={link.href}
                className={`flex flex-col items-center justify-center py-1 px-2 transition-colors duration-200 ${
                  isActive ? "text-purple-600" : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <span className="w-6 h-6">{link.icon}</span>
                <span className="text-xs mt-1 font-medium">{link.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>
    </>
  );
}