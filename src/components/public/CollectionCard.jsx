'use client';

import Link from "next/link";
import Image from "next/image";
import { Boxes } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export function CollectionCard({ collection, className = "" }) {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState("bottom");
  const cardRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setPosition(spaceBelow > 240 ? "bottom" : "top");
    };
  
    if (hovered) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, { passive: true });
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [hovered]);

  return (
    <div
      className={`relative overflow-visible ${className}`}
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/collection/${collection.id}`}
        className="block border border-border rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group bg-card"
      >
        {/* Main content area with background */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[5/4] p-6 flex flex-col items-center justify-center">
          <Image
            src="/collection_card_bg.png"
            alt="Card background"
            fill
            className="object-cover absolute inset-0 transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay for better content visibility */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px]" />

          {/* Centered content */}
          <div className="relative flex flex-col items-center text-center">
            {collection.imageUrl ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-white shadow-lg mx-auto mb-3 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={collection.imageUrl}
                  alt={collection.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/90 flex items-center justify-center text-3xl border-3 border-white shadow-lg mx-auto mb-3 transition-transform duration-300 group-hover:scale-110">
                📁
              </div>
            )}

            <h3 className="text-sm sm:text-sm font-bold text-black line-clamp-1 leading-tight px-2 drop-shadow-sm">
              {collection.name}
            </h3>
          </div>
        </div>

        {/* Bottom bar with enhanced styling */}
        <div className="flex items-center gap-3 text-base text-white px-4 py-3 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700/50">
          <Boxes className="w-8 h-8 opacity-90 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-semibold">
            {collection.itemCount ?? 0}{" "}
            {collection.itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </Link>

      {/* Improved hover tooltip with createPortal */}
      {hovered && (
              <div
                className={`
                  absolute z-50 w-64 sm:w-56 bg-white border border-gray-300 rounded-xl shadow-xl p-4
                  ${position === "top" ? "-top-2 -translate-y-full" : "top-full mt-2"}
                  left-1/2 -translate-x-1/2
                `}
              >
                {/* Triangle pointer */}
                <div
                  className={`
                    absolute left-1/2 -translate-x-1/2 w-0 h-0
                    ${
                      position === "top"
                        ? "top-full border-l-8 border-r-8 border-t-8 border-transparent border-t-white"
                        : "-top-2 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"
                    }
                    shadow-sm
                  `}
                />
      
                {collection.imageUrl ? (
                  <div className="relative w-24 h-24 mx-auto mb-2 rounded-full overflow-hidden border-2 border-black shadow-md">
                    <Image
                      src={collection.imageUrl}
                      alt={collection.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center text-4xl border-2 border-black shadow-md">
                    📁
                  </div>
                )}
      
                <div className="text-sm font-semibold text-center mb-1">
                  {collection.name}
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {collection.itemCount ?? 0}{" "}
                  {collection.itemCount === 1 ? "item" : "items"}
                </div>
      
                
              </div>
            )}


    </div>
  );
}