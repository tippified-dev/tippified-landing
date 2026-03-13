import { MetadataRoute } from "next";

interface GoalItem {
  slug: string;
  created_at?: string | null;
}

interface CreatorItem {
  referral_code: string;
  created_at?: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.tippified.com";

  // Static pages
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

  let goalPages: MetadataRoute.Sitemap = [];
  let creatorPages: MetadataRoute.Sitemap = [];

  try {
    // Fetch goals
    const resGoals = await fetch(
      "https://api.tippified.com/api/auth/public/goals/",
      { cache: "no-store" }
    );

    if (resGoals.ok) {
      const dataGoals: { results?: GoalItem[] } = await resGoals.json();
      const goals: GoalItem[] = dataGoals.results || [];

      goalPages = goals
        .filter((goal) => goal.slug)
        .map((goal) => ({
          url: `${baseUrl}/goals/${goal.slug}`,
          lastModified: goal.created_at
            ? new Date(goal.created_at)
            : new Date(),
        }));
    }
  } catch (err) {
    console.error("Goals sitemap error:", err);
  }

  try {
    // Fetch creators
    const resCreators = await fetch(
      "https://api.tippified.com/api/auth/public/creators/",
      { cache: "no-store" }
    );

    if (resCreators.ok) {
      const dataCreators = await resCreators.json();
      const creators: CreatorItem[] = dataCreators.results || [];

      creatorPages = creators.map((creator) => ({
        url: `${baseUrl}/tip/${creator.referral_code}`,
        lastModified: creator.created_at
          ? new Date(creator.created_at)
          : new Date(),
      }));
    }
  } catch (err) {
    console.error("Creators sitemap error:", err);
  }

  return [...staticPages, ...goalPages, ...creatorPages];
}