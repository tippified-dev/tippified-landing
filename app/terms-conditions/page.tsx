"use client";

import { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";

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
      content: `Welcome to Tippified. By using our platform, you agree to comply with these Terms and Conditions. These rules govern your access and use of the Tippified platform, services, and any associated features.`,
    },
    {
      title: "1. Eligibility",
      content: `You must be at least 18 years old and legally capable of entering contracts in Nigeria to use Tippified. Use of the platform by minors or unauthorized users is strictly prohibited.`,
    },
    {
      title: "2. Account Creation",
      content: `All users must provide accurate and truthful information when registering. You are responsible for maintaining the confidentiality of your account credentials.`,
    },
    {
      title: "3. Cashout and Deductions",
      content: `All cashouts and withdrawals from Tippified are subject to a 10% platform fee on the total amount. Cashout requests may not be processed immediately and may require manual approval. We reserve the right to delay processing in certain circumstances, such as fraud checks or system maintenance.`,
    },
    {
      title: "4. Account Freezing",
      content: `Tippified reserves the right to freeze or temporarily suspend any account if suspicious activity or potential fraud is detected. Users will be notified, and accounts will be unfrozen after verification.`,
    },
    {
      title: "5. User Responsibilities",
      content: `You agree not to engage in any illegal or unauthorized activity on the platform, including fraudulent tipping, money laundering, or violation of Nigerian laws.`,
    },
    {
      title: "6. Nigerian Law Compliance",
      content: `Tippified is a product of a registered Nigerian company (Grundex Limited) and operates in compliance with Nigerian financial, taxation, and electronic transaction laws. Users must comply with all applicable Nigerian regulations while using our services.`,
    },
    {
      title: "7. Payment Gateway",
      content: `All payments are processed through Paystack. Tippified is not responsible for any errors or delays in the processing of payments by Paystack.`,
    },
    {
      title: "8. Termination of Services",
      content: `Tippified reserves the right to terminate or suspend services to any user who violates these terms or engages in harmful behavior. Upon termination, pending balances will be processed according to the 10% deduction policy.`,
    },
    {
      title: "9. Limitation of Liability",
      content: `Tippified is not liable for indirect, incidental, or consequential damages resulting from the use of the platform. We strive to provide secure and reliable services, but errors or delays may occur.`,
    },
    {
      title: "10. Changes to Terms",
      content: `We may update these Terms and Conditions from time to time. Users are encouraged to review them regularly. Continued use of Tippified constitutes acceptance of any updated terms.`,
    },
    {
      title: "11. Contact Us",
      content: `For questions regarding these Terms and Conditions, please contact support@tippified.com.`,
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