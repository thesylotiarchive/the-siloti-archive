"use client";

import { UploadButton } from "@uploadthing/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function ImageUploaderWithToggle({
  value,
  onChange,
  setIsUploading,
  endpoint = "folderImageUploader",
  placeholder = "Enter image URL",
  initialMode = "upload",
  groupKey, // NEW: unique per instance (e.g., `thumb-${item.id}`)
}) {
  const [mode, setMode] = useState(initialMode);
  const radioName = `${groupKey || endpoint}-mode`;

  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode]);

  const isUploadThingUrl = (url) =>
    typeof url === "string" && (url.includes("uploadthing") || url.includes("utfs.io"));

  const handleDelete = async () => {
    if (isUploadThingUrl(value)) {
      try {
        await fetch("/api/admin/uploadthing/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
    onChange("");
  };

  return (
    <div className="space-y-2">
      {/* Radio Toggle */}
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={radioName}
            value="upload"
            checked={mode === "upload"}
            onChange={() => setMode("upload")}
          />
          Upload
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={radioName}
            value="link"
            checked={mode === "link"}
            onChange={() => setMode("link")}
          />
          Use Link
        </label>
      </div>

      {/* Preview */}
      {value && (
        <div className="border rounded-md p-2 bg-muted text-sm">
          {mode === "link" ? (
            <div className="mb-2">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="underline break-all block"
              >
                {value}
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <img src={value} alt="Preview" className="h-12 w-12 object-cover rounded" />
              <span className="text-xs text-muted-foreground truncate">
                {value.split("/").pop()}
              </span>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Input Field */}
      {mode === "link" ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-input rounded-md px-3 py-2"
        />
      ) : (
        <UploadButton
          endpoint={endpoint}
          appearance={{
            button:
              "bg-black hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer ut-readying:bg-slate-800 ut-uploading:bg-slate-850",
            allowedContent: "text-[10px] text-slate-500 mt-1.5 font-medium",
          }}
          onUploadBegin={() => setIsUploading?.(true)}
          onClientUploadComplete={async (res) => {
            if (res && res.length > 0) {
              // delete old file if exists
              if (isUploadThingUrl(value)) {
                await fetch("/api/admin/uploadthing/delete", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ url: value }),
                }).catch(() => {});
              }
              onChange(res[0].url);
            }
            setIsUploading?.(false);
          }}
          onUploadError={(error) => {
            Swal.fire({
              title: "Upload Failed",
              text: "Something went wrong while uploading your image. Please try again.",
              icon: "error",
              confirmButtonColor: "#000000",
              background: "#ffffff",
              color: "#000000",
              customClass: { popup: "rounded-3xl border border-slate-200 shadow-2xl" }
            });
            console.error(error);
            setIsUploading?.(false);
          }}
        />
      )}
    </div>
  );
}
