"use client";

import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cover_image?: string;
  published_at: string;
  author_name: string;
}

interface Props {
  blog: BlogPost;
}

export default function BlogCardHorizontal({ blog }: Props) {
  const capitalizeWords = (text: string) =>
    text
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="flex items-center gap-4 p-3 bg-white shadow hover:shadow-lg transition"
    >
    
      <div className="w-32 h-20 shrink-0 bg-gray-100 overflow-hidden">
        {blog.cover_image ? (
          <Image
            src={blog.cover_image}
            alt={blog.title}
            width={1280}      
            height={800}      
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Blog info */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg line-clamp-2">{blog.title}</h3>
        <p className="text-gray-500 text-sm mt-1">
          Published by {capitalizeWords(blog.author_name)} •{" "}
          {new Date(blog.published_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}