"use client";
import {
  BoltIcon,
  GiftIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const features = [
  {
    icon: WalletIcon,
    title: "Tip Wallet",
    description:
      "Fans can preload money into their Tippified Tip Wallet and use the balance to instantly support creators without a fresh payment every time.",
  },
  {
    icon: GiftIcon,
    title: "Gift Wallet",
    description:
      "Purchase virtual gifts in advance and store them safely inside your Gift Wallet until ready to send.",
  },
  {
    icon: BoltIcon,
    title: "Instant During Live Streams",
    description:
      "While watching a live session, fans can instantly send tips or gifts directly from funded wallets without leaving the stream.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Safe & Secure",
    description:
      "Wallet balances and purchased gifts remain securely tied to your account and can be used whenever you choose.",
  },
  {
    icon: UserPlusIcon,
    title: "Quick Registration",
    description:
      "Creating a fan wallet is simple. Just name and email before funding wallets or purchasing gifts.",
  },
];

export default function FanWallet() {
  return (
    <section className="relative py-28 bg-[#fdfcff] overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-white to-[#f6f1ff]/60" />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-200 h-100 bg-[#4C1D95]/10 blur-[100px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex px-4 py-1.5 rounded-full bg-[#15052E]/5 border border-[#15052E]/10 text-[10px] font-extrabold tracking-widest uppercase text-[#15052E]">
            For Fans
          </div>
          <h2 className="mt-6 text-4xl md:text-[44px] font-extrabold tracking-tight text-[#15052E] leading-[1.05]">
            Fan{" "}
            <span className="bg-linear-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
              Wallets
            </span>
          </h2>
          <p className="mt-5 text-[15px] leading-7 text-[#15052E]/60 max-w-2xl mx-auto">
            Prepare ahead by funding wallets and buying gifts before supporting
            your favourite creators.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-3xl p-px bg-linear-to-b from-[#15052E]/10 to-transparent"
              >
                <div className="rounded-[23px] bg-white p-7 flex gap-5 shadow-[0_8px_40px_-20px_rgba(21,5,46,0.12)] group-hover:shadow-[0_16px_48px_-16px_rgba(21,5,46,0.2)] transition">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-[#15052E] to-[#4C1D95] grid place-items-center text-white shadow-[0_8px_20px_rgba(21,5,46,0.25)]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#15052E] tracking-tight">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-7 text-[#15052E]/60">
                      {f.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Why Use */}
        <div className="mt-14 relative rounded-3xl p-px bg-linear-to-b from-[#15052E]/20 to-transparent">
          <div className="rounded-[23px] bg-linear-to-br from-[#15052E] to-[#4C1D95] p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-75 h-75 bg-white/10 blur-[60px] rounded-full" />
            <h3 className="relative text-white text-[22px] font-bold tracking-tight">
              Why Use a Fan Wallet?
            </h3>
            <ul className="relative mt-6 grid md:grid-cols-2 gap-3">
              {[
                "No need to complete a payment every time you support a creator",
                "Instant tipping during live streams",
                "Store virtual gifts for birthdays & special events",
                "Never miss a live moment because of payment",
                "Balances remain available until you use them",
              ].map((t) => (
                <li
                  key={t}
                  className="flex gap-2.5 text-[13.5px] leading-6 text-purple-100/70"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />{" "}
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
