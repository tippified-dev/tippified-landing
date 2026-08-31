"use client";

import axios, { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FiCheckCircle,
  FiChevronDown,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiGift,
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiTag,
  FiUser,
} from "react-icons/fi";

interface SignupForm {
  username: string;
  email: string;
  password: string;
  phone: string;
  referral_code?: string;
  location: string;
  niche: string;
  bio: string;
}

interface NicheOption {
  value: string;
  label: string;
}

interface LocationOption {
  value: string;
  label: string;
  flag: string;
  dialCode: string;
  placeholder: string;
}

interface NicheResponse {
  niches: NicheOption[];
}

interface APIErrorDetail {
  [key: string]: string | string[];
}

interface SignupErrorResponse {
  detail?: string | APIErrorDetail;
}

interface SignupSuccessResponse {
  message: string;
}

const LOCATION_OPTIONS: LocationOption[] = [
  {
    value: "Nigeria",
    label: "Nigeria",
    flag: "🇳🇬",
    dialCode: "+234",
    placeholder: "e.g. 0803 123 4567",
  },
  {
    value: "Ghana",
    label: "Ghana",
    flag: "🇬🇭",
    dialCode: "+233",
    placeholder: "e.g. 024 123 4567",
  },
  {
    value: "Kenya",
    label: "Kenya",
    flag: "🇰🇪",
    dialCode: "+254",
    placeholder: "e.g. 0712 345 678",
  },
];

const PHONE_VALIDATORS: Record<string, RegExp> = {
  Nigeria: /^(?:\+234|0)[789]\d{9}$/,
  Ghana: /^(?:\+233|0)(?:20|23|24|26|27|28|50|53|54|55|59)\d{7}$/,
  Kenya: /^(?:\+254|0)(?:7\d{8}|1\d{8})$/,
};

