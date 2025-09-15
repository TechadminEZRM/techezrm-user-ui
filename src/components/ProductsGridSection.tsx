"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  IconButton,
  Skeleton,
  Alert,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
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

const ProductGridCard: React.FC<ProductGridCardProps> = ({
  product,
  onClick,
  onButtonClick,
  isAuthenticated,
}) => {
  const { isAuthenticated: authState } = useAppStore();
  const handleCardClick = () => {
    onClick(product._id, product.name);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking the button
    onButtonClick(product._id, product.name);
  };

  const getProductImage = (product: Product) => {
    if (product.bannerImage) {
      return product.bannerImage.startsWith("http")
        ? product.bannerImage
        : `${process.env.NEXT_PUBLIC_API_URL}/${product.bannerImage}`;
    }
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      return firstImage.startsWith("http")
        ? firstImage
        : `${process.env.NEXT_PUBLIC_API_URL}/${firstImage}`;
    }
    return "/productGrid.png"; // Default fallback image
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: "18px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        bgcolor: "white",
        width: "280px", // Exact same width
        height: "320px", // Exact same height
        transition: "all 0.3s ease",
        overflow: "hidden",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent
        sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Product Image Container */}
        <Box
          sx={{
            bgcolor: "#f8f8f8",
            height: "200px", // Exact same height
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Image
            src={getProductImage(product)}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }} // Changed from "contain" to "cover" to fill entire container
            onError={(e) => {
              // Fallback to default image
              const target = e.target as HTMLImageElement;
              target.src = "/productGrid.png";
            }}
          />
        </Box>
        {/* Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleButtonClick}
          sx={{
            bgcolor: "#ff6b35",
            color: "white",
            fontWeight: 500,
            py: 0.5,
            borderRadius: 0,
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": {
              bgcolor: "#e55a2b",
            },
          }}
        >
          {isAuthenticated ? "Buy" : "Get Quote"}
        </Button>
        {/* Content Section */}
        <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Product Name and Price Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
              gap: 1,
            }}
          >
            <Typography
              title={product.name} // Tooltip for long names
              sx={{
                fontWeight: 600,
                color: "#2c3e50",
                fontSize: "0.8rem",
                lineHeight: 1.2,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                flex: 1,
              }}
            >
              {product.name}
            </Typography>

            {/* Price Section - Show only for authenticated users */}
            {authState && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flexShrink: 0,
                  minWidth: "fit-content",
                }}
              >
                <Typography
                  sx={{
                    color: "#ff6b35",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                    padding: "2px 5px",
                    borderRadius: "3px",
                    border: "1px solid rgba(255, 107, 53, 0.2)",
                  }}
                >
                  ${product.price}/kg
                </Typography>
              </Box>
            )}
          </Box>
          {/* Description Row - PRICE DESCRIPTION HIDDEN */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Typography
              sx={{
                color: "#7f8c8d",
                fontSize: "0.65rem",
                lineHeight: 1.3,
                flex: 1,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const ProductGridCardSkeleton: React.FC = () => (
  <Card
    sx={{
      borderRadius: "18px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      bgcolor: "white",
      width: "280px", // Exact same width
      height: "320px", // Exact same height
    }}
  >
    <CardContent
      sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="rectangular" height={40} />
      <Box sx={{ p: 2.5, flex: 1 }}>
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={16} />
      </Box>
    </CardContent>
  </Card>
);

const ProductsGridSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { isAuthenticated } = useAppStore();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  // API integration state
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/public/products/listing?page=1&limit=20&sortBy=createdAt&sortOrder=desc`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        if (data.success && data.products) {
          setAllProducts(data.products);
          setError(null);
        } else {
          setAllProducts([]);
          setError("No products found");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCardClick = (productId: string) => {
    // Always redirect to detail page when clicking on card
    router.push(`/product/detail/${productId}`);
  };

  const handleButtonClick = (productId: string, productName: string) => {
    if (isAuthenticated) {
      // If authenticated, redirect to detail page
      router.push(`/product/detail/${productId}`);
    } else {
      // If not authenticated, open quote form modal
      setSelectedProduct(productName);
      setIsQuoteModalOpen(true);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, allProducts.length - 4);
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Get exactly 4 products to display
  const visibleProducts = allProducts.slice(currentIndex, currentIndex + 4);

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: "#f1f5f9",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          {/* Section Header */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  bgcolor: "#ff7849",
                  mr: 2,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                }}
              >
                Products
              </Typography>
            </Box>
          </Box>
          {/* Loading Skeletons - Exactly 4, No Overflow */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 3,
              width: "100%",
              maxWidth: "100%",
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductGridCardSkeleton key={index} />
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <Box
        sx={{
          bgcolor: "#f1f5f9",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            <Typography variant="h6">Unable to load products</Typography>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        </Container>
      </Box>
    );
  }

  // Empty state
  if (allProducts.length === 0 && !loading) {
    return (
      <Box
        sx={{
          bgcolor: "#f1f5f9",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
              No products available
            </Typography>
            <Typography variant="body2" sx={{ color: "#999" }}>
              Check back later for our latest products.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: "#f1f5f9",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          {/* Section Header */}
          <Box sx={{ mb: 4 }}>
            {/* Title with Orange Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  bgcolor: "#ff7849",
                  mr: 2,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                }}
              >
                Products
              </Typography>
            </Box>
            {/* Navigation Arrows */}
            <Box sx={{ display: "flex", gap: 1, ml: 6 }}>
              <IconButton
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                sx={{
                  width: 24,
                  height: 24,
                  p: 0,
                  color: "#666",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                  },
                  "&:disabled": {
                    opacity: 0.5,
                  },
                }}
              >
                <ChevronLeft sx={{ fontSize: 16, color: "#666", mr: -0.5 }} />
                <ChevronLeft sx={{ fontSize: 16, color: "#666" }} />
              </IconButton>
              <IconButton
                onClick={handleNext}
                disabled={currentIndex >= Math.max(0, allProducts.length - 4)}
                sx={{
                  width: 24,
                  height: 24,
                  p: 0,
                  color: "#666",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                  },
                  "&:disabled": {
                    opacity: 0.5,
                  },
                }}
              >
                <ChevronRight sx={{ fontSize: 16, color: "#666", mr: -0.5 }} />
                <ChevronRight sx={{ fontSize: 16, color: "#666" }} />
              </IconButton>
            </Box>
          </Box>
          {/* Products Grid - Exactly 4 Products, No Horizontal Scroll */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 3,
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden", // Prevent any overflow
            }}
          >
            {visibleProducts.map((product) => (
              <Box
                key={product._id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  minWidth: 0, // Allow shrinking if needed
                }}
              >
                <ProductGridCard
                  product={product}
                  onClick={handleCardClick}
                  onButtonClick={handleButtonClick}
                  isAuthenticated={isAuthenticated}
                />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      {/* Quote Form Modal */}
      <QuoteFormModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        productName={selectedProduct}
      />
    </>
  );
};

export default ProductsGridSection;
