"use client";
import { motion } from "framer-motion";
import {
  BanknotesIcon, BuildingLibraryIcon, CakeIcon,
  ClipboardDocumentListIcon, GiftIcon, RocketLaunchIcon, VideoCameraIcon,
} from "@heroicons/react/24/outline";

const features = [
  { title: "Receive Monetary Tips", icon: BanknotesIcon, description: "Receive direct monetary support from fans through your personal Tippified page. Share your unique tipping link anywhere and start earning." },
  { title: "Receive Virtual Gifts", icon: GiftIcon, description: "Fans can purchase and instantly send beautiful virtual gifts to celebrate, appreciate and encourage you. Every gift contributes to your earnings." },
  { title: "Create Goals", icon: RocketLaunchIcon, description: "Need support for a project? Create fundraising goals for albums, equipment, charity, travel or any meaningful objective." },
  { title: "Birthday Wishlist", icon: CakeIcon, description: "Celebrate your birthday differently by creating a special wishlist that allows fans to make your day unforgettable." },
  { title: "Wishlist", icon: ClipboardDocumentListIcon, description: "Maintain a personal wishlist all year round. Fans can browse your desired items and purchase them directly for you." },
  { title: "Go Live", icon: VideoCameraIcon, description: "Host live streaming sessions where fans can watch, interact, send monetary tips and deliver virtual gifts while you are live." },
  { title: "Cash Out Anytime", icon: BuildingLibraryIcon, description: "Request withdrawals directly from your dashboard. After security validation, your payout is processed to your verified bank account." },
];

export default function CreatorFeatures() {
  return (
    <section className="relative py-28 bg-[#fdfcff] overflow-hidden">
      {/* soft premium bg */}
      <div className="absolute inset-0 bg-linear-to-b from-white via-[#fdfcff] to-[#f6f1ff]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-[#4C1D95]/10 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#15052E]/5 border border-[#15052E]/10 text-[10px] font-extrabold tracking-widest uppercase text-[#15052E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4C1D95]" /> Platform Capabilities
          </div>
          <h2 className="mt-6 text-4xl md:text-[44px] font-extrabold tracking-tight leading-[1.05] text-[#15052E]">
            Everything Creators <br />
            <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">Need to Monetize</span>
          </h2>
          <p className="text-[#15052E]/60 mt-6 max-w-2xl mx-auto text-[15px] leading-7">
            Multiple ways to receive support, engage your community and monetize your audience from one secure, premium platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-3xl p-px bg-linear-to-b from-[#15052E]/10 to-transparent"
              >
                <div className="relative h-full rounded-[23px] bg-white p-7 shadow-[0_8px_40px_-20px_rgba(21,5,46,0.15)] group-hover:shadow-[0_16px_48px_-16px_rgba(21,5,46,0.25)] transition-all duration-500">
                  {/* top shine */}
                  <div className="absolute top-0 inset-x-6 h-px bg-linear-to-r from-transparent via-[#4C1D95]/20 to-transparent opacity-0 group-hover:opacity-100 transition" />

                  <div className="flex items-start gap-5">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-[#15052E] to-[#4C1D95] text-white grid place-items-center shadow-[0_8px_20px_rgba(21,5,46,0.25)] group-hover:scale-105 transition">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[17px] font-bold tracking-tight text-[#15052E] mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-[13.5px] leading-7 text-[#15052E]/60">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}