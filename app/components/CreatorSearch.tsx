"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiSearch, FiX } from "react-icons/fi";

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

  const [isNicheMenuOpen, setIsNicheMenuOpen] = useState(false);
  const [nicheQuery, setNicheQuery] = useState("");
  const [highlightedNicheIndex, setHighlightedNicheIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const nicheSearchInputRef = useRef<HTMLInputElement>(null);
  const nicheMenuRef = useRef<HTMLDivElement>(null);
  const nicheTriggerRef = useRef<HTMLButtonElement>(null);

  const selectedNicheData = useMemo(
    () => niches.find((niche) => niche.value === selectedNiche),
    [niches, selectedNiche],
  );

  const filteredNiches = useMemo(() => {
    const normalizedQuery = nicheQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return niches;
    }

    return niches.filter((niche) =>
      niche.label.toLowerCase().includes(normalizedQuery),
    );
  }, [niches, nicheQuery]);

  const categoryOptions = useMemo(
    () => [
      {
        value: "all",
        label: "All categories",
        creator_count: niches.reduce(
          (total, niche) => total + niche.creator_count,
          0,
        ),
      },
      ...filteredNiches,
    ],
    [filteredNiches, niches],
  );

  // Load creator categories from the Django API.
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

  // Debounce the search input.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query]);

  // Search creators using the existing API helper.
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

  // Filter search results by the selected category.
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

  const selectNiche = useCallback((value: string) => {
    setSelectedNiche(value);
    setIsNicheMenuOpen(false);
    setNicheQuery("");
    setHighlightedNicheIndex(0);
  }, []);

  const toggleNicheMenu = useCallback(() => {
    if (loadingNiches || niches.length === 0) {
      return;
    }

    setIsNicheMenuOpen((isOpen) => !isOpen);
    setNicheQuery("");
    setHighlightedNicheIndex(0);
  }, [loadingNiches, niches.length]);

  // Focus the dropdown search field after opening.
  useEffect(() => {
    if (!isNicheMenuOpen) {
      return;
    }

    const timeout = window.setTimeout(() => {
      nicheSearchInputRef.current?.focus();
    }, 80);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isNicheMenuOpen]);

  // Close the dropdown when clicking outside it.
  useEffect(() => {
    if (!isNicheMenuOpen) {
      return;
    }

    function handleOutsideClick(event: MouseEvent) {
      if (
        nicheMenuRef.current &&
        !nicheMenuRef.current.contains(event.target as Node)
      ) {
        setIsNicheMenuOpen(false);
        setNicheQuery("");
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isNicheMenuOpen]);

  const handleNicheKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      if (!isNicheMenuOpen) {
        setIsNicheMenuOpen(true);
        setNicheQuery("");
        setHighlightedNicheIndex(0);
      }
    }
  };

  const handleNicheSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setIsNicheMenuOpen(false);
      setNicheQuery("");
      nicheTriggerRef.current?.focus();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setHighlightedNicheIndex((current) =>
        Math.min(current + 1, categoryOptions.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setHighlightedNicheIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const option = categoryOptions[highlightedNicheIndex];

      if (option) {
        selectNiche(option.value);
        nicheTriggerRef.current?.focus();
      }
    }
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

      {/* Search and category filter */}
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
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-11 text-base text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-purple-200 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
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

          {/* Premium custom category dropdown */}
          <div
            ref={nicheMenuRef}
            className="relative w-full sm:w-60 sm:shrink-0"
          >
            <button
              ref={nicheTriggerRef}
              type="button"
              onClick={toggleNicheMenu}
              onKeyDown={handleNicheKeyDown}
              disabled={loadingNiches || niches.length === 0}
              aria-label="Filter search results by creator category"
              aria-haspopup="listbox"
              aria-expanded={isNicheMenuOpen}
              className={`group flex h-12 w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 text-left outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                isNicheMenuOpen
                  ? "border-purple-500 ring-4 ring-purple-100"
                  : "border-gray-200 hover:border-purple-300 hover:shadow-sm focus-visible:border-purple-500 focus-visible:ring-4 focus-visible:ring-purple-100"
              }`}
            >
              <span className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100">
                  <FiSearch aria-hidden="true" className="text-sm" />
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-gray-800">
                    {loadingNiches
                      ? "Loading categories..."
                      : (selectedNicheData?.label ?? "All categories")}
                  </span>

                  {!loadingNiches && (
                    <span className="mt-0.5 block text-[10px] font-medium tracking-wide text-gray-400">
                      CREATOR CATEGORY
                    </span>
                  )}
                </span>
              </span>

              <FiChevronDown
                aria-hidden="true"
                className={`shrink-0 text-lg text-gray-400 transition-transform duration-200 ${
                  isNicheMenuOpen ? "rotate-180 text-purple-600" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isNicheMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 top-[calc(100%+10px)] z-50 w-full min-w-64 overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-[0_20px_60px_-15px_rgba(76,29,149,0.22)] sm:w-72"
                >
                  {/* Dropdown heading */}
                  <div className="border-b border-purple-50 bg-linear-to-br from-purple-50 via-white to-fuchsia-50/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Creator categories
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Find creators by interest
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsNicheMenuOpen(false);
                          setNicheQuery("");
                          nicheTriggerRef.current?.focus();
                        }}
                        aria-label="Close category menu"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white hover:text-purple-700 hover:shadow-sm"
                      >
                        <FiX aria-hidden="true" className="text-lg" />
                      </button>
                    </div>

                    {/* Search categories */}
                    <div className="relative mt-4">
                      <FiSearch
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-purple-400"
                      />

                      <input
                        ref={nicheSearchInputRef}
                        type="text"
                        value={nicheQuery}
                        onChange={(event) => {
                          setNicheQuery(event.target.value);
                          setHighlightedNicheIndex(0);
                        }}
                        onKeyDown={handleNicheSearchKeyDown}
                        placeholder="Search categories..."
                        aria-label="Search creator categories"
                        autoComplete="off"
                        className="h-10 w-full rounded-xl border border-purple-100 bg-white pl-9 pr-9 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                      />

                      {nicheQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setNicheQuery("");
                            setHighlightedNicheIndex(0);
                            nicheSearchInputRef.current?.focus();
                          }}
                          aria-label="Clear category search"
                          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-purple-50 hover:text-purple-700"
                        >
                          <FiX aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category options */}
                  <div
                    role="listbox"
                    aria-label="Creator categories"
                    className="max-h-64 overflow-y-auto p-2"
                  >
                    {categoryOptions.length > 0 ? (
                      categoryOptions.map((option, index) => {
                        const isSelected = selectedNiche === option.value;
                        const isHighlighted = highlightedNicheIndex === index;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onMouseEnter={() => setHighlightedNicheIndex(index)}
                            onClick={() => selectNiche(option.value)}
                            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-150 last:mb-0 ${
                              isSelected
                                ? "bg-purple-50 text-purple-800"
                                : isHighlighted
                                  ? "bg-gray-50 text-gray-900"
                                  : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                isSelected
                                  ? "bg-purple-600 text-white shadow-sm shadow-purple-200"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {isSelected ? (
                                <FiCheck
                                  aria-hidden="true"
                                  className="text-base"
                                />
                              ) : (
                                <FiSearch
                                  aria-hidden="true"
                                  className="text-sm"
                                />
                              )}
                            </span>

                            <span className="min-w-0 flex-1">
                              <span
                                className={`block truncate text-sm ${
                                  isSelected ? "font-bold" : "font-medium"
                                }`}
                              >
                                {option.label}
                              </span>

                              <span className="mt-0.5 block text-xs text-gray-400">
                                {option.value === "all"
                                  ? "Explore every category"
                                  : `${option.creator_count} ${
                                      option.creator_count === 1
                                        ? "creator"
                                        : "creators"
                                    }`}
                              </span>
                            </span>

                            {isSelected && (
                              <FiCheck
                                aria-hidden="true"
                                className="shrink-0 text-lg text-purple-600"
                              />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                          <FiSearch aria-hidden="true" className="text-lg" />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-gray-800">
                          No categories found
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          Try another category name.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dropdown footer */}
                  <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-4 py-3">
                    <span className="text-[11px] font-medium text-gray-400">
                      {niches.length}{" "}
                      {niches.length === 1 ? "category" : "categories"}
                    </span>

                    {selectedNiche !== "all" && (
                      <button
                        type="button"
                        onClick={() => selectNiche("all")}
                        className="text-xs font-semibold text-purple-700 transition hover:text-purple-900"
                      >
                        Reset filter
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search helper text */}
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
                  setSearchError("");
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
                Enter a creator&apos;s name or username above to find their
                Tippified profile.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
