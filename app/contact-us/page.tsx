"use client";

import { useState } from "react";
import NavBar from "../components/NavBar";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <NavBar/>
    
    <main className="bg-white text-gray-900 min-h-screen px-6 py-20 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>

      <div className="flex justify-end">
        <p>
            <b>Email: </b> support@tippified.com
            
        </p>

      </div>

      {submitted ? (
        <p className="text-green-600 text-center text-lg">
          Thank you! Your message has been submitted.
        </p>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={6}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition"
          >
            Send Message
          </button>
        </form>
      )}

      
    </main>
    </>
  );
}