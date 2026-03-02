import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Metadata } from "next";
import NavBar from "../components/NavBar";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Tippified | Support & Help Center",
  description:
    "Contact Tippified for support, partnerships, or inquiries. We help creators and fans connect through secure tipping powered by Paystack and OPay.",
  keywords: [
    "Contact Tippified",
    "Tippified support",
    "creator tipping Nigeria",
    "Paystack payments",
    "OPay wallet",
    "Grundex Limited",
  ],
  alternates: { canonical: "https://tippified.com/contact-us" },
};

export default function ContactUsPage() {
  return (
    <>
      <NavBar />
      <main className="bg-white text-gray-900 min-h-screen px-6 py-20 max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-700 mb-3">Contact Tippified</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Need help or want to partner with us? Send us a message and our team will respond shortly.
          </p>
        </header>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full text-purple-700 font-medium shadow-sm">
            <InformationCircleIcon className="w-5 h-5" />
            support@tippified.com
          </div>
        </div>

        <ContactForm />

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