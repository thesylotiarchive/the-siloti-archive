"use client";

import BlogsDrafts from "@/components/admin/drafts/BlogsDrafts";
import FoldersDrafts from "@/components/admin/drafts/FoldersDrafts";
import MediaDrafts from "@/components/admin/drafts/MediaDrafts";
import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";



export default function DraftsPage() {
  const [activeTab, setActiveTab] = useState("folders");
  


  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2 mb-4">
        {["folders", "media", "blogs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "folders" && <FoldersDrafts />}
      {activeTab === "media" && <MediaDrafts />}
      {activeTab === "blogs" && <BlogsDrafts />}
    </div>
  );
}