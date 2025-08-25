// uploadthing.config.js
import { createUploadthing } from "uploadthing/server";

export const f = createUploadthing();

export const ourFileRouter = {
  folderImageUploader: f({ image: { maxFileSize: "3MB" } })
    .onUploadComplete(({ file }) => file),

  blogBannerUploader: f({ image: { maxFileSize: "3MB" } })
    .onUploadComplete(({ file }) => file),

  // mediaFileUploader: f({
  //   "application/pdf": { maxFileSize: "50MB", maxFileCount: 20 },
  //   image: { maxFileSize: "5MB", maxFileCount: 20 },
  //   audio: { maxFileSize: "20MB", maxFileCount: 20 },
  //   video: { maxFileSize: "100MB", maxFileCount: 20 },
  // }).onUploadComplete(({ file }) => {
  //   console.log("✅ Upload complete (server):", file); // <— this logs on server
  //   return {
  //     url: file.url,
  //     name: file.name,
  //     size: file.size,
  //     key: file.key,
  //   };
  // }),

  mediaFileUploader: f({
    "application/pdf": { maxFileSize: "50MB", maxFileCount: 20 },
    image: { maxFileSize: "5MB", maxFileCount: 20 },
    audio: { maxFileSize: "20MB", maxFileCount: 20 },
    video: { maxFileSize: "100MB", maxFileCount: 20 },
  }).onUploadComplete(({ file }) => file),
};
