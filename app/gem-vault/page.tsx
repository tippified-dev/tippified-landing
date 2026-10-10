"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiChevronRight,
  FiHexagon,
  FiLoader,
  FiLock,
  FiMail,
  FiPackage,
  FiShield,
  FiShoppingBag,
} from "react-icons/fi";

const API_BASE_URL = "https://api.tippified.com";

const API = {
  requestOtp: `${API_BASE_URL}/api/auth/gems/vault/request-otp/`,
  verifyOtp: `${API_BASE_URL}/api/auth/gems/vault/verify-otp/`,
};

type GemVaultGem = {
  gem_id: string;
  name: string;
  quantity: number;
  icon: string;
};

type GemVaultResponse = {
  success: boolean;
  vault_found: boolean;
  message?: string;
  fan?: {
    full_name: string;
    email: string;
  };
  vault_gems?: GemVaultGem[];
};

type VaultStage = "email" | "otp" | "vault";

export default function GemVaultPage() {
  const [stage, setStage] = useState<VaultStage>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [vaultData, setVaultData] = useState<GemVaultResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const vaultGems = vaultData?.vault_gems ?? [];

  const totalGems = vaultGems.reduce(
    (total, gem) => total + Math.max(0, gem.quantity),
    0,
  );

  const displayName = vaultData?.fan?.full_name?.trim().split(/\s+/)[0];

  const handleRequestOTP = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await axios.post(
        API.requestOtp,
        { email: normalizedEmail },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.success) {
        setEmail(normalizedEmail);
        setOtp("");
        setStage("otp");
        setNotice("Your verification code has been sent.");
      } else {
        setError(
          response.data?.message || "Unable to send the verification code.",
        );
      }
    } catch (err: unknown) {
      console.error("GEM VAULT OTP REQUEST FAILED:", err);

      if (axios.isAxiosError<{ message?: string }>(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to send the verification code. Please try again.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the six-digit verification code.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await axios.post<GemVaultResponse>(
        API.verifyOtp,
        {
          email: email.trim().toLowerCase(),
          otp,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data?.success) {
        setVaultData(response.data);
        setStage("vault");
        setOtp("");
        return;
      }

      setError(response.data?.message || "Unable to verify the code.");
    } catch (err: unknown) {
      console.error("GEM VAULT OTP VERIFICATION FAILED:", err);

      if (axios.isAxiosError<{ message?: string }>(err)) {
        setError(
          err.response?.data?.message ||
            "Incorrect or expired verification code. Please try again.",
        );
      } else {
        setError("Unable to verify the code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStage("email");
    setOtp("");
    setError("");
    setNotice("");
  };

  const handleChangeEmail = () => {
    setStage("email");
    setEmail("");
    setOtp("");
    setVaultData(null);
    setError("");
    setNotice("");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#241342]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#faf8ff]">
        <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-purple-200/40 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 top-20 -z-10 h-96 w-96 rounded-full bg-indigo-200/40 blur-[110px]" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:px-12 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white/80 px-4 py-2 text-xs font-bold text-purple-700 shadow-sm">
              <FiHexagon size={14} />
              Your Tippified Gem Vault
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-[#28134c] sm:text-5xl lg:text-6xl">
              Your Gems.
              <br />
              Your Collection.
              <br />
              <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Your Way to Celebrate.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#76688e] sm:text-lg sm:leading-8">
              Access your Tippified Gem Vault, check your available Gems, and
              get ready to celebrate the creators who make your day better. Your
              collection is only a few steps away.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#access-vault"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(109,40,217,0.75)] transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <FiLock size={16} />
                Access My Vault
              </a>

              <Link
                href="/buy-gem"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-purple-200 bg-white px-7 py-3 text-sm font-bold text-purple-700 transition hover:border-purple-400 hover:bg-purple-50"
              >
                <FiShoppingBag size={16} />
                Buy Gems
                <FiChevronRight size={15} />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-[#8a7da0]">
              <span className="inline-flex items-center gap-2">
                <FiShield className="text-purple-600" size={15} />
                Email verification
              </span>
              <span className="inline-flex items-center gap-2">
                <FiLock className="text-purple-600" size={15} />
                Private collection
              </span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="absolute inset-8 rounded-[3rem] bg-linear-to-br from-purple-300/40 to-indigo-300/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-4xl border border-white bg-white/85 p-5 shadow-[0_30px_100px_-35px_rgba(76,29,149,0.35)] backdrop-blur-xl sm:rounded-[2.5rem] sm:p-8">
              <div className="flex items-center justify-between border-b border-purple-50 pb-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-linear-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200">
                    <FiHexagon size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-extrabold text-[#28134c]">
                      Gem Vault
                    </p>
                    <p className="mt-1 text-xs text-[#9b8caf]">
                      Your personal collection
                    </p>
                  </div>
                </div>

                <div className="grid h-10 w-10 place-items-center rounded-full bg-purple-50 text-purple-600">
                  <FiShield size={17} />
                </div>
              </div>

              <div className="mt-7 rounded-3xl bg-linear-to-br from-[#f5efff] via-[#f9f7ff] to-[#eef0ff] p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-purple-500">
                      Made for appreciation
                    </p>
                    <p className="mt-2 text-2xl font-black text-[#30165c] sm:text-3xl">
                      Celebrate Creators
                    </p>
                  </div>

                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-purple-600 shadow-sm">
                    <FiHexagon size={22} />
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-3 gap-3">
                  {[
                    { symbol: "✦", label: "Collect" },
                    { symbol: "◇", label: "Celebrate" },
                    { symbol: "♡", label: "Support" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + index * 0.12 }}
                      className="rounded-2xl border border-white bg-white/80 px-2 py-4 text-center shadow-sm"
                    >
                      <span className="text-2xl font-black text-purple-600">
                        {item.symbol}
                      </span>
                      <p className="mt-2 text-[11px] font-bold text-[#75618e]">
                        {item.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-purple-100 bg-white p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-50 text-purple-600">
                  <FiMail size={18} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#39205e]">
                    Simple and secure access
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-[#9686aa]">
                    Verify your email to view your Gems.
                  </p>
                </div>
                <FiCheck
                  className="ml-auto shrink-0 text-emerald-500"
                  size={18}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VAULT ACCESS */}
      <section
        id="access-vault"
        className="scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-purple-600">
              Your collection awaits
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#28134c] sm:text-4xl">
              Access Your Gem Vault
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#827493] sm:text-base">
              Enter the email address you used when purchasing Gems. We will
              send a verification code before showing your collection.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <div className="overflow-hidden rounded-4xl border border-purple-100 bg-white shadow-[0_25px_80px_-35px_rgba(76,29,149,0.3)]">
              <div className="h-1.5 bg-linear-to-r from-purple-600 via-violet-500 to-indigo-600" />

              <div className="p-5 sm:p-9">
                <AnimatePresence mode="wait">
                  {/* EMAIL STAGE */}
                  {stage === "email" && (
                    <motion.div
                      key="email"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-purple-50 text-purple-600 ring-1 ring-purple-100">
                        <FiMail size={25} />
                      </div>

                      <div className="mt-5 text-center">
                        <h3 className="text-xl font-extrabold text-[#28134c]">
                          Verify your email
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8a7a9f]">
                          Use the email address associated with your Gem Vault
                          to receive a six-digit verification code.
                        </p>
                      </div>

                      <form onSubmit={handleRequestOTP} className="mt-7">
                        <label
                          htmlFor="vault-email"
                          className="mb-2 block text-sm font-bold text-[#4a326b]"
                        >
                          Email address
                        </label>

                        <input
                          id="vault-email"
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          autoCapitalize="none"
                          spellCheck={false}
                          required
                          maxLength={254}
                          disabled={loading}
                          className="w-full rounded-2xl border border-purple-100 bg-[#faf8ff] px-4 py-4 text-base text-[#28134c] outline-none transition placeholder:text-[#c0b4d0] focus:border-purple-400 focus:ring-4 focus:ring-purple-100/70 disabled:opacity-60"
                        />

                        {error && (
                          <p
                            role="alert"
                            className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                          >
                            {error}
                          </p>
                        )}

                        {notice && (
                          <p
                            role="status"
                            className="mt-3 text-sm font-medium text-emerald-600"
                          >
                            {notice}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={loading || !email.trim()}
                          className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 px-5 py-4 text-sm font-extrabold text-white shadow-[0_15px_30px_-15px_rgba(88,28,174,0.7)] transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {loading ? (
                            <>
                              <FiLoader className="animate-spin" size={17} />
                              Sending verification code...
                            </>
                          ) : (
                            <>
                              Send Verification Code
                              <FiChevronRight size={17} />
                            </>
                          )}
                        </button>
                      </form>

                      <div className="mt-5 flex items-start gap-2 rounded-2xl bg-[#faf8ff] p-4">
                        <FiShield
                          className="mt-0.5 shrink-0 text-purple-600"
                          size={16}
                        />
                        <p className="text-xs leading-5 text-[#8c7da0]">
                          Your collection is private. You must verify your email
                          before your Gem Vault can be displayed.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* OTP STAGE */}
                  {stage === "otp" && (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        type="button"
                        onClick={handleBackToEmail}
                        disabled={loading}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-purple-600 transition hover:text-indigo-700 disabled:opacity-50"
                      >
                        <FiArrowLeft size={16} />
                        Change email
                      </button>

                      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-purple-50 text-purple-600 ring-1 ring-purple-100">
                        <FiMail size={25} />
                      </div>

                      <div className="mt-5 text-center">
                        <h3 className="text-xl font-extrabold text-[#28134c]">
                          Check your inbox
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8a7a9f]">
                          Enter the six-digit verification code sent to
                        </p>

                        <p className="mt-2 break-all text-sm font-extrabold text-purple-700">
                          {email}
                        </p>
                      </div>

                      <form onSubmit={handleVerifyOTP} className="mt-7">
                        <label
                          htmlFor="vault-otp"
                          className="mb-2 block text-sm font-bold text-[#4a326b]"
                        >
                          Verification code
                        </label>

                        <input
                          id="vault-otp"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]{6}"
                          maxLength={6}
                          minLength={6}
                          value={otp}
                          onChange={(event) =>
                            setOtp(
                              event.target.value.replace(/\D/g, "").slice(0, 6),
                            )
                          }
                          placeholder="000000"
                          autoComplete="one-time-code"
                          required
                          disabled={loading}
                          className="w-full rounded-2xl border border-purple-100 bg-[#faf8ff] px-4 py-5 text-center text-2xl font-black tracking-[0.5em] text-[#28134c] outline-none transition placeholder:text-[#d4c9e2] focus:border-purple-400 focus:ring-4 focus:ring-purple-100/70 disabled:opacity-60"
                        />

                        {error && (
                          <p
                            role="alert"
                            className="mt-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                          >
                            {error}
                          </p>
                        )}

                        {notice && (
                          <p
                            role="status"
                            className="mt-3 text-sm font-medium text-emerald-600"
                          >
                            {notice}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={loading || otp.length !== 6}
                          className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 px-5 py-4 text-sm font-extrabold text-white shadow-[0_15px_30px_-15px_rgba(88,28,174,0.7)] transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {loading ? (
                            <>
                              <FiLoader className="animate-spin" size={17} />
                              Verifying your code...
                            </>
                          ) : (
                            <>
                              <FiLock size={16} />
                              Verify & Open Vault
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRequestOTP()}
                          disabled={loading}
                          className="mt-4 w-full py-2 text-sm font-bold text-purple-600 transition hover:text-indigo-700 disabled:opacity-50"
                        >
                          Resend verification code
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {/* VAULT STAGE */}
                  {stage === "vault" && (
                    <motion.div
                      key="vault"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {vaultData?.vault_found ? (
                        <>
                          <div className="text-center">
                            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200">
                              <FiCheck size={28} />
                            </div>

                            <h3 className="mt-5 text-2xl font-black text-[#28134c]">
                              {displayName
                                ? `Welcome, ${displayName}`
                                : "Your Gem Vault"}
                            </h3>

                            <p className="mt-2 break-all text-sm text-[#8a7a9f]">
                              {vaultData.fan?.email || email}
                            </p>
                          </div>

                          {vaultData.fan?.email &&
                            vaultData.fan.email.toLowerCase() !==
                              email.toLowerCase() && (
                              <p className="mt-4 text-center text-xs text-[#8a7a9f]">
                                Signed in to your verified Gem Vault.
                              </p>
                            )}

                          {vaultGems.length > 0 ? (
                            <div className="mt-8">
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                  <h4 className="text-sm font-extrabold uppercase tracking-widest text-[#8a7a9f]">
                                    Your Collection
                                  </h4>
                                  <p className="mt-1 text-xs text-[#a99bb8]">
                                    Gems available in your vault
                                  </p>
                                </div>

                                <div className="shrink-0 rounded-2xl bg-purple-50 px-4 py-3 text-center ring-1 ring-purple-100">
                                  <p className="text-2xl font-black text-purple-700">
                                    {totalGems.toLocaleString()}
                                  </p>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-500">
                                    Total Gems
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {vaultGems.map((gem) => (
                                  <motion.div
                                    key={gem.gem_id}
                                    whileHover={{ y: -3 }}
                                    className="rounded-2xl border border-purple-100 bg-linear-to-br from-[#faf8ff] to-white p-4 text-center shadow-sm transition-shadow hover:shadow-md sm:p-5"
                                  >
                                    {gem.icon ? (
                                      <div className="relative mx-auto h-16 w-16">
                                        <Image
                                          src={gem.icon}
                                          alt={gem.name}
                                          width={64}
                                          height={64}
                                          unoptimized
                                          className="h-16 w-16 object-contain"
                                        />
                                      </div>
                                    ) : (
                                      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-purple-50 text-purple-500">
                                        <FiHexagon size={28} />
                                      </div>
                                    )}

                                    <p className="mt-3 text-sm font-extrabold text-[#39205e]">
                                      {gem.name}
                                    </p>

                                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1.5">
                                      <FiHexagon
                                        className="text-purple-600"
                                        size={12}
                                      />
                                      <span className="text-xs font-extrabold text-purple-700">
                                        × {gem.quantity.toLocaleString()}
                                      </span>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>

                              <Link
                                href="/buy-gem"
                                className="mt-7 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 px-5 py-4 text-sm font-extrabold text-white shadow-[0_15px_30px_-15px_rgba(88,28,174,0.7)] transition hover:-translate-y-0.5 hover:shadow-lg"
                              >
                                <FiShoppingBag size={17} />
                                Purchase More Gems
                                <FiChevronRight size={17} />
                              </Link>
                            </div>
                          ) : (
                            <div className="mt-8 rounded-3xl border border-purple-100 bg-[#faf8ff] p-6 text-center sm:p-8">
                              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-purple-500 shadow-sm ring-1 ring-purple-100">
                                <FiPackage size={27} />
                              </div>

                              <h4 className="mt-5 text-lg font-extrabold text-[#28134c]">
                                Your Gem Vault is empty
                              </h4>

                              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8a7a9f]">
                                You have not added any Gems to your collection
                                yet. Visit the Gem shop to explore the available
                                Gems and purchase your first collection.
                              </p>

                              <Link
                                href="/buy-gem"
                                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
                              >
                                <FiShoppingBag size={16} />
                                Explore Gems
                              </Link>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={handleChangeEmail}
                            className="mt-6 flex w-full items-center justify-center gap-2 py-2 text-sm font-bold text-purple-600 transition hover:text-indigo-700"
                          >
                            <FiArrowLeft size={15} />
                            Check another email
                          </button>
                        </>
                      ) : (
                        <div className="py-3 text-center">
                          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-purple-50 text-purple-500 ring-1 ring-purple-100">
                            <FiPackage size={27} />
                          </div>

                          <h3 className="mt-5 text-2xl font-black text-[#28134c]">
                            No Gem Vault found
                          </h3>

                          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#8a7a9f]">
                            We could not find a Gem Vault associated with this
                            email address. You can purchase Gems to get started
                            or check that you entered the correct email.
                          </p>

                          <Link
                            href="/buy-gem"
                            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-lineart-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
                          >
                            <FiShoppingBag size={16} />
                            Purchase Gems
                          </Link>

                          <button
                            type="button"
                            onClick={handleChangeEmail}
                            className="mt-4 flex w-full items-center justify-center gap-2 py-2 text-sm font-bold text-purple-600 transition hover:text-indigo-700"
                          >
                            <FiArrowLeft size={15} />
                            Try another email
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <p className="mx-auto mt-5 max-w-lg text-center text-xs leading-6 text-[#9b8caf]">
              Never share your verification code with anyone. Tippified will use
              it to verify access to your Gem Vault.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#faf8ff] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-purple-600">
              Simple access
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#28134c] sm:text-4xl">
              How to Check Your Gem Vault
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#827493] sm:text-base">
              Follow three simple steps to see the Gems in your collection.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: FiMail,
                title: "Enter your email",
                description:
                  "Provide the email address associated with your Tippified Gem Vault.",
              },
              {
                number: "02",
                icon: FiShield,
                title: "Verify your identity",
                description:
                  "Enter the six-digit verification code sent to your email address.",
              },
              {
                number: "03",
                icon: FiHexagon,
                title: "View your Gems",
                description:
                  "See your available Gem types and quantities, or purchase more if needed.",
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-50 text-purple-600">
                      <Icon size={21} />
                    </div>

                    <span className="text-sm font-black tracking-widest text-purple-200">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-extrabold text-[#321952]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#88799b]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-3xl bg-linear-to-r from-purple-700 to-indigo-700 p-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
            <div>
              <h3 className="text-2xl font-black sm:text-3xl">
                Ready to celebrate a creator?
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-purple-100">
                Explore Gems and use them to show appreciation for the creators
                whose content you enjoy.
              </p>
            </div>

            <Link
              href="/buy-gem"
              className="mt-6 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-purple-700 transition hover:bg-purple-50 sm:mt-0"
            >
              <FiShoppingBag size={16} />
              Buy Gems
              <FiChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
