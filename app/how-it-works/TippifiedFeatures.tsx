"use client";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import {
  FiAward,
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiGift,
  FiPlayCircle,
  FiRadio,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiVideo,
} from "react-icons/fi";
import CreatorTipBanner from "../components/CreatorTipBanner";

interface Feature {
  icon: IconType;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: FiDollarSign,
    title: "Receive Monetary Tips",
    description:
      "Receive voluntary financial support from fans anywhere in the world through your unique Tippified tipping page.",
  },
  {
    icon: FiPlayCircle,
    title: "Paid Video Content",
    description:
      "Upload short exclusive videos and earn when fans pay to watch. Monetize your premium content with pay-per-view.",
  },
  {
    icon: FiGift,
    title: "Receive Virtual Gifts",
    description:
      "Fans can purchase and send beautiful virtual gifts to celebrate you and show appreciation.",
  },
  {
    icon: FiTarget,
    title: "Create Fundraising Goals",
    description:
      "Set fundraising goals for projects, equipment, albums, education or events and let fans contribute.",
  },
  {
    icon: FiStar,
    title: "Create Wish Lists",
    description:
      "Create a personal wishlist. Fans can purchase items directly and help make your wishes come true.",
  },
  {
    icon: FiCalendar,
    title: "Birthday Support",
    description:
      "Celebrate birthdays with supporters by sharing a birthday wishlist and receiving gifts or monetary support.",
  },
  {
    icon: FiRadio,
    title: "Go Live",
    description:
      "Start live sessions where fans interact in real time while sending instant tips and virtual gifts.",
  },
  {
    icon: FiBarChart2,
    title: "Creator Dashboard",
    description:
      "Monitor earnings, tips, gifts, goals, withdrawals and transaction history from one dashboard.",
  },
  {
    icon: FiTrendingUp,
    title: "Withdraw Anytime",
    description:
      "Request withdrawals anytime. Every request is verified before funds are transferred to your bank.",
  },
];

export default function CreatorFeatures() {
  return (
    <>
      <CreatorTipBanner className="mt-8" />
      <section className="relative py-28 bg-[#fdfcff] overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-white to-[#f6f1ff]/60" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-[#4C1D95]/10 blur-[120px] rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#15052E]/5 border border-[#15052E]/10">
              <span className="h-2 w-2 rounded-full bg-[#4C1D95] animate-pulse" />
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#15052E]">
                What Tippified Can Do
              </span>
            </div>
            <h2 className="mt-6 text-4xl md:text-[46px] font-extrabold tracking-tight leading-[1.02] text-[#15052E]">
              Everything Creators{" "}
              <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
                Can Do
              </span>
            </h2>
            <p className="text-[15px] text-[#15052E]/60 mt-5 max-w-2xl mx-auto leading-7">
              Multiple ways to monetize your audience while building stronger
              relationships with supporters.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -4 }}
                  className="group relative rounded-3xl p-px bg-linear-to-b from-[#15052E]/10 to-transparent"
                >
                  <div className="rounded-[23px] bg-white p-7 h-full shadow-[0_8px_40px_-20px_rgba(21,5,46,0.12)] group-hover:shadow-[0_18px_50px_-18px_rgba(21,5,46,0.25)] transition-all">
                    <div className="absolute top-0 inset-x-7 h-px bg-linear-to-r from-transparent via-[#4C1D95]/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#15052E] to-[#4C1D95] text-white grid place-items-center shadow-[0_8px_20px_rgba(21,5,46,0.25)]">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-[15.5px] font-bold tracking-tight text-[#15052E] mt-5 mb-2">
                      {f.title}
                    </h3>
                    <p className="text-[13px] leading-6 text-[#15052E]/60">
                      {f.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 relative rounded-3xl p-px bg-linear-to-b from-white/20 to-white/5"
          >
            <div className="rounded-[23px] bg-linear-to-br from-[#15052E] to-[#4C1D95] p-8 md:p-10 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 h-72 w-72 bg-white/10 rounded-full blur-[50px]" />
              <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 mb-4">
                    <FiAward size={14} className="text-white" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white">
                      For Everyone
                    </span>
                  </div>
                  <h3 className="text-[26px] font-extrabold tracking-tight text-white mb-3">
                    Built for Every Creator
                  </h3>
                  <p className="leading-7 text-[14px] text-purple-100/70 max-w-3xl">
                    Whether you are a musician, comedian, streamer, gamer,
                    artist, influencer, podcaster, educator or nonprofit —
                    Tippified provides simple tools for tips, gifts and paid
                    exclusive videos.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="h-14 w-14 rounded-full bg-white text-[#15052E] grid place-items-center shadow-lg">
                    <FiVideo size={22} />
                  </div>
                  <div className="h-14 w-14 rounded-full bg-white/10 border border-white/20 text-white grid place-items-center">
                    <FiDollarSign size={20} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
