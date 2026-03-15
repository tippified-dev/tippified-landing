import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.tippified.com";

  return [
    { url: `${base}`, lastModified: new Date() },
    { url: `${base}/tippified`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/how-it-works`, lastModified: new Date() },
    { url: `${base}/faq`, lastModified: new Date() },
    { url: `${base}/terms-conditions`, lastModified: new Date() },
    { url: `${base}/search-goals`, lastModified: new Date() },
    { url: `${base}/privacy-policy`, lastModified: new Date() },
    { url: `${base}/contact-us`, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
  ];
}