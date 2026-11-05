"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
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

type AccountType = "individual" | "organization";
const API_BASE_URL = "https://api.tippified.com";

type SignupStep = "signup" | "otp" | "verified";

export default function CrowdfundingSignup() {
  const [accountType, setAccountType] = useState<AccountType>("individual");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<SignupStep>("signup");
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [formData, setFormData] = useState({
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

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const messages = Object.values(data)
          .flat()
          .filter((value): value is string => typeof value === "string");

        throw new Error(
          messages[0] ||
            data.detail ||
            "Unable to create your account. Please try again.",
        );
      }

      setRegisteredEmail(email);
      setStep("otp");
      setOtp("");

      setNotice(
        data.message ||
          `We have sent a verification code to ${email}. Please check your inbox.`,
      );
    } catch (err) {
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

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const messages = Object.values(data)
          .flat()
          .filter((value): value is string => typeof value === "string");

        throw new Error(
          messages[0] ||
            data.detail ||
            "Verification failed. Please check your code and try again.",
        );
      }

      setStep("verified");

      setNotice(data.message || "Your email has been successfully verified.");
    } catch (err) {
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
    "w-full h-[52px] rounded-xl border border-zinc-200 bg-white px-4 text-base text-[#190D2E] outline-none transition placeholder:text-zinc-400 focus:border-[#8B5CF6] focus:ring-4 focus:ring-purple-100";

  const labelClass = "block text-[12px] font-bold text-[#292039] mb-2";

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#190D2E]">
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-52 -right-40 h-137.5 w-137.5 rounded-full bg-purple-200/30 blur-[120px]" />
        <div className="absolute bottom-0 -left-40 h-112.5 w-112.5 rounded-full bg-violet-200/30 blur-[120px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* NAVIGATION */}
        <header className="w-full px-6 py-6 md:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-[27px] font-black tracking-tight text-[#5B21B6]">
                tippified<span className="text-[#A78BFA]">.</span>
              </span>
            </Link>

            <Link
              href="/crowdfunding-signin"
              className="text-[13px] font-semibold text-zinc-600 hover:text-[#6D28D9] transition"
            >
              Already registered?
              <span className="ml-1 text-[#6D28D9] font-bold">Sign in</span>
            </Link>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <section className="flex-1 px-5 py-8 md:py-12">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-12 items-start">
            {/* LEFT INFORMATION */}
            <div className="lg:sticky lg:top-16 pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[12px] font-semibold text-zinc-500 hover:text-[#6D28D9] transition mb-10"
              >
                <FiArrowLeft />
                Back to Tippified
              </Link>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-purple-100 text-[#6D28D9] text-[10px] font-extrabold uppercase tracking-[1.5px] mb-6">
                <FiHeart size={13} />
                Tippified Crowdfunding
              </div>

              <h1 className="text-[38px] md:text-[52px] leading-[1.05] tracking-tight font-black mb-6">
                Give your cause
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#7C3AED] to-[#A78BFA]">
                  a voice.
                </span>
              </h1>

              <p className="text-[14px] md:text-[15px] leading-7 text-zinc-500 max-w-md mb-10">
                Create a fundraising campaign, bring people together and let the
                public follow every contribution as your cause moves closer to
                its goal.
              </p>

              {/* FEATURES */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-purple-100 flex items-center justify-center text-[#7C3AED] shrink-0">
                    <FiGlobe size={19} />
                  </div>

                  <div>
                    <h3 className="text-[13px] font-bold mb-1">
                      Open public participation
                    </h3>
                    <p className="text-[12px] leading-5 text-zinc-500">
                      Give people the opportunity to discover, support and
                      participate in your cause.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-purple-100 flex items-center justify-center text-[#7C3AED] shrink-0">
                    <FiShield size={19} />
                  </div>

                  <div>
                    <h3 className="text-[13px] font-bold mb-1">
                      Transparent fundraising
                    </h3>
                    <p className="text-[12px] leading-5 text-zinc-500">
                      Let the public follow campaign progress, contributions and
                      fundraising activity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-purple-100 flex items-center justify-center text-[#7C3AED] shrink-0">
                    <FiUsers size={19} />
                  </div>

                  <div>
                    <h3 className="text-[13px] font-bold mb-1">
                      Built for individuals and organisations
                    </h3>
                    <p className="text-[12px] leading-5 text-zinc-500">
                      Raise funds for yourself, another person, your company or
                      a cause you believe in.
                    </p>
                  </div>
                </div>
              </div>

              {/* CAMPAIGN LIMIT */}
              <div className="mt-12 p-5 rounded-2xl border border-purple-100 bg-white/80">
                <div className="flex items-center gap-2 mb-2">
                  <FiCheck className="text-[#7C3AED]" />
                  <p className="text-[12px] font-bold">
                    Start with the free plan
                  </p>
                </div>

                <p className="text-[12px] leading-5 text-zinc-500">
                  Every new account can run up to two active crowdfunding
                  campaigns simultaneously.
                </p>
              </div>
            </div>

            {/* SIGNUP FORM */}
            <div className="w-full">
              <div className="bg-white border border-zinc-100 rounded-[28px] shadow-[0_20px_80px_-30px_rgba(60,30,100,0.16)] p-6 md:p-10">
                {/* FORM HEADER */}
                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-[2px] font-extrabold text-[#8B5CF6] mb-3">
                    Create your account
                  </p>

                  <h2 className="text-[25px] md:text-[30px] font-black tracking-tight">
                    {step === "signup"
                      ? "Let's get you started."
                      : step === "otp"
                        ? "Verify your email."
                        : "Account verified."}
                  </h2>

                  <p className="text-[13px] text-zinc-500 mt-2">
                    {step === "signup"
                      ? "First, tell us what type of account you want to create."
                      : step === "otp"
                        ? `Enter the six-digit verification code sent to ${registeredEmail}.`
                        : "Your crowdfunding account is ready. You can now sign in."}
                  </p>
                </div>

                {/* ACCOUNT TYPE SELECTOR */}
                <div
                  className={`grid grid-cols-2 gap-3 mb-8 ${
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
                    className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                      accountType === "individual"
                        ? "border-[#7C3AED] bg-[#FAF7FF] shadow-[0_5px_20px_-10px_rgba(124,58,237,0.4)]"
                        : "border-zinc-100 hover:border-purple-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                          accountType === "individual"
                            ? "bg-[#7C3AED] text-white"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        <FiUser size={19} />
                      </div>

                      {accountType === "individual" && (
                        <span className="h-5 w-5 rounded-full bg-[#7C3AED] text-white flex items-center justify-center">
                          <FiCheck size={12} />
                        </span>
                      )}
                    </div>

                    <p className="text-[13px] font-extrabold">Individual</p>

                    <p className="text-[10px] leading-4 text-zinc-500 mt-1">
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
                    className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                      accountType === "organization"
                        ? "border-[#7C3AED] bg-[#FAF7FF] shadow-[0_5px_20px_-10px_rgba(124,58,237,0.4)]"
                        : "border-zinc-100 hover:border-purple-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                          accountType === "organization"
                            ? "bg-[#7C3AED] text-white"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        <FiBriefcase size={19} />
                      </div>

                      {accountType === "organization" && (
                        <span className="h-5 w-5 rounded-full bg-[#7C3AED] text-white flex items-center justify-center">
                          <FiCheck size={12} />
                        </span>
                      )}
                    </div>

                    <p className="text-[13px] font-extrabold">Organisation</p>

                    <p className="text-[10px] leading-4 text-zinc-500 mt-1">
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
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>First name</label>

                          <input
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
                          <label className={labelClass}>Last name</label>

                          <input
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
                        <label className={labelClass}>
                          Organisation or company name
                        </label>

                        <input
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
                        <label className={labelClass}>
                          CAC registration number
                          <span className="ml-2 text-zinc-400 font-medium">
                            Optional
                          </span>
                        </label>

                        <input
                          type="text"
                          name="cacNumber"
                          placeholder="Enter CAC registration number"
                          value={formData.cacNumber}
                          onChange={handleChange}
                          className={inputClass}
                        />

                        <p className="text-[10px] text-zinc-400 mt-2">
                          Providing a valid registration number can help
                          establish your organisation&apos;s credibility.
                        </p>
                      </div>

                      <div>
                        <label className={labelClass}>
                          Account representative&apos;s full name
                        </label>

                        <input
                          type="text"
                          name="contactPerson"
                          placeholder="Name of the person managing this account"
                          value={formData.contactPerson}
                          onChange={handleChange}
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>
                            Position in organisation
                          </label>

                          <input
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
                          <label className={labelClass}>Location</label>

                          <div className="relative">
                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                            <input
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
                        <label className={labelClass}>
                          About the organisation
                        </label>

                        <textarea
                          name="aboutOrganization"
                          placeholder="Briefly tell us about your organisation and what it does..."
                          value={formData.aboutOrganization}
                          onChange={handleChange}
                          rows={4}
                          required
                          className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-[14px] text-[#190D2E] outline-none transition placeholder:text-zinc-400 focus:border-[#8B5CF6] focus:ring-4 focus:ring-purple-100 resize-none"
                        />

                        <p className="text-[10px] text-zinc-400 mt-1">
                          A short introduction to your organisation.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* EMAIL */}
                  <div>
                    <label className={labelClass}>Email address</label>

                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                      <input
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

                    <p className="text-[10px] text-zinc-400 mt-2">
                      We will use this email address for account verification
                      and sign-in.
                    </p>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className={labelClass}>Create password</label>

                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                      <input
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#7C3AED]"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>

                    <p className="text-[10px] text-zinc-400 mt-2">
                      Use at least 8 characters.
                    </p>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label className={labelClass}>Confirm password</label>

                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                      <input
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#7C3AED]"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  {/* ERROR */}
                  {error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[12px] text-red-600">
                      {error}
                    </div>
                  )}

                  {/* NOTICE */}
                  {notice && (
                    <div className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-[12px] leading-5 text-[#6D28D9]">
                      {notice}
                    </div>
                  )}

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full h-13.5 flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-[#6D28D9] to-[#5B21B6] text-white text-[14px] font-bold shadow-[0_12px_25px_-12px_rgba(109,40,217,0.7)] hover:shadow-[0_16px_30px_-12px_rgba(109,40,217,0.8)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isSubmitting
                      ? "Creating your account..."
                      : "Create my account"}

                    {!isSubmitting && (
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>

                  {/* TERMS */}
                  <p className="text-center text-[10px] leading-5 text-zinc-400 px-3">
                    By creating an account, you agree to Tippified&apos;s Terms
                    of Service and Privacy Policy.
                  </p>
                </form>

                {step === "otp" && (
                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="text-center py-4">
                      <div className="mx-auto h-16 w-16 rounded-2xl bg-purple-100 flex items-center justify-center text-[#7C3AED] mb-5">
                        <FiMail size={28} />
                      </div>

                      <h3 className="text-[18px] font-extrabold mb-2">
                        Check your inbox
                      </h3>

                      <p className="text-[12px] leading-6 text-zinc-500">
                        We sent a six-digit verification code to:
                        <span className="block font-bold text-[#6D28D9] mt-1">
                          {registeredEmail}
                        </span>
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>Verification code</label>

                      <input
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
                        className={`${inputClass} text-center text-base font-black tracking-[12px]`}
                      />

                      <p className="text-[10px] text-zinc-400 mt-2">
                        Your verification code expires after five minutes.
                      </p>
                    </div>

                    {error && (
                      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[12px] text-red-600">
                        {error}
                      </div>
                    )}

                    {notice && (
                      <div className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-[12px] leading-5 text-[#6D28D9]">
                        {notice}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isVerifying || otp.length !== 6}
                      className="w-full h-13.5 flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-[#6D28D9] to-[#5B21B6] text-white text-[14px] font-bold shadow-[0_12px_25px_-12px_rgba(109,40,217,0.7)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isVerifying ? "Verifying..." : "Verify email"}
                    </button>
                  </form>
                )}

                {step === "verified" && (
                  <div className="text-center py-8">
                    <div className="mx-auto h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-5">
                      <FiCheck size={30} />
                    </div>

                    <h3 className="text-[20px] font-black mb-2">
                      Email successfully verified!
                    </h3>

                    <p className="text-[13px] leading-6 text-zinc-500 mb-7">
                      Your crowdfunding account has been created successfully.
                      You can now sign in using your email and password.
                    </p>

                    <Link
                      href="/crowdfunding-signin"
                      className="w-full h-13.5 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#6D28D9] to-[#5B21B6] text-white text-[14px] font-bold"
                    >
                      Continue to sign in
                      <FiArrowRight />
                    </Link>
                  </div>
                )}

                {/* SIGN IN */}
                <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                  <p className="text-[12px] text-zinc-500">
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
              <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-zinc-400">
                <FiShield />
                Your information is handled securely.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
