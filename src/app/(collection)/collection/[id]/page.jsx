"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MediaCard } from "@/components/public/MediaCard";
import { CollectionCard } from "@/components/public/CollectionCard";
import ShareModal from "@/components/public/ShareModal";

export default function CollectionViewPage() {
  const params = useParams();
  const { id } = params;

  const [collection, setCollection] = useState(null);
  const [subcollections, setSubcollections] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [shareUrl, setShareUrl] = useState(null);

  const handleShare = (url) => {
    setShareUrl(url);
  };

  const closeShareModal = () => {
    setShareUrl(null);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [collectionRes, mediaRes, subsRes] = await Promise.all([
        fetch(`/api/public/collections/${id}`),
        fetch(`/api/public/media?collectionId=${id}`),
        fetch(`/api/public/collections?parentId=${id}`),
      ]);

      const [collectionData, mediaData, subsData] = await Promise.all([
        collectionRes.json(),
        mediaRes.json(),
        subsRes.json(),
      ]);

      setCollection(collectionData);
      console.log("Collection data: ", collectionData)
      setMediaItems(mediaData);
      setSubcollections(subsData);
    } catch (err) {
      console.error("Failed to load collection view", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const renderBreadcrumb = () => {
    const crumbs = [];
    let current = collection?.parent;
    while (current) {
      crumbs.unshift(current);
      current = current.parent;
    }
    return crumbs;
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow animate-pulse"
            >
              {/* Image/Thumbnail */}
              <div className="relative w-full aspect-[4/3] bg-gray-300" />

              {/* Text Section */}
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-gray-400 rounded" />
                <div className="h-3 w-1/2 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (!collection) {
    return <p className="text-muted-foreground p-8">Collection not found.</p>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-4">
        <Link href="/collection" className="hover:underline">Home</Link>
        {renderBreadcrumb().map((crumb) => (
          <span key={crumb.id}>
            {" / "}
            <Link href={`/collection/${crumb.id}`} className="hover:underline">
              {crumb.name}
            </Link>
          </span>
        ))}
        <span>{" / "}{collection.name}</span>
      </div>

      {/* Title & Thumbnail */}
      <div className="flex items-center gap-4 mb-8">
        {collection.imageUrl && (
          <Image
            src={collection.imageUrl}
            alt={collection.name}
            width={80}
            height={80}
            className="rounded object-cover border"
          />
        )}
        <div>
          {/* <h1 className="text-3xl font-bold">{collection.name}</h1> */}
          {collection.description && (
            <p className="text-muted-foreground mt-1">{collection.description}</p>
          )}
        </div>
      </div>

      {/* Subcollections */}
      {subcollections.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Subcollections</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {subcollections.map((col) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        </div>
      )}

      {/* Media Items */}
      {mediaItems.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Media Items</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {mediaItems.map((item) => (
              <MediaCard
                key={item.id}
                mediaItem={item}
                onShare={handleShare}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {mediaItems.length === 0 && subcollections.length === 0 && (
        <p className="text-muted-foreground">This collection is currently empty.</p>
      )}

      {shareUrl && (
        <ShareModal url={shareUrl} onClose={closeShareModal} />
      )}
    </main>
  );
}
