"use client";

import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { useProductVariants } from "@/api/handlers/productVariantsHandler";

interface ProductVariantsProps {
  productId: string;
}

export default function ProductVariants({ productId }: ProductVariantsProps) {
  const { data: variantsResponse, isLoading, error, isError } = useProductVariants(productId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size="sm" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm mb-4">
        Error loading product variants: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );
  }

  if (!variantsResponse?.data || variantsResponse.data.length === 0) {
    return (
      <div className="bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-200 text-sm mb-4">
        No variants available for this product.
      </div>
    );
  }

  const variants = variantsResponse.data;
  const basePrice = variants[0]?.price || 0;

  const getSavingsPercentage = (price: number) => {
    if (basePrice === 0 || price >= basePrice) return "0%";
    return `${Math.round(((basePrice - price) / basePrice) * 100)}%`;
  };

  return (
    <div className="mt-0 mb-6">
      <div
        className="border border-[#e0e0e0] rounded-lg overflow-hidden"
        style={variants.length > 2 ? { maxHeight: 133, overflowY: "auto" } : {}}
      >
        <table className="w-full text-xs">
          <thead className="bg-[#f8f9fa]">
            <tr>
              <th className="text-left px-3 py-2.5 font-semibold text-[#1F2A44] border-b border-[#e0e0e0]">Quantity</th>
              <th className="text-left px-3 py-2.5 font-semibold text-[#1F2A44] border-b border-[#e0e0e0]">Price</th>
              <th className="text-left px-3 py-2.5 font-semibold text-[#1F2A44] border-b border-[#e0e0e0]">Save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {variants.map((variant: any) => (
              <tr key={variant._id}>
                <td className="px-3 py-2.5">{variant.unitSize} {variant.unit}</td>
                <td className="px-3 py-2.5">${variant.price.toLocaleString()}</td>
                <td className="px-3 py-2.5">{getSavingsPercentage(variant.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
