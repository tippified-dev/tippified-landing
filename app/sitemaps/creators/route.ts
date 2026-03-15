import { NextResponse } from "next/server";

interface CreatorItem {
  referral_code: string;
  created_at?: string | null;
}

export async function GET() {
  const base = "https://app.tippified.com";

  const res = await fetch(
    "https://api.tippified.com/api/auth/public/creators/",
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  const creators: CreatorItem[] = data.results || [];

  // Generate XML
  const urls = creators
    .map(
      (creator) => `
  <url>
    <loc>${base}/tip/${creator.referral_code}</loc>
    <lastmod>${creator.created_at ? new Date(creator.created_at).toISOString() : new Date().toISOString()}</lastmod>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}