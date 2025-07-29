"use client";

import React from "react";
import HTMLFlipBook from "react-pageflip";
import { X } from "lucide-react";
import Image from "next/image";

export default function FlipbookModalViewer({ pages, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="relative w-full h-full max-h-[90vh] max-w-7xl overflow-hidden bg-white rounded-xl shadow-lg">
        <button
          className="absolute top-3 right-3 text-white bg-red-500 p-2 rounded-full hover:bg-red-600 z-50"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="h-full flex items-center justify-center">
          <HTMLFlipBook
            width={600}
            height={800}
            size="stretch"
            showCover={false}
            mobileScrollSupport={true}
            maxWidth={1200}
            maxHeight={1600}
            className="w-full h-full"
          >
            {pages.map((src, index) => (
              <div
                key={index}
                className="bg-white w-full h-full flex items-center justify-center overflow-hidden"
              >
                {/* <img
                  src={src}
                  alt={`Page ${index + 1}`}
                  className="w-full h-full object-contain"
                /> */}
                <Image src={src} alt={`Page ${index + 1}`} className="w-full h-full object-contain"/>
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      </div>
    </div>
  );
}
