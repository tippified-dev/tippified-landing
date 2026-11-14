"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiTarget,
} from "react-icons/fi";

const API_BASE_URL = "https://api.tippified.com";

type CampaignStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "active"
  | "target_achieved"
  | "completed"
  | "suspended";

interface CampaignSummary {
  id: number;
  name: string;
  slug: string;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  location: string;
  target_amount: string;
  total_raised: string;
  currency: string;
  progress_percentage: number;
  banner_url: string | null;
  status: CampaignStatus;
  status_label: string;
  submitted_at: string | null;
  published_at: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

interface MyCampaignsResponse {
  success: boolean;
  count: number;
  results: CampaignSummary[];
  message?: string;
}

const filters: { label: string; value: "all" | CampaignStatus }[] = [
  { label: "All campaigns", value: "all" },
  { label: "Drafts", value: "draft" },
  { label: "Pending review", value: "pending_review" },
  { label: "Approved", value: "approved" },
  { label: "Active", value: "active" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
];

const statusStyles: Record<CampaignStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending_review: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  active: "bg-green-100 text-green-800",
  target_achieved: "bg-purple-100 text-purple-800",
  completed: "bg-gray-200 text-gray-800",
  suspended: "bg-red-100 text-red-800",
};

function formatAmount(amount: string, currency: string): string {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return `${currency} ${amount}`;
  }

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

function formatDate(date: string | null): string {
  if (!date) return "Not set";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not set";
  }

  return parsedDate.toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | CampaignStatus>(
    "all",
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchCampaigns() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/crowdfunding/my-campaigns/`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      const data = (await response.json()) as MyCampaignsResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to retrieve your campaigns.");
      }

      setCampaigns(data.results || []);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your campaigns.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchCampaigns();
  }, []);

  const filteredCampaigns = useMemo(() => {
    if (activeFilter === "all") return campaigns;

    return campaigns.filter((campaign) => campaign.status === activeFilter);
  }, [campaigns, activeFilter]);

  return (
    <main className="min-h-screen bg-[#F8F8FC] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/crowdfunding-dashboard"
          className="mb-7 inline-flex items-center gap-2 text-base font-medium text-gray-600 transition hover:text-purple-700"
        >
          <FiArrowLeft />
          Back to dashboard
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My campaigns</h1>

            <p className="mt-2 text-base text-gray-600">
              Manage and monitor all your crowdfunding campaigns.
            </p>
          </div>

          <Link
            href="/organization-crowdfunding-campaign"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-700 px-5 py-3 text-base font-semibold text-white transition hover:bg-purple-800"
          >
            <FiPlus />
            Create campaign
          </Link>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-base text-gray-500">Total campaigns</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {campaigns.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-base text-gray-500">Active campaigns</p>

            <p className="mt-2 text-3xl font-bold text-green-700">
              {campaigns.filter((c) => c.status === "active").length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-base text-gray-500">Awaiting review</p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {campaigns.filter((c) => c.status === "pending_review").length}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                activeFilter === filter.value
                  ? "bg-purple-700 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:text-purple-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center">
            <FiRefreshCw className="mx-auto animate-spin text-3xl text-purple-700" />

            <p className="mt-4 text-base text-gray-600">
              Loading your campaigns...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <p className="text-base font-medium text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => void fetchCampaigns()}
              className="mt-5 rounded-xl bg-purple-700 px-5 py-3 text-base font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">
              <FiTarget className="text-3xl text-purple-700" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              {campaigns.length === 0
                ? "You haven't created a campaign yet"
                : "No campaigns found"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-base text-gray-600">
              {campaigns.length === 0
                ? "Create your first campaign and start raising support for something meaningful."
                : "There are no campaigns matching this status."}
            </p>

            {campaigns.length === 0 && (
              <Link
                href="/organization-crowdfunding-campaign"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-3 text-base font-semibold text-white"
              >
                <FiPlus />
                Create your first campaign
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredCampaigns.map((campaign) => {
              const progress = Math.min(
                100,
                Math.max(0, campaign.progress_percentage || 0),
              );

              return (
                <article
                  key={campaign.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-purple-200"
                >
                  {campaign.banner_url ? (
                    <Image
                      src={campaign.banner_url}
                      alt={campaign.name}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, 1200px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-purple-50">
                      <FiTarget className="text-5xl text-purple-300" />
                    </div>
                  )}

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                          statusStyles[campaign.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {campaign.status_label}
                      </span>

                      {campaign.category && (
                        <span className="text-sm font-medium text-gray-500">
                          {campaign.category.name}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-gray-900">
                      {campaign.name}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <FiMapPin />
                        {campaign.location || "Location not specified"}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <FiCalendar />
                        {formatDate(campaign.created_at)}
                      </span>
                    </div>

                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-gray-600">
                          Amount raised
                        </span>

                        <span className="text-sm font-bold text-purple-700">
                          {progress.toFixed(1)}%
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-purple-700 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap justify-between gap-2">
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            {formatAmount(
                              campaign.total_raised,
                              campaign.currency,
                            )}
                          </p>

                          <p className="text-sm text-gray-500">raised</p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatAmount(
                              campaign.target_amount,
                              campaign.currency,
                            )}
                          </p>

                          <p className="text-sm text-gray-500">target</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-5">
                      <Link
                        href={`/my-campaigns/${campaign.id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-700 px-5 py-3 text-base font-semibold text-purple-700 transition hover:bg-purple-700 hover:text-white"
                      >
                        View campaign details
                        <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
