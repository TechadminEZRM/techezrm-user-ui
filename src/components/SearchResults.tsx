"use client";

import React, { useState } from "react";
import { Tag, LayoutGrid, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SearchProduct, SearchCategory } from "@/api/services/search";
import { useAppStore } from "@/store/use-app-store";
import { useAddToCart } from "@/api/handlers";
import ProductCard from "./ProductCard";
import { toast } from "react-toastify";

interface SearchResultsProps {
  products: SearchProduct[];
  categories: SearchCategory[];
  totalProducts: number;
  totalCategories: number;
  searchQuery: string;
  loading?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  categories,
  totalProducts,
  totalCategories,
  searchQuery,
  loading = false,
}) => {
  const router = useRouter();
  const { customer, isAuthenticated } = useAppStore();
  const addToCartMutation = useAddToCart();

  const handleProductClick = (productId: string) => {
    router.push(`/product/detail/${productId}`);
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/product?category=${slug}`);
  };

  const handleAddToCart = (product: any, unitSize: any) => {
    if (!isAuthenticated || !customer) {
      router.push("/sign_in");
      return;
    }
    addToCartMutation.mutate(
      { customerId: customer.id, productId: product?._id, quantity: unitSize },
      {
        onSuccess: () => toast.success("Added to cart successfully!"),
        onError: (error) => {
          console.error("Failed to add to cart:", error);
          toast.error("Failed to add product to cart. Please try again.");
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-[#666]">Searching...</p>
      </div>
    );
  }

  const hasResults = totalProducts > 0 || totalCategories > 0;

  return (
    <div className="p-6">
      {/* Search Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#333] mb-1">Search Results --</h2>
        <p className="text-[#666] mb-4">
          {hasResults ? (
            <>Found {totalProducts + totalCategories} results for "<strong>{searchQuery}</strong>"</>
          ) : (
            <>No results found for "<strong>{searchQuery}</strong>"</>
          )}
        </p>

        {hasResults && (
          <div className="flex flex-wrap gap-2">
            {totalProducts > 0 && (
              <span className="flex items-center gap-1.5 text-sm border border-[#F9A922] text-[#F9A922] px-3 py-1 rounded-full">
                <Tag className="w-4 h-4" />
                {totalProducts} Products
              </span>
            )}
            {totalCategories > 0 && (
              <span className="flex items-center gap-1.5 text-sm border border-[#9c27b0] text-[#9c27b0] px-3 py-1 rounded-full">
                <LayoutGrid className="w-4 h-4" />
                {totalCategories} Categories
              </span>
            )}
          </div>
        )}
      </div>

      {!hasResults ? (
        /* No Results */
        <div className="p-12 text-center bg-[#f8f9fa] border-2 border-dashed border-[#e0e0e0] rounded-xl">
          <Search className="w-16 h-16 text-[#c0c0c0] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#666] mb-3">No products or categories found</h3>
          <p className="text-sm text-[#999] mb-6 max-w-sm mx-auto">
            Try adjusting your search terms or browse our categories to find what you're looking for.
          </p>
          <button
            onClick={() => router.push("/product")}
            className="border border-[#F9A922] text-[#F9A922] px-6 py-2 rounded-lg text-sm font-medium hover:bg-[rgba(249,169,34,0.04)] hover:border-[#E8981F] transition-colors"
          >
            Browse All Products
          </button>
        </div>
      ) : (
        <>
          {/* Categories Section */}
          {categories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#333] mb-4">Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    onClick={() => handleCategoryClick(category.slug)}
                    className="cursor-pointer border border-[#e0e0e0] rounded-lg p-4 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 hover:border-[#F9A922] transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#F9A922] flex items-center justify-center flex-shrink-0">
                        <LayoutGrid className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-base font-semibold text-[#333]">{category.name}</h4>
                    </div>
                    <p className="text-sm text-[#666]">{category.description}</p>
                  </div>
                ))}
              </div>
              <hr className="border-[#e0e0e0] mt-8 mb-8" />
            </div>
          )}

          {/* Products Section */}
          {products.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#333] mb-4">Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    handleProductClick={handleProductClick}
                    handleAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
