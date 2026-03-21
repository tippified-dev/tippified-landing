"use client";

import { useEffect, useState } from "react";

interface LiveCreator {
  username: string;
  referral_code: string;
}

export default function LiveNowBar() {
  const [liveCreators, setLiveCreators] = useState<LiveCreator[]>([]);

  useEffect(() => {
  // 1. FETCH CURRENTLY LIVE CREATORS
  const fetchLive = async () => {
    try {
      const res = await fetch("https://api.tippified.com/api/auth/live-creators/");
      const data = await res.json();
      setLiveCreators(data); 
    } catch (err) {
      console.error("Failed to fetch live creators", err);
    }
  };

  fetchLive();

  
  const ws = new WebSocket("wss://api.tippified.com/ws/live/");

  ws.onopen = () => {
    console.log("WS connected");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    console.log("WS EVENT:", data); 

    if (data.event === "live_started") {
      setLiveCreators((prev) => {
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

  ws.onerror = (err) => {
    console.error("WS error", err);
  };

  ws.onclose = () => {
    console.log("WS closed");
  };

  return () => ws.close();
}, []);


  if (liveCreators.length === 0) return null;

  return (
    <div className="w-full bg-purple-600 text-white py-3 px-4 shadow-md">
      <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto">
        {liveCreators.map((creator) => (
          <a
  key={creator.referral_code}
  href={`https://app.tippified.com/tip/${creator.referral_code}`}
  className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transform transition hover:scale-105"
>
  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
  <span className="w-2 h-2 bg-green-500 rounded-full absolute"></span>
  {creator.username} is live
</a>
        ))}
      </div>
    </div>
  );
}