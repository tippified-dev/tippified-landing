"use client";

import { bricolage, fredoka } from "@/app/font";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCreditCard,
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

export default function CrowdfundingCheckoutPage() {
  const params = useParams<{ campaignId: string }>();
  const campaignId = params.campaignId;

  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);
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

  return (
    <main
      className={`${bricolage.className} relative min-h-screen overflow-hidden bg-[#faf9fc] text-gray-900`}
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-96 -left-24 h-72 w-72 rounded-full bg-purple-100/40 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 border-b border-purple-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          <Link
            href="/"
            className={`${fredoka.className} text-[26px] font-bold tracking-tight text-purple-700`}
          >
            tippified
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-[12px] font-bold text-purple-700">
            <FiShield size={14} />
            Secure checkout
          </span>
        </div>
      </header>

      <div className="relative mx-auto max-w-3xl px-4 py-8 md:px-8">
        <Link
          href={`/my-campaigns/${campaignId}`}
          className="mb-8 inline-flex items-center gap-2 text-[14px] font-semibold text-gray-600 transition hover:text-purple-700"
        >
          <FiArrowLeft size={17} />
          Back to campaign
        </Link>

        {loading ? (
          <div className="animate-pulse">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-purple-100" />
              <div className="mx-auto h-8 w-64 rounded bg-gray-200" />
              <div className="mx-auto mt-3 h-4 w-full max-w-lg rounded bg-gray-100" />
              <div className="mx-auto mt-2 h-4 w-2/3 max-w-lg rounded bg-gray-100" />
            </div>
            <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="h-3 w-24 rounded bg-gray-100" />
              <div className="mt-3 h-7 w-56 rounded bg-gray-200" />
              <div className="mt-4 h-6 w-40 rounded-full bg-gray-100" />
              <div className="my-7 border-t border-gray-100" />
              <div className="h-4 w-32 rounded bg-gray-100" />
              <div className="mt-3 h-11 w-40 rounded bg-gray-200" />
              <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-5/6 rounded bg-gray-100" />
                <div className="h-4 w-4/6 rounded bg-gray-100" />
              </div>
              <div className="mt-8 h-14 rounded-xl bg-purple-100" />
            </div>
            <p className="mt-6 text-center text-[13px] font-medium text-gray-400">
              Loading your campaign...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <FiShield size={26} />
            </div>
            <h1
              className={`${fredoka.className} text-[24px] font-bold leading-tight text-gray-900`}
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
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                <FiCreditCard size={25} />
              </div>

              <h1
                className={`${fredoka.className} text-[30px] font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-[36px]`}
              >
                Activate your campaign
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-[14px] leading-7 text-gray-500 sm:text-[15px]">
                Activate your approved campaign and make it available to
                supporters. This also covers your organization&apos;s
                subscription.
              </p>

              {/* Stepper */}
              <div className="mx-auto mt-7 flex max-w-lg items-start gap-2 sm:gap-3">
                {["Campaign", "Payment", "Live"].map((label, index) => {
                  const isActive = index <= 1;
                  const isCurrent = index === 1;
                  return (
                    <div key={label} className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                            isActive
                              ? "bg-purple-700 text-white"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {index < 1 ? <FiCheckCircle size={15} /> : index + 1}
                        </span>
                        <div
                          className={`h-1.5 flex-1 rounded-full ${
                            isActive ? "bg-purple-700" : "bg-purple-100"
                          }`}
                        />
                      </div>
                      <p
                        className={`mt-2.5 text-[12px] font-bold sm:text-[13px] ${
                          isCurrent
                            ? "text-purple-700"
                            : isActive
                              ? "text-gray-900"
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

            <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-[0_24px_70px_-30px_rgba(109,40,217,0.22)]">
              <div className="border-b border-gray-100 p-6 sm:p-8">
                <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-gray-400">
                  Campaign
                </p>

                <h2
                  className={`${fredoka.className} mt-2.5 text-[22px] font-bold leading-tight text-gray-900 sm:text-[24px]`}
                >
                  {campaign.name}
                </h2>

                <div className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-green-50 px-3.5 py-1.5 text-[12px] font-semibold text-green-700">
                  <FiCheckCircle size={14} />
                  Approved by Tippified
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-[13px] font-semibold text-gray-500">
                  Monthly subscription
                </p>

                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <span
                    className={`${fredoka.className} text-[42px] font-bold leading-none tracking-tight text-gray-900 sm:text-[48px]`}
                  >
                    ₦20,000
                  </span>
                  <span className="text-[14px] text-gray-500">/ month</span>
                </div>

                <p className="mt-3 text-[14px] leading-6 text-gray-500">
                  Your subscription renews automatically every month. You can
                  manage your subscription through your organisation account.
                </p>

                <div className="mt-7 rounded-2xl bg-gray-50 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3 text-[14px]">
                    <span className="text-gray-600">Monthly subscription</span>
                    <span className="font-bold text-gray-900">₦20,000</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-200 pt-3 text-[14px]">
                    <span className="font-bold text-gray-900">
                      Total due today
                    </span>
                    <span
                      className={`${fredoka.className} text-[17px] font-bold text-gray-900`}
                    >
                      ₦20,000
                    </span>
                  </div>
                </div>

                <div className="my-7 border-t border-gray-100" />

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiCheckCircle
                      className="mt-0.5 shrink-0 text-green-600"
                      size={19}
                    />
                    <p className="text-[14px] leading-6 text-gray-600">
                      Activate your approved campaign.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiCheckCircle
                      className="mt-0.5 shrink-0 text-green-600"
                      size={19}
                    />
                    <p className="text-[14px] leading-6 text-gray-600">
                      Allow supporters to contribute to your campaign.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiCheckCircle
                      className="mt-0.5 shrink-0 text-green-600"
                      size={19}
                    />
                    <p className="text-[14px] leading-6 text-gray-600">
                      Enjoy all the features included in your Pro subscription
                      plan.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  className={`${fredoka.className} mt-8 flex h-14 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl bg-purple-700 text-[15px] font-bold text-white opacity-60`}
                >
                  <FiCreditCard size={19} />
                  Continue to secure payment
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 text-center text-[12px] text-gray-400">
                  <FiShield size={15} />
                  Secure card payment powered by Paystack
                </div>

                <p className="mt-3 text-center text-[12px] leading-5 text-gray-400">
                  Your card details will be handled securely by Paystack.
                  Tippified does not store your raw card details.
                </p>

                <p className="mt-6 border-t border-gray-100 pt-5 text-center text-[13px] leading-6 text-gray-500">
                  By continuing, you agree to our{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="font-bold text-purple-700 underline decoration-purple-200 underline-offset-4 transition hover:text-purple-800"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-bold text-purple-700 underline decoration-purple-200 underline-offset-4 transition hover:text-purple-800"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* What happens next */}
            <div className="mt-6 rounded-3x1 border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <FiCheckCircle size={19} />
                </div>
                <div>
                  <h3
                    className={`${fredoka.className} text-[16px] font-bold leading-6 text-gray-900`}
                  >
                    What happens next?
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-6 text-gray-500">
                    Once your payment is confirmed, your campaign goes live
                    immediately and supporters can start contributing.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Footer with Terms and Privacy */}
      <footer className="relative border-t border-purple-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-[13px] text-gray-500 sm:flex-row sm:px-8">
          <p>Powered by Tippified</p>
          <div className="flex items-center gap-1.5">
            <Link
              href="/terms-and-conditions"
              className="font-semibold text-gray-600 transition hover:text-purple-700"
            >
              Terms and Conditions
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/privacy-policy"
              className="font-semibold text-gray-600 transition hover:text-purple-700"
            >
              Privacy Policy
            </Link>
          </div>
          <p>Discover. Celebrate. Support.</p>
        </div>
      </footer>
    </main>
  );
}
