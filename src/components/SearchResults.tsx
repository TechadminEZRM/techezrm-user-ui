"use client";

import React, { useState } from "react";
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
  Snackbar,
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
import { useAppStore } from "@/store/use-app-store";
import { useAddToCart, useProductVariants } from "@/api/handlers";
import ProductCard from "./ProductCard"

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
  // Snackbar state for feedback
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { customer, isAuthenticated } = useAppStore();
  const addToCartMutation = useAddToCart();


  const handleAddToCart = (product:any, unitSize:any) => {
    // Check if user is authenticated
    if (!isAuthenticated || !customer) {
      // Redirect to login page
      router.push("/sign_in");
      return;
    }

    // Add to cart if authenticated
    addToCartMutation.mutate(
      {
        customerId: customer.id,
        productId: product?._id,
        quantity: unitSize,
      },
      {
        onSuccess: () => {
          setSnackbarMessage(`added to cart successfully!`);
          setSnackbarOpen(true);
        },
        onError: (error) => {
          console.error("Failed to add to cart:", error);
          setSnackbarMessage(
            "Failed to add product to cart. Please try again."
          );
          setSnackbarOpen(true);
        },
      }
    );
  };

  return (
    <>
    <Box sx={{ p: 3 }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
          Search Results --
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
                  <ProductCard
                    key={product._id}
                    product={product}
                    handleProductClick={handleProductClick}
                    handleAddToCart={handleAddToCart}
                  />
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}
    </Box>
     <Snackbar
     open={snackbarOpen}
     autoHideDuration={4000}
     onClose={() => setSnackbarOpen(false)}
     message={snackbarMessage}
     anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
   />
    </>
  );
};

export default SearchResults;
