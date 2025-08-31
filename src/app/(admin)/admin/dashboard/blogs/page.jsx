// app/(admin)/admin/dashboard/blogs/page.jsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAuth } from "@/lib/context/AuthContext";

export default function BlogListPage() {
  const { me, authLoading } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const fetchBlogs = async (pageNumber) => {
    setLoading(true);
    const res = await fetch(`/api/admin/blogs?page=${pageNumber}&limit=6`);
    const data = await res.json();

    const { blogs: newBlogs, total } = data;
    setBlogs((prev) => {
      const existingIds = new Set(prev.map((b) => b.id));
      const uniqueNewBlogs = newBlogs.filter((b) => !existingIds.has(b.id));
      return [...prev, ...uniqueNewBlogs];
    });
    setHasMore(blogs.length + newBlogs.length < total);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert("Failed to delete blog");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting.");
    }
  };

  const handlePublish = async (id) => {
    setPublishingId(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}/publish`, {
        method: "POST",
      });
  
      if (res.ok) {
        const updated = await res.json();
        setBlogs((prev) =>
          prev.map((b) => (b.id === id ? { ...b, ...updated } : b))
        );
        alert("Blog published successfully!");
      } else {
        alert("Failed to publish blog");
      }
    } catch (err) {
      console.error(err);
      alert("Error publishing blog");
    } finally {
      setPublishingId(null);
    }
  };

  function Skeleton({ className }) {
    return (
      <div
        className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md ${className}`}
      />
    );
  }

  function BlogCardSkeleton() {
    return (
      <div className="flex items-start gap-4 border rounded-lg p-4 shadow-sm bg-white w-full animate-pulse">
        <Skeleton className="w-32 h-24 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="w-6 h-6 rounded-full" />
      </div>
    );
  }

  const observer = useRef();
  const lastBlogRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  if (authLoading) {
    return <p>Loading user...</p>;
  }

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link href="/admin/dashboard/blogs/new">
          <Button className={"cursor-pointer"}>➕ New Blog</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map((blog, i) => (
          <Card
            key={blog.id}
            ref={i === blogs.length - 1 ? lastBlogRef : null}
            className="relative flex flex-col border p-4 shadow-sm bg-white"
          >
            {/* Floating Status Badge */}
            <div
              className={`absolute top-6 right-6 px-2 py-1 text-xs font-semibold rounded-full shadow-md
                ${
                  blog.status === "PUBLISHED"
                    ? "bg-green-100 text-green-700"
                    : blog.status === "DRAFT"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {blog.status}
            </div>

            {blog.bannerUrl ? (
              <img
                src={blog.bannerUrl}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded-md mb-4" />
            )}

            <div className="flex flex-col flex-1">
            <h2
              className="text-lg font-semibold line-clamp-2 text-foreground hover:text-blue-600 cursor-pointer transition-colors"
            >
              <Link href={`/admin/dashboard/blogs/${blog.id}/view`}>
                {blog.title}
              </Link>
            </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {blog.author || "Unknown Author"} ·{" "}
                {format(new Date(blog.createdAt), "PPP")}
              </p>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {blog.content?.replace(/[#_*>\n]/g, "").slice(0, 140) ||
                  "No preview available..."}
              </p>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2 justify-start">
                <Link href={`/admin/dashboard/blogs/${blog.id}/view`}>
                  <Button className={"cursor-pointer"} variant="secondary" size="sm">View</Button>
                </Link>
                <Link href={`/admin/dashboard/blogs/${blog.id}/edit`}>
                  <Button className={"cursor-pointer"} variant="outline" size="sm">Edit</Button>
                </Link>

                {/* Only Admin + Superadmin can delete */}
                {(me?.role === "ADMIN" || me?.role === "SUPERADMIN") && (
                  <Button
                    className={"cursor-pointer"}
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Delete
                  </Button>
                )}

                {/* Only Admin + Superadmin can publish */}
                {(me?.role === "ADMIN" || me?.role === "SUPERADMIN") && blog.status === "DRAFT" && (
                  <Button
                    variant="default"
                    className={"cursor-pointer"}
                    size="sm"
                    onClick={() => handlePublish(blog.id)}
                    disabled={publishingId === blog.id}
                  >
                    {publishingId === blog.id ? "Publishing..." : "Publish"}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {loading &&
          Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)}
      </div>

      {!hasMore && !loading && blogs.length === 0 && (
        <p className="text-muted-foreground text-center mt-10">No blogs found.</p>
      )}
    </main>
  );
}
