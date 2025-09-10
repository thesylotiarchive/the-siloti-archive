"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");

  // debounce search input (wait 400ms after typing)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(input), 400);
    return () => clearTimeout(handler);
  }, [input]);

  // call parent onSearch when debounced value changes
  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search collections and media..."
        className="w-full pl-10 pr-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
      />
    </div>
  );
}
