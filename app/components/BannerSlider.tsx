"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = ["/golive1.png", "/goals2.png", "/receivetips.png"];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isHovering, setIsHovering] = useState(false);

  const goTo = (dir: 1 | -1) => {
    setDirection(dir);

    setCurrent((prev) => {
      if (dir === 1) {
        return (prev + 1) % images.length;
      }

      return (prev - 1 + images.length) % images.length;
    });
  };

  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      goTo(1);
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <section className="relative overflow-hidden bg-[#FCFBFF] px-4 py-12 md:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Ambient premium glow */}
          <div className="pointer-events-none absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#7C3AED]/20 blur-[120px]" />

          <div className="pointer-events-none absolute -right-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#15052E]/15 blur-[120px]" />

          {/* Main slider */}
          <div className="relative mx-auto w-full max-w-6xl">
            {/* Deep shadow underneath */}
            <div className="absolute -bottom-8 left-1/2 h-20 w-[80%] -translate-x-1/2 rounded-full bg-[#15052E]/25 blur-[35px]" />

            {/* Image frame */}
            <div
              className="
                relative
                aspect-[16/8.5]
                w-full
                overflow-hidden
                rounded-3x1
                border
                border-white/80
                bg-white
                shadow-[0_30px_100px_-30px_rgba(21,5,46,0.45)]
                md:rounded-[30px]
              "
            >
              {/* Current image */}
              <div
                key={`${current}-${direction}`}
                className="absolute inset-0 animate-premiumSlide"
              >
                <Image
                  src={images[current]}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="
                    select-none
                    object-cover
                    object-center
                  "
                  draggable={false}
                />

                {/* Soft image overlay */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#15052E]/10 via-transparent to-white/5" />
              </div>

              {/* Glass highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/15 to-transparent" />

              {/* Left click zone */}
              <button
                type="button"
                onClick={() => goTo(-1)}
                aria-label="Previous image"
                className="
                  absolute
                  left-0
                  top-0
                  z-20
                  h-full
                  w-1/3
                  cursor-pointer
                  focus:outline-none
                "
              />

              {/* Right click zone */}
              <button
                type="button"
                onClick={() => goTo(1)}
                aria-label="Next image"
                className="
                  absolute
                  right-0
                  top-0
                  z-20
                  h-full
                  w-1/3
                  cursor-pointer
                  focus:outline-none
                "
              />

              {/* Very subtle side shading */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-[#15052E]/10 to-transparent" />

              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-[#15052E]/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes premiumSlide {
              0% {
                opacity: 0;
                transform: scale(1.025);
              }

              100% {
                opacity: 1;
                transform: scale(1);
              }
            }

            .animate-premiumSlide {
              animation: premiumSlide 850ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }

            @media (prefers-reduced-motion: reduce) {
              .animate-premiumSlide {
                animation: none;
              }
            }
          `,
        }}
      />
    </section>
  );
}
