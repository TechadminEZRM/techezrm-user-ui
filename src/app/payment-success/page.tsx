"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  IconButton,
} from "@mui/material";
import {
  CheckCircle,
  Home,
  ShoppingBag,
  Download,
  Receipt,
  LocalShipping,
  Payment,
  Person,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import { useClearCart } from "@/api/handlers/cartHandler";
import axios from "axios";
import { API_CONFIG } from "@/api/config";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import OrderReceiptPDF from "@/components/OrderReceiptPDF";

interface OrderDetails {
  _id: string;
  uniqueId: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  subTotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  shippingAddress: {
    street: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  billingAddress: {
    street: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      description?: string;
    };
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

const PaymentSuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { customer } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Cart mutation for clearing cart
  const { mutate: clearCart } = useClearCart();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Extract customerOrderId from URL
        const customerOrderId = searchParams.get("customerOrderId");
        const orderId = searchParams.get("orderId");
        const orderUniqueId = searchParams.get("orderUniqueId");

        if (!customerOrderId) {
          setError("Order ID not found in URL");
          setLoading(false);
          return;
        }

        // Fetch order details
        const response = await axios.get(
          `${API_CONFIG.baseURL}/public/customer-orders/details/ObjectId/${customerOrderId}`
        );

        if (response?.data?.success) {
          setOrderDetails(response.data.data);

          // Clear cart after successful order
          if (customer?.id) {
            try {
              clearCart(customer.id);
              // toast.success("Cart cleared successfully");
            } catch (cartError) {
              console.error("Error clearing cart:", cartError);
              toast.error("Failed to clear cart");
            }
          }
        } else {
          setError("Failed to fetch order details");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, customer?.id, clearCart]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleViewOrders = () => {
    router.push("/profile?page=orders");
  };

  const handleDownloadPDF = async () => {
    if (!orderDetails) {
      toast.error("Unable to generate PDF");
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // Create a temporary container for PDF generation
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "800px";
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.padding = "20px";
      tempContainer.style.fontFamily = "Arial, sans-serif";

      document.body.appendChild(tempContainer);

      // Create React element and render it
      const { createRoot } = await import("react-dom/client");
      const root = createRoot(tempContainer);

      // Render the PDF component
      root.render(<OrderReceiptPDF orderDetails={orderDetails} />);

      // Wait for rendering to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Configure html2canvas options for better PDF quality
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: tempContainer.scrollWidth,
        height: tempContainer.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);

      // Save the PDF
      const fileName = `order-receipt-${
        orderDetails?.uniqueId || "receipt"
      }.pdf`;
      pdf.save(fileName);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "40vh",
            gap: 2,
          }}
        >
          <CircularProgress size={32} sx={{ color: "#ff6b35" }} />
          <Typography sx={{ color: "#666", fontSize: "0.8rem" }}>
            Processing your order...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!orderDetails) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Order details not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Success Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          backgroundColor: "#f8f9fa",
          border: "1px solid #e9ecef",
          mb: 3,
        }}
      >
        <CheckCircle
          sx={{
            fontSize: 64,
            color: "#28a745",
            mb: 2,
          }}
        />
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#333",
            mb: 1,
          }}
        >
          Payment Successful
        </Typography>
        <Typography
          sx={{
            fontSize: "1rem",
            color: "#666",
          }}
        >
          Order #{orderDetails?.uniqueId || "N/A"}
        </Typography>
      </Paper>

      {/* Two Column Layout */}
      <Box
        sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", lg: "nowrap" } }}
      >
        {/* Left Column */}
        <Box sx={{ flex: 1, minWidth: { xs: "100%", lg: "400px" } }}>
          {/* Order Summary */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #e9ecef",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Receipt sx={{ fontSize: 20, color: "#ff6b35" }} />
              <Typography
                sx={{ fontSize: "1rem", fontWeight: 600, color: "#333" }}
              >
                Order Summary
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
            >
              <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                Subtotal
              </Typography>
              <Typography sx={{ fontSize: "0.9rem", color: "#333" }}>
                ${(orderDetails?.subTotal || 0).toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
            >
              <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                Tax
              </Typography>
              <Typography sx={{ fontSize: "0.9rem", color: "#333" }}>
                ${(orderDetails?.tax || 0).toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}
            >
              <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                Shipping
              </Typography>
              <Typography sx={{ fontSize: "0.9rem", color: "#333" }}>
                ${(orderDetails?.shippingCost || 0).toFixed(2)}
              </Typography>
            </Box>
            {(orderDetails?.discount || 0) > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                  Discount
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", color: "#28a745" }}>
                  -${(orderDetails?.discount || 0).toFixed(2)}
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                sx={{ fontSize: "1.1rem", fontWeight: 600, color: "#333" }}
              >
                Total
              </Typography>
              <Typography
                sx={{ fontSize: "1.1rem", fontWeight: 600, color: "#ff6b35" }}
              >
                ${(orderDetails?.totalAmount || 0).toFixed(2)}
              </Typography>
            </Box>
          </Paper>

          {/* Customer Details */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #e9ecef",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Person sx={{ fontSize: 20, color: "#ff6b35" }} />
              <Typography
                sx={{ fontSize: "1rem", fontWeight: 600, color: "#333" }}
              >
                Customer Details
              </Typography>
            </Box>
            <Box sx={{ mb: 1.5 }}>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "#333",
                  mb: 0.5,
                }}
              >
                {orderDetails?.customer?.name || "N/A"}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Email sx={{ fontSize: 16, color: "#666" }} />
                <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
                  {orderDetails?.customer?.email || "N/A"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone sx={{ fontSize: 16, color: "#666" }} />
                <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
                  {orderDetails?.customer?.phone || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Order Status */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #e9ecef",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Payment sx={{ fontSize: 20, color: "#ff6b35" }} />
              <Typography
                sx={{ fontSize: "1rem", fontWeight: 600, color: "#333" }}
              >
                Order Status
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Chip
                label={orderDetails?.orderStatus || "Unknown"}
                size="medium"
                sx={{
                  fontSize: "0.8rem",
                  height: 28,
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                }}
              />
              <Chip
                label={orderDetails?.paymentStatus || "Unknown"}
                size="medium"
                sx={{
                  fontSize: "0.8rem",
                  height: 28,
                  backgroundColor: "#e8f5e8",
                  color: "#2e7d32",
                }}
              />
              <Chip
                label={orderDetails?.paymentMethod || "Unknown"}
                size="medium"
                sx={{
                  fontSize: "0.8rem",
                  height: 28,
                  backgroundColor: "#fff3e0",
                  color: "#f57c00",
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: 1, minWidth: { xs: "100%", lg: "400px" } }}>
          {/* Shipping Address */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #e9ecef",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <LocationOn sx={{ fontSize: 20, color: "#ff6b35" }} />
              <Typography
                sx={{ fontSize: "1rem", fontWeight: 600, color: "#333" }}
              >
                Shipping Address
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.6 }}
            >
              {orderDetails?.shippingAddress?.street || "N/A"}
              {orderDetails?.shippingAddress?.city && (
                <>
                  <br />
                  {orderDetails.shippingAddress.city}
                  {orderDetails?.shippingAddress?.state &&
                    `, ${orderDetails.shippingAddress.state}`}
                  {orderDetails?.shippingAddress?.postalCode &&
                    ` ${orderDetails.shippingAddress.postalCode}`}
                </>
              )}
              {orderDetails?.shippingAddress?.country && (
                <>
                  <br />
                  {orderDetails.shippingAddress.country}
                </>
              )}
            </Typography>
          </Paper>

          {/* Order Items */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #e9ecef",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <LocalShipping sx={{ fontSize: 20, color: "#ff6b35" }} />
              <Typography
                sx={{ fontSize: "1rem", fontWeight: 600, color: "#333" }}
              >
                Order Items
              </Typography>
            </Box>
            {orderDetails?.items?.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 1,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#333",
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    {item?.product?.name || "N/A"}
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
                    Qty: {item?.quantity || 0} × $
                    {((item?.price || 0) / (item?.quantity || 1)).toFixed(2)}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    color: "#333",
                    fontWeight: 500,
                    ml: 2,
                  }}
                >
                  ${(item?.price || 0).toFixed(2)}
                </Typography>
              </Box>
            )) || (
              <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                No items found
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Home />}
          onClick={handleGoHome}
          sx={{
            flex: 1,
            py: 1.5,
            fontSize: "0.9rem",
            fontWeight: 500,
            textTransform: "none",
            borderColor: "#ddd",
            color: "#666",
            "&:hover": {
              borderColor: "#ccc",
              backgroundColor: "#f9f9f9",
            },
          }}
        >
          Continue Shopping
        </Button>
        <Button
          variant="contained"
          startIcon={<ShoppingBag />}
          onClick={handleViewOrders}
          sx={{
            flex: 1,
            py: 1.5,
            fontSize: "0.9rem",
            fontWeight: 500,
            textTransform: "none",
            backgroundColor: "#ff6b35",
            "&:hover": {
              backgroundColor: "#e55a2b",
            },
          }}
        >
          View Orders
        </Button>
      </Box>

      {/* Download PDF Button */}
      <Button
        variant="outlined"
        startIcon={
          isGeneratingPDF ? <CircularProgress size={16} /> : <Download />
        }
        onClick={handleDownloadPDF}
        disabled={isGeneratingPDF}
        fullWidth
        sx={{
          py: 1.5,
          fontSize: "0.9rem",
          fontWeight: 500,
          textTransform: "none",
          borderColor: "#ff6b35",
          color: "#ff6b35",
          "&:hover": {
            borderColor: "#e55a2b",
            backgroundColor: "rgba(255, 107, 53, 0.04)",
          },
          "&:disabled": {
            borderColor: "#ccc",
            color: "#999",
          },
        }}
      >
        {isGeneratingPDF ? "Generating PDF..." : "Download Order Receipt"}
      </Button>
    </Container>
  );
};

export default PaymentSuccessPage;
