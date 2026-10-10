"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowLeft, FiHeart, FiHexagon, FiSearch } from "react-icons/fi";

import CreatorSearch from "../components/CreatorSearch";
import SuggestedCreators from "../components/SuggestedCreatorss";
export default function SendGemPage() {
  const scrollToSearch = () => {
    document.getElementById("creator-search")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-purple-50/70 via-white to-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-purple-100/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-purple-700"
          >
            <FiArrowLeft aria-hidden="true" />
            Back to Tippified
          </Link>

          <Link
            href="/send-gem"
            className="flex items-center gap-2"
            aria-label="Tippified Gems home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-200">
              <FiHexagon aria-hidden="true" className="text-lg" />
            </span>

            <span className="text-sm font-bold tracking-tight text-gray-900 sm:text-base">
              Tippified <span className="text-purple-700">Gems</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative isolate mb-12 overflow-hidden rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-10 lg:p-14"
        >
          {/* Decorative background elements */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-purple-200/60 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-1/3 -z-10 h-64 w-64 rounded-full bg-fuchsia-100/70 blur-3xl"
          />

          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5">
              <FiHeart aria-hidden="true" className="text-purple-600" />

              <span className="text-xs font-semibold tracking-wide text-purple-700">
                CELEBRATE THE CREATORS YOU LOVE
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-6xl">
              Discover creators.
              <span className="mt-1 block bg-linear-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">
                Send them Gems.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
              Every creator has a story worth celebrating. Find your favourites
              on Tippified and send them Gems to show your appreciation for the
              content, creativity, and inspiration they bring to your life.
            </p>

            <button
              type="button"
              onClick={scrollToSearch}
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-700 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-200 focus:outline-none focus:ring-4 focus:ring-purple-200"
            >
              <FiSearch aria-hidden="true" className="text-lg" />
              Find a creator
            </button>

            <p className="mt-4 text-xs text-gray-400">
              Discover talent. Celebrate creativity. Show your support.
            </p>
          </div>
        </motion.section>

        {/* Suggested creators */}
        <section className="mb-16">
          <SuggestedCreators
            limit={6}
            title="Creators worth discovering"
            description="Meet creators on Tippified and find someone whose content deserves your support."
          />
        </section>

        {/* Search creators */}
        <section
          id="creator-search"
          className="scroll-mt-24 border-t border-purple-100 pt-10 sm:pt-12"
        >
          <CreatorSearch />
        </section>

        {/* Closing callout */}
        <section className="mt-16 overflow-hidden rounded-3xl bg-linear-to-r from-purple-800 via-purple-700 to-fuchsia-700 px-6 py-10 text-center sm:px-10 sm:py-12">
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white">
              <FiHeart aria-hidden="true" className="text-xl" />
            </div>

            <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Creativity deserves appreciation.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-purple-100 sm:text-base">
              Your favourite creators make the internet more interesting.
              Discover them on Tippified and find a meaningful way to show your
              support.
            </p>

            <button
              type="button"
              onClick={scrollToSearch}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-purple-800 transition hover:bg-purple-50 focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              <FiSearch aria-hidden="true" />
              Discover creators
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <Link href="/" className="text-sm font-bold text-gray-900">
            Tippified
          </Link>

          <p className="text-xs text-gray-500">Discover. Celebrate. Support.</p>

          <Link
            href="/"
            className="text-xs font-medium text-purple-700 transition hover:text-purple-900"
          >
            Visit Tippified
          </Link>
        </div>
      </footer>
    </main>
  );
}
