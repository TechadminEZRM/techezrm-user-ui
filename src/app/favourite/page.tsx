"use client";
import type React from "react";
import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Container,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Favorite, FavoriteBorder, ShoppingCart } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/api/handlers/wishlistHandler";
import { useAddToCart } from "@/api/handlers/cartHandler";
import { useAppStore } from "@/store/use-app-store";
import type { WishlistProduct } from "@/api/services/wishlist";

const FavouritesSection: React.FC = () => {
  const router = useRouter();
  const { customer, isAuthenticated } = useAppStore();
  console.log(customer, "#######");

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Fetch wishlist data
  const {
    data: wishlistData,
    isLoading,
    error,
    isError,
  } = useWishlist({
    customerId: customer?.id || "",
  });

  // Mutations for add/remove wishlist and cart
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  // Transform wishlist products to display format
  const products = useMemo(() => {
    if (!wishlistData?.data?.products) return [];

    return wishlistData.data.products.map((product: WishlistProduct) => ({
      id: product._id,
      title: product.name,
      subtitle: product.description || product.category,
      productCode: product.uniqueId,
      image: getProductImage(product),
      price: product.price,
      inStock: product.inStock,
      isFavorite: true, // All products in wishlist are favorites
    }));
  }, [wishlistData]);

  // Get product image with fallback
  // Change from arrow function to function declaration
  function getProductImage(product: WishlistProduct) {
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
    return "/placeholder.svg?height=278&width=421";
  }

  // Handle favorite toggle
  const toggleFavorite = async (productId: string, isFavorite: boolean) => {
    if (!customer?.id) return;

    try {
      if (isFavorite) {
        await removeFromWishlistMutation.mutateAsync({
          customerId: customer.id,
          productId,
        });
        setSnackbarMessage("Product removed from wishlist");
        setSnackbarOpen(true);
      } else {
        await addToWishlistMutation.mutateAsync({
          customerId: customer.id,
          productId,
        });
        setSnackbarMessage("Product added to wishlist");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      setSnackbarMessage("Failed to update wishlist. Please try again.");
      setSnackbarOpen(true);
    }
  };

  // Handle add to cart
  const handleAddToCart = (
    e: React.MouseEvent,
    productId: string,
    productName: string
  ) => {
    e.stopPropagation();

    if (!customer?.id) {
      router.push("/sign_in");
      return;
    }

    addToCartMutation.mutate(
      {
        customerId: customer.id,
        productId: productId,
        quantity: 1,
      },
      {
        onSuccess: () => {
          setSnackbarMessage(`${productName} added to cart successfully!`);
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

  // Handle product card click
  const handleProductClick = (productId: string) => {
    router.push(`/product/detail/${productId}`);
  };

  // Handle buy button click
  const handleBuyClick = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    router.push(`/product/detail/${productId}`);
  };

  // Show login message if not authenticated
  if (!isAuthenticated || !customer) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, md: 3 } }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "#333",
            mb: { xs: 2, md: 3 },
            fontSize: { xs: "1.5rem", md: "2rem" },
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          Wishlist
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#666",
              mb: 2,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Please login to view your favourites
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/sign_in")}
            sx={{
              backgroundColor: "#ff6b35",
              color: "white",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#e55a2b",
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Container>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, md: 3 } }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "#333",
            mb: { xs: 2, md: 3 },
            fontSize: { xs: "1.5rem", md: "2rem" },
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          Wishlist
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
          }}
        >
          <CircularProgress sx={{ color: "#ff6b35" }} />
        </Box>
      </Container>
    );
  }

  // Error state
  if (isError) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, md: 3 } }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "#333",
            mb: { xs: 2, md: 3 },
            fontSize: { xs: "1.5rem", md: "2rem" },
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          Wishlist
        </Typography>

        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading favourites:{" "}
          {error instanceof Error ? error.message : "Something went wrong"}
        </Alert>
      </Container>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <Container
        maxWidth="xl"
        sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, md: 3 } }}
      >
        {/* Enhanced Animated Empty State */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            px: 4,
            textAlign: "center",
            minHeight: "60vh",
          }}
        >
          {/* Animated Heart Container */}
          <Box
            sx={{
              width: 160,
              height: 160,
              mb: 4,
              position: "relative",
              animation: "float 3s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": {
                  transform: "translateY(0px) rotate(0deg)",
                },
                "50%": {
                  transform: "translateY(-20px) rotate(2deg)",
                },
              },
            }}
          >
            {/* Outer Container with Gradient */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #fff5f2 0%, #ffe8e0 100%)",
                border: "3px dashed #ff6b35",
                borderRadius: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxShadow: "0 12px 40px rgba(255, 107, 53, 0.15)",
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": {
                    boxShadow: "0 12px 40px rgba(255, 107, 53, 0.15)",
                  },
                  "50%": {
                    boxShadow: "0 16px 50px rgba(255, 107, 53, 0.25)",
                  },
                },
              }}
            >
              {/* Animated Heart Icon */}
              <Box
                sx={{
                  position: "relative",
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "heartBeat 2s ease-in-out infinite",
                  "@keyframes heartBeat": {
                    "0%, 100%": {
                      transform: "scale(1)",
                    },
                    "25%": {
                      transform: "scale(1.1)",
                    },
                    "50%": {
                      transform: "scale(1.05)",
                    },
                    "75%": {
                      transform: "scale(1.15)",
                    },
                  },
                }}
              >
                {/* Heart Icon */}
                <Favorite
                  sx={{
                    fontSize: "60px",
                    color: "#ff6b35",
                    filter: "drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3))",
                  }}
                />

                {/* Sparkle Effects */}
                {[...Array(6)].map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "absolute",
                      width: "4px",
                      height: "4px",
                      backgroundColor: "#ff6b35",
                      borderRadius: "50%",
                      opacity: 0.8,
                      animation: `sparkle${index + 1} 3s ease-in-out infinite`,
                      [`@keyframes sparkle${index + 1}`]: {
                        "0%, 100%": {
                          transform: `translate(${
                            Math.cos(index * 60) * 100
                          }px, ${Math.sin(index * 60) * 100}px)`,
                          opacity: 0,
                        },
                        "50%": {
                          opacity: 1,
                        },
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Floating Hearts */}
            {[...Array(4)].map((_, index) => (
              <Favorite
                key={index}
                sx={{
                  position: "absolute",
                  fontSize: "16px",
                  color: "#ff6b35",
                  opacity: 0.6,
                  animation: `floatingHeart${
                    index + 1
                  } 4s ease-in-out infinite`,
                  [`@keyframes floatingHeart${index + 1}`]: {
                    "0%, 100%": {
                      transform: `translate(${Math.cos(index * 90) * 120}px, ${
                        Math.sin(index * 90) * 120
                      }px)`,
                      opacity: 0,
                    },
                    "50%": {
                      opacity: 0.8,
                    },
                  },
                }}
              />
            ))}
          </Box>

          {/* Enhanced Typography */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#333",
              mb: 2,
              fontSize: { xs: "1.5rem", md: "2rem" },
              animation: "fadeInUp 1s ease-out 0.5s both",
              "@keyframes fadeInUp": {
                "0%": {
                  opacity: 0,
                  transform: "translateY(30px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            No Favourites Yet
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#666",
              mb: 4,
              maxWidth: "500px",
              fontSize: { xs: "0.9rem", md: "1.1rem" },
              lineHeight: 1.6,
              animation: "fadeInUp 1s ease-out 0.8s both",
              "@keyframes fadeInUp": {
                "0%": {
                  opacity: 0,
                  transform: "translateY(30px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            Start adding products to your favourites to see them here. Your
            wishlist will help you keep track of products you love!
          </Typography>

          {/* Enhanced CTA Button */}
          <Button
            variant="contained"
            onClick={() => router.push("/product")}
            sx={{
              backgroundColor: "#ff6b35",
              color: "white",
              px: 6,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "12px",
              boxShadow: "0 6px 20px rgba(255, 107, 53, 0.3)",
              animation:
                "fadeInUp 1s ease-out 1.1s both, buttonGlow 2s ease-in-out infinite 2s",
              "@keyframes fadeInUp": {
                "0%": {
                  opacity: 0,
                  transform: "translateY(30px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
              "@keyframes buttonGlow": {
                "0%, 100%": {
                  boxShadow: "0 6px 20px rgba(255, 107, 53, 0.3)",
                },
                "50%": {
                  boxShadow: "0 8px 30px rgba(255, 107, 53, 0.5)",
                },
              },
              "&:hover": {
                backgroundColor: "#e55a2b",
                boxShadow: "0 8px 30px rgba(255, 107, 53, 0.6)",
                transform: "translateY(-3px) scale(1.02)",
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, md: 3 } }}
    >
      {/* Section Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: "#333",
          mb: { xs: 2, md: 3 },
          fontSize: { xs: "1.5rem", md: "2rem" },
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        }}
      >
        Wishlist ({products.length})
      </Typography>

      {/* Products Grid - Responsive Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, md: 3 },
        }}
      >
        {/* Create rows of exactly 3 cards each */}
        {Array.from(
          { length: Math.ceil(products.length / 3) },
          (_, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2, md: 3 },
                justifyContent: "center",
                flexWrap: { xs: "wrap", md: "nowrap" },
              }}
            >
              {products.slice(rowIndex * 3, rowIndex * 3 + 3).map((product) => (
                <Card
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  sx={{
                    // Responsive width calculation
                    width: {
                      xs: "calc(100vw - 32px)", // Full width minus padding on mobile
                      sm: "calc(50vw - 24px)", // Half width minus gap on small tablets
                      md: "calc(33.333vw - 32px)", // One third minus gaps on desktop
                      lg: "calc(30vw - 24px)", // Slightly smaller on large screens
                      xl: "min(28vw, 421px)", // Cap at 421px on extra large screens
                    },
                    maxWidth: "421px", // Never exceed original design width
                    minWidth: { xs: "280px", md: "320px" }, // Minimum usable width
                    // Responsive height with aspect ratio preservation
                    height: {
                      xs: "auto",
                      md: "min(28vw, 380px)", // Maintain aspect ratio, cap at 443px
                    },
                    minHeight: { xs: "400px", md: "420px" },
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: { xs: "8px", md: "12px" },
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {/* Product Image Container */}
                  <Box
                    sx={{
                      position: "relative",
                      // Responsive height maintaining aspect ratio (278/421 ≈ 0.66)
                      height: {
                        xs: "60vw",
                        sm: "30vw",
                        md: "22vw",
                        lg: "20vw",
                        xl: "min(18.5vw, 278px)",
                      },
                      maxHeight: "278px",
                      minHeight: { xs: "200px", md: "220px" },
                      width: "100%",
                      overflow: "hidden",
                      borderTopLeftRadius: { xs: "8px", md: "12px" },
                      borderTopRightRadius: { xs: "8px", md: "12px" },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {/* Watermark */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: { xs: "1rem", md: "1.2rem" },
                        fontWeight: 600,
                        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        pointerEvents: "none",
                      }}
                    >
                      EZRM
                    </Box>

                    {/* Stock Status Badge */}
                    {!product.inStock && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(255, 0, 0, 0.8)",
                          color: "white",
                          px: 1,
                          py: 0.5,
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        Out of Stock
                      </Box>
                    )}
                  </Box>

                  {/* Product Content */}
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      p: { xs: 1.5, md: 2 },
                      "&:last-child": {
                        pb: { xs: 1.5, md: 2 },
                      },
                    }}
                  >
                    {/* Product Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        mb: 0.5,
                        fontFamily:
                          '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      {product?.title}
                    </Typography>

                    {/* Product Subtitle */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: { xs: "0.8rem", md: "0.875rem" },
                        mb: 1,
                        fontFamily:
                          '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product?.subtitle}
                    </Typography>

                    {/* Price */}
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#ff6b35",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      ${product.price.toLocaleString()}
                      <small style={{ color: "grey" }}>/kg</small>
                    </Typography>

                    {/* Product Code */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: { xs: "0.7rem", md: "0.75rem" },
                        mb: { xs: 1.5, md: 2 },
                        fontFamily:
                          '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Product Code: {product.productCode}
                    </Typography>

                    {/* Bottom Actions */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: "auto",
                        gap: 1,
                      }}
                    >
                      {/* Favorite Button */}
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id, product.isFavorite);
                        }}
                        disabled={removeFromWishlistMutation.isPending}
                        sx={{
                          color: product.isFavorite ? "#ff4444" : "#ccc",
                          p: { xs: 0.25, md: 0.5 },
                          "&:hover": {
                            backgroundColor: "rgba(255, 68, 68, 0.1)",
                          },
                          "&:disabled": {
                            opacity: 0.6,
                          },
                        }}
                      >
                        {removeFromWishlistMutation.isPending ? (
                          <CircularProgress size={20} />
                        ) : product.isFavorite ? (
                          <Favorite sx={{ fontSize: { xs: 18, md: 20 } }} />
                        ) : (
                          <FavoriteBorder
                            sx={{ fontSize: { xs: 18, md: 20 } }}
                          />
                        )}
                      </IconButton>

                      {/* Action Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          flexGrow: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        {/* Add to Cart Button */}
                        <IconButton
                          disabled={
                            !product.inStock || addToCartMutation.isPending
                          }
                          onClick={(e) =>
                            handleAddToCart(e, product.id, product.title)
                          }
                          sx={{
                            backgroundColor: product.inStock
                              ? "#4caf50"
                              : "#ccc",
                            color: "white",
                            width: { xs: 32, md: 36 },
                            height: { xs: 32, md: 36 },
                            "&:hover": {
                              backgroundColor: product.inStock
                                ? "#45a049"
                                : "#ccc",
                            },
                            "&:disabled": {
                              backgroundColor: "#ccc",
                              color: "white",
                            },
                          }}
                        >
                          {addToCartMutation.isPending ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <ShoppingCart
                              sx={{ fontSize: { xs: 14, md: 16 } }}
                            />
                          )}
                        </IconButton>

                        {/* Buy Button */}
                        <Button
                          variant="contained"
                          disabled={!product.inStock}
                          onClick={(e) => handleBuyClick(e, product.id)}
                          sx={{
                            backgroundColor: product.inStock
                              ? "#ff6b35"
                              : "#ccc",
                            color: "white",
                            fontSize: { xs: "0.65rem", md: "0.7rem" },
                            fontWeight: 600,
                            textTransform: "uppercase",
                            px: { xs: 1.5, md: 2 },
                            py: { xs: 0.5, md: 0.75 },
                            borderRadius: "6px",
                            minWidth: { xs: "45px", md: "55px" },
                            "&:hover": {
                              backgroundColor: product.inStock
                                ? "#e55a2b"
                                : "#ccc",
                            },
                          }}
                        >
                          {product.inStock ? "BUY" : "SOLD OUT"}
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )
        )}
      </Box>

      {/* Snackbar for user feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  );
};

export default FavouritesSection;
