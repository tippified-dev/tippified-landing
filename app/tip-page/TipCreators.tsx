"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEdit3,
  FiMail,
  FiMapPin,
  FiRefreshCw,
  FiUser,
} from "react-icons/fi";

interface Creator {
  id: number;
  username: string;
  referral_code: string;
  niche: string;
  bio?: string | null;
  location?: string | null;
  profile_image_url?: string | null;
  bvn_verified?: boolean;
  is_online?: boolean;
}

interface ExploreResponse {
  results?: Creator[];
  next?: string | null;
}

interface TipResponse {
  success: boolean;
  authorization_url?: string;
  reference?: string;
  message?: string;
  bank_status?: string;
}

const API_BASE_URL = "https://api.tippified.com";

const NICHE_LABELS: Record<string, string> = {
  content_creator: "Content Creator",
  music: "Music",
  comedy: "Comedy",
  fashion: "Fashion",
  beauty_style: "Beauty & Style",
  memes: "Memes",
  film_tv: "Film & TV",
  lifestyle: "Lifestyle",
  food_cooking: "Food & Cooking",
  fitness_wellness: "Fitness & Wellness",
  sports: "Sports",
  gaming: "Gaming",
  technology: "Technology",
  education: "Education",
  business_finance: "Business & Finance",
  real_estate: "Real Estate",
  dance: "Dance",
  hot_topics: "Hot Topics",
  artificial_intelligence: "Artificial Intelligence",
  news_gossips: "News & Gossips",
  cars: "Cars",
  forex: "Forex",
  events: "Events",
  social_media: "Social Media",
  art_design: "Art & Design",
  photography: "Photography",
  writing: "Writing & Literature",
  podcasting: "Podcasting",
  travel: "Travel",
  faith_inspiration: "Faith & Inspiration",
  Adult_content: "Adult Content",
  other: "Other",
};

