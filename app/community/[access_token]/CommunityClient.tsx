"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  FiCheckCircle,
  FiLock,
  FiMessageCircle,
  FiShield,
} from "react-icons/fi";

interface Community {
  id: number;
  name: string;
  description: string;
  price: string;
  currency: "NGN" | "GHS" | "KES";
  creator_username: string;
  is_active: boolean;
}

interface CommunityClientProps {
  accessToken: string;
  community: Community | null;
}

const API_BASE_URL = "https://api.tippified.com";

const currencySymbol = (currency: string) => {
  switch (currency) {
    case "NGN":
      return "₦";
    case "GHS":
      return "GH₵";
    case "KES":
      return "KSh";
    default:
      return "";
  }
};

export default function CommunityClient({
  accessToken,
  community,
}: CommunityClientProps) {
  const [fanName, setFanName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  if (!community) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-4xl border border-purple-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <FiMessageCircle size={24} />
          </div>

          <h1 className="mt-5 text-xl font-extrabold text-purple-950">
            Community unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-purple-500">
            This paid community could not be found or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  const symbol = currencySymbol(community.currency);

  const formattedPrice = Number(community.price).toLocaleString();

  const handlePayment = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!whatsappNumber.trim()) {
      setError("Please enter your WhatsApp number.");
      return;
    }

    try {
      setPaying(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/paid-community/${accessToken}/pay/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fan_name: fanName.trim() || "Anonymous",
            email: email.trim().toLowerCase(),
            whatsapp_number: whatsappNumber.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.message || "Unable to initialize payment.");
      }

      if (!data.authorization_url) {
        throw new Error("Payment authorization URL was not returned.");
      }

      window.location.href = data.authorization_url;
    } catch (err) {
      console.error("Community payment error:", err);

      setError(
        err instanceof Error ? err.message : "Unable to initialize payment.",
      );

      setPaying(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-10 sm:py-14">
      {/* BRAND */}
      <div className="mb-8 flex justify-center">
        <div className="flex items-center gap-2 text-sm font-extrabold text-purple-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-purple-600 to-indigo-600 text-white">
            <FiMessageCircle size={15} />
          </div>
          Tippified
        </div>
      </div>

      {/* COMMUNITY */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-4xl border border-purple-100 bg-white shadow-[0_25px_70px_-30px_rgba(124,58,237,0.25)]"
      >
        <div className="absolute left-0 top-0 h-1 w-full bg-linear-to-r from-purple-600 via-violet-500 to-indigo-500" />

        <div className="p-6 sm:p-8">
          {/* COMMUNITY ICON */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
              <FiMessageCircle size={27} />
            </div>
          </div>

          {/* TITLE */}
          <div className="mt-5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-purple-400">
              @{community.creator_username}
            </p>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-purple-950 sm:text-3xl">
              {community.name}
            </h1>

            <p className="mt-2 text-sm text-purple-500">
              Join this exclusive WhatsApp community.
            </p>
          </div>

          {/* DESCRIPTION */}
          {community.description && (
            <div className="mt-6 rounded-2xl bg-[#f8f5ff] p-4 ring-1 ring-purple-50">
              <p className="text-sm leading-6 text-purple-700/75">
                {community.description}
              </p>
            </div>
          )}

          {/* PRICE */}
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-purple-100 px-4 py-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
                Community Access
              </p>

              <p className="mt-1 text-2xl font-extrabold text-purple-950">
                {symbol}
                {formattedPrice}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <FiCheckCircle size={21} />
            </div>
          </div>

          {/* FORM */}
          <div className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-purple-700">
                Your Name
              </label>

              <input
                type="text"
                value={fanName}
                onChange={(e) => setFanName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-purple-100 px-4 py-3.5 text-base text-purple-950 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-purple-700">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-purple-100 px-4 py-3.5 text-base text-purple-950 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-bold text-purple-700">
                WhatsApp Number
              </label>

              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+234 801 234 5678"
                autoComplete="tel"
                className="w-full rounded-xl border border-purple-100 px-4 py-3.5 text-base text-purple-950 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />

              <p className="mt-1.5 text-[10px] text-purple-400">
                Enter the WhatsApp number you will use to join the community.
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-xs leading-5 text-red-600 ring-1 ring-red-100">
                {error}
              </div>
            )}

            {/* PAY */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              type="button"
              onClick={handlePayment}
              disabled={paying}
              className="flex w-full items-center justify-center rounded-full bg-linear-to-br from-purple-600 to-indigo-600 px-5 py-4 text-sm font-bold text-white shadow-[0_12px_25px_-10px_rgba(124,58,237,0.65)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paying ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Preparing Payment...
                </span>
              ) : (
                `Pay ${symbol}${formattedPrice} to Join`
              )}
            </motion.button>
          </div>

          {/* SECURITY */}
          <div className="mt-5 rounded-xl bg-purple-50 px-3 py-3">
            <div className="flex items-start gap-2">
              <FiLock size={13} className="mt-0.5 shrink-0 text-purple-500" />

              <p className="text-[10.5px] leading-4 text-purple-600">
                The private WhatsApp invite link is protected and will only be
                provided after successful payment.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-purple-400">
            <FiShield size={12} />
            Secure payment powered by Paystack
          </div>
        </div>
      </motion.div>

      <p className="mt-5 text-center text-[10px] text-purple-300">
        You will be redirected to Paystack to complete your payment.
      </p>
    </div>
  );
}
