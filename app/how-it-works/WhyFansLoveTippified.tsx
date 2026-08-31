"use client";
import {
  BoltIcon,
  CakeIcon,
  ClockIcon,
  GiftIcon,
  HeartIcon,
  ShieldCheckIcon,
  VideoCameraIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const features = [
  {
    icon: HeartIcon,
    title: "Support Your Favourite Creators",
    description:
      "Show appreciation by sending monetary tips to the creators you love, helping them continue creating great content.",
  },
  {
    icon: WalletIcon,
    title: "Preload Your Tip History",
    description:
      "Fetch and track your entire tipping history in one secure place.",
  },
  {
    icon: GiftIcon,
    title: "Buy & Save Virtual Gifts",
    description:
      "Purchase virtual gifts in advance and store them securely until you're ready to send them.",
  },
  {
    icon: VideoCameraIcon,
    title: "Send Gifts During Live",
    description:
      "While watching creators live, instantly send tips and virtual gifts without interrupting the stream.",
  },
  {
    icon: CakeIcon,
    title: "Celebrate Special Moments",
    description:
      "Support creators on birthdays, milestones and special occasions by fulfilling wishlists.",
  },
  {
    icon: BoltIcon,
    title: "Fast & Simple",
    description:
      "Supporting creators takes only a few seconds. Quick, simple and enjoyable by design.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Safe & Secure",
    description:
      "Payments are securely processed through licensed payment partners.",
  },
  {
    icon: ClockIcon,
    title: "Use Anytime",
    description:
      "Tip a creator anytime, from any location and in any currency — Tippified got you!",
  },
];

export default function WhyFansLoveTippified() {
  return (
    <section className="relative py-28 bg-[#fdfcff] overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-white to-[#f6f1ff]/60" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-[#4C1D95]/10 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex px-4 py-1.5 rounded-full bg-[#15052E]/5 border border-[#15052E]/10 text-[10px] font-extrabold tracking-widest uppercase text-[#15052E]">
            For Fans
          </div>
          <h2 className="mt-6 text-4xl md:text-[44px] font-extrabold tracking-tight leading-[1.05] text-[#15052E]">
            Why Fans{" "}
            <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
              Love Tippified
            </span>
          </h2>
          <p className="mt-5 text-[15px] leading-7 text-[#15052E]/60 max-w-2xl mx-auto">
            Simple, secure and interactive way to encourage creators and
            participate in their journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="group relative rounded-3xl p-px bg-linear-to-b from-[#15052E]/10 to-transparent"
              >
                <div className="rounded-[23px] bg-white p-6 h-full shadow-[0_8px_40px_-20px_rgba(21,5,46,0.12)] group-hover:shadow-[0_16px_48px_-16px_rgba(21,5,46,0.2)] transition">
                  <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#15052E] to-[#4C1D95] grid place-items-center text-white shadow-[0_8px_20px_rgba(21,5,46,0.25)] mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-[15px] font-bold tracking-tight text-[#15052E] leading-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-6 text-[#15052E]/60">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 relative rounded-3xl p-px bg-linear-to-b from-[#15052E]/20 to-transparent">
          <div className="rounded-[23px] bg-linear-to-br from-[#15052E] to-[#4C1D95] p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-75 h-75 bg-white/10 blur-[60px] rounded-full" />
            <h3 className="relative text-white text-[22px] font-bold tracking-tight">
              More Than Just Tipping
            </h3>
            <p className="relative mt-4 text-[14px] leading-7 text-purple-100/70 max-w-4xl">
              Tippified is not simply a payment page. It creates meaningful
              interactions through monetary support, virtual gifting,
              fundraising goals, birthday celebrations, wishlists and live
              experiences — all from one secure platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
