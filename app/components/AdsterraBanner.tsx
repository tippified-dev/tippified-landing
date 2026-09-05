"use client";
import Script from "next/script";
export default function AdsterraBanner() {
  return (
    <div className="flex w-full justify-center">
      <div
        style={{
          width: "320px",
          height: "50px",
          overflow: "hidden",
        }}
      >
        <Script id="adsterra-banner-config" strategy="afterInteractive">
          {`
            atOptions = {
              'key' : '7eb9c9fd820b8dcb6ca343dca13d0245',
              'format' : 'iframe',
              'height' : 50,
              'width' : 320,
              'params' : {}
            };
          `}
        </Script>
        <Script
          id="adsterra-banner-script"
          src="https://www.highrevenueformat.com/7eb9c9fd820b8dcb6ca343dca13d0245/invoke.js"
          strategy="afterInteractive"
        />
      </div>
    </div>
  );
}
