"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="hidden md:flex justify-center gap-8 py-4 bg-white shadow sticky top-0 z-50">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-gray-700 font-semibold hover:text-purple-600 transition ${
              pathname === link.href ? "text-purple-600" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Bottom Tab Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around md:hidden bg-white border-t shadow py-2 z-50">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center text-gray-700 hover:text-purple-600 transition ${
              pathname === link.href ? "text-purple-600" : ""
            }`}
          >
            <span className="text-sm">{link.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
 }