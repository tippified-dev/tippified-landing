"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const images = ["/golive1.png", "/goals2.png", "/receivetips.png"];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const [isHovering, setIsHovering] = useState(false);
  // const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const next = (current + 1) % images.length;
  const prev = (current - 1 + images.length) % images.length;
  const target = dir === 1 ? next : prev;

  const flip = (direction: 1 | -1) => {
    if (isFlipping) return;
    setDir(direction);
    setIsFlipping(true);
    setTimeout(() => {
      setCurrent(direction === 1 ? next : prev);
      setIsFlipping(false);
    }, 1100);
  };

  useEffect(
    () => {
      if (isHovering || isFlipping) return;
      const id = setInterval(() => flip(1), 4500);
      return () => clearInterval(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isHovering, isFlipping, current],
  );

  return (
    <section className="py-10 px-4 bg-[#FCFBFF] overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative"
          style={{ perspective: "2000px" }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* violet glow */}
          <div className="pointer-events-none absolute -top-20 -left-20 h-120 w-120 rounded-full bg-[#7C3AED]/20 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-120 w-120 rounded-full bg-[#15052E]/15 blur-[90px]" />

          {/* book */}
          <div className="relative mx-auto aspect-[1.05/1] md:aspect-[1.7/1] w-full max-w-225">
            {/* pedestal shadow */}
            <div
              className={`absolute left-1/2 -bottom-10 h-20 w-[85%] -translate-x-1/2 rounded-full bg-[#15052E]/20 blur-x1 transition-all duration-700 ${isFlipping ? "scale-110 opacity-60" : "scale-100 opacity-40"}`}
            />

            <div className="relative h-full w-full rounded-[18px] bg-white shadow-[0_20px_80px_-20px_rgba(21,5,46,0.35),0_1px_0_white_inset] border border-white/50 overflow-visible">
              {/* spine */}
              <div className="absolute left-1/2 top-0 z-10 h-full w-0.5 -translate-x-1/2 bg-linear-to-b from-[#15052E] via-[#4C1D95] to-[#6D28D9] opacity-80" />

              {/* left static paper */}
              <div className="absolute left-0 top-0 h-full w-1/2 rounded-l-[18px] bg-[#FFFEFD] border-r border-[#15052E]/6 shadow-[inset_-12px_0_24px_rgba(21,5,46,0.06)]" />

              {/* right static - shows next */}
              <div className="absolute right-0 top-0 h-full w-1/2 rounded-r-[18px] bg-white overflow-hidden">
                <Image
                  src={images[target]}
                  alt=""
                  width={1200}
                  height={700}
                  className="h-full w-full object-contain p-4 md:p-8"
                />
              </div>

              {/* flipping page */}
              <div
                className={`absolute right-0 top-0 h-full w-1/2 origin-left [transform-3d] z-20 ${isFlipping ? (dir === 1 ? "animate-flipFwd" : "animate-flipBack") : ""}`}
                style={{
                  transform: isFlipping
                    ? undefined
                    : dir === 1
                      ? "rotateY(0deg)"
                      : "rotateY(-180deg)",
                }}
              >
                {/* front = current */}
                <div className="absolute inset-0 [backface-hidden] rounded-r-[18px] bg-white border-l border-white overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                  <Image
                    src={images[current]}
                    alt=""
                    width={1200}
                    height={700}
                    className="h-full w-full object-contain p-4 md:p-8"
                    priority
                  />
                  <div className="absolute inset-y-0 left-0 w-10 bg-linear-to-r from-[#15052E]/20 to-transparent" />
                </div>
                {/* back = target */}
                <div className="absolute inset-0 [backface-hidden] transform-[rotateY(180deg)] rounded-l-[18px] bg-white overflow-hidden">
                  <Image
                    src={images[target]}
                    alt=""
                    width={1200}
                    height={700}
                    className="h-full w-full object-contain p-4 md:p-8"
                  />
                  <div className="absolute inset-y-0 right-0 w-10 bg-linear-to-l from-black/10 to-transparent" />
                </div>
              </div>

              {/* edge thickness */}
              <div className="pointer-events-none absolute right-1px top-[8%] bottom-[8%] w-1 flex flex-col gap-px opacity-40">
                <div className="flex-1 bg-white border-l border-black/10" />
                <div className="flex-1 bg-[#F5F3FF] border-l border-black/10" />
                <div className="flex-1 bg-white border-l border-black/10" />
              </div>

              {/* click zones */}
              <button
                onClick={() => flip(-1)}
                className="absolute left-0 top-0 z-30 h-full w-1/2 rounded-l-[18px]"
                aria-label="Previous"
              />
              <button
                onClick={() => flip(1)}
                className="absolute right-0 top-0 z-30 h-full w-1/2 rounded-r-[18px]"
                aria-label="Next"
              />
            </div>

            {/* controls */}
            <div className="absolute -bottom-6 left-1/2 z-40 -translate-x-1/2 flex items-center gap-2 rounded-full bg-[#15052E]/80 backdrop-blur-xl border border-white/15 px-4 py-2 shadow-xl">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i !== current) {
                      setDir(i > current ? 1 : -1);
                      flip(i > current ? 1 : -1);
                    }
                  }}
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{
                    width: i === current ? 32 : 12,
                    background:
                      i === current ? "#fff" : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
              <span className="ml-2 text-[10px] tracking-widest text-white/60">
                FOLIO 0{current + 1} / 0{images.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes flipFwd { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(-180deg); } }
        @keyframes flipBack { 0% { transform: rotateY(-180deg); } 100% { transform: rotateY(0deg); } }
       .animate-flipFwd { animation: flipFwd 1.1s cubic-bezier(0.74,0,0.22,1) forwards; }
       .animate-flipBack { animation: flipBack 1.1s cubic-bezier(0.74,0,0.22,1) forwards; }
      `,
        }}
      />
    </section>
  );
}
