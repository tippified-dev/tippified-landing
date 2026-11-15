"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiFileText,
  FiMapPin,
  FiRefreshCw,
  FiTarget,
} from "react-icons/fi";

const API_BASE_URL = "https://api.tippified.com";

interface CampaignImage {
  id: number;
  image_url: string | null;
  caption: string;
  display_order: number;
  created_at: string;
}

interface CampaignDocument {
  id: number;
  title: string;
  document_type: string;
  description: string;
  document_url: string | null;
  is_verified: boolean;
  created_at: string;
}

interface Beneficiary {
  id: number;
  beneficiary_type: string;
  beneficiary_name: string;
  account_label: string;
  country: string;
  currency: string;
  bank_name: string;
  account_name: string;
  masked_account_number: string | null;
  verification_status: string;
  is_default: boolean;
}

interface PayoutAllocation {
  id: number;
  allocation_percentage: string;
  display_order: number;
  beneficiary: Beneficiary;
}

interface PayoutArrangement {
  id: number;
  version: number;
  status: string;
  is_active: boolean;
  submitted_at: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  allocations: PayoutAllocation[];
}

interface CampaignDetails {
  id: number;
  name: string;
  slug: string;
  about: string;

  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
  } | null;

  location: string;

  fundraising: {
    target_amount: string;
    total_raised: string;
    currency: string;
    progress_percentage: number;
    disbursement_mode: string;
  };

  banner_url: string | null;
  gallery: CampaignImage[];

  contact: {
    phone: string;
    address: string;
  };

  dates: {
    start_date: string | null;
    end_date: string | null;
    submitted_at: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
  };

  status: {
    value: string;
    label: string;
    reviewed_at: string | null;
    rejection_reason: string | null;
  };

  documents: CampaignDocument[];
  payout_arrangements: PayoutArrangement[];

  allow_public_sharing: boolean;
  is_featured: boolean;
}

interface CampaignDetailsResponse {
  success: boolean;
  campaign: CampaignDetails;
  message?: string;
}

function formatAmount(amount: string, currency: string): string {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return `${currency} ${amount}`;
  }

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(date: string | null): string {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function InformationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 py-3 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="wrap-break-words text-base font-medium text-gray-900">
        {value || "Not provided"}
      </span>
    </div>
  );
}