const isValidFullName = (name: string): boolean => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length < 2) return false;

  return parts.every((part) => part.length >= 2 && /^[A-Za-z'-]+$/.test(part));
};

export default function CreatorSignupForm() {
  const searchParams = useSearchParams();

  const referralCode = searchParams.get("ref");

  const [form, setForm] = useState<SignupForm>({
    username: "",
    email: "",
    password: "",
    phone: "",
    referral_code: referralCode || "",
    location: "Nigeria",
    niche: "",
    bio: "",
  });

  const [niches, setNiches] = useState<NicheOption[]>([]);
  const [nichesLoading, setNichesLoading] = useState(true);

  const [nicheOpen, setNicheOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info",
  );

  const [usernameError, setUsernameError] = useState("");

  const nicheRef = useRef<HTMLDivElement | null>(null);
  const locationRef = useRef<HTMLDivElement | null>(null);

  const API_BASE_URL = "https://api.tippified.com";

  const selectedLocation =
    LOCATION_OPTIONS.find((location) => location.value === form.location) ||
    LOCATION_OPTIONS[0];

  const selectedNiche = niches.find((niche) => niche.value === form.niche);

  const showMessage = (
    text: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setMessage(text);
    setMessageType(type);
  };

  useEffect(() => {
    if (referralCode) {
      setForm((prev) => ({
        ...prev,
        referral_code: referralCode,
      }));
    }
  }, [referralCode]);

  useEffect(() => {
    const fetchNiches = async () => {
      try {
        const response = await axios.get<NicheResponse>(
          `${API_BASE_URL}/api/auth/creator-niches/`,
        );

        setNiches(response.data.niches || []);
      } catch (error) {
        console.error("Failed to load creator niches:", error);

        showMessage(
          "Unable to load creator categories. Please refresh and try again.",
          "error",
        );
      } finally {
        setNichesLoading(false);
      }
    };

    fetchNiches();
  }, [API_BASE_URL]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (nicheRef.current && !nicheRef.current.contains(target)) {
        setNicheOpen(false);
      }

      if (locationRef.current && !locationRef.current.contains(target)) {
        setLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "username") {
      if (!value.trim()) {
        setUsernameError("");
      } else if (!isValidFullName(value)) {
        setUsernameError("Enter first name and last name — e.g. John Doe");
      } else {
        setUsernameError("");
      }
    }
  };

  const handleNicheSelect = (niche: NicheOption) => {
    setForm((prev) => ({
      ...prev,
      niche: niche.value,
    }));

    setNicheOpen(false);
  };

  const handleLocationSelect = (location: LocationOption) => {
    setForm((prev) => ({
      ...prev,
      location: location.value,
      phone: "",
    }));

    setLocationOpen(false);
  };

  const validatePhone = (phone: string, country: string): boolean => {
    const cleaned = phone.replace(/[\s\-()]/g, "");

    const regex = PHONE_VALIDATORS[country];

    return regex ? regex.test(cleaned) : false;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidFullName(form.username)) {
      setUsernameError("First name and last name required");

      showMessage("First name and last name required", "info");

      return;
    }

    if (!agreed) {
      showMessage("You must agree to the terms and conditions.", "info");

      return;
    }

    const { username, email, password, phone, niche, bio, location } = form;

    if (!username || !email || !password || !phone || !location) {
      showMessage("Please fill all required fields.", "info");

      return;
    }

    if (!LOCATION_OPTIONS.some((item) => item.value === location)) {
      showMessage("Please select a valid location.", "info");

      return;
    }

    if (!niche) {
      showMessage("Please select your creator category.", "info");

      return;
    }

    if (!bio.trim()) {
      showMessage("Please tell us a little about yourself.", "info");

      return;
    }

    if (bio.trim().length > 500) {
      showMessage("Your bio cannot be more than 500 characters.", "info");

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showMessage("Please enter a valid email address.", "info");

      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters.", "info");

      return;
    }

    if (!validatePhone(phone, location)) {
      const messages: Record<string, string> = {
        Nigeria:
          "Please enter a valid Nigerian number. e.g. 0803 123 4567 or +2348031234567",
        Ghana:
          "Please enter a valid Ghanaian number. e.g. 024 123 4567 or +233241234567",
        Kenya:
          "Please enter a valid Kenyan number. e.g. 0712 345678 or +254712345678",
      };

      showMessage(
        messages[location] || "Please enter a valid phone number.",
        "info",
      );

      return;
    }

    setLoading(true);

    try {
      const response = await axios.post<SignupSuccessResponse>(
        `${API_BASE_URL}/api/auth/signup/`,
        form,
        {
          withCredentials: true,
        },
      );

      if (response.status === 201) {
        showMessage(
          "Signup successful! Check your email to verify your account.",
          "success",
        );

        setForm({
          username: "",
          email: "",
          password: "",
          phone: "",
          referral_code: referralCode || "",
          location: "Nigeria",
          niche: "",
          bio: "",
        });

        setAgreed(false);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<SignupErrorResponse>;

        const errorData = axiosError.response?.data;

        if (errorData?.detail) {
          if (typeof errorData.detail === "string") {
            showMessage(errorData.detail, "error");
          } else {
            const key = Object.keys(errorData.detail)[0];

            const msg = errorData.detail[key];

            showMessage(Array.isArray(msg) ? msg[0] : msg, "error");
          }
        } else {
          showMessage("Signup failed. Please try again.", "error");
        }
      } else {
        showMessage("An unexpected error occurred.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed left-1/2 top-5 z-200 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-xl ${
              messageType === "success"
                ? "bg-green-600 text-white"
                : messageType === "error"
                  ? "bg-red-600 text-white"
                  : "bg-purple-600 text-white"
            }`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="relative w-full max-w-md overflow-hidden rounded-[1.8rem] border border-purple-100 bg-white shadow-[0_24px_60px_-20px_rgba(88,28,174,0.25)]"
      >
        <div className="h-1.5 w-full bg-linear-to-r from-purple-600 via-violet-500 to-indigo-500" />

        <div className="p-6 sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 ring-1 ring-purple-100">
            <FiShield size={20} />
          </div>

          <h2 className="mt-4 text-center text-[22px] font-extrabold tracking-tight text-purple-900">
            Creator Signup
          </h2>

          <p className="mt-1 text-center text-[13px] text-purple-700/60">
            Create your creator account to get started
          </p>

          {referralCode && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-[#f8f5ff] px-3 py-2 text-xs font-bold text-purple-700 ring-1 ring-purple-100"
            >
              <FiGift size={12} />
              Referral applied: {referralCode}
            </motion.div>
          )}

          <div className="mt-6 space-y-3">
            {/* Name */}
            <div>
              <div className="relative">
                <FiUser
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-purple-300"
                  size={15}
                />

                <input
                  type="text"
                  name="username"
                  placeholder="Creator first name and last name"
                  autoComplete="name"
                  className="w-full rounded-2xl border border-purple-100 bg-[#f8f5ff] py-3.5 pl-11 pr-4 text-base font-medium text-purple-900 outline-none placeholder:text-purple-300 focus:border-purple-200 focus:bg-white focus:ring-4 focus:ring-purple-50"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>

              {usernameError && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-red-500">
                  <FiShield size={10} />
                  {usernameError}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-purple-300"
                size={15}
              />

              <input
                type="email"
                name="email"
                placeholder="Email address"
                autoComplete="email"
                inputMode="email"
                className="w-full rounded-2xl border border-purple-100 bg-[#f8f5ff] py-3.5 pl-11 pr-4 text-base font-medium text-purple-900 outline-none placeholder:text-purple-300 focus:border-purple-200 focus:bg-white focus:ring-4 focus:ring-purple-50"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-purple-300"
                size={15}
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-purple-100 bg-[#f8f5ff] py-3.5 pl-11 pr-11 text-base font-medium text-purple-900 outline-none placeholder:text-purple-300 focus:border-purple-200 focus:bg-white focus:ring-4 focus:ring-purple-50"
                value={form.password}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 text-purple-400 ring-1 ring-purple-100 hover:text-purple-600"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>

            {/* Location */}
            <div ref={locationRef} className="relative">
              <FiMapPin
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-purple-300"
                size={15}
              />

              <button
                type="button"
                onClick={() => setLocationOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between rounded-2xl border bg-[#f8f5ff] py-3.5 pl-11 pr-4 text-left text-base font-semibold outline-none transition ${
                  locationOpen
                    ? "border-purple-200 bg-white ring-4 ring-purple-50"
                    : "border-purple-100"
                } text-purple-900`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-[18px]">{selectedLocation.flag}</span>

                  <span>{selectedLocation.label}</span>

                  <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-600 ring-1 ring-purple-100">
                    {selectedLocation.dialCode}
                  </span>
                </span>

                <FiChevronDown
                  size={17}
                  className={`shrink-0 text-purple-400 transition-transform ${
                    locationOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {locationOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-[1.25rem] border border-purple-100 bg-white p-2 shadow-[0_24px_60px_-20px_rgba(88,28,174,0.35)]"
                  >
                    <div className="px-3 pb-2 pt-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-purple-300">
                      Select your country *
                    </div>

                    {LOCATION_OPTIONS.map((location) => {
                      const active = form.location === location.value;

                      return (
                        <button
                          key={location.value}
                          type="button"
                          onClick={() => handleLocationSelect(location)}
                          className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition ${
                            active
                              ? "bg-purple-600 text-white"
                              : "text-gray-700 hover:bg-[#f8f5ff] hover:text-purple-700"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-[20px]">{location.flag}</span>

                            <span className="flex flex-col">
                              <span className="text-[13.5px] font-bold">
                                {location.label}
                              </span>

                              <span
                                className={`mt-1 text-[11px] font-semibold ${
                                  active ? "text-white/80" : "text-gray-400"
                                }`}
                              >
                                {location.dialCode} • {location.placeholder}
                              </span>
                            </span>
                          </span>

                          {active && <FiCheckCircle size={16} />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Phone */}
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                <span className="text-[15px]">{selectedLocation.flag}</span>

                <span className="text-[12px] font-bold text-purple-500">
                  {selectedLocation.dialCode}
                </span>
              </div>

              <input
                type="tel"
                name="phone"
                placeholder={selectedLocation.placeholder}
                autoComplete="tel"
                inputMode="numeric"
                className="w-full rounded-2xl border border-purple-100 bg-[#f8f5ff] py-3.5 pl-22 pr-4 text-base font-medium text-purple-900 outline-none placeholder:text-purple-300 focus:border-purple-200 focus:bg-white focus:ring-4 focus:ring-purple-50"
                value={form.phone}
                onChange={handleChange}
              />

              <FiPhone
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-200"
                size={15}
              />
            </div>

            {/* Niche */}
            <div ref={nicheRef} className="relative">
              <FiTag
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-purple-300"
                size={15}
              />

              <button
                type="button"
                disabled={nichesLoading}
                onClick={() => !nichesLoading && setNicheOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between rounded-2xl border border-purple-100 bg-[#f8f5ff] py-3.5 pl-11 pr-4 text-left text-base font-medium outline-none transition ${
                  form.niche ? "text-purple-900" : "text-purple-300"
                } ${
                  nicheOpen
                    ? "border-purple-200 bg-white ring-4 ring-purple-50"
                    : ""
                }`}
              >
                <span>
                  {nichesLoading
                    ? "Loading creator categories..."
                    : selectedNiche?.label || "Select your creator category"}
                </span>

                <FiChevronDown
                  size={17}
                  className={`shrink-0 text-purple-400 transition-transform ${
                    nicheOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {nicheOpen && !nichesLoading && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -5,
                      scale: 0.98,
                    }}
                    className="absolute left-0 right-0 z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-purple-100 bg-white p-2 shadow-[0_20px_50px_-15px_rgba(88,28,174,0.25)]"
                  >
                    {niches.map((niche) => {
                      const selected = form.niche === niche.value;

                      return (
                        <button
                          key={niche.value}
                          type="button"
                          onClick={() => handleNicheSelect(niche)}
                          className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[13px] font-semibold transition ${
                            selected
                              ? "bg-purple-50 text-purple-700"
                              : "text-gray-700 hover:bg-[#f8f5ff] hover:text-purple-700"
                          }`}
                        >
                          <span>{niche.label}</span>

                          {selected && (
                            <FiCheckCircle
                              size={15}
                              className="text-purple-600"
                            />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bio */}
            <div className="relative">
              <FiEdit3
                className="pointer-events-none absolute left-4 top-4 text-purple-300"
                size={15}
              />

              <textarea
                name="bio"
                placeholder="Tell fans about yourself and the content you create..."
                maxLength={500}
                rows={4}
                className="w-full resize-none rounded-2xl border border-purple-100 bg-[#f8f5ff] py-3.5 pl-11 pr-4 text-base font-medium text-purple-900 outline-none placeholder:text-purple-300 focus:border-purple-200 focus:bg-white focus:ring-4 focus:ring-purple-50"
                value={form.bio}
                onChange={handleChange}
              />

              <div className="pointer-events-none absolute bottom-3 right-4 text-[10px] font-semibold text-purple-300">
                {form.bio.length}/500
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-[#fcfcff] p-3 ring-1 ring-purple-50">
            <button
              type="button"
              onClick={() => setAgreed((prev) => !prev)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                agreed
                  ? "border-purple-600 bg-purple-600 text-white"
                  : "border-purple-200 bg-white"
              }`}
            >
              {agreed && <FiCheckCircle size={12} />}
            </button>

            <label className="text-[12.5px] leading-5 text-purple-800/70">
              I agree to the{" "}
              <Link
                href="/terms-conditions"
                target="_blank"
                className="font-bold text-purple-600 hover:underline"
              >
                Terms & Conditions
              </Link>
            </label>
          </div>

          <Link
            href="/about"
            className="mt-3 inline-block text-xs font-bold text-purple-500 hover:underline"
          >
            About Tippified?
          </Link>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !agreed || nichesLoading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 py-3.5 text-[15px] font-bold text-white shadow-[0_12px_20px_-8px_rgba(124,58,237,0.6)] disabled:opacity-60"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Sign Up"
            )}
          </motion.button>

          <p className="mt-6 text-center text-sm text-purple-700/60">
            Already have an account?{" "}
            <Link
              href="https://app.tippified.com/creator/signin"
              className="font-bold text-purple-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.form>
    </>
  );
}
