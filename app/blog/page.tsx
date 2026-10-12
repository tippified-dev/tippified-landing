import type { Metadata } from "next";
import NavBar from "../components/NavBar";
import BlogExplorer, { type BlogCategory, type BlogPost } from "./BlogExplorer";

const API_BASE_URL = "https://api.tippified.com";
const SITE_URL = "https://www.tippified.com";

export const metadata: Metadata = {
  title: "Tippified Blog | Creator Economy, Monetization & Growth",
  description:
    "Explore creator monetization guides, African creator success stories, crowdfunding insights, brand partnership advice, and practical strategies for growing your creative business.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Tippified Blog | Creator Economy, Monetization & Growth",
    description:
      "Discover practical guides, creator success stories, and insights to help creators grow their audience and earn from their work.",
    url: `${SITE_URL}/blog`,
    siteName: "Tippified",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tippified Blog | Creator Economy, Monetization & Growth",
    description:
      "Creator monetization guides, African creator stories, and practical insights for building a creative business.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function fetchAllPages<T>(endpoint: string): Promise<T[]> {
  const items: T[] = [];
  const visitedUrls = new Set<string>();

  let nextUrl: string | null = `${API_BASE_URL}${endpoint}`;

  while (nextUrl) {
    if (visitedUrls.has(nextUrl)) {
      throw new Error(`Repeated pagination URL: ${nextUrl}`);
    }

    visitedUrls.add(nextUrl);

    const response: Response = await fetch(nextUrl, {
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed (${response.status}) for ${endpoint}`,
      );
    }

    const data: unknown = await response.json();

    // Support either an unpaginated array or a paginated DRF response.
    if (Array.isArray(data)) {
      items.push(...(data as T[]));
      nextUrl = null;
      continue;
    }

    if (
      !data ||
      typeof data !== "object" ||
      !("results" in data) ||
      !Array.isArray(data.results)
    ) {
      throw new Error(`Unexpected API response format for ${endpoint}`);
    }

    items.push(...(data.results as T[]));

    const next = "next" in data ? data.next : null;

    if (next !== null && typeof next !== "string") {
      throw new Error(`Invalid pagination URL returned by ${endpoint}`);
    }

    nextUrl = next;
  }

  return items;
}

export default async function BlogListPage() {
  let blogs: BlogPost[] = [];
  let categories: BlogCategory[] = [];

  try {
    const [blogResults, categoryResults] = await Promise.all([
      fetchAllPages<BlogPost>("/api/adminpanel/public/blogs/"),
      fetchAllPages<BlogCategory>("/api/adminpanel/blog-categories/"),
    ]);

    blogs = blogResults.filter(
      (blog) => !blog.status || blog.status === "published",
    );

    categories = categoryResults;
  } catch (error) {
    console.error("Error fetching Tippified blog data:", error);
  }

  return (
    <>
      <NavBar />

      <BlogExplorer blogs={blogs} categories={categories} />
    </>
  );
}
