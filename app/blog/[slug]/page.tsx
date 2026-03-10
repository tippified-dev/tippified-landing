"use client";

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
          `${API_BASE_URL}/api/adminpanel/public/blogs/${slug}/`
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!blog) return <p className="text-center mt-10">Blog not found.</p>;

  return (
  <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">

    {/* Sticky Back Button */}
    <div className="sticky top-4 z-20 bg-white pb-3">
      <button
        onClick={() => router.push("/blog")}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to blogs
      </button>
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
 );
 }