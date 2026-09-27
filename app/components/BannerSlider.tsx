"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const images = ["/golive1.png", "/goals2.png", "/receivetips.png"];

const META = [
  {
    kicker: "NOW STREAMING",
    title: "Go Live",
    desc: "One tap to stage. Violet glass holds the moment.",
  },
  {
    kicker: "MOMENTUM",
    title: "Hit Goals",
    desc: "Progress pours like liquid in real time.",
  },
  {
    kicker: "REWARDED",
    title: "Receive Tips",
    desc: "Tips land like droplets on wet glass.",
  },
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovering) return;
    const id = setInterval(
      () => setCurrent((p) => (p === images.length - 1 ? 0 : p + 1)),
      5000,
    );
    return () => clearInterval(id);
  }, [isHovering]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <section className="py-10 px-4 bg-[#FCFBFF]">
      <div className="max-w-6xl mx-auto">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative"
          style={{ perspective: "1200px" }}
        >
          <div className="pointer-events-none absolute -top-24 -left-24 h-130 w-130 rounded-full bg-[#7C3AED]/20 blur-[80px]" />

          <div className="relative rounded-[36px] p-px bg-linear-to-b from-white/40 via-white/15 to-transparent shadow-[0_40px_120px_-40px_rgba(21,5,46,0.5)]">
            <div className="relative overflow-hidden rounded-[35px] bg-white/6 backdrop-blur-2x1 border border-white/15">
              <div className="pointer-events-none absolute top-0 inset-x-[12%] h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />

              <div className="relative w-full overflow-hidden bg-[#F6F3FF]">
                {images.map((img, idx) => {
                  const active = idx === current;
                  return (
                    <div
                      key={img}
                      className="absolute inset-0 transition-all duration-900 ease-[cubic-bezier(0.7,0,0.3,1)]"
                      style={{
                        opacity: active ? 1 : 0,
                        transform: active
                          ? `translate3d(${mouse.x * -12}px, ${mouse.y * -8}px, 0) scale(1)`
                          : "scale(1.06)",
                        filter: active ? "blur(0px)" : "blur(18px)",
                        zIndex: active ? 2 : 1,
                      }}
                    >
                      <Image
                        src={img}
                        alt={`banner ${idx + 1}`}
                        width={1200}
                        height={520}
                        className=" w-full h-auto object-contain"
                        sizes="100vw"
                        priority={idx === 0}
                      />
                      <div className="absolute left-6 md:left-10 bottom-21 max-w-95 rounded-[20px] p-px bg-linear-to-b from-white/30 to-transparent">
                        <div className="rounded-[19px] bg-[#15052E]/60 backdrop-blur-[18px] border border-white/15 px-5 py-4">
                          <p className="text-[10px] tracking-[0.2em] text-white/60">
                            {META[idx].kicker}
                          </p>
                          <h3 className="mt-1 text-[22px] font-extrabold text-white">
                            {META[idx].title}
                          </h3>
                          <p className="mt-1 text-[12px] text-white/70">
                            {META[idx].desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-3 py-2">
                {images.map((_, idx) => {
                  const active = idx === current;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className="relative h-7 overflow-hidden rounded-full border border-white/15 transition-all duration-700"
                      style={{
                        width: active ? 54 : 28,
                        background: active
                          ? "rgba(255,255,255,0.22)"
                          : "rgba(255,255,255,0.10)",
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: active
                            ? "linear-gradient(90deg, #6D28D9, #4C1D95, #15052E)"
                            : "transparent",
                          transformOrigin: "left",
                          transform: active ? "scaleX(1)" : "scaleX(0)",
                          transition: "transform 650ms",
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="pointer-events-none relative h-14 w-full overflow-hidden border-t border-white/10">
                <div
                  className="absolute inset-0 opacity-[0.12] blur-[0.6px]"
                  style={{ transform: "scaleY(-1)" }}
                >
                  <Image
                    src={images[current]}
                    alt=""
                    width={1200}
                    height={56}
                    className=" w-full h-auto object-contain object-top"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-b from-white/10 to-[#FCFBFF]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