export default function CampaignDetailsPage() {
  const params = useParams<{ campaignId: string }>();
  const campaignId = params.campaignId;

  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!campaignId) return;

    async function fetchCampaign() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/crowdfunding/my-campaigns/${campaignId}/`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        );

        const data = (await response.json()) as CampaignDetailsResponse;

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to retrieve campaign details.",
          );
        }

        setCampaign(data.campaign);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading this campaign.",
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchCampaign();
  }, [campaignId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F8FC] px-4">
        <div className="text-center">
          <FiRefreshCw className="mx-auto animate-spin text-3xl text-purple-700" />
          <p className="mt-4 text-base text-gray-600">
            Loading campaign details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !campaign) {
    return (
      <main className="min-h-screen bg-[#F8F8FC] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Unable to load campaign
          </h1>

          <p className="mt-3 text-base text-gray-600">
            {error || "Campaign not found."}
          </p>

          <Link
            href="/my-campaigns"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-3 text-base font-semibold text-white"
          >
            <FiArrowLeft />
            Back to my campaigns
          </Link>
        </div>
      </main>
    );
  }

  const fundraising = campaign.fundraising;

  const progress = Math.min(
    100,
    Math.max(0, fundraising.progress_percentage || 0),
  );

  const activeArrangement = campaign.payout_arrangements.find(
    (arrangement) => arrangement.is_active,
  );

  return (
    <main className="min-h-screen bg-[#F8F8FC] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/my-campaigns"
          className="mb-7 inline-flex items-center gap-2 text-base font-medium text-gray-600 hover:text-purple-700"
        >
          <FiArrowLeft />
          Back to my campaigns
        </Link>

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-purple-100 px-3 py-1.5 text-sm font-semibold text-purple-800">
              {campaign.status.label}
            </span>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              {campaign.name}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-base text-gray-500">
              <FiMapPin />
              {campaign.location || "Location not specified"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <p className="text-sm text-gray-500">Campaign ID</p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              tippified-funding-{campaign.id}
            </p>
          </div>
        </div>

        {campaign.banner_url && (
          <div className="relative mb-8 h-65 w-full overflow-hidden rounded-2xl bg-gray-100 sm:h-100">
            <Image
              src={campaign.banner_url}
              alt={campaign.name}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        )}

        {campaign.status.value === "rejected" &&
          campaign.status.rejection_reason && (
            <section className="mb-7 rounded-2xl border border-red-200 bg-red-50 p-5">
              <h2 className="text-lg font-bold text-red-800">
                Campaign review feedback
              </h2>

              <p className="mt-2 text-base leading-7 text-red-700">
                {campaign.status.rejection_reason}
              </p>
            </section>
          )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-gray-900">
                About this campaign
              </h2>

              <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-gray-600">
                {campaign.about || "No campaign description provided."}
              </p>

              {campaign.category && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <InformationRow
                    label="Category"
                    value={campaign.category.name}
                  />
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <FiTarget className="text-xl text-purple-700" />

                <h2 className="text-xl font-bold text-gray-900">
                  Fundraising information
                </h2>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Amount raised</p>

                  <p className="mt-2 text-2xl font-bold text-purple-700">
                    {formatAmount(
                      fundraising.total_raised,
                      fundraising.currency,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Target amount</p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {formatAmount(
                      fundraising.target_amount,
                      fundraising.currency,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    Fundraising progress
                  </span>

                  <span className="text-sm font-bold text-purple-700">
                    {progress.toFixed(1)}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-purple-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-6">
                <InformationRow
                  label="Disbursement arrangement"
                  value={fundraising.disbursement_mode.replace("_", " ")}
                />
              </div>
            </section>

            {campaign.gallery.length > 0 && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Campaign gallery
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {campaign.gallery.map((image) => (
                    <div key={image.id} className="overflow-hidden rounded-xl">
                      {image.image_url ? (
                        <div className="relative h-56 w-full bg-gray-100">
                          <Image
                            src={image.image_url}
                            alt={image.caption || campaign.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-56 items-center justify-center bg-gray-100 text-base text-gray-500">
                          Image unavailable
                        </div>
                      )}

                      {image.caption && (
                        <p className="mt-2 text-sm text-gray-600">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <FiFileText className="text-xl text-purple-700" />

                <h2 className="text-xl font-bold text-gray-900">
                  Supporting documents
                </h2>
              </div>

              {campaign.documents.length === 0 ? (
                <p className="mt-4 text-base text-gray-500">
                  No supporting documents have been uploaded.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {campaign.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {document.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {document.document_type.replace("_", " ")}
                        </p>

                        {document.description && (
                          <p className="mt-2 text-sm text-gray-600">
                            {document.description}
                          </p>
                        )}

                        <span
                          className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                            document.is_verified
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {document.is_verified
                            ? "Verified"
                            : "Not yet verified"}
                        </span>
                      </div>

                      {document.document_url && (
                        <a
                          href={document.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-lg border border-purple-700 px-4 py-2.5 text-center text-sm font-semibold text-purple-700 hover:bg-purple-50"
                        >
                          View document
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Payout arrangements and beneficiaries
              </h2>

              {!campaign.payout_arrangements.length ? (
                <p className="mt-4 text-base text-gray-500">
                  No payout arrangements have been added.
                </p>
              ) : (
                <div className="mt-5 space-y-5">
                  {campaign.payout_arrangements.map((arrangement) => (
                    <div
                      key={arrangement.id}
                      className="rounded-xl border border-gray-200 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="font-bold text-gray-900">
                          Payout arrangement — Version {arrangement.version}
                        </h3>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                            {arrangement.status.replace("_", " ")}
                          </span>

                          {arrangement.is_active && (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                              Active arrangement
                            </span>
                          )}
                        </div>
                      </div>

                      {arrangement.rejection_reason && (
                        <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                          {arrangement.rejection_reason}
                        </p>
                      )}

                      <div className="mt-4 space-y-4">
                        {arrangement.allocations.map((allocation) => {
                          const beneficiary = allocation.beneficiary;

                          return (
                            <div
                              key={allocation.id}
                              className="rounded-lg bg-gray-50 p-4"
                            >
                              <div className="flex flex-wrap justify-between gap-3">
                                <h4 className="font-semibold text-gray-900">
                                  {beneficiary.beneficiary_name}
                                </h4>

                                <span className="font-bold text-purple-700">
                                  {allocation.allocation_percentage}%
                                </span>
                              </div>

                              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <InformationRow
                                  label="Account label"
                                  value={beneficiary.account_label}
                                />

                                <InformationRow
                                  label="Bank"
                                  value={beneficiary.bank_name}
                                />

                                <InformationRow
                                  label="Account name"
                                  value={beneficiary.account_name}
                                />

                                <InformationRow
                                  label="Account number"
                                  value={
                                    beneficiary.masked_account_number ||
                                    "Not available"
                                  }
                                />

                                <InformationRow
                                  label="Currency"
                                  value={beneficiary.currency}
                                />

                                <InformationRow
                                  label="Verification"
                                  value={beneficiary.verification_status}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Campaign timeline
              </h2>

              <div className="mt-4">
                <InformationRow
                  label="Created"
                  value={formatDate(campaign.dates.created_at)}
                />

                <InformationRow
                  label="Submitted for review"
                  value={formatDate(campaign.dates.submitted_at)}
                />

                <InformationRow
                  label="Published"
                  value={formatDate(campaign.dates.published_at)}
                />

                <InformationRow
                  label="Start date"
                  value={formatDate(campaign.dates.start_date)}
                />

                <InformationRow
                  label="End date"
                  value={formatDate(campaign.dates.end_date)}
                />

                <InformationRow
                  label="Last reviewed"
                  value={formatDate(campaign.status.reviewed_at)}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Contact information
              </h2>

              <div className="mt-4">
                <InformationRow
                  label="Phone number"
                  value={campaign.contact.phone}
                />

                <InformationRow
                  label="Contact address"
                  value={campaign.contact.address}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Campaign settings
              </h2>

              <div className="mt-4">
                <InformationRow
                  label="Public sharing"
                  value={campaign.allow_public_sharing ? "Enabled" : "Disabled"}
                />

                <InformationRow
                  label="Featured campaign"
                  value={campaign.is_featured ? "Yes" : "No"}
                />

                <InformationRow
                  label="Campaign category"
                  value={campaign.category?.name || "Not specified"}
                />
              </div>
            </section>

            {activeArrangement && (
              <section className="rounded-2xl border border-green-200 bg-green-50 p-5">
                <h2 className="font-bold text-green-900">
                  Active payout arrangement
                </h2>

                <p className="mt-2 text-sm leading-6 text-green-800">
                  This campaign currently has an active payout arrangement with{" "}
                  {activeArrangement.allocations.length} beneficiary
                  {activeArrangement.allocations.length === 1 ? "" : "ies"}.
                </p>
              </section>
            )}
          </aside>
        </div>

        <div className="mt-8">
          <Link
            href="/my-campaigns"
            className="inline-flex items-center gap-2 rounded-xl border border-purple-700 px-5 py-3 text-base font-semibold text-purple-700 hover:bg-purple-50"
          >
            <FiArrowLeft />
            Back to my campaigns
          </Link>
        </div>
      </div>
    </main>
  );
}
