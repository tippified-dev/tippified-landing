import { MetadataRoute } from "next";

interface GoalItem {
  slug: string;
  created_at?: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://app.tippified.com";

  const res = await fetch(
    "https://api.tippified.com/api/auth/public/goals/",
    { next: { revalidate: 3600 } }
  );

  const data = await res.json();
  const goals: GoalItem[] = data.results || [];

  return goals.map((goal) => ({
    url: `${base}/goals/${goal.slug}`,
    lastModified: goal.created_at
      ? new Date(goal.created_at)
      : new Date(),
  }));
}