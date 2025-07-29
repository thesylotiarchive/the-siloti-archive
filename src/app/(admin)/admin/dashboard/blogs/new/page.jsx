"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import slugify from "slugify";
import ImageUploaderWithToggle from "@/components/ImageUploaderWithToggle";
// import ImageUploaderWithToggle from "@/components/shared/ImageUploaderWithToggle"; // adjust path as needed

export default function CreateBlogPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
        body: JSON.stringify({ title, slug, content, bannerUrl, published, author }),
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

  return (
    <main className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold">📝 Create New Blog</h1>

      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Blog title"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Auto-generated from title, but editable"
          />
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
          />
        </div>

        {/* Banner Image */}
        <div className="space-y-2">
          <Label>Banner Image</Label>
          <ImageUploaderWithToggle
            value={bannerUrl}
            onChange={setBannerUrl}
            setIsUploading={setIsUploading}
            endpoint="blogBannerUploader"
            placeholder="Paste image URL or upload"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea
            id="content"
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content in Markdown..."
          />
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center gap-2">
          <Switch id="published" checked={published} onCheckedChange={setPublished} />
          <Label htmlFor="published">Publish</Label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSubmit} disabled={loading || isUploading}>
            {loading ? "Saving..." : "Save"}
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
          >
            Preview
          </Button>
        </div>
      </div>
    </main>
  );
}
