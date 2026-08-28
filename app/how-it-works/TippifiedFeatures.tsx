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
  accent: string;
}

const features: Feature[] = [
  {
    icon: FiDollarSign,
    title: "Receive Monetary Tips",
    description:
      "Receive voluntary financial support from fans anywhere in the world through your unique Tippified tipping page.",
    accent: "from-purple-600 to-indigo-600",
  },
  {
    icon: FiPlayCircle,
    title: "Paid Video Content",
    description:
      "Upload short exclusive videos and earn when fans pay to watch. Monetize your premium content with pay-per-view.",
    accent: "from-violet-600 to-purple-600",
  },
  {
    icon: FiGift,
    title: "Receive Virtual Gifts",
    description:
      "Fans can purchase and send beautiful virtual gifts to celebrate you and show appreciation.",
    accent: "from-fuchsia-500 to-purple-600",
  },
  {
    icon: FiTarget,
    title: "Create Fundraising Goals",
    description:
      "Set fundraising goals for projects, equipment, albums, education or events and let fans contribute.",
    accent: "from-indigo-600 to-violet-600",
  },
  {
    icon: FiStar,
    title: "Create Wish Lists",
    description:
      "Create a personal wishlist. Fans can purchase items directly and help make your wishes come true.",
    accent: "from-purple-500 to-fuchsia-500",
  },
  {
    icon: FiCalendar,
    title: "Birthday Support",
    description:
      "Celebrate birthdays with supporters by sharing a birthday wishlist and receiving gifts or monetary support.",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    icon: FiRadio,
    title: "Go Live",
    description:
      "Start live sessions where fans interact in real time while sending instant tips and virtual gifts.",
    accent: "from-purple-600 to-pink-500",
  },
  {
    icon: FiBarChart2,
    title: "Creator Dashboard",
    description:
      "Monitor earnings, tips, gifts, goals, withdrawals and transaction history from one dashboard.",
    accent: "from-indigo-500 to-purple-600",
  },
  {
    icon: FiTrendingUp,
    title: "Withdraw Anytime",
    description:
      "Request withdrawals anytime. Every request is verified before funds are transferred to your bank.",
    accent: "from-purple-600 to-indigo-600",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function CreatorFeatures() {
  return (
    <>
      <CreatorTipBanner className="mt-8" />
      <section className="py-24 bg-[#fcfbff] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7xl h-320 bg-linear-to-b from-purple-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm mb-5">
              <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-purple-600">
                What Tippified Can Do
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-purple-900">
              Everything Creators Can Do
            </h2>
            <p className="text-[15px] text-gray-600 mt-6 max-w-3xl mx-auto leading-7">
              Tippified gives creators multiple ways to monetize their audience
              while building stronger relationships with supporters.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={item}
                  whileHover={{ y: -6 }}
                  className="group relative bg-white rounded-[1.9rem] border border-purple-100/70 p-7 shadow-[0_12px_40px_-18px_rgba(124,58,237,0.15)] hover:shadow-[0_20px_60px_-18px_rgba(124,58,237,0.25)] hover:border-purple-200 transition-all"
                >
                  <div className="absolute top-0 left-7 right-7 h-px bg-linear-to-r from-transparent via-purple-200/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div
                    className={`h-12 w-12 rounded-2xl bg-linear-to-br ${feature.accent} flex items-center justify-center text-white shadow-md`}
                  >
                    <Icon size={22} />
                  </div>

                  <h3 className="text-[16px] font-bold text-purple-900 mt-5 mb-2.5">
                    {feature.title}
                  </h3>
                  <p className="text-[13.5px] text-gray-600 leading-7">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 relative overflow-hidden rounded-4xl bg-linear-to-br from-purple-700 via-violet-600 to-indigo-600 p-px"
          >
            <div className="rounded-4xl bg-linear-to-br from-purple-700 to-indigo-700 p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 h-72 w-72 bg-white/10 rounded-full blur-3xl" />
              <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4">
                    <FiAward size={14} className="text-white" />
                    <span className="text-[11px] font-bold tracking-widest uppercase text-white">
                      For Everyone
                    </span>
                  </div>
                  <h3 className="text-3xl font-extrabold tracking-tight text-white mb-4">
                    Built for Every Creator
                  </h3>
                  <p className="leading-8 text-[15px] text-purple-100">
                    Whether you are a musician, comedian, streamer, gamer,
                    artist, influencer, podcaster, educator, religious leader or
                    nonprofit, Tippified provides simple tools that enable your
                    community to support your journey - from tips and gifts to
                    paid exclusive videos.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-purple-700 shadow-lg">
                    <FiVideo size={26} />
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                    <FiDollarSign size={22} />
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
