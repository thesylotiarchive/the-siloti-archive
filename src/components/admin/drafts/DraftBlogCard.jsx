"use client";

import { Button } from "@/components/ui/button";

export default function DraftBlogCard({
  blog,
  selectable = false,
  isSelected = false,
  onToggleSelect,
  onPublish,
  onDelete,
  role,
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
          onChange={() => onToggleSelect?.(blog.id)}
          className="absolute top-2 left-2 z-50"
        />
      )}

      {/* Status badge */}
      <div
        className={`absolute top-2 ${selectable ? "left-8" : "left-2"} px-2 py-0.5 text-[10px] font-semibold rounded-full bg-yellow-100 text-yellow-700`}
      >
        {blog.status}
      </div>

      {/* Thumbnail/banner */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
        {blog.bannerUrl ? (
          <img
            src={blog.bannerUrl}
            alt={blog.title}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="text-2xl">📝</div>
        )}
      </div>

      {/* Blog title */}
      <span className="text-sm text-center break-words">{blog.title}</span>

      {/* Action buttons */}
      <div className="mt-2 flex flex-wrap gap-2 justify-center w-full">
        <Button className="flex-1 min-w-[100px] sm:flex-none" asChild variant="secondary" size="sm">
          <a
            href={`/admin/dashboard/blogs/${blog.id}/view`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </a>
        </Button>

        <Button className="flex-1 min-w-[100px] sm:flex-none" asChild variant="outline" size="sm">
          <a
            href={`/admin/dashboard/blogs/${blog.id}/edit`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Edit
          </a>
        </Button>

        {(role === "ADMIN" || role === "SUPERADMIN") && (
          <>
            {blog.status !== "PUBLISHED" && (
              <Button
                className="flex-1 min-w-[100px] sm:flex-none"
                variant="default"
                size="sm"
                onClick={() => onPublish?.(blog.id)}
              >
                Publish
              </Button>
            )}

            <Button
              className="flex-1 min-w-[100px] sm:flex-none"
              variant="destructive"
              size="sm"
              onClick={() => onDelete?.(blog.id)}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
