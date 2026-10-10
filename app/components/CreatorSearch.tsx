"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";

import {
  getCreatorNiches,
  searchCreators,
  type CreatorNiche,
  type GemCreator,
} from "../lib/gems/api";
import CreatorResultCard from "./CreatorResultCard";
import GemDiscoverySkeleton from "./GemDiscoverySkeleton";

export default function CreatorSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");

  const [niches, setNiches] = useState<CreatorNiche[]>([]);
  const [creators, setCreators] = useState<GemCreator[]>([]);

  const [loadingNiches, setLoadingNiches] = useState(true);
  const [loadingCreators, setLoadingCreators] = useState(false);

  const [nicheError, setNicheError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load creator niches from the Django API.
  useEffect(() => {
    const controller = new AbortController();

    async function loadNiches() {
      try {
        setLoadingNiches(true);
        setNicheError("");

        const data = await getCreatorNiches(controller.signal);

        if (!controller.signal.aborted) {
          setNiches(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setNicheError("Unable to load creator categories.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingNiches(false);
        }
      }
    }

    loadNiches();

    return () => {
      controller.abort();
    };
  }, []);

  // Debounce the search input to avoid a request on every keystroke.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query]);

  // Search creators using the existing Django API helper.
  useEffect(() => {
    const normalizedQuery = debouncedQuery.trim();

    if (normalizedQuery.length < 2) {
      setCreators([]);
      setHasSearched(false);
      setSearchError("");
      setLoadingCreators(false);
      return;
    }

    const controller = new AbortController();

    async function performSearch() {
      try {
        setLoadingCreators(true);
        setSearchError("");
        setHasSearched(true);

        const response = await searchCreators({
          query: normalizedQuery,
          page: 1,
          pageSize: 30,
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setCreators(response.results);
        }
      } catch {
        if (!controller.signal.aborted) {
          setCreators([]);
          setSearchError(
            "We couldn't load creators right now. Please try again.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingCreators(false);
        }
      }
    }

    performSearch();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  // Filter the returned search results by the selected niche.
  const filteredCreators = useMemo(() => {
    if (selectedNiche === "all") {
      return creators;
    }

    return creators.filter((creator) => creator.niche === selectedNiche);
  }, [creators, selectedNiche]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setCreators([]);
    setSelectedNiche("all");
    setSearchError("");
    setHasSearched(false);
    searchInputRef.current?.focus();
  }, []);

  const handleNicheChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNiche(event.target.value);
  };

  return (
    <section className="w-full" aria-labelledby="creator-search-heading">
      {/* Section heading */}
      <div className="mb-6">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-purple-600" />
          <span className="text-xs font-semibold tracking-wide text-purple-700">
            CREATOR DISCOVERY
          </span>
        </div>

        <h2
          id="creator-search-heading"
          className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
        >
          Find a creator
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
          Search for your favourite creators by name or username and find
          someone to support with Gems.
        </p>
      </div>

      {/* Search and niche filter */}
      <div className="rounded-2xl border border-purple-100 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search input */}
          <div className="relative min-w-0 flex-1">
            <FiSearch
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-purple-400"
            />

            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search creator name or username..."
              aria-label="Search creators by name or username"
              autoComplete="off"
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-purple-200 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
            />

            {query.length > 0 && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-purple-100 hover:text-purple-700"
              >
                <FiX className="text-lg" />
              </button>
            )}
          </div>

          {/* Niche filter */}
          <div className="relative sm:w-56 sm:shrink-0">
            <select
              value={selectedNiche}
              onChange={handleNicheChange}
              disabled={loadingNiches}
              aria-label="Filter search results by creator category"
              className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-700 outline-none transition hover:border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="all">All categories</option>

              {niches.map((niche) => (
                <option key={niche.value} value={niche.value}>
                  {niche.label}
                </option>
              ))}
            </select>

            <FiChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
          <p className="text-xs leading-5 text-gray-500">
            {loadingNiches
              ? "Loading categories..."
              : "Enter at least 2 characters to search."}
          </p>

          {selectedNiche !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedNiche("all")}
              className="text-xs font-semibold text-purple-700 transition hover:text-purple-900"
            >
              Clear category filter
            </button>
          )}
        </div>

        {nicheError && (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {nicheError} You can still search creators.
          </p>
        )}
      </div>

      {/* Search results */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {loadingCreators ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                  Finding creators
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Searching Tippified for matching creators...
                </p>
              </div>

              <GemDiscoverySkeleton count={6} />
            </motion.div>
          ) : searchError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-100 bg-red-50 px-5 py-8 text-center"
            >
              <p role="alert" className="text-sm font-medium text-red-700">
                {searchError}
              </p>

              <button
                type="button"
                onClick={() => {
                  setDebouncedQuery("");
                  window.setTimeout(() => {
                    setDebouncedQuery(query.trim());
                  }, 0);
                }}
                className="mt-4 rounded-xl bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800"
              >
                Try again
              </button>
            </motion.div>
          ) : hasSearched ? (
            <motion.div
              key={`results-${debouncedQuery}-${selectedNiche}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Search results
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredCreators.length}{" "}
                    {filteredCreators.length === 1 ? "creator" : "creators"}{" "}
                    found
                    {debouncedQuery ? ` for "${debouncedQuery}"` : ""}
                  </p>
                </div>

                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-50"
                  >
                    <FiX aria-hidden="true" />
                    Clear search
                  </button>
                )}
              </div>

              {filteredCreators.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredCreators.map((creator) => (
                    <CreatorResultCard
                      key={creator.referral_code}
                      creator={creator}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 px-5 py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-purple-600 shadow-sm">
                    <FiSearch className="text-2xl" />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-gray-900">
                    No creators found
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    {selectedNiche !== "all"
                      ? "No matching creators were found in this category. Try another category or remove the filter."
                      : "We couldn't find a creator matching that search. Check the spelling or try another name or username."}
                  </p>

                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-purple-700 px-5 text-sm font-semibold text-white transition hover:bg-purple-800"
                  >
                    Start a new search
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-5 py-10 text-center sm:py-12"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-purple-600 shadow-sm">
                <FiSearch className="text-2xl" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-gray-900">
                Who would you like to support?
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Enter a creator&apos; name or username above to find their
                Tippified profile.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
