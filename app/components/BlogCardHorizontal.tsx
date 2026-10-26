"use client";

import Image from "next/image";
import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cover_image?: string;
  published_at: string;
  author_name: string;
  excerpt?: string;
  category?: string | { name: string; slug?: string } | null;
  view_count?: number;
  content?: string;
}

interface Props {
  blog: BlogPost;
}

function capitalizeWords(text: string = ""): string {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getReadingTime(content: string = ""): number {
  const plainText = content.replace(/<[^>]*>/g, " ").trim();
  const wordCount = plainText
    ? plainText.split(/\s+/).filter(Boolean).length
    : 0;

  return Math.max(1, Math.ceil(wordCount / 200));
}

function getCategoryName(category: BlogPost["category"]): string {
  if (typeof category === "string") return category;
  if (category && typeof category === "object") return category.name;
  return "Creator Insights";
}

function formatViewCount(count: number = 0): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(count);
}

function formatPublishedDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently published";
  }

  return parsedDate.toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatRelativeTime(date: string): string {
  const publishedDate = new Date(date);

  if (Number.isNaN(publishedDate.getTime())) {
    return "";
  }

  const seconds = Math.floor((Date.now() - publishedDate.getTime()) / 1000);

  if (seconds < 0) return "Just now";
  if (seconds < 5) return "Just now";
  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

export default function BlogCardHorizontal({ blog }: Props) {
  const author = capitalizeWords(blog.author_name || "Tippified Editorial");
  const category = getCategoryName(blog.category);
  const viewCount = blog.view_count ?? 0;
  const readingTime = getReadingTime(blog.content);

  const initials = author
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/blog/${blog.slug}`}
      aria-label={`Read ${blog.title} by ${author}`}
      className="group relative block overflow-hidden rounded-[1.35rem] border border-purple-100/80 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-[0_16px_40px_-20px_rgba(88,28,135,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Cover image */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden bg-linear-to-br from-[#2A1045] via-purple-800 to-fuchsia-700 sm:h-auto sm:min-h-55 sm:w-[37%]">
          {blog.cover_image ? (
            <Image
              src={blog.cover_image}
              alt={blog.title}
              fill
              sizes="(max-width: 640px) 100vw, 280px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/15" />
              <div className="absolute -right-2 -top-2 h-20 w-20 rounded-full border border-white/15" />
              <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-fuchsia-400/20 blur-2xl" />

              <span className="relative text-5xl font-black tracking-tighter text-white/90">
                T.
              </span>
              <span className="relative mt-2 text-[9px] font-bold uppercase tracking-[0.3em] text-purple-200">
                Tippified Journal
              </span>
            </div>
          )}

          {/* Image overlays */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#160524]/65 via-transparent to-[#160524]/10 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Category */}
          <div className="absolute left-3 top-3">
            <span className="inline-flex max-w-55 items-center gap-1.5 truncate rounded-full border border-white/25 bg-[#1D0B31]/65 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white shadow-lg backdrop-blur-xl">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-300" />
              {category}
            </span>
          </div>

          {/* Cover image footer */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/20 px-2.5 py-1.5 text-[10px] font-medium text-white/95 backdrop-blur-md">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-3.5 w-3.5"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {readingTime} min read
            </span>

            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white/25">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </span>
          </div>
        </div>

        {/* Article information */}
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          {/* Author identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#351452] via-purple-700 to-fuchsia-500 p-[1.5px] shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[11px] font-black tracking-wide text-purple-800">
                {initials || "T"}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-extrabold tracking-tight text-[#29133D] transition-colors group-hover:text-purple-700 sm:text-[13px]">
                {author}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-purple-500">
                  Author
                </span>

                <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-gray-300" />

                <time
                  dateTime={blog.published_at}
                  className="text-[10px] text-gray-400"
                >
                  {formatPublishedDate(blog.published_at)}
                </time>

                {formatRelativeTime(blog.published_at) && (
                  <>
                    <span className="h-0.5 w-0.5 shrink-0 rounded-full bg-purple-300" />

                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-600"
                      title={formatPublishedDate(blog.published_at)}
                    >
                      <span className="h-1 w-1 rounded-full bg-purple-400" />
                      {formatRelativeTime(blog.published_at)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <span className="hidden shrink-0 rounded-full border border-purple-100 bg-purple-50/80 px-2.5 py-1 text-[9px] font-semibold text-purple-700 sm:inline-flex">
              Journal
            </span>
          </div>

          {/* Article title */}
          <div className="mt-4">
            <h3 className="line-clamp-2 text-[19px] font-black leading-[1.28] tracking-[-0.035em] text-[#251039] transition-colors duration-300 group-hover:text-purple-800 sm:text-[21px]">
              {blog.title}
            </h3>

            {/* Editorial accent */}
            <div className="mt-3 h-0.5 w-9 rounded-full bg-linear-to-r from-purple-700 to-fuchsia-400 transition-all duration-300 group-hover:w-16" />
          </div>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="mt-3 line-clamp-2 text-[12px] leading-[1.8] text-gray-500 sm:text-[13px]">
              {blog.excerpt}
            </p>
          )}

          {/* Bottom metadata */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-3 border-t border-purple-50 pt-4 ">
            {/* View count */}
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500"
              aria-label={`${viewCount.toLocaleString()} ${
                viewCount === 1 ? "view" : "views"
              }`}
              title={`${viewCount.toLocaleString()} ${
                viewCount === 1 ? "view" : "views"
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4 text-purple-500"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>

              <span className="font-bold text-[#39214C]">
                {formatViewCount(viewCount)}
              </span>

              {viewCount === 1 ? "view" : "views"}
            </span>

            {/* Read article link */}
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-purple-700 transition-all duration-300 group-hover:gap-2.5">
              <FiBookOpen size={24} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
