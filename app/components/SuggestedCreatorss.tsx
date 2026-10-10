"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { FiRefreshCw, FiUsers } from "react-icons/fi";

import { getSuggestedCreators, type GemCreator } from "../lib/gems/api";
import CreatorResultCard from "./CreatorResultCard";
import GemDiscoverySkeleton from "./GemDiscoverySkeleton";

interface SuggestedCreatorsProps {
  niche?: string;
  limit?: number;
  title?: string;
  description?: string;
}

export default function SuggestedCreators({
  niche,
  limit = 6,
  title = "Creators worth discovering",
  description = "Discover creators on Tippified and show your appreciation by sending them Gems.",
}: SuggestedCreatorsProps) {
  const [creators, setCreators] = useState<GemCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadCreators = useCallback(
    async (signal?: AbortSignal, isRefresh = false) => {
      try {
        setError("");

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await getSuggestedCreators({
          niche,
          page: 1,
          pageSize: limit,
          signal,
        });

        if (!signal?.aborted) {
          setCreators(response.results);
        }
      } catch {
        if (!signal?.aborted) {
          setError(
            "We couldn't load suggested creators right now. Please try again.",
          );
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [niche, limit],
  );

  useEffect(() => {
    const controller = new AbortController();

    loadCreators(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadCreators]);

  const handleRefresh = () => {
    loadCreators(undefined, true);
  };

  return (
    <section className="w-full" aria-labelledby="suggested-creators-heading">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5">
            <FiUsers aria-hidden="true" className="text-purple-600" />
            <span className="text-xs font-semibold tracking-wide text-purple-700">
              DISCOVER CREATORS
            </span>
          </div>

          <h2
            id="suggested-creators-heading"
            className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
          >
            {title}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-purple-200 bg-white px-4 text-sm font-semibold text-purple-700 transition hover:border-purple-300 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
        >
          <FiRefreshCw
            aria-hidden="true"
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GemDiscoverySkeleton count={limit} />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-100 bg-red-50 px-5 py-10 text-center"
          >
            <h3 className="text-base font-semibold text-gray-900">
              Something went wrong
            </h3>

            <p
              role="alert"
              className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-700"
            >
              {error}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-purple-700 px-5 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:opacity-60"
            >
              <FiRefreshCw
                aria-hidden="true"
                className={refreshing ? "animate-spin" : ""}
              />
              Try again
            </button>
          </motion.div>
        ) : creators.length > 0 ? (
          <motion.div
            key="creators"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {creators.map((creator) => (
              <CreatorResultCard
                key={creator.referral_code}
                creator={creator}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 px-5 py-12 text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-purple-600 shadow-sm">
              <FiUsers className="text-2xl" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-gray-900">
              No creators to show yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              We are working on bringing more creators to discovery. Please
              check back soon.
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-4 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 disabled:opacity-50"
            >
              <FiRefreshCw
                aria-hidden="true"
                className={refreshing ? "animate-spin" : ""}
              />
              Check again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
