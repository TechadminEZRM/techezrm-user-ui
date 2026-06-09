"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchBox from "@/components/SearchBox";
import SearchResults from "@/components/SearchResults";
import { searchHandler } from "@/api/handlers/searchHandler";
import type { SearchResults as SearchResultsType } from "@/api/handlers/searchHandler";

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchResults, setSearchResults] = useState<SearchResultsType>({
    products: [], categories: [], totalProducts: 0, totalCategories: 0, total: 0, page: 1, limit: 20, totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(query);

  useEffect(() => {
    if (query) { setCurrentQuery(query); performSearch(query); }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await searchHandler.search(searchQuery.trim());
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults({ products: [], categories: [], totalProducts: 0, totalCategories: 0, total: 0, page: 1, limit: 20, totalPages: 1 });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <SearchBox fullWidth showDropdown={false} placeholder="Search products, categories..." />
        </div>

        {/* Search Results */}
        <SearchResults
          products={searchResults.products}
          categories={searchResults.categories}
          totalProducts={searchResults.totalProducts}
          totalCategories={searchResults.totalCategories}
          searchQuery={currentQuery}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default SearchPage;
