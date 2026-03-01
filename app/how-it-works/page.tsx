

import {
    ArrowRightIcon,
    BanknotesIcon,
    CheckCircleIcon,
    CreditCardIcon,
    GlobeAltIcon,
    InformationCircleIcon,
    LinkIcon,
    UserPlusIcon,
    WalletIcon,
} from "@heroicons/react/24/outline";
import { Metadata } from "next";
import NavBar from "../components/NavBar";

/* ================= SEO ================= */
export const metadata: Metadata = {
  title: "How Tippified Works | Creator Tipping Platform in Nigeria",
  description:
    "Learn how Tippified works for creators and fans. Creators receive tips via OPay wallets while fans tip securely using Paystack payment gateway.",
  keywords: [
    "how Tippified works",
    "tipping platform Nigeria",
    "OPay wallet",
    "Paystack payment",
    "creator tipping",
    "support Nigerian creators",
    "tippified",
    "tipping platform in Nigeria",
    "creators",
    "Nigeria influencers",
    "fans support",
    "crowd funding",
    "creators goals",
    "tip a creator",
    "support a creator",
    "tippified.com",


  ],
  alternates: {
    canonical: "https://tippified.com/how-it-works",
  },
};

export default function HowItWorks() {
  return (
    <>
      <NavBar />

      <main className="bg-white text-gray-900 min-h-screen px-6 py-20 max-w-6xl mx-auto">
        {/* HERO */}
        <header className="text-center mb-14">
          <h1 className="text-4xl font-bold text-purple-700 mb-4">
            How Tippified Works
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Tippified helps creators receive tips from fans securely and
            transparently. Payments are powered by Paystack and funds are stored
            in OPay wallets for easy access and withdrawals.
          </p>
        </header>

        {/* ===== FOR CREATORS ===== */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
            For Creators
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* STEP 1 */}
            <div className="bg-purple-50 p-6 rounded-xl shadow-md">
              <UserPlusIcon className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                1. Sign Up on Tippified
              </h3>
              <p className="text-gray-700">
                Creators register on Tippified and accept our terms and
                conditions. During signup, an OPay wallet is created for the
                creator if they do not already have one.
              </p>
            </div>

            {/* STEP 2 */}
            <div className="bg-purple-50 p-6 rounded-xl shadow-md">
              <LinkIcon className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                2. Get a Unique Tipping Link
              </h3>
              <p className="text-gray-700">
                Each creator receives a personal tipping link. This link can be
                shared on social media platforms like Instagram, TikTok,
                YouTube, WhatsApp, and X (Twitter).
              </p>
            </div>

            {/* STEP 3 */}
            <div className="bg-purple-50 p-6 rounded-xl shadow-md">
              <WalletIcon className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                3. Receive Tips in OPay Wallet
              </h3>
              <p className="text-gray-700">
                When fans send tips, funds are settled into the creator’s OPay
                wallet after payment confirmation from Paystack.
              </p>
            </div>

            {/* STEP 4 */}
            <div className="bg-purple-50 p-6 rounded-xl shadow-md">
              <BanknotesIcon className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                4. Withdraw to Any Bank
              </h3>
              <p className="text-gray-700">
                Creators can withdraw funds from their OPay wallet to any
                Nigerian bank account directly or through the Tippified
                dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* ===== FOR FANS ===== */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
            For Fans & Supporters
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* STEP 1 */}
            <div className="bg-purple-50 p-6 rounded-xl shadow-md">
              <GlobeAltIcon className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                1. Open Creator’s Link
              </h3>
              <p className="text-gray-700">
                Fans click the creator’s Tippified link from social media or
                websites and land on the creator’s tipping page.
              </p>
            </div>

            {/* STEP 2 */}
            <div className="bg-purple-50 p-6 rounded-xl shadow-md">
              <CreditCardIcon className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                2. Choose Amount & Currency
              </h3>
              <p className="text-gray-700">
                Fans enter their name, select the amount and currency, and
                proceed to Paystack’s secure checkout page.
              </p>
            </div>

            {/* STEP 3 */}
            <div className="bg-purple-50 p-6 rounded-xl shadow-md">
              <ArrowRightIcon className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                3. Pay Securely via Paystack
              </h3>
              <p className="text-gray-700">
                Fans complete payment using cards, bank transfer, or USSD
                through Paystack’s secure infrastructure.
              </p>
            </div>

            {/* STEP 4 */}
            <div className="bg-purple-50 p-6 rounded-xl shadow-md">
              <CheckCircleIcon className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                4. Tip Delivered Instantly
              </h3>
              <p className="text-gray-700">
                Once payment is confirmed, Tippified updates the creator’s
                dashboard and sends a notification email.
              </p>
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="bg-purple-700 text-white rounded-xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Secure & Compliant</h2>
          <p className="max-w-3xl mx-auto text-lg">
            Tippified does not directly hold customer funds. Payments are
            processed by Paystack, while creator balances are managed in OPay
            wallets. This ensures regulatory compliance, transparency, and
            secure financial operations.
          </p>
        </section>

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