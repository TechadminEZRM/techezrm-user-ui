"use client";

import type React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  AccountBalanceWallet,
  Inventory2Outlined,
  ArrowForward,
} from "@mui/icons-material";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAppStore } from "@/store/use-app-store";
import { useCustomerOrders } from "@/api/handlers";
import type { CustomerOrder } from "@/api/services";
import { useRouter } from "next/navigation";
interface OrderCardProps {
  order: CustomerOrder;
  onViewDetails: () => void;
  onBuyAgain?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onBuyAgain }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status display text
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusText = (orderStatus: string, _paymentStatus: string) => {
    if (orderStatus === "delivered") return "Order Delivered";
    if (orderStatus === "cancelled") return "Order Cancelled";
    if (orderStatus === "shipped") return "Order Shipped";
    if (orderStatus === "processing") return "Order Processing";
    if (orderStatus === "confirmed") return "Order Confirmed";
    return "Order In Progress";
  };

  // Get status badges
  const getStatusBadges = (orderStatus: string, paymentStatus: string) => {
    const badges: Array<{
      label: string;
      color: "success" | "error" | "info" | "warning";
    }> = [];

    // Order status badge
    if (orderStatus === "delivered") {
      badges.push({ label: "Delivered", color: "success" });
    } else if (orderStatus === "cancelled") {
      badges.push({ label: "Cancelled", color: "error" });
    } else if (orderStatus === "shipped") {
      badges.push({ label: "Shipped", color: "info" });
    } else if (orderStatus === "processing") {
      badges.push({ label: "Processing", color: "info" });
    } else if (orderStatus === "confirmed") {
      badges.push({ label: "Confirmed", color: "info" });
    } else {
      badges.push({ label: "Pending", color: "warning" });
    }

    // Payment status badge
    if (paymentStatus === "pending") {
      badges.push({ label: "Payment Pending", color: "warning" });
    } else if (paymentStatus === "processing") {
      badges.push({ label: "Payment Processing", color: "info" });
    } else if (paymentStatus === "failed") {
      badges.push({ label: "Payment Failed", color: "error" });
    } else if (paymentStatus === "completed") {
      badges.push({ label: "Paid", color: "success" });
    } else if (paymentStatus === "refunded") {
      badges.push({ label: "Refunded", color: "warning" });
    }

    return badges;
  };

  // Format payment method
  const formatPaymentMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case "cod":
        return "Cash on Delivery";
      case "upi":
        return "UPI Payment";
      case "card":
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

  const statusBadges = getStatusBadges(order.orderStatus, order.paymentStatus);
  const canBuyAgain = order.orderStatus === "delivered";
  const router = useRouter();
  const handleDetailClick = () => {
    router.push(`/orderDetails?orderId=${order.uniqueId}`);
  };
  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "12px",
        p: 3,
        mb: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #f0f0f0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        {/* Left Section - Order Status and Date */}
        <Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#333",
              mb: 0.5,
            }}
          >
            {getStatusText(order.orderStatus, order.paymentStatus)}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#666",
            }}
          >
            {formatDate(order.createdAt)}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              color: "#999",
              mt: 0.5,
            }}
          >
            Order ID: {order.uniqueId}
          </Typography>
        </Box>

        {/* Right Section - View Order Details */}
        <Button
          endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
          onClick={handleDetailClick}
          sx={{
            color: "#333",
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          View Order Details
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Payment Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AccountBalanceWallet sx={{ fontSize: 20, color: "#666" }} />
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#333",
              }}
            >
              ${order.totalAmount.toLocaleString()}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#666",
              }}
            >
              {formatPaymentMethod(order.paymentMethod)}
            </Typography>
          </Box>
        </Box>

        {/* Items Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Inventory2Outlined sx={{ fontSize: 20, color: "#666" }} />
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#333",
              }}
            >
              Items
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#666",
              }}
            >
              {order.items.reduce((total, item) => total + item.quantity, 0)}x
            </Typography>
          </Box>
        </Box>

        {/* Status Badges */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {statusBadges.map((badge, index) => (
            <Chip
              key={index}
              label={badge.label}
              size="small"
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                height: "28px",
                backgroundColor:
                  badge.color === "success"
                    ? "#e8f5e8"
                    : badge.color === "error"
                    ? "#ffeaea"
                    : badge.color === "info"
                    ? "#e3f2fd"
                    : badge.color === "warning"
                    ? "#fff3e0"
                    : "#f5f5f5",
                color:
                  badge.color === "success"
                    ? "#2e7d32"
                    : badge.color === "error"
                    ? "#d32f2f"
                    : badge.color === "info"
                    ? "#1976d2"
                    : badge.color === "warning"
                    ? "#f57c00"
                    : "#666",
                border: `1px solid ${
                  badge.color === "success"
                    ? "#c8e6c9"
                    : badge.color === "error"
                    ? "#ffcdd2"
                    : badge.color === "info"
                    ? "#bbdefb"
                    : badge.color === "warning"
                    ? "#ffcc02"
                    : "#e0e0e0"
                }`,
                "& .MuiChip-label": {
                  px: 1.5,
                },
              }}
            />
          ))}
          {canBuyAgain && onBuyAgain && (
            <Chip
              label="Buy Again"
              size="small"
              onClick={onBuyAgain}
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                height: "28px",
                backgroundColor: "#fff3e0",
                color: "#f57c00",
                border: "1px solid #ffcc02",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#ffe0b2",
                },
                "& .MuiChip-label": {
                  px: 1.5,
                },
              }}
            />
          )}
        </Box>
      </Box>

      {/* Product Images */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: 3,
          flexWrap: "wrap",
          backgroundColor: "#FAF8F9",
          borderRadius: "18px",
        }}
      >
        {order.items.slice(0, 6).map((item, index) => (
          <Box
            key={index}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              m: 1,
              p: 1,
            }}
          >
            <Image
              src="/orange.png"
              alt={`Product ${index + 1}`}
              width={40}
              height={40}
              style={{
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Box>
        ))}
        {order.items.length > 6 && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "8px",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              m: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#666",
              }}
            >
              +{order.items.length - 6}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const OrdersPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { customer } = useAppStore();

  // Get filter based on active tab
  const getOrderStatusFilter = () => {
    switch (activeTab) {
      case 1:
        return "pending";  // processing,confirmed,shipped
      case 2:
        return "delivered";
      case 3:
        return "cancelled";
      default:
        return undefined; // All orders
    }
  };

  const {
    data: response,
    isLoading,
    error,
    isError,
  } = useCustomerOrders(customer?.id || "", {
    orderStatus: getOrderStatusFilter(),
    limit: 20,
    activeTab: activeTab,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const orders = response?.data?.orders || [];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ color: "#ff6b35", mb: 2 }} />
            <Typography sx={{ color: "#666" }}>
              Loading your orders...
            </Typography>
          </Box>
        </Box>
      </ProtectedRoute>
    );
  }

  if (isError) {
    return (
      <ProtectedRoute>
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Alert severity="error" sx={{ maxWidth: 500 }}>
            <Typography variant="h6">Error loading orders</Typography>
            <Typography variant="body2">
              {error instanceof Error ? error.message : "Something went wrong"}
            </Typography>
          </Alert>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        }}
      >
        {/* Header */}
        {/* <Box
          sx={{
            backgroundColor: "white",
            borderBottom: "1px solid #e0e0e0",
            px: 3,
            py: 2,
          }}
        > */}
        {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          > */}
        {/* <IconButton
              onClick={onBack}
              sx={{
                p: 1,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <ArrowBack sx={{ fontSize: 20, color: "#666" }} />
            </IconButton> */}
        {/* <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#666",
              }}
            >
              My Orders
            </Typography> */}
        {/* </Box> */}
        {/* </Box> */}

        {/* Tabs */}
        <Box
          sx={{
            backgroundColor: "white",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              px: 3,
              "& .MuiTabs-indicator": {
                backgroundColor: "#ff6b35",
                height: 3,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                color: "#666",
                minWidth: "auto",
                px: 0,
                mr: 4,
                "&.Mui-selected": {
                  color: "#ff6b35",
                  fontWeight: 600,
                },
              },
            }}
          >
            <Tab label={`All Orders (${response?.data?.totalCountTabWise?.total || 0})`} />
            <Tab
                label={`In Progress (${
                  (response?.data?.totalCountTabWise?.pending || 0) +
                  (response?.data?.totalCountTabWise?.processing || 0) +
                  (response?.data?.totalCountTabWise?.shipped || 0)
                })`}
              />
            <Tab label={`Delivered (${response?.data?.totalCountTabWise?.delivered || 0})`} />
            <Tab label={`Cancelled (${response?.data?.totalCountTabWise?.cancelled || 0}) `} />
          </Tabs>
        </Box>

        {/* Content */}
        <Box
          sx={{
            p: 3,
            maxWidth: "1200px",
            mx: "auto",
          }}
        >
          {orders.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
                No orders found
              </Typography>
              <Typography variant="body2" sx={{ color: "#999" }}>
                {activeTab === 0
                  ? "You haven't placed any orders yet."
                  : `No orders found for the selected filter.`}
              </Typography>
            </Box>
          ) : (
            orders.map((order: CustomerOrder) => (
              <OrderCard
                key={order._id}
                order={order}
                onViewDetails={() =>
                  console.log("View details for order", order._id)
                }
                onBuyAgain={() => console.log("Buy again for order", order._id)}
              />
            ))
          )}
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default OrdersPage;
