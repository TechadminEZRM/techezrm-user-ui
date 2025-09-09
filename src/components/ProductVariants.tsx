"use client";

import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useProductVariants } from "@/api/handlers/productVariantsHandler";

interface ProductVariantsProps {
  productId: string;
}

export default function ProductVariants({ productId }: ProductVariantsProps) {
  const {
    data: variantsResponse,
    isLoading,
    error,
    isError,
  } = useProductVariants(productId);

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading product variants:{" "}
        {error instanceof Error ? error.message : "Something went wrong"}
      </Alert>
    );
  }

  // No variants found
  if (!variantsResponse?.data || variantsResponse.data.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No variants available for this product.
      </Alert>
    );
  }

  const variants = variantsResponse.data;

  // Calculate savings percentage (assuming first variant is base price)
  const basePrice = variants[0]?.price || 0;

  const getSavingsPercentage = (price: number) => {
    if (basePrice === 0 || price >= basePrice) return "0%";
    const savings = ((basePrice - price) / basePrice) * 100;
    return `${Math.round(savings)}%`;
  };

  return (
    <Box sx={{ mt: 0, mb: 3 }}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #e0e0e0" }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
              <TableCell sx={{ fontWeight: 600, py: 1.5, fontSize: "12px" }}>
                Quantity
              </TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1.5, fontSize: "12px" }}>
                Price
              </TableCell>
              <TableCell sx={{ fontWeight: 600, py: 1.5, fontSize: "12px" }}>
                Save
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variants.map((variant) => (
              <TableRow key={variant._id}>
                <TableCell sx={{ py: 1.5, fontSize: "12px" }}>
                  {variant.unitSize} {variant.unit}
                </TableCell>
                <TableCell sx={{ py: 1.5, fontSize: "12px" }}>
                  ₹{variant.price.toLocaleString()}
                </TableCell>
                <TableCell sx={{ py: 1.5, fontSize: "12px" }}>
                  {getSavingsPercentage(variant.price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
