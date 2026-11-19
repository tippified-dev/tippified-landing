"use client";

import { bricolage, fredoka } from "@/app/font";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiCreditCard,
  FiLock,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";

const API_BASE_URL = "https://api.tippified.com";

interface CampaignDetails {
  id: number;
  name: string;
  slug: string;
}

interface CampaignDetailsResponse {
  success: boolean;
  subscription_active: boolean;
  campaign: CampaignDetails;
  message?: string;
}

interface SetupResponse {
  success: boolean;
  authorization_url?: string;
  message?: string;
}

export default function CrowdfundingCheckoutPage() {
  const params = useParams<{ campaignId: string }>();
  const campaignId = params.campaignId;

  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingPayment, setStartingPayment] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!campaignId) return;

    const controller = new AbortController();

    const fetchCampaign = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/crowdfunding/my-campaigns/${campaignId}/`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        const data = (await response.json()) as CampaignDetailsResponse;

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load campaign details.");
        }

        if (data.subscription_active) {
          setError("Your organisation already has an active subscription.");
          return;
        }

        setCampaign(data.campaign);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCampaign();

    return () => controller.abort();
  }, [campaignId]);

  const handlePayment = async () => {
    if (!acceptedTerms) {
      setError("Please accept the subscription terms before continuing.");
      return;
    }

    try {
      setStartingPayment(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/crowdfunding/subscription/setup/${campaignId}/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = (await response.json()) as SetupResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to initialise your card verification.",
        );
      }

      if (!data.authorization_url) {
        throw new Error("Paystack checkout URL was not returned.");
      }

      window.location.assign(data.authorization_url);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to continue to payment. Please try again.",
      );

      setStartingPayment(false);
    }
  };

  return (
    <main
      className={`${bricolage.className} relative min-h-screen overflow-hidden bg-[#faf9fc] text-gray-900`}
    >
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-purple-200/35 blur-3xl" />
      <div className="pointer-events-none absolute top-162.5 -left-32 h-96 w-96 rounded-full bg-purple-100/50 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 border-b border-purple-100/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          <Link
            href="/"
            className={`${fredoka.className} text-[27px] font-bold tracking-tight text-purple-700`}
          >
            tippified
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3.5 py-2 text-[12px] font-bold text-green-700">
            <FiLock size={13} />
            Secure checkout
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        <Link
          href={`/my-campaigns/${campaignId}`}
          className="mb-9 inline-flex items-center gap-2 text-[14px] font-semibold text-gray-500 transition hover:text-purple-700"
        >
          <FiArrowLeft size={17} />
          Back to campaign
        </Link>

        {loading ? (
          <div className="animate-pulse">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-purple-100" />
              <div className="mx-auto h-8 w-64 rounded-lg bg-gray-200" />
              <div className="mx-auto mt-4 h-4 w-full max-w-md rounded bg-gray-100" />
            </div>

            <div className="rounded-[30px] border border-gray-100 bg-white p-7 shadow-sm sm:p-9">
              <div className="h-5 w-40 rounded bg-gray-100" />
              <div className="mt-5 h-12 w-48 rounded bg-gray-200" />
              <div className="mt-7 h-28 rounded-2xl bg-gray-100" />
              <div className="mt-7 h-14 rounded-xl bg-purple-100" />
            </div>
          </div>
        ) : error && !campaign ? (
          <div className="rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <FiShield size={26} />
            </div>

            <h1
              className={`${fredoka.className} text-[25px] font-bold text-gray-900`}
            >
              Unable to continue
            </h1>

            <p className="mx-auto mt-3 max-w-md text-[14px] leading-6 text-gray-500">
              {error}
            </p>

            <Link
              href={`/my-campaigns/${campaignId}`}
              className={`${fredoka.className} mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-purple-700 px-7 text-[15px] font-bold text-white transition hover:bg-purple-800`}
            >
              Return to campaign
            </Link>
          </div>
        ) : campaign ? (
          <>
            {/* Introduction */}
            <div className="mb-9 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-purple-100 text-purple-700 shadow-sm shadow-purple-100">
                <FiCreditCard size={27} />
              </div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[1px] text-purple-700">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                Organisation subscription
              </div>

              <h1
                className={`${fredoka.className} text-[32px] font-bold leading-tight tracking-tight text-gray-900 sm:text-[39px]`}
              >
                Activate your campaign
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-[14px] leading-7 text-gray-500 sm:text-[15px]">
                One simple setup gives your organisation access to
                Tippified&apos;s crowdfunding infrastructure and Pro features.
              </p>

              {/* Progress */}
              <div className="mx-auto mt-8 flex max-w-md items-start">
                {["Campaign", "Card setup", "Live"].map((label, index) => {
                  const active = index <= 1;

                  return (
                    <div key={label} className="flex-1">
                      <div className="flex items-center">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                            active
                              ? "bg-purple-700 text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {index === 0 ? (
                            <FiCheckCircle size={16} />
                          ) : (
                            index + 1
                          )}
                        </div>

                        {index !== 2 && (
                          <div
                            className={`h-0.75 flex-1 rounded-full ${
                              index === 0 ? "bg-purple-700" : "bg-gray-100"
                            }`}
                          />
                        )}
                      </div>

                      <p
                        className={`mt-2.5 text-left text-[11px] font-bold sm:text-[12px] ${
                          index === 1
                            ? "text-purple-700"
                            : active
                              ? "text-gray-700"
                              : "text-gray-400"
                        }`}
                      >
                        {label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Checkout card */}
            <div className="overflow-hidden rounded-[30px] border border-purple-100/70 bg-white shadow-[0_25px_90px_-35px_rgba(109,40,217,0.25)]">
              {/* Campaign information */}
              <div className="border-b border-gray-100 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[1.4px] text-gray-400">
                    Approved campaign
                  </p>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-bold text-green-700">
                    <FiCheckCircle size={13} />
                    Approved
                  </span>
                </div>

                <h2
                  className={`${fredoka.className} mt-3 text-[23px] font-bold leading-tight text-gray-900 sm:text-[27px]`}
                >
                  {campaign.name}
                </h2>

                <p className="mt-2 text-[13px] text-gray-500">
                  Your organisation&apos;s subscription covers this campaign and
                  other eligible campaigns under the same organisation.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                {/* Pricing */}
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[1.1px] text-gray-400">
                    Tippified Pro
                  </p>

                  <div className="mt-3 flex flex-wrap items-baseline gap-2">
                    <span
                      className={`${fredoka.className} text-[45px] font-bold leading-none tracking-tight text-gray-900 sm:text-[52px]`}
                    >
                      ₦20,000
                    </span>

                    <span className="text-[14px] font-medium text-gray-500">
                      / month
                    </span>
                  </div>

                  <p className="mt-3 max-w-lg text-[14px] leading-6 text-gray-500">
                    Your organisation receives 30 days of access after
                    successful card verification before its first monthly
                    subscription charge.
                  </p>
                </div>

                {/* Payment breakdown */}
                <div className="mt-7 overflow-hidden rounded-2xl border border-purple-100 bg-[#faf8ff]">
                  <div className="border-b border-purple-100 px-5 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[1.1px] text-purple-700">
                      Your payment breakdown
                    </p>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[14px] font-semibold text-gray-800">
                          Card verification
                        </p>
                        <p className="mt-1 text-[12px] text-gray-500">
                          One-time charge today
                        </p>
                      </div>

                      <span className="text-[16px] font-bold text-gray-900">
                        ₦100
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[14px] font-semibold text-gray-800">
                          First monthly subscription
                        </p>
                        <p className="mt-1 text-[12px] text-gray-500">
                          After your initial 30 days
                        </p>
                      </div>

                      <span className="text-[14px] font-bold text-gray-900">
                        ₦20,000
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-purple-100 pt-4">
                      <span className="text-[14px] font-bold text-gray-900">
                        Pay today
                      </span>

                      <span
                        className={`${fredoka.className} text-[25px] font-bold text-purple-800`}
                      >
                        ₦100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Billing timeline */}
                <div className="mt-7">
                  <h3
                    className={`${fredoka.className} text-[17px] font-bold text-gray-900`}
                  >
                    How your billing works
                  </h3>

                  <div className="mt-5 space-y-5">
                    <div className="flex gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                        <FiCreditCard size={18} />
                      </div>

                      <div>
                        <p className="text-[14px] font-bold text-gray-800">
                          Today — Verify your card
                        </p>
                        <p className="mt-1 text-[13px] leading-6 text-gray-500">
                          Paystack securely collects your card details and
                          processes the one-time ₦100 verification charge.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                        <FiCalendar size={18} />
                      </div>

                      <div>
                        <p className="text-[14px] font-bold text-gray-800">
                          First 30 days — Enjoy your access
                        </p>
                        <p className="mt-1 text-[13px] leading-6 text-gray-500">
                          Your organisation receives its initial 30-day access
                          period. No ₦20,000 subscription payment is due during
                          this period.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                        <FiRefreshCw size={18} />
                      </div>

                      <div>
                        <p className="text-[14px] font-bold text-gray-800">
                          After 30 days — Monthly billing begins
                        </p>
                        <p className="mt-1 text-[13px] leading-6 text-gray-500">
                          Your saved card is charged ₦20,000 automatically every
                          month to maintain your organisation&apos;s
                          subscription.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important billing disclosure */}
                <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50/70 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle
                      className="mt-0.5 shrink-0 text-amber-700"
                      size={19}
                    />

                    <div>
                      <p className="text-[13px] font-bold text-amber-900">
                        Important subscription information
                      </p>

                      <p className="mt-2 text-[12px] leading-6 text-amber-900/80">
                        If a monthly payment fails, your subscription may become
                        inactive and contributions to your campaigns may be
                        restricted. Unpaid monthly invoices will continue
                        accumulating, including during periods when your
                        organisation has no active campaigns. When your card is
                        successfully charged again, outstanding invoices must be
                        settled before subscription access is restored.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Consent */}
                <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 p-4 transition hover:border-purple-200">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => {
                      setAcceptedTerms(event.target.checked);
                      if (error) setError("");
                    }}
                    className="mt-1 h-4 w-4 shrink-0 accent-purple-700"
                  />

                  <span className="text-[12px] leading-6 text-gray-600">
                    I authorise Tippified to charge my saved card ₦20,000
                    monthly after the initial 30-day period. I understand that
                    unpaid monthly subscription invoices will continue to
                    accumulate if a payment fails, and that all outstanding
                    invoices must be settled before my organisation&apos;s
                    subscription access is restored.
                  </span>
                </label>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] leading-6 text-red-700"
                  >
                    {error}
                  </div>
                )}

                {/* Payment button */}
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={!acceptedTerms || startingPayment}
                  className={`${fredoka.className} mt-7 flex h-14.5 w-full items-center justify-center gap-2.5 rounded-2xl text-[16px] font-bold text-white shadow-lg shadow-purple-200/60 transition duration-200 ${
                    !acceptedTerms || startingPayment
                      ? "cursor-not-allowed bg-purple-400 opacity-70"
                      : "bg-purple-700 hover:-translate-y-0.5 hover:bg-purple-800 hover:shadow-purple-300/70"
                  }`}
                >
                  {startingPayment ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Connecting to Paystack...
                    </>
                  ) : (
                    <>
                      <FiCreditCard size={19} />
                      Continue to secure card setup
                    </>
                  )}
                </button>

                {/* Security */}
                <div className="mt-5 flex items-center justify-center gap-2 text-[12px] font-medium text-gray-400">
                  <FiShield size={15} className="text-green-600" />
                  Secure card verification powered by Paystack
                </div>

                <p className="mx-auto mt-2 max-w-md text-center text-[11px] leading-5 text-gray-400">
                  Your card details are collected securely by Paystack.
                  Tippified does not store your raw card number or CVV.
                </p>

                <p className="mt-6 border-t border-gray-100 pt-5 text-center text-[12px] leading-6 text-gray-500">
                  By continuing, you also agree to our{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="font-bold text-purple-700 underline underline-offset-4"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-bold text-purple-700 underline underline-offset-4"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Footer information */}
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <FiCheckCircle size={19} />
                </div>

                <div>
                  <h3
                    className={`${fredoka.className} text-[16px] font-bold text-gray-900`}
                  >
                    One subscription. Your entire organisation.
                  </h3>

                  <p className="mt-1.5 text-[13px] leading-6 text-gray-500">
                    Your ₦20,000 monthly subscription covers your organisation
                    rather than charging separately for each campaign.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Footer */}
      <footer className="relative border-t border-purple-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-[12px] text-gray-500 sm:flex-row sm:px-8">
          <p>Powered by Tippified</p>

          <div className="flex items-center gap-2">
            <Link
              href="/terms-and-conditions"
              className="font-semibold transition hover:text-purple-700"
            >
              Terms and Conditions
            </Link>

            <span className="text-gray-300">•</span>

            <Link
              href="/privacy-policy"
              className="font-semibold transition hover:text-purple-700"
            >
              Privacy Policy
            </Link>
          </div>

          <p>Discover. Support.</p>
        </div>
      </footer>
    </main>
  );
}
