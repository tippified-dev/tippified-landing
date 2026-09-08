import AdsterraBanner from "@/app/components/AdsterraBanner";
import CreatorTipBanner from "@/app/components/CreatorTipBanner";
import NativeBannerAd from "@/app/components/NativeBannerAd";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  published_at: string;
  updated_at?: string;
  author_name: string;
  meta_title?: string;
  meta_description?: string;
  status?: "draft" | "published";
}

const API_BASE_URL = "https://api.tippified.com";
const SITE_URL = "https://www.tippified.com";

async function getBlog(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/adminpanel/public/blogs/${encodeURIComponent(slug)}/`,
      {
        next: {
          revalidate: 60,
        },
      },
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return null;
  }
}

const capitalizeWords = (text: string): string => {
  if (!text) return "";

  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found | Tippified",
      description: "The requested Tippified blog post could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = blog.meta_title?.trim() || `${blog.title} | Tippified`;

  const description =
    blog.meta_description?.trim() ||
    blog.excerpt?.trim() ||
    `Read ${blog.title} on Tippified — insights, guides, and stories for creators, fans, and the creator economy.`;

  const canonicalUrl = `${SITE_URL}/blog/${blog.slug}`;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Tippified",
      type: "article",

      publishedTime: blog.published_at,

      modifiedTime: blog.updated_at || blog.published_at,

      authors: [blog.author_name],

      images: blog.cover_image
        ? [
            {
              url: blog.cover_image,
              alt: blog.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,

      images: blog.cover_image ? [blog.cover_image] : undefined,
    },
  };
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const articleUrl = `${SITE_URL}/blog/${blog.slug}`;

  const description =
    blog.meta_description || blog.excerpt || `Read ${blog.title} on Tippified.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",

    headline: blog.title,

    description,

    url: articleUrl,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },

    image: blog.cover_image ? [blog.cover_image] : undefined,

    datePublished: blog.published_at,

    dateModified: blog.updated_at || blog.published_at,

    author: {
      "@type": "Person",
      name: capitalizeWords(blog.author_name),
    },

    publisher: {
      "@type": "Organization",
      name: "Tippified",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">
        {/* Back to blogs */}

        <div className="sticky top-3 z-20 bg-white pb-3">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to blogs
          </Link>
        </div>

        {/* Cover Image */}

        {blog.cover_image && (
          <Image
            src={blog.cover_image}
            alt={blog.title}
            width={1200}
            height={600}
            priority
            className="w-full h-64 object-cover rounded"
          />
        )}

        {/* Article Title */}

        <h1 className="text-3xl font-bold mt-6 text-gray-900">{blog.title}</h1>

        {/* Advertisement */}

        <AdsterraBanner />

        {/* Author + Date */}

        <p className="text-gray-400 mt-2 mb-6">
          By {capitalizeWords(blog.author_name)} •{" "}
          {new Date(blog.published_at).toLocaleDateString()}
        </p>

        {/* Tippified Creator CTA */}

        <CreatorTipBanner className="mt-3 mb-3" />

        {/* Native Advertisement */}

        <NativeBannerAd />

        {/* Article */}

        <article
          className="
            prose
            prose-lg
            max-w-none
            text-gray-700

            prose-p:my-5
            prose-p:leading-8

            prose-headings:font-bold
            prose-headings:text-purple-950

            prose-h2:mb-4
            prose-h2:mt-10
            prose-h2:text-2xl

            prose-h3:mb-3
            prose-h3:mt-8
            prose-h3:text-xl

            prose-h4:mb-3
            prose-h4:mt-6
            prose-h4:text-lg

            prose-li:my-2
            prose-li:leading-7

            prose-blockquote:my-8
            prose-blockquote:border-purple-500
            prose-blockquote:bg-purple-50
            prose-blockquote:px-6
            prose-blockquote:py-4
            prose-blockquote:rounded-xl

            prose-a:text-purple-600
            prose-a:font-semibold

            prose-img:my-8
            prose-img:rounded-2xl

            prose-hr:my-10
          "
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        />
      </main>
    </>
  );
}
