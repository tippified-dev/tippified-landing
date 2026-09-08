import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NativeBannerAd from "../components/NativeBannerAd";
import NavBar from "../components/NavBar";
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  published_at: string;
  author_name: string;
  meta_title?: string;
  meta_description?: string;
  status?: "draft" | "published";
}
const API_BASE_URL = "https://api.tippified.com";
const SITE_URL = "https://www.tippified.com";
export const metadata: Metadata = {
  title: "Tippified Blog | Creator Economy, Tips & Insights",
  description:
    "Explore Tippified's latest articles, guides, tips, and insights on creator monetization, content creation, fan engagement, digital communities, and the creator economy.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Tippified Blog | Creator Economy, Tips & Insights",
    description:
      "Explore articles, guides, tips, and insights on creator monetization, content creation, fan engagement, digital communities, and the creator economy.",
    url: `${SITE_URL}/blog`,
    siteName: "Tippified",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tippified Blog | Creator Economy, Tips & Insights",
    description:
      "Explore articles, guides, tips, and insights on creator monetization, content creation, fan engagement, digital communities, and the creator economy.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
export default async function BlogListPage() {
  let blogs: BlogPost[] = [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/adminpanel/public/blogs/`, {
      next: {
        revalidate: 60,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }
    const data = await res.json();
    blogs = (data.results || []).filter(
      (blog: BlogPost) => !blog.status || blog.status === "published",
    );
  } catch (err) {
    console.error("Error fetching blogs:", err);
    blogs = [];
  }
  return (
    <>
      <NavBar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Blog Header */}
        <header className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-950">
            Tippified Blog
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Discover practical tips, guides, and insights on creator
            monetization, content creation, fan engagement, digital communities,
            and the creator economy.
          </p>
        </header>
        {/* Native Advertisement */}
        <div className="mb-8">
          <NativeBannerAd />
        </div>
        {/* Blog Posts */}
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No blogs found yet.</p>
        ) : (
          <section
            aria-label="Tippified blog articles"
            className="grid md:grid-cols-2 gap-6"
          >
            {blogs.map((blog, index) => (
              <article
                key={blog.id}
                className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <Link href={`/blog/${blog.slug}`} className="block">
                  {/* Cover Image */}
                  {blog.cover_image && (
                    <Image
                      src={blog.cover_image}
                      alt={blog.title}
                      width={800}
                      height={400}
                      priority={index === 0}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  {/* Article Information */}
                  <div className="p-5">
                    <h2 className="font-bold text-xl mb-3 text-gray-900">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 leading-7">
                      {blog.excerpt ||
                        blog.meta_description ||
                        blog.content.replace(/<[^>]*>/g, "").slice(0, 160) +
                          "..."}
                    </p>
                    <div className="flex items-center justify-between mt-5 text-sm text-gray-400">
                      <span>By {blog.author_name}</span>
                      <time dateTime={blog.published_at}>
                        {new Date(blog.published_at).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
