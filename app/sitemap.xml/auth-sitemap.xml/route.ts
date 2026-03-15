import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://app.tippified.com";

  return [
    {
      url: `${base}/creator/signup`,
      lastModified: new Date(),
    },
    {
      url: `${base}/creator/signin`,
      lastModified: new Date(),
    },
  ];
}