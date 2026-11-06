"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const inputClass =
  "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-[#190D2E] outline-none transition placeholder:text-zinc-400 focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100";

const labelClass = "text-xs font-semibold text-[#190D2E]";
const API_BASE_URL = "https://api.tippified.com";

export default function IndividualKYCPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("incomplete");

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const loadKYC = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/crowdfunding/individual-kyc/`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const result = await response.json();
        setVerificationStatus(result.verification_status || "incomplete");

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to load your KYC information.",
          );
        }

        if (result.exists && result.kyc && formRef.current) {
          Object.entries(result.kyc).forEach(([name, value]) => {
            const field = formRef.current?.elements.namedItem(name) as
              | HTMLInputElement
              | HTMLSelectElement
              | HTMLTextAreaElement
              | null;

            if (field) {
              field.value = value ? String(value) : "";
            }
          });
        }

        if (result.verification_status === "pending") {
          setSuccessMessage(
            "Your KYC information has already been submitted and is awaiting review.",
          );
        }

        if (result.verification_status === "approved") {
          setSuccessMessage("Your KYC has been approved.");
        }

        if (
          result.verification_status === "rejected" &&
          result.rejection_reason
        ) {
          setErrorMessage(
            `Your previous KYC submission was rejected: ${result.rejection_reason}. You can update your information and resubmit.`,
          );
        }
      } catch (error) {
        console.error("KYC loading error:", error);
      }
    };

    loadKYC();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      // Get CSRF token
      const csrfResponse = await fetch(
        `${API_BASE_URL}/api/crowdfunding/csrf/`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const csrfData = await csrfResponse.json();

      if (!csrfResponse.ok || !csrfData.csrfToken) {
        throw new Error(
          "Unable to establish a secure connection. Please try again.",
        );
      }

      // Submit KYC
      const response = await fetch(
        `${API_BASE_URL}/api/crowdfunding/individual-kyc/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfData.csrfToken,
          },
          credentials: "include",
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const firstError = Object.values(result.errors).flat()[0];
          throw new Error(String(firstError));
        }

        throw new Error(result.error || "KYC submission failed.");
      }

      setSuccessMessage(
        result.message || "Your KYC has been submitted successfully.",
      );
      setVerificationStatus("pending");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9FC] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">
        {/* HEADER */}
        <button
          type="button"
          onClick={() => router.push("/crowdfunding-dashboard")}
          className="mb-6 flex items-center gap-2 text-xs font-semibold text-zinc-500 transition hover:text-[#6D28D9]"
        >
          <span className="text-lg">←</span>
          Back to dashboard
        </button>

        <div className="mb-8">
          <div className="mb-3 inline-flex items-center rounded-full bg-purple-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6D28D9]">
            Individual account verification
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#190D2E] md:text-3xl">
            Complete your KYC
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
            Provide your personal information to verify your identity and
            establish trust with supporters on Tippified.
          </p>
        </div>

        {/* PROGRESS */}
        <div className="mb-8 rounded-2xl border border-purple-100 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#190D2E]">
                Personal verification
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">
                Complete all required information.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-lg text-[#6D28D9]">
              ✓
            </div>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full w-1/3 rounded-full bg-[#6D28D9]" />
          </div>
        </div>

        {/* KYC STATUS NOTICE */}

        {verificationStatus === "pending" && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">
              Your KYC is under review.
            </p>
            <p className="mt-1 text-xs text-amber-700">
              Your information has been submitted successfully. You will be
              notified when the review is complete.
            </p>
          </div>
        )}

        {verificationStatus === "approved" && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-800">
              Your KYC has been approved.
            </p>
            <p className="mt-1 text-xs text-green-700">
              Your individual account verification is complete.
            </p>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* PERSONAL INFORMATION */}
          <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6">
              <h2 className="text-base font-bold text-[#190D2E]">
                Personal information
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Tell us about yourself and where you live.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Phone number *</label>
                <input
                  type="tel"
                  name="phone_number"
                  required
                  placeholder="e.g. +234 801 234 5678"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Date of birth *</label>
                <input
                  type="date"
                  name="date_of_birth"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Place of birth *</label>
                <input
                  type="text"
                  name="place_of_birth"
                  required
                  placeholder="City or town"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>State of origin *</label>
                <input
                  type="text"
                  name="state_of_origin"
                  required
                  placeholder="Enter your state of origin"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Occupation *</label>
                <input
                  type="text"
                  name="occupation"
                  required
                  placeholder="What do you do?"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Education level *</label>
                <select
                  name="education_level"
                  required
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select education level
                  </option>
                  <option value="primary">Primary Education</option>
                  <option value="secondary">Secondary Education</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="bachelors">Bachelor&apos;s Degree</option>
                  <option value="masters">Master&apos;s Degree</option>
                  <option value="doctorate">Doctorate</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Marital status *</label>
                <select
                  name="marital_status"
                  required
                  defaultValue=""
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select marital status
                  </option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Residential address *</label>
                <textarea
                  name="residential_address"
                  required
                  rows={3}
                  placeholder="Enter your full residential address"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* ABOUT */}
          <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-5">
              <h2 className="text-base font-bold text-[#190D2E]">About you</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Give us a brief introduction about yourself.
              </p>
            </div>

            <label className={labelClass}>Personal description *</label>
            <textarea
              name="about"
              required
              rows={5}
              placeholder="Tell us about yourself, your background and what you do..."
              className={inputClass}
            />
          </section>

          {/* NEXT OF KIN */}
          <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6">
              <h2 className="text-base font-bold text-[#190D2E]">
                Next of kin information
              </h2>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Provide the details of someone we can contact when necessary.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClass}>Full name *</label>
                <input
                  type="text"
                  name="next_of_kin_name"
                  required
                  placeholder="Enter full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Phone number *</label>
                <input
                  type="tel"
                  name="next_of_kin_phone"
                  required
                  placeholder="Enter phone number"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email address</label>
                <input
                  type="email"
                  name="next_of_kin_email"
                  placeholder="Enter email address (optional)"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Relationship *</label>
                <input
                  type="text"
                  name="next_of_kin_relationship"
                  required
                  placeholder="e.g. Brother, Sister, Parent, Spouse"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Residential address *</label>
                <textarea
                  name="next_of_kin_address"
                  required
                  rows={3}
                  placeholder="Enter next of kin's residential address"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* SUBMISSION NOTICE */}
          <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
            <p className="text-xs leading-5 text-purple-900">
              Please ensure that the information you provide is accurate. Your
              details will be reviewed as part of Tippified&apos;s identity
              verification process.
            </p>
          </div>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-700">
                {successMessage}
              </p>
              <p className="mt-1 text-xs text-green-600">
                Your information has been received and is awaiting review.
              </p>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                {errorMessage}
              </p>
            </div>
          )}

          {/* SUBMIT */}
          <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/crowdfunding-dashboard")}
              className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                verificationStatus === "pending" ||
                verificationStatus === "approved"
              }
              className="rounded-xl bg-[#6D28D9] px-7 py-3 text-xs font-bold text-white transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Submitting..."
                : verificationStatus === "pending"
                  ? "Under Review"
                  : verificationStatus === "approved"
                    ? "KYC Approved"
                    : "Submit KYC"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
