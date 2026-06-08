"use client";
import type React from "react";
import { useMemo } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/api/handlers/wishlistHandler";
import { useAddToCart } from "@/api/handlers/cartHandler";
import { useAppStore } from "@/store/use-app-store";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "react-toastify";
import type { WishlistProduct } from "@/api/services/wishlist";

function getProductImage(product: WishlistProduct) {
  if (product.bannerImage) {
    return product.bannerImage.startsWith("http") ? product.bannerImage : `${process.env.NEXT_PUBLIC_API_URL}/${product.bannerImage}`;
  }
  if (product.images && product.images.length > 0) {
    const firstImage = product.images[0];
    return firstImage.startsWith("http") ? firstImage : `${process.env.NEXT_PUBLIC_API_URL}/${firstImage}`;
  }
  return "/placeholder.svg?height=278&width=421";
}

const FavouritesSection: React.FC = () => {
  const router = useRouter();
  const { customer, isAuthenticated } = useAppStore();
  console.log(customer, "#######");

  const { data: wishlistData, isLoading, error, isError } = useWishlist({ customerId: customer?.id || "" });
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  const products = useMemo(() => {
    if (!wishlistData?.data?.products) return [];
    return wishlistData.data.products.map((product: WishlistProduct) => ({
      id: product._id, title: product.name, subtitle: product.description || product.category,
      productCode: product.uniqueId, image: getProductImage(product),
      price: product.price, inStock: product.inStock, isFavorite: true,
    }));
  }, [wishlistData]);

  const toggleFavorite = async (productId: string, isFavorite: boolean) => {
    if (!customer?.id) return;
    try {
      if (isFavorite) {
        await removeFromWishlistMutation.mutateAsync({ customerId: customer.id, productId });
        toast.info("Product removed from wishlist");
      } else {
        await addToWishlistMutation.mutateAsync({ customerId: customer.id, productId });
        toast.success("Product added to wishlist");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update wishlist. Please try again.");
    }
  };

  const handleAddToCart = (e: React.MouseEvent, productId: string, productName: string) => {
    e.stopPropagation();
    if (!customer?.id) { router.push("/sign_in"); return; }
    addToCartMutation.mutate({ customerId: customer.id, productId, quantity: 1 }, {
      onSuccess: () => toast.success(`${productName} added to cart successfully!`),
      onError: () => toast.error("Failed to add product to cart. Please try again."),
    });
  };

  const handleProductClick = (productId: string) => router.push(`/product/detail/${productId}`);
  const handleBuyClick = (e: React.MouseEvent, productId: string) => { e.stopPropagation(); router.push(`/product/detail/${productId}`); };

  if (!isAuthenticated || !customer) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-[#333] mb-6">Wishlist</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg text-[#666] mb-6">Please login to view your favourites</p>
          <button onClick={() => router.push("/sign_in")} className="bg-[#F9A922] hover:bg-[#E8981F] text-white px-8 py-3 text-base font-semibold rounded transition-colors">Login</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-[#333] mb-6">Wishlist</h1>
        <div className="flex justify-center items-center py-16">
          <Spinner size="lg" className="border-[#F9A922] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-[#333] mb-6">Wishlist</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mt-4">
          Error loading favourites: {error instanceof Error ? error.message : "Something went wrong"}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <style>{`
          @keyframes float{0%,100%{transform:translateY(0px) rotate(0deg)}50%{transform:translateY(-20px) rotate(2deg)}}
          @keyframes heartBeat{0%,100%{transform:scale(1)}25%{transform:scale(1.1)}50%{transform:scale(1.05)}75%{transform:scale(1.15)}}
          @keyframes fadeInUp{0%{opacity:0;transform:translateY(30px)}100%{opacity:1;transform:translateY(0)}}
        `}</style>
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center min-h-[60vh]">
          <div className="w-40 h-40 mb-8 relative" style={{ animation: "float 3s ease-in-out infinite" }}>
            <div className="w-full h-full rounded-[25px] border-[3px] border-dashed border-[#F9A922] flex items-center justify-center shadow-[0_12px_40px_rgba(255,107,53,0.15)]" style={{ background: "linear-gradient(135deg, #fff5f2 0%, #ffe8e0 100%)" }}>
              <Heart className="w-16 h-16 text-[#F9A922]" style={{ animation: "heartBeat 2s ease-in-out infinite" }} />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#333] mb-4" style={{ animation: "fadeInUp 1s ease-out 0.5s both" }}>No Favourites Yet</h2>
          <p className="text-[#666] mb-8 max-w-[500px] text-sm md:text-lg leading-relaxed" style={{ animation: "fadeInUp 1s ease-out 0.8s both" }}>
            Start adding products to your favourites to see them here. Your wishlist will help you keep track of products you love!
          </p>
          <button
            onClick={() => router.push("/product")}
            className="bg-[#F9A922] hover:bg-[#E8981F] text-white px-12 py-4 text-lg font-semibold rounded-[12px] shadow-[0_6px_20px_rgba(255,107,53,0.3)] hover:shadow-[0_8px_30px_rgba(255,107,53,0.6)] hover:-translate-y-0.5 transition-all"
            style={{ animation: "fadeInUp 1s ease-out 1.1s both" }}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const badgeColors: Record<string, { bg: string; text: string; border: string }> = {
    success: { bg: "#e8f5e8", text: "#2e7d32", border: "#c8e6c9" },
    error: { bg: "#ffeaea", text: "#d32f2f", border: "#ffcdd2" },
    info: { bg: "#e3f2fd", text: "#1976d2", border: "#bbdefb" },
    warning: { bg: "#fff3e0", text: "#f57c00", border: "#ffcc02" },
  };

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-semibold text-[#333] mb-4 md:mb-6">Wishlist ({products.length})</h1>

      <div className="flex flex-col gap-4 md:gap-6">
        {Array.from({ length: Math.ceil(products.length / 3) }, (_, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 sm:gap-4 md:gap-6 justify-center flex-wrap md:flex-nowrap">
            {products.slice(rowIndex * 3, rowIndex * 3 + 3).map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] max-w-[421px] min-w-[280px] flex flex-col rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all cursor-pointer bg-white min-h-[400px]"
              >
                {/* Image */}
                <div className="relative w-full overflow-hidden rounded-t-xl" style={{ height: "60vw", maxHeight: "278px", minHeight: "200px" }}>
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/60 text-lg font-semibold pointer-events-none drop-shadow">EZRM</span>
                  {!product.inStock && (
                    <span className="absolute top-2 right-2 bg-red-600/80 text-white text-[0.7rem] font-semibold px-2 py-0.5 rounded">Out of Stock</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col p-3 md:p-4">
                  <h3 className="font-semibold text-[#333] text-sm md:text-base mb-1 truncate">{product.title}</h3>
                  <p className="text-[#666] text-xs md:text-sm mb-2 line-clamp-2">{product.subtitle}</p>
                  <p className="text-[#F9A922] text-sm md:text-base font-semibold mb-1">
                    ${product.price.toLocaleString()} <small className="text-[#999]">/kg</small>
                  </p>
                  <p className="text-[#666] text-xs mb-4">Product Code: {product.productCode}</p>

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-auto gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id, product.isFavorite); }}
                      disabled={removeFromWishlistMutation.isPending}
                      className={`p-1.5 rounded-full transition-colors hover:bg-red-50 disabled:opacity-60 ${product.isFavorite ? "text-red-400" : "text-[#ccc]"}`}
                    >
                      {removeFromWishlistMutation.isPending ? <Spinner size="sm" /> : <Heart className="w-5 h-5" fill={product.isFavorite ? "currentColor" : "none"} />}
                    </button>
                    <div className="flex gap-1">
                      <button
                        disabled={!product.inStock || addToCartMutation.isPending}
                        onClick={(e) => handleAddToCart(e, product.id, product.title)}
                        className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded text-white transition-colors ${product.inStock ? "bg-[#4caf50] hover:bg-[#45a049]" : "bg-[#ccc] cursor-not-allowed"}`}
                      >
                        {addToCartMutation.isPending ? <Spinner size="sm" /> : <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                      </button>
                      <button
                        disabled={!product.inStock}
                        onClick={(e) => handleBuyClick(e, product.id)}
                        className={`text-[0.65rem] md:text-[0.7rem] font-semibold uppercase px-3 md:px-4 py-1 md:py-1.5 rounded text-white transition-colors ${product.inStock ? "bg-[#F9A922] hover:bg-[#E8981F]" : "bg-[#ccc] cursor-not-allowed"}`}
                      >
                        {product.inStock ? "BUY" : "SOLD OUT"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavouritesSection;
