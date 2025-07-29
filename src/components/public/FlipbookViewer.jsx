"use client";

import React from "react";
import HTMLFlipBook from "react-pageflip";

export default function FlipbookViewer({ pages }) {
  if (!pages || pages.length === 0) return <p>Loading...</p>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <HTMLFlipBook
        width={400}
        height={550}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1536}
        showCover={false}
        mobileScrollSupport={true}
        className="shadow-lg"
      >
        {pages.map((src, index) => (
          <div
            key={index}
            className="bg-white w-full h-full flex items-center justify-center overflow-hidden"
          >
            <img
              src={src}
              alt={`Page ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}
