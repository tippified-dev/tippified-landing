import { NextResponse } from "next/server";

interface GoalItem {
  slug: string;
  created_at?: string | null;
}

export async function GET() {
  const base = "https://app.tippified.com";

  // Fetch goals from your API
  const res = await fetch("https://api.tippified.com/api/auth/public/goals/", {
    next: { revalidate: 3600 }, // revalidate every hour
  });

  const data = await res.json();
  const goals: GoalItem[] = data.results || [];

  // Build XML
  const urls = goals
    .map(
      (goal) => `
  <url>
    <loc>${base}/goals/${goal.slug}</loc>
    <lastmod>${
      goal.created_at ? new Date(goal.created_at).toISOString() : new Date().toISOString()
    }</lastmod>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  // Return XML response
  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}