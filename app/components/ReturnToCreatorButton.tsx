"use client";

import { useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function ReturnToCreatorButton() {
  const searchParams = useSearchParams();

  const payload = searchParams.get("return");

  if (!payload) return null;

  let data: {
    url: string;
    scroll?: number;
    source?: string;
  };

  try {
    data = JSON.parse(decodeURIComponent(payload));
  } catch {
    return null;
  }

  return (
  <div className="fixed top-24 left-4 z-50">
    <a
      href={`${data.url}${
        data.url.includes("?") ? "&" : "?"
      }restore=${encodeURIComponent(payload)}`}
      className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white shadow-lg px-4 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50"
    >
      <FaArrowLeft />
      Return to Creator
    </a>
  </div>
);
}