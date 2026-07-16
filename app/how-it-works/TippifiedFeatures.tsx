"use client";

import {
    ArrowTrendingUpIcon,
    BanknotesIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    GiftIcon,
    SignalIcon,
    StarIcon,
    TrophyIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: BanknotesIcon,
    title: "Receive Monetary Tips",
    description:
      "Receive voluntary financial support from fans anywhere in the world through your unique Tippified tipping page.",
  },

  {
    icon: GiftIcon,
    title: "Receive Virtual Gifts",
    description:
      "Fans can purchase and send beautiful virtual gifts to celebrate you, support your work or simply show appreciation.",
  },

  {
    icon: TrophyIcon,
    title: "Create Fundraising Goals",
    description:
      "Set fundraising goals for projects, equipment, albums, education, charity, travel, events or any meaningful purpose and allow fans to contribute towards achieving them.",
  },

  {
    icon: StarIcon,
    title: "Create Wish Lists",
    description:
      "Create a personal wishlist containing items you would love to receive. Fans can purchase items directly and help make your wishes come true.",
  },

  {
    icon: CalendarDaysIcon,
    title: "Birthday Support",
    description:
      "Celebrate birthdays with your supporters by sharing a birthday wishlist and allowing fans to surprise you with gifts or monetary support.",
  },

  {
    icon: SignalIcon,
    title: "Go Live",
    description:
      "Start live streaming sessions where fans can interact with you in real time while sending instant tips and virtual gifts throughout the broadcast.",
  },

  {
    icon: ChartBarIcon,
    title: "Creator Dashboard",
    description:
      "Monitor your earnings, tips, gifts, fundraising goals, withdrawals, supporters and transaction history from a single dashboard.",
  },

  {
    icon: ArrowTrendingUpIcon,
    title: "Withdraw Anytime",
    description:
      "Request withdrawals from your available balance at any time. Every request is verified before funds are transferred to your verified bank account.",
  },
];

export default function CreatorFeatures() {
  return (
    <section className="py-24 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-purple-700">
            Everything Creators Can Do
          </h2>

          <p className="text-lg text-gray-600 mt-6 max-w-3xl mx-auto leading-8">
            Tippified gives creators multiple ways to monetize their audience
            while building stronger relationships with their supporters.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all"
              >
                <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-9 h-9 text-purple-700" />
                </div>

                <h3 className="text-xl font-bold mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-8">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

        <div className="mt-20 bg-purple-700 rounded-3xl text-white p-10">

          <h3 className="text-3xl font-bold mb-6">
            Built for Every Creator
          </h3>

          <p className="leading-8 text-lg">
            Whether you are  a musician, content creator, streamer, comedian,
            gamer, artist, influencer, podcaster, educator, public speaker,
            religious leader, nonprofit organisation or celebrity, Tippified
            provides simple tools that enable your community to support your
            journey financially in meaningful ways.
          </p>

        </div>

      </div>

    </section>
  );
}