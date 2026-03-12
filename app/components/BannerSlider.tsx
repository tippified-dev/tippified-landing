"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  "/golive1.png",
  "/goals2.png",
  "/receivetips.png",
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-10 px-4 bg-white">
      <div className="max-w-6xl mx-auto overflow-hidden rounded-xl shadow-lg">
        
        {/* Slider container */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, index) => (
            <div key={img} className="min-w-full">
              <Image
                src={img}
                alt={`Tippified banner ${index + 1}`}
                width={1200}
                height={500}
                className="w-full h-auto object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-purple-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
 }