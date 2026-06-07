"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import slugify from "slugify";
import ImageUploaderWithToggle from "@/components/ImageUploaderWithToggle";
import { useAuth } from "@/lib/context/AuthContext";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const { me, authLoading } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin/blogs/${id}`);
        const data = await res.json();
        setBlog(data);
        setTitle(data.title);
        setSlug(data.slug);
        setAuthor(data.author || "");
        setBannerUrl(data.bannerUrl || "");
        setContent(data.content);
        setPublished(!!data.publishedAt); // true if blog was published before
      } catch (err) {
        toast.error("Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (me?.role === "ADMIN" || me?.role === "SUPERADMIN") {
      setPublished(true);
    } else {
      setPublished(false); // contributors default to draft
    }
  }, [me]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!me) return toast.error("Unauthorized");
  
    // Determine status based on role + publish toggle
    let status = "DRAFT";
    if (me.role === "ADMIN" || me.role === "SUPERADMIN") {
      status = published ? "PUBLISHED" : "DRAFT";
    } else {
      status = "DRAFT"; // Contributors can only save drafts
    }
  
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          bannerUrl,
          content,
          author,
          status,
        }),
      });
  
      if (res.ok) {
        toast.success(
          me.role === "CONTRIBUTOR"
            ? "Blog saved as draft (awaiting review)"
            : status === "PUBLISHED"
            ? "Blog published successfully"
            : "Blog saved as draft"
        );
        router.push("/admin/dashboard/blogs");
      } else {
        toast.error("Failed to update blog");
      }
    } catch (err) {
      toast.error("Error updating blog");
    }
  };
  

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-8 h-8 border-4 border-emerald-500/80 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading blog...</p>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-8 h-8 border-4 border-emerald-500/80 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white/70 border border-slate-200/60 p-8 rounded-[2rem] shadow-sm backdrop-blur-md space-y-6">
        <h1 className="text-3xl font-light tracking-tight pb-4 border-b border-slate-200/50">
          <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
            Edit Blog
          </span>
        </h1>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="title">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(slugify(e.target.value, { lower: true }));
              }}
              required
              className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="slug">Slug</label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
            />
          </div>

          {/* Author */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="author">Author</label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              required
              className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
            />
          </div>

          {/* Banner Upload */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Banner Image</label>
            <div className="p-1 border border-slate-200/60 rounded-xl bg-white/40">
              <ImageUploaderWithToggle
                value={bannerUrl}
                onChange={setBannerUrl}
                setIsUploading={setIsUploading}
                endpoint="blogBannerUploader"
                initialMode={bannerUrl?.startsWith("http") ? "link" : "upload"}
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="content">Content (Markdown)</label>
            <Textarea
              id="content"
              rows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 resize-none outline-none font-mono"
            />
          </div>

          {/* Publish Toggle for Admins */}
          {me && (me.role === "ADMIN" || me.role === "SUPERADMIN") && (
            <div className="flex items-center gap-3 p-3 bg-white/40 border border-slate-200/50 rounded-xl w-fit">
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
                className="
                  data-[state=checked]:bg-emerald-500 
                  data-[state=unchecked]:bg-slate-300 
                "
              />
              <label htmlFor="published" className="text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer">Publish</label>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <Button 
              type="submit" 
              disabled={isUploading}
              className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              {me?.role === "CONTRIBUTOR"
                ? "Save as Draft"
                : published
                ? "Save & Publish"
                : "Save as Draft"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/admin/dashboard/blogs/${id}/view`)}
              className="px-5 py-2 text-sm font-semibold border border-slate-200 text-slate-700 bg-white/80 hover:bg-slate-50 rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
            >
              👁️ Preview
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(`/admin/dashboard/blogs/${id}/view`)}
              className="px-5 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 cursor-pointer ml-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
