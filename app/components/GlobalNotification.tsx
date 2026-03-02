"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function GlobalNotification() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  
  useEffect(() => {
    const unlock = () => {
      setUnlocked(true);
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };

    window.addEventListener("click", unlock);
    window.addEventListener("touchstart", unlock);

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/notification-beep.mp3");
    audioRef.current.volume = 0.7;
  }, []);

  useEffect(() => {
    if (!unlocked) return;

    const interval = setInterval(() => {
      setShow(true);

      audioRef.current?.play().catch(() => {});

      setTimeout(() => setShow(false), 5000);
    }, 40000); 

    return () => clearInterval(interval);
  }, [unlocked]);

  if (!show) return null;

  return (
    <div
      onClick={() => router.push("/search-goals")}
      className="fixed top-4 right-4 bg-purple-600 text-white px-4 py-3 rounded-lg shadow-lg cursor-pointer z-50 animate-fade-in"
    >
      A creator has a new goal, tap to view.
    </div>
  );
}