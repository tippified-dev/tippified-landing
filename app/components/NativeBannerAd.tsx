"use client";

import Script from "next/script";

export default function NativeBannerAd() {
  return (
    <div className="w-full">
      <Script
        async
        data-cfasync="false"
        src="https://pl31195635.profitableratecpmnetwork.com/33be41b816262329cd71a4b5d25e9025/invoke.js"
        strategy="afterInteractive"
      />

      <div id="container-33be41b816262329cd71a4b5d25e9025" />
    </div>
  );
}
