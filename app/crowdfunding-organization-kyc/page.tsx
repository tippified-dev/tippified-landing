"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiShield,
  FiUploadCloud,
  FiXCircle,
} from "react-icons/fi";
import { bricolage, fredoka } from "../font";

const API_BASE_URL = "https://api.tippified.com";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface OrganizationDetails {
  organisation_name?: string;
  cac_number?: string;
  representative_name?: string;
  representative_position?: string;
  city?: string;
  country?: string;
  about?: string;
}

interface OrganizationKYCStatus {
  exists: boolean;
  verification_status: "incomplete" | "pending" | "approved" | "rejected";
  rejection_reason?: string;
  certificate_uploaded: boolean;
  submitted_at?: string | null;
}

interface UploadURLResponse {
  upload_url: string;
  object_key: string;
  expires_in: number;
  required_headers?: {
    "Content-Type"?: string;
  };
  detail?: string;
}

type JsonObject = Record<string, unknown>;

const isJsonObject = (value: unknown): value is JsonObject => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const getErrorMessage = (data: unknown): string => {
  if (!isJsonObject(data)) {
    return "Something went wrong. Please try again.";
  }

  const detail = data.detail;
  const error = data.error;
  const message = data.message;

  if (typeof detail === "string") return detail;
  if (typeof error === "string") return error;
  if (typeof message === "string") return message;

  for (const value of Object.values(data)) {
    if (Array.isArray(value) && value.length > 0) {
      return String(value[0]);
    }

    if (typeof value === "string") {
      return value;
    }
  }

  return "Something went wrong. Please try again.";
};

const getString = (value: unknown, fallback = ""): string => {
  return typeof value === "string" ? value : fallback;
};

const isVerificationStatus = (
  value: unknown,
): value is OrganizationKYCStatus["verification_status"] => {
  return (
    value === "incomplete" ||
    value === "pending" ||
    value === "approved" ||
    value === "rejected"
  );
};

const isUploadURLResponse = (value: unknown): value is UploadURLResponse => {
  return (
    isJsonObject(value) &&
    typeof value.upload_url === "string" &&
    typeof value.object_key === "string" &&
    typeof value.expires_in === "number"
  );
};

const getCaughtErrorMessage = (error: unknown): string => {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
};

