"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { FiUser, FiX } from "react-icons/fi";
interface ProfileImageViewerProps {
  imageUrl: string | null;
  username: string;
}
export default function ProfileImageViewer({
  imageUrl,
  username,
}: ProfileImageViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  /*
   * If there is no profile image, we still render the normal avatar,
   * but there is nothing to expand.
   */
  if (!imageUrl) {
    return (
      <div className="relative h-24 w-24 overflow-hidden rounded-4xl bg-linear-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="flex h-full w-full items-center justify-center">
          <FiUser size={42} strokeWidth={1.8} />
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Normal profile image */}
      <motion.button
        type="button"
        layoutId="creator-profile-image"
        onClick={() => setIsExpanded(true)}
        className="relative h-24 w-24 cursor-zoom-in overflow-hidden rounded-4xl bg-white shadow-lg ring-1 ring-purple-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        whileHover={{
          scale: 1.035,
          boxShadow: "0 18px 45px -18px rgba(124, 58, 237, 0.45)",
        }}
        whileTap={{ scale: 0.97 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        aria-label={`View ${username}'s profile picture`}
      >
        <Image
          src={imageUrl}
          alt={`${username} profile picture`}
          fill
          priority
          className="object-cover"
          sizes="96px"
        />
        {/* Subtle premium shine */}
        <motion.div
          className="pointer-events-none absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0"
          initial={{ x: "-120%" }}
          whileHover={{ x: "120%" }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        />
      </motion.button>
      {/* Expanded viewer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center p-5 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={() => setIsExpanded(false)}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-[#120b1f]/75 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            {/* Image */}
            <motion.button
              type="button"
              layoutId="creator-profile-image"
              onClick={(event) => {
                event.stopPropagation();
                setIsExpanded(false);
              }}
              className="relative z-10 aspect-square w-[min(88vw,520px)] cursor-zoom-out overflow-hidden rounded-4xl bg-white shadow-[0_35px_100px_-25px_rgba(0,0,0,0.65)] ring-1 ring-white/20 focus:outline-none"
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
                mass: 0.8,
              }}
              aria-label={`Close ${username}'s profile picture`}
            >
              <Image
                src={imageUrl}
                alt={`${username} profile picture`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 88vw, 520px"
              />
              {/* Image edge glow */}
              <div className="pointer-events-none absolute inset-0 rounded-4xl ring-1 ring-inset ring-white/20" />
              {/* Close button */}
              <motion.span
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.12, duration: 0.2 }}
              >
                <FiX size={18} />
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
