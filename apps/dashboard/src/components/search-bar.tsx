"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  // Update local state when URL params change (e.g. on navigation)
  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    
    router.push(`/failed-events?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-96 group">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events, orders, or replay IDs..."
        className="w-full rounded-full border border-white/5 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none transition-all"
      />
    </form>
  );
}
