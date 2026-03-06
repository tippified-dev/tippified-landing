"use client";

import {
  BriefcaseIcon,
  DocumentTextIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/", icon: HomeIcon },
    { label: "Search", href: "/search-goals", icon: MagnifyingGlassIcon },
    { label: "Privacy", href: "/privacy-policy", icon: DocumentTextIcon },
    { label: "T&C", href: "/terms-conditions", icon: BriefcaseIcon },
    { label: "FAQ", href: "/faq", icon: QuestionMarkCircleIcon },
  ];

  const activeIndex = links.findIndex((link) => link.href === pathname);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex justify-center gap-10 py-4 bg-white shadow-md sticky top-0 z-50">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                isActive
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
              }`}
            >
              <Icon className="w-6 h-6" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow-lg z-50">

        
        <div className="relative h-1 bg-gray-100">
          <span
            className="absolute top-0 h-1 bg-purple-600 transition-all duration-300"
            style={{
              width: `${100 / links.length}%`,
              left: `${(100 / links.length) * activeIndex}%`,
            }}
          />
        </div>

        <div className="flex justify-around py-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center text-xs font-medium transition ${
                  isActive ? "text-purple-600" : "text-gray-500"
                }`}
              >
                <Icon
                  className={`transition-transform duration-200 ${
                    isActive
                      ? "w-7 h-7 scale-110"
                      : "w-6 h-6"
                  }`}
                />

                <span className="mt-1">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}