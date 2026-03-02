"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GlobalNotification() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  // Play beep sound
  const playSound = () => {
    const audio = new Audio("/notification-beep.mp3"); // put your beep mp3 in public folder
    audio.play();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(true);
      playSound();

      // Hide after 4 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-6 right-6 z-50 bg-purple-600 text-white px-4 py-3 rounded-lg shadow-lg cursor-pointer flex items-center gap-2 animate-fade-in-out"
      onClick={() => router.push("/search-goals")}
    >
      
      <span>A creator has a new goal!</span>
    </div>
  );
}