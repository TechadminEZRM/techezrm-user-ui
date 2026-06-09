"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import QuoteFormModal from "./quote-form-modal";
import type { Product } from "@/api/services";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onClick: (productId: string, productName: string) => void;
  onButtonClick: (productId: string, productName: string) => void;
  isAuthenticated: boolean;
}

const getProductImage = (product: Product) => {
  if (product.bannerImage) {
    return product.bannerImage.startsWith("http") ? product.bannerImage : `${process.env.NEXT_PUBLIC_API_URL}/${product.bannerImage}`;
  }
  if (product.images && product.images.length > 0) {
    const img = product.images[0];
    return img.startsWith("http") ? img : `${process.env.NEXT_PUBLIC_API_URL}/${img}`;
  }
  return "/product.png";
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onButtonClick, isAuthenticated }) => {
  const { isAuthenticated: authState } = useAppStore();
  return (
    <div
      onClick={() => onClick(product._id, product.name)}
      className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] w-[200px] h-[300px] flex-shrink-0 flex flex-col overflow-hidden cursor-pointer transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="bg-line rounded-t-xl h-[150px] relative overflow-hidden flex-shrink-0">
        <Image
          src={getProductImage(product)}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-1 mb-1">
          <h3 className="font-semibold text-body text-[0.95rem] overflow-hidden whitespace-nowrap text-ellipsis flex-1" title={product.name}>
            {product.name}
          </h3>
          {authState && (
            <span className="text-brand text-[0.75rem] font-bold bg-[rgba(255,120,73,0.1)] px-1.5 py-0.5 rounded border border-[rgba(255,120,73,0.2)] flex-shrink-0">
              ${product.price}/kg
            </span>
          )}
        </div>
        <p
          className="text-dim text-[0.75rem] leading-snug flex-1 overflow-hidden"
          style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
        >
          {product.description}
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={(e) => { e.stopPropagation(); onButtonClick(product._id, product.name); }}
        className="w-full bg-brand text-white font-medium text-[0.9rem] h-[30px] rounded-b-xl hover:bg-[#e66a3c] transition-colors flex-shrink-0"
      >
        {isAuthenticated ? "Buy" : "Get Quote"}
      </button>
    </div>
  );
};

const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl w-[200px] h-[300px] flex-shrink-0 flex flex-col overflow-hidden">
    <div className="h-[120px] bg-gray-200 animate-pulse rounded-t-xl" />
    <div className="p-3 flex-1 flex flex-col gap-2">
      <div className="h-5 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
    </div>
    <div className="h-10 bg-gray-200 animate-pulse rounded-b-xl" />
  </div>
);

const ProductsSection: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/public/products/listing?page=1&limit=8&sortBy=createdAt&sortOrder=desc`
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        if (data.success && data.products) { setProducts(data.products); setError(null); }
        else { setProducts([]); setError("No products found"); }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCardClick = (productId: string) => router.push(`/product/detail/${productId}`);
  const handleButtonClick = (productId: string, productName: string) => {
    if (isAuthenticated) router.push(`/product/detail/${productId}`);
    else { setSelectedProduct(productName); setIsQuoteModalOpen(true); }
  };

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < Math.max(0, products.length - 4);
  const visibleProducts = products.slice(currentIndex, currentIndex + 4);

  const LeftPanel = () => (
    <div className="min-w-[200px] flex-shrink-0">
      <div className="flex items-center mb-4">
        <div className="w-1 h-8 bg-brand mr-4 rounded-sm" />
        <h2 className="font-semibold text-body text-[1.3rem] md:text-[1.8rem] leading-snug">
          Products you may<br />like
        </h2>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
          disabled={!canPrev}
          className="w-8 h-8 rounded flex items-center justify-center hover:bg-paper disabled:opacity-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-dim" /><ChevronLeft className="w-4 h-4 text-dim -ml-2" />
        </button>
        <button
          onClick={() => setCurrentIndex((p) => Math.min(Math.max(0, products.length - 4), p + 1))}
          disabled={!canNext}
          className="w-8 h-8 rounded flex items-center justify-center hover:bg-paper disabled:opacity-50 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-dim" /><ChevronRight className="w-4 h-4 text-dim -ml-2" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {loading && (
            <div className="flex items-center gap-4">
              <LeftPanel />
              <div className="flex gap-4 flex-1 overflow-hidden">
                {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-200">
              <p className="font-semibold">Unable to load products</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-8">
              <p className="text-dim text-lg mb-1">No products available</p>
              <p className="text-faint text-sm">Check back later for our latest products.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="flex items-center gap-4">
              <LeftPanel />
              <div className="flex gap-4 flex-1 overflow-hidden">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={handleCardClick}
                    onButtonClick={handleButtonClick}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <QuoteFormModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        productName={selectedProduct}
      />
    </>
  );
};

export default ProductsSection;
