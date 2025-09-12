"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import TrackingModal from "@/components/TrackingModal";
import InvoiceModal from "@/components/InvoiceModal";
import ContactSupportModal from "@/components/ContactSupportModal";

import {
  LocalShipping,
  Receipt,
  Person,
  Email,
  Phone,
  LocationOn,
  AttachMoney,
  Inventory,
  Note,
  Timeline,
  CalendarToday,
  Payment,
  ShoppingCart,
  CheckCircle,
  RadioButtonUnchecked,
  AccessTime,
  Support,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { customerOrderService } from "@/api/services/customerOrders";
import type { CustomerOrder } from "@/api/services/customerOrders";
import { formatDate } from "@/utils/dateUtils";

// Custom Status Dot Component
const StatusDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive" && prop !== "isCompleted",
})<{ isActive?: boolean; isCompleted?: boolean }>(
  ({ isActive, isCompleted }) => ({
    width: 12,
    height: 12,
    borderRadius: "50%",
    backgroundColor: isActive ? "#f5a623" : isCompleted ? "#f5a623" : "#e0e0e0",
    border: isActive ? "2px solid #fff" : "none",
    boxShadow: isActive ? "0 0 0 2px #f5a623" : "none",
  })
);

// CSS Keyframes for animations
const pulseKeyframes = `
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

// Inject the keyframes and print styles into the document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent =
    pulseKeyframes +
    `
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @media print {
        body * {
          visibility: hidden;
        }
        .invoice-print, .invoice-print * {
          visibility: visible;
        }
        .invoice-print {
          position: absolute;
          left: 0;
          top: 0;
          width: 210mm !important;
          height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          overflow: visible !important;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
  document.head.appendChild(style);
}

interface OrdersDetailProps {
  orderId?: string;
}

const OrdersDetail: React.FC<OrdersDetailProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, customer } = useAppStore();

  const orderId = searchParams.get("orderId");
  const [isTrackingModalOpen, setIsTrackingModalOpen] = React.useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState(false);
  const [isContactSupportModalOpen, setIsContactSupportModalOpen] =
    React.useState(false);

  // Tracking points data
  const trackingPoints = [
    {
      lat: 31.2304,
      lng: 121.4737,
      icon: "🚢",
      label: "Shanghai Port",
      status: "completed" as const,
    },
    {
      lat: 25.2048,
      lng: 55.2708,
      icon: "🏗️",
      label: "Dubai Port",
      status: "current" as const,
    },
    {
      lat: 40.6892,
      lng: -74.0445,
      icon: "🏭",
      label: "New York Port",
      status: "pending" as const,
    },
  ];

  // Fetch order details
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => customerOrderService.getCustomerOrder(orderId!),
    enabled: !!orderId && !!isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated || !customer) {
      router.push("/sign_in");
    }
  }, [isAuthenticated, customer, router]);

  // Show loading or redirect if not authenticated
  if (!isAuthenticated || !customer) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography>Redirecting to login...</Typography>
      </Box>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#ff6b35" }} />
        <Typography>Loading order details...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error ? "Failed to load order details" : "Order not found"}
        </Alert>
        <Button
          variant="contained"
          onClick={() => router.push("/my_orders")}
          sx={{
            backgroundColor: "#ff6b35",
            "&:hover": { backgroundColor: "#e55a2b" },
          }}
        >
          Back to My Orders
        </Button>
      </Container>
    );
  }

  // Format payment method
  const formatPaymentMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case "cod":
        return "Cash on Delivery";
      case "upi":
        return "UPI Payment";
      case "credit_card":
        return "Credit Card";
      case "netbanking":
        return "Net Banking";
      default:
        return method
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "processing":
        return "warning";
      case "confirmed":
        return "info";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "processing":
        return "warning";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      case "refunded":
        return "info";
      default:
        return "default";
    }
  };

  // Check if customer is object
  const isCustomerObject = (
    customer: any
  ): customer is { name: string; email: string; phone: string } => {
    return customer && typeof customer === "object" && customer.name;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getOrderStatusProgress = (status: string) => {
    const statusMap = {
      pending: 0,
      confirmed: 0,
      processing: 1,
      shipped: 2,
      delivered: 3,
      cancelled: 0,
    };
    return statusMap[status as keyof typeof statusMap] || 0;
  };

  // Tracking data for the modal
  const trackingData = [
    {
      id: 1,
      location: "Shanghai Port, China",
      coordinates: [121.4737, 31.2304] as [number, number],
      status: "completed" as const,
      timestamp: "2025-01-15T08:00:00Z",
      description: "Package departed from origin port",
      icon: "🚢",
    },
    {
      id: 2,
      location: "East China Sea",
      coordinates: [122.0, 31.5] as [number, number],
      status: "completed" as const,
      timestamp: "2025-01-16T12:30:00Z",
      description: "In transit across East China Sea",
      icon: "🌊",
    },
    {
      id: 3,
      location: "Dubai Port, UAE",
      coordinates: [55.2708, 25.2048] as [number, number],
      status: "completed" as const,
      timestamp: "2025-01-18T14:45:00Z",
      description: "Arrived at Dubai port for transshipment",
      icon: "🏗️",
    },
    {
      id: 4,
      location: "Arabian Sea",
      coordinates: [65.0, 20.0] as [number, number],
      status: "completed" as const,
      timestamp: "2025-01-19T09:15:00Z",
      description: "Crossing Arabian Sea",
      icon: "🌊",
    },
    {
      id: 5,
      location: "Indian Ocean",
      coordinates: [70.0, 15.0] as [number, number],
      status: "completed" as const,
      timestamp: "2025-01-21T16:20:00Z",
      description: "Transiting through Indian Ocean",
      icon: "🌊",
    },
    {
      id: 6,
      location: "Red Sea",
      coordinates: [40.0, 25.0] as [number, number],
      status: "completed" as const,
      timestamp: "2025-01-23T11:30:00Z",
      description: "Passing through Red Sea",
      icon: "🌊",
    },
    {
      id: 7,
      location: "Suez Canal",
      coordinates: [32.5599, 30.0444] as [number, number],
      status: "completed" as const,
      timestamp: "2025-01-24T08:45:00Z",
      description: "Transiting Suez Canal",
      icon: "🚢",
    },
    {
      id: 8,
      location: "Mediterranean Sea",
      coordinates: [30.0, 35.0] as [number, number],
      status: "completed" as const,
      timestamp: "2025-01-25T13:15:00Z",
      description: "Crossing Mediterranean Sea",
      icon: "🌊",
    },
    {
      id: 9,
      location: "Atlantic Ocean",
      coordinates: [-20.0, 40.0] as [number, number],
      status: "completed" as const,
      timestamp: "2025-01-27T07:30:00Z",
      description: "Crossing Atlantic Ocean",
      icon: "🌊",
    },
    {
      id: 10,
      location: "New York Port, USA",
      coordinates: [-74.006, 40.7128] as [number, number],
      status: "current" as const,
      timestamp: "2025-01-29T15:00:00Z",
      description: "Arrived at destination port",
      icon: "🏭",
    },
    {
      id: 11,
      location: "Customs Clearance",
      coordinates: [-74.006, 40.7128] as [number, number],
      status: "pending" as const,
      timestamp: "2025-01-30T10:00:00Z",
      description: "Pending customs clearance",
      icon: "📋",
    },
    {
      id: 12,
      location: "Local Distribution Center",
      coordinates: [-74.006, 40.7128] as [number, number],
      status: "pending" as const,
      timestamp: "2025-02-01T14:00:00Z",
      description: "En route to local distribution center",
      icon: "🏪",
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        {/* Header with Back Button */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => router.push("/my_orders")}
            sx={{
              mr: 2,
              borderColor: "#ff6b35",
              color: "#ff6b35",
              "&:hover": {
                borderColor: "#e55a2b",
                backgroundColor: "rgba(255, 107, 53, 0.04)",
              },
            }}
          >
            ← Back to Orders
          </Button>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#333",
              fontSize: "24px",
            }}
          >
            Order Details
          </Typography>
        </Box>

        {/* Order Header Card */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Receipt sx={{ color: "#ff6b35", fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight="700" color="#1a365d">
                    Order #{order.uniqueId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placed on {formatDate(order.createdAt)}
                  </Typography>
                </Box>
              </Box>
            }
            action={
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  label={order.orderStatus
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  color={getStatusColor(order.orderStatus) as any}
                  size="small"
                />
                <Chip
                  label={`Payment ${order.paymentStatus}`}
                  color={getPaymentStatusColor(order.paymentStatus) as any}
                  size="small"
                  variant="outlined"
                />
              </Box>
            }
          />
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Timeline sx={{ color: "#ff6b35", fontSize: 20 }} />
                  <Typography variant="body2" fontWeight="600">
                    Tracking Number
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  fontFamily="monospace"
                  color="primary"
                  sx={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "#e55a2b",
                    },
                  }}
                  onClick={() => setIsTrackingModalOpen(true)}
                >
                  {order.trackingNumber || "Not Available"}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <CalendarToday sx={{ color: "#ff6b35", fontSize: 20 }} />
                  <Typography variant="body2" fontWeight="600">
                    Estimated Delivery
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {formatDate(order.estimatedDelivery)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Customer Information */}
        {isCustomerObject(order.customer) && (
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardHeader
              title={
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Person sx={{ color: "#ff6b35", fontSize: 24 }} />
                  <Typography variant="h6" fontWeight="600">
                    Customer Information
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Person sx={{ color: "#ff6b35", fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="600">
                      Name
                    </Typography>
                  </Box>
                  <Typography variant="body1">{order.customer.name}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Email sx={{ color: "#ff6b35", fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="600">
                      Email
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {order.customer.email}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Phone sx={{ color: "#ff6b35", fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="600">
                      Phone
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {order.customer.phone}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Order Status Tracking */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocalShipping sx={{ color: "#ff6b35", fontSize: 24 }} />
                <Typography variant="h6" fontWeight="600">
                  Order Status Tracking
                </Typography>
              </Box>
            }
          />
          <CardContent>
            <Box sx={{ position: "relative", py: 2 }}>
              {/* Progress line */}
              <Box
                sx={{
                  position: "absolute",
                  top: "6px",
                  left: "calc(12.5% + 6px)",
                  width: `calc(75% * ${
                    Math.max(0, getOrderStatusProgress(order.orderStatus)) / 3
                  })`,
                  height: "2px",
                  backgroundColor: "#ff6b35",
                  zIndex: 1,
                  transition: "width 0.3s ease",
                }}
              />

              {/* Status circles */}
              {["confirmed", "processing", "shipped", "delivered"].map(
                (status, index) => {
                  const currentStatusIndex = getOrderStatusProgress(
                    order.orderStatus
                  );
                  const isActive = index === currentStatusIndex;
                  const isCompleted = index < currentStatusIndex;

                  return (
                    <Box
                      key={status}
                      sx={{
                        display: "inline-block",
                        width: "25%",
                        textAlign: "center",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      <StatusDot
                        isActive={isActive}
                        isCompleted={isCompleted}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 1,
                          textAlign: "center",
                          fontWeight: 500,
                          color: isActive
                            ? "#ff6b35"
                            : isCompleted
                            ? "#667085"
                            : "#bdbdbd",
                          fontSize: "12px",
                          display: "block",
                        }}
                      >
                        {status
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(102, 112, 133, 1)",
                          textAlign: "center",
                          fontSize: "11px",
                          display: "block",
                        }}
                      >
                        {formatDate(order.createdAt)}
                      </Typography>
                    </Box>
                  );
                }
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ShoppingCart sx={{ color: "#ff6b35", fontSize: 24 }} />
                <Typography variant="h6" fontWeight="600">
                  Order Items
                </Typography>
              </Box>
            }
          />
          <CardContent>
            {order.items.map((item, index) => (
              <Box key={item._id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    backgroundColor: "#fafafa",
                    borderRadius: 1,
                    mb: index < order.items.length - 1 ? 2 : 0,
                  }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: "#ff6b35",
                      mr: 2,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    P
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="600">
                      Product Item
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity} × {formatCurrency(item.price)}
                    </Typography>
                    {item.discount > 0 && (
                      <Typography variant="body2" color="success.main">
                        Discount: {formatCurrency(item.discount)}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="h6" fontWeight="700" color="primary">
                      {formatCurrency(item.total)}
                    </Typography>
                  </Box>
                </Box>
                {index < order.items.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Order Notes */}
        {order.notes && (
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardHeader
              title={
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Note sx={{ color: "#ff6b35", fontSize: 24 }} />
                  <Typography variant="h6" fontWeight="600">
                    Order Notes
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                {order.notes}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Addresses */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            mb: 3,
          }}
        >
          {/* Shipping Address */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ borderRadius: 2, height: "100%" }}>
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <LocalShipping sx={{ color: "#ff6b35", fontSize: 24 }} />
                    <Typography variant="h6" fontWeight="600">
                      Shipping Address
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <LocationOn sx={{ color: "#ff6b35", fontSize: 20 }} />
                  <Typography variant="body2" fontWeight="600">
                    Delivery Address
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {order.shippingAddress.street}
                </Typography>
                <Typography variant="body1">
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </Typography>
                <Typography variant="body1">
                  {order.shippingAddress.country} -{" "}
                  {order.shippingAddress.zipCode}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Billing Address */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ borderRadius: 2, height: "100%" }}>
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Receipt sx={{ color: "#ff6b35", fontSize: 24 }} />
                    <Typography variant="h6" fontWeight="600">
                      Billing Address
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <LocationOn sx={{ color: "#ff6b35", fontSize: 20 }} />
                  <Typography variant="body2" fontWeight="600">
                    Invoice Address
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {order.billingAddress.street}
                </Typography>
                <Typography variant="body1">
                  {order.billingAddress.city}, {order.billingAddress.state}
                </Typography>
                <Typography variant="body1">
                  {order.billingAddress.country} -{" "}
                  {order.billingAddress.zipCode}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Payment & Financial Summary */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            mb: 3,
          }}
        >
          {/* Payment Information */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ borderRadius: 2, height: "100%" }}>
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Payment sx={{ color: "#ff6b35", fontSize: 24 }} />
                    <Typography variant="h6" fontWeight="600">
                      Payment Information
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <AttachMoney sx={{ color: "#ff6b35", fontSize: 20 }} />
                  <Typography variant="body2" fontWeight="600">
                    Payment Method
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatPaymentMethod(order.paymentMethod)}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" fontWeight="600">
                    Payment Status:
                  </Typography>
                  <Chip
                    label={order.paymentStatus
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    color={getPaymentStatusColor(order.paymentStatus) as any}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Financial Summary */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ borderRadius: 2, height: "100%" }}>
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <AttachMoney sx={{ color: "#ff6b35", fontSize: 24 }} />
                    <Typography variant="h6" fontWeight="600">
                      Order Summary
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Subtotal"
                      secondary={formatCurrency(order.subTotal)}
                    />
                  </ListItem>
                  {order.discount > 0 && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary="Discount"
                        secondary={`- ${formatCurrency(order.discount)}`}
                        secondaryTypographyProps={{ color: "success.main" }}
                      />
                    </ListItem>
                  )}
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Shipping Cost"
                      secondary={formatCurrency(order.shippingCost)}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Tax"
                      secondary={formatCurrency(order.tax)}
                    />
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Total Amount"
                      secondary={formatCurrency(order.totalAmount)}
                      primaryTypographyProps={{ fontWeight: 600 }}
                      secondaryTypographyProps={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: "primary.main",
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<Receipt />}
            sx={{
              borderColor: "#e0e0e0",
              color: "#424242",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              "&:hover": {
                borderColor: "#bdbdbd",
                backgroundColor: "rgba(0,0,0,0.04)",
              },
              borderRadius: "8px",
            }}
            onClick={() => setIsInvoiceModalOpen(true)}
          >
            Download Invoice
          </Button>
          <Button
            variant="contained"
            startIcon={<Support />}
            sx={{
              bgcolor: "#ff6b35",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              "&:hover": { bgcolor: "#e55a2b" },
              borderRadius: "8px",
            }}
            onClick={() => setIsContactSupportModalOpen(true)}
          >
            Contact Support
          </Button>
        </Box>

        {/* Tracking Modal */}
        <TrackingModal
          open={isTrackingModalOpen}
          onClose={() => setIsTrackingModalOpen(false)}
          trackingNumber={order?.trackingNumber}
          trackingData={trackingData}
          trackingPoints={trackingPoints}
        />

        {/* Invoice Modal */}
        <InvoiceModal
          open={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          order={order}
        />

        {/* Contact Support Modal */}
        <ContactSupportModal
          open={isContactSupportModalOpen}
          onClose={() => setIsContactSupportModalOpen(false)}
        />
      </Container>
    </Box>
  );
};

export default OrdersDetail;
