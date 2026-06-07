"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import slugify from "slugify";
import ImageUploaderWithToggle from "@/components/ImageUploaderWithToggle";
import { useAuth } from "@/lib/context/AuthContext";

export default function CreateBlogPage() {
  const router = useRouter();
  const { me, authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Set default publish state based on role
  useEffect(() => {
    if (me?.role === "ADMIN" || me?.role === "SUPERADMIN") {
      setPublished(true);
    } else {
      setPublished(false); // contributors default to draft
    }
  }, [me]);

  const handleTitleChange = (val) => {
    setTitle(val);
    setSlug(slugify(val, { lower: true }));
  };

  const handleSubmit = async () => {
    if (!title || !slug || !content || !author) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        body: JSON.stringify({
          title,
          slug,
          content,
          bannerUrl,
          published,
          author,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create blog");

      const blog = await res.json();
      toast.success("Blog created!");
      router.push(`/admin/dashboard/blogs/${blog.id}/view`);
    } catch (err) {
      toast.error("Error creating blog.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-8 h-8 border-4 border-emerald-500/80 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium animate-pulse">Loading user...</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white/70 border border-slate-200/60 p-8 rounded-[2rem] shadow-sm backdrop-blur-md space-y-6">
        <h1 className="text-3xl font-light tracking-tight pb-4 border-b border-slate-200/50">
          <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
            Create New Blog
          </span>
        </h1>

        <div className="space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="title">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Blog title"
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
              placeholder="Auto-generated from title, but editable"
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
              className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 outline-none"
            />
          </div>

          {/* Banner Image */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Banner Image</label>
            <div className="p-1 border border-slate-200/60 rounded-xl bg-white/40">
              <ImageUploaderWithToggle
                value={bannerUrl}
                onChange={setBannerUrl}
                setIsUploading={setIsUploading}
                endpoint="blogBannerUploader"
                placeholder="Paste image URL or upload"
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
              placeholder="Write your blog content in Markdown..."
              className="w-full px-3.5 py-2 border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 rounded-xl bg-white/60 text-slate-900 text-sm shadow-inner transition-all duration-200 resize-none outline-none"
            />
          </div>

          {/* Publish Toggle (Admins only) */}
          {me?.role === "ADMIN" || me?.role === "SUPERADMIN" ? (
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
              <label htmlFor="published" className="text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer">Publish Immediately</label>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/50 border border-emerald-100/80 rounded-xl">
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                Note: Blogs you create will be saved as <strong className="font-bold">draft</strong> until reviewed and published by an administrator.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <Button 
              onClick={handleSubmit} 
              disabled={loading || isUploading}
              className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              {loading
                ? "Saving..."
                : me?.role === "CONTRIBUTOR"
                ? "Submit as Draft"
                : "Save"}
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={!content}
              onClick={() => {
                const previewUrl = `/admin/dashboard/blogs/preview?title=${encodeURIComponent(
                  title
                )}&slug=${encodeURIComponent(slug)}&content=${encodeURIComponent(
                  content
                )}&bannerUrl=${encodeURIComponent(bannerUrl)}`;
                window.open(previewUrl, "_blank");
              }}
              className="px-5 py-2 text-sm font-semibold border border-slate-200 text-slate-700 bg-white/80 hover:bg-slate-50 rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
            >
              Preview
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/admin/dashboard/blogs")}
              className="px-5 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 cursor-pointer ml-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
