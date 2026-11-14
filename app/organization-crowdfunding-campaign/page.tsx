"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiChevronDown,
  FiCreditCard,
  FiLock,
  FiPlus,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUpload,
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

interface CampaignBank {
  id: number | null;
  name: string;
  code: string;
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

type BeneficiaryType = "owner" | "individual" | "organization" | "other";

type AccountResolutionStatus =
  | "idle"
  | "resolving"
  | "resolved"
  | "verified"
  | "error";

interface BeneficiaryAccount {
  id: string;
  beneficiary_type: BeneficiaryType;
  beneficiary_name: string;
  account_name: string;
  resolved_account_name: string;
  bank_name: string;
  bank_code: string;
  account_number: string;
  allocation_percentage: string;
  resolution_status: AccountResolutionStatus;
  resolution_message: string;
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

// ---------- Original palette only: #F8F7FC, #190D2E, #6D28D9 / #5B21B6, zinc, purple-50/100, green, red, amber ----------
// All inputs are text-base (16px) — this is what stops iOS Safari auto-zoom.
const INPUT_CLASS =
  "w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-base text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition placeholder:font-normal focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400";

const TEXTAREA_CLASS =
  "w-full resize-y rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-base leading-7 text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100";

const SELECT_CLASS =
  "w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-base text-zinc-900 shadow-sm outline-none transition focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100";

const DROPDOWN_BUTTON_CLASS =
  "flex w-full items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-left text-base text-zinc-900 shadow-sm outline-none transition hover:border-[#6D28D9] focus:border-[#6D28D9] focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-zinc-50";

const LABEL_CLASS =
  "mb-2 flex items-center justify-between text-sm font-semibold text-zinc-700";

function getErrorMessage(payload: unknown): string {
  if (typeof payload !== "object" || payload === null) {
    return "Something went wrong. Please try again.";
  }
  const data = payload as Record<string, unknown>;
  for (const key of ["detail", "error", "message"]) {
    const value = data[key];
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.join(" ");
  }
  const fieldErrors = Object.entries(data)
    .filter(([, value]) => Array.isArray(value))
    .map(([field, value]) => {
      const messages = (value as unknown[]).filter(
        (item): item is string => typeof item === "string",
      );
      return `${field}: ${messages.join(" ")}`;
    });
  if (fieldErrors.length > 0) return fieldErrors.join(" ");
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
    beneficiary_type: "organization",
    beneficiary_name: "",
    account_name: "",
    resolved_account_name: "",
    bank_name: "",
    bank_code: "",
    account_number: "",
    allocation_percentage: "",
    resolution_status: "idle",
    resolution_message: "",
  };
}

function extractCategories(result: unknown): CampaignCategory[] {
  if (Array.isArray(result)) return result as CampaignCategory[];
  if (typeof result !== "object" || result === null) return [];
  const data = result as Record<string, unknown>;
  const possibleLists = [data.data, data.results, data.categories];
  for (const list of possibleLists) {
    if (Array.isArray(list)) return list as CampaignCategory[];
  }
  return [];
}

export default function OrganizationCrowdfundingCampaignPage() {
  const router = useRouter();

  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);
  const disbursementDropdownRef = useRef<HTMLDivElement | null>(null);
  const bankDropdownRef = useRef<HTMLDivElement | null>(null);

  const [categories, setCategories] = useState<CampaignCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const [banks, setBanks] = useState<CampaignBank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [bankError, setBankError] = useState("");
  const [showCampaignLimitModal, setShowCampaignLimitModal] = useState(false);
  const [campaignLimitMessage, setCampaignLimitMessage] = useState("");

