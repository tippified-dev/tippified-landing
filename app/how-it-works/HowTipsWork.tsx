"use client";
import { motion } from "framer-motion";
import {
  ArrowRightIcon, BanknotesIcon, BuildingLibraryIcon,
  CreditCardIcon, LinkIcon, WalletIcon,
} from "@heroicons/react/24/outline";

const steps = [
  { icon: LinkIcon, title: "Creator Shares Their Tippified Link", description: "Every creator receives a unique profile and tipping link which can be shared on Instagram, TikTok, Facebook, X, YouTube, WhatsApp." },
  { icon: BanknotesIcon, title: "Fan Sends a Tip", description: "The fan opens the creator's page, enters name, chooses amount, optionally leaves a message and proceeds to payment." },
  { icon: CreditCardIcon, title: "Secure Payment via Paystack", description: "Payments are securely processed by Paystack using cards, bank transfers, USSD and other methods. Tippified never touches card data." },
  { icon: BuildingLibraryIcon, title: "Secure Settlement", description: "After successful payment, Paystack settles funds directly into the creator's verified bank account after platform fee deduction." },
  { icon: WalletIcon, title: "Creator Dashboard Updated", description: "Creators can see tracked tips, growth and payouts instantly via their dashboard." },
];

export default function HowTipsWork() {
  return (
    <section className="relative py-28 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[#fdfcff] to-white" />
      <div className="absolute top-20 right-0 w-150 h-150 bg-[#4C1D95]/5 blur-[120px] rounded-full" />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#15052E]/5 border border-[#15052E]/10 text-[10px] font-extrabold tracking-widest uppercase text-[#15052E]">How It Works</div>
          <h2 className="mt-6 text-4xl md:text-[44px] font-extrabold tracking-tight text-[#15052E] leading-[1.05]">
            How Monetary Tips <span className="bg-linearto-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">Work</span>
          </h2>
          <p className="text-[15px] text-[#15052E]/60 max-w-2xl mx-auto mt-5 leading-7">Simple, secure and transparent for both creators and fans — 5 steps from link to payout.</p>
        </div>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-5.5 md:left-7 top-6 bottom-6 w-0.5 bg-linear-to-b from-[#15052E]/20 via-[#4C1D95]/20 to-transparent hidden md:block" />

          <div className="space-y-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="group relative rounded-3xl p-px bg-linear-to-b from-[#15052E]/10 to-transparent"
                >
                  <div className="relative rounded-[23px] bg-white p-6 md:p-7 flex gap-5 md:gap-6 shadow-[0_8px_40px_-20px_rgba(21,5,46,0.12)] group-hover:shadow-[0_16px_48px_-16px_rgba(21,5,46,0.2)] transition">

                    <div className="relative shrink-0">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-linear-to-br from-[#15052E] to-[#4C1D95] text-white grid place-items-center shadow-[0_10px_24px_rgba(21,5,46,0.3)]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-[#15052E]/10 grid place-items-center text-[10px] font-bold text-[#15052E] shadow">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-[16px] md:text-[17px] font-bold tracking-tight text-[#15052E]">{index + 1}. {step.title}</h3>
                      <p className="mt-2 text-[13.5px] leading-7 text-[#15052E]/60">{step.description}</p>
                    </div>

                    {!isLast && <ArrowRightIcon className="hidden lg:block w-5 h-5 text-[#4C1D95]/30 self-center shrink-0" />}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Secure box - premium dark */}
        <div className="mt-14 relative rounded-3xl p-px bg-linear-to-b from-white/20 to-white/5">
          <div className="rounded-[23px] bg-linear-to-br from-[#15052E] to-[#4C1D95] p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-75 h-75 bg-white/10 blur-[60px] rounded-full" />
            <h3 className="relative text-[22px] font-bold tracking-tight">Secure Payment Infrastructure</h3>
            <div className="relative mt-5 space-y-4 text-[13.5px] leading-7 text-purple-100/70">
              <p>Tippified is a <strong className="text-white">creator monetization platform and not a fintech company</strong>. We do not process card payments or operate as a financial institution.</p>
              <p>All payments are securely processed through <strong className="text-white">Paystack</strong> with bank-grade encryption.</p>
              <p>Every tip is tracked and viewable on your creator dashboard in real-time.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}