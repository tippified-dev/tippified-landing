"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiTarget,
} from "react-icons/fi";
import { bricolage, fredoka } from "../font";

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

  const totalCount = campaigns.length;
  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const pendingCount = campaigns.filter(
    (c) => c.status === "pending_review",
  ).length;

  const getFilterCount = (value: "all" | CampaignStatus): number => {
    if (value === "all") return campaigns.length;
    return campaigns.filter((c) => c.status === value).length;
  };

  return (
    <main
      className={`${bricolage.className} relative min-h-screen overflow-hidden bg-[#F8F8FC] px-4 py-8 sm:px-6 lg:px-10`}
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-purple-100/50 blur-3xl" />
      <div className="pointer-events-none absolute top-96 -left-24 h-72 w-72 rounded-full bg-purple-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <Link
          href="/crowdfunding-dashboard"
          className="mb-8 inline-flex items-center gap-2 text-[15px] font-medium text-gray-600 transition hover:text-purple-700"
        >
          <FiArrowLeft />
          Back to dashboard
        </Link>

        {/* HEADER */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-purple-100 bg-purple-50 px-3.5 py-2">
              <span className="h-2 w-2 rounded-full bg-purple-700" />
              <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-purple-700">
                Your crowdfunding workspace
              </span>
            </div>

            <h1
              className={`${fredoka.className} text-[34px] font-bold leading-[1.1] tracking-tight text-gray-900 md:text-[42px]`}
            >
              My campaigns
            </h1>

            <p className="mt-3 max-w-xl text-[15px] leading-7 text-gray-600 md:text-base">
              Manage and monitor all your crowdfunding campaigns, from draft to
              fully funded.
            </p>
          </div>

          <Link
            href="/organization-crowdfunding-campaign"
            className="group flex h-14 shrink-0 items-center justify-center gap-2.5 rounded-xl bg-purple-700 px-7 text-[15px] font-bold text-white shadow-[0_12px_25px_-12px_rgba(126,34,206,0.65)] transition hover:-translate-y-0.5 hover:bg-purple-800 hover:shadow-[0_16px_30px_-12px_rgba(126,34,206,0.8)]"
          >
            <FiPlus size={19} />
            Create campaign
            <FiArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* SUMMARY */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="group rounded-3x1 border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-25px_rgba(126,34,206,0.22)] md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total campaigns
                </p>
                <p
                  className={`${fredoka.className} mt-3 text-[32px] font-bold leading-none tracking-tight text-gray-900`}
                >
                  {totalCount}
                </p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2x1 bg-purple-50 text-purple-700">
                <FiLayers size={22} />
              </div>
            </div>
            <p className="mt-6 text-sm leading-6 text-gray-400">
              All campaigns you have created
            </p>
          </div>

          <div className="group rounded-3x1 border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-25px_rgba(22,163,74,0.22)] md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active campaigns
                </p>
                <p
                  className={`${fredoka.className} mt-3 text-[32px] font-bold leading-none tracking-tight text-green-700`}
                >
                  {activeCount}
                </p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2x1 bg-green-100 text-green-700">
                <FiCheckCircle size={22} />
              </div>
            </div>
            <p className="mt-6 text-sm leading-6 text-gray-400">
              Currently live and receiving support
            </p>
          </div>

          <div className="group rounded-3x1 border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-25px_rgba(217,119,6,0.22)] md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Awaiting review
                </p>
                <p
                  className={`${fredoka.className} mt-3 text-[32px] font-bold leading-none tracking-tight text-amber-600`}
                >
                  {pendingCount}
                </p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2x1 bg-amber-100 text-amber-700">
                <FiClock size={22} />
              </div>
            </div>
            <p className="mt-6 text-sm leading-6 text-gray-400">
              Waiting for review by Tippified
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-8 flex flex-wrap gap-2.5">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;
            const count = getFilterCount(filter.value);
            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter.value)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold transition ${
                  isActive
                    ? "bg-purple-700 text-white shadow-[0_10px_20px_-10px_rgba(126,34,206,0.7)]"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:text-purple-700"
                }`}
              >
                {filter.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3x1 border border-gray-200 bg-white"
              >
                <div className="h-52 animate-pulse bg-purple-50" />
                <div className="space-y-4 p-6">
                  <div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
                  <div className="h-7 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                  <div className="h-2.5 w-full animate-pulse rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3x1 border border-red-200 bg-white p-8 text-center md:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FiRefreshCw size={26} />
            </div>
            <h2
              className={`${fredoka.className} mt-6 text-[22px] font-bold leading-tight text-gray-900`}
            >
              Unable to load your campaigns
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-gray-600">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void fetchCampaigns()}
              className="mt-7 inline-flex h-14 items-center justify-center rounded-xl bg-purple-700 px-7 text-[15px] font-bold text-white transition hover:bg-purple-800"
            >
              Try again
            </button>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="rounded-3x1 border border-gray-200 bg-white px-6 py-16 text-center md:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50">
              <FiTarget className="text-3xl text-purple-700" />
            </div>

            <h2
              className={`${fredoka.className} mt-6 text-[22px] font-bold leading-tight text-gray-900 md:text-2xl`}
            >
              {campaigns.length === 0
                ? "You haven't created a campaign yet"
                : "No campaigns found"}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-gray-600">
              {campaigns.length === 0
                ? "Create your first campaign and start raising support for something meaningful."
                : "There are no campaigns matching this status. Try another filter."}
            </p>

            {campaigns.length === 0 && (
              <Link
                href="/organization-crowdfunding-campaign"
                className="mt-7 inline-flex h-14 items-center gap-2 rounded-xl bg-purple-700 px-7 text-[15px] font-bold text-white transition hover:bg-purple-800"
              >
                <FiPlus size={19} />
                Create your first campaign
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredCampaigns.map((campaign) => {
              const progress = Math.min(
                100,
                Math.max(0, campaign.progress_percentage || 0),
              );

              return (
                <article
                  key={campaign.id}
                  className="group overflow-hidden rounded-3x1 border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-[0_20px_50px_-25px_rgba(126,34,206,0.25)]"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-purple-50 sm:h-56">
                    {campaign.banner_url ? (
                      <Image
                        src={campaign.banner_url}
                        alt={campaign.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FiTarget className="text-5xl text-purple-300" />
                      </div>
                    )}

                    {campaign.category && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-2 text-xs font-bold text-gray-900 shadow-sm">
                        {campaign.category.name}
                      </span>
                    )}
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-bold ${
                          statusStyles[campaign.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {campaign.status_label}
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500">
                        <FiCalendar size={14} />
                        Created {formatDate(campaign.created_at)}
                      </span>
                    </div>

                    <h2
                      className={`${fredoka.className} mt-4 text-[22px] font-bold leading-tight text-gray-900`}
                    >
                      {campaign.name}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <FiMapPin size={15} />
                        {campaign.location || "Location not specified"}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <FiCalendar size={15} />
                        Ends {formatDate(campaign.end_date)}
                      </span>
                    </div>

                    <div className="mt-7">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-gray-600">
                          Amount raised
                        </span>

                        <span className="rounded-full bg-purple-50 px-3 py-1.5 text-sm font-bold text-purple-700">
                          {progress.toFixed(1)}%
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-purple-700 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap justify-between gap-3">
                        <div>
                          <p
                            className={`${fredoka.className} text-xl font-bold leading-6 text-gray-900`}
                          >
                            {formatAmount(
                              campaign.total_raised,
                              campaign.currency,
                            )}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">raised</p>
                        </div>

                        <div className="text-right">
                          <p
                            className={`${fredoka.className} text-xl font-bold leading-6 text-gray-900`}
                          >
                            {formatAmount(
                              campaign.target_amount,
                              campaign.currency,
                            )}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">target</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-7 border-t border-gray-100 pt-5">
                      <Link
                        href={`/my-campaigns/${campaign.id}`}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-purple-700 px-5 text-[15px] font-bold text-purple-700 transition hover:bg-purple-700 hover:text-white"
                      >
                        View campaign details
                        <FiArrowRight size={16} />
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
