"use client";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";
type VerificationState = "verifying" | "success" | "failed";
interface VerificationResponse {
  success: boolean;
  message?: string;
  payment_status?: string;
  membership?: {
    id: number;
    status: string;
    expires_at?: string | null;
  };
  community?: {
    name: string;
  };
  whatsapp_join_url?: string;
}
export default function CommunityThanksPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState<VerificationState>(
    reference ? "verifying" : "failed",
  );
  const [message, setMessage] = useState(
    reference
      ? "Confirming your payment..."
      : "We could not find your payment reference.",
  );
  const [whatsappJoinUrl, setWhatsappJoinUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!reference) {
      return;
    }
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 15;
    const pollInterval = 1000;
    const verifyPayment = async (): Promise<void> => {
      if (cancelled) {
        return;
      }
      attempts += 1;
      try {
        const response = await fetch(
          "https://api.tippified.com/api/auth/community/payment/verify/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reference,
            }),
          },
        );
        const data: VerificationResponse = await response.json();
        if (cancelled) {
          return;
        }
        // --------------------------------------------------
        // PAYMENT VERIFICATION FAILED
        // --------------------------------------------------
        if (!response.ok || !data.success) {
          setStatus("failed");
          setMessage(data.message || "We could not verify your payment.");
          return;
        }
        // --------------------------------------------------
        // WEBHOOK STILL PROCESSING
        // --------------------------------------------------
        if (data.payment_status === "processing" || !data.whatsapp_join_url) {
          if (attempts < maxAttempts) {
            setMessage(
              "Your payment was successful. Finalizing your community access...",
            );
            setTimeout(verifyPayment, pollInterval);
            return;
          }
          setStatus("success");
          setMessage(
            "Your payment was received successfully. Your community access is still being finalized. Please check again shortly.",
          );
          return;
        }
        // --------------------------------------------------
        // PAYMENT + MEMBERSHIP READY
        // --------------------------------------------------
        setWhatsappJoinUrl(data.whatsapp_join_url);
        setStatus("success");
        setMessage("Your payment has been confirmed.");
      } catch (error) {
        console.error("Community payment verification error:", error);
        if (cancelled) {
          return;
        }
        if (attempts < maxAttempts) {
          setMessage("Confirming your payment. Please wait...");
          setTimeout(verifyPayment, pollInterval);
          return;
        }
        setStatus("failed");
        setMessage(
          "We were unable to verify your payment right now. Please try again.",
        );
      }
    };
    verifyPayment();
    return () => {
      cancelled = true;
    };
  }, [reference]);
  return (
    <main className="min-h-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 px-4 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-3xl border border-purple-100 bg-white p-8 text-center shadow-xl sm:p-10"
        >
          {/* --------------------------------------------------
              VERIFYING
          -------------------------------------------------- */}
          {status === "verifying" && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-50">
                <FiLoader className="animate-spin text-purple-600" size={38} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Confirming your payment
              </h1>
              <p className="mt-3 text-sm leading-6 text-gray-500">{message}</p>
            </>
          )}
          {/* --------------------------------------------------
              SUCCESS
          -------------------------------------------------- */}
          {status === "success" && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                <FiCheckCircle className="text-green-600" size={48} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Payment successful
              </h1>
              <p className="mt-3 text-sm leading-6 text-gray-500">{message}</p>
              {whatsappJoinUrl ? (
                <>
                  <div className="mt-8 rounded-2xl bg-purple-50 p-5">
                    <p className="text-sm font-semibold text-purple-700">
                      Your community membership is now active.
                    </p>
                  </div>
                  <a
                    href={whatsappJoinUrl}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-green-600 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-green-700 active:scale-[0.98]"
                  >
                    Join WhatsApp Community
                  </a>
                </>
              ) : (
                <div className="mt-8 rounded-2xl bg-purple-50 p-5">
                  <p className="text-sm font-semibold text-purple-700">
                    Your payment has been received. Your community access is
                    being finalized.
                  </p>
                  <p className="mt-2 text-xs leading-5 text-purple-600">
                    Please check again shortly. Your payment is safe and your
                    membership will become available once processing is
                    complete.
                  </p>
                </div>
              )}
            </>
          )}
          {/* --------------------------------------------------
              FAILED
          -------------------------------------------------- */}
          {status === "failed" && (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                <FiAlertCircle className="text-red-500" size={48} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Payment could not be confirmed
              </h1>
              <p className="mt-3 text-sm leading-6 text-gray-500">{message}</p>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
