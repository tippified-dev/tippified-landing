import {
  BanknotesIcon,
  CreditCardIcon,
  FolderIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UserPlusIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { Metadata } from "next";
import AdsterraBanner from "../components/AdsterraBanner";
import NativeBannerAd from "../components/NativeBannerAd";
import NavBar from "../components/NavBar";

/* ================= SEO ================= */
export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Tippified",
  description:
    "Find answers to common questions about Tippified. Learn how tipping works, how creators receive settlements through our regulated banking partner, Wema Bank, and how fans pay securely using Paystack.",
  keywords: [
    "Tippified FAQ",
    "tipping platform Nigeria",
    "content creators",
    "Paystack payments",
    "creator tipping",
    "support  creators",
    "frequently asked questions",
    "tippified",
    "tip a creator",
    "support a creator",
    "tipping platform",
    "creators goals",
    "tippified.com",
  ],
  alternates: {
    canonical: "https://tippified.com/faq",
  },
};

const faqs = [
  {
    icon: UserGroupIcon,
    q: "What is Tippified?",
    a: "Tippified is an all-in-one creator monetization platform that allows fans to support creators through monetary tips, goal contributions, virtual gifts, and wishlist purchases. Payments and settlements are securely processed by our payment partners.",
  },
  {
    icon: WalletIcon,
    q: "How do creators get paid?",
    a: "Payments are managed by our payment partners, creators get their funds directly into their payout bank account.",
  },
  {
    icon: UserPlusIcon,
    q: "Who can signup or use tippified?",
    a: " If you are a creator of any sort, you have fans and supporters, then, tippified is for you.",
  },
  {
    icon: CreditCardIcon,
    q: "How do fans make payments?",
    a: "Fans make payments using any of the payment methods provided by our payment partners. Supported methods include debit cards, bank transfer, and USSD, depending on availability.",
  },
  {
    icon: ShieldCheckIcon,
    q: "Does Tippified hold user funds?",
    a: "No. Tippified does not operate as a bank or hold customer deposits. Payments are securely processed and settled by Payment partners, Tippified only maintains a track record of tip and gift transactions.",
  },
  {
    icon: GlobeAltIcon,
    q: "Can people outside Nigeria send tips?",
    a: "Yes. Fans from anywhere in the world can send tips using our payment partner's international payment support, depending on card and country availability.",
  },
  {
    icon: BanknotesIcon,
    q: "Is there a fee for withdrawals?",
    a: "Tippified may charge a small platform fee where applicable. Standard banking or payment processing fees may also apply depending on your bank and our payment partners.",
  },
  {
    icon: ShieldCheckIcon,
    q: "Is Tippified safe and legal?",
    a: "Yes. Tippified is a product of Grundex Limited, a registered Nigerian company. We operate in compliance with Nigerian financial and electronic transaction regulations.",
  },
  {
    icon: UserGroupIcon,
    q: "Do fans need an account to tip?",
    a: "No. Fans do not need to create an account. They simply open the creator’s link, enter an amount, and pay securely via checkouts provided by our payment partners.",
  },
  {
    icon: ShieldCheckIcon,
    q: "What happens if a payment fails?",
    a: "If a payment fails or is reversed by Partners, the creator will not receive the funds. Fans can retry payment or contact our partner for payment-related issues.",
  },
  {
    icon: FolderIcon,
    q: "Can a creator get paid for watched content on Tippified?",
    a: "Yes. Tippified has a feature that let creators upload exclusive short videos and images, set a price and fans pay to watch this content provided they are still active and not expired. However, the content is only available for 24 hours after being uploaded before it expires.",
  },
  {
    icon: UserGroupIcon,
    q: "How can I contact Tippified?",
    a: "You can reach our support team by email at support@tippified.com or through the Contact Us page on our website.",
  },
];

export default function FAQPage() {
  return (
    <>
      <NavBar />

      <main className="bg-white text-gray-900 min-h-screen px-6 py-20 max-w-5xl mx-auto">
        {/* HERO */}
        <header className="text-center mb-14">
          <QuestionMarkCircleIcon className="w-16 h-16 md:w-14 md:h-14 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-purple-700 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Here are answers to the most common questions about Tippified,
            including how fans make payments, how creators receive settlements,
            and how we keep every transaction secure.
          </p>
        </header>
        <AdsterraBanner />

        {/* FAQ LIST */}
        <section className="space-y-6">
          {faqs.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="border border-purple-100 rounded-xl p-6 shadow-sm hover:shadow-md transition bg-purple-50"
              >
                <div className="flex items-start gap-4">
                  <Icon className="w-8 h-8 md:w-6 md:h-6 text-purple-600 mt-1 shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{item.q}</h2>
                    <p className="text-gray-700 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
        <NativeBannerAd />

        {/* FOOTER */}
        <footer className="py-8 text-center text-sm text-gray-500 mt-16">
          &copy; {new Date().getFullYear()} Tippified. A product of Grundex
          Limited.
        </footer>

        <a
          href="/about"
          className="fixed right-4 bottom-20 md:bottom-10 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition transform hover:scale-105"
          aria-label="About Tippified"
        >
          <InformationCircleIcon className="w-7 h-7 md:w-8 md:h-8" />
        </a>
      </main>
    </>
  );
}
