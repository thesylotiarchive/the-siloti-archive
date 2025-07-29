"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function BlogViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin/blogs/${id}`);
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-red-500">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-2">
        <Link href="/admin/dashboard/blogs" className="hover:underline">
          ← Back to Blogs
        </Link>
      </div>

      {/* Top Buttons */}
      <div className="flex justify-end gap-2">
        <Link href={`/admin/dashboard/blogs/${blog.id}/edit`}>
          <Button variant="outline">Edit</Button>
        </Link>
        <Button
            variant="destructive"
            onClick={async () => {
                const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
                if (!confirmDelete) return;

                try {
                const res = await fetch(`/api/admin/blogs/${blog.id}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    alert("Blog deleted successfully.");
                    router.push("/admin/dashboard/blogs"); // ✅ Go back to list
                } else {
                    alert("Failed to delete the blog.");
                }
                } catch (err) {
                console.error("Delete error:", err);
                alert("An error occurred while deleting.");
                }
            }}
        >
            Delete
        </Button>

      </div>

      {/* Blog Banner */}
      {blog.bannerUrl && (
        <img
          src={blog.bannerUrl}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-md"
        />
      )}

      {/* Blog Title & Meta */}
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      <p className="text-sm text-muted-foreground">
        By {blog.author?.name || "Unknown Author"} ·{" "}
        {blog.published ? "✅ Published" : "⏳ Draft"} ·{" "}
        {blog.publishedAt
          ? format(new Date(blog.publishedAt), "PPP")
          : format(new Date(blog.createdAt), "PPP")}
      </p>

      {/* Blog Content */}
      <div className="prose max-w-none">
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
        >
            {blog.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
