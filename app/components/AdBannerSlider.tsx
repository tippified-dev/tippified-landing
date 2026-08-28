"use client";

import { useEffect, useState } from "react";
import { FiArrowRight, FiMail, FiTrendingUp } from "react-icons/fi";

const ads = [
  {
    eyebrow: "Tippified Advertising",
    title: "Millions of people from across the world land on this page daily.",
    description:
      "Put your brand, product or business directly in front of an engaged audience.",
    icon: FiTrendingUp,
  },
  {
    eyebrow: "Advertise With Us",
    title: "Take advantage and place your business ads here.",
    description:
      "Get your business seen by people discovering and supporting creators on Tippified.",
    icon: FiArrowRight,
  },
  {
    eyebrow: "Limited Advertising Offer",
    title: "Send a mail now to support@tippified.com for discount.",
    description:
      "Reach out to our team and let's help you get your business in front of more people.",
    icon: FiMail,
  },
];

export default function AdBannerSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mt-10 overflow-hidden">
      <div className="relative overflow-hidden rounded-[1.8rem] border border-purple-100 bg-white shadow-[0_15px_45px_-25px_rgba(88,28,174,0.3)]">
        {/* Soft decorative glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-200/40 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-pink-100/50 blur-3xl" />

        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {ads.map((ad, index) => {
            const Icon = ad.icon;

            return (
              <div
                key={index}
                className="relative min-w-full px-6 py-7 sm:px-8 sm:py-8"
              >
                <div className="relative flex items-center gap-4">
                  {/* Icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 ring-1 ring-purple-100">
                    <Icon size={21} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <p className="mb-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-purple-500">
                      {ad.eyebrow}
                    </p>

                    <h3 className="text-[15px] font-extrabold leading-6 tracking-tight text-purple-950 sm:text-lg sm:leading-7">
                      {ad.title}
                    </h3>

                    <p className="mt-1.5 max-w-2xl text-[11px] leading-5 text-gray-500 sm:text-xs sm:leading-6">
                      {ad.description}
                    </p>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="mt-6 h-1 overflow-hidden rounded-full bg-purple-50">
                  <div
                    key={current}
                    className="h-full origin-left rounded-full bg-purple-600"
                    style={{
                      animation: "adProgress 5s linear forwards",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8.5 right-6 flex items-center gap-1.5 sm:right-8">
          {ads.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Go to advertisement ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-5 bg-purple-600"
                  : "w-1.5 bg-purple-200 hover:bg-purple-300"
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes adProgress {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
