import { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Tippified",
  description:
    "Read Tippified’s Privacy Policy. Learn how we collect, use, and protect user data. Payments powered by Paystack and wallets provided by OPay.",
  keywords: [
    "Tippified privacy policy",
    "creator tipping platform Nigeria",
    "Paystack privacy",
    "OPay wallet privacy",
    "Grundex Limited",
    "data protection Nigeria",
    "tippified",
    "privacy",
    "creators",
    "Nigerian creators",
    "tipping platform for creators",
    "crowd funding",
    "fans support",
    "tippified.com",
    "website",
  ],
  alternates: {
    canonical: "https://tippified.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}