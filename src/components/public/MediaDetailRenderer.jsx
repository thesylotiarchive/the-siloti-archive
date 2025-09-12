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
  Play,
  Volume2,
  FileText,
  Image as ImageIcon,
  Monitor,
  X,
  Maximize2,
  Search,
} from "lucide-react";
import { getPdfPagesAsImages } from "@/utils/pdfToImages";



// Dynamically import viewers to avoid SSR issues
const FlipbookViewer = dynamic(() => import('@/components/public/FlipbookViewer'), { ssr: false });
const FlipbookModalViewer = dynamic(() => import('@/components/public/FlipbookModalViewer'), { ssr: false });
const PdfReader = dynamic(() => import('@/components/public/PdfReader'), { ssr: false });

export function MediaDetailRenderer({ media, config }) {
  const {
    title,
    fileUrl,
    externalLink,
    mediaType,
    views,
    likeCount = 5,
    commentCount = 2,
  } = media;

  const isExternal = !!externalLink;
  const url = isExternal ? externalLink : fileUrl;

  const [pages, setPages] = useState([]);
  const [showPdfModal, setShowPdfModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mediaType === "PDF" && url) {
      getPdfPagesAsImages(url).then(setPages).catch(console.error);
    }
  }, [mediaType, url]);

  const renderStats = () => (
    <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm">
      <div className="flex items-center gap-1">
        <Eye className="w-4 h-4 text-blue-500" /> 
        <span className="font-medium">{views || 0}</span>
      </div>
      <div className="flex items-center gap-1">
        <ThumbsUp className="w-4 h-4 text-green-500" /> 
        <span className="font-medium">{likeCount}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageCircle className="w-4 h-4 text-purple-500" /> 
        <span className="font-medium">{commentCount}</span>
      </div>
    </div>
  );

  const renderButton = (label, href, icon = ExternalLink) => {
    const Icon = icon;
    return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r ${config.color}`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
    );
  };

  const renderMediaContent = () => {
    switch (mediaType) {
      case "IMAGE":
        return (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={url}
                  alt={title}
                  className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg border border-gray-200"
                />
              </div>
            </div>
          </div>
        );

      case "AUDIO":
        return (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Audio Player</h3>
                  <p className="text-gray-600 text-sm">High-quality audio playback</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
                <audio controls className="w-full max-w-2xl mx-auto block rounded-xl shadow-lg">
                  <source src={url} />
                  Your browser does not support the audio tag.
                </audio>
              </div>
            </div>
          </div>
        );

      case "VIDEO":
        return (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <Play className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Video Player</h3>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <video controls className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg">
                  <source src={url} />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        );

        case "PDF":
          return (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">PDF Document</h3>
                  </div>
                  <button
                    onClick={() => setShowPdfModal(true)}
                    className="px-3 py-1 text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow"
                  >
                    Fullscreen
                  </button>
                </div>
                <div className="w-full h-[60vh] md:h-[75vh] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                  <iframe src={url} title="PDF Preview" className="w-full h-full" frameBorder="0" />
                </div>
              </div>
        
              {/* Fullscreen Modal */}
              {showPdfModal && (
                <div className="fixed inset-0 z-[99999] bg-black/80 flex items-center justify-center">
                  
                  

                  {/* Close Button - Floating */}
                  <button
                    onClick={() => setShowPdfModal(false)}
                    className="absolute flex items-center gap-2 bottom-6 right-6 px-4 py-2 bg-white text-gray-800 rounded-full shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <Maximize2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Close Fullscreen</span>
                  </button>

                  {/* Fullscreen Iframe */}
                  <iframe
                    src={url}
                    title="PDF Fullscreen"
                    className="w-full h-full border-none"
                  />
                </div>
              )}
            </div>
          );
        

      case "DOC":
        return (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Document File</h3>
              <p className="text-gray-600 mb-6">
                This document format is not viewable in-browser. Download it to view the content.
              </p>
              <a
                href={url}
                download
                className={`inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r ${config.color}`}
              >
                <Download className="w-5 h-5" />
                Download Document
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {renderMediaContent()}

      {/* Action Buttons */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {renderStats()}
          
          <div className="flex flex-wrap gap-3">
            {isExternal && renderButton("Open External", url, ExternalLink)}
            
            {!isExternal && !["IMAGE", "AUDIO", "VIDEO", "PDF", "DOC"].includes(mediaType) && (
              <a
                href={url}
                download
                className={`inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r ${config.color}`}
              >
                <Download className="w-5 h-5" />
                Download File
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}