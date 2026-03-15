import { MetadataRoute } from "next";

interface CreatorItem {
  referral_code: string;
  created_at?: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://app.tippified.com";

  const res = await fetch(
    "https://api.tippified.com/api/auth/public/creators/",
    { next: { revalidate: 3600 } }
  );

  const data = await res.json();
  const creators: CreatorItem[] = data.results || [];

  return creators.map((creator) => ({
    url: `${base}/tip/${creator.referral_code}`,
    lastModified: creator.created_at
      ? new Date(creator.created_at)
      : new Date(),
  }));
}