const allowedMimeTypes: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[1.2px] text-gray-400">
        {label}
      </p>
      <p className="wrap-break-words text-[15px] font-semibold leading-6 text-gray-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function OrganizationKYCPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [organisation, setOrganisation] = useState<OrganizationDetails | null>(
    null,
  );

  const [kycStatus, setKycStatus] = useState<OrganizationKYCStatus | null>(
    null,
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCSRFToken = async (): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/crowdfunding/csrf/`, {
      method: "GET",
      credentials: "include",
    });

    const data: unknown = await response.json();

    if (
      !response.ok ||
      !isJsonObject(data) ||
      typeof data.csrfToken !== "string"
    ) {
      throw new Error(
        "Unable to establish a secure connection. Please refresh and try again.",
      );
    }

    return data.csrfToken;
  };

  const loadPageData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [accountResponse, kycResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/crowdfunding/me/`, {
          method: "GET",
          credentials: "include",
        }),
        fetch(`${API_BASE_URL}/api/crowdfunding/organization-kyc/`, {
          method: "GET",
          credentials: "include",
        }),
      ]);

      if (accountResponse.status === 401 || kycResponse.status === 401) {
        router.push("/crowdfunding-signin");
        return;
      }

      const accountData: unknown = await accountResponse.json();
      const kycData: unknown = await kycResponse.json();

      if (!accountResponse.ok) {
        throw new Error(getErrorMessage(accountData));
      }

      if (!kycResponse.ok) {
        throw new Error(getErrorMessage(kycData));
      }

      if (!isJsonObject(accountData) || !isJsonObject(kycData)) {
        throw new Error("Invalid response received from the server.");
      }

      const accountCandidate =
        accountData.account ??
        accountData.user ??
        accountData.data ??
        accountData;

      if (!isJsonObject(accountCandidate)) {
        throw new Error("Unable to retrieve your organisation details.");
      }

      const account = accountCandidate;

      if (account.account_type !== "organisation") {
        router.push("/crowdfunding-dashboard");
        return;
      }

      setOrganisation({
        organisation_name: getString(account.organisation_name),
        cac_number: getString(account.cac_number),
        representative_name: getString(account.representative_name),
        representative_position: getString(account.representative_position),
        city: getString(account.city),
        country: getString(account.country),
        about: getString(account.about),
      });

      setKycStatus({
        exists: kycData.exists === true,
        verification_status: isVerificationStatus(kycData.verification_status)
          ? kycData.verification_status
          : "incomplete",
        rejection_reason: getString(kycData.rejection_reason),
        certificate_uploaded: kycData.certificate_uploaded === true,
        submitted_at:
          typeof kycData.submitted_at === "string"
            ? kycData.submitted_at
            : null,
      });
    } catch (error: unknown) {
      setErrorMessage(
        getCaughtErrorMessage(error) ||
          "Unable to load your organization verification details",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");
    setSuccessMessage("");

    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !allowedMimeTypes[extension]) {
      setErrorMessage("Please select a PDF, JPG, JPEG or PNG certificate.");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("The CAC certificate must not exceed 10 MB.");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    const expectedMimeType = allowedMimeTypes[extension];

    if (file.type && file.type !== expectedMimeType) {
      setErrorMessage("The selected file type does not match its extension.");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedFile) {
      setErrorMessage("Please select your CAC certificate before continuing.");
      return;
    }

    if (
      kycStatus?.verification_status === "pending" ||
      kycStatus?.verification_status === "approved"
    ) {
      setErrorMessage(
        "Your organisation verification cannot be resubmitted at this stage.",
      );
      return;
    }

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();

    if (!extension || !allowedMimeTypes[extension]) {
      setErrorMessage("Unsupported certificate format.");
      return;
    }

    const contentType = allowedMimeTypes[extension];

    try {
      setIsSubmitting(true);

      const csrfToken = await getCSRFToken();

      const uploadURLResponse = await fetch(
        `${API_BASE_URL}/api/crowdfunding/organization-kyc/upload-url/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({
            extension,
            content_type: contentType,
            file_size: selectedFile.size,
          }),
        },
      );

      const uploadURLResult: unknown = await uploadURLResponse.json();

      if (!uploadURLResponse.ok) {
        throw new Error(getErrorMessage(uploadURLResult));
      }

      if (!isUploadURLResponse(uploadURLResult)) {
        throw new Error(
          "The server returned an unexpected upload URL response.",
        );
      }

      const uploadURLData = uploadURLResult;

      if (!uploadURLData.upload_url) {
        throw new Error("The server did not return an upload URL.");
      }

      const r2Response = await fetch(uploadURLData.upload_url, {
        method: "PUT",
        headers: {
          "Content-Type":
            uploadURLData.required_headers?.["Content-Type"] || contentType,
        },
        body: selectedFile,
      });

      if (!r2Response.ok) {
        throw new Error(
          "Certificate upload failed. Please try selecting the file again.",
        );
      }

      const completeResponse = await fetch(
        `${API_BASE_URL}/api/crowdfunding/organization-kyc/complete-upload/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({
            object_key: uploadURLData.object_key,
          }),
        },
      );

      const completeData: unknown = await completeResponse.json();

      if (!completeResponse.ok) {
        throw new Error(getErrorMessage(completeData));
      }

      setKycStatus({
        exists: true,
        verification_status: "pending",
        rejection_reason: "",
        certificate_uploaded: true,
        submitted_at: new Date().toISOString(),
      });

      setSelectedFile(null);

      setSuccessMessage(
        isJsonObject(completeData) && typeof completeData.message === "string"
          ? completeData.message
          : "Your CAC certificate has been submitted successfully. Your organisation verification is now pending review.",
      );
    } catch (error: unknown) {
      setErrorMessage(
        getCaughtErrorMessage(error) ||
          "Unable to submit your organisation verification. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <div
        className={`${bricolage.className} min-h-screen bg-[#FAF9FC] px-4 py-8 sm:px-6`}
      >
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="mb-7 h-5 w-32 rounded bg-gray-200" />
          <div className="mb-7 flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-purple-100" />
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-7 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="h-4 w-2/3 rounded bg-gray-100" />
            </div>
          </div>

          <div className="mb-6 rounded-3x1 border border-gray-100 bg-white p-5 sm:p-6">
            <div className="mb-4 flex gap-2">
              <div className="h-7 w-24 rounded-full bg-purple-100" />
              <div className="h-7 w-24 rounded-full bg-gray-100" />
              <div className="h-7 w-24 rounded-full bg-gray-100" />
            </div>
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="mt-2 h-4 w-2/3 rounded bg-gray-100" />
          </div>

          <div className="mb-6 rounded-3x1 border border-gray-100 bg-white p-5 sm:p-7">
            <div className="mb-6 h-6 w-56 rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[0, 1, 2, 3, 4].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="h-3 w-28 rounded bg-gray-100" />
                  <div className="h-5 w-40 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3x1 border border-gray-100 bg-white p-5 sm:p-7">
            <div className="mb-3 h-6 w-40 rounded bg-gray-200" />
            <div className="mb-6 h-4 w-3/4 rounded bg-gray-100" />
            <div className="h-40 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50" />
            <div className="mt-6 h-14 rounded-xl bg-purple-100" />
          </div>

          <p className="mt-6 text-center text-[13px] font-medium text-gray-400">
            Loading organisation details...
          </p>
        </div>
      </div>
    );
  }

  if (!organisation) {
    return (
      <div
        className={`${bricolage.className} flex min-h-screen items-center justify-center bg-[#FAF9FC] px-4`}
      >
        <div className="w-full max-w-md rounded-[28px] border border-gray-100 bg-white p-8 text-center shadow-xl shadow-purple-100/40">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <FiAlertCircle size={26} />
          </div>
          <h1
            className={`${fredoka.className} text-[22px] font-bold leading-tight text-gray-900`}
          >
            We could not load your details
          </h1>
          <p className="mt-3 text-[14px] leading-6 text-gray-500">
            We could not load your organisation details.
          </p>
          {errorMessage && (
            <p className="mt-3 text-[13px] leading-6 text-red-600">
              {errorMessage}
            </p>
          )}
          <button
            onClick={() => router.push("/crowdfunding-dashboard")}
            className={`${fredoka.className} mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-purple-700 px-7 text-[15px] font-bold text-white transition hover:bg-purple-800`}
          >
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  const status = kycStatus?.verification_status || "incomplete";
  const isLocked = status === "pending" || status === "approved";

  const statusLabel =
    status === "pending"
      ? "Under review"
      : status === "approved"
        ? "Verified"
        : status === "rejected"
          ? "Needs attention"
          : "Not started";

  const statusPillClass =
    status === "pending"
      ? "bg-amber-100 text-amber-800"
      : status === "approved"
        ? "bg-green-100 text-green-800"
        : status === "rejected"
          ? "bg-red-100 text-red-800"
          : "bg-gray-100 text-gray-700";

  const stepIndex = status === "pending" ? 1 : status === "approved" ? 2 : 0;

  const steps = [
    { label: "Upload certificate", description: "Submit your CAC" },
    { label: "Under review", description: "Team is reviewing" },
    { label: "Verified", description: "Ready to fundraise" },
  ];

  return (
    <div
      className={`${bricolage.className} relative min-h-screen overflow-hidden bg-[#FAF9FC] px-4 py-8 sm:px-6`}
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-96 -left-24 h-72 w-72 rounded-full bg-purple-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.push("/crowdfunding-dashboard")}
          className="mb-7 inline-flex items-center gap-2 text-[14px] font-medium text-gray-600 transition hover:text-purple-700"
        >
          <FiArrowLeft />
          Back to dashboard
        </button>

        {/* PAGE HEADING */}
        <div className="mb-7">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <FiFileText size={23} />
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold ${statusPillClass}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {statusLabel}
            </span>
          </div>

          <h1
            className={`${fredoka.className} text-[28px] font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-[34px]`}
          >
            Organisation verification
          </h1>

          <p className="mt-3 max-w-2xl text-[14px] leading-7 text-gray-500 sm:text-[15px]">
            Submit your organisation&apos;s CAC certificate to verify your
            crowdfunding account. Our team will review your submission.
          </p>
        </div>

        {/* STEPPER */}
        <div className="mb-6 rounded-3x1 border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            {steps.map((item, index) => {
              const isActive = index <= stepIndex;
              const isCurrent = index === stepIndex;
              return (
                <div key={item.label} className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition ${
                        isActive
                          ? "bg-purple-700 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div
                      className={`h-1.5 flex-1 rounded-full ${
                        isActive ? "bg-purple-700" : "bg-gray-100"
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
                    {item.label}
                  </p>
                  <p className="mt-0.5 hidden text-[12px] text-gray-400 sm:block">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* VERIFICATION STATUS */}
        {status === "pending" && (
          <div className="mb-6 flex gap-3.5 rounded-3x1 border border-amber-200 bg-amber-50 p-5 sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
              <FiClock size={21} />
            </div>
            <div>
              <h3
                className={`${fredoka.className} text-[17px] font-bold leading-6 text-amber-900`}
              >
                Verification under review
              </h3>
              <p className="mt-1.5 text-[14px] leading-6 text-amber-800">
                Your CAC certificate has been submitted. Our team is currently
                reviewing your organisation&apos;s information.
              </p>
            </div>
          </div>
        )}

        {status === "approved" && (
          <div className="mb-6 flex gap-3.5 rounded-3x1 border border-green-200 bg-green-50 p-5 sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-green-600 shadow-sm">
              <FiCheckCircle size={21} />
            </div>
            <div>
              <h3
                className={`${fredoka.className} text-[17px] font-bold leading-6 text-green-900`}
              >
                Organisation verified
              </h3>
              <p className="mt-1.5 text-[14px] leading-6 text-green-800">
                Your organisation has successfully completed verification. No
                further action is required.
              </p>
            </div>
          </div>
        )}

        {status === "rejected" && (
          <div className="mb-6 rounded-3x1 border border-red-200 bg-red-50 p-5 sm:p-6">
            <div className="flex gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
                <FiXCircle size={21} />
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  className={`${fredoka.className} text-[17px] font-bold leading-6 text-red-900`}
                >
                  Verification requires attention
                </h3>
                <p className="mt-1.5 text-[14px] leading-6 text-red-800">
                  Your previous submission was not approved. Please review the
                  reason below and submit a corrected CAC certificate.
                </p>
                {kycStatus?.rejection_reason && (
                  <div className="mt-4 rounded-xl bg-white/70 p-4">
                    <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[1.2px] text-red-900">
                      Reason for rejection
                    </p>
                    <p className="text-[14px] leading-6 text-red-800">
                      {kycStatus.rejection_reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ORGANISATION DETAILS */}
        <div className="mb-6 rounded-3x1 border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <h2
            className={`${fredoka.className} text-[19px] font-bold leading-7 text-gray-900`}
          >
            Registered organisation details
          </h2>
          <p className="mt-1.5 text-[14px] leading-6 text-gray-500">
            These details were provided when you created your organisation
            account.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <DetailItem
              label="Registered organisation name"
              value={organisation.organisation_name || "Not provided"}
            />
            <DetailItem
              label="CAC registration number"
              value={organisation.cac_number || "Not provided"}
            />
            <DetailItem
              label="Representative's name"
              value={organisation.representative_name || "Not provided"}
            />
            <DetailItem
              label="Representative's position"
              value={organisation.representative_position || "Not provided"}
            />
            <DetailItem
              label="Location"
              value={
                [organisation.city, organisation.country]
                  .filter(Boolean)
                  .join(", ") || "Not provided"
              }
            />
          </div>

          {organisation.about && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[1.2px] text-gray-400">
                About the organisation
              </p>
              <p className="text-[14px] leading-7 text-gray-700">
                {organisation.about}
              </p>
            </div>
          )}
        </div>

        {/* CAC CERTIFICATE UPLOAD */}
        <div className="rounded-3x1 border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <h2
            className={`${fredoka.className} text-[19px] font-bold leading-7 text-gray-900`}
          >
            CAC certificate
          </h2>
          <p className="mt-1.5 text-[14px] leading-6 text-gray-500">
            Upload the official CAC registration certificate belonging to the
            organisation shown above.
          </p>

          {kycStatus?.certificate_uploaded && status === "rejected" && (
            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-[14px] leading-6 text-gray-600">
                A previous certificate was uploaded. You can select a corrected
                certificate below to resubmit your application.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-[14px] leading-6 text-red-700">
              <FiAlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 p-4 text-[14px] leading-6 text-green-700">
              <FiCheckCircle size={18} className="mt-0.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {!isLocked && (
            <form onSubmit={handleSubmit} className="mt-6">
              <label
                htmlFor="cac-certificate"
                className={`block cursor-pointer rounded-2xl border-2 border-dashed p-7 text-center transition sm:p-8 ${
                  selectedFile
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/40"
                }`}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-purple-700 shadow-sm">
                  <FiUploadCloud size={26} />
                </div>
                <span
                  className={`${fredoka.className} block text-[16px] font-bold text-gray-900`}
                >
                  {selectedFile
                    ? "Certificate selected"
                    : "Choose your CAC certificate"}
                </span>
                <span className="mt-2 block text-[13px] leading-5 text-gray-500">
                  PDF, JPG or PNG · Maximum file size 10 MB
                </span>
                <span className="mt-4 inline-flex rounded-full bg-purple-700 px-4 py-2 text-[12px] font-bold text-white">
                  Browse files
                </span>
                <input
                  id="cac-certificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {selectedFile && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-purple-700 shadow-sm">
                      <FiFileText size={19} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="mt-0.5 text-[12px] text-gray-500">
                        {formatFileSize(selectedFile.size)} · Ready to upload
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="shrink-0 text-[13px] font-semibold text-red-600 transition hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !selectedFile}
                className={`${fredoka.className} mt-6 flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-[#6D28D9] to-[#5B21B6] text-[15px] font-bold text-white shadow-[0_12px_25px_-12px_rgba(109,40,217,0.7)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Uploading certificate...
                  </>
                ) : status === "rejected" ? (
                  "Replace certificate and resubmit"
                ) : (
                  "Submit for verification"
                )}
              </button>
            </form>
          )}

          {isLocked && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-[14px] leading-6 text-gray-600">
                {status === "approved"
                  ? "Your organisation has been verified. Certificate uploads are no longer required."
                  : "Your certificate has been submitted and is awaiting review. You cannot replace it while the application is pending."}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-center">
          <FiShield size={14} className="shrink-0 text-gray-400" />
          <p className="text-[12px] leading-5 text-gray-400">
            Your CAC certificate is stored in a private, secure storage location
            and is only made available to authorised reviewers.
          </p>
        </div>
      </div>
    </div>
  );
}
