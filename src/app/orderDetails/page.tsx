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
  Modal,
  IconButton,
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
  Close,
  CheckCircle,
  RadioButtonUnchecked,
  AccessTime,
  WhatsApp,
  Support,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { customerOrderService } from "@/api/services/customerOrders";
import type { CustomerOrder } from "@/api/services/customerOrders";

// Custom Status Dot Component
const StatusDot = styled(Box)<{ isActive?: boolean; isCompleted?: boolean }>(
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

  // Map interaction state
  const [mapState, setMapState] = React.useState({
    zoom: 2,
    centerX: 0,
    centerY: 0,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    lastPan: { x: 0, y: 0 },
  });

  // Map interaction functions
  const handleZoomIn = () => {
    setMapState((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + 1, 6),
    }));
  };

  const handleZoomOut = () => {
    setMapState((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - 1, 1),
    }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setMapState((prev) => ({
      ...prev,
      isDragging: true,
      dragStart: { x: e.clientX, y: e.clientY },
    }));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mapState.isDragging) return;

    const deltaX = e.clientX - mapState.dragStart.x;
    const deltaY = e.clientY - mapState.dragStart.y;

    setMapState((prev) => ({
      ...prev,
      centerX: prev.lastPan.x + deltaX,
      centerY: prev.lastPan.y + deltaY,
    }));
  };

  const handleMouseUp = () => {
    setMapState((prev) => ({
      ...prev,
      isDragging: false,
      lastPan: { x: prev.centerX, y: prev.centerY },
    }));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -1 : 1;
    setMapState((prev) => ({
      ...prev,
      zoom: Math.max(1, Math.min(6, prev.zoom + zoomDelta)),
    }));
  };

  // Calculate tile positions based on zoom and pan
  const getTilePositions = () => {
    const tileSize = 256;
    const zoomFactor = Math.pow(2, mapState.zoom);
    const offsetX = mapState.centerX % tileSize;
    const offsetY = mapState.centerY % tileSize;

    return {
      tileSize,
      zoomFactor,
      offsetX,
      offsetY,
    };
  };

  // Invoice functions
  const handleDownloadInvoice = () => {
    setIsInvoiceModalOpen(true);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
      coordinates: [121.4737, 31.2304],
      status: "completed",
      timestamp: "2025-01-15T08:00:00Z",
      description: "Package departed from origin port",
      icon: "🚢",
    },
    {
      id: 2,
      location: "East China Sea",
      coordinates: [122.0, 31.5],
      status: "completed",
      timestamp: "2025-01-16T12:30:00Z",
      description: "In transit across East China Sea",
      icon: "🌊",
    },
    {
      id: 3,
      location: "Dubai Port, UAE",
      coordinates: [55.2708, 25.2048],
      status: "completed",
      timestamp: "2025-01-18T14:45:00Z",
      description: "Arrived at Dubai port for transshipment",
      icon: "🏗️",
    },
    {
      id: 4,
      location: "Arabian Sea",
      coordinates: [65.0, 20.0],
      status: "completed",
      timestamp: "2025-01-19T09:15:00Z",
      description: "Crossing Arabian Sea",
      icon: "🌊",
    },
    {
      id: 5,
      location: "Indian Ocean",
      coordinates: [70.0, 15.0],
      status: "completed",
      timestamp: "2025-01-21T16:20:00Z",
      description: "Transiting through Indian Ocean",
      icon: "🌊",
    },
    {
      id: 6,
      location: "Red Sea",
      coordinates: [40.0, 25.0],
      status: "completed",
      timestamp: "2025-01-23T11:30:00Z",
      description: "Passing through Red Sea",
      icon: "🌊",
    },
    {
      id: 7,
      location: "Suez Canal",
      coordinates: [32.5599, 30.0444],
      status: "completed",
      timestamp: "2025-01-24T08:45:00Z",
      description: "Transiting Suez Canal",
      icon: "🚢",
    },
    {
      id: 8,
      location: "Mediterranean Sea",
      coordinates: [30.0, 35.0],
      status: "completed",
      timestamp: "2025-01-25T13:15:00Z",
      description: "Crossing Mediterranean Sea",
      icon: "🌊",
    },
    {
      id: 9,
      location: "Atlantic Ocean",
      coordinates: [-20.0, 40.0],
      status: "completed",
      timestamp: "2025-01-27T07:30:00Z",
      description: "Crossing Atlantic Ocean",
      icon: "🌊",
    },
    {
      id: 10,
      location: "New York Port, USA",
      coordinates: [-74.006, 40.7128],
      status: "current",
      timestamp: "2025-01-29T15:00:00Z",
      description: "Arrived at destination port",
      icon: "🏭",
    },
    {
      id: 11,
      location: "Customs Clearance",
      coordinates: [-74.006, 40.7128],
      status: "pending",
      timestamp: "2025-01-30T10:00:00Z",
      description: "Pending customs clearance",
      icon: "📋",
    },
    {
      id: 12,
      location: "Local Distribution Center",
      coordinates: [-74.006, 40.7128],
      status: "pending",
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
            onClick={handleDownloadInvoice}
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
        <Modal
          open={isTrackingModalOpen}
          onClose={() => setIsTrackingModalOpen(false)}
          aria-labelledby="tracking-modal-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              width: { xs: "95%", md: "90%", lg: "80%" },
              maxWidth: 1200,
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 3,
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Timeline sx={{ color: "#ff6b35", fontSize: 28 }} />
                <Box>
                  <Typography variant="h5" fontWeight="600" color="#1a365d">
                    Track Your Package
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tracking Number: {order?.trackingNumber}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => setIsTrackingModalOpen(false)}
                sx={{ color: "#666" }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Modal Content */}
            <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {/* Map Section */}
              <Box
                sx={{
                  flex: 1,
                  position: "relative",
                  backgroundColor: "#f0f0f0",
                  minHeight: 400,
                  overflow: "hidden",
                }}
              >
                {/* Interactive Map Container */}
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    backgroundImage: `
                      url('https://tile.openstreetmap.org/${mapState.zoom}/1/1.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/2/1.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/1/2.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/2/2.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/3/1.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/3/2.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/4/1.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/4/2.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/5/1.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/5/2.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/6/1.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/6/2.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/7/1.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/7/2.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/8/1.png'),
                      url('https://tile.openstreetmap.org/${mapState.zoom}/8/2.png')
                    `,
                    backgroundSize: "256px 256px",
                    backgroundPosition: `
                      ${getTilePositions().offsetX}px ${
                      getTilePositions().offsetY
                    }px,
                      ${getTilePositions().offsetX + 256}px ${
                      getTilePositions().offsetY
                    }px,
                      ${getTilePositions().offsetX}px ${
                      getTilePositions().offsetY + 256
                    }px,
                      ${getTilePositions().offsetX + 256}px ${
                      getTilePositions().offsetY + 256
                    }px,
                      ${getTilePositions().offsetX + 512}px ${
                      getTilePositions().offsetY
                    }px,
                      ${getTilePositions().offsetX + 512}px ${
                      getTilePositions().offsetY + 256
                    }px,
                      ${getTilePositions().offsetX + 768}px ${
                      getTilePositions().offsetY
                    }px,
                      ${getTilePositions().offsetX + 768}px ${
                      getTilePositions().offsetY + 256
                    }px,
                      ${getTilePositions().offsetX + 1024}px ${
                      getTilePositions().offsetY
                    }px,
                      ${getTilePositions().offsetX + 1024}px ${
                      getTilePositions().offsetY + 256
                    }px,
                      ${getTilePositions().offsetX + 1280}px ${
                      getTilePositions().offsetY
                    }px,
                      ${getTilePositions().offsetX + 1280}px ${
                      getTilePositions().offsetY + 256
                    }px,
                      ${getTilePositions().offsetX + 1536}px ${
                      getTilePositions().offsetY
                    }px,
                      ${getTilePositions().offsetX + 1536}px ${
                      getTilePositions().offsetY + 256
                    }px,
                      ${getTilePositions().offsetX + 1792}px ${
                      getTilePositions().offsetY
                    }px,
                      ${getTilePositions().offsetX + 1792}px ${
                      getTilePositions().offsetY + 256
                    }px
                    `,
                    backgroundRepeat: "no-repeat",
                    filter: "brightness(0.95) contrast(1.05)",
                    cursor: mapState.isDragging ? "grabbing" : "grab",
                    userSelect: "none",
                    transition: mapState.isDragging
                      ? "none"
                      : "background-position 0.1s ease",
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                >
                  {/* Route Overlay with Real Coordinates */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      background: `
                        radial-gradient(circle at 12% 78%, #ff6b35 10px, transparent 10px),
                        radial-gradient(circle at 88% 22%, #ff6b35 10px, transparent 10px),
                        radial-gradient(circle at 45% 45%, #ff6b35 8px, transparent 8px)
                      `,
                    }}
                  />

                  {/* Animated Route Line */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "75%",
                      height: "4px",
                      background:
                        "linear-gradient(90deg, #ff6b35 0%, #e55a2b 100%)",
                      transform: "rotate(-12deg)",
                      left: "12%",
                      top: "45%",
                      boxShadow: "0 0 15px rgba(255, 107, 53, 0.8)",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)",
                        animation: "shimmer 2.5s infinite",
                      },
                    }}
                  />

                  {/* Shanghai Port (31.2304° N, 121.4737° E) */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: "12%",
                      top: "78%",
                      transform: "translate(-50%, -50%)",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translate(-50%, -50%) scale(1.15)",
                        transition: "transform 0.3s ease",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        backgroundColor: "#ff6b35",
                        border: "5px solid white",
                        boxShadow:
                          "0 8px 25px rgba(0,0,0,0.5), 0 0 0 12px rgba(255, 107, 53, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        animation: "pulse 2s infinite",
                        transition: "all 0.3s ease",
                      }}
                    >
                      🚢
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        mt: 2,
                        backgroundColor: "rgba(255,255,255,0.98)",
                        px: 2.5,
                        py: 1,
                        borderRadius: 3,
                        fontSize: "13px",
                        fontWeight: 700,
                        boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                        border: "2px solid rgba(255, 107, 53, 0.4)",
                        backdropFilter: "blur(15px)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Shanghai Port
                    </Typography>
                  </Box>

                  {/* Dubai Port (25.2048° N, 55.2708° E) */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: "45%",
                      top: "45%",
                      transform: "translate(-50%, -50%)",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translate(-50%, -50%) scale(1.15)",
                        transition: "transform 0.3s ease",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        backgroundColor: "#ff6b35",
                        border: "5px solid white",
                        boxShadow:
                          "0 8px 25px rgba(0,0,0,0.5), 0 0 0 12px rgba(255, 107, 53, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        animation: "pulse 2s infinite",
                        transition: "all 0.3s ease",
                      }}
                    >
                      🏗️
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        mt: 2,
                        backgroundColor: "rgba(255,255,255,0.98)",
                        px: 2.5,
                        py: 1,
                        borderRadius: 3,
                        fontSize: "13px",
                        fontWeight: 700,
                        boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                        border: "2px solid rgba(255, 107, 53, 0.4)",
                        backdropFilter: "blur(15px)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Dubai Port
                    </Typography>
                  </Box>

                  {/* New York Port (40.6892° N, 74.0445° W) */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: "88%",
                      top: "22%",
                      transform: "translate(-50%, -50%)",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translate(-50%, -50%) scale(1.15)",
                        transition: "transform 0.3s ease",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        backgroundColor: "#ff6b35",
                        border: "5px solid white",
                        boxShadow:
                          "0 8px 25px rgba(0,0,0,0.5), 0 0 0 12px rgba(255, 107, 53, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        animation: "pulse 2s infinite",
                        transition: "all 0.3s ease",
                      }}
                    >
                      🏭
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        mt: 2,
                        backgroundColor: "rgba(255,255,255,0.98)",
                        px: 2.5,
                        py: 1,
                        borderRadius: 3,
                        fontSize: "13px",
                        fontWeight: 700,
                        boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                        border: "2px solid rgba(255, 107, 53, 0.4)",
                        backdropFilter: "blur(15px)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      New York Port
                    </Typography>
                  </Box>

                  {/* Current Position (Mid-Atlantic) */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: "65%",
                      top: "35%",
                      transform: "translate(-50%, -50%)",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translate(-50%, -50%) scale(1.25)",
                        transition: "transform 0.3s ease",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: "#4CAF50",
                        border: "5px solid white",
                        boxShadow:
                          "0 0 30px rgba(76, 175, 80, 1), 0 0 0 15px rgba(76, 175, 80, 0.3)",
                        animation: "pulse 1.5s infinite",
                        transition: "all 0.3s ease",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        mt: 2,
                        backgroundColor: "rgba(76, 175, 80, 0.98)",
                        color: "white",
                        px: 2,
                        py: 0.8,
                        borderRadius: 3,
                        fontSize: "12px",
                        fontWeight: 700,
                        boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                        backdropFilter: "blur(15px)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Current Position
                    </Typography>
                  </Box>

                  {/* Map Controls */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      onClick={handleZoomIn}
                      sx={{
                        width: 45,
                        height: 45,
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,1)",
                          transform: "scale(1.08)",
                          transition: "all 0.2s ease",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        +
                      </Typography>
                    </Box>
                    <Box
                      onClick={handleZoomOut}
                      sx={{
                        width: 45,
                        height: 45,
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,1)",
                          transform: "scale(1.08)",
                          transition: "all 0.2s ease",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        −
                      </Typography>
                    </Box>
                  </Box>

                  {/* Zoom Level Indicator */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 15,
                      left: 15,
                      backgroundColor: "rgba(255,255,255,0.95)",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      fontSize: "12px",
                      color: "#555",
                      backdropFilter: "blur(15px)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      fontWeight: 600,
                    }}
                  >
                    Zoom: {mapState.zoom}x
                  </Box>

                  {/* Map Attribution */}
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      bottom: 15,
                      right: 15,
                      backgroundColor: "rgba(255,255,255,0.95)",
                      px: 2,
                      py: 0.8,
                      borderRadius: 2,
                      fontSize: "11px",
                      color: "#555",
                      backdropFilter: "blur(15px)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      fontWeight: 500,
                    }}
                  >
                    © OpenStreetMap contributors
                  </Typography>
                </Box>
              </Box>

              {/* Tracking Points List */}
              <Box
                sx={{
                  width: 400,
                  borderLeft: "1px solid #e0e0e0",
                  overflowY: "auto",
                  backgroundColor: "#fafafa",
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                    Tracking History
                  </Typography>

                  {/* Vertical Timeline */}
                  <Box sx={{ position: "relative" }}>
                    {/* Timeline Line */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: 20,
                        top: 20,
                        bottom: 20,
                        width: 2,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 1,
                      }}
                    />

                    {trackingData.map((point, index) => (
                      <Box key={point.id} sx={{ mb: 3, position: "relative" }}>
                        {/* Timeline Dot */}
                        <Box
                          sx={{
                            position: "absolute",
                            left: 11,
                            top: 15,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: "white",
                            border: `3px solid ${
                              point.status === "completed"
                                ? "#4CAF50"
                                : point.status === "current"
                                ? "#ff6b35"
                                : "#e0e0e0"
                            }`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          {point.status === "completed" ? (
                            <CheckCircle
                              sx={{ fontSize: 12, color: "#4CAF50" }}
                            />
                          ) : point.status === "current" ? (
                            <AccessTime
                              sx={{ fontSize: 12, color: "#ff6b35" }}
                            />
                          ) : (
                            <RadioButtonUnchecked
                              sx={{ fontSize: 12, color: "#e0e0e0" }}
                            />
                          )}
                        </Box>

                        {/* Content Card */}
                        <Box
                          sx={{
                            ml: 5,
                            p: 2,
                            backgroundColor: "white",
                            borderRadius: 1,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            border:
                              point.status === "current"
                                ? "2px solid #ff6b35"
                                : "1px solid #e0e0e0",
                            position: "relative",
                          }}
                        >
                          {/* Arrow pointing to timeline */}
                          <Box
                            sx={{
                              position: "absolute",
                              left: -8,
                              top: 15,
                              width: 0,
                              height: 0,
                              borderTop: "8px solid transparent",
                              borderBottom: "8px solid transparent",
                              borderRight: "8px solid white",
                              zIndex: 1,
                            }}
                          />

                          <Typography
                            variant="subtitle2"
                            fontWeight="600"
                            sx={{ mb: 0.5 }}
                          >
                            {point.location}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {point.description}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatDate(point.timestamp)}
                            </Typography>
                            <Chip
                              label={point.status}
                              size="small"
                              color={
                                point.status === "completed"
                                  ? "success"
                                  : point.status === "current"
                                  ? "warning"
                                  : "default"
                              }
                              variant={
                                point.status === "pending"
                                  ? "outlined"
                                  : "filled"
                              }
                            />
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Modal>

        {/* Invoice Modal */}
        <Modal
          open={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box
            className="invoice-print"
            sx={{
              width: "100%",
              maxWidth: "210mm", // A4 width
              height: "297mm", // A4 height
              maxHeight: "90vh",
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 24,
              overflow: "auto",
              position: "relative",
            }}
          >
            {/* Invoice Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                p: 4,
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="700"
                  color="#1a365d"
                  sx={{ mb: 1 }}
                >
                  INVOICE
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Invoice #: {order?.uniqueId}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Date: {order && formatDate(order.createdAt)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color="#ff6b35"
                  sx={{ mb: 2 }}
                >
                  EZRM
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your Trusted Partner
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: support@ezrm.com
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: +1 (555) 123-4567
                </Typography>
              </Box>
            </Box>

            {/* Customer Information */}
            <Box sx={{ p: 4 }}>
              <Typography
                variant="h6"
                fontWeight="600"
                color="#1a365d"
                sx={{ mb: 2 }}
              >
                Bill To:
              </Typography>
              {isCustomerObject(order?.customer) ? (
                <Box>
                  <Typography variant="body1" fontWeight="600">
                    {order.customer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.customer.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.customer.phone}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Customer ID: {order?.customer}
                </Typography>
              )}
            </Box>

            {/* Order Items Table */}
            <Box sx={{ p: 4, pt: 0 }}>
              <TableContainer
                component={Paper}
                sx={{ boxShadow: "none", border: "1px solid #e0e0e0" }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: "#1a365d" }}>
                        Description
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: 600, color: "#1a365d" }}
                      >
                        Quantity
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 600, color: "#1a365d" }}
                      >
                        Unit Price
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 600, color: "#1a365d" }}
                      >
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order?.items.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Typography variant="body1" fontWeight="500">
                            Product Item
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Item #{index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body1">
                            {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1">
                            ₹{item.price.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" fontWeight="600">
                            ₹{item.total.toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Order Summary */}
            <Box sx={{ p: 4, pt: 0 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Box sx={{ width: "300px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Subtotal:
                    </Typography>
                    <Typography variant="body1">
                      ₹{order?.subTotal?.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Shipping:
                    </Typography>
                    <Typography variant="body1">
                      ₹{order?.shippingCost?.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Tax:
                    </Typography>
                    <Typography variant="body1">
                      ₹{order?.tax?.toFixed(2)}
                    </Typography>
                  </Box>
                  {order?.discount && order.discount > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Discount:
                      </Typography>
                      <Typography variant="body1" color="success.main">
                        -₹{order.discount.toFixed(2)}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h6" fontWeight="600" color="#1a365d">
                      Total:
                    </Typography>
                    <Typography variant="h6" fontWeight="600" color="#ff6b35">
                      ₹{order?.totalAmount?.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Payment Information */}
            <Box sx={{ p: 4, pt: 0 }}>
              <Typography
                variant="h6"
                fontWeight="600"
                color="#1a365d"
                sx={{ mb: 2 }}
              >
                Payment Information
              </Typography>
              <Box sx={{ display: "flex", gap: 4 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Payment Method:
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {order?.paymentMethod
                      ?.replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Payment Status:
                  </Typography>
                  <Chip
                    label={order?.paymentStatus
                      ?.replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    size="small"
                    color={getPaymentStatusColor(order?.paymentStatus)}
                    variant={
                      order?.paymentStatus === "pending" ? "outlined" : "filled"
                    }
                  />
                </Box>
              </Box>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                p: 4,
                backgroundColor: "#f8f9fa",
                borderTop: "1px solid #e0e0e0",
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Thank you for your business!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                For any queries, please contact us at support@ezrm.com
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box
              className="no-print"
              sx={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "white",
                p: 2,
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <IconButton
                onClick={() => setIsInvoiceModalOpen(false)}
                sx={{ color: "#666" }}
              >
                <Close />
              </IconButton>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  sx={{
                    borderColor: "#666",
                    color: "#666",
                    "&:hover": {
                      borderColor: "#333",
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={handlePrintInvoice}
                  sx={{
                    bgcolor: "#ff6b35",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#e55a2b",
                    },
                  }}
                >
                  Download PDF
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>

        {/* Contact Support Modal */}
        <Modal
          open={isContactSupportModalOpen}
          onClose={() => setIsContactSupportModalOpen(false)}
          aria-labelledby="contact-support-modal-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 3,
              width: { xs: "95%", sm: "500px", md: "600px" },
              maxWidth: 600,
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
          >
            {/* Modal Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 3,
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#f8f9fa",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Support sx={{ color: "#ff6b35", fontSize: 28 }} />
                <Box>
                  <Typography variant="h5" fontWeight="600" color="#1a365d">
                    Contact Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We're here to help you
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => setIsContactSupportModalOpen(false)}
                sx={{
                  color: "#666",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Modal Content */}
            <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, textAlign: "center" }}
              >
                Choose your preferred way to get in touch with our support team
              </Typography>

              {/* Contact Options */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                {/* WhatsApp Option */}
                <Button
                  variant="outlined"
                  startIcon={<WhatsApp sx={{ color: "#25D366" }} />}
                  sx={{
                    borderColor: "#25D366",
                    color: "#25D366",
                    textTransform: "none",
                    fontWeight: 600,
                    py: 2,
                    px: 3,
                    borderRadius: 2,
                    flex: { xs: "none", sm: 1 },
                    minWidth: { xs: "100%", sm: "200px" },
                    "&:hover": {
                      borderColor: "#128C7E",
                      backgroundColor: "rgba(37, 211, 102, 0.04)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => {
                    window.open("https://wa.me/+1234567890", "_blank");
                  }}
                >
                  <Box sx={{ textAlign: "left", flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="600">
                      WhatsApp Us
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +1 (234) 567-890
                    </Typography>
                  </Box>
                </Button>

                {/* Email Option */}
                <Button
                  variant="outlined"
                  startIcon={<Email sx={{ color: "#ff6b35" }} />}
                  sx={{
                    borderColor: "#ff6b35",
                    color: "#ff6b35",
                    textTransform: "none",
                    fontWeight: 600,
                    py: 2,
                    px: 3,
                    borderRadius: 2,
                    flex: { xs: "none", sm: 1 },
                    minWidth: { xs: "100%", sm: "200px" },
                    "&:hover": {
                      borderColor: "#e55a2b",
                      backgroundColor: "rgba(255, 107, 53, 0.04)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => {
                    window.open(
                      "mailto:support@ezrm.com?subject=Order Support - Order #" +
                        order?.uniqueId,
                      "_blank"
                    );
                  }}
                >
                  <Box sx={{ textAlign: "left", flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="600">
                      Mail Us
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      support@ezrm.com
                    </Typography>
                  </Box>
                </Button>

                {/* Phone Option */}
                <Button
                  variant="outlined"
                  startIcon={<Phone sx={{ color: "#4CAF50" }} />}
                  sx={{
                    borderColor: "#4CAF50",
                    color: "#4CAF50",
                    textTransform: "none",
                    fontWeight: 600,
                    py: 2,
                    px: 3,
                    borderRadius: 2,
                    flex: { xs: "none", sm: 1 },
                    minWidth: { xs: "100%", sm: "200px" },
                    "&:hover": {
                      borderColor: "#388E3C",
                      backgroundColor: "rgba(76, 175, 80, 0.04)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => {
                    window.open("tel:+1234567890", "_self");
                  }}
                >
                  <Box sx={{ textAlign: "left", flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="600">
                      Call Us Now
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +1 (234) 567-890
                    </Typography>
                  </Box>
                </Button>
              </Box>

              {/* Order Information */}
              {order && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: "#f8f9fa",
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Reference this order when contacting support:
                  </Typography>
                  <Typography variant="body1" fontWeight="600" color="#ff6b35">
                    Order #{order.uniqueId}
                  </Typography>
                </Box>
              )}

              {/* Support Hours */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: "#e3f2fd",
                  borderRadius: 2,
                  border: "1px solid #bbdefb",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="600"
                  color="#1976d2"
                  sx={{ mb: 1 }}
                >
                  Support Hours
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monday - Friday: 9:00 AM - 6:00 PM (EST)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Saturday: 10:00 AM - 4:00 PM (EST)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sunday: Closed
                </Typography>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default OrdersDetail;