  const [activeDropdown, setActiveDropdown] = useState<
    "category" | "disbursement" | null
  >(null);
  const [activeBankDropdown, setActiveBankDropdown] = useState<string | null>(
    null,
  );
  const [bankSearch, setBankSearch] = useState("");

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
        beneficiary.beneficiary_name.trim() !== "" &&
        beneficiary.account_name.trim() !== "" &&
        beneficiary.bank_name.trim() !== "" &&
        beneficiary.bank_code.trim() !== "" &&
        /^\d{10}$/.test(beneficiary.account_number) &&
        beneficiary.resolution_status === "verified" &&
        Number(beneficiary.allocation_percentage) > 0,
    ) &&
    Math.abs(totalAllocation - 100) < 0.001;

  const bannerPreview = useMemo(() => {
    if (!banner) return null;
    return URL.createObjectURL(banner);
  }, [banner]);

  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [bannerPreview]);

  // Load campaign categories.
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
            headers: { Accept: "application/json" },
            cache: "no-store",
          },
        );
        const result: unknown = await response.json();
        if (!response.ok) throw new Error(getErrorMessage(result));
        const categoryList = extractCategories(result);
        if (!cancelled) setCategories(categoryList);
      } catch (err) {
        if (!cancelled) {
          setCategoryError(
            err instanceof Error
              ? err.message
              : "Unable to load campaign categories.",
          );
        }
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    }
    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load Nigerian banks from Paystack through the backend.
  useEffect(() => {
    let cancelled = false;
    async function loadBanks() {
      try {
        setLoadingBanks(true);
        setBankError("");
        const response = await fetch(
          `${API_BASE_URL}/api/crowdfunding/banks/`,
          {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            cache: "no-store",
          },
        );
        const result: unknown = await response.json();
        if (!response.ok) throw new Error(getErrorMessage(result));
        if (
          typeof result !== "object" ||
          result === null ||
          !("banks" in result) ||
          !Array.isArray(result.banks)
        ) {
          throw new Error("The server returned an invalid bank list.");
        }
        const bankList: CampaignBank[] = result.banks
          .filter(
            (bank): bank is Record<string, unknown> =>
              typeof bank === "object" && bank !== null,
          )
          .map((bank) => ({
            id: typeof bank.id === "number" ? bank.id : null,
            name: typeof bank.name === "string" ? bank.name : "",
            code:
              typeof bank.code === "string" || typeof bank.code === "number"
                ? String(bank.code)
                : "",
          }))
          .filter((bank) => bank.name !== "" && bank.code !== "");
        if (!cancelled) {
          setBanks(bankList);
          if (bankList.length === 0) {
            setBankError("No Nigerian banks are currently available.");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setBankError(
            err instanceof Error
              ? err.message
              : "Unable to load Nigerian banks.",
          );
        }
      } finally {
        if (!cancelled) setLoadingBanks(false);
      }
    }
    void loadBanks();
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle outside clicks without interfering with other dropdowns.
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(target)
      ) {
        setActiveDropdown((current) =>
          current === "category" ? null : current,
        );
      }
      if (
        disbursementDropdownRef.current &&
        !disbursementDropdownRef.current.contains(target)
      ) {
        setActiveDropdown((current) =>
          current === "disbursement" ? null : current,
        );
      }
      if (
        bankDropdownRef.current &&
        !bankDropdownRef.current.contains(target)
      ) {
        setActiveBankDropdown(null);
        setBankSearch("");
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Resolve a bank account through the backend.
  const resolveBeneficiaryAccount = useCallback(
    async (beneficiaryId: string, accountNumber: string, bankCode: string) => {
      setBeneficiaries((current) =>
        current.map(
          (beneficiary): BeneficiaryAccount =>
            beneficiary.id === beneficiaryId
              ? {
                  ...beneficiary,
                  account_name: "",
                  resolved_account_name: "",
                  resolution_status: "resolving",
                  resolution_message: "Checking account details...",
                }
              : beneficiary,
        ),
      );
      try {
        const csrfResponse = await fetch(
          `${API_BASE_URL}/api/crowdfunding/csrf/`,
          {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            cache: "no-store",
          },
        );
        const csrfResult: unknown = await csrfResponse.json();
        if (
          !csrfResponse.ok ||
          typeof csrfResult !== "object" ||
          csrfResult === null ||
          !("csrfToken" in csrfResult) ||
          typeof csrfResult.csrfToken !== "string"
        ) {
          throw new Error("Unable to verify your session. Please try again.");
        }
        const response = await fetch(
          `${API_BASE_URL}/api/crowdfunding/resolve-bank-account/`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-CSRFToken": csrfResult.csrfToken,
            },
            body: JSON.stringify({
              account_number: accountNumber,
              bank_code: bankCode,
            }),
          },
        );
        const result: unknown = await response.json();
        if (!response.ok) throw new Error(getErrorMessage(result));
        if (
          typeof result !== "object" ||
          result === null ||
          !("account_name" in result) ||
          typeof result.account_name !== "string" ||
          !result.account_name.trim()
        ) {
          throw new Error("Paystack could not resolve this account.");
        }
        const resolvedName = result.account_name.trim();
        setBeneficiaries((current) =>
          current.map(
            (beneficiary): BeneficiaryAccount =>
              beneficiary.id === beneficiaryId &&
              beneficiary.account_number === accountNumber &&
              beneficiary.bank_code === bankCode
                ? {
                    ...beneficiary,
                    resolved_account_name: resolvedName,
                    resolution_status: "resolved",
                    resolution_message:
                      "We found an account name. Please confirm it below.",
                  }
                : beneficiary,
          ),
        );
      } catch (err) {
        setBeneficiaries((current) =>
          current.map(
            (beneficiary): BeneficiaryAccount =>
              beneficiary.id === beneficiaryId &&
              beneficiary.account_number === accountNumber &&
              beneficiary.bank_code === bankCode
                ? {
                    ...beneficiary,
                    account_name: "",
                    resolved_account_name: "",
                    resolution_status: "error",
                    resolution_message:
                      err instanceof Error
                        ? err.message
                        : "Unable to verify this account.",
                  }
                : beneficiary,
          ),
        );
      }
    },
    [],
  );

  // Automatically resolve after the user enters a complete account number.
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    beneficiaries.forEach((beneficiary) => {
      if (
        !beneficiary.bank_code ||
        !/^\d{10}$/.test(beneficiary.account_number) ||
        beneficiary.resolution_status !== "idle"
      ) {
        return;
      }
      const timer = setTimeout(() => {
        void resolveBeneficiaryAccount(
          beneficiary.id,
          beneficiary.account_number,
          beneficiary.bank_code,
        );
      }, 600);
      timers.push(timer);
    });
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [beneficiaries, resolveBeneficiaryAccount]);

  function updateBeneficiary(
    id: string,
    field: keyof Omit<BeneficiaryAccount, "id">,
    value: string,
  ) {
    // Account name is NEVER manually editable — it comes only from Paystack.
    if (field === "account_name" || field === "resolved_account_name") return;

    setBeneficiaries((current) =>
      current.map((beneficiary): BeneficiaryAccount => {
        if (beneficiary.id !== id) return beneficiary;

        if (field === "bank_code") {
          const selectedBank = banks.find((bank) => bank.code === value);
          return {
            ...beneficiary,
            bank_code: value,
            bank_name: selectedBank?.name ?? "",
            account_name: "",
            resolved_account_name: "",
            resolution_status: "idle",
            resolution_message: "",
          };
        }
        if (field === "account_number") {
          return {
            ...beneficiary,
            account_number: value,
            account_name: "",
            resolved_account_name: "",
            resolution_status: "idle",
            resolution_message: "",
          };
        }
        if (field === "beneficiary_type") {
          return {
            ...beneficiary,
            beneficiary_type: value as BeneficiaryType,
          };
        }
        if (field === "resolution_status") {
          return {
            ...beneficiary,
            resolution_status: value as AccountResolutionStatus,
          };
        }
        // Remaining fields are all plain strings:
        // beneficiary_name, bank_name, allocation_percentage, resolution_message
        return {
          ...beneficiary,
          [field]: value,
        } as BeneficiaryAccount;
      }),
    );
  }

  function selectBeneficiaryBank(beneficiaryId: string, bank: CampaignBank) {
    updateBeneficiary(beneficiaryId, "bank_code", bank.code);
    setActiveBankDropdown(null);
    setBankSearch("");
  }

  function confirmResolvedAccount(beneficiaryId: string) {
    setBeneficiaries((current) =>
      current.map(
        (beneficiary): BeneficiaryAccount =>
          beneficiary.id === beneficiaryId &&
          beneficiary.resolution_status === "resolved"
            ? {
                ...beneficiary,
                account_name: beneficiary.resolved_account_name,
                resolution_status: "verified",
                resolution_message: "Account name confirmed.",
              }
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
    // Check whether the organisation can create another campaign
    try {
      const eligibilityResponse = await fetch(
        `${API_BASE_URL}/api/crowdfunding/subscription/`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const eligibilityData = await eligibilityResponse.json();

      if (!eligibilityResponse.ok || !eligibilityData.success) {
        alert(
          eligibilityData.error ||
            "Unable to verify your campaign eligibility. Please try again.",
        );
        return;
      }

      const eligibility = eligibilityData.campaign_eligibility;

      if (!eligibility?.can_create_campaign) {
        setCampaignLimitMessage(
          `You have reached your campaign limit of ${eligibility?.campaign_limit} campaigns on your ${eligibilityData.subscription?.plan?.toUpperCase() || "FREE"} plan.`,
        );

        setShowCampaignLimitModal(true);
        return;
      }
    } catch (error) {
      console.error("Campaign eligibility check failed:", error);
      alert("Unable to verify your campaign eligibility. Please try again.");
      return;
    }
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
        "Please complete every beneficiary account, confirm each resolved account name and ensure allocations total exactly 100%.",
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
      setSubmitStatus("Verifying your session...");
      const csrfResponse = await fetch(
        `${API_BASE_URL}/api/crowdfunding/csrf/`,
        {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
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
      if (!uploadUrlResponse.ok)
        throw new Error(getErrorMessage(uploadUrlResult));
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
          body: JSON.stringify({ object_key: uploadDetails.object_key }),
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
            payout_accounts: beneficiaries.map((beneficiary) => ({
              beneficiary_type: beneficiary.beneficiary_type,
              beneficiary_name: beneficiary.beneficiary_name.trim(),
              account_name: beneficiary.account_name.trim(),
              bank_name: beneficiary.bank_name.trim(),
              bank_code: beneficiary.bank_code,
              account_number: beneficiary.account_number,
              currency: "NGN",
              country: "NG",
              allocation_percentage: Number(beneficiary.allocation_percentage),
            })),
          }),
        },
      );
      const campaignResult: unknown = await campaignResponse.json();
      if (!campaignResponse.ok)
        throw new Error(getErrorMessage(campaignResult));
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
        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-100 bg-white text-center shadow-sm">
          <div className="bg-[#190D2E] px-8 pb-8 pt-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
              <FiCheckCircle size={32} className="text-green-300" />
            </div>
            <h1 className="mt-5 text-2xl font-black tracking-tight text-white">
              Campaign created
            </h1>
            <p className="mt-2 text-base leading-7 text-white/70">
              Your campaign has been saved as a draft. Continue the remaining
              setup from your dashboard.
            </p>
          </div>
          <div className="p-6 md:p-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full rounded-xl bg-[#6D28D9] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#5B21B6] active:scale-[0.99]"
            >
              Return to dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7FC] px-4 py-6 antialiased sm:px-6 md:px-10 md:py-10">
      <div className="mx-auto max-w-220">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-500 shadow-sm transition hover:border-zinc-300 hover:text-[#6D28D9]"
          >
            <FiArrowLeft size={16} />
            Back to dashboard
          </button>
          <span className="hidden rounded-full bg-white px-4 py-2 text-xs font-bold text-[#6D28D9] shadow-sm ring-1 ring-purple-100 sm:block">
            Organisation campaign
          </span>
        </div>

        {/* Hero — original dark text color as background */}
        <div className="relative overflow-hidden rounded-3xl bg-[#190D2E] p-6 text-white shadow-sm md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#6D28D9]/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#6D28D9]/30 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/90 ring-1 ring-white/15">
              <FiShield size={13} />
              Tippified Crowdfunding
            </span>
            <h1 className="mt-4 text-[32px] font-black leading-[1.1] tracking-tight md:text-[40px]">
              Create your campaign
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-white/70">
              Tell people about your organisation, what you are raising funds
              for, and how their contributions will make a difference.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-1/4 rounded-full bg-white" />
              </div>
              <span className="text-xs font-bold text-white/70">
                Step 1 of 4
              </span>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="mt-6 rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm sm:p-7 md:p-9">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* BASIC INFORMATION */}
            <section>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6D28D9] text-sm font-bold text-white">
                  1
                </span>
                <div>
                  <h2 className="text-lg font-bold text-[#190D2E]">
                    Basic information
                  </h2>
                  <p className="mt-0.5 text-sm leading-6 text-zinc-500">
                    Give your campaign a clear identity.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="campaign-name" className={LABEL_CLASS}>
                    <span>Campaign name *</span>
                    <span className="text-xs font-medium text-zinc-400">
                      {name.length}/255
                    </span>
                  </label>
                  <input
                    id="campaign-name"
                    type="text"
                    autoComplete="organization"
                    required
                    maxLength={255}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your campaign name"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label htmlFor="campaign-story" className={LABEL_CLASS}>
                    <span>Campaign story *</span>
                  </label>
                  <textarea
                    id="campaign-story"
                    required
                    rows={6}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Explain what you are raising funds for, why it matters, and how the money will be used."
                    className={TEXTAREA_CLASS}
                  />
                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    Make your story clear, informative and easy for supporters
                    to understand.
                  </p>
                </div>

                {/* CATEGORY */}
                <div ref={categoryDropdownRef} className="relative">
                  <label className={LABEL_CLASS}>
                    <span>Campaign category *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveDropdown((c) =>
                        c === "category" ? null : "category",
                      )
                    }
                    className={DROPDOWN_BUTTON_CLASS}
                  >
                    <span
                      className={
                        selectedCategory
                          ? "font-semibold text-zinc-800"
                          : "text-zinc-400"
                      }
                    >
                      {loadingCategories
                        ? "Loading categories..."
                        : (selectedCategory?.name ?? "Select a category")}
                    </span>
                    <FiChevronDown
                      size={18}
                      className={`shrink-0 text-zinc-400 transition ${
                        activeDropdown === "category" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeDropdown === "category" && (
                    <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-72 overflow-y-auto rounded-xl border border-zinc-100 bg-white p-2 shadow-xl">
                      {categories.length === 0 ? (
                        <p className="px-3 py-5 text-center text-base text-zinc-400">
                          {loadingCategories
                            ? "Loading..."
                            : "No categories available."}
                        </p>
                      ) : (
                        categories.map((item) => (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => {
                              setCategory(String(item.id));
                              setActiveDropdown(null);
                            }}
                            className={`w-full rounded-lg px-4 py-3.5 text-left text-base transition hover:bg-purple-50 hover:text-[#6D28D9] ${
                              category === String(item.id)
                                ? "bg-purple-50 font-bold text-[#6D28D9]"
                                : "text-zinc-700"
                            }`}
                          >
                            <span className="block font-semibold">
                              {item.name}
                            </span>
                            {item.description && (
                              <span className="mt-0.5 block text-sm font-normal leading-5 text-zinc-400">
                                {item.description}
                              </span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                  {categoryError && (
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-sm text-red-600">{categoryError}</p>
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="text-sm font-bold text-[#6D28D9]"
                      >
                        Try again
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="campaign-location" className={LABEL_CLASS}>
                    <span>Campaign location</span>
                  </label>
                  <input
                    id="campaign-location"
                    type="text"
                    autoComplete="address-level2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, state or country"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
            </section>

            {/* TARGET */}
            <section className="border-t border-zinc-100 pt-8">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6D28D9] text-sm font-bold text-white">
                  2
                </span>
                <div>
                  <h2 className="text-lg font-bold text-[#190D2E]">
                    Fundraising target
                  </h2>
                  <p className="mt-0.5 text-sm leading-6 text-zinc-500">
                    Set the amount your organisation wants to raise.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="target-amount" className={LABEL_CLASS}>
                    <span>Target amount *</span>
                  </label>
                  <div className="flex overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition focus-within:border-[#6D28D9] focus-within:ring-2 focus-within:ring-purple-100">
                    <span className="flex items-center border-r border-zinc-200 bg-zinc-50 px-4 text-base font-bold text-zinc-500">
                      ₦
                    </span>
                    <input
                      id="target-amount"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      required
                      value={targetAmount}
                      onChange={(e) =>
                        setTargetAmount(formatAmount(e.target.value))
                      }
                      placeholder="5,000,000"
                      className="min-w-0 flex-1 px-4 py-3.5 text-base text-zinc-900 outline-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>
                <div>
                  <span className={LABEL_CLASS}>
                    <span>Currency *</span>
                  </span>
                  <div className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base">
                    <span className="font-semibold text-zinc-800">
                      NGN — Nigerian Naira
                    </span>
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                      Fixed
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* DISBURSEMENT */}
            <section className="border-t border-zinc-100 pt-8">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6D28D9] text-sm font-bold text-white">
                  3
                </span>
                <div>
                  <h2 className="text-lg font-bold text-[#190D2E]">
                    Disbursement arrangement
                  </h2>
                  <p className="mt-0.5 text-sm leading-6 text-zinc-500">
                    Choose how contributions will be settled. This will be
                    locked once the campaign is created.
                  </p>
                </div>
              </div>

              <div ref={disbursementDropdownRef} className="relative mt-6">
                <label className={LABEL_CLASS}>
                  <span>Disbursement method *</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveBankDropdown(null);
                    setActiveDropdown((c) =>
                      c === "disbursement" ? null : "disbursement",
                    );
                  }}
                  className={DROPDOWN_BUTTON_CLASS}
                >
                  <span className="font-semibold text-zinc-800">
                    {selectedDisbursement?.label}
                  </span>
                  <FiChevronDown
                    size={18}
                    className={`shrink-0 text-zinc-400 transition ${
                      activeDropdown === "disbursement" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeDropdown === "disbursement" && (
                  <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-xl border border-zinc-100 bg-white p-2 shadow-xl">
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
                        <span className="block text-base font-bold text-[#190D2E]">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-zinc-500">
                          {option.description}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-3 rounded-xl border border-purple-100 bg-purple-50/70 p-4">
                <FiShield
                  className="mt-0.5 shrink-0 text-[#6D28D9]"
                  size={18}
                />
                <div>
                  <p className="text-base font-bold text-[#6D28D9]">
                    {selectedDisbursement?.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    {selectedDisbursement?.description}
                  </p>
                </div>
              </div>
            </section>

            {/* BENEFICIARIES */}
            <section className="border-t border-zinc-100 pt-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6D28D9] text-sm font-bold text-white">
                    4
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-[#190D2E]">
                      Beneficiary bank accounts
                    </h2>
                    <p className="mt-0.5 max-w-xl text-sm leading-6 text-zinc-500">
                      Select a bank, enter the account number — we fetch the
                      account name for you.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addBeneficiary}
                  className="flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-bold text-[#6D28D9] shadow-sm transition hover:bg-purple-50"
                >
                  <FiPlus size={15} />
                  Add beneficiary
                </button>
              </div>

              {bankError && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="text-base text-red-700">{bankError}</p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm font-bold text-[#6D28D9]"
                  >
                    Try again
                  </button>
                </div>
              )}

              <div className="mt-6 space-y-5">
                {beneficiaries.map((beneficiary, index) => {
                  const filteredBanks = banks.filter((bank) =>
                    bank.name
                      .toLowerCase()
                      .includes(bankSearch.trim().toLowerCase()),
                  );
                  const displayAccountName =
                    beneficiary.account_name ||
                    beneficiary.resolved_account_name;
                  const isVerified =
                    beneficiary.resolution_status === "verified";

                  return (
                    <div
                      key={beneficiary.id}
                      className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 bg-[#F8F7FC] px-5 py-4 md:px-6">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#190D2E] text-sm font-bold text-white">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="text-base font-bold text-[#190D2E]">
                              Beneficiary {index + 1}
                            </h3>
                            <p className="text-xs text-zinc-400">
                              Provide the beneficiary&apos;s bank details.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isVerified ? (
                            <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                              Pending verification
                            </span>
                          )}
                          {beneficiaries.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBeneficiary(beneficiary.id)}
                              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                            >
                              <FiTrash2 size={14} />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-5 md:p-6">
                        <div className="grid gap-5 md:grid-cols-2">
                          <div>
                            <label className={LABEL_CLASS}>
                              <span>Beneficiary type *</span>
                            </label>
                            <div className="relative">
                              <select
                                required
                                value={beneficiary.beneficiary_type}
                                onChange={(e) =>
                                  updateBeneficiary(
                                    beneficiary.id,
                                    "beneficiary_type",
                                    e.target.value,
                                  )
                                }
                                className={`${SELECT_CLASS} pr-10`}
                              >
                                <option value="owner">Account Owner</option>
                                <option value="individual">
                                  Represented Individual
                                </option>
                                <option value="organization">
                                  Organization
                                </option>
                                <option value="other">Other Beneficiary</option>
                              </select>
                              <FiChevronDown
                                size={18}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                              />
                            </div>
                          </div>

                          <div>
                            <label className={LABEL_CLASS}>
                              <span>Beneficiary name *</span>
                            </label>
                            <input
                              type="text"
                              autoComplete="name"
                              required
                              maxLength={255}
                              value={beneficiary.beneficiary_name}
                              onChange={(e) =>
                                updateBeneficiary(
                                  beneficiary.id,
                                  "beneficiary_name",
                                  e.target.value,
                                )
                              }
                              placeholder="Name of the beneficiary"
                              className={INPUT_CLASS}
                            />
                          </div>

                          {/* BANK */}
                          <div
                            ref={
                              activeBankDropdown === beneficiary.id
                                ? bankDropdownRef
                                : null
                            }
                            className="relative"
                          >
                            <label className={LABEL_CLASS}>
                              <span>Select bank *</span>
                            </label>
                            <button
                              type="button"
                              disabled={loadingBanks || banks.length === 0}
                              onClick={() => {
                                setActiveDropdown(null);
                                setBankSearch("");
                                setActiveBankDropdown((current) =>
                                  current === beneficiary.id
                                    ? null
                                    : beneficiary.id,
                                );
                              }}
                              className={DROPDOWN_BUTTON_CLASS}
                            >
                              <span
                                className={
                                  beneficiary.bank_name
                                    ? "font-semibold text-zinc-800"
                                    : "text-zinc-400"
                                }
                              >
                                {loadingBanks
                                  ? "Loading banks..."
                                  : beneficiary.bank_name || "Choose a bank"}
                              </span>
                              <FiChevronDown
                                size={18}
                                className={`shrink-0 text-zinc-400 transition ${
                                  activeBankDropdown === beneficiary.id
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>
                            {activeBankDropdown === beneficiary.id && (
                              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-xl">
                                <div className="border-b border-zinc-100 p-3">
                                  <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3">
                                    <FiSearch
                                      size={16}
                                      className="shrink-0 text-zinc-400"
                                    />
                                    <input
                                      type="text"
                                      inputMode="search"
                                      autoComplete="off"
                                      value={bankSearch}
                                      onChange={(e) =>
                                        setBankSearch(e.target.value)
                                      }
                                      placeholder="Search for a bank..."
                                      className="w-full border-0 py-3.5 text-base outline-none placeholder:text-zinc-400 focus:ring-0"
                                    />
                                  </div>
                                </div>
                                <div className="max-h-64 overflow-y-auto p-2">
                                  {filteredBanks.length > 0 ? (
                                    filteredBanks.map((bank) => (
                                      <button
                                        type="button"
                                        key={`${bank.code}-${bank.id}`}
                                        onClick={() =>
                                          selectBeneficiaryBank(
                                            beneficiary.id,
                                            bank,
                                          )
                                        }
                                        className={`w-full rounded-lg px-3 py-3.5 text-left text-base transition hover:bg-purple-50 hover:text-[#6D28D9] ${
                                          beneficiary.bank_code === bank.code
                                            ? "bg-purple-50 font-bold text-[#6D28D9]"
                                            : "text-zinc-700"
                                        }`}
                                      >
                                        {bank.name}
                                      </button>
                                    ))
                                  ) : (
                                    <p className="px-3 py-6 text-center text-base text-zinc-400">
                                      No matching bank found.
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* ACCOUNT NUMBER */}
                          <div>
                            <label className={LABEL_CLASS}>
                              <span>Account number *</span>
                              <span className="text-xs font-medium text-zinc-400">
                                {beneficiary.account_number.length}/10
                              </span>
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              autoComplete="off"
                              required
                              maxLength={10}
                              value={beneficiary.account_number}
                              onChange={(e) =>
                                updateBeneficiary(
                                  beneficiary.id,
                                  "account_number",
                                  e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 10),
                                )
                              }
                              placeholder="Enter 10-digit account number"
                              className={INPUT_CLASS}
                            />
                            {beneficiary.account_number.length > 0 &&
                              beneficiary.account_number.length < 10 && (
                                <p className="mt-2 text-xs text-zinc-400">
                                  Enter all 10 digits to verify the account.
                                </p>
                              )}
                          </div>

                          {/* ACCOUNT NAME — LOCKED / AUTO-FILLED */}
                          <div className="md:col-span-2">
                            <label className={LABEL_CLASS}>
                              <span>Account name *</span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-bold text-zinc-600">
                                <FiLock size={11} />
                                Auto-filled • Not editable
                              </span>
                            </label>
                            {/* Read-only display — NOT an input */}
                            <div
                              aria-live="polite"
                              className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-base ${
                                isVerified
                                  ? "border-green-100 bg-green-50 text-zinc-900"
                                  : displayAccountName
                                    ? "border-zinc-200 bg-zinc-50 text-zinc-900"
                                    : "border-zinc-200 bg-[#F8F7FC] text-zinc-400"
                              }`}
                            >
                              <FiCreditCard
                                size={18}
                                className={`shrink-0 ${
                                  isVerified
                                    ? "text-green-600"
                                    : "text-zinc-400"
                                }`}
                              />
                              <span className="flex-1 truncate font-semibold">
                                {displayAccountName ||
                                  "Will appear automatically after verification"}
                              </span>
                              {isVerified && (
                                <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-600 px-2.5 py-1 text-xs font-bold text-white">
                                  <FiCheckCircle size={13} />
                                  Confirmed
                                </span>
                              )}
                              {!isVerified && displayAccountName && (
                                <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                                  Awaiting confirmation
                                </span>
                              )}
                            </div>
                            <p className="mt-2 text-xs leading-5 text-zinc-400">
                              This name is fetched from your bank once you enter
                              a valid bank + account number. It cannot be typed
                              manually.
                            </p>
                          </div>
                        </div>

                        {/* RESOLUTION STATES */}
                        {beneficiary.resolution_status === "resolving" && (
                          <div className="mt-5 flex items-center gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4">
                            <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-purple-200 border-t-[#6D28D9]" />
                            <p className="text-base font-medium text-[#6D28D9]">
                              Checking account details with Paystack...
                            </p>
                          </div>
                        )}

                        {beneficiary.resolution_status === "resolved" && (
                          <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4 md:p-5">
                            <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                              Account name found
                            </p>
                            <p className="mt-2 text-base font-bold text-zinc-900">
                              {beneficiary.resolved_account_name}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-zinc-500">
                              Does this match the intended beneficiary&apos;s
                              bank account?
                            </p>
                            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                              <button
                                type="button"
                                onClick={() =>
                                  confirmResolvedAccount(beneficiary.id)
                                }
                                className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3.5 text-base font-bold text-white transition hover:bg-green-700"
                              >
                                <FiCheckCircle size={16} />
                                Confirm this account name
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setBeneficiaries((current) =>
                                    current.map(
                                      (item): BeneficiaryAccount =>
                                        item.id === beneficiary.id
                                          ? {
                                              ...item,
                                              resolved_account_name: "",
                                              resolution_status: "idle",
                                              resolution_message: "",
                                            }
                                          : item,
                                    ),
                                  );
                                }}
                                className="rounded-lg border border-zinc-200 bg-white px-5 py-3.5 text-base font-semibold text-zinc-700 transition hover:bg-zinc-50"
                              >
                                Not correct — edit details
                              </button>
                            </div>
                          </div>
                        )}

                        {beneficiary.resolution_status === "verified" && (
                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
                            <div className="flex items-center gap-2 text-green-700">
                              <FiCheckCircle size={17} />
                              <span className="text-sm font-bold">
                                Account name confirmed — locked
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setBeneficiaries((current) =>
                                  current.map(
                                    (item): BeneficiaryAccount =>
                                      item.id === beneficiary.id
                                        ? {
                                            ...item,
                                            account_name: "",
                                            resolved_account_name: "",
                                            resolution_status: "idle",
                                            resolution_message: "",
                                          }
                                        : item,
                                  ),
                                );
                              }}
                              className="text-sm font-semibold text-[#6D28D9] underline underline-offset-2"
                            >
                              Change account
                            </button>
                          </div>
                        )}

                        {beneficiary.resolution_status === "error" && (
                          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
                            <p className="text-base font-semibold text-red-700">
                              {beneficiary.resolution_message}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setBeneficiaries((current) =>
                                  current.map(
                                    (item): BeneficiaryAccount =>
                                      item.id === beneficiary.id
                                        ? {
                                            ...item,
                                            resolution_status: "idle",
                                            resolution_message: "",
                                          }
                                        : item,
                                  ),
                                );
                              }}
                              className="mt-2 text-sm font-bold text-[#6D28D9]"
                            >
                              Try again
                            </button>
                          </div>
                        )}

                        {/* ALLOCATION */}
                        <div className="mt-5 max-w-sm">
                          <label className={LABEL_CLASS}>
                            <span>Allocation percentage *</span>
                          </label>
                          <div className="flex overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition focus-within:border-[#6D28D9] focus-within:ring-2 focus-within:ring-purple-100">
                            <input
                              type="text"
                              inputMode="decimal"
                              autoComplete="off"
                              required
                              value={beneficiary.allocation_percentage}
                              onChange={(e) => {
                                const v = e.target.value
                                  .replace(/[^0-9.]/g, "")
                                  .replace(/(\..*)\./g, "$1");
                                updateBeneficiary(
                                  beneficiary.id,
                                  "allocation_percentage",
                                  v,
                                );
                              }}
                              placeholder="e.g. 60"
                              className="min-w-0 flex-1 px-4 py-3.5 text-base text-zinc-900 outline-none placeholder:text-zinc-400"
                            />
                            <span className="flex items-center border-l border-zinc-200 bg-zinc-50 px-4 text-base font-bold text-zinc-500">
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total allocation */}
              <div className="mt-5 rounded-xl bg-zinc-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-bold text-[#190D2E]">
                      Total allocation
                    </p>
                    <p className="mt-0.5 text-sm text-zinc-500">
                      All beneficiary allocations must add up to 100%.
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-4 py-2 text-base font-bold ${
                      Math.abs(totalAllocation - 100) < 0.001
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {totalAllocation.toFixed(2)}%
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      Math.abs(totalAllocation - 100) < 0.001
                        ? "bg-green-500"
                        : "bg-[#6D28D9]"
                    }`}
                    style={{ width: `${Math.min(totalAllocation, 100)}%` }}
                  />
                </div>
              </div>
              {Math.abs(totalAllocation - 100) >= 0.001 && (
                <p className="mt-2 text-sm text-amber-700">
                  Your allocations must total exactly 100% before you can create
                  this campaign.
                </p>
              )}
            </section>

            {/* BANNER */}
            <section className="border-t border-zinc-100 pt-8">
              <h2 className="text-lg font-bold text-[#190D2E]">
                Campaign banner
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Choose an image that represents your fundraising campaign.
              </p>
              <div className="mt-6">
                <label
                  htmlFor="banner-upload"
                  className="group block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-zinc-200 bg-[#F8F7FC] transition hover:border-[#6D28D9]/50 hover:bg-purple-50/40"
                >
                  {bannerPreview ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bannerPreview}
                        alt="Campaign banner preview"
                        className="h-56 w-full object-cover sm:h-64"
                      />
                      <span className="absolute bottom-3 right-3 rounded-full bg-[#190D2E]/80 px-3.5 py-2 text-xs font-bold text-white">
                        Change image
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center px-6 py-10 text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6D28D9] shadow-sm ring-1 ring-zinc-100">
                        <FiUpload size={20} />
                      </span>
                      <span className="mt-4 text-base font-bold text-zinc-800">
                        Upload banner image *
                      </span>
                      <span className="mt-1 text-sm text-zinc-500">
                        JPG, PNG or WEBP. Maximum 10 MB.
                      </span>
                      <span className="mt-4 rounded-full bg-[#6D28D9] px-4 py-2 text-sm font-bold text-white">
                        Choose file
                      </span>
                    </div>
                  )}
                  <input
                    id="banner-upload"
                    type="file"
                    required
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) => setBanner(e.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                </label>
                {banner && (
                  <p className="mt-3 text-sm text-green-600">
                    Selected: {banner.name} (
                    {(banner.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </section>

            {/* CONTACT */}
            <section className="border-t border-zinc-100 pt-8">
              <h2 className="text-lg font-bold text-[#190D2E]">
                Contact information
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Provide contact details for this campaign.
              </p>
              <div className="mt-6 space-y-5">
                <div>
                  <label htmlFor="contact-phone" className={LABEL_CLASS}>
                    <span>Contact phone *</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    maxLength={30}
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Enter a contact phone number"
                    className={INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="contact-address" className={LABEL_CLASS}>
                    <span>Contact address *</span>
                  </label>
                  <textarea
                    id="contact-address"
                    required
                    rows={3}
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    placeholder="Enter your organisation's contact address"
                    className={TEXTAREA_CLASS}
                  />
                </div>
              </div>
            </section>

            {/* FEEDBACK */}
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-base leading-6 text-red-700">
                {error}
              </div>
            )}
            {submitting && submitStatus && (
              <p
                role="status"
                className="flex items-center gap-2 text-base font-semibold text-[#6D28D9]"
              >
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-200 border-t-[#6D28D9]" />
                {submitStatus}
              </p>
            )}

            <div className="flex flex-col-reverse justify-between gap-4 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={
                  submitting ||
                  loadingCategories ||
                  categories.length === 0 ||
                  loadingBanks ||
                  !allocationsAreValid
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-7 py-3.5 text-base font-bold text-white transition hover:bg-[#5B21B6] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Please wait..." : "Create campaign"}
                {!submitting && <FiArrowRight size={16} />}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-zinc-400">
          Secured by Tippified Crowdfunding•
        </p>
      </div>

      {showCampaignLimitModal && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">
              Campaign limit reached
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {campaignLimitMessage} Upgrade your plan to create more campaigns.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/crowdfunding/upgrade";
                }}
                className="w-full rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
              >
                Upgrade Plan
              </button>

              <button
                type="button"
                onClick={() => setShowCampaignLimitModal(false)}
                className="w-full rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
