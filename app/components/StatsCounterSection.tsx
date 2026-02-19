"use client";

import { useEffect, useRef, useState } from "react";

export default function StatsCounterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  const TARGET = 50000; // change this anytime

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    let start = 0;
    const duration = 1200; // animation speed (ms)
    const stepTime = 16;
    const increment = TARGET / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= TARGET) {
        setCount(TARGET);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      className="py-12 px-6 bg-white text-center"
    >
      <h2 className="text-4xl font-extrabold text-purple-600">
        {count.toLocaleString()}+
      </h2>

      <p className="text-lg font-semibold mt-2">
        Creators love Tippified
      </p>

      <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
        From social media creators,influencers, artists and entrepreneurs.
      </p>
    </section>
  );
 }