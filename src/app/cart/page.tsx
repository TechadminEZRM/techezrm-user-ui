"use client";
import type React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  Paper,
  Container,
  CircularProgress,
} from "@mui/material";
import {
  ShoppingCartOutlined,
  Login,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import { useCart } from "@/api/handlers/cartHandler";
import CartItems from "./CartItems";
import LoadCalculation from "./LoadCalculation";

const ShoppingCart: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, customer } = useAppStore();
  const [discount, setDiscount] = useState("");

  const {
    data: cartResponse,
    isLoading: cartLoading,
    error: cartError,
    isError: cartIsError,
  } = useCart(customer?.id || "", { enabled: !!customer?.id });

  const handleCheckout = () => router.push("/checkout");
  const handleLogin = () => router.push("/sign_in");
  const handleSignUp = () => router.push("/sign_up");

  // Extract cart data
  const cartData = cartResponse?.data?.cart;
  const cartItems = cartData?.items || [];
  const subtotal = cartData?.totalAmount || 0;
  const total = subtotal;

  // Loading state
  if (cartLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper
          elevation={0}
          sx={{ p: 3, backgroundColor: "white", borderRadius: 2 }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#ff6b35" }} />
          </Box>
        </Paper>
      </Container>
    );
  }

  // Error state
  if (cartIsError) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper
          elevation={0}
          sx={{ p: 3, backgroundColor: "white", borderRadius: 2 }}
        >
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" sx={{ color: "#f44336", mb: 2 }}>
              Error loading cart
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              {cartError instanceof Error
                ? cartError.message
                : "Something went wrong"}
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Authentication fallback UI
  if (!isAuthenticated || !customer) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper
          elevation={0}
          sx={{ p: 3, backgroundColor: "white", borderRadius: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 0,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                backgroundColor: "#fafafa",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
                border: "2px dashed #e0e0e0",
              }}
            >
              <ShoppingCartOutlined sx={{ fontSize: 48, color: "#ff6b35" }} />
            </Box>

            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#333", fontSize: "1.1rem", mb: 1 }}
            >
              Please Login to View Your Cart
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#666",
                fontSize: "0.875rem",
                mb: 4,
                maxWidth: 400,
                lineHeight: 1.6,
              }}
            >
              You need to be signed in to view and manage your shopping cart
              items. Login to your account or create a new one to get started.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={handleLogin}
                startIcon={<Login />}
                sx={{
                  backgroundColor: "#ff6b35",
                  color: "white",
                  px: 4,
                  py: 0.5,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 1,
                  minWidth: 140,
                  "&:hover": { backgroundColor: "#e55a2b" },
                }}
              >
                Login
              </Button>

              <Button
                variant="outlined"
                onClick={handleSignUp}
                sx={{
                  borderColor: "#ff6b35",
                  color: "#ff6b35",
                  px: 4,
                  py: 1,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 1,
                  minWidth: 140,
                  "&:hover": {
                    borderColor: "#e55a2b",
                    backgroundColor: "rgba(255, 107, 53, 0.04)",
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>

            <Box
              sx={{
                mt: 1,
                p: 3,
                backgroundColor: "#fafafa",
                borderRadius: 1,
                maxWidth: 500,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: "0.75rem",
                  lineHeight: 1.45,
                  textAlign: "center",
                }}
              >
                <strong>Why sign in?</strong>
                <br />• Save items for later
                <br />• Track your orders
                <br />• Faster checkout process
                <br />• Access exclusive deals
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper
          elevation={0}
          sx={{ p: 3, backgroundColor: "white", borderRadius: 2 }}
        >
          {/* Enhanced Animated Empty Cart State */}
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
            {/* Animated Shopping Cart Container */}
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
                  background:
                    "linear-gradient(135deg, #fff5f2 0%, #ffe8e0 100%)",
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
                {/* Animated Shopping Cart Icon */}
                <Box
                  sx={{
                    position: "relative",
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "cartBounce 2s ease-in-out infinite",
                    "@keyframes cartBounce": {
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
                  {/* Shopping Cart Icon */}
                  <ShoppingCartIcon
                    sx={{
                      fontSize: "60px",
                      color: "#ff6b35",
                      filter: "drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3))",
                    }}
                  />
                </Box>
              </Box>

              {/* Floating Shopping Items */}
              {[...Array(4)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "absolute",
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#ff6b35",
                    borderRadius: "50%",
                    opacity: 0.6,
                    animation: `floatingItem${
                      index + 1
                    } 4s ease-in-out infinite`,
                    [`@keyframes floatingItem${index + 1}`]: {
                      "0%, 100%": {
                        transform: `translate(${
                          Math.cos(index * 90) * 120
                        }px, ${Math.sin(index * 90) * 120}px)`,
                        opacity: 0,
                      },
                      "50%": {
                        opacity: 0.8,
                      },
                    },
                  }}
                />
              ))}

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
              Your Cart is Empty
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
              Add some amazing products to your cart and they will appear here.
              Start shopping to build your perfect order!
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
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  console.log(cartItems, "cartItems__cartItems");

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 4,
        }}
      >
        {/* Main Cart Content */}
        <Box sx={{ flex: "1" }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* Cart Items */}
            <CartItems cartItems={cartItems} />

            <Divider sx={{ backgroundColor: "#cecece", height: 10 }} />

            {/* Load & Stuffing Calculation Section */}
            <Box sx={{ mt: 4 }}>
              <LoadCalculation />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default ShoppingCart;
