"use client";

import React from "react";
import { ShoppingCart, Eye, CheckCircle2, AlertCircle } from "lucide-react";
import { useProductVariants } from "@/api/handlers/productVariantsHandler";
import { Badge } from "@/components/ui/badge";

interface Product {
  _id: string;
  name: string;
  description?: string;
  appearance?: string;
  uniqueId?: string;
  price: number;
  inStock?: boolean;
  bannerImage?: string;
  images?: string[];
}

interface ProductCardProps {
  product: Product;
  handleProductClick: (id: string) => void;
  handleAddToCart: (product: Product, minUnitSize?: number) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
};

const ProductCard: React.FC<ProductCardProps> = ({ product, handleProductClick, handleAddToCart }) => {
  const { data: variantsResponse, isLoading } = useProductVariants(product._id);
  const hasVariants = Array.isArray(variantsResponse?.data) && variantsResponse.data.length > 0;
  const variants = variantsResponse?.data ?? [];
  const minUnitSize = variants.length > 0 ? Math.min(...variants.map((v: any) => v.unitSize)) : 1;

  return (
    <div
      className="h-full flex flex-col cursor-pointer transition-all border border-line-light hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 rounded-xl relative overflow-hidden bg-white"
      onClick={() => handleProductClick(product._id)}
    >
      {/* Stock badge */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white ${
            product.inStock ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {product.inStock ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Product Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.bannerImage || product.images?.[0] || "/placeholder-product.png"}
        alt={product.name}
        className="h-[200px] w-full object-cover bg-gray-100"
        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-product.png"; }}
      />

      <div className="flex-1 flex flex-col p-6">
        {/* Unique ID */}
        {product.uniqueId && (
          <span className="text-faint text-xs font-medium tracking-[0.5px] mb-1">{product.uniqueId}</span>
        )}

        {/* Name */}
        <h3
          className="font-semibold text-body mb-2 text-base leading-tight"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p
            className="text-sm text-dim mb-4 leading-relaxed"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </p>
        )}

        {/* Appearance */}
        {product.appearance && (
          <span className="text-xs text-faint italic mb-4 block">{product.appearance}</span>
        )}

        {/* Price */}
        <p className="text-lg font-bold text-brand mb-4">{formatPrice(product.price)}</p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-brand text-white font-semibold text-sm py-2 px-4 rounded-[30px] hover:bg-brand-hover transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleProductClick(product._id);
            }}
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          <button
            className="border border-line-light text-dim p-2 rounded-lg hover:bg-gray-50 hover:border-brand hover:text-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasVariants || isLoading}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product, minUnitSize);
            }}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
