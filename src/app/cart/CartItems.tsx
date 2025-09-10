import type React from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Add,
  Remove,
  DeleteOutline,
  Close,
  Warning,
} from "@mui/icons-material";
import { useAppStore } from "@/store/use-app-store";
import {
  useUpdateCartItem,
  useRemoveFromCart,
} from "@/api/handlers/cartHandler";
import { useState } from "react";

interface CartItem {
  product: {
    _id: string;
    uniqueId?: string;
    bannerImage?: string;
  };
  productName: string;
  productPrice: number;
  quantity: number;
}

interface CartItemsProps {
  cartItems: CartItem[];
}

const CartItems: React.FC<CartItemsProps> = ({ cartItems }) => {
  const { customer } = useAppStore();
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    productId: string;
    productName: string;
  }>({
    open: false,
    productId: "",
    productName: "",
  });

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1 || !customer?.id) return;
    updateCartItemMutation.mutate({
      productId,
      data: { customerId: customer.id, quantity: newQuantity },
    });
  };

  const handleRemoveFromCart = (productId: string, productName: string) => {
    setConfirmationDialog({
      open: true,
      productId,
      productName,
    });
  };

  const confirmRemoveFromCart = () => {
    if (!customer?.id) return;
    removeFromCartMutation.mutate({
      customerId: customer.id,
      productId: confirmationDialog.productId,
    });
    setConfirmationDialog({ open: false, productId: "", productName: "" });
  };

  const cancelRemoveFromCart = () => {
    setConfirmationDialog({ open: false, productId: "", productName: "" });
  };

  const removeFromCart = (productId: string) => {
    if (!customer?.id) return;
    removeFromCartMutation.mutate({ customerId: customer.id, productId });
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box sx={{ flex: 1 }}>
      {/* Image Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{
          backdrop: Backdrop,
        }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(8px)",
            },
          },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
            outline: "none",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "2px solid rgba(255, 255, 255, 0.4)",
              },
              zIndex: 1,
            }}
          >
            <Close />
          </IconButton>

          {/* Image */}
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Product"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              }}
            />
          )}
        </Box>
      </Modal>

      {/* Remove Confirmation Dialog */}
      <Dialog
        open={confirmationDialog.open}
        onClose={cancelRemoveFromCart}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            pb: 1,
            color: "#d32f2f",
          }}
        >
          <Warning sx={{ color: "#d32f2f" }} />
          Remove Item from Cart
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1" sx={{ mb: 2, color: "#333" }}>
            Are you sure you want to remove{" "}
            <strong>"{confirmationDialog.productName}"</strong> from your cart?
          </Typography>
          {/* <Typography
            variant="body2"
            sx={{ color: "#666", fontStyle: "italic" }}
          >
            This action cannot be undone.
          </Typography> */}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={cancelRemoveFromCart}
            variant="outlined"
            sx={{
              borderColor: "#666",
              color: "#666",
              "&:hover": {
                borderColor: "#333",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmRemoveFromCart}
            variant="contained"
            disabled={removeFromCartMutation.isPending}
            sx={{
              backgroundColor: "#d32f2f",
              color: "white",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
              "&:disabled": {
                backgroundColor: "#ccc",
              },
            }}
          >
            {removeFromCartMutation.isPending ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cart Items Table */}
      <TableContainer sx={{ backgroundColor: "white", borderRadius: 1, mb: 3 }}>
        <Table sx={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "1px solid rgba(234, 104, 36, 1)",
                  backgroundColor: "transparent",
                }}
              >
                Item
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "1px solid rgba(234, 104, 36, 1)",
                  backgroundColor: "transparent",
                }}
              >
                Price / Kg
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "1px solid rgba(234, 104, 36, 1)",
                  backgroundColor: "transparent",
                }}
              >
                Quantity
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "1px solid rgba(234, 104, 36, 1)",
                  backgroundColor: "transparent",
                }}
              >
                Subtotal
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  fontSize: "0.875rem",
                  py: 2,
                  borderBottom: "1px solid rgba(234, 104, 36, 1)",
                  backgroundColor: "transparent",
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems?.map((item) => (
              <TableRow
                key={item.product?._id}
                sx={{
                  "& td": {
                    backgroundColor: "#fafafa",
                    border: "none",
                    "&:first-of-type": {
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                    },
                    "&:last-of-type": {
                      borderTopRightRadius: "20px",
                      borderBottomRightRadius: "20px",
                    },
                  },
                }}
              >
                <TableCell sx={{ py: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: "#ffa500",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                      onClick={() =>
                        item?.product?.bannerImage &&
                        handleImageClick(item.product.bannerImage)
                      }
                    >
                      {item?.product?.bannerImage ? (
                        <img
                          src={item.product.bannerImage}
                          alt={item?.productName || "Product"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#ffa500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          No Image
                        </Box>
                      )}
                    </Box>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "#333",
                          fontSize: "0.875rem",
                          mb: 0.5,
                        }}
                      >
                        {item.productName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#666", fontSize: "0.75rem" }}
                      >
                        Product ID:{" "}
                        {item?.product?.uniqueId || item.product?._id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ py: 2 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#333",
                      fontSize: "0.875rem",
                    }}
                  >
                    ${item.productPrice.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ py: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      sx={{
                        width: 24,
                        height: 24,
                        border: "1px solid #ddd",
                        borderRadius: "50%",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <Remove sx={{ fontSize: 14 }} />
                    </IconButton>
                    <Box sx={{ mx: 1, textAlign: "center", minWidth: 40 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: "#333",
                          fontSize: "0.875rem",
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#4caf50",
                          fontSize: "0.625rem",
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {/* IN STOCK: 6 */}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      sx={{
                        width: 24,
                        height: 24,
                        border: "1px solid #ddd",
                        borderRadius: "50%",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <Add sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ py: 2 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#333",
                      fontSize: "0.875rem",
                    }}
                  >
                    ${(item.productPrice * item.quantity).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ py: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleRemoveFromCart(item.product._id, item.productName)
                    }
                    sx={{
                      color: "#f44336",
                      "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.1)" },
                    }}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CartItems;
