// import AdsterraBanner from "@/app/components/AdsterraBanner";
// import CreatorTipBanner from "@/app/components/CreatorTipBanner";
// import NativeBannerAd from "@/app/components/NativeBannerAd";
import CreatorSignupBanner from "@/app/components/CreatorSignupBanner";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogShareButtons from "./BlogShareButtons";

interface BlogCategory {
  id: string;

  name: string;

  slug: string;

  description: string;
}

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
  category?: BlogCategory | null;
  view_count?: number;
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

async function getRelatedBlogs(
  categorySlug: string | undefined,
  currentSlug: string,
): Promise<BlogPost[]> {
  if (!categorySlug) {
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/adminpanel/public/blogs/`, {
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) {
      return [];
    }

    const data: unknown = await res.json();

    // Support both ordinary Django lists and paginated responses.
    const posts: BlogPost[] = Array.isArray(data)
      ? data
      : data &&
          typeof data === "object" &&
          "results" in data &&
          Array.isArray(data.results)
        ? (data.results as BlogPost[])
        : [];

    return posts
      .filter(
        (post) =>
          post.slug !== currentSlug &&
          post.category?.slug === categorySlug &&
          post.status !== "draft",
      )
      .slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch related blogs:", error);
    return [];
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

  const relatedBlogs = await getRelatedBlogs(blog.category?.slug, blog.slug);

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

        <div className="sticky top-0 z-30 mb-8 flex items-center justify-between">
          <Link
            href="/blog"
            aria-label="Back to all blog articles"
            className="group inline-flex items-center gap-3 rounded-full border border-purple-200/80 bg-white/90 py-2 pl-2 pr-5 text-sm font-semibold text-purple-950 shadow-[0_4px_20px_rgba(88,28,135,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-400 hover:bg-purple-50 hover:shadow-[0_8px_28px_rgba(88,28,135,0.15)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-200"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-purple-700 to-violet-500 text-white shadow-md transition-transform duration-300 group-hover:-translate-x-0.5">
              <ArrowLeftIcon className="h-4 w-4" />
            </span>

            <span className="flex flex-col">
              <span className="text-[13px] leading-5">Back to blogs</span>
              <span className="text-[10px] font-medium leading-3 text-gray-400">
                Explore more stories
              </span>
            </span>
          </Link>

          <span className="hidden items-center gap-2 rounded-full border border-purple-100 bg-purple-50/80 px-3 py-2 text-xs font-semibold text-purple-700 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            Tippified Journal
          </span>
        </div>

        {/* Cover Image */}

        {blog.cover_image && (
          <Image
            src={blog.cover_image}
            alt={blog.title}
            width={1200}
            height={800}
            priority
            className="w-full h-64 object-cover rounded"
          />
        )}

        {/* Article Title */}

        <h1 className="text-3xl font-bold mt-6 text-gray-900">{blog.title}</h1>

        {/* Advertisement */}

        {/* <AdsterraBanner /> */}

        {/* Author + Date */}

        <div className="mt-5 mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Author */}
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-purple-100 bg-purple-50/70 px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-700 to-violet-500 text-sm font-bold text-white shadow-sm">
              {capitalizeWords(blog.author_name).charAt(0) || "T"}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-purple-500">
                Written by
              </p>

              <p className="mt-1 truncate text-sm font-bold text-purple-950">
                {capitalizeWords(blog.author_name)}
              </p>
            </div>
          </div>

          {/* Publication date */}
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 transition-colors duration-200 hover:border-purple-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-100/80 bg-purple-50 text-purple-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18" />
              </svg>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Published
              </p>

              <time
                dateTime={blog.published_at}
                className="mt-1 block truncate text-sm font-bold text-gray-800"
              >
                {new Date(blog.published_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </time>
            </div>
          </div>

          {/* View count */}
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-purple-100/80 bg-linear-to-br from-white to-purple-50/60 px-4 py-3 transition-all duration-200 hover:border-purple-200 hover:shadow-[0_8px_24px_-18px_rgba(109,40,217,0.45)]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-100/80 bg-white text-purple-600 shadow-sm">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                Readership
              </p>

              <p
                className="mt-1 truncate text-sm font-extrabold tracking-tight text-purple-950"
                title={`${(blog.view_count ?? 0).toLocaleString()} ${
                  (blog.view_count ?? 0) === 1 ? "view" : "views"
                }`}
              >
                {new Intl.NumberFormat("en", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(blog.view_count ?? 0)}{" "}
                <span className="text-xs font-medium text-gray-500">
                  {(blog.view_count ?? 0) === 1 ? "view" : "views"}
                </span>
              </p>
            </div>
          </div>
        </div>
        <CreatorSignupBanner />

        {/* Tippified Creator CTA */}

        {/* <CreatorTipBanner className="mt-3 mb-3" /> */}

        {/* Native Advertisement */}

        {/* <NativeBannerAd /> */}

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

        <BlogShareButtons title={blog.title} url={articleUrl} />

        {/* You Might Also Like */}
        {relatedBlogs.length > 0 && (
          <section
            aria-labelledby="related-blogs-heading"
            className="mt-16 border-t border-purple-100 pt-10"
          >
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-wider text-purple-600">
                Continue Reading
              </p>

              <h2
                id="related-blogs-heading"
                className="mt-2 text-2xl font-bold text-purple-950 md:text-3xl"
              >
                You Might Also Like
              </h2>

              <p className="mt-2 text-gray-500">
                More articles from {blog.category?.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedBlogs.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-purple-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg"
                >
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      width={600}
                      height={340}
                      className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-purple-50 px-5 text-center">
                      <span className="text-sm font-semibold text-purple-400">
                        Tippified
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                      {post.category?.name}
                    </span>

                    <h3 className="mt-3 text-lg font-bold leading-snug text-gray-900 transition group-hover:text-purple-700">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                        {post.excerpt}
                      </p>
                    )}

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-600">
                      Read Article
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
