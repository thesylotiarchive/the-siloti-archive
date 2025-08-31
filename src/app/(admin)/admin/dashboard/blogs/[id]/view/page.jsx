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
import { useAuth } from "@/lib/context/AuthContext";
import { Badge } from "@/components/ui/badge";

export default function BlogViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { me, authLoading } = useAuth();
  const [publishing, setPublishing] = useState(false)


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

  if (loading || authLoading) {
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

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}/publish`, {
        method: "POST",
      });

      if (res.ok) {
        alert("Blog published successfully!");
        const updated = await res.json();
        setBlog(updated); // ✅ update UI without reload
        setPublishing(false)
      } else {
        alert("Failed to publish blog.");
      }
    } catch (err) {
      console.error("Publish error:", err);
      alert("An error occurred while publishing.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Blog deleted successfully.");
        router.push("/admin/dashboard/blogs");
      } else {
        alert("Failed to delete the blog.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting.");
    }
  };

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
          {/* {blog.status === "PUBLISHED" && (
            <Badge className="bg-green-600 text-white">Published</Badge>
          )}
          {blog.status === "DRAFT" && (
            <Badge className="bg-yellow-500 text-black">Draft</Badge>
          )}
          {blog.status === "REJECTED" && (
            <Badge className="bg-red-600 text-white">Rejected</Badge>
          )}
           */}
        <Link href={`/admin/dashboard/blogs/${blog.id}/edit`}>
          <Button variant="outline">Edit</Button>
        </Link>

        {(me?.role === "ADMIN" || me?.role === "SUPERADMIN") && (
          <>
            {(blog.status === "DRAFT" || blog.status === "REJECTED") && (
              <Button 
                onClick={handlePublish} 
                variant="default"
                disabled={publishing}
              >
                {publishing ? "Publishing..." : "Publish"}
              </Button>
            )}
            {/* {!blog.published && (
              <Button onClick={handlePublish} variant="default">
                Publish
              </Button>
            )} */}

            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
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
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">{blog.title}</h1>

        {/* ✅ Status Badge */}
        {blog.status === "PUBLISHED" && (
          <Badge className="bg-green-600 text-white">Published</Badge>
        )}
        {blog.status === "DRAFT" && (
          <Badge className="bg-yellow-500 text-black">Draft</Badge>
        )}
        {blog.status === "REJECTED" && (
          <Badge className="bg-red-600 text-white">Rejected</Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        By {blog.author?.name || "Unknown Author"} ·{" "}
        {blog.published ? "✅ Published" : "⏳ Draft"} ·{" "}
        {blog.publishedAt
          ? format(new Date(blog.publishedAt), "PPP")
          : format(new Date(blog.createdAt), "PPP")}
      </p>

      {/* Blog Content */}
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {blog.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
