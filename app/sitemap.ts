import { MetadataRoute } from "next";

interface GoalItem {
  slug: string;
  created_at?: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.tippified.com";

  // 1️⃣ Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date() },
    { url: `${baseUrl}/tippified`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date() },
    { url: `${baseUrl}/faq`, lastModified: new Date() },
    { url: `${baseUrl}/creator/signup`, lastModified: new Date() },
    { url: `${baseUrl}/creator/signin`, lastModified: new Date() },
    { url: `${baseUrl}/terms-conditions`, lastModified: new Date() },
    { url: `${baseUrl}/search-goals`, lastModified: new Date() },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date() },
    { url: `${baseUrl}/contact-us`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
  ];

 
  try {
    const res = await fetch(
      "https://api.tippified.com/api/auth/public/goals/",
      { cache: "no-store" }
    );

    if (!res.ok) return staticPages;

    const data: { results?: GoalItem[] } = await res.json();
    const goals: GoalItem[] = data.results || [];

    const goalPages: MetadataRoute.Sitemap = goals
      .filter((goal) => goal.slug) 
      .map((goal) => ({
        url: `${baseUrl}/goals/${goal.slug}`,
        lastModified: goal.created_at ? new Date(goal.created_at) : new Date(),
      }));

    return [...staticPages, ...goalPages];
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return staticPages;
  }
}