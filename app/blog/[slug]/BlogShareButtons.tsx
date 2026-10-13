"use client";

import { useState } from "react";

interface BlogShareButtonsProps {
  title: string;
  url: string;
}

export default function BlogShareButtons({
  title,
  url,
}: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState("");

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "WhatsApp",
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .1 5.4.1 12c0 2.1.6 4.2 1.7 6L0 24l6.2-1.6a12 12 0 0 0 5.8 1.5h.1c6.6 0 12-5.4 12-12a11.9 11.9 0 0 0-3.6-8.4ZM12.1 21.9a10 10 0 0 1-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.9 9.9 0 1 1 8.4 4.6Zm5.5-7.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-1 .9-.2.2-.4.2-.7 0-.3-.1-1.2-.5-2.3-1.5-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.7l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.3-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.7 1.1 2.9c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.6.2-1.1.2-1.3-.1-.1-.3-.2-.5-.3Z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
        </svg>
      ),
    },
    {
      name: "X",
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.6 22H2.5l7.3-8.4L1.8 2h6.5l4.5 6.7L18.9 2Zm-1.1 17.9h1.7L7.3 3.9H5.5l12.3 16Z" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      label: "Share on Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M21.9 3.1c-.2-.2-.6-.3-.9-.2L2.3 10.1c-.7.3-.7 1.2 0 1.4l4.8 1.5 1.8 5.5c.2.6 1 .7 1.4.2l2.7-3.2 4.8 3.5c.5.4 1.2.1 1.4-.5l3.2-14.5c.1-.3 0-.7-.3-.9ZM9 12.6l9.3-5.8-7.5 7.2-.3 3-1.5-4.4Z" />
        </svg>
      ),
    },
  ];

  async function handleNativeShare() {
    setShareError("");

    if (!navigator.share) {
      await handleCopyLink();
      setShareError(
        "Your browser does not support direct sharing. The article link has been copied instead.",
      );
      return;
    }

    try {
      await navigator.share({ title, url });
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setShareError(
          "Unable to open the share menu. Please try copying the link.",
        );
      }
    }
  }

  async function handleCopyLink() {
    setShareError("");

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setShareError(
        "Unable to copy the link. Please copy it from your browser's address bar.",
      );
    }
  }

  return (
    <section
      aria-labelledby="share-article-heading"
      className="mt-14 overflow-hidden rounded-3xl border border-purple-100 bg-linear-to-br from-white via-purple-50/70 to-violet-100/60 shadow-[0_12px_40px_rgba(88,28,135,0.07)]"
    >
      <div className="p-6 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4" />
          </svg>
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-purple-600">
          Spread the word
        </p>

        <h2
          id="share-article-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-purple-950 sm:text-3xl"
        >
          Enjoyed this article?
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
          Share this story with friends, fellow creators, and anyone who might
          find it useful.
        </p>

        <button
          type="button"
          onClick={handleNativeShare}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-purple-700 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/15 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-200 sm:w-auto"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4" />
          </svg>
          Share article
        </button>

        <div className="mt-7 border-t border-purple-200/70 pt-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Or share directly
          </p>

          <div className="flex flex-wrap gap-3">
            {shareLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                title={item.label}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-purple-100 bg-white px-4 py-2.5 text-sm font-semibold text-purple-900 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-200"
              >
                {item.icon}
                {item.name}
              </a>
            ))}

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-purple-100 bg-white px-4 py-2.5 text-sm font-semibold text-purple-900 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-200"
            >
              {copied ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 text-green-600"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M15 9V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4" />
                </svg>
              )}

              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
        </div>

        {shareError && (
          <p role="status" className="mt-4 text-sm text-gray-600">
            {shareError}
          </p>
        )}

        <p className="mt-5 text-xs leading-5 text-gray-400">
          Instagram and TikTok users can use Share article to open their
          device&apos;s share menu, or copy the link to add to a post or
          message.
        </p>
      </div>
    </section>
  );
}
