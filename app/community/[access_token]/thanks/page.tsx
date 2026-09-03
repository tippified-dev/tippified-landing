"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";

type VerificationState = "verifying" | "success" | "failed";

interface VerificationResponse {
  success: boolean;
  message?: string;
  membership?: {
    id: number;
    status: string;
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

    const verifyPayment = async () => {
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

        if (!response.ok || !data.success) {
          setStatus("failed");
          setMessage(data.message || "We could not verify your payment.");
          return;
        }
        setWhatsappJoinUrl(data.whatsapp_join_url || null);

        setStatus("success");
        setMessage("Your payment has been confirmed.");
      } catch (error) {
        console.error("Community payment verification error:", error);

        setStatus("failed");
        setMessage(
          "We were unable to verify your payment right now. Please try again.",
        );
      }
    };

    verifyPayment();
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

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Please wait while we confirm your payment with Paystack.
              </p>
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

              <div className="mt-8 rounded-2xl bg-purple-50 p-5">
                <p className="text-sm font-semibold text-purple-700">
                  Your community membership is now active.
                </p>
              </div>

              {whatsappJoinUrl && (
                <a
                  href={whatsappJoinUrl}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-green-600 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-green-700 active:scale-[0.98]"
                >
                  Join WhatsApp Community
                </a>
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
