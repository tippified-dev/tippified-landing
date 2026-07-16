"use client";

import {
    BanknotesIcon,
    BuildingLibraryIcon,
    CakeIcon,
    ClipboardDocumentListIcon,
    GiftIcon,
    RocketLaunchIcon,
    VideoCameraIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "Receive Monetary Tips",
    icon: BanknotesIcon,
    description:
      "Receive direct monetary support from fans through your personal Tippified page. Share your unique tipping link anywhere and start earning from your community.",
  },

  {
    title: "Receive Virtual Gifts",
    icon: GiftIcon,
    description:
      "Fans can purchase and instantly send beautiful virtual gifts to celebrate, appreciate and encourage you. Every gift contributes to your earnings.",
  },

  {
    title: "Create Goals",
    icon: RocketLaunchIcon,
    description:
      "Need support for a project? Create fundraising goals for albums, equipment, charity projects, travel, education or any meaningful objective and let your supporters contribute.",
  },

  {
    title: "Birthday Wishlist",
    icon: CakeIcon,
    description:
      "Celebrate your birthday differently by creating a special wishlist that allows fans to purchase gifts and make your day unforgettable.",
  },

  {
    title: "Wishlist",
    icon: ClipboardDocumentListIcon,
    description:
      "Maintain a personal wishlist all year round. Fans can browse your desired items and purchase them directly for you.",
  },

  {
    title: "Go Live",
    icon: VideoCameraIcon,
    description:
      "Host live streaming sessions where fans can watch, interact, send monetary tips and instantly deliver virtual gifts while you are live.",
  },

  {
    title: "Cash Out Anytime",
    icon: BuildingLibraryIcon,
    description:
      "Request withdrawals directly from your dashboard whenever you want. After successful security validation and balance confirmation, your payout is processed to your verified bank account.",
  },
];

export default function CreatorFeatures() {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-purple-700">
            Everything Creators Need
          </h2>

          <p className="text-gray-600 mt-6 max-w-3xl mx-auto text-lg leading-8">
            Tippified provides multiple ways for creators to receive support,
            engage their communities and monetize their audience from one
            secure platform.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="rounded-3xl border border-purple-100 p-8 hover:shadow-xl hover:border-purple-300 transition-all duration-300"
              >
                <div className="flex items-start gap-5">

                  <div className="bg-purple-100 rounded-2xl p-4">

                    <Icon className="w-8 h-8 text-purple-700" />

                  </div>

                  <div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
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

      </div>

    </section>
  );
}