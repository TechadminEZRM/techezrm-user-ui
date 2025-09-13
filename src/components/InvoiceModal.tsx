"use client";

import React from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Close, Receipt, Download, Print } from "@mui/icons-material";
import { formatDate } from "@/utils/dateUtils";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
}

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  order?: any; // Using any to match the CustomerOrder type from the API
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  open,
  onClose,
  order,
}) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const handlePrintInvoice = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  if (!order) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
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
              Invoice #: {order?.uniqueId || "N/A"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Date: {formatDate(order?.createdAt)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6" fontWeight="600" color="#1a365d">
              EZRM
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your Trusted Partner
            </Typography>
          </Box>
        </Box>

        {/* Customer & Order Info */}
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            {/* Customer Info */}
            <Box>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Bill To:
              </Typography>
              <Typography variant="body1" fontWeight="500">
                {order?.customer?.name || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order?.customer?.email || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order?.customer?.phone || "N/A"}
              </Typography>
            </Box>

            {/* Shipping Address */}
            <Box>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Ship To:
              </Typography>
              <Typography variant="body1" fontWeight="500">
                {order?.shippingAddress?.fullName || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order?.shippingAddress?.address || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order?.shippingAddress?.city || "N/A"},{" "}
                {order?.shippingAddress?.state || "N/A"}{" "}
                {order?.shippingAddress?.zipCode || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order?.shippingAddress?.country || "N/A"}
              </Typography>
            </Box>
          </Box>

          {/* Order Status */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Order Status: {order?.orderStatus || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Payment Status: {order?.paymentStatus || "N/A"}
            </Typography>
          </Box>

          {/* Items Table */}
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Quantity
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Unit Price
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items?.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body1" fontWeight="500">
                        {item?.product?.name || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{item?.quantity || 0}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item?.product?.price || 0)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item?.totalPrice || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Total */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <Box sx={{ minWidth: 200 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body1" fontWeight="600">
                  Subtotal:
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {formatCurrency(order?.totalAmount || 0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body1" fontWeight="600">
                  Shipping:
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  Free
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 2,
                  borderTop: "2px solid #1a365d",
                }}
              >
                <Typography variant="h6" fontWeight="700" color="#1a365d">
                  Total:
                </Typography>
                <Typography variant="h6" fontWeight="700" color="#1a365d">
                  {formatCurrency(order?.totalAmount || 0)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              textAlign: "center",
              mt: 4,
              pt: 3,
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Thank you for your business!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              For any questions, please contact our support team.
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          className="no-print"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            gap: 1,
            zIndex: 1000,
          }}
        >
          <IconButton onClick={onClose} sx={{ color: "#666" }}>
            <Close />
          </IconButton>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
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
              startIcon={<Print />}
              onClick={handlePrintInvoice}
              sx={{
                backgroundColor: "#ff6b35",
                "&:hover": {
                  backgroundColor: "#e55a2b",
                },
              }}
            >
              Print
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default InvoiceModal;
