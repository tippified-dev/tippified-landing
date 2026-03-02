"use client";

import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ActivityTeaserSection() {
  return (
    <section className="py-14 px-6 bg-linear-to-r from-purple-50 to-white text-center">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-3">
          <SparklesIcon className="w-10 h-10 text-purple-600 animate-pulse" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-3">
          New creator goals are added every day
        </h2>

        <p className="text-gray-600 mb-6">
          Fans are supporting creators across Nigeria in real time.  
          Find someone to support today.
        </p>

        <Link
          href="/search-goals"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-purple-700 transition"
        >
          Discover creators
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}