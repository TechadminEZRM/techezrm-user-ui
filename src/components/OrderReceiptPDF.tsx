import React from "react";
import { Box, Typography, Container, Paper, Divider } from "@mui/material";
import {
  CheckCircle,
  Receipt,
  LocalShipping,
  Payment,
  Person,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";

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

interface OrderReceiptPDFProps {
  orderDetails: OrderDetails | null;
}

const OrderReceiptPDF: React.FC<OrderReceiptPDFProps> = ({ orderDetails }) => {
  if (!orderDetails) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>No order details available</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: "white" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#ff6b35",
            mb: 1,
          }}
        >
          EZRM
        </Typography>
        <Typography variant="h6" sx={{ color: "#333", mb: 2 }}>
          Order Receipt
        </Typography>
        <CheckCircle
          sx={{
            fontSize: 40,
            color: "#28a745",
            mb: 1,
          }}
        />
        <Typography
          sx={{
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "#333",
            mb: 0.5,
          }}
        >
          Payment Successful
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9rem",
            color: "#666",
          }}
        >
          Order #{orderDetails?.uniqueId || "N/A"}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "#666",
          }}
        >
          Date:{" "}
          {orderDetails?.createdAt
            ? new Date(orderDetails.createdAt).toLocaleDateString()
            : "N/A"}
        </Typography>
      </Box>

      {/* Order Summary */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Receipt sx={{ fontSize: 20, color: "#ff6b35" }} />
          <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#333" }}>
            Order Summary
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
            Subtotal
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", color: "#333" }}>
            ${(orderDetails?.subTotal || 0).toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
            Tax
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", color: "#333" }}>
            ${(orderDetails?.tax || 0).toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
            Shipping
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", color: "#333" }}>
            ${(orderDetails?.shippingCost || 0).toFixed(2)}
          </Typography>
        </Box>
        {(orderDetails?.discount || 0) > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
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
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Person sx={{ fontSize: 20, color: "#ff6b35" }} />
          <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#333" }}>
            Customer Details
          </Typography>
        </Box>
        <Box sx={{ mb: 1 }}>
          <Typography
            sx={{ fontSize: "0.9rem", fontWeight: 500, color: "#333", mb: 0.5 }}
          >
            {orderDetails?.customer?.name || "N/A"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Email sx={{ fontSize: 14, color: "#666" }} />
            <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
              {orderDetails?.customer?.email || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Phone sx={{ fontSize: 14, color: "#666" }} />
            <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
              {orderDetails?.customer?.phone || "N/A"}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Shipping Address */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <LocationOn sx={{ fontSize: 20, color: "#ff6b35" }} />
          <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#333" }}>
            Shipping Address
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.4 }}>
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
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <LocalShipping sx={{ fontSize: 20, color: "#ff6b35" }} />
          <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#333" }}>
            Order Items
          </Typography>
        </Box>
        {orderDetails?.items?.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              p: 2,
              backgroundColor: "#f8f9fa",
              borderRadius: 1,
            }}
          >
            <Box>
              <Typography
                sx={{ fontSize: "0.9rem", color: "#333", fontWeight: 500 }}
              >
                {item?.product?.name || "N/A"}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
                Qty: {item?.quantity || 0} × $
                {((item?.price || 0) / (item?.quantity || 1)).toFixed(2)}
              </Typography>
            </Box>
            <Typography
              sx={{ fontSize: "0.9rem", color: "#333", fontWeight: 500 }}
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

      {/* Order Status */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Payment sx={{ fontSize: 20, color: "#ff6b35" }} />
          <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#333" }}>
            Order Status
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
              Order Status:
            </Typography>
            <Typography
              sx={{ fontSize: "0.8rem", fontWeight: 500, color: "#1976d2" }}
            >
              {orderDetails?.orderStatus || "Unknown"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
              Payment Status:
            </Typography>
            <Typography
              sx={{ fontSize: "0.8rem", fontWeight: 500, color: "#2e7d32" }}
            >
              {orderDetails?.paymentStatus || "Unknown"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
              Payment Method:
            </Typography>
            <Typography
              sx={{ fontSize: "0.8rem", fontWeight: 500, color: "#f57c00" }}
            >
              {orderDetails?.paymentMethod || "Unknown"}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Footer */}
      <Box
        sx={{
          textAlign: "center",
          mt: 4,
          pt: 3,
          borderTop: "1px solid #e9ecef",
        }}
      >
        <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
          Thank you for your order!
        </Typography>
        <Typography sx={{ fontSize: "0.7rem", color: "#999", mt: 1 }}>
          EZRM - Your trusted partner for quality products
        </Typography>
      </Box>
    </Container>
  );
};

export default OrderReceiptPDF;
