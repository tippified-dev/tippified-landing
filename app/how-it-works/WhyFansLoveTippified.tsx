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

const features = [
  {
    icon: HeartIcon,
    title: "Support Your Favourite Creators",
    description:
      "Show appreciation by sending monetary tips to the creators you love, helping them continue creating great content.",
  },

  {
    icon: WalletIcon,
    title: "Preload Your Wallet",
    description:
      "Fund your Tip Wallet once and instantly support creators without completing a new payment every time.",
  },

  {
    icon: GiftIcon,
    title: "Buy & Save Virtual Gifts",
    description:
      "Purchase virtual gifts in advance and store them securely until you're ready to send them.",
  },

  {
    icon: VideoCameraIcon,
    title: "Send Gifts During Live Streams",
    description:
      "While watching creators live, instantly send tips and virtual gifts without interrupting the stream.",
  },

  {
    icon: CakeIcon,
    title: "Celebrate Special Moments",
    description:
      "Support creators on birthdays, milestones and special occasions by sending gifts or fulfilling their wishlists.",
  },

  {
    icon: BoltIcon,
    title: "Fast & Simple",
    description:
      "Supporting creators takes only a few seconds. The process is designed to be quick, simple and enjoyable.",
  },

  {
    icon: ShieldCheckIcon,
    title: "Safe & Secure",
    description:
      "Payments are securely processed through licensed payment partners, while your wallet and purchased gifts remain protected within your Tippified account.",
  },

  {
    icon: ClockIcon,
    title: "Use Anytime",
    description:
      "Wallet balances and purchased virtual gifts remain available until you decide to use them, subject to applicable Terms and Conditions.",
  },
];

export default function WhyFansLoveTippified() {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-purple-700">
            Why Fans Love Tippified
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-8">
            Supporting your favourite creators has never been easier.
            Tippified gives fans a simple, secure and interactive way to
            encourage creators and participate in their journey.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="rounded-3xl border border-gray-200 bg-gray-50 p-8 hover:bg-white hover:shadow-lg hover:border-purple-300 transition-all"
              >
                <div className="bg-purple-100 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">

                  <Icon className="w-8 h-8 text-purple-700" />

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

        <div className="mt-20 rounded-3xl bg-purple-50 border border-purple-200 p-10">

          <h3 className="text-3xl font-bold text-purple-700 mb-6">
            More Than Just Tipping
          </h3>

          <p className="text-gray-700 leading-9 text-lg">
            Tippified is not simply a payment page. It creates meaningful
            interactions between creators and their communities through
            monetary support, virtual gifting, fundraising goals, birthday
            celebrations, wishlists and live experiences—all from one secure
            platform.
          </p>

        </div>

      </div>

    </section>
  );
}