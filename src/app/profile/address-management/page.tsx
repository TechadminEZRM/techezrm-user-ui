"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Link,
} from "@mui/material";
import {
  Add,
  LocationOn,
  Edit,
  Delete,
  MoreVert,
  Home,
  Work,
  Star,
  ExpandMore,
  Map,
  Phone,
  Email,
  Business,
  Person,
} from "@mui/icons-material";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileLayoutWrapper from "@/components/ProfileLayoutWrapper";
import AddressModal from "@/components/AddressModal";
import { useAppStore } from "@/store/use-app-store";
import { useCustomerAddresses } from "@/hooks/use-customer-addresses";
import type { CustomerAddress } from "@/api/services/customerAddress";

const AddressManagementPage: React.FC = () => {
  const { customer } = useAppStore();
  const [addressModalOpen, setAddressModalOpen] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null
  );
  const [addressMenuAnchor, setAddressMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] =
    useState<CustomerAddress | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const {
    addresses,
    isLoading: addressLoading,
    error: addressError,
    addAddress,
    updateAddress,
    deleteAddress,
    updateDefaultAddress,
    refetch: refetchAddresses,
  } = useCustomerAddresses(customer?.id);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressModalOpen(true);
  };

  const handleEditAddress = (address: CustomerAddress) => {
    setEditingAddress(address);
    setAddressModalOpen(true);
    setAddressMenuAnchor(null);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(addressId);
        setAddressMenuAnchor(null);
      } catch (error) {
        console.error("Error deleting address:", error);
      }
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      console.log("Setting default address:", addressId);
      const result = await updateDefaultAddress(addressId);
      console.log("Set default result:", result);
      setAddressMenuAnchor(null);

      // Show success message
      if (result) {
        setSuccessMessage("Default address updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      setSuccessMessage("Failed to set default address. Please try again.");
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  };

  const handleAddressMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    addressId: string
  ) => {
    setAddressMenuAnchor(event.currentTarget);
    setSelectedAddressId(addressId);
  };

  const handleAddressMenuClose = () => {
    setAddressMenuAnchor(null);
    setSelectedAddressId("");
  };

  const handleShowDetails = (address: CustomerAddress) => {
    setSelectedAddress(address);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedAddress(null);
  };

  const openGoogleMaps = (latitude: string, longitude: string) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  const getAddressIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "home":
        return <Home sx={{ color: "#ff6b35", fontSize: 20 }} />;
      case "work":
        return <Work sx={{ color: "#ff6b35", fontSize: 20 }} />;
      default:
        return <LocationOn sx={{ color: "#ff6b35", fontSize: 20 }} />;
    }
  };

  if (addressLoading) {
    return (
      <ProtectedRoute>
        <ProfileLayoutWrapper title="Address Management">
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        </ProfileLayoutWrapper>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <ProfileLayoutWrapper title="Address Management">
        <Box>
          {/* Header with Add Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#7f8c8d",
                fontSize: "0.875rem",
              }}
            >
              Manage your delivery addresses
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddAddress}
              sx={{
                background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #e55a2b 0%, #ff6b35 100%)",
                },
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 500,
                fontSize: "0.9rem",
              }}
            >
              Add New Address
            </Button>
          </Box>

          {/* Error Message */}
          {addressError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {addressError}
            </Alert>
          )}

          {/* Success Message */}
          {successMessage && (
            <Alert
              severity={successMessage.includes("Failed") ? "error" : "success"}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {successMessage}
            </Alert>
          )}

          {/* Addresses Grid */}
          {addresses && addresses.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                },
                gap: 3,
                width: "100%",
              }}
            >
              {addresses.map((address) => (
                <Card
                  key={address._id}
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    border: address.isDefault
                      ? "2px solid #ff6b35"
                      : "1px solid #f0f0f0",
                    position: "relative",
                    width: "100%",
                    minHeight: "280px",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Address Header */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        {getAddressIcon(address.type)}
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: "#2c3e50",
                              fontSize: "1rem",
                              textTransform: "capitalize",
                            }}
                          >
                            {address.type}
                          </Typography>
                          {address.isDefault && (
                            <Chip
                              label="Default"
                              size="small"
                              sx={{
                                backgroundColor: "#fff5f2",
                                color: "#ff6b35",
                                fontSize: "0.75rem",
                                height: 20,
                                mt: 0.5,
                              }}
                              icon={<Star sx={{ fontSize: 14 }} />}
                            />
                          )}
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleAddressMenuClick(e, address._id)}
                        sx={{
                          color: "#7f8c8d",
                          "&:hover": {
                            backgroundColor: "#f8f9fa",
                            color: "#2c3e50",
                          },
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    {/* Address Details - Simplified View */}
                    <Box sx={{ flex: 1, space: 1.5 }}>
                      {/* Main Address Line */}
                      <Box sx={{ mb: 1.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#5a6c7d",
                            fontSize: "0.875rem",
                            lineHeight: 1.5,
                            fontWeight: 500,
                          }}
                        >
                          {address.street || "Street address not provided"}
                        </Typography>
                      </Box>

                      {/* City, State, Zip Code */}
                      <Box sx={{ mb: 1.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#5a6c7d",
                            fontSize: "0.875rem",
                            lineHeight: 1.5,
                          }}
                        >
                          {address.city && address.state && address.zipCode
                            ? `${address.city}, ${address.state} ${address.zipCode}`
                            : address.city ||
                              address.state ||
                              address.zipCode ||
                              "City, State, Zip Code not provided"}
                        </Typography>
                      </Box>

                      {/* Country */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#5a6c7d",
                            fontSize: "0.875rem",
                            lineHeight: 1.5,
                          }}
                        >
                          {address.country || "Country not provided"}
                        </Typography>
                      </Box>

                      {/* Show More Button */}
                      <Box sx={{ mt: "auto" }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ExpandMore />}
                          onClick={() => handleShowDetails(address)}
                          sx={{
                            borderColor: "#e0e0e0",
                            color: "#7f8c8d",
                            fontSize: "0.75rem",
                            textTransform: "none",
                            borderRadius: 2,
                            px: 2,
                            py: 0.5,
                            "&:hover": {
                              borderColor: "#ff6b35",
                              color: "#ff6b35",
                              backgroundColor: "#fff5f2",
                            },
                          }}
                        >
                          Show More
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #f0f0f0",
                textAlign: "center",
                py: 6,
              }}
            >
              <CardContent>
                <LocationOn sx={{ color: "#bdc3c7", fontSize: 48, mb: 2 }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#7f8c8d",
                    fontSize: "1.1rem",
                    mb: 1,
                  }}
                >
                  No addresses found
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#95a5a6",
                    fontSize: "0.875rem",
                    mb: 3,
                  }}
                >
                  Add your first address to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddAddress}
                  sx={{
                    background:
                      "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #e55a2b 0%, #ff6b35 100%)",
                    },
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                >
                  Add Address
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Address Menu */}
          <Menu
            anchorEl={addressMenuAnchor}
            open={Boolean(addressMenuAnchor)}
            onClose={handleAddressMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                minWidth: 160,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                const address = addresses?.find(
                  (addr) => addr._id === selectedAddressId
                );
                if (address) handleEditAddress(address);
              }}
              sx={{ fontSize: "0.875rem", py: 1.5 }}
            >
              <Edit sx={{ mr: 1.5, fontSize: 18 }} />
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => handleSetDefaultAddress(selectedAddressId)}
              disabled={
                addresses?.find((addr) => addr._id === selectedAddressId)
                  ?.isDefault
              }
              sx={{
                fontSize: "0.875rem",
                py: 1.5,
                "&:disabled": {
                  opacity: 0.5,
                },
              }}
            >
              <Star sx={{ mr: 1.5, fontSize: 18 }} />
              {addresses?.find((addr) => addr._id === selectedAddressId)
                ?.isDefault
                ? "Already Default"
                : "Set as Default"}
            </MenuItem>
            <MenuItem
              onClick={() => handleDeleteAddress(selectedAddressId)}
              sx={{ fontSize: "0.875rem", py: 1.5, color: "#e74c3c" }}
            >
              <Delete sx={{ mr: 1.5, fontSize: 18 }} />
              Delete
            </MenuItem>
          </Menu>

          {/* Address Modal */}
          <AddressModal
            open={addressModalOpen}
            onClose={() => {
              setAddressModalOpen(false);
              setEditingAddress(null);
            }}
            onSave={async (addressData) => {
              try {
                if (editingAddress) {
                  await updateAddress(editingAddress._id, addressData);
                } else {
                  await addAddress(addressData);
                }
                setAddressModalOpen(false);
                setEditingAddress(null);
              } catch (error) {
                console.error("Error saving address:", error);
              }
            }}
            initialData={editingAddress || undefined}
          />

          {/* Address Details Modal */}
          <Dialog
            open={detailsModalOpen}
            onClose={handleCloseDetailsModal}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                maxHeight: "90vh",
                overflow: "hidden",
              },
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                pb: 2,
                borderBottom: "1px solid #e8e8e8",
                backgroundColor: "#fafafa",
                px: 3,
                py: 2.5,
              }}
            >
              {selectedAddress && getAddressIcon(selectedAddress.type)}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#2c3e50",
                    fontSize: "1rem",
                    textTransform: "capitalize",
                    mb: 0.5,
                  }}
                >
                  {selectedAddress?.type} Address Details
                </Typography>
                {selectedAddress?.isDefault && (
                  <Chip
                    label="Default"
                    size="small"
                    sx={{
                      backgroundColor: "#fff5f2",
                      color: "#ff6b35",
                      fontSize: "0.7rem",
                      height: 18,
                      fontWeight: 500,
                    }}
                    icon={<Star sx={{ fontSize: 12 }} />}
                  />
                )}
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0, overflow: "auto" }}>
              {selectedAddress && (
                <Box sx={{ p: 3 }}>
                  {/* Address Information */}
                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#7f8c8d",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        mb: 1.5,
                        display: "block",
                      }}
                    >
                      Address Information
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        p: 2,
                        backgroundColor: "#f8f9fa",
                        borderRadius: 1.5,
                        border: "1px solid #e8e8e8",
                      }}
                    >
                      <LocationOn
                        sx={{
                          color: "#ff6b35",
                          fontSize: 16,
                          mt: 0.5,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#2c3e50",
                            fontSize: "0.8rem",
                            lineHeight: 1.4,
                            fontWeight: 500,
                            mb: 0.5,
                          }}
                        >
                          {selectedAddress.street}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#5a6c7d",
                            fontSize: "0.75rem",
                            lineHeight: 1.4,
                            mb: 0.5,
                          }}
                        >
                          {selectedAddress.city}, {selectedAddress.state}{" "}
                          {selectedAddress.zipCode}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#5a6c7d",
                            fontSize: "0.75rem",
                            lineHeight: 1.4,
                          }}
                        >
                          {selectedAddress.country}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Company Information */}
                  {selectedAddress.companyName && (
                    <Box sx={{ mb: 2.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#7f8c8d",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                          mb: 1.5,
                          display: "block",
                        }}
                      >
                        Company Information
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 2,
                          backgroundColor: "#f8f9fa",
                          borderRadius: 1.5,
                          border: "1px solid #e8e8e8",
                        }}
                      >
                        <Business
                          sx={{ color: "#ff6b35", fontSize: 16, flexShrink: 0 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#2c3e50",
                            fontSize: "0.8rem",
                            lineHeight: 1.4,
                            fontWeight: 500,
                          }}
                        >
                          {selectedAddress.companyName}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Receiver Information */}
                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#7f8c8d",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        mb: 1.5,
                        display: "block",
                      }}
                    >
                      Receiver Information
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "#f8f9fa",
                        borderRadius: 1.5,
                        border: "1px solid #e8e8e8",
                        space: 1.5,
                      }}
                    >
                      {selectedAddress.receiverName && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 1.5,
                          }}
                        >
                          <Person
                            sx={{
                              color: "#ff6b35",
                              fontSize: 16,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#2c3e50",
                              fontSize: "0.8rem",
                              lineHeight: 1.4,
                              fontWeight: 500,
                            }}
                          >
                            {selectedAddress.receiverName}
                          </Typography>
                        </Box>
                      )}

                      {selectedAddress.receiverPhone && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 1.5,
                          }}
                        >
                          <Phone
                            sx={{
                              color: "#ff6b35",
                              fontSize: 16,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#2c3e50",
                              fontSize: "0.8rem",
                              lineHeight: 1.4,
                              fontWeight: 500,
                            }}
                          >
                            {selectedAddress.receiverPhoneCountryCode}{" "}
                            {selectedAddress.receiverPhone}
                          </Typography>
                        </Box>
                      )}

                      {selectedAddress.receiverEmail && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Email
                            sx={{
                              color: "#ff6b35",
                              fontSize: 16,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#2c3e50",
                              fontSize: "0.8rem",
                              lineHeight: 1.4,
                              fontWeight: 500,
                            }}
                          >
                            {selectedAddress.receiverEmail}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Location & Coordinates */}
                  {selectedAddress.coordinates && (
                    <Box sx={{ mb: 2.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#7f8c8d",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                          mb: 1.5,
                          display: "block",
                        }}
                      >
                        Location & Coordinates
                      </Typography>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: "#f8f9fa",
                          borderRadius: 1.5,
                          border: "1px solid #e8e8e8",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                            mb: 2,
                          }}
                        >
                          <Map
                            sx={{
                              color: "#ff6b35",
                              fontSize: 16,
                              mt: 0.5,
                              flexShrink: 0,
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#2c3e50",
                                fontSize: "0.75rem",
                                lineHeight: 1.4,
                                fontWeight: 500,
                                mb: 0.5,
                              }}
                            >
                              Latitude: {selectedAddress.coordinates.latitude}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#2c3e50",
                                fontSize: "0.75rem",
                                lineHeight: 1.4,
                                fontWeight: 500,
                              }}
                            >
                              Longitude: {selectedAddress.coordinates.longitude}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          startIcon={<Map sx={{ fontSize: 14 }} />}
                          onClick={() =>
                            openGoogleMaps(
                              selectedAddress.coordinates.latitude,
                              selectedAddress.coordinates.longitude
                            )
                          }
                          sx={{
                            background:
                              "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #e55a2b 0%, #ff6b35 100%)",
                            },
                            textTransform: "none",
                            borderRadius: 1.5,
                            px: 2.5,
                            py: 0.75,
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            minHeight: 32,
                          }}
                        >
                          Open in Google Maps
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {/* Additional Information */}
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#7f8c8d",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        mb: 1.5,
                        display: "block",
                      }}
                    >
                      Additional Information
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "#f8f9fa",
                        borderRadius: 1.5,
                        border: "1px solid #e8e8e8",
                      }}
                    >
                      <Box sx={{ space: 1.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#7f8c8d",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            Unique ID:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#2c3e50",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            {selectedAddress.uniqueId}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#7f8c8d",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            Status:
                          </Typography>
                          <Chip
                            label={
                              selectedAddress.isActive ? "Active" : "Inactive"
                            }
                            size="small"
                            sx={{
                              backgroundColor: selectedAddress.isActive
                                ? "#e8f5e8"
                                : "#ffeaea",
                              color: selectedAddress.isActive
                                ? "#2e7d32"
                                : "#d32f2f",
                              fontSize: "0.7rem",
                              height: 18,
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#7f8c8d",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            Created:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#2c3e50",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            {new Date(
                              selectedAddress.createdAt
                            ).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#7f8c8d",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            Last Updated:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#2c3e50",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            {new Date(
                              selectedAddress.updatedAt
                            ).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>

            <DialogActions
              sx={{
                p: 2.5,
                pt: 0,
                borderTop: "1px solid #e8e8e8",
                backgroundColor: "#fafafa",
              }}
            >
              <Button
                onClick={handleCloseDetailsModal}
                sx={{
                  color: "#7f8c8d",
                  textTransform: "none",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  px: 3,
                  py: 1,
                  borderRadius: 1.5,
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                    color: "#2c3e50",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </ProfileLayoutWrapper>
    </ProtectedRoute>
  );
};

export default AddressManagementPage;
