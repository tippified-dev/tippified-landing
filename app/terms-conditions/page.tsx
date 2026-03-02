import { Metadata } from "next";
import TermsClient from "./TermsClient";

/* ✅ SEO Metadata */
export const metadata: Metadata = {
  title: "Terms and Conditions | Tippified",
  description:
    "Read Tippified’s Terms and Conditions. Learn about user eligibility, payments, withdrawals, platform fees, and Nigerian legal compliance.",
  keywords: [
    "Tippified terms",
    "tipping platform Nigeria",
    "Paystack payments",
    "OPay wallet",
    "Grundex Limited",
    "creator tipping platform",
    "tippified",
    "tipping platform",
    "Nigerian creators",
    "influencers",
  ],
  alternates: {
    canonical: "https://tippified.com/terms-conditions",
  },
};

export default function TermsPage() {
  return <TermsClient />;
}