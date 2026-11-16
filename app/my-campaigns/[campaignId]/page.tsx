"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCopy,
  FiDollarSign,
  FiExternalLink,
  FiFileText,
  FiMapPin,
  FiPhone,
  FiShield,
  FiTarget,
  FiUsers,
} from "react-icons/fi";
import { bricolage, fredoka } from "../../font";

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
  subscription_active: boolean;
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

function formatLabel(value: string): string {
  if (!value) return "Not provided";
  const cleaned = value.replace(/_/g, " ").trim();
  if (!cleaned) return "Not provided";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function InformationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-gray-100 py-4 last:border-0 last:pb-0">
      <span className="text-[12px] font-bold uppercase tracking-[1.2px] text-gray-400">
        {label}
      </span>
      <span className="wrap-break-words text-[15px] font-semibold leading-6 text-gray-900">
        {value || "Not provided"}
      </span>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3x1 border border-gray-200 bg-white p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
            <Icon size={20} />
          </div>
          <div>
            <h2
              className={`${fredoka.className} text-[20px] font-bold leading-7 text-gray-900 md:text-[22px]`}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm leading-6 text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-7">{children}</div>
    </section>
  );
}

export default function CampaignDetailsPage() {
  const params = useParams<{ campaignId: string }>();
  const campaignId = params.campaignId;

  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [urlCopied, setUrlCopied] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

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
        setSubscriptionActive(data.subscription_active);
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
      <main
        className={`${bricolage.className} min-h-screen bg-[#F8F8FC] px-4 py-8 sm:px-6 lg:px-10`}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 h-5 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mb-6 h-10 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="mb-8 h-64 animate-pulse rounded-[28px] bg-gray-200 sm:h-105" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-64 animate-pulse rounded-3x1 bg-white" />
              <div className="h-64 animate-pulse rounded-3x1 bg-white" />
            </div>
            <div className="h-96 animate-pulse rounded-3x1 bg-white" />
          </div>
          <p className="mt-8 text-center text-[15px] font-medium text-gray-500">
            Loading campaign details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !campaign) {
    return (
      <main
        className={`${bricolage.className} min-h-screen bg-[#F8F8FC] px-4 py-16`}
      >
        <div className="mx-auto max-w-xl rounded-[28px] border border-gray-200 bg-white p-8 text-center shadow-xl shadow-purple-100/40 md:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <FiAlertCircle size={26} />
          </div>
          <h1
            className={`${fredoka.className} mt-6 text-[24px] font-bold leading-tight text-gray-900`}
          >
            Unable to load campaign
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-gray-600">
            {error || "Campaign not found."}
          </p>
          <Link
            href="/my-campaigns"
            className="mt-8 inline-flex h-14 items-center gap-2 rounded-xl bg-purple-700 px-7 text-[15px] font-bold text-white transition hover:bg-purple-800"
          >
            <FiArrowLeft size={17} />
            Back to my campaigns
          </Link>
        </div>
      </main>
    );
  }

  const fundraising = campaign.fundraising;
  const publicCampaignUrl = `https://tippified.com/campaign/${campaign.slug}`;

  const progress = Math.min(
    100,
    Math.max(0, fundraising.progress_percentage || 0),
  );

  const activeArrangement = campaign.payout_arrangements.find(
    (arrangement) => arrangement.is_active,
  );

  const timelineItems: { label: string; value: string; isLast: boolean }[] = [
    {
      label: "Created",
      value: formatDate(campaign.dates.created_at),
      isLast: false,
    },
    {
      label: "Submitted for review",
      value: formatDate(campaign.dates.submitted_at),
      isLast: false,
    },
    {
      label: "Published",
      value: formatDate(campaign.dates.published_at),
      isLast: false,
    },
    {
      label: "Start date",
      value: formatDate(campaign.dates.start_date),
      isLast: false,
    },
    {
      label: "End date",
      value: formatDate(campaign.dates.end_date),
      isLast: false,
    },
    {
      label: "Last reviewed",
      value: formatDate(campaign.status.reviewed_at),
      isLast: true,
    },
  ];

  return (
    <main
      className={`${bricolage.className} relative min-h-screen overflow-hidden bg-[#F8F8FC] px-4 py-8 sm:px-6 lg:px-10`}
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-purple-100/50 blur-3xl" />
      <div className="pointer-events-none absolute top-96 -left-24 h-72 w-72 rounded-full bg-purple-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <Link
          href="/my-campaigns"
          className="mb-8 inline-flex items-center gap-2 text-[15px] font-medium text-gray-600 transition hover:text-purple-700"
        >
          <FiArrowLeft />
          Back to my campaigns
        </Link>

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-[13px] font-bold text-purple-800">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {campaign.status.label}
              </span>
              {campaign.is_featured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-2 text-[13px] font-bold text-amber-800">
                  Featured
                </span>
              )}
              {campaign.category && (
                <span className="inline-flex rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] font-bold text-gray-700">
                  {campaign.category.name}
                </span>
              )}
            </div>

            <h1
              className={`${fredoka.className} mt-4 text-[34px] font-bold leading-[1.1] tracking-tight text-gray-900 md:text-[42px]`}
            >
              {campaign.name}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-[15px] leading-7 text-gray-500">
              <FiMapPin size={17} className="shrink-0 text-purple-700" />
              {campaign.location || "Location not specified"}
            </p>
          </div>

          <div className="shrink-0 rounded-[20px] border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-gray-400">
              Campaign ID
            </p>
            <p
              className={`${fredoka.className} mt-1.5 text-lg font-bold leading-6 text-gray-900`}
            >
              tippified-funding-{campaign.id}
            </p>
          </div>
        </div>

        {/* APPROVED */}
        {campaign.status.value === "approved" && campaign.slug && (
          <section className="mb-8 rounded-3x1 border border-green-200 bg-green-50 p-6 md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-green-700 shadow-sm">
                  <FiCheckCircle size={22} />
                </div>
                <div>
                  <h2
                    className={`${fredoka.className} text-[20px] font-bold leading-7 text-green-900`}
                  >
                    Your campaign is approved!
                  </h2>
                  <p className="mt-1 text-[15px] leading-6 text-green-700">
                    Your public campaign page is ready to share with supporters.
                  </p>
                </div>
              </div>
              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-green-100 px-4 py-2 text-[13px] font-bold text-green-800">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Approved
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={publicCampaignUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-xl border border-green-200 bg-white px-4 py-3.5 text-sm font-medium text-purple-700 hover:underline"
              >
                <span className="truncate">{publicCampaignUrl}</span>
                <FiExternalLink size={16} className="shrink-0" />
              </a>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(publicCampaignUrl);
                    setUrlCopied(true);
                    setTimeout(() => setUrlCopied(false), 2500);
                  } catch {
                    setUrlCopied(false);
                  }
                }}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-6 text-sm font-bold text-white transition hover:bg-green-800"
              >
                <FiCopy size={16} />
                {urlCopied ? "Copied!" : "Copy URL"}
              </button>
            </div>
            {!subscriptionActive && (
              <Link
                href={`/crowdfunding/checkout/${campaign.id}`}
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-6 text-sm font-bold text-white transition hover:bg-purple-800 sm:w-auto"
              >
                Activate this campaign
                <FiExternalLink size={16} />
              </Link>
            )}
          </section>
        )}

        {/* BANNER */}
        {campaign.banner_url ? (
          <div className="relative mb-8 h-70 w-full overflow-hidden rounded-[28px] bg-gray-100 sm:h-105">
            <Image
              src={campaign.banner_url}
              alt={campaign.name}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 bg-linear-to-t from-black/50 to-transparent p-6 pt-16">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[1.5px] text-white/80">
                  Campaign banner
                </p>
                <p
                  className={`${fredoka.className} mt-1 text-[20px] font-bold leading-7 text-white`}
                >
                  {campaign.name}
                </p>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-[13px] font-bold text-gray-900">
                {progress.toFixed(1)}% funded
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-8 flex h-55 w-full flex-col items-center justify-center rounded-[28px] border border-dashed border-gray-200 bg-white text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <FiTarget size={26} />
            </div>
            <p className="mt-4 text-[15px] font-semibold text-gray-900">
              No banner image
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Add a banner to make your campaign stand out.
            </p>
          </div>
        )}

        {/* REJECTED */}
        {campaign.status.value === "rejected" &&
          campaign.status.rejection_reason && (
            <section className="mb-8 rounded-3x1 border border-red-200 bg-red-50 p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
                  <FiAlertCircle size={22} />
                </div>
                <div>
                  <h2
                    className={`${fredoka.className} text-[20px] font-bold leading-7 text-red-800`}
                  >
                    Campaign review feedback
                  </h2>
                  <p className="mt-2 text-[15px] leading-7 text-red-700">
                    {campaign.status.rejection_reason}
                  </p>
                </div>
              </div>
            </section>
          )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* ABOUT */}
            <SectionCard
              title="About this campaign"
              subtitle="The story behind your cause"
              icon={FiFileText}
            >
              <p className="whitespace-pre-wrap text-[15px] leading-8 text-gray-600 md:text-base">
                {campaign.about || "No campaign description provided."}
              </p>
              {campaign.category && (
                <div className="mt-7 border-t border-gray-100 pt-2">
                  <InformationRow
                    label="Category"
                    value={campaign.category.name}
                  />
                  {campaign.category.description && (
                    <InformationRow
                      label="Category description"
                      value={campaign.category.description}
                    />
                  )}
                </div>
              )}
            </SectionCard>

            {/* FUNDRAISING */}
            <SectionCard
              title="Fundraising information"
              subtitle="Track how close you are to your goal"
              icon={FiDollarSign}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-purple-50 p-5">
                  <p className="text-[13px] font-semibold text-gray-500">
                    Amount raised
                  </p>
                  <p
                    className={`${fredoka.className} mt-2 text-[28px] font-bold leading-none text-purple-700`}
                  >
                    {formatAmount(
                      fundraising.total_raised,
                      fundraising.currency,
                    )}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    From supporters so far
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-5">
                  <p className="text-[13px] font-semibold text-gray-500">
                    Target amount
                  </p>
                  <p
                    className={`${fredoka.className} mt-2 text-[28px] font-bold leading-none text-gray-900`}
                  >
                    {formatAmount(
                      fundraising.target_amount,
                      fundraising.currency,
                    )}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Your fundraising goal
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    Fundraising progress
                  </span>
                  <span className="rounded-full bg-purple-50 px-3.5 py-1.5 text-sm font-bold text-purple-700">
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-purple-700 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-7 border-t border-gray-100 pt-2">
                <InformationRow
                  label="Disbursement arrangement"
                  value={formatLabel(fundraising.disbursement_mode)}
                />
              </div>
            </SectionCard>

            {/* GALLERY */}
            {campaign.gallery.length > 0 && (
              <SectionCard
                title="Campaign gallery"
                subtitle={`${campaign.gallery.length} photo${campaign.gallery.length === 1 ? "" : "s"} telling your story`}
                icon={FiTarget}
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {campaign.gallery.map((image) => (
                    <div
                      key={image.id}
                      className="group overflow-hidden rounded-2xl border border-gray-100"
                    >
                      {image.image_url ? (
                        <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                          <Image
                            src={image.image_url}
                            alt={image.caption || campaign.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        </div>
                      ) : (
                        <div className="flex h-56 items-center justify-center bg-gray-100 text-[15px] text-gray-500">
                          Image unavailable
                        </div>
                      )}
                      {image.caption && (
                        <p className="bg-white px-4 py-3.5 text-sm leading-6 text-gray-600">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* DOCUMENTS */}
            <SectionCard
              title="Supporting documents"
              subtitle="Proof and paperwork for your campaign"
              icon={FiFileText}
            >
              {campaign.documents.length === 0 ? (
                <div className="rounded-2xl bg-gray-50 px-6 py-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm">
                    <FiFileText size={22} />
                  </div>
                  <p className="mt-4 text-[15px] font-semibold text-gray-900">
                    No supporting documents yet
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    No supporting documents have been uploaded.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaign.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 p-5 transition hover:border-purple-200 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                          <FiFileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <h3
                            className={`${fredoka.className} text-[16px] font-bold leading-6 text-gray-900`}
                          >
                            {document.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {formatLabel(document.document_type)}
                          </p>
                          {document.description && (
                            <p className="mt-2 text-sm leading-6 text-gray-600">
                              {document.description}
                            </p>
                          )}
                          <span
                            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold ${
                              document.is_verified
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {document.is_verified
                              ? "Verified"
                              : "Not yet verified"}
                          </span>
                        </div>
                      </div>
                      {document.document_url && (
                        <a
                          href={document.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-purple-700 px-5 text-sm font-bold text-purple-700 transition hover:bg-purple-700 hover:text-white"
                        >
                          View document
                          <FiExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* PAYOUTS */}
            <SectionCard
              title="Payout arrangements and beneficiaries"
              subtitle="Where raised funds will go"
              icon={FiUsers}
            >
              {!campaign.payout_arrangements.length ? (
                <div className="rounded-2xl bg-gray-50 px-6 py-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm">
                    <FiUsers size={22} />
                  </div>
                  <p className="mt-4 text-[15px] font-semibold text-gray-900">
                    No payout arrangements yet
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    No payout arrangements have been added.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {campaign.payout_arrangements.map((arrangement) => (
                    <div
                      key={arrangement.id}
                      className="rounded-2xl border border-gray-200 p-5 md:p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3
                          className={`${fredoka.className} text-[17px] font-bold leading-6 text-gray-900`}
                        >
                          Payout arrangement — Version {arrangement.version}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-gray-100 px-3.5 py-1.5 text-[13px] font-bold text-gray-700">
                            {formatLabel(arrangement.status)}
                          </span>
                          {arrangement.is_active && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3.5 py-1.5 text-[13px] font-bold text-green-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              Active arrangement
                            </span>
                          )}
                        </div>
                      </div>

                      {arrangement.rejection_reason && (
                        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3.5 text-sm leading-6 text-red-700">
                          {arrangement.rejection_reason}
                        </p>
                      )}

                      <div className="mt-5 space-y-4">
                        {arrangement.allocations.map((allocation) => {
                          const beneficiary = allocation.beneficiary;
                          return (
                            <div
                              key={allocation.id}
                              className="rounded-2xl bg-gray-50 p-5"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <h4
                                  className={`${fredoka.className} text-[16px] font-bold leading-6 text-gray-900`}
                                >
                                  {beneficiary.beneficiary_name}
                                </h4>
                                <span
                                  className={`${fredoka.className} rounded-full bg-purple-700 px-4 py-1.5 text-sm font-bold text-white`}
                                >
                                  {allocation.allocation_percentage}%
                                </span>
                              </div>

                              <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
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
                                  value={formatLabel(
                                    beneficiary.verification_status,
                                  )}
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
            </SectionCard>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <section className="rounded-3x1 border border-gray-200 bg-white p-6 md:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <FiClock size={20} />
                </div>
                <h2
                  className={`${fredoka.className} text-[18px] font-bold leading-7 text-gray-900`}
                >
                  Campaign timeline
                </h2>
              </div>

              <div className="mt-7">
                {timelineItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    {!item.isLast && (
                      <span className="absolute left-1.75 top-5 h-full w-px bg-gray-200" />
                    )}
                    <span className="relative z-10 mt-1.5 h-3.75 w-3.75 shrink-0 rounded-full border-2 border-purple-700 bg-white" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-gray-400">
                        {item.label}
                      </p>
                      <p className="mt-1 text-[15px] font-semibold leading-6 text-gray-900">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3x1 border border-gray-200 bg-white p-6 md:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <FiPhone size={20} />
                </div>
                <h2
                  className={`${fredoka.className} text-[18px] font-bold leading-7 text-gray-900`}
                >
                  Contact information
                </h2>
              </div>
              <div className="mt-5">
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

            <section className="rounded-3x1 border border-gray-200 bg-white p-6 md:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <FiShield size={20} />
                </div>
                <h2
                  className={`${fredoka.className} text-[18px] font-bold leading-7 text-gray-900`}
                >
                  Campaign settings
                </h2>
              </div>
              <div className="mt-5">
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
                <InformationRow label="Status" value={campaign.status.label} />
              </div>
            </section>

            {activeArrangement && (
              <section className="rounded-3x1 border border-green-200 bg-green-50 p-6">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
                    <FiCheckCircle size={20} />
                  </div>
                  <div>
                    <h2
                      className={`${fredoka.className} text-[17px] font-bold leading-6 text-green-900`}
                    >
                      Active payout arrangement
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-green-800">
                      This campaign currently has an active payout arrangement
                      with {activeArrangement.allocations.length} beneficiary
                      {activeArrangement.allocations.length === 1 ? "" : "ies"}.
                    </p>
                    <p className="mt-3 inline-flex rounded-full bg-green-100 px-3.5 py-1.5 text-[13px] font-bold text-green-800">
                      Version {activeArrangement.version} · Active
                    </p>
                  </div>
                </div>
              </section>
            )}

            <section className="rounded-3x1 border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <FiCalendar size={20} />
                </div>
                <h2
                  className={`${fredoka.className} text-[18px] font-bold leading-7 text-gray-900`}
                >
                  Key dates
                </h2>
              </div>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-500">Starts</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatDate(campaign.dates.start_date)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <span className="text-sm text-gray-500">Ends</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatDate(campaign.dates.end_date)}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <div className="mt-10">
          <Link
            href="/my-campaigns"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-purple-700 px-6 text-[15px] font-bold text-purple-700 transition hover:bg-purple-700 hover:text-white"
          >
            <FiArrowLeft size={17} />
            Back to my campaigns
          </Link>
        </div>
      </div>
    </main>
  );
}
