"use client";

import {
    CreditCardIcon,
    EnvelopeIcon,
    EyeSlashIcon,
    GlobeAltIcon,
    InformationCircleIcon,
    LockClosedIcon,
    PencilSquareIcon,
    ShieldCheckIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";

export default function PrivacyPolicyClient() {
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
      title: "Privacy Policy",
      icon: InformationCircleIcon,
      content:
        "At Tippified, we respect your privacy and are committed to protecting the personal data of creators and fans who use our platform.",
    },
    {
      title: "1. Information We Collect",
      icon: UserIcon,
      content:
        "We may collect personal information such as name, email, and account details. Payment data is processed securely by Paystack. Transaction and usage data may also be collected for service improvement.",
    },
    {
      title: "2. How We Use Your Information",
      icon: PencilSquareIcon,
      content:
        "Your information is used to provide our services, process payments, communicate account updates, prevent fraud, and comply with legal requirements.",
    },
    {
      title: "3. How We Share Your Information",
      icon: GlobeAltIcon,
      content:
        "We do not sell your personal data. We may share necessary data with trusted partners such as Paystack and OPay, or with regulators where legally required.",
    },
    {
      title: "4. Data Security",
      icon: LockClosedIcon,
      content:
        "We use industry-standard security measures to protect your information. Sensitive data is encrypted and transmitted securely.",
    },
    {
      title: "5. Cookies and Tracking",
      icon: EyeSlashIcon,
      content:
        "We use cookies and similar technologies to enhance user experience and analyze platform performance. You can manage cookie settings via your browser.",
    },
    {
      title: "6. Your Rights",
      icon: ShieldCheckIcon,
      content:
        "You have the right to access, correct, or request deletion of your data. You may opt out of marketing communications at any time.",
    },
    {
      title: "7. Children’s Privacy",
      icon: ShieldCheckIcon,
      content:
        "Tippified does not knowingly collect personal information from children under 13 years of age. Any such data will be deleted upon discovery.",
    },
    {
      title: "8. Third-Party Services",
      icon: CreditCardIcon,
      content:
        "Payments are processed by Paystack and creator wallets are provided by OPay. Their privacy practices are governed by their own policies:",
    },
    {
      title: "9. Changes to This Policy",
      icon: PencilSquareIcon,
      content:
        "We may update this Privacy Policy periodically. Continued use of Tippified means you accept the updated policy.",
    },
    {
      title: "10. Contact Us",
      icon: EnvelopeIcon,
      content:
        "If you have questions about this Privacy Policy, contact us at support@tippified.com.",
    },
  ];

  return (
    <>
      <NavBar />

      <main className="bg-white text-gray-900 min-h-screen px-6 py-20 max-w-4xl mx-auto">
        {/* ✅ SEO H1 */}
        <h1 className="text-4xl font-bold mb-10 text-center text-purple-700">
          Tippified Privacy Policy
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
              style={{ transitionDelay: `${i * 100}ms`}}
            >
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-purple-800">
                <Icon className="w-6 h-6 text-purple-600" />
                {section.title}
              </h2>

              <p className="text-gray-700 leading-relaxed">
                {section.content}
              </p>

              {/* Partner Privacy Links */}
              {section.title === "8. Third-Party Services" && (
                <ul className="mt-3 list-disc pl-6 text-purple-700">
                  <li>
                    <a
                      href="https://paystack.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-purple-900"
                    >
                      Paystack Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.opayweb.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-purple-900"
                    >
                      OPay Privacy Policy
                    </a>
                  </li>
                </ul>
              )}
            </div>
          );
        })}

        <footer className="py-6 bg-gray-800 text-gray-300 text-center text-sm md:text-base mt-16">
          &copy; {new Date().getFullYear()} Tippified. All rights reserved.
          <p className="text-xs text-gray-500">
            A product of Grundex Limited (Nigeria).
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