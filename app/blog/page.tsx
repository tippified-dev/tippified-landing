import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string
  cover_image?: string;
  published_at: string;
  author_name: string;
  meta_title?: string;
  meta_description?: string;
}

const API_BASE_URL = "https://api.tippified.com";

export default async function BlogListPage() {
  let blogs: BlogPost[] = [];

  try {
    const res = await fetch(`${API_BASE_URL}/api/adminpanel/public/blogs/`, {
      next: { revalidate: 60 }, // ISR caching
    });
    if (!res.ok) throw new Error("Failed to fetch blogs");
    const data = await res.json();
    blogs = data.results || [];
  } catch (err) {
    console.error("Error fetching blogs:", err);
    blogs = [];
  }

  return (
    <>
      <Head>
        <title>Tippified Blog</title>
        <meta
          name="description"
          content="Read the latest tips, guides, and insights from Tippified creators."
        />
        <link rel="canonical" href="https://www.tippified.com/blog" />
        <meta property="og:title" content="Tippified Blog" />
        <meta
          property="og:description"
          content="Read the latest tips, guides, and insights from Tippified creators."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tippified.com/blog" />
        <meta property="og:site_name" content="Tippified" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tippified Blog" />
        <meta
          name="twitter:description"
          content="Read the latest tips, guides, and insights from Tippified creators."
        />
      </Head>

      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6">
        {blogs.length === 0 && (
          <p className="text-center col-span-2">No blogs found yet.</p>
        )}

        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.slug}`}
            className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition"
          >
            {blog.cover_image && (
              <Image
                src={blog.cover_image}
                alt={blog.title}
                width={800}
                height={400}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="font-bold text-lg mb-2">{blog.title}</h2>
              <p className="text-gray-600">
                {blog.excerpt || blog.meta_description || blog.content.slice(0, 120) + "..."}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                By {blog.author_name} •{" "}
                {new Date(blog.published_at).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}