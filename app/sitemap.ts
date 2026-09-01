import { MetadataRoute } from "next";

interface GoalItem {
  slug: string;
  created_at?: string | null;
}

interface CreatorItem {
  referral_code: string;
}

interface CreatorApiResponse {
  results?: CreatorItem[];
  next?: string | null;
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
    { url: `${baseUrl}/explore`, lastModified: new Date() },
    { url: `${baseUrl}/tip-page`, lastModified: new Date() },
    
    { url: `${baseUrl}/terms-conditions`, lastModified: new Date() },
    { url: `${baseUrl}/search-goals`, lastModified: new Date() },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date() },
    { url: `${baseUrl}/contact-us`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/signup`, lastModified: new Date() },
  ];

  let goalPages: MetadataRoute.Sitemap = [];
  let creatorPages: MetadataRoute.Sitemap = [];

  /*
   * ---------------------------------------------------------
   * GOALS
   * ---------------------------------------------------------
   */

  try {
    const resGoals = await fetch(
      "https://api.tippified.com/api/auth/public/goals/",
      {
        next:{
          revalidate: 3600,
        }
      },
    );

    if (resGoals.ok) {
      const dataGoals: { results?: GoalItem[] } =
        await resGoals.json();

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
    let nextUrl:
      | string
      | null =
      "https://api.tippified.com/api/auth/creators/explore/?page=1";

    const allCreators: CreatorItem[] = [];

    while (nextUrl) {
      const resCreators = await fetch(nextUrl, {
        next: {
          revalidate: 3600,
        }
      });

      if (!resCreators.ok) {
        console.error(
          `Creators sitemap request failed: ${resCreators.status}`,
        );
        break;
      }

      const dataCreators: CreatorApiResponse =
        await resCreators.json();

      if (dataCreators.results?.length) {
        allCreators.push(...dataCreators.results);
      }

      nextUrl = dataCreators.next || null;
    }

    creatorPages = allCreators
      .filter((creator) => creator.referral_code)
      .map((creator) => ({
        url: `${baseUrl}/creator/${creator.referral_code}`,
        lastModified: new Date(),
      }));
  } catch (err) {
    console.error("Creators sitemap error:", err);
  }

 

  return [
    ...staticPages,
    ...goalPages,
    ...creatorPages,
  ];
}