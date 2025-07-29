// uploadthing.config.js
import { createUploadthing, FileRouter } from "uploadthing/server";

export const f = createUploadthing();

export const ourFileRouter = {
  folderImageUploader: f({ image: { maxFileSize: "3MB" } })
    .onUploadComplete(({ file }) => file),

  blogBannerUploader: f({ image: { maxFileSize: "3MB" } })
    .onUploadComplete(({ file }) => file),

  mediaFileUploader: f({
    "application/pdf": { maxFileSize: "50MB" },
    image: { maxFileSize: "5MB" },
    audio: { maxFileSize: "20MB" },
    video: { maxFileSize: "100MB" },
  }).onUploadComplete(({ file }) => file),
}
