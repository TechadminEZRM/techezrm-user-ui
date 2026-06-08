"use client";
import React, { useState } from "react";
import { ChevronDown, Heart } from "lucide-react";
import { useProductListing } from "@/api/handlers";
import { useAppStore } from "@/store/use-app-store";
import { useRouter, useSearchParams } from "next/navigation";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist, useFilters } from "@/api/handlers";
import type { Product } from "@/api/services";
import Image from "next/image";
import ShimmerLoader from "@/components/ShimmerLoader";
import FilterShimmerLoader from "@/components/FilterShimmerLoader";
import ContactFormModal from "@/components/ContactFormModal";
import RFQModal from "@/components/RFQModal";
import { toast } from "react-toastify";
import { Spinner } from "@/components/ui/spinner";

const ProductPage: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customer, isAuthenticated } = useAppStore();

  const categoryFilter = searchParams.get("category");
  const countryFilter = searchParams.get("country");
  const subCategoryFilter = searchParams.get("subCategory");
  const applicationFilter = searchParams.get("application");
  const tagFilter = searchParams.get("tag");
  const functionFilter = searchParams.get("function");

  const [contactModalOpen, setContactModalOpen] = React.useState(false);
  const [rfqModalOpen, setRfqModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<{ id: string; name: string } | null>(null);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(categoryFilter ? [categoryFilter] : []);
  const [selectedSubCategories, setSelectedSubCategories] = React.useState<string[]>(subCategoryFilter ? subCategoryFilter.split(",").filter(Boolean) : []);
  const [selectedApplications, setSelectedApplications] = React.useState<string[]>(applicationFilter ? applicationFilter.split(",").filter(Boolean) : []);
  const [selectedTags, setSelectedTags] = React.useState<string[]>(tagFilter ? tagFilter.split(",").filter(Boolean) : []);
  const [selectedFunctions, setSelectedFunctions] = React.useState<string[]>(functionFilter ? functionFilter.split(",").filter(Boolean) : []);
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>(countryFilter ? [countryFilter] : []);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);

  const handleAccordionChange = (panel: string) => setExpandedAccordion(expandedAccordion === panel ? null : panel);

  const updateURL = React.useCallback((categories: string[], countries: string[], subCategories: string[], applications: string[], tags: string[], functions: string[]) => {
    const params = new URLSearchParams();
    if (categories.length > 0) params.set("category", categories.join(","));
    if (countries.length > 0) params.set("country", countries.join(","));
    if (subCategories.length > 0) params.set("subCategory", subCategories.join(","));
    if (applications.length > 0) params.set("application", applications.join(","));
    if (tags.length > 0) params.set("tag", tags.join(","));
    if (functions.length > 0) params.set("function", functions.join(","));
    router.replace(params.toString() ? `/product?${params.toString()}` : "/product", { scroll: false });
  }, [router]);

  React.useEffect(() => {
    const newCategories = categoryFilter ? categoryFilter.split(",").filter(Boolean) : [];
    const newCountries = countryFilter ? countryFilter.split(",").filter(Boolean) : [];
    const newSubCategories = subCategoryFilter ? subCategoryFilter.split(",").filter(Boolean) : [];
    const newApplications = applicationFilter ? applicationFilter.split(",").filter(Boolean) : [];
    const newTags = tagFilter ? tagFilter.split(",").filter(Boolean) : [];
    const newFunctions = functionFilter ? functionFilter.split(",").filter(Boolean) : [];
    setSelectedCategories((p) => JSON.stringify(p) !== JSON.stringify(newCategories) ? newCategories : p);
    setSelectedCountries((p) => JSON.stringify(p) !== JSON.stringify(newCountries) ? newCountries : p);
    setSelectedSubCategories((p) => JSON.stringify(p) !== JSON.stringify(newSubCategories) ? newSubCategories : p);
    setSelectedApplications((p) => JSON.stringify(p) !== JSON.stringify(newApplications) ? newApplications : p);
    setSelectedTags((p) => JSON.stringify(p) !== JSON.stringify(newTags) ? newTags : p);
    setSelectedFunctions((p) => JSON.stringify(p) !== JSON.stringify(newFunctions) ? newFunctions : p);
  }, [categoryFilter, countryFilter, subCategoryFilter, applicationFilter, tagFilter, functionFilter]);

  const { data: wishlistData } = useWishlist({ customerId: customer?.id || "" }, { enabled: isAuthenticated && !!customer?.id });
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const { data: filtersData, isLoading: filtersLoading } = useFilters();

  const productListingParams = {
    page, limit: 9, sortBy: "createdAt" as const, sortOrder: "desc" as const,
    category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
    subCategory: selectedSubCategories.length > 0 ? selectedSubCategories : undefined,
    application: selectedApplications.length > 0 ? selectedApplications : undefined,
    tag: selectedTags.length > 0 ? selectedTags : undefined,
    function: selectedFunctions.length > 0 ? selectedFunctions : undefined,
    countryOfOrigin: selectedCountries.length > 0 ? selectedCountries[0] : undefined,
  };

  const { data: response, isLoading, error, isError } = useProductListing(productListingParams);

  const isInWishlist = (productId: string): boolean => {
    if (!wishlistData?.data?.products) return false;
    return wishlistData.data.products.some((p) => p._id === productId);
  };

  const handleWishlistToggle = async (productId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isAuthenticated || !customer?.id) { router.push("/sign_in"); return; }
    const isCurrentlyInWishlist = isInWishlist(productId);
    try {
      if (isCurrentlyInWishlist) {
        await removeFromWishlistMutation.mutateAsync({ customerId: customer.id, productId });
        toast.info("Product removed from wishlist successfully!");
      } else {
        await addToWishlistMutation.mutateAsync({ customerId: customer.id, productId });
        toast.success("Product added to wishlist successfully!");
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      toast.error("Failed to update wishlist. Please try again.");
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]); setSelectedSubCategories([]); setSelectedApplications([]); setSelectedTags([]); setSelectedFunctions([]); setSelectedCountries([]); setPage(1);
    updateURL([], [], [], [], [], []);
  };

  const makeFilterHandler = (slug: string, list: string[], setList: (v: string[]) => void, urlKey: number) => (checked: boolean) => {
    const next = checked ? [...list, slug] : list.filter((s) => s !== slug);
    setList(next); setPage(1);
    const args = [selectedCategories, selectedCountries, selectedSubCategories, selectedApplications, selectedTags, selectedFunctions] as string[][];
    args[urlKey] = next;
    updateURL(args[0], args[1], args[2], args[3], args[4], args[5]);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubCategories.length > 0 || selectedApplications.length > 0 || selectedTags.length > 0 || selectedFunctions.length > 0 || selectedCountries.length > 0;

  const products = response?.products || [];
  const pagination = response?.pagination;

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          Error loading products: {error instanceof Error ? error.message : "Something went wrong"}
        </div>
      </div>
    );
  }

  // Accordion filter section helper
  const FilterSection = ({ panelKey, label, items, selectedItems, onToggle }: { panelKey: string; label: string; items: any[]; selectedItems: string[]; onToggle: (slug: string, checked: boolean) => void }) => {
    if (!items || items.length === 0) return null;
    const open = expandedAccordion === panelKey;
    return (
      <div className="bg-[rgba(217,217,217,0.21)] mb-[5px]">
        <button
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[#333] hover:bg-[rgba(0,0,0,0.02)] transition-colors"
          onClick={() => handleAccordionChange(panelKey)}
        >
          {label}
          <ChevronDown className={`w-4 h-4 text-[#666] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="px-4 pb-3 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-[rgba(0,0,0,0.2)] scrollbar-track-transparent">
            <div className="flex flex-col gap-2">
              {items.map((item: any) => {
                const slug = item.slug || item.countryCode;
                const name = item.name || item.countryCode;
                const count = item.productCount;
                const isChecked = selectedItems.includes(slug);
                return (
                  <div
                    key={slug}
                    className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded hover:bg-[rgba(255,107,53,0.08)] hover:translate-x-0.5 transition-all"
                    onClick={() => onToggle(slug, !isChecked)}
                  >
                    <input type="checkbox" checked={isChecked} onChange={() => {}} className="cursor-pointer accent-[#F9A922]" />
                    <span className="text-xs text-[#666]">
                      {item.emoji ? `${item.emoji} ` : ""}{name}{count > 0 ? ` (${count})` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      {/* Left Sidebar */}
      <div className="w-[280px] flex flex-col mt-4 ml-4 flex-shrink-0">
        {/* Filter Header */}
        <div className="bg-[#F9A922] text-white px-4 py-3 flex items-center justify-between rounded-[20px_20px_0_0]">
          <span className="font-semibold text-base">Filters</span>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">×</div>
        </div>

        {/* Filter Sections */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.2)_transparent] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-[rgba(0,0,0,0.2)] [&::-webkit-scrollbar-thumb]:rounded-[3px]">
          {filtersLoading ? (
            <FilterShimmerLoader />
          ) : (
            <>
              <FilterSection panelKey="category" label="Category" items={filtersData?.data?.category || []} selectedItems={selectedCategories}
                onToggle={(slug, checked) => { const next = checked ? [...selectedCategories, slug] : selectedCategories.filter((s) => s !== slug); setSelectedCategories(next); setPage(1); updateURL(next, selectedCountries, selectedSubCategories, selectedApplications, selectedTags, selectedFunctions); }} />
              <FilterSection panelKey="subCategory" label="Sub Category" items={filtersData?.data?.subCategory || []} selectedItems={selectedSubCategories}
                onToggle={(slug, checked) => { const next = checked ? [...selectedSubCategories, slug] : selectedSubCategories.filter((s) => s !== slug); setSelectedSubCategories(next); setPage(1); updateURL(selectedCategories, selectedCountries, next, selectedApplications, selectedTags, selectedFunctions); }} />
              <FilterSection panelKey="application" label="Application" items={filtersData?.data?.application || []} selectedItems={selectedApplications}
                onToggle={(slug, checked) => { const next = checked ? [...selectedApplications, slug] : selectedApplications.filter((s) => s !== slug); setSelectedApplications(next); setPage(1); updateURL(selectedCategories, selectedCountries, selectedSubCategories, next, selectedTags, selectedFunctions); }} />
              <FilterSection panelKey="function" label="Function" items={filtersData?.data?.function || []} selectedItems={selectedFunctions}
                onToggle={(slug, checked) => { const next = checked ? [...selectedFunctions, slug] : selectedFunctions.filter((s) => s !== slug); setSelectedFunctions(next); setPage(1); updateURL(selectedCategories, selectedCountries, selectedSubCategories, selectedApplications, selectedTags, next); }} />
              <FilterSection panelKey="tag" label="Tags" items={filtersData?.data?.tag || []} selectedItems={selectedTags}
                onToggle={(slug, checked) => { const next = checked ? [...selectedTags, slug] : selectedTags.filter((s) => s !== slug); setSelectedTags(next); setPage(1); updateURL(selectedCategories, selectedCountries, selectedSubCategories, selectedApplications, next, selectedFunctions); }} />
              <FilterSection panelKey="countryOfOrigin" label="Country of Origin" items={filtersData?.data?.countryOfOrigin || []} selectedItems={selectedCountries}
                onToggle={(slug, checked) => { const next = checked ? [...selectedCountries, slug] : selectedCountries.filter((s) => s !== slug); setSelectedCountries(next); setPage(1); updateURL(selectedCategories, next, selectedSubCategories, selectedApplications, selectedTags, selectedFunctions); }} />

              {hasActiveFilters && (
                <div className="p-4">
                  <button onClick={clearAllFilters} className="w-full border border-[#F9A922] text-[#F9A922] text-xs font-semibold py-2 rounded hover:border-[#E8981F] hover:bg-[rgba(255,107,53,0.04)] transition-colors">
                    Clear All Filters
                  </button>
                </div>
              )}

              {(!filtersData?.data?.category || filtersData.data.category.length === 0) && (!filtersData?.data?.countryOfOrigin || filtersData.data.countryOfOrigin.length === 0) && (
                <div className="p-4"><p className="text-xs text-[#666] text-center">No filters available</p></div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-[#333]">Our Products</h1>
            <div className="flex items-center gap-4">
              <span className="text-base text-[#666] font-medium whitespace-nowrap">Total: {response?.pagination?.total || 0}</span>
              <button onClick={() => setContactModalOpen(true)} className="border border-[#F9A922] text-[#F9A922] font-semibold px-4 py-2 rounded hover:border-[#E8981F] hover:bg-[rgba(255,107,53,0.04)] transition-colors text-sm">
                Contact Us
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (() => {
            const allFilters = [
              ...selectedCategories.map((slug) => ({ type: "Category", slug, name: filtersData?.data?.category?.find((c) => c.slug === slug)?.name || slug, onDelete: () => { const n = selectedCategories.filter((s) => s !== slug); setSelectedCategories(n); setPage(1); updateURL(n, selectedCountries, selectedSubCategories, selectedApplications, selectedTags, selectedFunctions); } })),
              ...selectedCountries.map((slug) => ({ type: "Country", slug, name: filtersData?.data?.countryOfOrigin?.find((c) => c.countryCode === slug)?.name || slug, onDelete: () => { const n = selectedCountries.filter((s) => s !== slug); setSelectedCountries(n); setPage(1); updateURL(selectedCategories, n, selectedSubCategories, selectedApplications, selectedTags, selectedFunctions); } })),
              ...selectedSubCategories.map((slug) => ({ type: "Sub Category", slug, name: filtersData?.data?.subCategory?.find((c) => c.slug === slug)?.name || slug, onDelete: () => { const n = selectedSubCategories.filter((s) => s !== slug); setSelectedSubCategories(n); setPage(1); updateURL(selectedCategories, selectedCountries, n, selectedApplications, selectedTags, selectedFunctions); } })),
              ...selectedApplications.map((slug) => ({ type: "Application", slug, name: filtersData?.data?.application?.find((c) => c.slug === slug)?.name || slug, onDelete: () => { const n = selectedApplications.filter((s) => s !== slug); setSelectedApplications(n); setPage(1); updateURL(selectedCategories, selectedCountries, selectedSubCategories, n, selectedTags, selectedFunctions); } })),
              ...selectedTags.map((slug) => ({ type: "Tag", slug, name: filtersData?.data?.tag?.find((c) => c.slug === slug)?.name || slug, onDelete: () => { const n = selectedTags.filter((s) => s !== slug); setSelectedTags(n); setPage(1); updateURL(selectedCategories, selectedCountries, selectedSubCategories, selectedApplications, n, selectedFunctions); } })),
              ...selectedFunctions.map((slug) => ({ type: "Function", slug, name: filtersData?.data?.function?.find((c) => c.slug === slug)?.name || slug, onDelete: () => { const n = selectedFunctions.filter((s) => s !== slug); setSelectedFunctions(n); setPage(1); updateURL(selectedCategories, selectedCountries, selectedSubCategories, selectedApplications, selectedTags, n); } })),
            ];
            const maxVisible = 6;
            const visible = allFilters.slice(0, maxVisible);
            const remaining = allFilters.length - maxVisible;
            return (
              <div className="flex flex-wrap gap-2 items-center max-h-[90px] overflow-y-auto">
                {visible.map((f, i) => (
                  <span key={`${f.type}-${f.slug}-${i}`} className="inline-flex items-center gap-1 bg-[#F9A922] text-white text-xs font-medium h-7 px-3 rounded-full">
                    {f.type}: {f.name}
                    <button onClick={f.onDelete} className="ml-1 hover:text-white/70">×</button>
                  </span>
                ))}
                {remaining > 0 && <span className="inline-flex items-center bg-[#f5f5f5] text-[#666] text-xs font-medium h-7 px-3 rounded-full">+{remaining} more</span>}
              </div>
            );
          })()}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <ShimmerLoader count={9} />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <style>{`@keyframes float{0%,100%{transform:translateY(0px) rotate(0deg)}50%{transform:translateY(-15px) rotate(2deg)}}@keyframes fadeInUp{0%{opacity:0;transform:translateY(30px)}100%{opacity:1;transform:translateY(0)}}`}</style>
            <div className="w-[140px] h-[140px] mb-8" style={{ animation: "float 3s ease-in-out infinite" }}>
              <div className="w-full h-full bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] border-[3px] border-dashed border-[#dee2e6] rounded-[20px] flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                <div className="w-10 h-10 border-[3px] border-[#F9A922] rounded-full" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-[#333] mb-4" style={{ animation: "fadeInUp 1s ease-out 0.5s both" }}>No Products Found</h2>
            <p className="text-[#666] mb-8 max-w-[500px] text-sm" style={{ animation: "fadeInUp 1s ease-out 0.8s both" }}>
              We couldn't find any products matching your current filters. Try adjusting your search criteria or clear all filters to see all available products.
            </p>
            <button onClick={clearAllFilters} className="bg-[#F9A922] hover:bg-[#E8981F] text-white px-8 py-3 text-base font-medium rounded-[8px] shadow-[0_4px_12px_rgba(255,107,53,0.3)] hover:shadow-[0_8px_24px_rgba(255,107,53,0.6)] hover:-translate-y-0.5 transition-all" style={{ animation: "fadeInUp 1s ease-out 1.1s both" }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {products.map((product) => {
              const productInWishlist = isInWishlist(product._id);
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-[8px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] relative cursor-pointer hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all"
                  onClick={() => router.push(`/product/detail/${product._id}`)}
                >
                  {/* Product Image */}
                  <div className="relative h-[180px] overflow-hidden group">
                    {/* Default Image */}
                    <div className="default-image absolute inset-0 transition-transform duration-[600ms] cubic-bezier-[0.4,0,0.2,1] group-hover:-translate-x-full">
                      <Image
                        src={product.bannerImage ? (product.bannerImage.startsWith("http") ? product.bannerImage : `${process.env.NEXT_PUBLIC_API_URL}/${product.bannerImage}`) : "/placeholder.svg"}
                        alt={product.name} fill style={{ objectFit: "cover" }}
                      />
                    </div>
                    {/* Hover Image */}
                    {product.images && product.images.length > 0 && (
                      <div className="hover-image absolute inset-0 transition-transform duration-[600ms] translate-x-full group-hover:translate-x-0">
                        <Image
                          src={product.images[0].startsWith("http") ? product.images[0] : `${process.env.NEXT_PUBLIC_API_URL}/${product.images[0]}`}
                          alt={product.name} fill style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    {/* Watermark */}
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/70 text-base font-semibold pointer-events-none drop-shadow-sm">EZRM</span>
                    {/* Heart Icon */}
                    <button
                      className="absolute top-2 left-2 z-[2]"
                      onClick={(e) => handleWishlistToggle(product._id, e)}
                    >
                      <Heart className="w-5 h-5" fill={productInWishlist ? "#ff4444" : "none"} stroke={productInWishlist ? "#ff4444" : "white"} />
                    </button>
                    {/* Out of Stock Badge */}
                    {!product.inStock && (
                      <span className="absolute top-2 right-2 bg-white/90 text-[#F9A922] text-[11px] h-6 px-2 flex items-center rounded font-semibold">Out of Stock</span>
                    )}
                  </div>

                  {/* Product Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-sm font-semibold text-[#333] leading-snug flex-1 line-clamp-2">{product.name}</h3>
                      {isAuthenticated && (
                        <span className="text-[#F9A922] font-bold text-[0.8rem] bg-[rgba(255,107,53,0.1)] px-1.5 py-0.5 rounded border border-[rgba(255,107,53,0.2)] whitespace-nowrap flex-shrink-0">
                          ${product.price}/kg
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#666] mb-2 line-clamp-2 leading-snug">{product.description || "Premium, lab-tested raw material trusted by manufacturers."}</p>
                    <p className="text-[11px] text-[#999] mb-4">Product Code: {product.uniqueId}</p>
                    <button
                      disabled={!product.inStock}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct({ id: product._id, name: product.name });
                        setRfqModalOpen(true);
                      }}
                      className={`w-full py-2 text-xs font-semibold rounded text-white transition-colors ${product.inStock ? "bg-[#F9A922] hover:bg-[#E8981F]" : "bg-[#ccc] cursor-not-allowed"}`}
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded text-sm font-medium transition-colors ${p === page ? "bg-[#F9A922] text-white" : "text-[#666] hover:bg-[#f0f0f0]"}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Modals */}
        <ContactFormModal
          open={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          source="product_page"
          onSuccess={() => toast.success("Thank you! Your message has been sent successfully.")}
          onError={(error) => toast.error(error)}
        />
        <RFQModal
          open={rfqModalOpen}
          onClose={() => { setRfqModalOpen(false); setSelectedProduct(null); }}
          productId={selectedProduct?.id}
          productName={selectedProduct?.name || ""}
          onSuccess={() => toast.success("Thank you! Your RFQ has been submitted successfully.")}
          onError={(error) => toast.error(error)}
        />
      </div>
    </div>
  );
};

export default ProductPage;
