"use client";

import { useEffect, useState } from "react";

export default function TipperSubscribeModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const subscribed = localStorage.getItem("tipper_subscribed");

    if (subscribed !== "true") {
      setTimeout(() => setOpen(true), 1200); // small delay feels nicer
    }
  }, []);

  const handleJoin = () => {
    if (!email.trim()) return;

    // TODO: send to backend later
    console.log("Tipper joined:", { name, email });

    localStorage.setItem("tipper_subscribed", "true");
    setOpen(false);
  };

  const handleClose = () => {
    localStorage.setItem("tipper_subscribed", "false");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100 p-4">
      <div
        className="
        bg-white rounded-2xl shadow-2xl
        max-w-md w-full p-6
        animate-modalPop
        "
      >
        <h2 className="text-xl font-bold text-purple-700 mb-2 text-center">
          Join Premium Tippers
        </h2>

        <p className="text-gray-600 text-sm text-center mb-6">
          Join thousands of premium tippers who constantly support Nigerian creators.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleJoin}
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Join
            </button>

            <button
              onClick={handleClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}