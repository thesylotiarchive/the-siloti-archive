"use client";

import { useState, useEffect } from "react";
import DraftBlogCard from "./DraftBlogCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/AuthContext";

export default function BlogDrafts() {
  const [blogs, setBlogs] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { me, authLoading } = useAuth();

  if (authLoading) return <p>Loading user...</p>;

  // Pagination params (optional)
  const page = 1;
  const limit = 20;

  // Fetch draft blogs
  const fetchDraftBlogs = async () => {
    try {
      const res = await fetch(`/api/admin/drafts/blogs?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch draft blogs");
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraftBlogs();
  }, []);

  // Individual actions
  const handlePublishBlog = async (id) => {
    try {
      const res = await fetch(`/api/admin/blogs/publish-multiple`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      if (!res.ok) throw new Error("Failed to publish blog");
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
      alert("Blog published successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to publish blog. Please try again.");
    }
  };
  
  const handleDeleteBlog = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`/api/admin/blogs/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
      alert("Blog deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog. Please try again.");
    }
  };
  
  // Bulk actions
  const handleBulkPublish = async () => {
    try {
      const res = await fetch("/api/admin/blogs/publish-multiple", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!res.ok) throw new Error("Failed to bulk publish blogs");
      setBlogs((prev) => prev.filter((b) => !selectedIds.includes(b.id)));
      setSelectedIds([]);
      alert("Selected blogs published successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to bulk publish blogs. Please try again.");
    }
  };
  
  const handleBulkDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete the selected blogs?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch("/api/admin/blogs/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!res.ok) throw new Error("Failed to bulk delete blogs");
      setBlogs((prev) => prev.filter((b) => !selectedIds.includes(b.id)));
      setSelectedIds([]);
      alert("Selected blogs deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to bulk delete blogs. Please try again.");
    }
  };

  if (loading) return <div>Loading draft blogs...</div>;

  return (
    <div>
      {selectedIds.length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap items-center justify-end">
          <span>{selectedIds.length} selected</span>

          <Button variant="default" size="sm" onClick={handleBulkPublish}>
            Publish Selected
          </Button>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Delete Selected
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedIds(blogs.map((b) => b.id))}
          >
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedIds([])}>
            Deselect All
          </Button>
        </div>
      )}

      {blogs.length === 0 ? (
        <div className="text-gray-500">No draft blogs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <DraftBlogCard
              key={blog.id}
              blog={blog}
              role={me.role}
              selectable
              isSelected={selectedIds.includes(blog.id)}
              onToggleSelect={(id) =>
                setSelectedIds((prev) =>
                  prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
                )
              }
              onPublish={handlePublishBlog}
              onDelete={handleDeleteBlog}
            />
          ))}
        </div>
      )}
    </div>
  );
}
