import { NextResponse } from "next/server";

export async function GET() {
  const base = "https://app.tippified.com";

  const urls = [
    {
      loc: `${base}/creator/signup`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${base}/creator/signin`,
      lastmod: new Date().toISOString(),
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`
  )
  .join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}