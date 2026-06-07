"use client";

import { useRef } from "react";
import Link from "next/link";
import { MoreVertical, FolderOpen } from "lucide-react";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

export function FolderCard({
  folder,
  onEdit,
  onDelete,
  activeMenuId,
  setActiveMenuId,
  onDrop,
  onDragOver,
  role,
  onPublish,
}) {
  const menuRef = useRef(null);

  useOutsideClick(menuRef, () => {
    if (activeMenuId === folder.id) {
      setActiveMenuId(null);
    }
  });

  return (
    <div
      className="relative flex flex-col items-center border border-slate-200/60 rounded-[2rem] p-6 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 cursor-pointer group hover:shadow-md hover:border-emerald-500/30"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {/* Status badge */}
      <div
        className={`absolute top-4 left-4 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full border
          ${folder.status === "PUBLISHED" 
            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
            : folder.status === "DRAFT" 
            ? "bg-amber-50 text-amber-700 border-amber-200/80"
            : "bg-red-50 text-red-700 border-red-200/80"}`}
      >
        {folder.status}
      </div>

      {/* Full clickable link */}
      <Link
        href={`/admin/dashboard/collection-manager?folderId=${folder.id}`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">Open folder</span>
      </Link>

      {/* Floating 3-dot menu */}
      <div
        className="absolute top-4 right-4 z-30"
        ref={menuRef}
        onClick={(e) => e.stopPropagation()} // prevent link trigger
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            setActiveMenuId(activeMenuId === folder.id ? null : folder.id);
          }}
          className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {activeMenuId === folder.id && (
          <div className="absolute right-0 mt-2 w-32 bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200/80 p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            {(role === "ADMIN" || role === "SUPERADMIN") && folder.status !== "PUBLISHED" && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onPublish?.(folder.id);
                  setActiveMenuId(null);
                }}
                className="flex items-center w-full px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                ✅ Publish
              </button>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                onEdit(folder);
                setActiveMenuId(null);
              }}
              className="flex items-center w-full px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              ✏️ Edit
            </button>

            {(role === "ADMIN" || role === "SUPERADMIN") && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(folder.id);
                  setActiveMenuId(null);
                }}
                className="flex items-center w-full px-3 py-2 text-xs font-semibold text-rose-600 rounded-lg hover:bg-rose-50 transition-colors text-left cursor-pointer"
              >
                🗑 Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Thumbnail */}
      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl mb-3 flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-inner">
        {folder.image ? (
          <img
            src={folder.image}
            alt={folder.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <FolderOpen className="w-8 h-8 text-emerald-600" />
        )}
      </div>
      <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 text-center transition-colors duration-300 line-clamp-1 w-full px-1">
        {folder.name}
      </span>
    </div>
  );
}
