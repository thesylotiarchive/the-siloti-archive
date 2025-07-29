"use client";

import { UploadButton } from "@uploadthing/react";
import { useEffect, useState } from "react";

export default function ImageUploaderWithToggle({
  value,
  onChange,
  setIsUploading,
  endpoint = "folderImageUploader",
  placeholder = "Enter image URL",
  initialMode = "upload",
}) {
  const [mode, setMode] = useState(initialMode);




    useEffect(() => {
        if (initialMode) {
        setMode(initialMode);
        }
    }, []);

  return (
    <div className="space-y-2">
      {/* Radio Toggle */}
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={endpoint + "-mode"} // unique name per field
            value="upload"
            checked={mode === "upload"}
            onChange={() => setMode("upload")}
          />
          Upload
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name={endpoint + "-mode"}
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
            <div className="border rounded-md p-2 bg-muted text-sm">
                🔗{" "}
                <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all block"
                >
                {value}
                </a>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <img src={value} alt="Preview" className="h-12 w-12 object-cover rounded" />
              <span className="text-xs text-muted-foreground truncate">{value.split("/").pop()}</span>
            </div>
          )}
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
              "bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors",
            allowedContent: "text-xs text-muted-foreground mt-1",
          }}
          onUploadBegin={() => setIsUploading(true)}
          onClientUploadComplete={(res) => {
            if (res && res.length > 0) {
              onChange(res[0].url);
            }
            setIsUploading(false);
          }}
          onUploadError={(error) => {
            alert("Upload failed.");
            console.error(error);
            setIsUploading(false);
          }}
        />
      )}
    </div>
  );
}
