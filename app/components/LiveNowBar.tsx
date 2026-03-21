"use client";

import { useEffect, useState } from "react";

interface LiveCreator {
  username: string;
  referral_code: string;
}

export default function LiveNowBar() {
  const [liveCreators, setLiveCreators] = useState<LiveCreator[]>([]);

  useEffect(() => {
    const ws = new WebSocket("wss://api.tippified.com/ws/live/");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.event === "live_started") {
        setLiveCreators((prev) => {
          // avoid duplicates
          if (prev.find((c) => c.referral_code === data.data.referral_code)) {
            return prev;
          }
          return [data.data, ...prev];
        });
      }

      if (data.event === "live_ended") {
        setLiveCreators((prev) =>
          prev.filter((c) => c.referral_code !== data.data.referral_code)
        );
      }
    };

    return () => ws.close();
  }, []);

  if (liveCreators.length === 0) return null;

  return (
    <div className="w-full bg-red-600 text-white py-3 px-4 shadow-md">
      <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto">
        {liveCreators.map((creator) => (
          <a
            key={creator.referral_code}
            href={`https://app.tippified.com/live/${creator.referral_code}`}
            className="bg-white text-red-600 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap"
          >
            {creator.username} is live
          </a>
        ))}
      </div>
    </div>
  );
}