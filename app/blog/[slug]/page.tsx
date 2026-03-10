"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";

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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!blog) return <p className="text-center mt-10">Blog not found.</p>;

  return (
    <>
      <NavBar />

      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">
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
          By {blog.author_name} •{" "}
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