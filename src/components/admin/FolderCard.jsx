"use client";

import { useRef } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

export function FolderCard({ folder, onEdit, onDelete, activeMenuId, setActiveMenuId, onDrop, onDragOver }) {
  const menuRef = useRef(null);

  useOutsideClick(menuRef, () => {
    if (activeMenuId === folder.id) {
      setActiveMenuId(null);
    }
  });

  return (
    <div
        className="relative flex flex-col items-center border rounded-lg p-4 hover:bg-muted transition"
        onDrop={onDrop}
        onDragOver={onDragOver}
    >
      <Link
        href={`/admin/dashboard/collection-manager?folderId=${folder.id}`}
        className="absolute inset-0 z-0"
      >
        <span className="sr-only">Open folder</span>
      </Link>

      {/* 3-dot menu */}
      <div className="absolute top-2 right-2 z-10" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setActiveMenuId(activeMenuId === folder.id ? null : folder.id);
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {activeMenuId === folder.id && (
          <div className="absolute right-0 mt-2 w-28 bg-popover text-popover-foreground rounded-md shadow-lg border z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onEdit(folder);
                setActiveMenuId(null);
              }}
              className="block w-full px-4 py-2 text-sm hover:bg-muted text-left"
            >
              ✏️ Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete(folder.id);
                setActiveMenuId(null);
              }}
              className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-muted text-left"
            >
              🗑 Delete
            </button>
          </div>
        )}
      </div>

      <div className="w-16 h-16 bg-muted rounded-md mb-2 z-10">
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
      <span className="text-sm text-center z-10">{folder.name}</span>
    </div>
  );
}
