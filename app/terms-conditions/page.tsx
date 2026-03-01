"use client"

import {
  BanknotesIcon,
  CreditCardIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  LockClosedIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Metadata } from "next";
import { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";

/* ✅ SEO METADATA */
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

export default function TermsAndConditions() {
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const [visibleSections, setVisibleSections] = useState<boolean[]>([]);

  const observeElement = (el: HTMLElement | null, index: number) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
  };

  useEffect(() => {
    sectionRefs.current.forEach((el, i) => observeElement(el, i));
  }, []);

  const sections = [
    {
      title: "Terms and Conditions",
      icon: InformationCircleIcon,
      content:
        "Welcome to Tippified. By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions governing your use of our services.",
    },
    {
      title: "1. Eligibility",
      icon: UserIcon,
      content:
        "You must be at least 18 years old and legally capable of entering contracts in Nigeria to use Tippified. Use of the platform by minors or unauthorized users is prohibited.",
    },
    {
      title: "2. Account Creation",
      icon: PencilSquareIcon,
      content:
        "Users must provide accurate and complete information when creating an account. You are responsible for safeguarding your login credentials and activities under your account.",
    },
    {
      title: "3. Cashout and Deductions",
      icon: BanknotesIcon,
      content:
        "All withdrawals are subject to a 10% platform fee. Cashout requests may be delayed for verification, fraud checks, or system maintenance.",
    },
    {
      title: "4. Account Freezing",
      icon: LockClosedIcon,
      content:
        "Tippified reserves the right to freeze accounts where suspicious activity or fraud is detected. Accounts will be restored after verification.",
    },
    {
      title: "5. User Responsibilities",
      icon: ShieldCheckIcon,
      content:
        "Users must not engage in illegal activities, including fraud, money laundering, or any act that violates Nigerian law.",
    },
    {
      title: "6. Nigerian Law Compliance",
      icon: GlobeAltIcon,
      content:
        "Tippified is operated by Grundex Limited, a Nigerian registered company, and complies with Nigerian financial and electronic transaction regulations.",
    },
    {
      title: "7. Payment Gateway",
      icon: CreditCardIcon,
      content:
        "All payments are processed through Paystack. Tippified is not responsible for errors or processing delays caused by Paystack.",
    },
    {
      title: "8. Termination of Services",
      icon: ExclamationTriangleIcon,
      content:
        "Tippified may suspend or terminate accounts that violate these Terms. Remaining balances will be processed after applicable deductions.",
    },
    {
      title: "9. Limitation of Liability",
      icon: ShieldCheckIcon,
      content:
        "Tippified is not liable for indirect or consequential damages arising from use of the platform. Services are provided on an ‘as-is’ basis.",
    },
    {
      title: "10. Changes to Terms",
      icon: PencilSquareIcon,
      content:
        "These Terms may be updated periodically. Continued use of Tippified signifies acceptance of updated Terms.",
    },
    {
      title: "11. Contact Us",
      icon: EnvelopeIcon,
      content:
        "For enquiries regarding these Terms, contact us at support@tippified.com.",
    },
  ];

  return (
    <>
      <NavBar />

      <main className="bg-white text-gray-900 min-h-screen px-6 py-20 max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-bold mb-10 text-center text-purple-700">
          Tippified Terms and Conditions
        </h1>

        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <div
              key={i}
              ref={(el) => {
                if (el) sectionRefs.current[i] = el;
              }}
              className={`mb-8 transition-all duration-700 ease-out ${
                visibleSections[i]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-purple-800">
                <Icon className="w-6 h-6 text-purple-600" />
                {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {section.content}
              </p>
            </div>
          );
        })}

        <footer className="py-6 bg-gray-800 text-gray-300 text-center text-sm md:text-base mt-16">
          &copy; {new Date().getFullYear()} Tippified. All rights reserved.
          <p className="text-xs text-gray-500 text-center">
            A product of Grundex Limited.
          </p>
        </footer>

        {/* FLOATING ABOUT BUTTON */}
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