"use client";
import AdsterraBanner from "@/app/components/AdsterraBanner";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
  FiCheckCircle,
  FiLock,
  FiMessageCircle,
  FiShield,
} from "react-icons/fi";

interface Community {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: string;
  currency: "NGN" | "GHS" | "KES";
  creator_username: string;
  is_active: boolean;
}
interface CommunityClientProps {
  accessToken: string;
  community: Community | null;
}
const API_BASE_URL = "https://api.tippified.com";
const currencySymbol = (c: string) =>
  c === "NGN" ? "₦" : c === "GHS" ? "GH₵" : c === "KES" ? "KSh" : "";

export default function CommunityClient({
  accessToken,
  community,
}: CommunityClientProps) {
  const [fanName, setFanName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  if (!community) {
    return (
      <div className="min-h-screen bg-[#fdfcff] flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl p-px bg-linear-to-b from-[#15052E]/10 to-transparent">
          <div className="rounded-[23px] bg-white p-8 text-center shadow-[0_20px_60px_-24px_rgba(21,5,46,0.2)]">
            <div className="mx-auto w-12 h-12 rounded-full bg-linear-to-br from-[#15052E] to-[#4C1D95] grid place-items-center text-white">
              <FiMessageCircle size={20} />
            </div>
            <h1 className="mt-5 text-lg font-extrabold text-[#15052E]">
              Community unavailable
            </h1>
            <p className="mt-2 text-sm text-[#15052E]/60">
              This paid community could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const symbol = currencySymbol(community.currency);
  const formattedPrice = Number(community.price).toLocaleString();

  const handlePayment = async () => {
    setError("");
    if (!fanName.trim()) return setError("please enter your name");
    if (!email.trim()) return setError("Please enter your email address.");
    if (!whatsappNumber.trim())
      return setError("Please enter your WhatsApp number.");
    try {
      setPaying(true);
      const res = await fetch(
        `${API_BASE_URL}/api/auth/paid-community/${accessToken}/pay/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fan_name: fanName.trim() || "Anonymous",
            email: email.trim().toLowerCase(),
            whatsapp_number: whatsappNumber.trim(),
          }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data?.message || "Unable to initialize payment.");
      window.location.href = data.authorization_url;
    } catch (err: unknown) {
      console.error("Community payment error:", err);
      const message =
        err instanceof Error ? err.message : "Unable to initialize payment.";
      setError(message);
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcff] relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-white via-[#fdfcff] to-[#efe8ff]" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-200 h-150 bg-[#4C1D95]/15 blur-[120px] rounded-full" />

      <div className="relative mx-auto w-full max-w-140 px-5 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[28px] p-px bg-linear-to-b from-[#15052E]/15 to-[#4C1D95]/10 shadow-[0_24px_80px_-24px_rgba(21,5,46,0.35)]"
        >
          <div className="rounded-[27px] bg-white overflow-hidden">
            {/* BANNER - premium dark overlay */}
            <div className="relative h-60 w-full overflow-hidden">
              <Image
                src={community.image_url}
                alt={community.name}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#15052E] via-[#15052E]/60 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-br from-[#4C1D95]/30 to-transparent" />

              <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                <div className="rounded-full bg-white/15 backdrop-blur-xl border border-white/20 px-3.5 py-1.5 text-[10px] font-bold tracking-widest uppercase text-white">
                  {community.creator_username}
                </div>
                <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 grid place-items-center text-white">
                  <FiMessageCircle size={16} />
                </div>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6">
                <h1 className="text-[26px] font-extrabold tracking-tight text-white leading-[1.1]">
                  {community.name}
                </h1>
                <p className="mt-1.5 text-[12px] font-medium text-white/70 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />{" "}
                  Exclusive WhatsApp Community • Instant access after payment
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              {community.description && (
                <div className="rounded-2xl bg-[#f8f5ff] border border-[#15052E]/5 p-4">
                  <p className="text-[13.5px] leading-6 text-[#15052E]/70">
                    {community.description}
                  </p>
                </div>
              )}

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-linear-to-br from-[#15052E] to-[#4C1D95] p-4 text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 blur-2xl rounded-full" />
                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                    One-time Access
                  </p>
                  <p className="mt-1 text-[24px] font-extrabold">
                    {symbol}
                    {formattedPrice}
                  </p>
                </div>
                <div className="relative w-10 h-10 rounded-full bg-white/15 border border-white/20 grid place-items-center">
                  <FiCheckCircle size={18} />
                </div>
              </div>
              <AdsterraBanner />

              <div className="mt-7 space-y-4">
                {[
                  {
                    label: "Your Name",
                    value: fanName,
                    setter: setFanName,
                    placeholder: "Anonymous",
                    type: "text",
                  },
                  {
                    label: "Email Address",
                    value: email,
                    setter: setEmail,
                    placeholder: "you@example.com",
                    type: "email",
                  },
                  {
                    label: "WhatsApp Number",
                    value: whatsappNumber,
                    setter: setWhatsappNumber,
                    placeholder: "+234 801 234 5678",
                    type: "tel",
                  },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="mb-1.5 block text-[10px] font-extrabold tracking-widest uppercase text-[#15052E]/60">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      value={f.value}
                      onChange={(e) => f.setter(e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full rounded-xl bg-[#f8f5ff] border border-[#15052E]/10 px-4 py-3.5 text-base font-medium text-[#15052E] placeholder:text-[#15052E]/30 outline-none focus:bg-white focus:border-[#4C1D95]/30 focus:ring-4 focus:ring-[#4C1D95]/10 transition"
                    />
                  </div>
                ))}

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-[12px] text-red-600">
                    {error}
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={paying}
                  className="w-full rounded-full bg-linear-to-br from-[#15052E] to-[#4C1D95] py-4 text-[14px] font-bold text-white shadow-[0_12px_30px_-10px_rgba(21,5,46,0.6)] hover:shadow-[0_16px_40px_-10px_rgba(21,5,46,0.7)] transition"
                >
                  {paying ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />{" "}
                      Preparing...
                    </span>
                  ) : (
                    `Pay ${symbol}${formattedPrice} to Join`
                  )}
                </motion.button>

                <div className="rounded-xl bg-[#f8f5ff] border border-[#15052E]/5 px-3 py-3 flex gap-2">
                  <FiLock size={12} className="mt-0.5 text-[#4C1D95]" />
                  <p className="text-[11px] leading-4 text-[#15052E]/60">
                    Private WhatsApp invite is protected and sent only after
                    successful payment. No sharing allowed.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#15052E]/40">
                  <FiShield size={12} /> Secure payment by Paystack • Encrypted
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BRAND - moved to bottom premium */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#15052E]/5 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-[#15052E] to-[#4C1D95] grid place-items-center text-white">
              <FiMessageCircle size={12} />
            </div>
            <span className="text-[11px] font-extrabold tracking-tight text-[#15052E]">
              tippified.
            </span>
            <span className="text-[10px] text-[#15052E]/40">
              • Paid Community Access
            </span>
          </div>
          <p className="text-[10px] text-[#15052E]/30">
            You will be redirected to Paystack to complete payment.
          </p>
        </div>
      </div>
    </div>
  );
}
