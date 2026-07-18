"use client";

import { useEffect } from "react";

export function useScrollRestoration(storageKey: string) {
  useEffect(() => {
    const elementId = sessionStorage.getItem(storageKey);

    if (!elementId) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(elementId);

      if (element) {
        element.scrollIntoView({
          behavior: "auto",
          block: "center",
        });

        sessionStorage.removeItem(storageKey);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [storageKey]);

  const rememberElement = (elementId: string) => {
    sessionStorage.setItem(storageKey, elementId);
  };

  return rememberElement;
}