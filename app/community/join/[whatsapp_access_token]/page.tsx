"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiLoader } from "react-icons/fi";

interface JoinResponse {
  success: boolean;
  message?: string;
  community?: {
    name: string;
  };
  whatsapp_invite_url?: string;
}

export default function CommunityJoinPage() {
  const params = useParams();

  const whatsappAccessToken = params?.whatsapp_access_token as string;

  const [message, setMessage] = useState(
    whatsappAccessToken
      ? "Verifying your community access..."
      : "Invalid community access link.",
  );

  useEffect(() => {
    if (!whatsappAccessToken) {
      return;
    }

    const verifyAccess = async () => {
      try {
        const response = await fetch(
          `https://api.tippified.com/api/auth/community/join/${whatsappAccessToken}/`,
        );

        const data: JoinResponse = await response.json();

        if (!response.ok || !data.success) {
          setMessage(
            data.message ||
              "This community access link is invalid or no longer active.",
          );
          return;
        }

        if (!data.whatsapp_invite_url) {
          setMessage("We could not find the WhatsApp community invite.");
          return;
        }

        window.location.href = data.whatsapp_invite_url;
      } catch (error) {
        console.error("Community join verification error:", error);

        setMessage(
          "We were unable to verify your community access. Please try again.",
        );
      }
    };

    verifyAccess();
  }, [whatsappAccessToken]);

  return (
    <main className="min-h-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 px-4 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-3xl border border-purple-100 bg-white p-8 text-center shadow-xl sm:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-50">
            {message === "Verifying your community access..." ? (
              <FiLoader className="animate-spin text-purple-600" size={38} />
            ) : (
              <FiAlertCircle className="text-red-500" size={48} />
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            {message === "Verifying your community access..."
              ? "Checking your access"
              : "Unable to join community"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">{message}</p>
        </div>
      </div>
    </main>
  );
}
