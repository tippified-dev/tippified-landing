import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image?: string;
  published_at: string;
  author_name: string;
  meta_title?: string;
  meta_description?: string;
}

const API_BASE_URL = "https://api.tippified.com";

interface Props {
  params: { slug: string };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = params;
  let blog: BlogPost | null = null;

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/adminpanel/public/blogs/${slug}/`,
      { next: { revalidate: 60 } } // ISR caching
    );
    if (!res.ok) throw new Error("Blog not found");
    blog = await res.json();
  } catch (err) {
    console.error("Error fetching blog:", err);
    blog = null;
  }

  if (!blog) {
    return <p className="text-center mt-10">Blog not found.</p>;
  }

  const capitalizeWords = (text: string): string =>
    text
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    image: blog.cover_image || "",
    author: { "@type": "Person", name: blog.author_name },
    datePublished: blog.published_at,
    description: blog.meta_description || blog.content.slice(0, 150),
    mainEntityOfPage: `https://www.tippified.com/blog/${blog.slug}`,
  };

  return (
    <>
      <Head>
        <title>{blog.meta_title || blog.title}</title>
        <meta
          name="description"
          content={blog.meta_description || blog.content.slice(0, 160)}
        />
        <link
          rel="canonical"
          href={`https://www.tippified.com/blog/${blog.slug}`}
        />
        <meta property="og:title" content={blog.title} />
        <meta
          property="og:description"
          content={blog.meta_description || blog.content.slice(0, 160)}
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://www.tippified.com/blog/${blog.slug}`}
        />
        {blog.cover_image && <meta property="og:image" content={blog.cover_image} />}
        <script
          type="application/ld+json"
          
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">
        {/* Sticky Back Button */}
        <div className="sticky top-4 z-20 bg-white pb-3">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to blogs
          </Link>
        </div>

        {blog.cover_image && (
          <Image
            src={blog.cover_image}
            alt={blog.title}
            width={1200}
            height={600}
            className="w-full h-64 object-cover rounded"
          />
        )}

        <h1 className="text-3xl font-bold mt-6">{blog.title}</h1>

        <p className="text-gray-400 mt-2 mb-6">
          By {capitalizeWords(blog.author_name)} •{" "}
          {new Date(blog.published_at).toLocaleDateString()}
        </p>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </>
  );
}