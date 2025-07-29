"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import removeMarkdown from "remove-markdown";

export default function PublicBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchBlogs = async (pageNumber) => {
    setLoading(true);
    const res = await fetch(`/api/public/blogs?page=${pageNumber}&limit=6`);
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

  function Skeleton({ className }) {
    return (
      <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded-md ${className}`} />
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
      <h1 className="relative  text-3xl sm:text-4xl font-bold text-[#1276AB] text-center mb-10 after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-[3px] after:bg-[#D4A574]">
        Archive Blogs
     </h1>

      <div className="space-y-6">
      {blogs.map((blog, i) => (
        <div key={blog.id} ref={i === blogs.length - 1 ? lastBlogRef : null}>
            <Link href={`/blogs/${blog.slug}`}>
                <Card className="flex flex-row border p-4 shadow-sm bg-white items-start gap-4 hover:shadow-md transition duration-200">
                {/* Banner */}
                {blog.bannerUrl ? (
                    <img
                    src={blog.bannerUrl}
                    alt={blog.title}
                    className="w-32 h-24 object-cover rounded-md shrink-0"
                    />
                ) : (
                    <div className="w-32 h-24 bg-muted rounded-md shrink-0" />
                )}

                {/* Text Content */}
                <div className="flex-1">
                    <h2 className="text-lg font-semibold line-clamp-2">{blog.title}</h2>
                    <p className="text-sm text-muted-foreground">
                    {blog.author || "Unknown Author"} ·{" "}
                    {format(new Date(blog.publishedAt), "PPP")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {blog.content
                      ? removeMarkdown(blog.content).slice(0, 140)
                      : "No preview available..."}
                    </p>
                </div>
                </Card>
            </Link>
        </div>
      ))}
      </div>

      {loading &&
        Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)}

      {!hasMore && !loading && blogs.length === 0 && (
        <div className="text-center mt-12 text-muted-foreground">No blogs found.</div>
      )}
    </main>
  );
}
