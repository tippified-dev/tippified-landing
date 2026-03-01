import {
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Metadata } from "next";
import { useState } from "react";
import NavBar from "../components/NavBar";

/* ✅ SEO METADATA */
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
    "tippified",
    "how may we help you?",
    "tippified creators support",
    "tippified cares",
    "Nigerian creators",
    "fans support",
    "crowd funding",
  ],
  alternates: {
    canonical: "https://tippified.com/contact-us",
  },
};

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <NavBar />

      <main className="bg-white text-gray-900 min-h-screen px-6 py-20 max-w-4xl mx-auto">
        {/* HERO */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-700 mb-3">
            Contact Tippified
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Need help or want to partner with us? Send us a message and our team
            will respond shortly.
          </p>
        </header>

        {/* CONTACT INFO */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full text-purple-700 font-medium shadow-sm">
            <EnvelopeIcon className="w-5 h-5" />
            support@tippified.com
          </div>
        </div>

        {submitted ? (
          <div className="text-green-600 text-center text-lg font-medium bg-green-50 p-4 rounded-lg shadow">
            Thank you! Your message has been sent successfully.
          </div>
        ) : (
          <form
            className="space-y-5 bg-purple-50 p-6 rounded-xl shadow-md"
            onSubmit={handleSubmit}
            aria-label="Contact Tippified form"
          >
            {/* NAME */}
            <div className="relative">
              <UserIcon className="w-5 h-5 absolute left-3 top-3 text-purple-600" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full border pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 absolute left-3 top-3 text-purple-600" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full border pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>

            {/* MESSAGE */}
            <div className="relative">
              <ChatBubbleLeftRightIcon className="w-5 h-5 absolute left-3 top-3 text-purple-600" />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={6}
                className="w-full border pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              Send Message
            </button>
          </form>
        )}

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