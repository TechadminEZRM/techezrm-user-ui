"use client";

import React from "react";
import { useFeaturedCategories } from "@/api/handlers";
import { useRouter } from "next/navigation";
import type { Category } from "@/api/services";

interface CategoryCardProps {
  category: Category;
  isHighlighted?: boolean;
}

const getImageUrl = (imageUrl: string | undefined | null) => {
  if (!imageUrl || typeof imageUrl !== "string") return "./vitIcon.png";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${process.env.NEXT_PUBLIC_API_URL}/${imageUrl}`;
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isHighlighted = false }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/product?category=${category.slug}`)}
      className={`flex items-center gap-3 px-5 py-0 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] cursor-pointer transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 ${
        isHighlighted ? "bg-[#F9A922] hover:bg-[#E8981F] text-white" : "bg-white hover:bg-[#f8f9fa] text-[#333]"
      }`}
      style={{ width: "13.6rem", minWidth: "12.6rem", height: "4.5rem" }}
    >
      <img
        src={getImageUrl(category.image)}
        alt={`${category.name} Icon`}
        onError={(e) => { (e.target as HTMLImageElement).src = "./vitIcon.png"; }}
        className="w-7 h-7 min-w-[28px] object-contain"
        style={{ filter: isHighlighted ? "brightness(0) invert(1)" : "none" }}
      />
      <span className="font-medium text-base leading-tight flex-1 overflow-hidden whitespace-nowrap text-ellipsis" title={category.name}>
        {category.name}
      </span>
    </div>
  );
};

const CategoryCardSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]" style={{ width: "13rem" }}>
    <div className="w-7 h-7 bg-gray-200 rounded animate-pulse flex-shrink-0" />
    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
  </div>
);

const FeaturedCategory: React.FC = () => {
  const { data: response, isLoading, error, isError } = useFeaturedCategories();

  const organizeIntoRows = (categories: Category[]) => {
    const rows: Category[][] = [];
    const total = categories.length;
    if (total === 0) return rows;
    if (total <= 4) { rows.push(categories); return rows; }
    const perRow = Math.ceil(total / 3);
    for (let i = 0; i < total; i += perRow) rows.push(categories.slice(i, i + perRow));
    return rows;
  };

  const categories = response?.categories || [];
  const categoryRows = organizeIntoRows(categories);

  return (
    <div className="bg-[#f8f9fa] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="flex items-center mb-8">
          <div className="w-1 h-8 bg-[#F9A922] mr-4 rounded-sm" />
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333] py-2">Featured Category</h2>
          {!isLoading && categories.length > 0 && (
            <span className="ml-3 text-sm text-[#666]">({categories.length} categories)</span>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col gap-6 items-center">
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex flex-wrap gap-4 justify-center">
                {Array.from({ length: row === 2 ? 3 : 4 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-4">
            <p className="font-semibold">Error loading categories</p>
            <p className="text-sm">{error instanceof Error ? error.message : "Something went wrong"}</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && categories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[#666] text-lg mb-1">No featured categories found</p>
            <p className="text-[#999] text-sm">Featured categories will appear here once they are available.</p>
          </div>
        )}

        {/* Categories */}
        {!isLoading && !isError && categories.length > 0 && (
          <div className="flex flex-col gap-6 items-center">
            {categoryRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-wrap gap-4 justify-center">
                {row.map((category, cardIndex) => (
                  <CategoryCard
                    key={category._id}
                    category={category}
                    isHighlighted={cardIndex === 1 && rowIndex === 0}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedCategory;
