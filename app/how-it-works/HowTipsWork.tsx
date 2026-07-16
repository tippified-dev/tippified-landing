"use client";

import {
    ArrowRightIcon,
    BanknotesIcon,
    BuildingLibraryIcon,
    CreditCardIcon,
    LinkIcon,
    WalletIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    icon: LinkIcon,
    title: "1. Creator Shares Their Tippified Link",
    description:
      "Every creator receives a unique Tippified profile and tipping link which can be shared on Instagram, TikTok, Facebook, X, YouTube, WhatsApp and other platforms.",
  },

  {
    icon: BanknotesIcon,
    title: "2. Fan Sends a Tip",
    description:
      "The fan opens the creator's page, enters their name, chooses an amount, optionally leaves a message and proceeds to payment.",
  },

  {
    icon: CreditCardIcon,
    title: "3. Secure Payment via Paystack",
    description:
      "Payments are securely processed by Paystack using cards, bank transfers, USSD and other supported payment methods. Tippified never processes card information directly.",
  },

  {
    icon: BuildingLibraryIcon,
    title: "4. Secure Settlement",
    description:
      "After successful payment, Paystack settles the funds. The creator's share is settled through Tippified's regulated banking partner while the applicable platform fee is settled to Grundex Limited.",
  },

  {
    icon: WalletIcon,
    title: "5. Creator Dashboard Updated",
    description:
      "The creator's available balance, transaction history and earnings are updated instantly within their Tippified dashboard.",
  },
];

export default function HowTipsWork() {
  return (
    <section className="py-24 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-purple-700">
            How Monetary Tips Work
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6 leading-8">
            Sending support on Tippified is simple, secure and transparent for
            both creators and fans.
          </p>

        </div>

        <div className="space-y-8">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">

                  <div className="bg-purple-100 rounded-2xl p-5">

                    <Icon className="w-10 h-10 text-purple-700" />

                  </div>

                  <div className="flex-1">

                    <h3 className="text-2xl font-bold mb-3">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 leading-8">
                      {step.description}
                    </p>

                  </div>

                  {index !== steps.length - 1 && (
                    <ArrowRightIcon className="hidden lg:block w-8 h-8 text-purple-500" />
                  )}

                </div>
              </div>
            );
          })}

        </div>

        <div className="mt-16 bg-purple-700 rounded-3xl p-10 text-white">

          <h3 className="text-3xl font-bold mb-6">
            Secure Payment Infrastructure
          </h3>

          <p className="leading-9 mb-5 text-purple-100">
            Tippified is a creator monetization platform and <strong>not a
            fintech company</strong>. We do not process card payments, issue
            electronic money or operate as a financial institution.
          </p>

          <p className="leading-9 mb-5 text-purple-100">
            All payments are securely processed through <strong>Paystack</strong>,
            while creator settlements are managed through our regulated banking
            partner, <strong>Wema Bank</strong>.
          </p>

          <p className="leading-9 text-purple-100">
            Tippified maintains a secure internal ledger that records each
            creator&apos; earnings, transaction history, virtual gifts, goals,
            withdrawals and wallet balances.
          </p>

        </div>

      </div>

    </section>
  );
}