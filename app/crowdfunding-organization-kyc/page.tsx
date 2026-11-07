"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiUploadCloud,
  FiXCircle,
} from "react-icons/fi";

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

      // Support common response structures from the account endpoint.
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

      // Step 1: Obtain a CSRF token.
      const csrfToken = await getCSRFToken();

      // Step 2: Request a signed R2 upload URL.
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

      // First check whether the backend request succeeded.
      if (!uploadURLResponse.ok) {
        throw new Error(getErrorMessage(uploadURLResult));
      }

      // Only validate the upload URL structure after a successful response.
      if (!isUploadURLResponse(uploadURLResult)) {
        throw new Error(
          "The server returned an unexpected upload URL response.",
        );
      }

      const uploadURLData = uploadURLResult;

      if (!uploadURLResponse.ok) {
        throw new Error(getErrorMessage(uploadURLData));
      }

      if (!uploadURLData.upload_url) {
        throw new Error("The server did not return an upload URL.");
      }

      // Step 3: Upload the certificate directly to private Cloudflare R2.
      // Do not send crowdfunding session cookies to R2.
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

      // Step 4: Tell the backend that the upload has completed.
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
      <div className="min-h-screen bg-[#FAF9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-9 h-9 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-4">
            Loading organisation details...
          </p>
        </div>
      </div>
    );
  }

  if (!organisation) {
    return (
      <div className="min-h-screen bg-[#FAF9FC] flex items-center justify-center px-5">
        <div className="bg-white rounded-2xl p-7 max-w-md w-full text-center shadow-sm border border-gray-100">
          <p className="text-gray-700 font-medium">
            We could not load your organisation details.
          </p>

          {errorMessage && (
            <p className="text-sm text-red-600 mt-3">{errorMessage}</p>
          )}

          <button
            onClick={() => router.push("/crowdfunding-dashboard")}
            className="mt-5 text-purple-700 font-semibold text-sm"
          >
            Return to dashboard
          </button>
        </div>
      </div>
    );
  }

  const status = kycStatus?.verification_status || "incomplete";

  const isLocked = status === "pending" || status === "approved";

  return (
    <div className="min-h-screen bg-[#FAF9FC] px-4 py-8 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => router.push("/crowdfunding-dashboard")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-700 mb-7"
        >
          <FiArrowLeft />
          Back to dashboard
        </button>

        {/* Page heading */}
        <div className="mb-7">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
            <FiFileText size={23} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Organisation verification
          </h1>

          <p className="text-gray-500 text-sm sm:text-base mt-2 leading-relaxed">
            Submit your organisation&apos;s CAC certificate to verify your
            crowdfunding account. Our team will review your submission.
          </p>
        </div>

        {/* Verification status */}
        {status === "pending" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex gap-3">
            <FiClock className="text-amber-600 mt-0.5 shrink-0" size={21} />

            <div>
              <h3 className="font-semibold text-amber-900">
                Verification under review
              </h3>

              <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                Your CAC certificate has been submitted. Our team is currently
                reviewing your organisation&apos;s information.
              </p>
            </div>
          </div>
        )}

        {status === "approved" && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex gap-3">
            <FiCheckCircle
              className="text-green-600 mt-0.5 shrink-0"
              size={21}
            />

            <div>
              <h3 className="font-semibold text-green-900">
                Organisation verified
              </h3>

              <p className="text-sm text-green-800 mt-1 leading-relaxed">
                Your organisation has successfully completed verification. No
                further action is required.
              </p>
            </div>
          </div>
        )}

        {status === "rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
            <div className="flex gap-3">
              <FiXCircle className="text-red-600 mt-0.5 shrink-0" size={21} />

              <div>
                <h3 className="font-semibold text-red-900">
                  Verification requires attention
                </h3>

                <p className="text-sm text-red-800 mt-1 leading-relaxed">
                  Your previous submission was not approved. Please review the
                  reason below and submit a corrected CAC certificate.
                </p>

                {kycStatus?.rejection_reason && (
                  <div className="mt-3 bg-white/70 rounded-xl p-3">
                    <p className="text-xs font-semibold text-red-900 mb-1">
                      REASON FOR REJECTION
                    </p>

                    <p className="text-sm text-red-800">
                      {kycStatus.rejection_reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Organisation details */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-7 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Registered organisation details
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            These details were provided when you created your organisation
            account.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Registered organisation name
              </p>

              <p className="font-semibold text-gray-900 wrap-break-words">
                {organisation.organisation_name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">
                CAC registration number
              </p>

              <p className="font-semibold text-gray-900 wrap-break-words">
                {organisation.cac_number || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">
                Representative&apos;s name
              </p>

              <p className="font-semibold text-gray-900 wrap-break-words">
                {organisation.representative_name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">
                Representative&apos;s position
              </p>

              <p className="font-semibold text-gray-900 wrap-break-words">
                {organisation.representative_position || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Location</p>

              <p className="font-semibold text-gray-900">
                {[organisation.city, organisation.country]
                  .filter(Boolean)
                  .join(", ") || "Not provided"}
              </p>
            </div>
          </div>

          {organisation.about && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">
                About the organisation
              </p>

              <p className="text-sm text-gray-700 leading-relaxed">
                {organisation.about}
              </p>
            </div>
          )}
        </div>

        {/* CAC certificate upload */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-7 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">CAC certificate</h2>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            Upload the official CAC registration certificate belonging to the
            organisation shown above.
          </p>

          {kycStatus?.certificate_uploaded && status === "rejected" && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-5">
              <p className="text-sm text-gray-600">
                A previous certificate was uploaded. You can select a corrected
                certificate below to resubmit your application.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mb-5">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm mb-5">
              {successMessage}
            </div>
          )}

          {!isLocked && (
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="cac-certificate"
                className={`block border-2 border-dashed rounded-2xl p-7 text-center transition ${
                  selectedFile
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/40"
                } cursor-pointer`}
              >
                <FiUploadCloud
                  size={32}
                  className="mx-auto text-purple-700 mb-3"
                />

                <span className="block font-semibold text-gray-800">
                  {selectedFile
                    ? "Certificate selected"
                    : "Choose your CAC certificate"}
                </span>

                <span className="block text-sm text-gray-500 mt-2">
                  PDF, JPG or PNG · Maximum file size 10 MB
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
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {selectedFile.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium shrink-0"
                  >
                    Remove
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !selectedFile}
                className="w-full mt-6 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3.5 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">
                {status === "approved"
                  ? "Your organisation has been verified. Certificate uploads are no longer required."
                  : "Your certificate has been submitted and is awaiting review. You cannot replace it while the application is pending."}
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
          Your CAC certificate is stored in a private, secure storage location
          and is only made available to authorised reviewers.
        </p>
      </div>
    </div>
  );
}
