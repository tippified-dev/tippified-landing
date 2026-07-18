"use client";

import { useEffect } from "react";

export function useScrollRestoration(storageKey: string) {
  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);

    if (!saved) return;

    requestAnimationFrame(() => {
      window.scrollTo({
        top: Number(saved),
        behavior: "auto",
      });

      sessionStorage.removeItem(storageKey);
    });
  }, [storageKey]);

  const rememberScroll = () => {
    sessionStorage.setItem(storageKey, String(window.scrollY));
  };

  return rememberScroll;
}