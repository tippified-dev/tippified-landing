"use client";

import {
  BriefcaseIcon,
  DocumentTextIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  NewspaperIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";



export default function NavBar() {
  const pathname = usePathname();
  const [blogCount, setBlogCount] = useState(0);

  // Fetch new blog count (replace with your API)
  useEffect(() => {
    const fetchBlogCount = async () => {
      try {
        const res = await fetch(`https://api.com/api/adminpanel/blog/new-count/`);
        const data = await res.json();
        setBlogCount(data.count || 0);
      } catch (err) {
        console.error("Failed to fetch new blog count", err);
      }
    };

    fetchBlogCount();

    // Optional: poll every 2 minutes
    const interval = setInterval(fetchBlogCount, 120000);
    return () => clearInterval(interval);
  }, []);

  const links = [
    { label: "Home", href: "/", icon: HomeIcon },
    { label: "Search", href: "/search-goals", icon: MagnifyingGlassIcon },
    {
      label: "Blog",
      href: "/blog",
      icon: NewspaperIcon,
      badgeCount: blogCount,
    },
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition relative ${
                isActive
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
              }`}
              onClick={() => link.label === "Blog" && setBlogCount(0)}
            >
              <Icon className="w-6 h-6" />
              {link.label}

              {/* Badge */}
              {link.badgeCount && link.badgeCount > 0 && (
                <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {link.badgeCount}
                </span>
              )}
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
                className="flex flex-col items-center justify-center text-xs font-medium transition relative"
                onClick={() => link.label === "Blog" && setBlogCount(0)}
              >
                <Icon
                  className={`transition-transform duration-200 ${
                    isActive ? "w-7 h-7 scale-110 text-purple-600" : "w-6 h-6 text-gray-500"
                  }`}
                />
                <span className={`mt-1 ${isActive ? "text-purple-600" : "text-gray-500"}`}>
                  {link.label}
                </span>

                {/* Badge for mobile */}
                {link.badgeCount && link.badgeCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded-full">
                    {link.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}