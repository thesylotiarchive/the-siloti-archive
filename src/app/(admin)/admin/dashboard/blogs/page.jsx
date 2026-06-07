// app/(admin)/admin/dashboard/blogs/page.jsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useAuth } from "@/lib/context/AuthContext";

import { FileText } from "lucide-react";

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
        className={`animate-pulse bg-slate-200 rounded-xl ${className}`}
      />
    );
  }

  function BlogCardSkeleton() {
    return (
      <div className="flex flex-col border border-slate-200/60 rounded-[2rem] p-6 bg-white/40 shadow-sm animate-pulse w-full">
        <div className="w-full h-44 bg-slate-100 rounded-xl mb-4" />
        <div className="space-y-2.5 flex-1">
          <div className="h-3 w-1/3 bg-slate-100 rounded" />
          <div className="h-5 w-3/4 bg-slate-100 rounded" />
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-5/6 bg-slate-100 rounded" />
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

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-8 h-8 border-4 border-emerald-500/80 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading user...</p>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-slate-200/50 pb-5">
        <div>
          <h1 className="text-3xl font-light tracking-tight">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
              Blogs & Articles
            </span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">Publish and manage administrative news, research, and stories.</p>
        </div>
        <Link href="/admin/dashboard/blogs/new">
          <Button className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer">➕ New Blog</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, i) => (
          <Card
            key={blog.id}
            ref={i === blogs.length - 1 ? lastBlogRef : null}
            className="relative flex flex-col border border-slate-200/60 rounded-[2rem] p-6 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 group hover:shadow-md hover:border-emerald-500/30"
          >
            {/* Floating Status Badge */}
            <div
              className={`absolute top-8 right-8 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full border shadow-sm z-10
                ${
                  blog.status === "PUBLISHED"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                    : blog.status === "DRAFT"
                    ? "bg-amber-50 text-amber-700 border-amber-200/80"
                    : "bg-red-50 text-red-700 border-red-200/80"
                }`}
            >
              {blog.status}
            </div>

            <div className="w-full h-44 relative overflow-hidden rounded-xl bg-slate-50 border border-slate-100 mb-4 shrink-0 transition-transform duration-300 overflow-hidden shadow-inner">
              {blog.bannerUrl ? (
                <img
                  src={blog.bannerUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                  <FileText className="w-10 h-10 text-emerald-600/70" />
                </div>
              )}
            </div>

            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 tracking-widest uppercase mb-1.5">
                <span>{blog.author || "Unknown Author"}</span>
                <span className="text-slate-300">•</span>
                <span>{format(new Date(blog.createdAt), "PPP")}</span>
              </div>

              <h2
                className="text-base font-bold text-slate-800 group-hover:text-emerald-700 leading-snug tracking-wide line-clamp-2 transition-colors duration-300 cursor-pointer mb-2"
              >
                <Link href={`/admin/dashboard/blogs/${blog.id}/view`}>
                  {blog.title}
                </Link>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                {blog.content?.replace(/[#_*>\n]/g, "").slice(0, 140) ||
                  "No preview available..."}
              </p>

              {/* Actions */}
              <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap gap-2 justify-start">
                <Link href={`/admin/dashboard/blogs/${blog.id}/view`}>
                  <Button className="text-xs font-semibold px-3 py-1.5 h-auto rounded-xl cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200" variant="secondary" size="sm">View</Button>
                </Link>
                <Link href={`/admin/dashboard/blogs/${blog.id}/edit`}>
                  <Button className="text-xs font-semibold px-3 py-1.5 h-auto rounded-xl cursor-pointer border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-200" variant="outline" size="sm">Edit</Button>
                </Link>

                {/* Only Admin + Superadmin can delete */}
                {(me?.role === "ADMIN" || me?.role === "SUPERADMIN") && (
                  <Button
                    className="text-xs font-semibold px-3 py-1.5 h-auto rounded-xl cursor-pointer bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 border border-red-200/50"
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
                    className="text-xs font-semibold px-3 py-1.5 h-auto rounded-xl cursor-pointer bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white shadow-sm transition-all duration-300 active:scale-[0.98]"
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
        <div className="text-center py-16 bg-white/50 border border-slate-200/40 rounded-[2rem] shadow-sm max-w-xl mx-auto mt-10">
          <p className="text-slate-400 font-medium">No blogs found.</p>
        </div>
      )}
    </main>
  );
}
