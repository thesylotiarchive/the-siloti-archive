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
    <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
      <div className="flex items-center gap-1.5">
        <Eye className="w-4 h-4 text-blue-400" /> 
        <span className="font-medium">{views || 0}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <ThumbsUp className="w-4 h-4 text-emerald-400" /> 
        <span className="font-medium">{likeCount}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <MessageCircle className="w-4 h-4 text-purple-400" /> 
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
        className={`inline-flex items-center gap-2 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r cursor-pointer from-emerald-400 to-blue-500 hover:from-emerald-300 hover:to-blue-400`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </Link>
    );
  };

  const renderMediaContent = () => {
    switch (mediaType) {
      case "IMAGE":
        return (
          <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-md overflow-hidden animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Image Preview</h3>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10">
                <img
                  src={url}
                  alt={title}
                  className="w-full max-w-4xl mx-auto rounded-2xl object-contain bg-slate-950/30"
                />
              </div>
            </div>
          </div>
        );

      case "AUDIO":
        return (
          <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-md overflow-hidden animate-fadeIn">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-950/40 border border-green-500/20 flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Audio Player</h3>
                  <p className="text-white/55 text-xs sm:text-sm font-light">High-quality audio playback</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex justify-center">
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
          <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-md overflow-hidden animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/20 flex items-center justify-center">
                  <Play className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Video Player</h3>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10">
                <video controls className="w-full max-w-4xl mx-auto rounded-2xl bg-slate-950/30">
                  <source src={url} />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        );

      case "PDF":
        return (
          <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-md overflow-hidden animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">PDF Document</h3>
                </div>
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-lg shadow-md transition-all cursor-pointer"
                >
                  Fullscreen
                </button>
              </div>
              <div className="w-full h-[60vh] md:h-[75vh] rounded-2xl overflow-hidden shadow-lg border border-white/10">
                <iframe src={url} title="PDF Preview" className="w-full h-full bg-slate-900/50" frameBorder="0" />
              </div>
            </div>
      
            {/* Fullscreen Modal */}
            {showPdfModal && (
              <div className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center animate-fadeIn">
                {/* Close Button - Floating */}
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="absolute flex items-center gap-2 bottom-6 right-6 px-5 py-2.5 bg-slate-900 border border-white/10 text-white rounded-full shadow-2xl hover:bg-slate-800 transition-colors cursor-pointer text-sm font-semibold"
                  aria-label="Close"
                >
                  <Maximize2 className="w-4 h-4 text-emerald-400" />
                  <span>Close Fullscreen</span>
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
          <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-md overflow-hidden animate-fadeIn">
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-amber-950/40 border border-amber-500/20 flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Document File</h3>
              <p className="text-white/60 text-sm max-w-md font-light mb-8">
                This document format is not viewable in-browser. Download it to view the content.
              </p>
              <a
                href={url}
                download
                className={`inline-flex items-center gap-2 text-slate-950 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r cursor-pointer from-emerald-400 to-blue-500 hover:from-emerald-300 hover:to-blue-400`}
              >
                <Download className="w-4 h-4" />
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
      <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] backdrop-blur-md p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {renderStats()}
          
          <div className="flex flex-wrap gap-3">
            {isExternal && renderButton("Open External", url, ExternalLink)}
            
            {!isExternal && !["IMAGE", "AUDIO", "VIDEO", "PDF", "DOC"].includes(mediaType) && (
              <a
                href={url}
                download
                className={`inline-flex items-center gap-2 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r cursor-pointer from-emerald-400 to-blue-500 hover:from-emerald-300 hover:to-blue-400`}
              >
                <Download className="w-4 h-4" />
                Download File
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}