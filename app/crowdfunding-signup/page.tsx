"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiHeart,
  FiLock,
  FiMail,
  FiMapPin,
  FiShield,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { bricolage, fredoka } from "../font";

type AccountType = "individual" | "organization";
const API_BASE_URL = "https://api.tippified.com";

type SignupStep = "signup" | "otp" | "verified";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
  cacNumber: string;
  contactPerson: string;
  position: string;
  location: string;
  aboutOrganization: string;
}

interface ApiResponse {
  message?: string;
  detail?: string;
  [key: string]: unknown;
}

function getApiErrorMessages(data: unknown): string[] {
  if (typeof data !== "object" || data === null) return [];

  const record = data as Record<string, unknown>;
  const messages: string[] = [];

  if (typeof record.detail === "string") messages.push(record.detail);
  if (typeof record.message === "string") messages.push(record.message);

  for (const value of Object.values(record)) {
    if (typeof value === "string") messages.push(value);
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") messages.push(item);
      }
    }
  }

  return messages;
}

export default function CrowdfundingSignup() {
  const [accountType, setAccountType] = useState<AccountType>("individual");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<SignupStep>("signup");
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    cacNumber: "",
    contactPerson: "",
    position: "",
    location: "",
    aboutOrganization: "",
  });

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setNotice("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setNotice("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const email = formData.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (accountType === "individual") {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError("Please enter your first name and last name.");
        return;
      }
    }

    let city = "";
    let country = "";

    if (accountType === "organization") {
      if (
        !formData.organizationName.trim() ||
        !formData.contactPerson.trim() ||
        !formData.position.trim() ||
        !formData.location.trim() ||
        !formData.aboutOrganization.trim()
      ) {
        setError("Please complete all required organisation details.");
        return;
      }

      const locationParts = formData.location.split(",");

      city = locationParts[0]?.trim() || "";
      country = locationParts.slice(1).join(",").trim();

      if (!city || !country) {
        setError("Please enter your location as City, Country.");
        return;
      }
    }

    if (formData.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    const payload = {
      account_type:
        accountType === "organization" ? "organisation" : "individual",
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      organisation_name: formData.organizationName.trim(),
      cac_number: formData.cacNumber.trim(),
      representative_name: formData.contactPerson.trim(),
      representative_position: formData.position.trim(),
      city,
      country,
      about: formData.aboutOrganization.trim(),
      email,
      password: formData.password,
      confirm_password: formData.confirmPassword,
    };

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/api/crowdfunding/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok) {
        const messages = getApiErrorMessages(data);
        throw new Error(
          messages[0] || "Unable to create your account. Please try again.",
        );
      }

      setRegisteredEmail(email);
      setStep("otp");
      setOtp("");

      setNotice(
        data.message ||
          `We have sent a verification code to ${email}. Please check your inbox.`,
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

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setNotice("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the complete six-digit verification code.");
      return;
    }

    try {
      setIsVerifying(true);

      const response = await fetch(
        `${API_BASE_URL}/api/crowdfunding/verify-signup-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: registeredEmail,
            otp,
          }),
        },
      );

      const data = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok) {
        const messages = getApiErrorMessages(data);
        throw new Error(
          messages[0] ||
            "Verification failed. Please check your code and try again.",
        );
      }

      setStep("verified");
      setNotice(data.message || "Your email has been successfully verified.");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify your email. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const inputClass =
    "w-full h-14 rounded-xl border border-zinc-200 bg-white px-4 text-[15px] text-[#190D2E] outline-none transition placeholder:text-zinc-400 focus:border-[#8B5CF6] focus:ring-4 focus:ring-purple-100";

  const labelClass = "block text-[13px] font-bold text-[#292039] mb-2.5";

  const stepIndex = step === "signup" ? 0 : step === "otp" ? 1 : 2;

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
              href="/crowdfunding-signin"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-purple-100 bg-white px-4 text-[13px] font-semibold text-zinc-600 shadow-sm transition hover:border-purple-200 hover:text-[#6D28D9] sm:h-auto sm:border-0 sm:bg-transparent sm:px-0 sm:shadow-none"
            >
              <span className="hidden sm:inline">Already registered?</span>
              <span className="ml-0 font-bold text-[#6D28D9] sm:ml-1.5">
                Sign in
              </span>
            </Link>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <section className="flex-1 px-4 py-6 sm:px-6 md:py-10 lg:px-8">
          <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
            {/* LEFT INFORMATION */}
            <div className="pt-1 lg:sticky lg:top-16 lg:pt-4">
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
                className={`${fredoka.className} text-[32px] leading-[1.05] tracking-tight sm:text-[42px] lg:text-[52px]`}
              >
                Give your cause
                <span className="block bg-linear-to-r from-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent">
                  a voice.
                </span>
              </h1>

              <p className="mt-4 max-w-md text-[14px] leading-7 text-zinc-500 sm:text-[15px] lg:mb-10">
                Create a fundraising campaign, bring people together and let the
                public follow every contribution as your cause moves closer to
                its goal.
              </p>

              {/* FEATURES */}
              <div className="mt-8 space-y-5 lg:mt-0 lg:space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#7C3AED]">
                    <FiGlobe size={20} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold">
                      Open public participation
                    </h3>
                    <p className="mt-1 text-[13px] leading-6 text-zinc-500">
                      Give people the opportunity to discover, support and
                      participate in your cause.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#7C3AED]">
                    <FiShield size={20} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold">
                      Transparent fundraising
                    </h3>
                    <p className="mt-1 text-[13px] leading-6 text-zinc-500">
                      Let the public follow campaign progress, contributions and
                      fundraising activity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#7C3AED]">
                    <FiUsers size={20} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold">
                      Built for individuals and organisations
                    </h3>
                    <p className="mt-1 text-[13px] leading-6 text-zinc-500">
                      Raise funds for yourself, another person, your company or
                      a cause you believe in.
                    </p>
                  </div>
                </div>
              </div>

              {/* CAMPAIGN LIMIT */}
              <div className="mt-10 hidden rounded-2xl border border-purple-100 bg-white/80 p-5 lg:block">
                <div className="mb-2 flex items-center gap-2">
                  <FiCheck className="text-[#7C3AED]" />
                  <p className="text-[13px] font-bold">
                    Start with the free plan
                  </p>
                </div>
                <p className="text-[13px] leading-6 text-zinc-500">
                  Every new account can run up to two active crowdfunding
                  campaigns simultaneously.
                </p>
              </div>
            </div>

            {/* SIGNUP FORM */}
            <div className="w-full">
              <div className="rounded-3x1 border border-zinc-100 bg-white p-5 shadow-[0_20px_80px_-30px_rgba(60,30,100,0.16)] sm:rounded-[28px] sm:p-8 lg:p-10">
                {/* FORM HEADER */}
                <div className="mb-7">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[2px] text-[#8B5CF6]">
                    Create your account
                  </p>

                  <h2
                    className={`${fredoka.className} text-[26px] leading-tight tracking-tight sm:text-[30px]`}
                  >
                    {step === "signup"
                      ? "Let's get you started."
                      : step === "otp"
                        ? "Verify your email."
                        : "Account verified."}
                  </h2>

                  <p className="mt-2.5 text-[14px] leading-6 text-zinc-500">
                    {step === "signup"
                      ? "First, tell us what type of account you want to create."
                      : step === "otp"
                        ? `Enter the six-digit verification code sent to ${registeredEmail}.`
                        : "Your crowdfunding account is ready. You can now sign in."}
                  </p>
                </div>

                {/* STEP INDICATOR */}
                <div className="mb-8 flex items-start gap-2.5 sm:gap-3">
                  {["Account", "Verify email", "Done"].map((label, index) => {
                    const isActive = index <= stepIndex;
                    const isCurrent = index === stepIndex;
                    return (
                      <div key={label} className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition ${
                              isActive
                                ? "bg-[#7C3AED] text-white"
                                : "bg-zinc-100 text-zinc-400"
                            }`}
                          >
                            {index < stepIndex ? (
                              <FiCheck size={14} />
                            ) : (
                              index + 1
                            )}
                          </span>
                          <div
                            className={`h-1.5 flex-1 rounded-full transition ${
                              isActive ? "bg-[#7C3AED]" : "bg-zinc-100"
                            }`}
                          />
                        </div>
                        <p
                          className={`mt-2.5 text-[11px] font-bold sm:text-[12px] ${
                            isCurrent
                              ? "text-[#7C3AED]"
                              : isActive
                                ? "text-[#7C3AED]"
                                : "text-zinc-400"
                          }`}
                        >
                          {label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* ACCOUNT TYPE SELECTOR */}
                <div
                  className={`mb-8 grid grid-cols-2 gap-3 ${
                    step !== "signup" ? "hidden" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setAccountType("individual");
                      setError("");
                      setNotice("");
                    }}
                    className={`relative p-4 text-left transition-all duration-200 sm:p-5 ${
                      accountType === "individual"
                        ? "rounded-2xl border-2 border-[#7C3AED] bg-[#FAF7FF] shadow-[0_5px_20px_-10px_rgba(124,58,237,0.4)]"
                        : "rounded-2xl border-2 border-zinc-100 hover:border-purple-200"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          accountType === "individual"
                            ? "bg-[#7C3AED] text-white"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        <FiUser size={20} />
                      </div>
                      {accountType === "individual" && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7C3AED] text-white">
                          <FiCheck size={12} />
                        </span>
                      )}
                    </div>
                    <p className={`${fredoka.className} text-[14px] font-bold`}>
                      Individual
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-zinc-500">
                      Fundraise for yourself or someone else.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAccountType("organization");
                      setError("");
                      setNotice("");
                    }}
                    className={`relative p-4 text-left transition-all duration-200 sm:p-5 ${
                      accountType === "organization"
                        ? "rounded-2xl border-2 border-[#7C3AED] bg-[#FAF7FF] shadow-[0_5px_20px_-10px_rgba(124,58,237,0.4)]"
                        : "rounded-2xl border-2 border-zinc-100 hover:border-purple-200"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          accountType === "organization"
                            ? "bg-[#7C3AED] text-white"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        <FiBriefcase size={20} />
                      </div>
                      {accountType === "organization" && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7C3AED] text-white">
                          <FiCheck size={12} />
                        </span>
                      )}
                    </div>
                    <p className={`${fredoka.className} text-[14px] font-bold`}>
                      Organisation
                    </p>
                    <p className="mt-1 text-[12px] leading-5 text-zinc-500">
                      Fundraise for a company or organisation.
                    </p>
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className={step === "signup" ? "space-y-5" : "hidden"}
                >
                  {/* INDIVIDUAL FIELDS */}
                  {accountType === "individual" && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="firstName" className={labelClass}>
                            First name
                          </label>
                          <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            placeholder="Enter first name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={inputClass}
                            autoComplete="given-name"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className={labelClass}>
                            Last name
                          </label>
                          <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            placeholder="Enter last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={inputClass}
                            autoComplete="family-name"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ORGANISATION FIELDS */}
                  {accountType === "organization" && (
                    <div className="space-y-5">
                      <div>
                        <label
                          htmlFor="organizationName"
                          className={labelClass}
                        >
                          Organisation or company name
                        </label>
                        <input
                          id="organizationName"
                          type="text"
                          name="organizationName"
                          placeholder="e.g. Grundex Limited"
                          value={formData.organizationName}
                          onChange={handleChange}
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="cacNumber" className={labelClass}>
                          CAC registration number
                          <span className="ml-2 font-medium text-zinc-400">
                            Optional
                          </span>
                        </label>
                        <input
                          id="cacNumber"
                          type="text"
                          name="cacNumber"
                          placeholder="Enter CAC registration number"
                          value={formData.cacNumber}
                          onChange={handleChange}
                          className={inputClass}
                        />
                        <p className="mt-2 text-[12px] leading-5 text-zinc-400">
                          Providing a valid registration number can help
                          establish your organisation&apos;s credibility.
                        </p>
                      </div>

                      <div>
                        <label htmlFor="contactPerson" className={labelClass}>
                          Account representative&apos;s full name
                        </label>
                        <input
                          id="contactPerson"
                          type="text"
                          name="contactPerson"
                          placeholder="Name of the person managing this account"
                          value={formData.contactPerson}
                          onChange={handleChange}
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="position" className={labelClass}>
                            Position in organisation
                          </label>
                          <input
                            id="position"
                            type="text"
                            name="position"
                            placeholder="e.g. Director"
                            value={formData.position}
                            onChange={handleChange}
                            className={inputClass}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="location" className={labelClass}>
                            Location
                          </label>
                          <div className="relative">
                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                              id="location"
                              type="text"
                              name="location"
                              placeholder="City, Country"
                              value={formData.location}
                              onChange={handleChange}
                              className={`${inputClass} pl-10`}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="aboutOrganization"
                          className={labelClass}
                        >
                          About the organisation
                        </label>
                        <textarea
                          id="aboutOrganization"
                          name="aboutOrganization"
                          placeholder="Briefly tell us about your organisation and what it does..."
                          value={formData.aboutOrganization}
                          onChange={handleChange}
                          rows={4}
                          required
                          className="w-full resize-none rounded-xl border border-zinc-200 bg-white p-4 text-[14px] leading-6 text-[#190D2E] outline-none transition placeholder:text-zinc-400 focus:border-[#8B5CF6] focus:ring-4 focus:ring-purple-100"
                        />
                        <p className="mt-1.5 text-[12px] text-zinc-400">
                          A short introduction to your organisation.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* EMAIL */}
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
                    <p className="mt-2 text-[12px] leading-5 text-zinc-400">
                      We will use this email address for account verification
                      and sign-in.
                    </p>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label htmlFor="password" className={labelClass}>
                      Create password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`${inputClass} pl-11 pr-12`}
                        autoComplete="new-password"
                        minLength={8}
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
                    <p className="mt-2 text-[12px] text-zinc-400">
                      Use at least 8 characters.
                    </p>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label htmlFor="confirmPassword" className={labelClass}>
                      Confirm password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Enter your password again"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`${inputClass} pl-11 pr-12`}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-[#7C3AED]"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
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
                      ? "Creating your account..."
                      : "Create my account"}
                    {!isSubmitting && (
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    )}
                  </button>

                  <p className="px-2 text-center text-[12px] leading-5 text-zinc-400">
                    By creating an account, you agree to Tippified&apos;s Terms
                    of Service and Privacy Policy.
                  </p>
                </form>

                {step === "otp" && (
                  <form
                    onSubmit={handleVerifyOTP}
                    className="space-y-5 sm:space-y-6"
                  >
                    <div className="py-3 text-center">
                      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-[#7C3AED]">
                        <FiMail size={28} />
                      </div>
                      <h3
                        className={`${fredoka.className} mb-2 text-[20px] font-bold`}
                      >
                        Check your inbox
                      </h3>
                      <p className="text-[13px] leading-6 text-zinc-500">
                        We sent a six-digit verification code to:
                        <span className="mt-1 block font-bold text-[#6D28D9]">
                          {registeredEmail}
                        </span>
                      </p>
                    </div>

                    <div>
                      <label htmlFor="otp" className={labelClass}>
                        Verification code
                      </label>
                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        maxLength={6}
                        required
                        className={`${inputClass} text-center text-[20px] font-bold tracking-[12px]`}
                      />
                      <p className="mt-2.5 text-[12px] text-zinc-400">
                        Your verification code expires after five minutes.
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
                      disabled={isVerifying || otp.length !== 6}
                      className={`${fredoka.className} flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-[#6D28D9] to-[#5B21B6] text-[15px] font-bold text-white shadow-[0_12px_25px_-12px_rgba(109,40,217,0.7)] transition-all disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      {isVerifying ? "Verifying..." : "Verify email"}
                    </button>
                  </form>
                )}

                {step === "verified" && (
                  <div className="py-6 text-center sm:py-8">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <FiCheck size={30} />
                    </div>
                    <h3
                      className={`${fredoka.className} mb-2 text-[22px] font-bold`}
                    >
                      Email successfully verified!
                    </h3>
                    <p className="mx-auto mb-7 max-w-sm text-[14px] leading-6 text-zinc-500">
                      Your crowdfunding account has been created successfully.
                      You can now sign in using your email and password.
                    </p>
                    <Link
                      href="/crowdfunding-signin"
                      className={`${fredoka.className} flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#6D28D9] to-[#5B21B6] text-[15px] font-bold text-white`}
                    >
                      Continue to sign in
                      <FiArrowRight />
                    </Link>
                  </div>
                )}

                {/* SIGN IN */}
                <div className="mt-8 border-t border-zinc-100 pt-6 text-center">
                  <p className="text-[13px] leading-6 text-zinc-500">
                    Already have an account?{" "}
                    <Link
                      href="/crowdfunding-signin"
                      className="font-bold text-[#6D28D9] hover:text-[#4C1D95]"
                    >
                      Sign in
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
