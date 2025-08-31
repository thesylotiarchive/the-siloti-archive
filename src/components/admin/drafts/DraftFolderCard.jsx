"use client";

import { Button } from "@/components/ui/button";

export default function DraftFolderCard({
  folder,
  onEdit,
  onDelete,
  onPublish,
  role,
  selectable = false,
  isSelected = false,
  onToggleSelect,
}) {
  return (
    <div
      className={`relative flex flex-col items-center border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      {/* Checkbox for bulk select */}
      {selectable && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect?.(folder.id)}
          className="absolute top-2 left-2 z-50"
        />
      )}

      {/* Status badge */}
      <div
        className={`absolute top-2 ${selectable ? "left-8" : "left-2"} px-2 py-0.5 text-[10px] font-semibold rounded-full bg-yellow-100 text-yellow-700`}
      >
        {folder.status}
      </div>

      {/* Thumbnail */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
        {folder.image ? (
          <img
            src={folder.image}
            alt={folder.name}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="text-2xl">📁</div>
        )}
      </div>

      {/* Folder name */}
      <span className="text-sm text-center break-words">{folder.name}</span>

      {/* Action buttons */}
      <div className="mt-2 flex flex-wrap gap-2 justify-center w-full">
        <Button
          className="flex-1 min-w-[100px] sm:flex-none"
          variant="secondary"
          size="sm"
          onClick={() =>
            window.open(
              `/admin/dashboard/collection-manager?folderId=${folder.id}`,
              "_blank"
            )
          }
        >
          View    
        </Button>

        <Button
          className="flex-1 min-w-[100px] sm:flex-none"
          variant="outline"
          size="sm"
          onClick={() => onEdit(folder)}
        >
          Edit
        </Button>

        {(role === "ADMIN" || role === "SUPERADMIN") && (
          <>
            <Button
              className="flex-1 min-w-[100px] sm:flex-none"
              variant="default"
              size="sm"
              onClick={() => onPublish?.(folder.id)}
            >
              Publish
            </Button>

            <Button
              className="flex-1 min-w-[100px] sm:flex-none"
              variant="destructive"
              size="sm"
              onClick={() => onDelete?.(folder.id)}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
