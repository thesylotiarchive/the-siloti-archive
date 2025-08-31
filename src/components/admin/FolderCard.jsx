"use client";

import { useRef } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
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
      className="relative flex flex-col items-center border rounded-lg p-4 hover:bg-muted transition cursor-pointer"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >

      {/* Status badge */}
      <div
        className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold rounded-full
          ${folder.status === "PUBLISHED" ? "bg-green-100 text-green-700"
           : folder.status === "DRAFT" ? "bg-yellow-100 text-yellow-700"
           : "bg-red-100 text-red-700"}`}
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
        className="absolute top-2 right-2 z-50"
        ref={menuRef}
        onClick={(e) => e.stopPropagation()} // prevent link trigger
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            setActiveMenuId(activeMenuId === folder.id ? null : folder.id);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {activeMenuId === folder.id && (
          <div className="absolute right-0 mt-2 w-28 bg-popover text-popover-foreground rounded-md shadow-lg border z-50">
            {(role === "ADMIN" || role === "SUPERADMIN") && folder.status !== "PUBLISHED" && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onPublish?.(folder.id);
                  setActiveMenuId(null);
                }}
                className="block w-full px-4 py-2 text-sm hover:bg-muted text-left"
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
              className="block w-full px-4 py-2 text-sm hover:bg-muted text-left"
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
                className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-muted text-left"
              >
                🗑 Delete
              </button>
            )}

          </div>
        )}
      </div>

      {/* Thumbnail */}
      <div className="w-16 h-16 bg-muted rounded-md mb-2 z-1">
        {folder.image ? (
          <img
            src={folder.image}
            alt={folder.name}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="flex items-center justify-center h-full">📁</div>
        )}
      </div>
      <span className="text-sm text-center z-1">{folder.name}</span>
    </div>
  );
}
