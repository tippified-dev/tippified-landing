"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiHeart,
  FiLock,
  FiMail,
  FiShield,
  FiTarget,
  FiUsers,
} from "react-icons/fi";
import { CROWDFUNDING_ROUTES } from "../config/crowdfunding";
import { bricolage, fredoka } from "../font";

type SigninStep = "credentials" | "verification";

interface SigninFormData {
  email: string;
  password: string;
  otp: string;
}

interface ApiResponse {
  message?: string;
  detail?: string;
  [key: string]: unknown;
}

function extractApiErrorMessage(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;

  const record = data as Record<string, unknown>;

  if (typeof record.detail === "string") return record.detail;
  if (typeof record.message === "string") return record.message;

  for (const value of Object.values(record)) {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") return item;
      }
    }
  }

  return null;
}

export default function CrowdfundingSignin() {
  const [step, setStep] = useState<SigninStep>("credentials");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<SigninFormData>({
    email: "",
    password: "",
    otp: "",
  });

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const API_BASE_URL = "https://api.tippified.com";

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "otp") {
      setFormData((prev) => ({
        ...prev,
        otp: value.replace(/\D/g, "").slice(0, 6),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setError("");
    setNotice("");
  };

  const handleCredentialsSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError("");
    setNotice("");

    const email = formData.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Please enter a valid password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/crowdfunding/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password: formData.password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(data) ||
            "Unable to sign in. Please check your details and try again.",
        );
      }

      setFormData((prev) => ({
        ...prev,
        email,
        otp: "",
      }));

      setStep("verification");

      setNotice(
        data.message ||
          "A six-digit verification code has been sent to your email address.",
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError("");
    setNotice("");

    if (formData.otp.length !== 6) {
      setError("Please enter your complete six-digit verification code.");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/crowdfunding/verify-login-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            otp: formData.otp,
          }),
        },
      );

      const data = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok) {
        throw new Error(
          extractApiErrorMessage(data) ||
            "Verification failed. Please check your code and try again.",
        );
      }

      // The backend has now established the crowdfunding session.
      // The session token is stored in an HttpOnly cookie, not localStorage.

      router.replace(CROWDFUNDING_ROUTES.dashboard);
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const inputClass =
    "w-full h-14 rounded-xl border border-zinc-200 bg-white px-4 text-[15px] text-[#190D2E] outline-none transition placeholder:text-zinc-400 focus:border-[#8B5CF6] focus:ring-4 focus:ring-purple-100";

  const labelClass = "block text-[13px] font-bold text-[#292039] mb-2.5";

  return (
    <main
      className={`${bricolage.className} min-h-dvh bg-[#FAF9FC] text-[#190D2E]`}
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-purple-200/30 blur-[120px] md:h-137.5 md:w-137.5" />
        <div className="absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-violet-200/30 blur-[120px] md:h-112.5 md:w-112.5" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        {/* NAVIGATION */}
        <header className="w-full px-4 py-5 sm:px-6 md:px-12 md:py-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <Link href="/" className="flex items-center">
              <span
                className={`${fredoka.className} text-[26px] font-bold tracking-tight text-[#5B21B6] sm:text-[27px]`}
              >
                tippified<span className="text-[#A78BFA]">.</span>
              </span>
            </Link>

            <Link
              href="/crowdfunding-signup"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-purple-100 bg-white px-4 text-[13px] font-semibold text-zinc-600 shadow-sm transition hover:border-purple-200 hover:text-[#6D28D9] sm:h-auto sm:border-0 sm:bg-transparent sm:px-0 sm:shadow-none"
            >
              <span className="hidden sm:inline">New to crowdfunding?</span>
              <span className="ml-0 font-bold text-[#6D28D9] sm:ml-1.5">
                Create account
              </span>
            </Link>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <section className="flex flex-1 items-center px-4 py-6 sm:px-6 md:py-10 lg:px-8">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            {/* LEFT INFORMATION */}
            <div className="pt-1 lg:pt-4">
              <Link
                href="/"
                className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 transition hover:text-[#6D28D9] lg:mb-10"
              >
                <FiArrowLeft />
                Back to Tippified
              </Link>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[1.5px] text-[#6D28D9] lg:mb-6">
                <FiHeart size={13} />
                Tippified Crowdfunding
              </div>

              <h1
                className={`${fredoka.className} text-[32px] leading-[1.05] tracking-tight sm:text-[42px] lg:text-[54px]`}
              >
                Your cause.
                <span className="block bg-linear-to-r from-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent">
                  Your community.
                </span>
              </h1>

              <p className="mt-4 max-w-md text-[14px] leading-7 text-zinc-500 sm:text-[15px] lg:mb-10">
                Sign in to manage your fundraising campaigns, follow
                contributions, share updates and stay connected with the people
                supporting your cause.
              </p>

              {/* FEATURES */}
              <div className="mt-8 space-y-5 lg:mt-0 lg:space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#7C3AED]">
                    <FiTarget size={20} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold">
                      Manage your campaigns
                    </h3>
                    <p className="mt-1 text-[13px] leading-6 text-zinc-500">
                      Keep track of your fundraising goals and campaign
                      progress.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#7C3AED]">
                    <FiUsers size={20} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold">
                      Stay connected with supporters
                    </h3>
                    <p className="mt-1 text-[13px] leading-6 text-zinc-500">
                      Follow contributions, engage with supporters and share
                      campaign updates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#7C3AED]">
                    <FiShield size={20} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold">
                      Additional account protection
                    </h3>
                    <p className="mt-1 text-[13px] leading-6 text-zinc-500">
                      Email verification adds another layer of protection to
                      your account.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECURITY CALLOUT */}
              <div className="mt-10 hidden rounded-2xl border border-purple-100 bg-white/80 p-5 lg:block">
                <div className="mb-2 flex items-center gap-2">
                  <FiLock className="text-[#7C3AED]" />
                  <p className="text-[13px] font-bold">Secure account access</p>
                </div>
                <p className="text-[13px] leading-6 text-zinc-500">
                  Your account sign-in will include an email verification step.
                </p>
              </div>
            </div>

            {/* SIGNIN CARD */}
            <div className="w-full">
              <div className="rounded-3x1 border border-zinc-100 bg-white p-5 shadow-[0_20px_80px_-30px_rgba(60,30,100,0.16)] sm:rounded-[28px] sm:p-8 lg:p-10">
                {/* FORM HEADER */}
                <div className="mb-7">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-[#8B5CF6]">
                    {step === "credentials"
                      ? "Welcome back"
                      : "Account verification"}
                  </p>

                  <h2
                    className={`${fredoka.className} text-[26px] leading-tight tracking-tight sm:text-[30px]`}
                  >
                    {step === "credentials"
                      ? "Sign in to your account."
                      : "Verify your email."}
                  </h2>

                  <p className="mt-2.5 text-[14px] leading-6 text-zinc-500">
                    {step === "credentials"
                      ? "Enter your account details to continue to your crowdfunding dashboard."
                      : "Enter the six-digit verification code associated with your email address."}
                  </p>
                </div>

                {/* STEP INDICATOR */}
                <div className="mb-8 flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-[12px] font-bold text-white">
                        {step === "verification" ? <FiCheck size={14} /> : "1"}
                      </span>
                      <div className="h-1.5 flex-1 rounded-full bg-[#7C3AED]" />
                    </div>
                    <p className="mt-2.5 text-[12px] font-bold text-[#7C3AED]">
                      Account details
                    </p>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition ${
                          step === "verification"
                            ? "bg-[#7C3AED] text-white"
                            : "bg-zinc-100 text-zinc-400"
                        }`}
                      >
                        2
                      </span>
                      <div
                        className={`h-1.5 flex-1 rounded-full transition ${
                          step === "verification"
                            ? "bg-[#7C3AED]"
                            : "bg-zinc-100"
                        }`}
                      />
                    </div>
                    <p
                      className={`mt-2.5 text-[12px] font-bold ${
                        step === "verification"
                          ? "text-[#7C3AED]"
                          : "text-zinc-400"
                      }`}
                    >
                      Email verification
                    </p>
                  </div>
                </div>

                {/* CREDENTIALS FORM */}
                {step === "credentials" && (
                  <form
                    onSubmit={handleCredentialsSubmit}
                    className="space-y-5 sm:space-y-6"
                  >
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email address
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          id="email"
                          type="email"
                          name="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className={`${inputClass} pl-11`}
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className={labelClass}>
                        Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`${inputClass} pl-11 pr-12`}
                          autoComplete="current-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-[#7C3AED]"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? (
                            <FiEyeOff size={19} />
                          ) : (
                            <FiEye size={19} />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-[13px] leading-6 text-red-600">
                        <FiAlertCircle size={17} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {notice && (
                      <div className="flex items-start gap-2.5 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3.5 text-[13px] leading-6 text-[#6D28D9]">
                        <FiCheckCircle size={17} className="mt-0.5 shrink-0" />
                        <span>{notice}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`${fredoka.className} group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-[#6D28D9] to-[#5B21B6] text-[15px] font-bold text-white shadow-[0_12px_25px_-12px_rgba(109,40,217,0.7)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-12px_rgba(109,40,217,0.8)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`}
                    >
                      {isSubmitting
                        ? "Sending verification code..."
                        : "Continue"}
                      {!isSubmitting && (
                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                      )}
                    </button>
                  </form>
                )}

                {/* OTP VERIFICATION FORM */}
                {step === "verification" && (
                  <form
                    onSubmit={handleVerificationSubmit}
                    className="space-y-5 sm:space-y-6"
                  >
                    <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#7C3AED]">
                          <FiMail size={19} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] text-zinc-500">
                            Verification email
                          </p>
                          <p className="break-all text-[14px] font-bold text-[#190D2E]">
                            {formData.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="otp" className={labelClass}>
                        Six-digit verification code
                      </label>
                      <input
                        id="otp"
                        type="text"
                        name="otp"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="000000"
                        value={formData.otp}
                        onChange={handleChange}
                        maxLength={6}
                        className={`${inputClass} text-center text-[20px] font-bold tracking-[12px]`}
                        required
                      />
                      <p className="mt-2.5 text-[12px] leading-5 text-zinc-400">
                        Enter the six-digit code sent to your registered email.
                      </p>
                    </div>

                    {error && (
                      <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-[13px] leading-6 text-red-600">
                        <FiAlertCircle size={17} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {notice && (
                      <div className="flex items-start gap-2.5 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3.5 text-[13px] leading-6 text-[#6D28D9]">
                        <FiCheckCircle size={17} className="mt-0.5 shrink-0" />
                        <span>{notice}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className={`${fredoka.className} group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-[#6D28D9] to-[#5B21B6] text-[15px] font-bold text-white shadow-[0_12px_25px_-12px_rgba(109,40,217,0.7)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-12px_rgba(109,40,217,0.8)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`}
                    >
                      {isVerifying ? "Verifying..." : "Verify and sign in"}
                      {!isVerifying && (
                        <FiCheck className="transition-transform group-hover:scale-110" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep("credentials");
                        setFormData((prev) => ({
                          ...prev,
                          otp: "",
                        }));
                        setError("");
                        setNotice("");
                      }}
                      className="flex w-full items-center justify-center gap-2 py-1 text-[13px] font-semibold text-zinc-500 transition hover:text-[#7C3AED]"
                    >
                      <FiArrowLeft />
                      Back to account details
                    </button>
                  </form>
                )}

                {/* SIGNUP FOOTER */}
                <div className="mt-8 border-t border-zinc-100 pt-6 text-center">
                  <p className="text-[13px] leading-6 text-zinc-500">
                    Don&apos;t have a crowdfunding account?{" "}
                    <Link
                      href="/crowdfunding-signup"
                      className="font-bold text-[#6D28D9] hover:text-[#4C1D95]"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>

              {/* SECURITY FOOTER */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-zinc-400">
                <FiShield size={14} />
                Your information is handled securely.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