const capitalizeWords = (text: string) => {
  if (!text) return "";

  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getFirstName = (username: string) => {
  return capitalizeWords(username).split(" ")[0] || "Creator";
};

export default function TipCreators() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [creatorIndex, setCreatorIndex] = useState(0);

  const [nextUrl, setNextUrl] = useState<string | null>(
    `${API_BASE_URL}/api/auth/creators/explore/?page=1`,
  );

  const [loadingCreators, setLoadingCreators] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [fanName, setFanName] = useState("");
  const [fanEmail, setFanEmail] = useState("");
  const [amount, setAmount] = useState("");

  const [tipLoading, setTipLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * ---------------------------------------------------------
   * CURRENT CREATOR
   * ---------------------------------------------------------
   */

  const currentCreator = creators[creatorIndex] || null;

  /*
   * ---------------------------------------------------------
   * FETCH CREATORS
   * ---------------------------------------------------------
   */

  const fetchCreators = useCallback(async (url: string, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoadingCreators(true);
    }

    setError("");

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to load creators.");
      }

      const data: ExploreResponse = await response.json();

      const newCreators = data.results || [];

      if (append) {
        setCreators((previous) => {
          const existingIds = new Set(previous.map((creator) => creator.id));

          const uniqueCreators = newCreators.filter(
            (creator) => !existingIds.has(creator.id),
          );

          return [...previous, ...uniqueCreators];
        });
      } else {
        setCreators(newCreators);
      }

      setNextUrl(data.next || null);
    } catch (err) {
      console.error("Failed to load creators:", err);

      setError("We couldn't load creators right now. Please try again.");
    } finally {
      setLoadingCreators(false);
      setLoadingMore(false);
    }
  }, []);

  /*
   * ---------------------------------------------------------
   * INITIAL CREATOR LOAD
   * ---------------------------------------------------------
   */

  useEffect(() => {
    fetchCreators(`${API_BASE_URL}/api/auth/creators/explore/?page=1`, false);
  }, [fetchCreators]);

  /*
   * ---------------------------------------------------------
   * MORE CREATORS
   *
   * We don't immediately show the next creator if we have
   * reached the end of our locally loaded batch.
   *
   * Instead, we fetch another Explore page first.
   * ---------------------------------------------------------
   */

  const handleMoreCreators = async () => {
    setError("");

    /*
     * If there is another creator already loaded locally,
     * simply replace the current creator.
     */
    if (creatorIndex < creators.length - 1) {
      setCreatorIndex((previous) => previous + 1);
      return;
    }

    /*
     * We reached the end of the currently loaded creators.
     * Get another batch from the Explore API.
     */
    if (nextUrl && !loadingMore) {
      const previousLength = creators.length;

      await fetchCreators(nextUrl, true);

      /*
       * The state update is asynchronous, so we cannot rely
       * on creators.length immediately here.
       *
       * The effect below will handle selecting the next creator.
       */
      setCreatorIndex(previousLength);
      return;
    }

    /*
     * If there are no more creators from the API, start again
     * from the beginning.
     */
    if (!nextUrl && creators.length > 0) {
      setCreatorIndex(0);
    }
  };

  /*
   * ---------------------------------------------------------
   * AMOUNT
   * ---------------------------------------------------------
   */

  const formattedAmount = useMemo(() => {
    if (!amount) return "";

    const number = Number(amount);

    if (!Number.isFinite(number)) return "";

    return number.toLocaleString("en-NG");
  }, [amount]);

  /*
   * ---------------------------------------------------------
   * TIP CREATOR
   * ---------------------------------------------------------
   */

  const handleTip = async () => {
    if (!currentCreator) {
      setError("Please select a creator first.");
      return;
    }

    const cleanName = fanName.trim();
    const cleanEmail = fanEmail.trim().toLowerCase();
    const numericAmount = Number(amount);

    setError("");

    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!amount) {
      setError("Please enter a tip amount.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid tip amount.");
      return;
    }

    setTipLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/fan/tip/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creator_id: currentCreator.id,
          referral_code: currentCreator.referral_code,
          fan_name: cleanName,
          email: cleanEmail,
          amount: numericAmount,
        }),
      });

      const data: TipResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to initialize your tip.");
      }

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
        return;
      }

      setError(
        data.message || "We couldn't start the payment. Please try again.",
      );
    } catch (err) {
      console.error("Tip error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Payment could not be initialized. Please try again.");
      }
    } finally {
      setTipLoading(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * LOADING STATE
   * ---------------------------------------------------------
   */

  if (loadingCreators) {
    return (
      <div className="rounded-4xl border border-purple-100 bg-white p-8 shadow-[0_24px_60px_-20px_rgba(88,28,174,0.18)]">
        <div className="flex min-h-105 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600" />

            <p className="mt-4 text-sm font-semibold text-purple-500">
              Finding creators to support...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * EMPTY STATE
   * ---------------------------------------------------------
   */

  if (!currentCreator) {
    return (
      <div className="rounded-4xl border border-purple-100 bg-white p-8 text-center shadow-[0_24px_60px_-20px_rgba(88,28,174,0.18)]">
        <h2 className="text-xl font-extrabold text-purple-950">
          No creators available
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          We could not find any creators to display right now.
        </p>

        <button
          type="button"
          onClick={() =>
            fetchCreators(`${API_BASE_URL}/api/auth/creators/explore/?page=1`)
          }
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-purple-700 px-6 py-3 text-sm font-bold text-white"
        >
          <FiRefreshCw size={15} />
          Try again
        </button>
      </div>
    );
  }

  const creatorName = capitalizeWords(currentCreator.username);
  const firstName = getFirstName(currentCreator.username);

  return (
    <div className="rounded-4xl border border-purple-100 bg-white p-6 shadow-[0_24px_60px_-20px_rgba(88,28,174,0.18)] sm:p-8">
      {/* --------------------------------------------------- */}
      {/* SELECTED CREATOR */}
      {/* --------------------------------------------------- */}

      <div className="text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-purple-400">
          You&apos;re supporting
        </p>

        {/* Profile image */}
        <div className="mx-auto mt-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-purple-50 bg-purple-100 shadow-md">
          {currentCreator.profile_image_url ? (
            <Image
              src={currentCreator.profile_image_url}
              alt={`${creatorName} on Tippified`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-3xl font-extrabold text-purple-600">
              {creatorName.charAt(0)}
            </span>
          )}
        </div>

        {/* Creator name */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-purple-950">
            {creatorName}
          </h2>

          {currentCreator.bvn_verified && (
            <FiCheckCircle
              size={18}
              className="text-purple-600"
              aria-label="Verified creator"
            />
          )}
        </div>

        {/* Username */}
        <p className="mt-1 text-xs font-bold text-purple-400">
          @{currentCreator.referral_code}
        </p>

        {/* Creator information */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {currentCreator.location && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-[#f8f5ff] px-3 py-1.5 text-[11px] font-semibold text-purple-700">
              <FiMapPin size={12} />
              {currentCreator.location}
            </span>
          )}

          {currentCreator.niche && (
            <span className="rounded-full bg-purple-50 px-3 py-1.5 text-[11px] font-bold text-purple-600 ring-1 ring-purple-100">
              {NICHE_LABELS[currentCreator.niche] || currentCreator.niche}
            </span>
          )}
        </div>

        {/* Bio */}
        {currentCreator.bio && (
          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-gray-600">
            {currentCreator.bio}
          </p>
        )}
      </div>

      {/* --------------------------------------------------- */}
      {/* MORE CREATORS */}
      {/* --------------------------------------------------- */}

      <button
        type="button"
        onClick={handleMoreCreators}
        disabled={loadingMore}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-purple-200 bg-purple-50 py-3 text-sm font-bold text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loadingMore ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600" />
            Finding more creators...
          </>
        ) : (
          <>
            <FiRefreshCw size={15} />
            More creators
          </>
        )}
      </button>

      {/* --------------------------------------------------- */}
      {/* TIP FORM */}
      {/* --------------------------------------------------- */}

      <div className="mt-8 border-t border-purple-100 pt-8">
        <div className="text-center">
          <h3 className="text-xl font-extrabold text-purple-950">
            Send {firstName} a tip
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Enter your details and choose how much you&apos;d like to send.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {/* Name */}
          <div className="relative">
            <FiUser
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-purple-300"
              size={16}
            />

            <input
              type="text"
              value={fanName}
              onChange={(event) => setFanName(event.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className="w-full rounded-2xl border border-purple-100 bg-[#f8f5ff] py-3.5 pl-11 pr-4 text-base font-medium text-purple-900 outline-none placeholder:text-purple-300 focus:border-purple-200 focus:bg-white focus:ring-4 focus:ring-purple-50"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-purple-300"
              size={16}
            />

            <input
              type="email"
              value={fanEmail}
              onChange={(event) => setFanEmail(event.target.value)}
              placeholder="Your email address"
              autoComplete="email"
              inputMode="email"
              className="w-full rounded-2xl border border-purple-100 bg-[#f8f5ff] py-3.5 pl-11 pr-4 text-base font-medium text-purple-900 outline-none placeholder:text-purple-300 focus:border-purple-200 focus:bg-white focus:ring-4 focus:ring-purple-50"
            />
          </div>

          {/* Amount */}
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-purple-500">
              ₦
            </span>

            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Tip amount"
              className="w-full rounded-2xl border border-purple-100 bg-[#f8f5ff] py-3.5 pl-10 pr-4 text-base font-bold text-purple-900 outline-none placeholder:text-purple-300 focus:border-purple-200 focus:bg-white focus:ring-4 focus:ring-purple-50"
            />
          </div>

          {/* Amount preview */}
          {formattedAmount && (
            <p className="px-2 text-right text-[11px] font-bold text-purple-400">
              ₦{formattedAmount}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* Tip button */}
        <button
          type="button"
          onClick={handleTip}
          disabled={tipLoading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_20px_-8px_rgba(124,58,237,0.6)] transition hover:shadow-[0_16px_28px_-8px_rgba(124,58,237,0.7)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {tipLoading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Preparing payment...
            </>
          ) : (
            <>
              Tip {firstName}
              <FiArrowRight size={17} />
            </>
          )}
        </button>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-gray-400">
          <FiEdit3 size={11} />
          You&apos;ll be redirected to Paystack to complete your payment.
        </p>
      </div>
    </div>
  );
}
