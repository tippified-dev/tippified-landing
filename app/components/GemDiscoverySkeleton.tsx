"use client";

import { motion } from "framer-motion";

interface GemDiscoverySkeletonProps {
  count?: number;
}

export default function GemDiscoverySkeleton({
  count = 6,
}: GemDiscoverySkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      role="status"
      aria-label="Loading creators"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            delay: index * 0.04,
          }}
          className="overflow-hidden rounded-2xl border border-purple-100 bg-white p-5 shadow-sm"
        >
          {/* Creator identity */}
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="h-14 w-14 animate-pulse rounded-full bg-purple-100" />

              {/* Online status placeholder */}
              <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-purple-200" />
            </div>

            <div className="min-w-0 flex-1 space-y-2 pt-1">
              {/* Creator name */}
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-200" />

              {/* Username */}
              <div className="h-3 w-1/2 animate-pulse rounded-md bg-gray-100" />

              {/* Creator niche */}
              <div className="h-5 w-24 animate-pulse rounded-full bg-purple-50" />
            </div>
          </div>

          {/* Creator bio */}
          <div className="mt-5 space-y-2">
            <div className="h-3 w-full animate-pulse rounded-md bg-gray-100" />
            <div className="h-3 w-5/6 animate-pulse rounded-md bg-gray-100" />
          </div>

          {/* Creator location */}
          <div className="mt-4 flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded bg-purple-100" />
            <div className="h-3 w-28 animate-pulse rounded-md bg-gray-100" />
          </div>

          {/* Action button */}
          <div className="mt-5 border-t border-gray-100 pt-4">
            <div className="h-11 w-full animate-pulse rounded-xl bg-purple-100" />
          </div>
        </motion.div>
      ))}

      {/* Screen-reader announcement */}
      <span className="sr-only">Loading creators. Please wait.</span>
    </div>
  );
}
