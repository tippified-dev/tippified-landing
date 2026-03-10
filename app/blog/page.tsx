"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";


interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string;
  published_at: string;
  author_name: string,
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "https://api.tippified.com"

 useEffect(() => {
  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/adminpanel/public/blogs/`);

      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await res.json();
      setBlogs(data.results);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    } finally {
      setLoading(false);
    }
  };

  fetchBlogs();
 }, []);

 
  const capitalizeWords = (text: string): string => {
    if (!text) return "";
    return text
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) return <p className="text-center mt-10">Loading blogs...</p>;

  if (!blogs.length)
    return <p className="text-center mt-10">No blogs found yet.</p>;

  return (
    <>
    <NavBar/>
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-6">
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
            <p className="text-gray-600">{blog.excerpt}</p>
            <p className="text-sm text-gray-400 mt-2">
              Published {new Date(blog.published_at).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-400">
                post by: {capitalizeWords(blog.author_name)}

            </p>
          </div>
        </Link>
      ))}
    </div>
    </>
  );
}