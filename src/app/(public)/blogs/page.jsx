"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import removeMarkdown from "remove-markdown";
import { FileText, Sparkles } from "lucide-react";

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
      <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`} />
    );
  }
  
  function BlogCardSkeleton() {
    return (
      <div className="flex items-start gap-4 border border-slate-200 dark:border-white/5 rounded-2xl p-5 bg-slate-100/50 dark:bg-white/[0.02] w-full animate-pulse transition-colors duration-300">
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
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-emerald-400 selection:text-slate-950 pt-28 pb-20 transition-colors duration-300">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <div className="mb-6 flex items-center gap-2 px-4 py-1.5 bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full backdrop-blur-md animate-luxury-float">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-650 dark:text-emerald-300">
              Essays, Research & Updates
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-light tracking-tight leading-none mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl font-serif italic font-bold">
              Archive Blogs
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-light max-w-xl font-sans">
            Read stories, updates, and research findings about the Siloti community, literature, and history.
          </p>
        </div>

        <div className="space-y-6">
        {blogs.map((blog, i) => (
          <div key={blog.id} ref={i === blogs.length - 1 ? lastBlogRef : null}>
              <Link href={`/blogs/${blog.slug}`} className="cursor-pointer">
                  <div className="flex flex-col sm:flex-row border border-slate-200 dark:border-white/10 p-5 shadow-lg bg-slate-100/50 dark:bg-white/[0.02] items-start sm:items-center gap-5 hover:shadow-emerald-400/5 hover:border-emerald-400/30 hover:bg-slate-200/50 dark:hover:bg-white/[0.04] transition-all duration-300 rounded-2xl group cursor-pointer backdrop-blur-md">
                  {/* Banner */}
                  <div className="w-full sm:w-44 h-32 relative overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-white/5 shrink-0">
                    {blog.bannerUrl ? (
                        <img
                        src={blog.bannerUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/[0.01]">
                          <FileText className="w-8 h-8 text-white/20" />
                        </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-bold text-emerald-400 tracking-widest uppercase">
                        <span>{blog.author || "Unknown Author"}</span>
                        <span className="text-slate-300 dark:text-white/20">•</span>
                        <span>{format(new Date(blog.publishedAt), "PPP")}</span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-800 dark:text-white/95 leading-snug tracking-wide group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors duration-300 line-clamp-2 font-serif italic">
                        {blog.title}
                      </h2>
                      
                      <p className="text-sm text-slate-650 dark:text-white/60 line-clamp-2 leading-relaxed pt-0.5 font-light font-sans">
                        {blog.content
                        ? removeMarkdown(blog.content).slice(0, 140)
                        : "No preview available..."}
                      </p>
                  </div>
                  </div>
              </Link>
          </div>
        ))}
        </div>

        {loading && (
          <div className="space-y-4 mt-6">
            {Array.from({ length: 2 }).map((_, i) => <BlogCardSkeleton key={i} />)}
          </div>
        )}

        {!hasMore && !loading && blogs.length === 0 && (
          <div className="text-center mt-12 text-slate-500 dark:text-white/40 font-light font-sans">No blogs found.</div>
        )}
      </div>
    </main>
  );
}
