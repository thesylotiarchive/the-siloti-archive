"use client";

import BlogsDrafts from "@/components/admin/drafts/BlogsDrafts";
import FoldersDrafts from "@/components/admin/drafts/FoldersDrafts";
import MediaDrafts from "@/components/admin/drafts/MediaDrafts";
import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";



export default function DraftsPage() {
  const [activeTab, setActiveTab] = useState("folders");
  


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200/50 pb-5">
        <h2 className="text-3xl font-light tracking-tight">
          <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent font-serif italic font-bold">
            Curation Inbox
          </span>
        </h2>
        <p className="text-sm text-slate-600 mt-1">Review, approve, or reject user-submitted folders, media files, and blog articles.</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100/80 border border-slate-200/40 rounded-xl w-fit gap-1 backdrop-blur-md">
        {["folders", "media", "blogs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === tab
                ? "bg-white text-slate-950 shadow-sm font-bold"
                : "text-slate-500 hover:text-slate-900 hover:bg-white/30"
            }`}
          >
            {tab === "media" ? "Media Items" : tab === "folders" ? "Collection Folders" : "Blog Articles"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="pt-2">
        {activeTab === "folders" && <FoldersDrafts />}
        {activeTab === "media" && <MediaDrafts />}
        {activeTab === "blogs" && <BlogsDrafts />}
      </div>
    </div>
  );
}