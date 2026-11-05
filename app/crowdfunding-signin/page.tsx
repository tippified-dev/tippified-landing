"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiHeart,
  FiLock,
  FiMail,
  FiShield,
  FiTarget,
  FiUsers,
} from "react-icons/fi";

type SigninStep = "credentials" | "verification";

export default function CrowdfundingSignin() {
  const [step, setStep] = useState<SigninStep>("credentials");

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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

  const handleCredentialsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setNotice("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(formData.email)) {
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

    // Frontend preview only.
    // Actual authentication and OTP delivery will be connected later.
    setStep("verification");

    setNotice(
      "The email verification screen is ready. Actual OTP delivery will be activated when the authentication backend is connected.",
    );
  };

  const handleVerificationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setNotice("");

    if (formData.otp.length !== 6) {
      setError("Please enter your complete six-digit verification code.");
      return;
    }

    // Actual OTP verification and login will be connected later.
    setNotice(
      "OTP verification and account sign-in will be activated when the authentication backend is connected.",
    );
  };

  const inputClass =
    "w-full h-[54px] rounded-xl border border-zinc-200 bg-white px-4 text-base text-[#190D2E] outline-none transition placeholder:text-zinc-400 focus:border-[#8B5CF6] focus:ring-4 focus:ring-purple-100";

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
              href="/crowdfunding-signup"
              className="text-[13px] font-semibold text-zinc-600 hover:text-[#6D28D9] transition"
            >
              New to crowdfunding?
              <span className="ml-1 text-[#6D28D9] font-bold">
                Create account
              </span>
            </Link>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <section className="flex-1 px-5 py-8 md:py-12 flex items-center">
          <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
            {/* LEFT INFORMATION */}
            <div className="pt-4">
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

              <h1 className="text-[38px] md:text-[54px] leading-[1.05] tracking-tight font-black mb-6">
                Your cause.
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#7C3AED] to-[#A78BFA]">
                  Your community.
                </span>
              </h1>

              <p className="text-[14px] md:text-[15px] leading-7 text-zinc-500 max-w-md mb-10">
                Sign in to manage your fundraising campaigns, follow
                contributions, share updates and stay connected with the people
                supporting your cause.
              </p>

              {/* FEATURES */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-purple-100 flex items-center justify-center text-[#7C3AED] shrink-0">
                    <FiTarget size={19} />
                  </div>

                  <div>
                    <h3 className="text-[13px] font-bold mb-1">
                      Manage your campaigns
                    </h3>

                    <p className="text-[12px] leading-5 text-zinc-500">
                      Keep track of your fundraising goals and campaign
                      progress.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-purple-100 flex items-center justify-center text-[#7C3AED] shrink-0">
                    <FiUsers size={19} />
                  </div>

                  <div>
                    <h3 className="text-[13px] font-bold mb-1">
                      Stay connected with supporters
                    </h3>

                    <p className="text-[12px] leading-5 text-zinc-500">
                      Follow contributions, engage with supporters and share
                      campaign updates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-purple-100 flex items-center justify-center text-[#7C3AED] shrink-0">
                    <FiShield size={19} />
                  </div>

                  <div>
                    <h3 className="text-[13px] font-bold mb-1">
                      Additional account protection
                    </h3>

                    <p className="text-[12px] leading-5 text-zinc-500">
                      Email verification adds another layer of protection to
                      your account.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECURITY CALLOUT */}
              <div className="mt-12 p-5 rounded-2xl border border-purple-100 bg-white/80">
                <div className="flex items-center gap-2 mb-2">
                  <FiLock className="text-[#7C3AED]" />

                  <p className="text-[12px] font-bold">Secure account access</p>
                </div>

                <p className="text-[12px] leading-5 text-zinc-500">
                  Your account sign-in will include an email verification step.
                </p>
              </div>
            </div>

            {/* SIGNIN CARD */}
            <div className="w-full">
              <div className="bg-white border border-zinc-100 rounded-[28px] shadow-[0_20px_80px_-30px_rgba(60,30,100,0.16)] p-6 md:p-10">
                {/* FORM HEADER */}
                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-[2px] font-extrabold text-[#8B5CF6] mb-3">
                    {step === "credentials"
                      ? "Welcome back"
                      : "Account verification"}
                  </p>

                  <h2 className="text-[25px] md:text-[30px] font-black tracking-tight">
                    {step === "credentials"
                      ? "Sign in to your account."
                      : "Verify your email."}
                  </h2>

                  <p className="text-[13px] text-zinc-500 mt-2 leading-6">
                    {step === "credentials"
                      ? "Enter your account details to continue to your crowdfunding dashboard."
                      : "Enter the six-digit verification code associated with your email address."}
                  </p>
                </div>

                {/* STEP INDICATOR */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-[#7C3AED]" />

                    <p className="text-[10px] font-bold text-[#7C3AED] mt-2">
                      Account details
                    </p>
                  </div>

                  <div className="flex-1">
                    <div
                      className={`h-1.5 rounded-full transition ${
                        step === "verification" ? "bg-[#7C3AED]" : "bg-zinc-100"
                      }`}
                    />

                    <p
                      className={`text-[10px] font-bold mt-2 ${
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
                    className="space-y-6"
                  >
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
                    </div>

                    {/* PASSWORD */}
                    <div>
                      <label className={labelClass}>Password</label>

                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                        <input
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
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#7C3AED]"
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
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
                      className="group w-full h-13.5 flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-[#6D28D9] to-[#5B21B6] text-white text-[14px] font-bold shadow-[0_12px_25px_-12px_rgba(109,40,217,0.7)] hover:shadow-[0_16px_30px_-12px_rgba(109,40,217,0.8)] hover:-translate-y-0.5 transition-all"
                    >
                      Continue
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                )}

                {/* OTP VERIFICATION FORM */}
                {step === "verification" && (
                  <form
                    onSubmit={handleVerificationSubmit}
                    className="space-y-6"
                  >
                    <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-[#7C3AED]">
                          <FiMail size={19} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] text-zinc-500">
                            Verification email
                          </p>

                          <p className="text-[13px] font-bold text-[#190D2E] break-all">
                            {formData.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Six-digit verification code
                      </label>

                      <input
                        type="text"
                        name="otp"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="000000"
                        value={formData.otp}
                        onChange={handleChange}
                        maxLength={6}
                        className={`${inputClass} text-center text-[25px] tracking-[12px] font-bold`}
                        required
                      />

                      <p className="text-[10px] text-zinc-400 mt-2">
                        Enter the six-digit code sent to your registered email.
                      </p>
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

                    {/* VERIFY */}
                    <button
                      type="submit"
                      className="group w-full h-13.5 flex items-center justify-center gap-3 rounded-xl bg-linear-to-r from-[#6D28D9] to-[#5B21B6] text-white text-[14px] font-bold shadow-[0_12px_25px_-12px_rgba(109,40,217,0.7)] hover:shadow-[0_16px_30px_-12px_rgba(109,40,217,0.8)] hover:-translate-y-0.5 transition-all"
                    >
                      Verify and sign in
                      <FiCheck className="group-hover:scale-110 transition-transform" />
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
                      className="w-full text-[12px] font-semibold text-zinc-500 hover:text-[#7C3AED] transition"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FiArrowLeft />
                        Back to account details
                      </span>
                    </button>
                  </form>
                )}

                {/* SIGNUP FOOTER */}
                <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                  <p className="text-[12px] text-zinc-500">
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
