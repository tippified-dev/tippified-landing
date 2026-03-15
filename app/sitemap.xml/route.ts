import { NextResponse } from "next/server";

export async function GET() {
  const baseWWW = "https://www.tippified.com";
  const baseAPP = "https://app.tippified.com";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Static marketing pages -->
  <sitemap>
    <loc>${baseWWW}/sitemaps/static-sitemap.xml</loc>
  </sitemap>

  <!-- Goals -->
  <sitemap>
    <loc>${baseAPP}/sitemaps/goals-sitemap.xml</loc>
  </sitemap>

  <!-- Creator pages -->
  <sitemap>
    <loc>${baseAPP}/sitemaps/creators-sitemap.xml</loc>
  </sitemap>

  <!-- Auth pages -->
  <sitemap>
    <loc>${baseAPP}/sitemaps/auth-sitemap.xml</loc>
  </sitemap>

</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}