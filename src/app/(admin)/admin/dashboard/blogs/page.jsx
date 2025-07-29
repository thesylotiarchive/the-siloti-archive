"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
// import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const fetchBlogs = async (pageNumber) => {
    setLoading(true);
    const res = await fetch(`/api/admin/blogs?page=${pageNumber}&limit=6`);
    const data = await res.json();
    console.log("BLOG API RESPONSE:", data)

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
        {/* Image Placeholder */}
        <Skeleton className="w-32 h-24 flex-shrink-0" />
  
        {/* Text Content */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
  
        {/* 3-dot Menu Placeholder */}
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

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link href="/admin/dashboard/blogs/new">
          <Button>➕ New Blog</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {blogs.map((blog, i) => (
            <Card
                key={blog.id}
                ref={i === blogs.length - 1 ? lastBlogRef : null}
                className="flex flex-row border p-4 shadow-sm bg-white items-start gap-4"
            >
                {/* Left: Image */}
                {blog.bannerUrl ? (
                <img
                    src={blog.bannerUrl}
                    alt={blog.title}
                    className="w-32 h-24 object-cover rounded-md shrink-0"
                />
                ) : (
                <div className="w-32 h-24 bg-muted rounded-md shrink-0" />
                )}
            
                {/* Right: Content */}
                <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-semibold line-clamp-2">{blog.title}</h2>
                    <p className="text-sm text-muted-foreground">
                    {blog.author || "Unknown Author"} ·{" "}
                    {blog.published ? "✅ Published" : "⏳ Draft"} ·{" "}
                    {format(new Date(blog.createdAt), "PPP")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {blog.content?.replace(/[#_*>\n]/g, "").slice(0, 140) ||
                        "No preview available..."}
                    </p>
                </div>
            
                {/* Action Buttons */}
                <div className="mt-4 flex gap-2 justify-center">
                    <Link href={`/admin/dashboard/blogs/${blog.id}/view`}>
                    <Button variant="secondary" size="sm">View</Button>
                    </Link>
                    <Link href={`/admin/dashboard/blogs/${blog.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(blog.id)}
                    >
                    Delete
                    </Button>
                </div>
                </div>
            </Card>
        ))}

        {loading &&
            Array.from({ length: 3 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
            ))}
        </div>

      {!hasMore && !loading && blogs.length === 0 && (
        <p className="text-muted-foreground text-center mt-10">No blogs found.</p>
      )}
    </main>
  );
}
