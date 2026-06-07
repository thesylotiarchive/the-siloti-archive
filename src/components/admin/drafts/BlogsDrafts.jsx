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

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="w-8 h-8 border-4 border-emerald-500/80 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-slate-400 font-medium animate-pulse">Loading draft blogs...</p>
    </div>
  );

  return (
    <div>
      {selectedIds.length > 0 && (
        <div className="mb-6 flex gap-3 p-4 bg-white/70 border border-slate-200/60 rounded-2xl items-center justify-between shadow-sm backdrop-blur-md">
          <span className="text-xs font-bold text-slate-700 bg-emerald-50 px-3 py-1.5 border border-emerald-100 rounded-lg">{selectedIds.length} items selected</span>

          <div className="flex gap-2 flex-wrap items-center">
            <Button 
              className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-xl shadow-sm transition-all duration-300 active:scale-[0.98] cursor-pointer" 
              variant="default" 
              size="sm" 
              onClick={handleBulkPublish}
            >
              Publish Selected
            </Button>
            <Button 
              className="text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 border border-red-200/50 rounded-xl cursor-pointer" 
              variant="destructive" 
              size="sm" 
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>

            <Button
              className="text-xs font-semibold px-3.5 py-1.5 h-auto rounded-xl cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200"
              variant="secondary"
              size="sm"
              onClick={() => setSelectedIds(blogs.map((b) => b.id))}
            >
              Select All
            </Button>
            <Button 
              className="text-xs font-semibold px-3.5 py-1.5 h-auto rounded-xl cursor-pointer border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-200"
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedIds([])}
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {blogs.length === 0 ? (
        <div className="text-center py-16 bg-white/50 border border-slate-200/40 rounded-[2rem] backdrop-blur-sm shadow-sm">
          <p className="text-slate-400 font-medium">No draft blogs found in curation.</p>
        </div>
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
