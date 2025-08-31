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
  

  if (loading ) {
    return <div className="p-8 text-muted-foreground">Loading blog...</div>;
  }

  if (authLoading) {
    return <div>Loading user...</div>
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-semibold">Edit Blog</h1>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(slugify(e.target.value, { lower: true }));
            }}
            required
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
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
            required
          />
        </div>

        {/* Banner Upload */}
        <div className="space-y-2">
          <Label>Banner Image</Label>
          <ImageUploaderWithToggle
            value={bannerUrl}
            onChange={setBannerUrl}
            setIsUploading={setIsUploading}
            endpoint="blogBannerUploader"
            initialMode={bannerUrl?.startsWith("http") ? "link" : "upload"}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea
            id="content"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="font-mono"
            required
          />
        </div>

        {/* Publish Toggle for Admins */}
        {me && (me.role === "ADMIN" || me.role === "SUPERADMIN") && (
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
              className="
                data-[state=checked]:bg-green-500 
                data-[state=unchecked]:bg-gray-400 
                border border-gray-300
              "
            />
            <Label htmlFor="published">Publish</Label>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <Button type="submit" disabled={isUploading}>
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
          >
            👁️ Preview
          </Button>
        </div>
      </form>
    </div>
  );
}
