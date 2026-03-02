"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GlobalNotification() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(true);
      const audio = new Audio("/notification-beep.mp3");
      audio.play().catch(() => {}); 
      setTimeout(() => setShow(false), 5000); 
    }, 50000); 

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div
      onClick={() => router.push("/search-goals")}
      className="fixed top-4 right-4 bg-purple-600 text-white px-4 py-3 rounded-lg shadow-lg cursor-pointer z-50 animate-fade-in"
    >
      A creator has a new goal
    </div>
  );
}