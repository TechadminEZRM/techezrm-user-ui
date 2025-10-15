"use client";

import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useProductVariants } from "@/api/handlers/productVariantsHandler";
import { ShoppingCart, Visibility, CheckCircle, ErrorOutline } from "@mui/icons-material";

// Product type
interface Product {
  _id: string;
  name: string;
  description?: string;
  appearance?: string;
  uniqueId?: string;
  price: number;
  inStock?: boolean;
  bannerImage?: string;
  images?: string[];
}

interface ProductCardProps {
  product: Product;
  handleProductClick: (id: string) => void;
  handleAddToCart: (product: Product) => void;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  handleProductClick,
  handleAddToCart
}) => {
  // hook call
  const { data: variantsResponse, isLoading } = useProductVariants(product._id);
  const hasVariants = Array.isArray(variantsResponse?.data) && variantsResponse.data.length > 0;4
  const variants = variantsResponse?.data ?? [];
  const minUnitSize =
  variants.length > 0 ? Math.min(...variants.map((v) => v.unitSize)) : 1;
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "all 0.2s ease",
          border: "1px solid #e0e0e0",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            transform: "translateY(-4px)",
          },
          borderRadius: 2,
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => handleProductClick(product._id)}
      >
        {/* Stock chip */}
        <Chip
          icon={product.inStock ? <CheckCircle /> : <ErrorOutline />}
          label={product.inStock ? "In Stock" : "Out of Stock"}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 1,
            backgroundColor: product.inStock ? "#4caf50" : "#f44336",
            color: "white",
            fontSize: "0.75rem",
            height: 24,
            "& .MuiChip-icon": {
              color: "white",
              fontSize: 16,
            },
          }}
        />

        {/* Product Image */}
        <CardMedia
          component="img"
          sx={{
            height: 200,
            objectFit: "cover",
            backgroundColor: "#f5f5f5",
          }}
          image={
            product.bannerImage ||
            product.images?.[0] ||
            "/placeholder-product.png"
          }
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-product.png";
          }}
        />

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Unique ID */}
          {product.uniqueId && (
            <Typography
              variant="caption"
              sx={{
                color: "#999",
                fontWeight: 500,
                fontSize: "0.75rem",
                letterSpacing: "0.5px",
              }}
            >
              {product.uniqueId}
            </Typography>
          )}

          {/* Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#333",
              mb: 1,
              fontSize: "1rem",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name}
          </Typography>

          {/* Description */}
          {product.description && (
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.4,
              }}
            >
              {product.description}
            </Typography>
          )}

          {/* Appearance */}
          {product.appearance && (
            <Typography
              variant="caption"
              sx={{
                color: "#999",
                fontStyle: "italic",
                mb: 2,
                display: "block",
              }}
            >
              {product.appearance}
            </Typography>
          )}

          {/* Price */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#ff6b35",
              mb: 2,
            }}
          >
            {formatPrice(product.price)}
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
            <Button
              variant="contained"
              startIcon={<Visibility />}
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick(product._id);
              }}
              sx={{
                backgroundColor: "#ff6b35",
                "&:hover": { backgroundColor: "#e55a2b" },
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              View Details
            </Button>
            <IconButton
              sx={{
                border: "1px solid #e0e0e0",
                color: "#666",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  borderColor: "#ff6b35",
                  color: "#ff6b35",
                },
              }}
              disabled={!hasVariants || isLoading}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product, minUnitSize);
              }}
            >
              <ShoppingCart />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProductCard;
