"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const images = [
  "/adban1.jpeg",
  "/adban2.jpeg",
  "/adban3.jpeg",
  "/adban4.jpeg",
  "/adban5.jpeg",
];

const ANIMATION_DURATION = 1100;

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (dir: 1 | -1) => {
    if (isAnimating) return;

    const nextIndex =
      dir === 1
        ? (current + 1) % images.length
        : (current - 1 + images.length) % images.length;

    setDirection(dir);
    setPrevious(current);
    setIsAnimating(true);
    setCurrent(nextIndex);

    timeoutRef.current = setTimeout(() => {
      setPrevious(null);
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  };

  useEffect(
    () => {
      if (isHovering || isAnimating) return;

      const interval = setInterval(() => {
        goTo(1);
      }, 4500);

      return () => clearInterval(interval);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isHovering, isAnimating, current],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#FCFBFF] px-4 py-14 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* =========================================================
              AMBIENT LIGHT
          ========================================================= */}

          <div className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#7C3AED]/20 blur-[130px]" />

          <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#4C1D95]/15 blur-[130px]" />

          {/* =========================================================
              FLOATING SHADOW
          ========================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-10
              left-1/2
              h-24
              w-[75%]
              -translate-x-1/2
              rounded-[50%]
              bg-[#15052E]/25
              blur-2x1
            "
          />

          {/* =========================================================
              GLASS VIEWPORT
          ========================================================= */}

          <div
            className="
              glass-viewport
              relative
              mx-auto
              aspect-[16/8.5]
              w-full
              max-w-6xl
              overflow-hidden
              rounded-[28px]
              border
              border-white/80
              bg-white/30
              shadow-[0_35px_100px_-30px_rgba(21,5,46,0.48)]
              md:rounded-[36px]
            "
          >
            {/* =======================================================
                ARTWORK MOVING UNDER THE GLASS
            ======================================================= */}

            {/* Previous image — retreats through the LEFT */}
            {previous !== null && (
              <div
                className={`
                  absolute
                  inset-0
                  z-1
                  overflow-hidden
                  ${
                    direction === 1
                      ? "animate-glassExitLeft"
                      : "animate-glassExitRight"
                  }
                `}
              >
                <Image
                  src={images[previous]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="select-none object-cover object-center"
                  draggable={false}
                />

                {/* Depth/refraction shadow */}
                <div className="pointer-events-none absolute inset-0 bg-[#15052E]/10" />
              </div>
            )}

            {/* Current image — enters FROM THE RIGHT */}
            <div
              key={`${current}-${direction}-${isAnimating}`}
              className={`
                absolute
                inset-0
                z-2
                overflow-hidden
                ${
                  isAnimating
                    ? direction === 1
                      ? "animate-glassEnterRight"
                      : "animate-glassEnterLeft"
                    : ""
                }
              `}
            >
              <Image
                src={images[current]}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="select-none object-cover object-center"
                draggable={false}
              />
            </div>

            {/* =======================================================
                GLASS SURFACE
                THIS NEVER MOVES
            ======================================================= */}

            <div className="pointer-events-none absolute inset-0 z-10">
              {/* Main translucent glass */}
              <div className="absolute inset-0 bg-white/2.5 backdrop-blur-[0.4px]" />

              {/* Top glass reflection */}
              <div
                className="
                  absolute
                  inset-x-0
                  top-0
                  h-[35%]
                  bg-linear-to-b
                  from-white/20
                  via-white/4.5
                  to-transparent
                "
              />

              {/* Left refraction */}
              <div
                className="
                  absolute
                  inset-y-0
                  left-0
                  w-[13%]
                  bg-linear-to-r
                  from-white/20
                  via-white/[0.035]
                  to-transparent
                "
              />

              {/* Right refraction */}
              <div
                className="
                  absolute
                  inset-y-0
                  right-0
                  w-[13%]
                  bg-linear-to-l
                  from-white/15
                  via-white/2.5
                  to-transparent
                "
              />

              {/* Glass edge */}
              <div className="absolute inset-0 rounded-[28px] border border-white/40 md:rounded-[36px]" />

              {/* Inner glass line */}
              <div className="absolute inset-px rounded-[27px] border border-white/20 md:rounded-[35px]" />

              {/* Tiny premium highlight */}
              <div
                className="
                  absolute
                  left-[8%]
                  right-[8%]
                  top-0
                  h-px
                  bg-linear-to-r
                  from-transparent
                  via-white/80
                  to-transparent
                "
              />

              {/* Bottom glass reflection */}
              <div
                className="
                  absolute
                  inset-x-[12%]
                  bottom-0
                  h-20
                  rounded-full
                  bg-white/4
                  blur-2xl
                "
              />
            </div>

            {/* =======================================================
                PHYSICAL EDGE ILLUSION
            ======================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                inset-y-[8%]
                left-0
                z-20
                w-5
                rounded-r-full
                bg-linear-to-r
                from-[#15052E]/20
                via-white/20
                to-transparent
                blur-[1px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                inset-y-[8%]
                right-0
                z-20
                w-5
                rounded-l-full
                bg-linear-to-l
                from-[#15052E]/15
                via-white/20
                to-transparent
                blur-[1px]
              "
            />

            {/* =======================================================
                INVISIBLE INTERACTION ZONES
            ======================================================= */}

            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label="Previous image"
              className="
                absolute
                left-0
                top-0
                z-30
                h-full
                w-1/3
                cursor-pointer
                focus:outline-none
              "
            />

            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label="Next image"
              className="
                absolute
                right-0
                top-0
                z-30
                h-full
                w-1/3
                cursor-pointer
                focus:outline-none
              "
            />
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            /*
             * =========================================================
             * GLASSPHOMORIC MOTION
             * =========================================================
             */

            @keyframes glassEnterRight {
              0% {
                transform:
                  translate3d(115%, 0, 0)
                  scale(0.90)
                  rotateY(-10deg);

                opacity: 0;
                filter: blur(10px);
              }

              18% {
                opacity: 0.65;
                filter: blur(5px);
              }

              55% {
                transform:
                  translate3d(10%, 0, 0)
                  scale(0.985)
                  rotateY(-2deg);

                opacity: 1;
                filter: blur(1px);
              }

              78% {
                transform:
                  translate3d(-1.5%, 0, 0)
                  scale(1.002)
                  rotateY(0deg);

                filter: blur(0);
              }

              100% {
                transform:
                  translate3d(0, 0, 0)
                  scale(1)
                  rotateY(0deg);

                opacity: 1;
                filter: blur(0);
              }
            }

            @keyframes glassExitLeft {
              0% {
                transform:
                  translate3d(0, 0, 0)
                  scale(1)
                  rotateY(0deg);

                opacity: 1;
                filter: blur(0);
              }

              30% {
                transform:
                  translate3d(-7%, 0, 0)
                  scale(0.985)
                  rotateY(2deg);

                opacity: 0.95;
              }

              70% {
                transform:
                  translate3d(-72%, 0, 0)
                  scale(0.90)
                  rotateY(9deg);

                opacity: 0.25;
                filter: blur(5px);
              }

              100% {
                transform:
                  translate3d(-115%, 0, 0)
                  scale(0.84)
                  rotateY(13deg);

                opacity: 0;
                filter: blur(11px);
              }
            }

            @keyframes glassEnterLeft {
              0% {
                transform:
                  translate3d(-115%, 0, 0)
                  scale(0.90)
                  rotateY(10deg);

                opacity: 0;
                filter: blur(10px);
              }

              18% {
                opacity: 0.65;
                filter: blur(5px);
              }

              55% {
                transform:
                  translate3d(-10%, 0, 0)
                  scale(0.985)
                  rotateY(2deg);

                opacity: 1;
                filter: blur(1px);
              }

              78% {
                transform:
                  translate3d(1.5%, 0, 0)
                  scale(1.002)
                  rotateY(0deg);

                filter: blur(0);
              }

              100% {
                transform:
                  translate3d(0, 0, 0)
                  scale(1)
                  rotateY(0deg);

                opacity: 1;
                filter: blur(0);
              }
            }

            @keyframes glassExitRight {
              0% {
                transform:
                  translate3d(0, 0, 0)
                  scale(1)
                  rotateY(0deg);

                opacity: 1;
                filter: blur(0);
              }

              30% {
                transform:
                  translate3d(7%, 0, 0)
                  scale(0.985)
                  rotateY(-2deg);

                opacity: 0.95;
              }

              70% {
                transform:
                  translate3d(72%, 0, 0)
                  scale(0.90)
                  rotateY(-9deg);

                opacity: 0.25;
                filter: blur(5px);
              }

              100% {
                transform:
                  translate3d(115%, 0, 0)
                  scale(0.84)
                  rotateY(-13deg);

                opacity: 0;
                filter: blur(11px);
              }
            }

            .animate-glassEnterRight {
              animation:
                glassEnterRight
                1100ms
                cubic-bezier(0.16, 1, 0.3, 1)
                forwards;
            }

            .animate-glassExitLeft {
              animation:
                glassExitLeft
                1100ms
                cubic-bezier(0.16, 1, 0.3, 1)
                forwards;
            }

            .animate-glassEnterLeft {
              animation:
                glassEnterLeft
                1100ms
                cubic-bezier(0.16, 1, 0.3, 1)
                forwards;
            }

            .animate-glassExitRight {
              animation:
                glassExitRight
                1100ms
                cubic-bezier(0.16, 1, 0.3, 1)
                forwards;
            }

            .glass-viewport {
              perspective: 1400px;
              transform-style: preserve-3d;
              isolation: isolate;
            }

            @media (max-width: 768px) {
              .glass-viewport {
                perspective: 900px;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .animate-glassEnterRight,
              .animate-glassExitLeft,
              .animate-glassEnterLeft,
              .animate-glassExitRight {
                animation: none;
              }
            }
          `,
        }}
      />
    </section>
  );
}
