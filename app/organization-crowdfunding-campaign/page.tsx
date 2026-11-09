"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiChevronDown,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

const API_BASE_URL = "https://api.tippified.com";
const MAX_BANNER_SIZE = 10 * 1024 * 1024;

interface CampaignCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

interface ApiErrorResponse {
  detail?: unknown;
  error?: unknown;
  message?: unknown;
  csrfToken?: string;
}

interface CampaignImageUploadResponse {
  upload_url: string;
  object_key: string;
  expires_in: number;
  required_headers: Record<string, string>;
}

interface CampaignImageCompleteResponse {
  object_key: string;
  image_url: string;
  file_size: number;
  content_type: string;
}

interface BeneficiaryAccount {
  id: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  allocation_percentage: string;
}

type DisbursementMode = "direct" | "after_campaign";

const DISBURSEMENT_OPTIONS: {
  value: DisbursementMode;
  label: string;
  description: string;
}[] = [
  {
    value: "direct",
    label: "Direct Paystack Settlement",
    description:
      "Contributions are split through Paystack using the configured beneficiary arrangements.",
  },
  {
    value: "after_campaign",
    label: "After-Campaign Disbursement",
    description:
      "Funds are received through Tippified's Paystack arrangement. Your organisation can request disbursement after the campaign.",
  },
];

function getErrorMessage(payload: unknown): string {
  if (typeof payload !== "object" || payload === null) {
    return "Something went wrong. Please try again.";
  }

  const data = payload as Record<string, unknown>;

  for (const key of ["detail", "error", "message"]) {
    const value = data[key];

    if (typeof value === "string") {
      return value;
    }

    if (Array.isArray(value)) {
      return value.join(" ");
    }
  }

  const fieldErrors = Object.entries(data)
    .filter(([, value]) => Array.isArray(value))
    .map(([field, value]) => {
      const messages = (value as unknown[]).filter(
        (item): item is string => typeof item === "string",
      );

      return `${field}: ${messages.join(" ")}`;
    });

  if (fieldErrors.length > 0) {
    return fieldErrors.join(" ");
  }

  return "Something went wrong. Please check your information and try again.";
}

function formatAmount(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, "");
  const decimalIndex = cleaned.indexOf(".");

  const integerPart =
    decimalIndex === -1 ? cleaned : cleaned.slice(0, decimalIndex);

  const decimalPart =
    decimalIndex === -1 ? "" : cleaned.slice(decimalIndex + 1);

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimalIndex === -1
    ? formattedInteger
    : `${formattedInteger}.${decimalPart.slice(0, 2)}`;
}

function getNumericAmount(value: string): number {
  return Number(value.replace(/,/g, ""));
}

function createBeneficiary(): BeneficiaryAccount {
  return {
    id: crypto.randomUUID(),
    account_name: "",
    bank_name: "",
    account_number: "",
    allocation_percentage: "",
  };
}

function extractCategories(result: unknown): CampaignCategory[] {
  if (Array.isArray(result)) {
    return result as CampaignCategory[];
  }

  if (typeof result !== "object" || result === null) {
    return [];
  }

  const data = result as Record<string, unknown>;

  const possibleLists = [data.data, data.results, data.categories];

  for (const list of possibleLists) {
    if (Array.isArray(list)) {
      return list as CampaignCategory[];
    }
  }

  return [];
}

