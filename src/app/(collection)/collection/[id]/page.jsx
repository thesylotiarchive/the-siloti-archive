"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MediaCard } from "@/components/public/MediaCard";
import { CollectionCard } from "@/components/public/CollectionCard";
import ShareModal from "@/components/public/ShareModal";
import FilterSidebar from "@/components/public/FilterBar";
import { useSearch } from "@/lib/hooks/useSearch";
import { X } from "lucide-react";

// ✅ Skeleton card (same aspect ratio as your cards)
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="w-full aspect-[3/4] bg-gray-200" />
    </div>
  );
}

export default function CollectionViewPage() {
  const { id } = useParams();

  const [collection, setCollection] = useState(null);
  const [subcollections, setSubcollections] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [shareUrl, setShareUrl] = useState(null);

  const [filtersOpen, setFiltersOpen] = useState(false);

  // 🔍 search + filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [filters, setFilters] = useState({
    mediaType: [],
    language: [],
    tags: [],
  });

  // ✅ Search params
  const searchParams = useMemo(
    () => ({
      query: submittedQuery,
      filters: { ...filters, collectionId: id },
    }),
    [submittedQuery, filters, id]
  );

  // ✅ Hook for search + filter results
  const {
    results,
    loading: searchLoading,
    error: searchError,
    loadMore,
    hasMore,
  } = useSearch(searchParams);

  const loaderRef = useRef(null);

  // ✅ Infinite scroll observer
  useEffect(() => {
    if (!hasMore || searchLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, searchLoading, loadMore]);

  // ✅ Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery.trim());
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSubmittedQuery("");
  };

  const handleShare = (url) => setShareUrl(url);
  const closeShareModal = () => setShareUrl(null);

  // ✅ Fetch default collection data
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

  // ✅ Breadcrumb builder
  const renderBreadcrumb = () => {
    const crumbs = [];
    let current = collection?.parent;
    while (current) {
      crumbs.unshift(current);
      current = current.parent;
    }
    return crumbs;
  };

  // ✅ Whether we’re in search/filter mode
  const inSearchMode = submittedQuery || filters.mediaType.length || filters.language.length || filters.tags.length;

  if (loading) return <p className="p-8">Loading...</p>;
  if (!collection) return <p className="text-muted-foreground p-8">Collection not found.</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
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
      <div className="flex items-center gap-4 mb-6">
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
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          {collection.description && (
            <p className="text-muted-foreground mt-1">{collection.description}</p>
          )}
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col lg:flex-row items-center justify-center gap-2 mb-10 max-w-xl mx-auto w-full"
      >
        {/* Input */}
        <div className="relative flex-grow w-full">
          <input
            type="text"
            placeholder="Search in this collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-800"
            >
              ✕
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 w-full lg:w-auto justify-end lg:justify-start mt-2 lg:mt-0">
          <button
            type="submit"
            className="flex-1 lg:flex-none px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 whitespace-nowrap"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex-1 lg:hidden px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 whitespace-nowrap"
          >
            Filters
          </button>
        </div>
      </form>


      {/* Mobile filter button */}
      {/* <div className="mb-6 lg:hidden flex justify-start">
        <button
          onClick={() => setFiltersOpen(true)}
          className="px-4 py-2 bg-primary text-white lg:hidden rounded-lg hover:bg-primary/90"
        >
          Filters
        </button>
      </div> */}

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <div className="hidden lg:block">
          <FilterSidebar activeFilters={filters} onChange={setFilters} />
        </div>

        {/* Results */}
        <div className="flex-1">
          {inSearchMode ? (
            <>
              {searchError && <p className="text-red-500">{searchError}</p>}

              {submittedQuery && (
                <p className="text-left text-muted-foreground mb-8">
                  Showing results for{" "}
                  <span className="text-primary">"{submittedQuery}"</span>
                </p>
              )}

              {/* Initial loading */}
              {searchLoading && results.length === 0 && (
                <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!searchLoading && results.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No results found in this collection.
                </p>
              )}

              {/* Results grid */}
              {results.length > 0 && (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                  {results.map((item) =>
                    item.type === "collection" ? (
                      <CollectionCard key={`c-${item.id}`} collection={item} />
                    ) : (
                      <MediaCard
                        key={`m-${item.id}`}
                        mediaItem={item}
                        onShare={handleShare}
                      />
                    )
                  )}

                  {/* Scroll skeletons */}
                  {searchLoading &&
                    results.length > 0 &&
                    Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonCard key={`s-${i}`} />
                    ))}
                </div>
              )}

              {/* Observer target */}
              {hasMore && !searchLoading && (
                <div ref={loaderRef} className="h-10" />
              )}
            </>
          ) : (
            // 🔙 Default collection view
            <>
              {subcollections.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-xl font-semibold mb-4">Subcollections</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {subcollections.map((col) => (
                      <CollectionCard key={col.id} collection={col} />
                    ))}
                  </div>
                </div>
              )}

              {mediaItems.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Media Items</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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

              {mediaItems.length === 0 && subcollections.length === 0 && (
                <p className="text-muted-foreground">
                  This collection is currently empty.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setFiltersOpen(false)}
          />
          {/* Panel */}
          <div className="relative ml-auto w-72 max-w-full bg-white dark:bg-gray-900 h-full shadow-lg p-4">
            <button
              className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setFiltersOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <FilterSidebar activeFilters={filters} onChange={setFilters} />
          </div>
        </div>
      )}

      {shareUrl && <ShareModal url={shareUrl} onClose={closeShareModal} />}
    </main>
  );
}
