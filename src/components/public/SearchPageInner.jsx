"use client";

import CardWrapper from "@/components/public/CardWrapper";
import { CollectionCard } from "@/components/public/CollectionCard";
import FilterSidebar from "@/components/public/FilterBar";
import { MediaCard } from "@/components/public/MediaCard";
import ShareModal from "@/components/public/ShareModal";
import { useSearch } from "@/lib/hooks/useSearch";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";

// ✅ Simple skeleton card
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="w-full aspect-[3/4] bg-gray-200" />
    </div>
  );
}

export default function SearchPageInner({ initialQuery }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shareUrl, setShareUrl] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile sidebar toggle

  // ✅ Initial query
  const urlQuery = searchParams.get("q") || initialQuery || "";
  const [inputValue, setInputValue] = useState(urlQuery);

  // ✅ Filters state
  const [filters, setFilters] = useState({
    mediaType: [],
    language: [],
    tags: [],
  });

  // ✅ Final search params passed into hook
  const searchParamsMemo = useMemo(
    () => ({
      query: urlQuery,
      filters,
    }),
    [urlQuery, filters]
  );

  const { results, loading, error, loadMore, hasMore } =
    useSearch(searchParamsMemo);

  const loaderRef = useRef(null);

  // ✅ Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, loading, loadMore]);

  // ✅ When user types + submits, update URL
  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
  };

  const handleShare = (url) => setShareUrl(url);
  const closeShareModal = () => setShareUrl(null);

  // ✅ Sync input field if URL changes
  useEffect(() => {
    setInputValue(urlQuery);
  }, [urlQuery]);

  return (
    <main className="w-full px-3 sm:px-6 md:px-10 py-10">
      <div className="max-w-7xl mx-auto">
        {/* 🔍 Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col lg:flex-row items-center justify-center gap-2 mb-6 max-w-xl mx-auto w-full"
        >
          <div className="relative flex-grow w-full">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search the archive..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Buttons row */}
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
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="flex gap-8 mt-8">
        {/* Sidebar (desktop) */}
        <div className="hidden lg:block">
          <FilterSidebar activeFilters={filters} onChange={setFilters} />
        </div>

        {/* Results */}
        <div className="flex-1">
          {urlQuery && (
            <p className="text-center text-muted-foreground mb-8">
              Showing results for{" "}
              <span className="text-primary">"{urlQuery}"</span>
            </p>
          )}

          {/* Initial loading skeletons */}
          {loading && results.length === 0 && (
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && results.length === 0 && (
            <p className="text-center text-muted-foreground">
              No results found.
            </p>
          )}

          {/* Results grid */}
          {results.length > 0 && (
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

              {/* Infinite scroll skeletons */}
              {loading &&
                results.length > 0 &&
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={`s-${i}`} />
                ))}
            </div>
          )}

          {/* Observer target */}
          {hasMore && !loading && <div ref={loaderRef} className="h-10" />}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="relative ml-auto w-72 max-w-full h-full bg-white dark:bg-gray-900 shadow-xl p-4 overflow-y-auto">
            <button
              onClick={() => setFiltersOpen(false)}
              className="mb-4 text-sm text-gray-500 hover:text-gray-800"
            >
              ✕ Close
            </button>
            <FilterSidebar activeFilters={filters} onChange={setFilters} />
          </div>
        </div>
      )}

      {shareUrl && <ShareModal url={shareUrl} onClose={closeShareModal} />}
    </main>
  );
}
