"use client";

import {
    BoltIcon,
    GiftIcon,
    ShieldCheckIcon,
    UserPlusIcon,
    WalletIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: WalletIcon,
    title: "Tip Wallet",
    description:
      "Fans can preload money into their Tippified Tip Wallet and use the balance to instantly support creators without making a fresh payment every time.",
  },

  {
    icon: GiftIcon,
    title: "Gift Wallet",
    description:
      "Fans can purchase virtual gifts in advance and store them safely inside their Gift Wallet until they are ready to send them to creators.",
  },

  {
    icon: BoltIcon,
    title: "Instant During Live Streams",
    description:
      "While watching a creator's live session, fans can instantly send tips or virtual gifts directly from their funded wallets without leaving the live stream.",
  },

  {
    icon: ShieldCheckIcon,
    title: "Safe & Secure",
    description:
      "Wallet balances and purchased virtual gifts remain securely associated with the fan's Tippified account and can be used whenever they choose.",
  },

  {
    icon: UserPlusIcon,
    title: "Quick Registration",
    description:
      "Creating a fan wallet is simple. Fans only need to provide their name and email address before funding their wallets or purchasing virtual gifts.",
  },
];

export default function FanWallet() {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-purple-700">
            Fan Wallets
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-8">
            Tippified allows fans to prepare ahead by funding wallets and
            purchasing virtual gifts before supporting their favourite creators.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-3xl p-8 hover:border-purple-400 transition-all shadow-sm hover:shadow-lg"
              >
                <div className="flex items-start gap-5">

                  <div className="bg-purple-100 rounded-2xl p-4">
                    <Icon className="w-9 h-9 text-purple-700" />
                  </div>

                  <div>

                    <h3 className="text-2xl font-bold mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 leading-8">
                      {feature.description}
                    </p>

                  </div>

                </div>
              </div>
            );
          })}

        </div>

        <div className="mt-16 rounded-3xl bg-purple-50 border border-purple-200 p-10">

          <h3 className="text-3xl font-bold text-purple-700 mb-6">
            Why Use a Fan Wallet?
          </h3>

          <ul className="space-y-4 text-gray-700 leading-8 list-disc pl-6">
            <li>No need to complete a payment every time you want to support a creator.</li>
            <li>Instant tipping during live streams.</li>
            <li>Store virtual gifts for birthdays, celebrations and special events.</li>
            <li>Never miss a live moment because you are trying to complete a payment.</li>
            <li>Balances remain available until you decide to use them, subject to applicable Terms and Conditions.</li>
          </ul>

        </div>

      </div>

    </section>
  );
}