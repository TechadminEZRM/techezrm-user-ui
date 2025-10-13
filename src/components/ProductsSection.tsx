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

interface ProductCardProps {
  product: Product;
  onClick: (productId: string, productName: string) => void;
  onButtonClick: (productId: string, productName: string) => void;
  isAuthenticated: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
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
    return "/product.png"; // Default fallback image
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        bgcolor: "white",
        width: "200px",
        height: "300px",
        flexShrink: 0,
        transition: "all 0.3s ease",
        overflow: "hidden",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 0, height: "100%" }}>
        {/* Product Image Container - Flush with top */}
        <Box
          sx={{
            bgcolor: "#e9ecef",
            borderRadius: "12px 12px 0 0",
            height: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Image
            src={getProductImage(product)}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            onError={(e) => {
              // Fallback to default vitamin bottle icon
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          {/* Fallback Vitamin Bottle Icon */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Bottle */}

            {/* C Badge */}
            {/* <Box
              sx={{
                position: "absolute",
                right: "-6px",
                bottom: "6px",
                width: "18px",
                height: "18px",
                bgcolor: "#ffd700",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid white",
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                C
              </Typography>
            </Box> */}
          </Box>
        </Box>
        {/* Content Section with padding */}
        <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
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
              variant="h6"
              title={product.name} // Tooltip for long names
              sx={{
                fontWeight: 600,
                color: "#333",
                fontSize: "0.95rem",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
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
                    color: "#ff7849",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    backgroundColor: "rgba(255, 120, 73, 0.1)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    border: "1px solid rgba(255, 120, 73, 0.2)",
                  }}
                >
                  ${product.price}/kg
                </Typography>
              </Box>
            )}
          </Box>
          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              mb: 1.5,
              fontSize: "0.75rem",
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
          {/* Price Section - HIDDEN as per requirement */}
          {/* 
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                color: "#2196f3",
                fontSize: "0.65rem",
              }}
            >
              Starting from
            </Typography>
            <Typography
              sx={{
                color: "#333",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            >
              ${product.price}
            </Typography>
          </Box>
          */}
        </Box>
        {/* Button - Flush with bottom */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleButtonClick}
          sx={{
            bgcolor: "#ff7849",
            color: "white",
            fontWeight: 500,
            borderRadius: "0 0 12px 12px",
            textTransform: "none",
            fontSize: "0.9rem",
            height: 30,                  // fixed height
            display: "flex",
            alignItems: "center",        // vertical center
            justifyContent: "center",    // horizontal center
            "&:hover": {
              bgcolor: "#e66a3c",
            },
          }}
        >
          {isAuthenticated ? "Buy" : "Get Quote"}
        </Button>
      </CardContent>
    </Card>
  );
};

const ProductCardSkeleton: React.FC = () => (
  <Card
    sx={{
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      bgcolor: "white",
      width: "200px",
      height: "300px",
      flexShrink: 0,
    }}
  >
    <CardContent sx={{ p: 0, height: "100%" }}>
      <Skeleton
        variant="rectangular"
        height={120}
        sx={{ borderRadius: "12px 12px 0 0" }}
      />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1.5 }} />
      </Box>
      <Skeleton
        variant="rectangular"
        height={40}
        sx={{ borderRadius: "0 0 12px 12px" }}
      />
    </CardContent>
  </Card>
);

const ProductsSection: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  // API integration state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/public/products/listing?page=1&limit=8&sortBy=createdAt&sortOrder=desc`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        if (data.success && data.products) {
          setProducts(data.products);
          setError(null);
        } else {
          setProducts([]);
          setError("No products found");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
        setProducts([]);
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
    const maxIndex = Math.max(0, products.length - 4);
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + 4);

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: "white",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Left Side - Title */}
            <Box
              sx={{
                minWidth: "200px",
                flexShrink: 0,
              }}
            >
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
                    fontSize: { xs: "1.3rem", md: "1.8rem" },
                    lineHeight: 1.2,
                  }}
                >
                  Products you may
                  <br />
                  like
                </Typography>
              </Box>
            </Box>
            {/* Right Side - Loading Skeletons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flex: 1,
                overflow: "hidden",
              }}
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </Box>
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
          bgcolor: "white",
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
  if (products.length === 0 && !loading) {
    return (
      <Box
        sx={{
          bgcolor: "white",
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
          bgcolor: "white",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          {/* Main Horizontal Layout */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Left Side - Title and Navigation */}
            <Box
              sx={{
                minWidth: "200px",
                flexShrink: 0,
              }}
            >
              {/* Section Title with Orange Bar */}
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
                    fontSize: { xs: "1.3rem", md: "1.8rem" },
                    lineHeight: 1.2,
                  }}
                >
                  Products you may
                  <br />
                  like
                </Typography>
              </Box>
              {/* Navigation Arrows */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "4px",
                    "&:hover": {
                      bgcolor: "#f5f5f5",
                    },
                    "&:disabled": {
                      opacity: 0.5,
                      cursor: "not-allowed",
                    },
                  }}
                >
                  <ChevronLeft sx={{ fontSize: 16, color: "#666", mr: -0.5 }} />
                  <ChevronLeft sx={{ fontSize: 16, color: "#666" }} />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  disabled={currentIndex >= Math.max(0, products.length - 4)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "4px",
                    "&:hover": {
                      bgcolor: "#f5f5f5",
                    },
                    "&:disabled": {
                      opacity: 0.5,
                      cursor: "not-allowed",
                    },
                  }}
                >
                  <ChevronRight
                    sx={{ fontSize: 16, color: "#666", mr: -0.5 }}
                  />
                  <ChevronRight sx={{ fontSize: 16, color: "#666" }} />
                </IconButton>
              </Box>
            </Box>
            {/* Right Side - Products Grid (Fixed 4 cards, no scroll) */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flex: 1,
                overflow: "hidden",
              }}
            >
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={handleCardClick}
                  onButtonClick={handleButtonClick}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </Box>
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

export default ProductsSection;
