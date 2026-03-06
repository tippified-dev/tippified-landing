"use client";

import { useEffect, useRef, useState } from "react";

export default function TipperSubscribeModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({
    name: false,
    email: false,
  });

  const [shake, setShake] = useState(false);

  const errorSound = useRef<HTMLAudioElement | null>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const subscribed = localStorage.getItem("tipper_subscribed");

    if (subscribed === "true") return;

    errorSound.current = new Audio("/error.mp3");
    errorSound.current.preload = "auto";

    const handleScroll = () => {
      if (triggered.current) return;

      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const scrollPercent = scrollTop / docHeight;

      if (scrollPercent >= 0.4) {
        triggered.current = true;
        setOpen(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerError = () => {
    // SHAKE
    setShake(true);

    // SOUND
    if (errorSound.current) {
      errorSound.current.currentTime = 0;
      errorSound.current.play().catch(() => {});
    }

    // VIBRATION
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }

    setTimeout(() => setShake(false), 400);
  };

  const handleJoin = () => {
    const nameEmpty = !name.trim();
    const emailEmpty = !email.trim();

    if (nameEmpty || emailEmpty) {
      setErrors({
        name: nameEmpty,
        email: emailEmpty,
      });

      triggerError();
      return;
    }

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
        className={`
        bg-white rounded-2xl shadow-2xl
        max-w-md w-full p-6
        animate-modalPop
        ${shake ? "animate-shake" : ""}
        `}
      >
        <h2 className="text-xl font-bold text-purple-700 mb-2 text-center">
          Join Premium Tippers
        </h2>

        <p className="text-gray-600 text-sm text-center mb-6">
          Join thousands of premium tippers who constantly support Nigerian
          creators.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full name *"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: false }));
            }}
            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2
            ${
              errors.name
                ? "border-red-500 bg-red-50"
                : "focus:ring-purple-500"
            }`}
          />

          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: false }));
            }}
            className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2
            ${
              errors.email
                ? "border-red-500 bg-red-50"
                : "focus:ring-purple-500"
            }`}
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