// useSearch.js
"use client";
import { useState, useEffect, useCallback } from "react";

// Custom search hook
export function useSearch({ query = "", filters = {}, pageSize = 20 }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(
    !!(query || Object.keys(filters).length > 0)
  );
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Track previous values for synchronous render-time state resets
  const [prevQuery, setPrevQuery] = useState(query);
  const [prevFilters, setPrevFilters] = useState(filters);

  const filtersStr = JSON.stringify(filters);
  const prevFiltersStr = JSON.stringify(prevFilters);

  if (query !== prevQuery || filtersStr !== prevFiltersStr) {
    setPrevQuery(query);
    setPrevFilters(filters);
    setResults([]);
    setPage(1);
    if (query || Object.keys(filters).length > 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (filters.mediaType?.length)
        params.set("mediaType", filters.mediaType.join(","));
      if (filters.language?.length)
        params.set("language", filters.language.join(","));
      if (filters.tags?.length)
        params.set("tags", filters.tags.join(","));

      // ✅ Ensure collectionId is passed
      if (filters.collectionId) params.set("collectionId", filters.collectionId);

      params.set("page", page);
      params.set("limit", pageSize);

      const res = await fetch(`/api/public/search?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch search results");
      const data = await res.json();

      setResults((prev) =>
        page === 1 ? data.results : [...prev, ...data.results]
      );

      setHasMore(
        data.pagination.page * data.pagination.limit < data.pagination.total
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query, filtersStr, page, pageSize]); // depend on filtersStr for stable reference

  useEffect(() => {
    // ✅ Always allow fetch when filters.collectionId is set,
    // even if no query or other filters are active
    if (query || Object.keys(filters).length > 0) {
      fetchResults();
    }
  }, [fetchResults, query, filtersStr, page]);

  return {
    results,
    loading,
    error,
    loadMore: () => setPage((p) => p + 1),
    reset: () => setPage(1),
    hasMore,
  };
}
