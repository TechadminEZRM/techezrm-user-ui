"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Button,
  Divider,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  ShoppingCart,
  Visibility,
  LocalOffer,
  Category,
  Search,
  CheckCircle,
  ErrorOutline,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import type { SearchProduct, SearchCategory } from "@/api/services/search";

interface SearchResultsProps {
  products: SearchProduct[];
  categories: SearchCategory[];
  totalProducts: number;
  totalCategories: number;
  searchQuery: string;
  loading?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  categories,
  totalProducts,
  totalCategories,
  searchQuery,
  loading = false,
}) => {
  const router = useRouter();

  const handleProductClick = (productId: string) => {
    router.push(`/product/detail/${productId}`);
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/product?category=${slug}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "#666" }}>
          Searching...
        </Typography>
      </Box>
    );
  }

  const hasResults = totalProducts > 0 || totalCategories > 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
          Search Results
        </Typography>
        <Typography variant="body1" sx={{ color: "#666", mb: 2 }}>
          {hasResults ? (
            <>
              Found {totalProducts + totalCategories} results for "
              <strong>{searchQuery}</strong>"
            </>
          ) : (
            <>
              No results found for "<strong>{searchQuery}</strong>"
            </>
          )}
        </Typography>

        {hasResults && (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {totalProducts > 0 && (
              <Chip
                icon={<LocalOffer />}
                label={`${totalProducts} Products`}
                color="primary"
                variant="outlined"
                sx={{
                  borderColor: "#ff6b35",
                  color: "#ff6b35",
                  "& .MuiChip-icon": {
                    color: "#ff6b35",
                  },
                }}
              />
            )}
            {totalCategories > 0 && (
              <Chip
                icon={<Category />}
                label={`${totalCategories} Categories`}
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>

      {!hasResults ? (
        // No Results State
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            border: "2px dashed #e0e0e0",
            borderRadius: 3,
          }}
        >
          <Search sx={{ fontSize: 64, color: "#c0c0c0", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#666", mb: 2 }}>
            No products or categories found
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#999", mb: 3, maxWidth: 400, mx: "auto" }}
          >
            Try adjusting your search terms or browse our categories to find
            what you're looking for.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => router.push("/product")}
            sx={{
              borderColor: "#ff6b35",
              color: "#ff6b35",
              "&:hover": {
                borderColor: "#e55a2b",
                backgroundColor: "rgba(255, 107, 53, 0.04)",
              },
              textTransform: "none",
            }}
          >
            Browse All Products
          </Button>
        </Paper>
      ) : (
        <>
          {/* Categories Section */}
          {categories.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#333", mb: 3 }}
              >
                Categories
              </Typography>
              <Grid container spacing={2}>
                {categories.map((category) => (
                  <Grid item xs={12} sm={6} md={4} key={category._id}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                          transform: "translateY(-2px)",
                          borderColor: "#ff6b35",
                        },
                        borderRadius: 2,
                      }}
                      onClick={() => handleCategoryClick(category.slug)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Avatar
                            sx={{
                              backgroundColor: "#ff6b35",
                              width: 40,
                              height: 40,
                            }}
                          >
                            <Category sx={{ color: "white" }} />
                          </Avatar>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "#333" }}
                          >
                            {category.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {category.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my: 4 }} />
            </Box>
          )}

          {/* Products Section */}
          {products.length > 0 && (
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#333", mb: 3 }}
              >
                Products
              </Typography>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                          transform: "translateY(-4px)",
                        },
                        borderRadius: 2,
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onClick={() => handleProductClick(product._id)}
                    >
                      {/* Stock Status Badge */}
                      <Chip
                        icon={
                          product.inStock ? <CheckCircle /> : <ErrorOutline />
                        }
                        label={product.inStock ? "In Stock" : "Out of Stock"}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          zIndex: 1,
                          backgroundColor: product.inStock
                            ? "#4caf50"
                            : "#f44336",
                          color: "white",
                          fontSize: "0.75rem",
                          height: 24,
                          "& .MuiChip-icon": {
                            color: "white",
                            fontSize: 16,
                          },
                        }}
                      />

                      {/* Product Image */}
                      <CardMedia
                        component="img"
                        sx={{
                          height: 200,
                          objectFit: "cover",
                          backgroundColor: "#f5f5f5",
                        }}
                        image={
                          product.bannerImage ||
                          product.images[0] ||
                          "/placeholder-product.png"
                        }
                        alt={product.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-product.png";
                        }}
                      />

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        {/* Product ID */}
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#999",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {product.uniqueId}
                        </Typography>

                        {/* Product Name */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#333",
                            mb: 1,
                            fontSize: "1rem",
                            lineHeight: 1.3,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.name}
                        </Typography>

                        {/* Product Description */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.4,
                          }}
                        >
                          {product.description}
                        </Typography>

                        {/* Appearance */}
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#999",
                            fontStyle: "italic",
                            mb: 2,
                            display: "block",
                          }}
                        >
                          {product.appearance}
                        </Typography>

                        {/* Price */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#ff6b35",
                            mb: 2,
                          }}
                        >
                          {formatPrice(product.price)}
                        </Typography>

                        {/* Action Buttons */}
                        <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                          <Button
                            variant="contained"
                            startIcon={<Visibility />}
                            fullWidth
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product._id);
                            }}
                            sx={{
                              backgroundColor: "#ff6b35",
                              "&:hover": {
                                backgroundColor: "#e55a2b",
                              },
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            View Details
                          </Button>
                          <IconButton
                            sx={{
                              border: "1px solid #e0e0e0",
                              color: "#666",
                              "&:hover": {
                                backgroundColor: "#f5f5f5",
                                borderColor: "#ff6b35",
                                color: "#ff6b35",
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to cart functionality
                              console.log("Add to cart:", product._id);
                            }}
                          >
                            <ShoppingCart />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default SearchResults;
