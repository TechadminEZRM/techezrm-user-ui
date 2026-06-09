"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Tag, LayoutGrid, TrendingUp } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { searchHandler } from "@/api/handlers/searchHandler";
import type { SearchProduct, SearchCategory } from "@/api/services/search";

interface SearchBoxProps {
  onSearchResults?: (results: any) => void;
  placeholder?: string;
  fullWidth?: boolean;
  showDropdown?: boolean;
}

const popularSearches = ["BCAA", "Protein", "Vitamins", "Creatine", "Amino Acids"];

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearchResults,
  placeholder = "Search products, categories...",
  fullWidth = false,
  showDropdown = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{ products: SearchProduct[]; categories: SearchCategory[] }>({ products: [], categories: [] });

  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ products: [], categories: [] });
      return;
    }
    setLoading(true);
    try {
      const results = await searchHandler.search(query, 1, 6);
      setSearchResults({ products: results.products, categories: results.categories });
      onSearchResults?.(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ products: [], categories: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (showDropdown) {
      setIsOpen(true);
      const timeoutId = setTimeout(() => handleSearch(value), 300);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductClick = (productId: string) => {
    setIsOpen(false);
    setSearchQuery("");
    router.push(`/product/detail/${productId}`);
  };

  const handleCategoryClick = (slug: string) => {
    setIsOpen(false);
    setSearchQuery("");
    router.push(`/product?category=${slug}`);
  };

  const handlePopularSearchClick = (term: string) => {
    setSearchQuery(term);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults({ products: [], categories: [] });
    setIsOpen(false);
  };

  const hasResults = searchResults.products.length > 0 || searchResults.categories.length > 0;

  return (
    <div ref={searchRef} className={`relative ${fullWidth ? "w-full" : ""}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-5 h-5 text-dim pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => showDropdown && setIsOpen(true)}
            placeholder={placeholder}
            className={`${fullWidth ? "w-full" : ""} bg-white border border-line-light rounded-lg pl-10 pr-10 py-3 text-sm text-body placeholder:text-faint focus:outline-none focus:border-brand hover:border-line-light transition-colors`}
          />
          {searchQuery && (
            <button type="button" onClick={handleClear} className="absolute right-3 text-dim hover:text-body transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      {showDropdown && isOpen && (
        <div className="absolute top-full left-0 right-0 z-[1300] mt-1 max-h-[400px] overflow-auto rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-line-light bg-white">
          {loading ? (
            <div className="p-6 flex flex-col items-center gap-2">
              <Spinner size="sm" />
              <span className="text-sm text-dim">Searching...</span>
            </div>
          ) : searchQuery.trim() === "" ? (
            /* Popular Searches */
            <div className="p-4">
              <p className="text-sm font-semibold text-body mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handlePopularSearchClick(term)}
                    className="text-sm px-3 py-1 rounded-full border border-line-light text-dim hover:bg-brand hover:text-white hover:border-brand transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : hasResults ? (
            <div className="py-1">
              {/* Categories */}
              {searchResults.categories.length > 0 && (
                <>
                  <p className="px-4 py-2 text-xs font-semibold text-body">Categories</p>
                  {searchResults.categories.map((category: any) => (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => handleCategoryClick(category.slug)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[rgba(255,107,53,0.04)] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
                        <LayoutGrid className="w-[18px] h-[18px] text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-body">{category.name}</p>
                        {category.description && <p className="text-xs text-dim">{category.description}</p>}
                      </div>
                    </button>
                  ))}
                  {searchResults.products.length > 0 && <hr className="border-line-light my-1" />}
                </>
              )}

              {/* Products */}
              {searchResults.products.length > 0 && (
                <>
                  <p className="px-4 py-2 text-xs font-semibold text-body">Products</p>
                  {searchResults.products.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => handleProductClick(product._id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[rgba(255,107,53,0.04)] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-wash flex items-center justify-center flex-shrink-0">
                        {(product.bannerImage || product.images?.[0]) ? (
                          <img src={product.bannerImage || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Tag className="w-[18px] h-[18px] text-dim" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-body truncate">{product.name}</p>
                        <p className="text-xs text-dim">{product.uniqueId} • ${product.price}</p>
                      </div>
                      {product.inStock && (
                        <span className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full bg-success text-white flex-shrink-0">In Stock</span>
                      )}
                    </button>
                  ))}
                </>
              )}

              {/* View All Results */}
              <hr className="border-line-light" />
              <div className="p-3">
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); router.push(`/search?q=${encodeURIComponent(searchQuery)}`); }}
                  className="w-full py-2 border border-brand text-brand text-sm font-medium rounded-lg hover:bg-[rgba(249,169,34,0.04)] hover:border-brand-hover transition-colors"
                >
                  View All Results
                </button>
              </div>
            </div>
          ) : (
            /* No Results */
            <div className="p-6 flex flex-col items-center gap-2 text-center">
              <Search className="w-12 h-12 text-line-light" />
              <p className="text-sm text-dim">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
