"use client";

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
      } catch (err) {
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
    <main className="min-h-screen bg-[#faf9fc] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/my-campaigns/${campaignId}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-purple-700"
        >
          <FiArrowLeft size={17} />
          Back to campaign
        </Link>

        {loading ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-purple-100 border-t-purple-700" />
            <p className="mt-4 text-sm text-gray-500">
              Loading your campaign...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">
              Unable to continue
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">{error}</p>
            <Link
              href={`/my-campaigns/${campaignId}`}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-purple-700 px-6 text-sm font-bold text-white transition hover:bg-purple-800"
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

              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Activate your campaign
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
                Activate your approved campaign and make it available to
                supporters.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-6 md:p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Campaign
                </p>

                <h2 className="mt-2 text-xl font-bold text-gray-900">
                  {campaign.name}
                </h2>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  <FiCheckCircle size={14} />
                  Approved by Tippified
                </div>
              </div>

              <div className="p-6 md:p-8">
                <p className="text-sm font-semibold text-gray-500">
                  Monthly subscription
                </p>

                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                    ₦20,000
                  </span>
                  <span className="text-sm text-gray-500">/ month</span>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Your subscription renews automatically every month. You can
                  manage your subscription through your organisation account.
                </p>

                <div className="my-7 border-t border-gray-100" />

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiCheckCircle
                      className="mt-0.5 shrink-0 text-green-600"
                      size={18}
                    />
                    <p className="text-sm text-gray-600">
                      Activate your approved campaign.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiCheckCircle
                      className="mt-0.5 shrink-0 text-green-600"
                      size={18}
                    />
                    <p className="text-sm text-gray-600">
                      Allow supporters to contribute to your campaign.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiCheckCircle
                      className="mt-0.5 shrink-0 text-green-600"
                      size={18}
                    />
                    <p className="text-sm text-gray-600">
                      Enjoy the features included in your subscription plan.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  className="mt-8 flex h-14 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-purple-700 text-sm font-bold text-white opacity-60"
                >
                  <FiCreditCard size={18} />
                  Continue to secure payment
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
                  <FiShield size={15} />
                  Secure card payment powered by Paystack
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                  Your card details will be handled securely by Paystack.
                  Tippified does not store your raw card details.
                </p>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
