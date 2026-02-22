import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.tippified.com";
  const actionUrl = "app.tippified.com"

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
    },
    {
      url: `${actionUrl}/creator/signup`,
      lastModified: new Date(),
    },
    {
      url: `${actionUrl}/creator/signin`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/search-goals`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
    },
  ];
}