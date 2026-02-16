"use client";

import { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";

export default function PrivacyPolicy() {
  // Refs for each section
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const [visibleSections, setVisibleSections] = useState<boolean[]>([]);

  // Helper for Intersection Observer
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
      content: `At Tippified, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard the data of both creators and fans who use our platform.`,
    },
    {
      title: "1. Information We Collect",
      content: `We may collect personal info, payment details via Paystack, usage data, and transaction records to provide and improve our services.`,
    },
    {
      title: "2. How We Use Your Information",
      content: `We use your data to provide services, process payments, communicate account activity, prevent fraud, and comply with legal obligations.`,
    },
    {
      title: "3. How We Share Your Information",
      content: `We do not sell your data. We may share information with payment processors, legal authorities, or trusted service providers as needed.`,
    },
    {
      title: "4. Data Security",
      content: `We implement industry-standard security measures to protect your data. Sensitive info is encrypted and transmitted securely.`,
    },
    {
      title: "5. Cookies and Tracking",
      content: `We use cookies and similar technologies to enhance your experience. You can manage cookies via your browser settings.`,
    },
    {
      title: "6. Your Rights",
      content: `You can access, correct, or delete your data and opt out of marketing communications. Contact us at support@tippified.com to exercise these rights.`,
    },
    {
      title: "7. Children’s Privacy",
      content: `Tippified does not knowingly collect data from individuals under 13. If discovered, we delete such info.`,
    },
    {
      title: "8. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. Changes will be reflected on this page.`,
    },
    {
      title: "9. Contact Us",
      content: `Questions? Email support@tippified.com or visit https://www.tippified.com.`,
    },
  ];

  return (
    <>
      <NavBar />
      <main className="bg-white text-gray-900 min-h-screen px-6 py-20 max-w-4xl mx-auto">
        {sections.map((section, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) sectionRefs.current[i] = el;
            }}
            className={`mb-8 transition-all duration-700 ease-out ${
              visibleSections[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
            <p className="text-gray-700">{section.content}</p>
          </div>
        ))}

        <footer className="py-6 bg-gray-800 text-gray-300 text-center text-sm md:text-base mt-16">
          &copy; {new Date().getFullYear()} Tippified. All rights reserved.
          <p className="text-xs text-gray-500 text-center">
            A product of Grundex Limited.
          </p>
        </footer>
      </main>
    </>
  );
}