"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import QuoteFormModal from "./quote-form-modal";
import type { Product } from "@/api/services";
import Image from "next/image";

interface ProductGridCardProps {
  product: Product;
  onClick: (productId: string, productName: string) => void;
  onButtonClick: (productId: string, productName: string) => void;
  isAuthenticated: boolean;
}

const getProductImage = (product: Product) => {
  if (product.bannerImage) {
    return product.bannerImage.startsWith("http")
      ? product.bannerImage
      : `${process.env.NEXT_PUBLIC_API_URL}/${product.bannerImage}`;
  }
  if (product.images && product.images.length > 0) {
    const img = product.images[0];
    return img.startsWith("http") ? img : `${process.env.NEXT_PUBLIC_API_URL}/${img}`;
  }
  return "/productGrid.png";
};

const ProductGridCard: React.FC<ProductGridCardProps> = ({ product, onClick, onButtonClick, isAuthenticated }) => {
  const { isAuthenticated: authState } = useAppStore();
  return (
    <div
      onClick={() => onClick(product._id, product.name)}
      className="bg-white rounded-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] w-[280px] h-[320px] flex flex-col overflow-hidden cursor-pointer transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="bg-[#f8f8f8] h-[200px] relative overflow-hidden flex-shrink-0">
        <Image
          src={getProductImage(product)}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          onError={(e) => { (e.target as HTMLImageElement).src = "/productGrid.png"; }}
        />
      </div>

      {/* CTA Button */}
      <button
        onClick={(e) => { e.stopPropagation(); onButtonClick(product._id, product.name); }}
        className="w-full bg-[#F9A922] text-white font-medium py-2 text-base hover:bg-[#E8981F] transition-colors rounded-none flex-shrink-0"
      >
        {isAuthenticated ? "Buy" : "Get Quote"}
      </button>

      {/* Content */}
      <div className="p-4 pb-0 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-1">
          <p
            className="font-semibold text-[#2c3e50] text-[0.8rem] leading-snug overflow-hidden flex-1"
            style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
            title={product.name}
          >
            {product.name}
          </p>
          {authState && (
            <span className="text-[#F9A922] text-[0.7rem] font-bold bg-[rgba(255,107,53,0.1)] px-1.5 py-0.5 rounded border border-[rgba(255,107,53,0.2)] flex-shrink-0">
              ${product.price}/kg
            </span>
          )}
        </div>
        <p
          className="text-[#7f8c8d] text-[0.65rem] leading-snug flex-1 overflow-hidden"
          style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
        >
          {product.description}--
        </p>
      </div>
    </div>
  );
};

const ProductGridCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] w-[280px] h-[320px] flex flex-col overflow-hidden">
    <div className="h-[200px] bg-gray-200 animate-pulse flex-shrink-0" />
    <div className="h-10 bg-gray-200 animate-pulse flex-shrink-0" />
    <div className="p-4 flex-1 flex flex-col gap-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-3 bg-gray-200 rounded animate-pulse" />
      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
    </div>
  </div>
);

const ProductsGridSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { isAuthenticated } = useAppStore();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/public/products/listing?page=1&limit=20&sortBy=createdAt&sortOrder=desc`
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        if (data.success && data.products) { setAllProducts(data.products); setError(null); }
        else { setAllProducts([]); setError("No products found"); }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
        setAllProducts([]);
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

  const visibleProducts = allProducts.slice(currentIndex, currentIndex + 4);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < Math.max(0, allProducts.length - 4);

  const SectionHeader = () => (
    <div className="mb-8">
      <div className="flex items-center mb-3">
        <div className="w-1 h-8 bg-[#F9A922] mr-4 rounded-sm" />
        <h2 className="text-[1.8rem] md:text-[2.2rem] font-semibold text-[#333]">Products</h2>
      </div>
      {!loading && (
        <div className="flex gap-2 ml-6">
          <button
            onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            disabled={!canPrev}
            className="w-6 h-6 flex items-center justify-center text-[#666] hover:bg-[#f5f5f5] rounded disabled:opacity-50 transition-colors p-0"
          >
            <ChevronLeft className="w-4 h-4" /><ChevronLeft className="w-4 h-4 -ml-2" />
          </button>
          <button
            onClick={() => setCurrentIndex((p) => Math.min(Math.max(0, allProducts.length - 4), p + 1))}
            disabled={!canNext}
            className="w-6 h-6 flex items-center justify-center text-[#666] hover:bg-[#f5f5f5] rounded disabled:opacity-50 transition-colors p-0"
          >
            <ChevronRight className="w-4 h-4" /><ChevronRight className="w-4 h-4 -ml-2" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="bg-[#f1f5f9] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader />

          {loading && (
            <div className="grid grid-cols-4 gap-6 w-full overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => <ProductGridCardSkeleton key={i} />)}
            </div>
          )}

          {!loading && error && (
            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-200">
              <p className="font-semibold">Unable to load products</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && allProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[#666] text-lg mb-1">No products available</p>
              <p className="text-[#999] text-sm">Check back later for our latest products.</p>
            </div>
          )}

          {!loading && !error && allProducts.length > 0 && (
            <div className="grid grid-cols-4 gap-6 w-full overflow-hidden">
              {visibleProducts.map((product) => (
                <div key={product._id} className="flex justify-center min-w-0">
                  <ProductGridCard
                    product={product}
                    onClick={handleCardClick}
                    onButtonClick={handleButtonClick}
                    isAuthenticated={isAuthenticated}
                  />
                </div>
              ))}
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

export default ProductsGridSection;
