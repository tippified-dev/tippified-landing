"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const roles = [
  "Musicians",
  "Social Media Influencers",
  "Actors",
  "Skit Makers",
  "Content Creators",
  "Dancers",
  "Podcasters",
  "Anyone with fans and supporters",
];

export default function WhoUsesTippified() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 2000); // change speed here

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-6 bg-white text-center">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-3">
          <UserGroupIcon className="w-10 h-10 text-purple-600" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
          Who uses Tippified?
        </h2>

        <div className="relative h-12 md:h-14 overflow-hidden">
          <p
            key={roles[index]}
            className="text-2xl md:text-3xl font-semibold text-gray-800 animate-fade-slide"
          >
            {roles[index]}
          </p>
        </div>

        <p className="text-gray-600 mt-4">
          If you create content and have people who support you, Tippified is for you.
        </p>
      </div>
    </section>
  );
}