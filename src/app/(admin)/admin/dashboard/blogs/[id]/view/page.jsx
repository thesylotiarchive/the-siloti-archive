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
      <div className="max-w-4xl mx-auto py-12 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-1/2" />
        <div className="h-6 bg-slate-200 rounded-xl w-1/4" />
        <div className="h-96 bg-slate-200 rounded-[2rem] w-full" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-16 bg-white/50 border border-slate-200/40 rounded-[2rem] shadow-sm max-w-xl mx-auto mt-10">
        <p className="text-red-500 font-medium">Blog article not found.</p>
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
        setBlog(updated);
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 font-semibold tracking-wide flex items-center gap-1.5 p-2 px-3.5 bg-white/60 border border-slate-200/50 rounded-xl w-fit backdrop-blur-sm hover:text-emerald-700 transition-colors shadow-sm cursor-pointer mb-6" onClick={() => router.push("/admin/dashboard/blogs")}>
        ← Back to Blogs
      </div>

      <div className="bg-white/70 border border-slate-200/60 p-8 sm:p-12 rounded-[2.5rem] shadow-sm backdrop-blur-md space-y-6">
        {/* Top Buttons */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-2">
            {blog.status === "PUBLISHED" && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200/80 uppercase tracking-wider">Published</span>
            )}
            {blog.status === "DRAFT" && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full border bg-amber-50 text-amber-700 border-amber-200/80 uppercase tracking-wider">Draft</span>
            )}
            {blog.status === "REJECTED" && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full border bg-red-50 text-red-700 border-red-200/80 uppercase tracking-wider">Rejected</span>
            )}
          </div>

          <div className="flex gap-2">
            <Link href={`/admin/dashboard/blogs/${blog.id}/edit`}>
              <Button className="text-xs font-semibold px-4 py-2 h-auto rounded-xl cursor-pointer border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200" variant="outline">Edit</Button>
            </Link>

            {(me?.role === "ADMIN" || me?.role === "SUPERADMIN") && (
              <>
                {(blog.status === "DRAFT" || blog.status === "REJECTED") && (
                  <Button 
                    onClick={handlePublish} 
                    className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
                    variant="default"
                    disabled={publishing}
                  >
                    {publishing ? "Publishing..." : "Publish"}
                  </Button>
                )}

                <Button 
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 border border-red-200/50 cursor-pointer"
                  variant="destructive" 
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Blog Banner */}
        {blog.bannerUrl && (
          <img
            src={blog.bannerUrl}
            alt={blog.title}
            className="w-full h-80 object-cover rounded-[2rem] border border-slate-200/60 shadow-sm"
          />
        )}

        {/* Blog Title & Meta */}
        <div className="space-y-2.5">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">{blog.title}</h1>
          
          <p className="text-xs text-slate-400 font-medium tracking-wide flex gap-1.5 items-center">
            <span>By <strong className="font-bold text-slate-600">{typeof blog.author === "string" ? blog.author : blog.author?.name || "Unknown Author"}</strong></span>
            <span>•</span>
            <span>{blog.published ? "✅ Published" : "⏳ Draft"}</span>
            <span>•</span>
            <span>
              {blog.publishedAt
                ? format(new Date(blog.publishedAt), "PPP")
                : format(new Date(blog.createdAt), "PPP")}
            </span>
          </p>
        </div>

        {/* Blog Content */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-sans pt-4 border-t border-slate-100">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {blog.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
