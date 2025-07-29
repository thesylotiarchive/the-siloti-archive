'use client';

import Link from "next/link";
import Image from "next/image";
import { Boxes } from "lucide-react";
import { useState, useRef } from "react";

export function CollectionCard({ collection }) {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState('top');
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      // Prefer top, but if not enough space, use bottom
      if (spaceAbove < 200 && spaceBelow > spaceAbove) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }

      setHovered(true);
    }
  };

  return (
    <div
      className="relative"
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/collection/${collection.id}`}
        className="block bg-card border border-border rounded-2xl overflow-hidden shadow transition-transform hover:shadow-xl hover:-translate-y-1 
          sm:rounded-xl sm:text-sm" // smaller radius/text on small screens
      >
        {collection.imageUrl ? (
          <div className="relative w-full aspect-[4/3] bg-muted sm:aspect-[5/4]">
            <Image
              src={collection.imageUrl}
              alt={collection.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center text-4xl sm:text-2xl">
            📁
          </div>
        )}

        <div className="p-4 pb-3 flex sm:p-2 sm:pb-1">
          <h3 className="text-base font-semibold mb-1 line-clamp-1 sm:text-sm">
            {collection.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-sm text-white px-4 py-2 bg-gray-800 border-t border-gray-700 sm:px-2 sm:py-1 sm:text-xs">
          <Boxes className="w-4 h-4 opacity-80 sm:w-3 sm:h-3" />
          <span className="font-medium">
            {collection.itemCount ?? 0} {collection.itemCount === 1 ? "item" : "items"}
          </span>
        </div>

      </Link>

      {/* Hover Preview */}
      {hovered && (
        <div
          className={`
            absolute z-50 w-64 sm:w-56 bg-white border border-gray-300 rounded-xl shadow-xl p-4
            ${position === 'top' ? '-top-2 -translate-y-full' : 'top-full mt-2'}
            left-1/2 -translate-x-1/2
          `}
        >
          {/* Triangle pointer */}
          <div
            className={`
              absolute left-1/2 -translate-x-1/2 w-0 h-0
              ${position === 'top'
                ? 'top-full border-l-8 border-r-8 border-t-8 border-transparent border-t-white'
                : '-top-2 border-l-8 border-r-8 border-b-8 border-transparent border-b-white'}
              shadow-sm
            `}
          />

          {collection.imageUrl ? (
            <div className="relative w-full aspect-video mb-2 rounded-lg overflow-hidden">
              <Image
                src={collection.imageUrl}
                alt={collection.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full aspect-video mb-2 bg-muted flex items-center justify-center text-4xl rounded-lg">
              📁
            </div>
          )}

          <div className="text-sm font-semibold mb-1">{collection.name}</div>
          <div className="text-xs text-muted-foreground">
            {collection.itemCount ?? 0}{" "}
            {collection.itemCount === 1 ? "item" : "items"}
          </div>
        </div>
      )}
    </div>
  );
}