export default function OrganizationCrowdfundingCampaignPage() {
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [categories, setCategories] = useState<CampaignCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const [activeDropdown, setActiveDropdown] = useState<
    "category" | "disbursement" | null
  >(null);

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [disbursementMode, setDisbursementMode] =
    useState<DisbursementMode>("after_campaign");

  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryAccount[]>([
    createBeneficiary(),
  ]);

  const [banner, setBanner] = useState<File | null>(null);
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [error, setError] = useState("");
  const [campaignCreated, setCampaignCreated] = useState(false);

  const selectedCategory = categories.find(
    (item) => String(item.id) === category,
  );

  const selectedDisbursement = DISBURSEMENT_OPTIONS.find(
    (item) => item.value === disbursementMode,
  );

  const totalAllocation = beneficiaries.reduce(
    (total, beneficiary) =>
      total + Number(beneficiary.allocation_percentage || 0),
    0,
  );

  const allocationsAreValid =
    beneficiaries.length > 0 &&
    beneficiaries.every(
      (beneficiary) =>
        beneficiary.account_name.trim() !== "" &&
        beneficiary.bank_name.trim() !== "" &&
        /^\d{10}$/.test(beneficiary.account_number) &&
        Number(beneficiary.allocation_percentage) > 0,
    ) &&
    Math.abs(totalAllocation - 100) < 0.001;

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setLoadingCategories(true);
        setCategoryError("");

        const response = await fetch(
          `${API_BASE_URL}/api/crowdfunding/categories/`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        const result: unknown = await response.json();

        if (!response.ok) {
          throw new Error(getErrorMessage(result));
        }

        const categoryList = extractCategories(result);

        if (!cancelled) {
          setCategories(categoryList);
        }
      } catch (err) {
        if (!cancelled) {
          setCategoryError(
            err instanceof Error
              ? err.message
              : "Unable to load campaign categories.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function updateBeneficiary(
    id: string,
    field: keyof Omit<BeneficiaryAccount, "id">,
    value: string,
  ) {
    setBeneficiaries((current) =>
      current.map((beneficiary) =>
        beneficiary.id === id
          ? { ...beneficiary, [field]: value }
          : beneficiary,
      ),
    );
  }

  function addBeneficiary() {
    setBeneficiaries((current) => [...current, createBeneficiary()]);
  }

  function removeBeneficiary(id: string) {
    setBeneficiaries((current) =>
      current.filter((beneficiary) => beneficiary.id !== id),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!banner) {
      setError("Please select a campaign banner image.");
      return;
    }

    if (!category) {
      setError("Please select a campaign category.");
      return;
    }

    if (getNumericAmount(targetAmount) <= 0) {
      setError("Your fundraising target must be greater than zero.");
      return;
    }

    if (!allocationsAreValid) {
      setError(
        "Please complete every beneficiary account and ensure allocations total exactly 100%.",
      );
      return;
    }

    const allowedImageTypes: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };

    const extension = allowedImageTypes[banner.type];

    if (!extension) {
      setError("Please select a JPG, PNG or WEBP image.");
      return;
    }

    if (banner.size > MAX_BANNER_SIZE) {
      setError("Your campaign banner cannot exceed 10 MB.");
      return;
    }

    try {
      setSubmitting(true);

      // Step 1: Obtain the CSRF token.
      setSubmitStatus("Verifying your session...");

      const csrfResponse = await fetch(
        `${API_BASE_URL}/api/crowdfunding/csrf/`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );

      const csrfResult: ApiErrorResponse = await csrfResponse.json();

      if (!csrfResponse.ok || !csrfResult.csrfToken) {
        throw new Error(
          "Unable to verify your session. Please refresh and try again.",
        );
      }

      const csrfToken = csrfResult.csrfToken;

      // Step 2: Request a secure R2 upload URL.
      setSubmitStatus("Preparing your campaign image...");

      const uploadUrlResponse = await fetch(
        `${API_BASE_URL}/api/crowdfunding/organization-campaigns/upload-image/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({
            extension,
            content_type: banner.type,
            file_size: banner.size,
          }),
        },
      );

      const uploadUrlResult: unknown = await uploadUrlResponse.json();

      if (!uploadUrlResponse.ok) {
        throw new Error(getErrorMessage(uploadUrlResult));
      }

      const uploadDetails = uploadUrlResult as CampaignImageUploadResponse;

      if (
        !uploadDetails.upload_url ||
        !uploadDetails.object_key ||
        !uploadDetails.required_headers
      ) {
        throw new Error(
          "The server returned an incomplete image upload response.",
        );
      }

      // Step 3: Upload the image directly to Cloudflare R2.
      setSubmitStatus("Uploading your campaign image...");

      const imageUploadResponse = await fetch(uploadDetails.upload_url, {
        method: "PUT",
        headers: uploadDetails.required_headers,
        body: banner,
      });

      if (!imageUploadResponse.ok) {
        throw new Error(
          "Your campaign image could not be uploaded. Please try again.",
        );
      }

      // Step 4: Confirm that the image was successfully uploaded.
      setSubmitStatus("Verifying your campaign image...");

      const completeUploadResponse = await fetch(
        `${API_BASE_URL}/api/crowdfunding/organization-campaigns/complete-image-upload/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({
            object_key: uploadDetails.object_key,
          }),
        },
      );

      const completeUploadResult: unknown = await completeUploadResponse.json();

      if (!completeUploadResponse.ok) {
        throw new Error(getErrorMessage(completeUploadResult));
      }

      const completedImage =
        completeUploadResult as CampaignImageCompleteResponse;

      if (!completedImage.object_key) {
        throw new Error("The server could not confirm your campaign image.");
      }

      // Step 5: Create the campaign.
      setSubmitStatus("Creating your campaign...");

      const campaignResponse = await fetch(
        `${API_BASE_URL}/api/crowdfunding/organization-campaigns/create/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({
            name: name.trim(),
            about: about.trim(),
            category,
            location: location.trim(),
            target_amount: getNumericAmount(targetAmount),
            currency: "NGN",
            disbursement_mode: disbursementMode,
            banner: completedImage.object_key,
            contact_phone: contactPhone.trim(),
            contact_address: contactAddress.trim(),

            // Requires corresponding backend serializer support.
            payout_accounts: beneficiaries.map((beneficiary) => ({
              account_name: beneficiary.account_name.trim(),
              bank_name: beneficiary.bank_name.trim(),
              account_number: beneficiary.account_number.trim(),
              allocation_percentage: Number(beneficiary.allocation_percentage),
            })),
          }),
        },
      );

      const campaignResult: unknown = await campaignResponse.json();

      if (!campaignResponse.ok) {
        throw new Error(getErrorMessage(campaignResult));
      }

      setCampaignCreated(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your campaign. Please try again.",
      );
    } finally {
      setSubmitting(false);
      setSubmitStatus("");
    }
  }

  if (campaignCreated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F7FC] px-5 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-zinc-100 bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
            <FiCheckCircle size={34} />
          </div>

          <h1 className="mt-6 text-2xl font-black text-[#190D2E]">
            Campaign created successfully!
          </h1>

          <p className="mt-3 text-sm leading-7 text-zinc-500">
            Your campaign has been saved as a draft. You can continue with the
            remaining campaign setup from your dashboard.
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-8 w-full rounded-xl bg-[#6D28D9] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#5B21B6]"
          >
            Return to dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7FC] px-5 py-8 md:px-10">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-[#6D28D9]"
        >
          <FiArrowLeft size={17} />
          Back to dashboard
        </button>

        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#6D28D9]">
            Tippified Crowdfunding
          </span>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#190D2E] md:text-4xl">
            Create your campaign
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
            Tell people about your organisation, what you are raising funds for,
            and how their contributions will make a difference.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#190D2E]">
                Campaign information
              </p>
              <p className="mt-1 text-xs text-zinc-400">Step 1 of 4</p>
            </div>

            <span className="rounded-full bg-purple-50 px-4 py-2 text-xs font-bold text-[#6D28D9]">
              Organisation campaign
            </span>
          </div>

          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full w-1/4 rounded-full bg-[#6D28D9]" />
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <section>
              <h2 className="text-lg font-bold text-[#190D2E]">
                Basic information
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Give your campaign a clear identity.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Campaign name *
                  </label>

                  <input
                    type="text"
                    required
                    maxLength={255}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your campaign name"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Campaign story *
                  </label>

                  <textarea
                    required
                    rows={7}
                    value={about}
                    onChange={(event) => setAbout(event.target.value)}
                    placeholder="Explain what you are raising funds for, why it matters, and how the money will be used."
                    className="w-full resize-y rounded-xl border border-zinc-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100"
                  />

                  <p className="mt-2 text-xs text-zinc-400">
                    Make your story clear, informative and easy for supporters
                    to understand.
                  </p>
                </div>

                <div ref={dropdownRef} className="relative">
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Campaign category *
                  </label>

                  <button
                    type="button"
                    disabled={loadingCategories || categories.length === 0}
                    onClick={() =>
                      setActiveDropdown((current) =>
                        current === "category" ? null : "category",
                      )
                    }
                    className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm outline-none transition hover:border-[#6D28D9] focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-zinc-50"
                  >
                    <span
                      className={
                        selectedCategory
                          ? "font-medium text-zinc-800"
                          : "text-zinc-400"
                      }
                    >
                      {loadingCategories
                        ? "Loading categories..."
                        : (selectedCategory?.name ?? "Select a category")}
                    </span>

                    <FiChevronDown
                      size={18}
                      className={`text-zinc-400 transition ${
                        activeDropdown === "category" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === "category" && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-zinc-100 bg-white p-2 shadow-xl">
                      {categories.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => {
                            setCategory(String(item.id));
                            setActiveDropdown(null);
                          }}
                          className={`w-full rounded-lg px-4 py-3 text-left text-sm transition hover:bg-purple-50 hover:text-[#6D28D9] ${
                            category === String(item.id)
                              ? "bg-purple-50 font-bold text-[#6D28D9]"
                              : "text-zinc-700"
                          }`}
                        >
                          <span className="block">{item.name}</span>

                          {item.description && (
                            <span className="mt-1 block text-xs font-normal text-zinc-400">
                              {item.description}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {categoryError && (
                    <div className="mt-2">
                      <p className="text-xs text-red-600">{categoryError}</p>

                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-1 text-xs font-bold text-[#6D28D9]"
                      >
                        Try again
                      </button>
                    </div>
                  )}

                  {!loadingCategories &&
                    !categoryError &&
                    categories.length === 0 && (
                      <p className="mt-2 text-xs text-zinc-500">
                        No campaign categories are currently available.
                      </p>
                    )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Campaign location
                  </label>

                  <input
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="City, state or country"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>
            </section>

            <section className="border-t border-zinc-100 pt-8">
              <h2 className="text-lg font-bold text-[#190D2E]">
                Fundraising target
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Set the amount your organisation wants to raise.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Target amount *
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-zinc-200 transition focus-within:border-[#6D28D9] focus-within:ring-2 focus-within:ring-purple-100">
                    <span className="flex items-center border-r border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-500">
                      ₦
                    </span>

                    <input
                      type="text"
                      inputMode="decimal"
                      required
                      value={targetAmount}
                      onChange={(event) =>
                        setTargetAmount(formatAmount(event.target.value))
                      }
                      placeholder="5,000,000"
                      className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                    />
                  </div>

                  <p className="mt-2 text-xs text-zinc-400">
                    Amounts are automatically formatted with commas.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Currency *
                  </label>

                  <div className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
                    <span className="font-semibold text-zinc-800">
                      NGN — Nigerian Naira
                    </span>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                      Fixed
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-zinc-400">
                    All campaigns currently raise funds in Nigerian Naira.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-zinc-100 pt-8">
              <h2 className="text-lg font-bold text-[#190D2E]">
                Disbursement arrangement
              </h2>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                Choose how contributions to this campaign will be settled. This
                selection will be locked once the campaign is created.
              </p>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-zinc-700">
                  Disbursement method *
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveDropdown((current) =>
                        current === "disbursement" ? null : "disbursement",
                      )
                    }
                    className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm transition hover:border-[#6D28D9] focus:border-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-purple-100"
                  >
                    <span className="font-semibold text-zinc-800">
                      {selectedDisbursement?.label}
                    </span>

                    <FiChevronDown
                      size={18}
                      className={`text-zinc-400 transition ${
                        activeDropdown === "disbursement" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === "disbursement" && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-zinc-100 bg-white p-2 shadow-xl">
                      {DISBURSEMENT_OPTIONS.map((option) => (
                        <button
                          type="button"
                          key={option.value}
                          onClick={() => {
                            setDisbursementMode(option.value);
                            setActiveDropdown(null);
                          }}
                          className={`w-full rounded-lg p-4 text-left transition hover:bg-purple-50 ${
                            disbursementMode === option.value
                              ? "bg-purple-50"
                              : ""
                          }`}
                        >
                          <span className="block text-sm font-bold text-[#190D2E]">
                            {option.label}
                          </span>

                          <span className="mt-1 block text-xs leading-5 text-zinc-500">
                            {option.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50/70 p-4">
                  <p className="text-sm font-bold text-[#6D28D9]">
                    {selectedDisbursement?.label}
                  </p>

                  <p className="mt-1 text-xs leading-6 text-zinc-600">
                    {selectedDisbursement?.description}
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-zinc-100 pt-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#190D2E]">
                    Beneficiary bank accounts
                  </h2>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-500">
                    Add the bank accounts that should receive campaign proceeds
                    and specify the percentage allocated to each.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addBeneficiary}
                  className="flex items-center gap-2 rounded-xl border border-purple-200 px-4 py-2.5 text-xs font-bold text-[#6D28D9] transition hover:bg-purple-50"
                >
                  <FiPlus size={15} />
                  Add beneficiary
                </button>
              </div>

              <div className="mt-6 space-y-5">
                {beneficiaries.map((beneficiary, index) => (
                  <div
                    key={beneficiary.id}
                    className="rounded-2xl border border-zinc-200 p-5 md:p-6"
                  >
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-[#190D2E]">
                          Beneficiary {index + 1}
                        </h3>

                        <p className="mt-1 text-xs text-zinc-400">
                          Enter the beneficiary&apos;s bank details.
                        </p>
                      </div>

                      {beneficiaries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBeneficiary(beneficiary.id)}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          <FiTrash2 size={14} />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-zinc-700">
                          Account name *
                        </label>

                        <input
                          type="text"
                          required
                          value={beneficiary.account_name}
                          onChange={(event) =>
                            updateBeneficiary(
                              beneficiary.id,
                              "account_name",
                              event.target.value,
                            )
                          }
                          placeholder="Name registered with the bank"
                          className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-zinc-700">
                          Bank name *
                        </label>

                        <input
                          type="text"
                          required
                          value={beneficiary.bank_name}
                          onChange={(event) =>
                            updateBeneficiary(
                              beneficiary.id,
                              "bank_name",
                              event.target.value,
                            )
                          }
                          placeholder="Enter bank name"
                          className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-zinc-700">
                          Account number *
                        </label>

                        <input
                          type="text"
                          inputMode="numeric"
                          required
                          maxLength={10}
                          value={beneficiary.account_number}
                          onChange={(event) =>
                            updateBeneficiary(
                              beneficiary.id,
                              "account_number",
                              event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10),
                            )
                          }
                          placeholder="10-digit account number"
                          className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-zinc-700">
                          Allocation percentage *
                        </label>

                        <div className="flex overflow-hidden rounded-xl border border-zinc-200 transition focus-within:border-[#6D28D9] focus-within:ring-2 focus-within:ring-purple-100">
                          <input
                            type="number"
                            required
                            min="0.01"
                            max="100"
                            step="0.01"
                            value={beneficiary.allocation_percentage}
                            onChange={(event) =>
                              updateBeneficiary(
                                beneficiary.id,
                                "allocation_percentage",
                                event.target.value,
                              )
                            }
                            placeholder="e.g. 60"
                            className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                          />

                          <span className="flex items-center border-l border-zinc-200 bg-zinc-50 px-4 text-sm font-bold text-zinc-500">
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-zinc-50 p-4">
                <div>
                  <p className="text-sm font-bold text-[#190D2E]">
                    Total allocation
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    All beneficiary allocations must add up to 100%.
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-black ${
                    Math.abs(totalAllocation - 100) < 0.001
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {totalAllocation.toFixed(2)}%
                </span>
              </div>

              {beneficiaries.length > 0 &&
                Math.abs(totalAllocation - 100) >= 0.001 && (
                  <p className="mt-2 text-xs text-amber-700">
                    Your allocations must total exactly 100% before you can
                    create this campaign.
                  </p>
                )}
            </section>

            <section className="border-t border-zinc-100 pt-8">
              <h2 className="text-lg font-bold text-[#190D2E]">
                Campaign banner
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Choose an image that represents your fundraising campaign.
              </p>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-zinc-700">
                  Upload banner image *
                </label>

                <input
                  type="file"
                  required
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    setBanner(event.target.files?.[0] ?? null)
                  }
                  className="block w-full cursor-pointer rounded-xl border border-zinc-200 text-sm text-zinc-600 file:mr-4 file:cursor-pointer file:border-0 file:bg-purple-50 file:px-5 file:py-3 file:text-sm file:font-bold file:text-[#6D28D9] hover:file:bg-purple-100"
                />

                {banner && (
                  <p className="mt-2 text-xs text-green-600">
                    Selected: {banner.name} (
                    {(banner.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}

                <p className="mt-2 text-xs text-zinc-400">
                  JPG, PNG or WEBP. Maximum file size: 10 MB.
                </p>
              </div>
            </section>

            <section className="border-t border-zinc-100 pt-8">
              <h2 className="text-lg font-bold text-[#190D2E]">
                Contact information
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Provide contact details for this campaign.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Contact phone *
                  </label>

                  <input
                    type="tel"
                    required
                    maxLength={30}
                    value={contactPhone}
                    onChange={(event) => setContactPhone(event.target.value)}
                    placeholder="Enter a contact phone number"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Contact address *
                  </label>

                  <textarea
                    required
                    rows={3}
                    value={contactAddress}
                    onChange={(event) => setContactAddress(event.target.value)}
                    placeholder="Enter your organisation's contact address"
                    className="w-full resize-y rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>
            </section>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}

            {submitting && submitStatus && (
              <p role="status" className="text-sm font-semibold text-[#6D28D9]">
                {submitStatus}
              </p>
            )}

            <div className="flex flex-col-reverse justify-between gap-4 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center">
              <p className="text-xs leading-5 text-zinc-400">
                Your campaign will initially be saved as a draft.
              </p>

              <button
                type="submit"
                disabled={
                  submitting ||
                  loadingCategories ||
                  categories.length === 0 ||
                  !allocationsAreValid
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Please wait..." : "Create campaign"}
                {!submitting && <FiArrowRight size={16} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
