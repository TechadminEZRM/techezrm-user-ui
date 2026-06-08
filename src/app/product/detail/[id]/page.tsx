"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import { Heart, MessageCircle, Mail, Share2, ShoppingCart, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useProductDetail } from "@/api/handlers/productDetailsHandler";
import { useAddToWishlist } from "@/api/handlers/wishlistHandler";
import { useAddToCart } from "@/api/handlers/cartHandler";
import { useProductFAQs } from "@/api/handlers/faqHandler";
import { useAppStore } from "@/store/use-app-store";
import QuoteFormModal from "@/components/quote-form-modal";
import FAQSection from "@/components/FAQSection";
import ProductVariants from "@/components/ProductVariants";
import { useProductVariants } from "@/api/handlers/productVariantsHandler";
import CompanyDocumentsSection from "@/components/CompanyDocumentsSection";
import { Spinner } from "@/components/ui/spinner";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`product-tabpanel-${index}`}>
      {value === index && <div className="py-6">{children}</div>}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: variantsResponse } = useProductVariants(productId);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const currentUrl = `${baseUrl}${pathname}${searchParams}`;

  const { customer, isAuthenticated } = useAppStore();

  const { data: response, isLoading, error, isError } = useProductDetail(productId);
  const addToWishlistMutation = useAddToWishlist();
  const addToCartMutation = useAddToCart();

  const { data: faqResponse, isLoading: faqLoading, error: faqError } = useProductFAQs(productId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faqs = (faqResponse as any)?.data || [];

  const [tabValue, setTabValue] = useState(0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [minCartQuantity, setMinCartQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMagnified, setIsMagnified] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });

  const [companySpecific, setCompanySpecific] = useState("Documents - Company Specific");
  const [facilitySpecific, setFacilitySpecific] = useState("Documents - Facility Specific");
  const [productSpecific, setProductSpecific] = useState("Documents - Product Specific");
  const [batchSpecific, setBatchSpecific] = useState("Documents - Batch Specific");

  useEffect(() => {
    if (variantsResponse?.data?.length) {
      const minUnitSize = Math.min(...variantsResponse.data.map((v) => v.unitSize));
      setMinCartQuantity(minUnitSize);
      setCartQuantity(minUnitSize);
    }
  }, [variantsResponse]);

  useEffect(() => {
    if (snackbarOpen) {
      const timer = setTimeout(() => setSnackbarOpen(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [snackbarOpen]);

  const handlePlaceEnquiry = () => setIsQuoteModalOpen(true);

  const handleWishlistClick = () => {
    if (!isAuthenticated || !customer) { router.push("/sign_in"); return; }
    addToWishlistMutation.mutate(
      { customerId: customer.id, productId },
      {
        onSuccess: () => { setSnackbarMessage("Product added to wishlist successfully!"); setSnackbarOpen(true); },
        onError: () => { setSnackbarMessage("Failed to add product to wishlist. Please try again."); setSnackbarOpen(true); },
      }
    );
  };

  const handleAddToCart = () => {
    if (!isAuthenticated || !customer) { router.push("/sign_in"); return; }
    addToCartMutation.mutate(
      { customerId: customer.id, productId, quantity: cartQuantity },
      {
        onSuccess: () => { setSnackbarMessage("Added to cart successfully!"); setSnackbarOpen(true); },
        onError: () => { setSnackbarMessage("Failed to add product to cart. Please try again."); setSnackbarOpen(true); },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          Error loading product details: {error instanceof Error ? error.message : "Something went wrong"}
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product: any = response?.data ?? {};

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700">Product not found</div>
      </div>
    );
  }

  const getProductImages = () => {
    const images = [];
    if (product.bannerImage) {
      images.push({
        src: product.bannerImage.startsWith("http") ? product.bannerImage : `${process.env.NEXT_PUBLIC_API_URL}/${product.bannerImage}`,
        alt: `${product.name} - Banner`,
        type: "banner",
      });
    }
    if (product.images?.length > 0) {
      product.images.forEach((image: string, index: number) => {
        images.push({
          src: image.startsWith("http") ? image : `${process.env.NEXT_PUBLIC_API_URL}/${image}`,
          alt: `${product.name} - Image ${index + 1}`,
          type: "gallery",
        });
      });
    }
    if (images.length === 0) {
      images.push({ src: "/placeholder.svg?height=400&width=600", alt: "Product placeholder", type: "placeholder" });
    }
    return images;
  };

  const getCurrentImage = () => {
    const images = getProductImages();
    return images[selectedImageIndex] || images[0];
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMagnified) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setMagnifierPosition({ x, y });
  };

  const features =
    product?.dietaryAttributes?.map((attr: any) => ({
      label: attr.title,
      color: "#F9A922",
      logo: attr.logo,
      certificateLink: attr.certificateLink,
    })) || [];

  const handleWhatsAppShare = (prod: any) => {
    const message = `To checkout ${prod.name} on EZRM, please click on the below link:\n${currentUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleEmailShare = (prod: any) => {
    const subject = "Check out product on EZRM!";
    const body = `Hi,\n\nTo checkout ${prod.name} on EZRM, please click on the below link:\n${currentUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const tabLabels = ["Sample Product", "Product Description", "FAQs"];

  return (
    <div className="max-w-7xl mx-auto py-2 px-4">
      {/* Header breadcrumb */}
      <p className="mb-6 font-medium text-[#333] text-lg">
        {product?.name}{" "}
        /{" "}
        <span
          onClick={() => router.push(`/product?category=${product?.category?.slug}`)}
          className="text-[#F9A922] cursor-pointer hover:text-[#E8981F] hover:underline transition-colors"
        >
          {product?.category?.name}
        </span>
      </p>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Left Side - 65% */}
        <div className="w-[65%]">
          {/* Product Image */}
          <div
            className="relative w-full h-[400px] rounded-[20px] overflow-hidden bg-[#f5f5f5] mb-6"
          >
            <div
              className="relative w-full h-full"
              style={{ cursor: isMagnified ? "zoom-out" : "zoom-in" }}
              onMouseEnter={() => setIsMagnified(true)}
              onMouseLeave={() => setIsMagnified(false)}
              onMouseMove={handleMouseMove}
            >
              <Image src={getCurrentImage().src} alt={getCurrentImage().alt} fill style={{ objectFit: "cover" }} />
              {isMagnified && (
                <div
                  className="absolute inset-0 pointer-events-none z-[2]"
                  style={{
                    background: `url(${getCurrentImage().src})`,
                    backgroundSize: "300%",
                    backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                  }}
                />
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="mb-6">
            <p className="font-semibold text-[#333] text-sm mb-3">
              Product Images ({getProductImages().length})
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {getProductImages().map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className="relative flex-shrink-0 w-[90px] h-[90px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105"
                  style={{
                    border: selectedImageIndex === index ? "3px solid #F9A922" : "2px solid #e0e0e0",
                    boxShadow: selectedImageIndex === index ? "0 4px 20px rgba(255,107,53,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <Image src={image.src} alt={image.alt} fill style={{ objectFit: "cover" }} />
                  {image.type === "banner" && (
                    <span className="absolute top-1.5 left-1.5 bg-[#F9A922]/95 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Three Tabs */}
          <div className="mt-4">
            <div className="flex border-b border-gray-200">
              {tabLabels.map((label, i) => (
                <button
                  key={i}
                  onClick={() => setTabValue(i)}
                  className={`px-4 py-2.5 text-sm font-medium transition-all ${
                    tabValue === i
                      ? "bg-[#F9A922] text-white rounded-t-md"
                      : "text-[#666] hover:text-[#333]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <TabPanel value={tabValue} index={0}>
              <p className="text-[#666] leading-relaxed text-sm">
                Sample Product information and details will be displayed here.
              </p>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <div>
                <h2 className="font-semibold text-lg mb-6">Product Description</h2>

                {/* Product Overview */}
                <div className="mb-8">
                  <p className="leading-[1.8] text-[#333] mb-6 text-[15px] text-justify">
                    {product?.description}
                  </p>
                </div>

                {/* Product Details Table */}
                <div className="mb-8">
                  <h3 className="font-semibold text-[#333] mb-5">Product Details</h3>
                  <div className="rounded-xl border border-[#e8e8e8] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                    <table className="w-full min-w-[400px]">
                      <tbody>
                        {[
                          { label: "Appearance", value: product.appearance || "Not specified" },
                          { label: "Category", value: product.category?.name || "Not specified" },
                          { label: "Product ID", value: product.uniqueId, mono: true },
                        ].map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-[#fafafa]" : "bg-white"}>
                            <td className="w-[30%] px-4 py-3 font-semibold text-[#F9A922] text-sm border-r border-[#e8e8e8] bg-[rgba(255,107,53,0.03)]">
                              {row.label}
                            </td>
                            <td className={`px-4 py-3 text-[#333] text-sm border-b border-[#e8e8e8] ${row.mono ? "font-mono font-medium" : ""}`}>
                              {row.value}
                            </td>
                          </tr>
                        ))}

                        {/* Stock Status */}
                        <tr className="bg-[#fafafa]">
                          <td className="w-[30%] px-4 py-3 font-semibold text-[#F9A922] text-sm border-r border-[#e8e8e8] bg-[rgba(255,107,53,0.03)]">
                            Stock Status
                          </td>
                          <td className="px-4 py-3 border-b border-[#e8e8e8]">
                            <span
                              className={`inline-block px-3 py-1 rounded-md text-xs font-semibold border ${
                                product.inStock
                                  ? "bg-[#e8f5e8] text-[#2e7d32] border-[#c8e6c9]"
                                  : "bg-[#ffeaea] text-[#d32f2f] border-[#ffcdd2]"
                              }`}
                            >
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                        </tr>

                        {/* Applications */}
                        <tr className="bg-white">
                          <td className="w-[30%] px-4 py-3 font-semibold text-[#F9A922] text-sm border-r border-[#e8e8e8] bg-[rgba(255,107,53,0.03)]">
                            Applications
                          </td>
                          <td className="px-4 py-3 border-b border-[#e8e8e8]">
                            {product.applications?.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {product.applications.map((app: string, i: number) => (
                                  <span key={i} className="px-2 py-1 rounded-md text-xs font-medium bg-[rgba(255,107,53,0.1)] text-[#F9A922] border border-[rgba(255,107,53,0.2)]">
                                    {app.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[#999] italic text-sm">Not specified</p>
                            )}
                          </td>
                        </tr>

                        {/* Functions */}
                        <tr className="bg-[#fafafa]">
                          <td className="w-[30%] px-4 py-3 font-semibold text-[#F9A922] text-sm border-r border-[#e8e8e8] bg-[rgba(255,107,53,0.03)]">
                            Functions
                          </td>
                          <td className="px-4 py-3 border-b border-[#e8e8e8]">
                            {product.functions?.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {product.functions.map((func: string, i: number) => (
                                  <span key={i} className="px-2 py-1 rounded-md text-xs font-medium bg-[rgba(255,107,53,0.1)] text-[#F9A922] border border-[rgba(255,107,53,0.2)]">
                                    {func.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[#999] italic text-sm">Not specified</p>
                            )}
                          </td>
                        </tr>

                        {/* Tags */}
                        <tr className="bg-white">
                          <td className="w-[30%] px-4 py-3 font-semibold text-[#F9A922] text-sm border-r border-[#e8e8e8] bg-[rgba(255,107,53,0.03)]">
                            Tags
                          </td>
                          <td className="px-4 py-3 border-b border-[#e8e8e8]">
                            {product.tags?.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag: string, i: number) => (
                                  <span key={i} className="px-2 py-1 rounded-md text-xs font-medium bg-[rgba(255,107,53,0.1)] text-[#F9A922] border border-[rgba(255,107,53,0.2)]">
                                    {tag.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[#999] italic text-sm">Not specified</p>
                            )}
                          </td>
                        </tr>

                        {/* Countries of Origin */}
                        <tr className="bg-[#fafafa]">
                          <td className="w-[30%] px-4 py-3 font-semibold text-[#F9A922] text-sm border-r border-[#e8e8e8] bg-[rgba(255,107,53,0.03)]">
                            Countries of Origin
                          </td>
                          <td className="px-4 py-3">
                            {product.countryOfOrigin?.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {product.countryOfOrigin.map((country: string, i: number) => (
                                  <span key={i} className="px-2 py-1 rounded-md text-xs font-medium bg-[rgba(255,107,53,0.1)] text-[#F9A922] border border-[rgba(255,107,53,0.2)]">
                                    {country}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[#999] italic text-sm">Not specified</p>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Dietary Attributes / Certifications */}
                {product.dietaryAttributes?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-[#333] mb-5">Certifications & Attributes</h3>
                    <div className="flex flex-wrap gap-4">
                      {product.dietaryAttributes.map((attr: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-lg border border-[rgba(255,107,53,0.1)] bg-[rgba(255,107,53,0.05)] transition-all duration-300 min-w-[280px] flex-1"
                          style={{
                            cursor: attr.certificateLink ? "pointer" : "default",
                          }}
                          onClick={() => attr.certificateLink && window.open(attr.certificateLink, "_blank")}
                        >
                          {attr.logo && (
                            <Image
                              src={attr.logo}
                              alt={attr.title}
                              width={32}
                              height={32}
                              style={{ objectFit: "contain", borderRadius: "4px", marginRight: "4px" }}
                            />
                          )}
                          <div>
                            <p className="font-semibold text-[#333] text-sm">{attr.title}</p>
                            {attr.certificateLink && (
                              <p className="text-[#F9A922] text-[10px]">Click to view certificate</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <FAQSection faqs={faqs} isLoading={faqLoading} error={faqError} />
            </TabPanel>
          </div>
        </div>

        {/* Right Side - 35% */}
        <div className="w-[35%]">
          {/* Product Title - same height as image */}
          <div className="h-[400px] flex flex-col">
            <h2 className="font-semibold text-xl mb-1">
              {product.name}{" "}
              /{" "}
              <span
                onClick={() => router.push(`/product?category=${product?.category?.slug}`)}
                className="font-normal text-[#F9A922] cursor-pointer hover:text-[#E8981F] hover:underline transition-all"
              >
                {product?.category?.name}
              </span>
            </h2>
            <p className="text-[#666] text-sm mb-6">{product.uniqueId}</p>
          </div>

          {/* Product Icons / Dietary Attributes */}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-6">
              {features.map((feature: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center transition-all duration-300"
                  style={{ cursor: feature.certificateLink ? "pointer" : "default" }}
                  onClick={() => feature.certificateLink && window.open(feature.certificateLink, "_blank")}
                >
                  <div className="w-20 h-20 rounded-xl bg-white overflow-hidden flex items-center justify-center mb-1 transition-all duration-300">
                    {feature.logo ? (
                      <Image src={feature.logo} alt={feature.label} width={80} height={80} style={{ objectFit: "contain", borderRadius: "4px" }} />
                    ) : (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: feature.color }}>
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-[#666] max-w-[80px] leading-tight">{feature.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Product Variants Table */}
          <ProductVariants productId={productId} />

          {/* Quantity Selector and Add to Cart */}
          <div className="mb-6">
            <div className="mb-4">
              <p className="font-semibold text-sm mb-2">Quantity</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCartQuantity(Math.max(minCartQuantity, cartQuantity - minCartQuantity))}
                  disabled={cartQuantity <= minCartQuantity}
                  className="w-8 h-8 flex items-center justify-center border border-[#e0e0e0] rounded disabled:opacity-50 hover:border-[#F9A922] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={cartQuantity}
                  min={minCartQuantity}
                  step={minCartQuantity}
                  onChange={(e) => {
                    let value = parseInt(e.target.value) || minCartQuantity;
                    if (value < minCartQuantity) value = minCartQuantity;
                    else value = Math.ceil(value / minCartQuantity) * minCartQuantity;
                    setCartQuantity(value);
                  }}
                  className="w-16 h-8 text-center text-sm border border-[#e0e0e0] rounded outline-none focus:border-[#F9A922]"
                />
                <button
                  onClick={() => setCartQuantity(cartQuantity + minCartQuantity)}
                  className="w-8 h-8 flex items-center justify-center border border-[#e0e0e0] rounded hover:border-[#F9A922] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || addToCartMutation.isPending || minCartQuantity <= 1}
              className="w-full flex items-center justify-center gap-2 py-3 rounded text-white text-sm font-medium transition-colors disabled:opacity-60 mb-4"
              style={{ backgroundColor: product.inStock ? "#4caf50" : "#ccc" }}
            >
              <ShoppingCart className="w-4 h-4" />
              {addToCartMutation.isPending ? "Adding..." : product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {/* Place Enquiry Button */}
          <button
            onClick={handlePlaceEnquiry}
            disabled={!product.inStock}
            className="w-full py-3 rounded text-white text-sm font-medium transition-colors mb-6 disabled:opacity-60"
            style={{ backgroundColor: product.inStock ? "#F9A922" : "#ccc" }}
          >
            {product.inStock ? "Place an Enquiry" : "Out of Stock"}
          </button>

          {/* Social Icons */}
          <div className="flex items-center gap-2 mt-4 h-24">
            <p className="text-xs text-[#666] mr-1">Add to Wishlist</p>
            <button
              onClick={handleWishlistClick}
              disabled={addToWishlistMutation.isPending || minCartQuantity <= 1}
              className="p-1.5 text-[#F9A922] hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button onClick={() => handleWhatsAppShare(product)} className="p-1.5 text-[#25d366] hover:opacity-80 transition-opacity">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button onClick={() => handleEmailShare(product)} className="p-1.5 text-[#ea4335] hover:opacity-80 transition-opacity">
              <Mail className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-[#F9A922] hover:opacity-80 transition-opacity">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="h-[200px] mt-6" />

          {/* Company Specific Documents Section */}
          <CompanyDocumentsSection
            companySpecific={companySpecific}
            facilitySpecific={facilitySpecific}
            productSpecific={productSpecific}
            batchSpecific={batchSpecific}
            onCompanySpecificChange={setCompanySpecific}
            onFacilitySpecificChange={setFacilitySpecific}
            onProductSpecificChange={setProductSpecific}
            onBatchSpecificChange={setBatchSpecific}
          />

          {/* Request For Sample Section */}
          <div className="mt-6">
            <p className="font-semibold mb-4 text-base">Request For Sample</p>
            <button
              className="w-full py-3 rounded text-white text-sm font-medium mb-6 transition-colors hover:opacity-90"
              style={{ backgroundColor: "#F9A922" }}
            >
              Request Now
            </button>
            <div className="flex items-center gap-4">
              <p className="font-medium text-[13px]">Minimum Order Quantity:</p>
              <input
                value={product?.moq !== undefined && product?.moq !== null ? `${product.moq} Kg` : ""}
                disabled
                className="w-20 h-8 text-center text-xs border border-[#e0e0e0] rounded bg-white px-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quote Form Modal */}
      <QuoteFormModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        productName={product.name}
        productId={product._id}
      />

      {/* Snackbar Toast */}
      {snackbarOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#323232] text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium">
          {snackbarMessage}
        </div>
      )}
    </div>
  );
}
