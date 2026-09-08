"use client";

import CreatorTipBanner from "@/app/components/CreatorTipBanner";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image?: string;
  published_at: string;
  author_name: string;
}

export default function BlogDetail() {
  const { slug } = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "https://api.tippified.com";

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/adminpanel/public/blogs/${slug}/`,
        );

        if (!res.ok) {
          throw new Error("Blog not found");
        }

        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const capitalizeWords = (text: string): string => {
    if (!text) return "";

    return text
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9ff] flex items-center justify-center px-6">
        <p className="text-sm font-medium text-purple-500">
          Loading article...
        </p>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="min-h-screen bg-[#faf9ff] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Blog not found</h1>

          <button
            onClick={() => router.push("/blog")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to blogs
          </button>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(blog.published_at).toLocaleDateString(
    "en-NG",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <main className="min-h-screen bg-[#faf9ff]">
      {/* Back navigation */}
      <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push("/blog")}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-purple-600 transition hover:text-purple-800"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to blogs
        </button>
      </div>

      {/* Article header */}
      <header className="mx-auto max-w-5xl px-5 pb-10 pt-10 text-center sm:px-6 sm:pt-14">
        <div className="mx-auto mb-5 inline-flex items-center rounded-full border border-purple-100 bg-purple-50 px-4 py-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600">
            Tippified Blog
          </span>
        </div>

        <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-4xl md:text-5xl lg:text-6xl">
          {blog.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-gray-500">
          <span className="font-semibold text-gray-700">
            {capitalizeWords(blog.author_name)}
          </span>

          <span className="text-gray-300">•</span>

          <time dateTime={blog.published_at}>{formattedDate}</time>
        </div>
      </header>

      {/* Main article */}
      <article className="mx-auto max-w-6xl px-5 pb-20 sm:px-6 lg:px-8">
        {/* Cover image */}
        {blog.cover_image && (
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-[0_25px_70px_-25px_rgba(88,28,135,0.25)] sm:rounded-3xl">
            <Image
              src={blog.cover_image}
              alt={blog.title}
              width={1600}
              height={900}
              priority
              className="h-auto max-h-150 w-full object-cover"
            />
          </div>
        )}

        {/* Content card */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white px-5 py-8 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.18)] sm:rounded-3xl sm:px-10 sm:py-12 md:px-14 md:py-14">
          {/* Creator banner */}
          <CreatorTipBanner className="mb-10" />

          {/* Article content */}
          <div
            className="
              prose
              prose-lg
              max-w-none

              text-gray-700

              prose-headings:font-extrabold
              prose-headings:tracking-tight
              prose-headings:text-gray-950

              prose-h2:mb-5
              prose-h2:mt-14
              prose-h2:text-2xl
              prose-h2:leading-tight
              sm:prose-h2:text-3xl

              prose-h3:mb-4
              prose-h3:mt-10
              prose-h3:text-xl
              sm:prose-h3:text-2xl

              prose-p:mb-6
              prose-p:leading-8

              prose-a:font-semibold
              prose-a:text-purple-600
              prose-a:no-underline
              hover:prose-a:text-purple-800
              hover:prose-a:underline

              prose-strong:font-bold
              prose-strong:text-gray-950

              prose-ul:my-7
              prose-ol:my-7

              prose-li:my-2
              prose-li:leading-8

              prose-blockquote:my-8
              prose-blockquote:border-l-4
              prose-blockquote:border-purple-500
              prose-blockquote:bg-purple-50
              prose-blockquote:px-6
              prose-blockquote:py-4
              prose-blockquote:font-medium
              prose-blockquote:not-italic
              prose-blockquote:text-purple-900

              prose-img:my-10
              prose-img:rounded-2xl
              prose-img:shadow-lg

              prose-hr:my-12
              prose-hr:border-purple-100

              prose-code:rounded
              prose-code:bg-purple-50
              prose-code:px-1.5
              prose-code:py-0.5
              prose-code:text-purple-700
            "
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          />
        </div>
      </article>
    </main>
  );
}
