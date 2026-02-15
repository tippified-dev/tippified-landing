"use client";

import {
    DocumentTextIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    PhoneIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/", icon: <HomeIcon className="w-6 h-6" /> },
    { label: "Search", href: "/search-goals", icon: <MagnifyingGlassIcon className="w-6 h-6" /> },
    {
      label: "Privacy",
      href: "/privacy-policy",
      icon: <DocumentTextIcon className="w-6 h-6" />,
    },
    {
      label: "Contact",
      href: "/contact-us",
      icon: <PhoneIcon className="w-6 h-6" />,
    },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="hidden md:flex justify-center gap-8 py-4 bg-white shadow sticky top-0 z-50">
        <Logo/>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 text-gray-700 font-semibold hover:text-purple-600 transition ${
              pathname === link.href ? "text-purple-600" : ""
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Bottom Tab Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around md:hidden bg-white/90 backdrop-blur-md border-t shadow py-2 safe-bottom z-50 rounded-t-xl">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center text-gray-700 hover:text-purple-600 transition ${
              pathname === link.href ? "text-purple-600" : ""
            }`}
          >
            <span className="w-6 h-6">{link.icon}</span>
            <span className="text-xs mt-1">{link.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}