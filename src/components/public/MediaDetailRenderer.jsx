"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  Eye,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  Download,
} from "lucide-react";
import { getPdfPagesAsImages } from "@/utils/pdfToImages";
// import PdfReader from "./PdfReader";

// Dynamically import viewers to avoid SSR issues
const FlipbookViewer = dynamic(() => import('@/components/public/FlipbookViewer'), { ssr: false });
const FlipbookModalViewer = dynamic(() => import('@/components/public/FlipbookModalViewer'), { ssr: false });
const PdfReader = dynamic(() => import('@/components/public/PdfReader'), { ssr: false });

export function MediaDetailRenderer({ media }) {
  const {
    title,
    fileUrl,
    externalLink,
    mediaType,
    viewCount = 42,
    likeCount = 5,
    commentCount = 2,
  } = media;

  const isExternal = !!externalLink;
  const url = isExternal ? externalLink : fileUrl;

  const [pages, setPages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mediaType === "PDF" && url) {
      getPdfPagesAsImages(url).then(setPages).catch(console.error);
    }
  }, [mediaType, url]);

  const renderStats = () => (
    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-muted-foreground text-sm mt-6">
      <div className="flex items-center gap-1">
        <Eye className="w-4 h-4" /> {viewCount}
      </div>
      <div className="flex items-center gap-1">
        <ThumbsUp className="w-4 h-4" /> {likeCount}
      </div>
      <div className="flex items-center gap-1">
        <MessageCircle className="w-4 h-4" /> {commentCount}
      </div>
    </div>
  );

  const renderButton = (label, href) => (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-[#74C043] text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-[#0A65A8] transition"
    >
      <ExternalLink className="w-4 h-4" />
      {label}
    </Link>
  );

  const renderMediaContent = () => {
    switch (mediaType) {
      case "IMAGE":
        return (
          <img
            src={url}
            alt={title}
            className="w-full max-w-3xl mx-auto rounded shadow border"
          />
        );

      case "AUDIO":
        return (
          <audio controls className="w-full max-w-2xl mx-auto block rounded border">
            <source src={url} />
            Your browser does not support the audio tag.
          </audio>
        );

      case "VIDEO":
        return (
          <video controls className="w-full max-w-3xl mx-auto rounded border">
            <source src={url} />
            Your browser does not support the video tag.
          </video>
        );

      case "PDF":
        return (
          <div className="my-6 w-full">
            <div className="w-full h-[60vh] md:h-[75vh] rounded border overflow-hidden">
              {/* <iframe
                src={url}
                title="PDF Preview"
                className="w-full h-full"
                frameBorder="0"
              /> */}

              <iframe
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/pdf-viewer?fileUrl=${encodeURIComponent(url)}`}
                title="PDF Preview"
                className="w-full h-full"
                frameBorder="0"
              />
            </div>
      
            <div className="mt-4 flex justify-center">
              <Link
                href={`/pdf-viewer?fileUrl=${encodeURIComponent(url)}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Full Screen View
              </Link>
            </div>
          </div>
        );

      case "DOC":
        return (
          <p className="text-sm text-muted-foreground mt-4">
            This document format is not viewable in-browser.{" "}
            <a href={url} download className="text-blue-600 underline">
              Download it here.
            </a>
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border rounded-xl p-4 sm:p-6 shadow mt-6 sm:mt-8 w-full">
      {renderMediaContent()}

      {isExternal && (
        <div className="mt-4">
          {renderButton("Open External Resource", url)}
        </div>
      )}

      {!isExternal &&
        !["IMAGE", "AUDIO", "VIDEO", "PDF", "DOC"].includes(mediaType) && (
          <a
            href={url}
            download
            className="inline-flex items-center gap-2 bg-[#74C043] text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-[#0A65A8] transition mt-4"
          >
            <Download className="w-4 h-4" />
            Download File
          </a>
        )}

      {renderStats()}
    </div>
  );
}
