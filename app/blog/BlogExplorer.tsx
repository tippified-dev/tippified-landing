"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogPost {
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
  category?: string | BlogCategory | null;
  view_count?: number;
}

interface BlogExplorerProps {
  blogs: BlogPost[];
  categories: BlogCategory[];
}

function getCategoryName(category: BlogPost["category"]): string | null {
  if (!category) return null;

  if (typeof category === "string") {
    return null;
  }

  return category.name;
}

function getReadingTime(content: string): number {
  const plainText = content.replace(/<[^>]*>/g, " ");
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / 200));
}

function getExcerpt(blog: BlogPost): string {
  const excerpt =
    blog.excerpt ||
    blog.meta_description ||
    blog.content.replace(/<[^>]*>/g, " ");

  const cleanExcerpt = excerpt.replace(/\s+/g, " ").trim();

  if (cleanExcerpt.length <= 165) {
    return cleanExcerpt;
  }

  return `${cleanExcerpt.slice(0, 162).trimEnd()}...`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatViewCount(count: number = 0): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count);
}

export default function BlogExplorer({ blogs, categories }: BlogExplorerProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredBlogs = useMemo(() => {
    if (activeCategory === "all") {
      return blogs;
    }

    return blogs.filter((blog) => {
      if (!blog.category) return false;

      if (typeof blog.category === "string") {
        return blog.category === activeCategory;
      }

      return (
        blog.category.id === activeCategory ||
        blog.category.slug === activeCategory
      );
    });
  }, [blogs, activeCategory]);

  const featuredBlog = filteredBlogs[0];
  const remainingBlogs = filteredBlogs.slice(1);

  return (
    <div className="min-h-screen bg-[#faf9fc] text-gray-950">
      {/* Editorial hero */}
      <section className="relative isolate overflow-hidden border-b border-purple-100 bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-fuchsia-100/60 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-purple-800">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
              The Tippified Journal
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-purple-950 sm:text-5xl lg:text-7xl">
              Ideas for creators.
              <span className="mt-1 block text-purple-600">
                Insights for growth.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              Practical knowledge, creator success stories, and fresh
              perspectives on making a living from your creativity and building
              a stronger community around your work.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>{blogs.length} published articles</span>
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-purple-300"
              />
              <span>{categories.length} topics to explore</span>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        {/* Category navigation */}
        <section aria-label="Browse by category" className="mb-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
                Find your next read
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950">
                Explore by topic
              </h2>
            </div>
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              aria-pressed={activeCategory === "all"}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                activeCategory === "all"
                  ? "border-purple-700 bg-purple-700 text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:text-purple-800"
              }`}
            >
              All articles
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                aria-pressed={activeCategory === category.id}
                title={category.description || category.name}
                className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                  activeCategory === category.id
                    ? "border-purple-700 bg-purple-700 text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:text-purple-800"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {filteredBlogs.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-purple-200 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl text-purple-700">
              —
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No articles in this category yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              We are working on more useful stories and guides. Explore another
              topic or view all articles.
            </p>

            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="mt-6 rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
            >
              Browse all articles
            </button>
          </section>
        ) : (
          <>
            {/* Featured article */}
            {featuredBlog && (
              <section aria-label="Featured article" className="mb-14">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-8 bg-purple-500" />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-800">
                    {activeCategory === "all"
                      ? "Featured story"
                      : "From this topic"}
                  </p>
                </div>

                <article className="group overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/5">
                  <div className="grid lg:grid-cols-2">
                    <Link
                      href={`/blog/${featuredBlog.slug}`}
                      aria-label={`Read ${featuredBlog.title}`}
                      className="relative block min-h-64 overflow-hidden bg-purple-100 sm:min-h-80 lg:min-h-110"
                    >
                      {featuredBlog.cover_image ? (
                        <Image
                          src={featuredBlog.cover_image}
                          alt={featuredBlog.title}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full min-h-64 items-center justify-center bg-linear-to-br from-purple-100 via-purple-50 to-fuchsia-100 p-8">
                          <span className="text-3xl font-bold tracking-tight text-purple-300">
                            tippified.
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-linear-to-t from-purple-950/25 to-transparent" />

                      <span className="absolute left-5 top-5 rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-xs font-semibold text-purple-900 shadow-sm backdrop-blur">
                        Editor&apos;s pick
                      </span>
                    </Link>

                    <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                      {getCategoryName(featuredBlog.category) && (
                        <span className="mb-4 w-fit rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-800">
                          {getCategoryName(featuredBlog.category)}
                        </span>
                      )}

                      <Link href={`/blog/${featuredBlog.slug}`}>
                        <h2 className="text-2xl font-bold leading-tight tracking-tight text-purple-950 transition-colors group-hover:text-purple-700 sm:text-3xl lg:text-4xl">
                          {featuredBlog.title}
                        </h2>
                      </Link>

                      <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                        {getExcerpt(featuredBlog)}
                      </p>

                      <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600 sm:text-sm">
                        <span className="font-semibold text-gray-800">
                          {featuredBlog.author_name || "Tippified Editorial"}
                        </span>

                        {featuredBlog.published_at && (
                          <>
                            <span
                              aria-hidden="true"
                              className="h-1 w-1 rounded-full bg-gray-300"
                            />
                            <time dateTime={featuredBlog.published_at}>
                              {formatDate(featuredBlog.published_at)}
                            </time>
                          </>
                        )}

                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rounded-full bg-gray-300"
                        />
                        <span>
                          {getReadingTime(featuredBlog.content)} min read
                        </span>

                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rounded-full bg-gray-300"
                        />

                        <span
                          className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 font-medium text-purple-700"
                          aria-label={`${featuredBlog.view_count ?? 0} views`}
                          title={`${(featuredBlog.view_count ?? 0).toLocaleString()} views`}
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-3.5 w-3.5"
                          >
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          {formatViewCount(featuredBlog.view_count)} views
                        </span>
                      </div>

                      <Link
                        href={`/blog/${featuredBlog.slug}`}
                        className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
                      >
                        Read the story
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              </section>
            )}

            {/* Remaining articles */}
            {remainingBlogs.length > 0 && (
              <section aria-label="More Tippified articles">
                <div className="mb-7 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
                      Keep exploring
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                      {activeCategory === "all"
                        ? "Latest articles"
                        : categories.find(
                            (category) => category.id === activeCategory,
                          )?.name || "More articles"}
                    </h2>
                  </div>

                  <span className="hidden rounded-full bg-white px-3 py-1.5 text-sm text-gray-500 ring-1 ring-gray-200 sm:inline-flex">
                    {remainingBlogs.length}{" "}
                    {remainingBlogs.length === 1 ? "article" : "articles"}
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {remainingBlogs.map((blog) => (
                    <article
                      key={blog.id}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-950/5"
                    >
                      <Link
                        href={`/blog/${blog.slug}`}
                        aria-label={`Read ${blog.title}`}
                        className="relative block aspect-16/10 overflow-hidden bg-purple-50"
                      >
                        {blog.cover_image ? (
                          <Image
                            src={blog.cover_image}
                            alt={blog.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-linear-to-br from-purple-100 to-fuchsia-50">
                            <span className="text-2xl font-bold text-purple-300">
                              tippified.
                            </span>
                          </div>
                        )}
                      </Link>

                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        {getCategoryName(blog.category) && (
                          <span className="mb-3 w-fit rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-800">
                            {getCategoryName(blog.category)}
                          </span>
                        )}

                        <Link href={`/blog/${blog.slug}`}>
                          <h3 className="text-lg font-bold leading-snug text-gray-950 transition-colors group-hover:text-purple-700">
                            {blog.title}
                          </h3>
                        </Link>

                        <p className="mt-3 flex-1 text-sm leading-7 text-gray-600">
                          {getExcerpt(blog)}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                          <span className="max-w-[60%] truncate font-medium text-gray-700">
                            {blog.author_name || "Tippified Editorial"}
                          </span>

                          <span>{getReadingTime(blog.content)} min read</span>

                          <span
                            className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 font-medium text-purple-700"
                            aria-label={`${blog.view_count ?? 0} views`}
                            title={`${(blog.view_count ?? 0).toLocaleString()} views`}
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              className="h-3.5 w-3.5"
                            >
                              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            {formatViewCount(blog.view_count)} views
                          </span>

                          {blog.published_at && (
                            <time
                              dateTime={blog.published_at}
                              className="w-full"
                            >
                              {formatDate(blog.published_at)}
                            </time>
                          )}
                        </div>

                        <Link
                          href={`/blog/${blog.slug}`}
                          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-purple-700 transition-colors hover:text-purple-950"
                        >
                          Read article
                          <span
                            aria-hidden="true"
                            className="transition-transform group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Editorial footer CTA */}
      <section className="border-t border-purple-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="overflow-hidden rounded-3xl bg-linear-to-br from-purple-950 via-purple-900 to-purple-700 px-6 py-10 sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
                Create. Share. Grow.
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Your creativity deserves a community.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-purple-100 sm:text-base">
                Discover how Tippified helps creators connect with supporters
                and build new opportunities around their work.
              </p>
            </div>

            <Link
              href="/"
              className="mt-7 inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-purple-900 transition hover:bg-purple-50 lg:mt-0"
            >
              Discover Tippified
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
