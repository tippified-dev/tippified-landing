"use client";

import {
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div>
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
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
            Send Message
          </button>
        </form>
      )}
      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-2">Or reach us on social media:</p>
        <div className="flex justify-center gap-6">
          <a
            href="https://instagram.com/tippified_app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 transition"
            aria-label="Instagram"
          >
            <FaInstagram className="w-6 h-6" />
          </a>

          <a
            href="https://facebook.com/tippified"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 transition"
            aria-label="Facebook"
          >
            <FaFacebookF className="w-6 h-6" />
          </a>

          <a
            href="https://x.com/tippified"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 transition"
            aria-label="X / Twitter"
          >
            <FaTwitter className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
}