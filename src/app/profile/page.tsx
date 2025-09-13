"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  InputAdornment,
  Link,
  Button,
  Card,
  CardContent,
  Chip,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  ShoppingBag,
  Lock,
  Settings,
  Edit,
  EditOutlined,
  Add,
  Home,
  Work,
  MoreVert,
  LocationOn,
  Delete,
  Star,
} from "@mui/icons-material";
import Image from "next/image";
import OrdersPage from "../my_orders/page";
import ProtectedRoute from "@/components/ProtectedRoute";
import AddressModal from "@/components/AddressModal";
import SettingsPage from "@/components/SettingsPage";
import ChangePasswordPage from "@/components/ChangePasswordPage";
import ProfileUpdateForm from "@/components/ProfileUpdateForm";
import RFQListing from "@/components/RFQListing";
import ProfileLayout from "@/components/ProfileLayout";
import { useAppStore } from "@/store/use-app-store";
import { customerAddressHandler } from "@/api/handlers/customerAddressHandler";
import { passwordChangeHandler } from "@/api/handlers/passwordChangeHandler";
import { customerProfileHandler } from "@/api/handlers/customerProfileHandler";
import { useCustomerAddresses } from "@/hooks/use-customer-addresses";
import type {
  CustomerAddress,
  AddAddressRequest,
  UpdateAddressRequest,
} from "@/api/services/customerAddress";

const PixelPerfectClone: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    | "profile"
    | "orders"
    | "addresses"
    | "settings"
    | "change-password"
    | "edit-profile"
    | "rfqs"
  >("profile");
  const { customer } = useAppStore();

  // Address management state
  const [addressModalOpen, setAddressModalOpen] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null
  );
  const [addressMenuAnchor, setAddressMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  // Use the customer addresses hook
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
  const handleMyOrdersClick = () => {
    setCurrentPage("orders");
  };

  const handleAddressManagementClick = () => {
    setCurrentPage("addresses");
  };

  const handleSettingsClick = () => {
    setCurrentPage("settings");
  };

  const handleChangePasswordClick = () => {
    setCurrentPage("change-password");
  };

  const handleEditProfileClick = () => {
    setCurrentPage("edit-profile");
  };

  const handleRFQsClick = () => {
    setCurrentPage("rfqs");
  };

  const handleBackToProfile = () => {
    setCurrentPage("profile");
  };

  // Address management functions

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
    try {
      await deleteAddress(addressId);
      setAddressMenuAnchor(null);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await updateDefaultAddress(addressId);
      setAddressMenuAnchor(null);
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  const handleSaveAddress = async (addressData: any) => {
    setModalLoading(true);
    try {
      // Convert AddressFormData to AddAddressRequest/UpdateAddressRequest
      const addressRequest: AddAddressRequest = {
        companyName: addressData.companyName,
        receiverName: addressData.receiverName,
        receiverEmail: addressData.receiverEmail,
        receiverPhone: addressData.receiverPhone,
        receiverPhoneCountryCode: addressData.receiverPhoneCountryCode,
        type: addressData.type as "home" | "work" | "other" | "warehouse",
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        zipCode: addressData.zipCode,
        isDefault: addressData.isDefault,
        coordinates: {
          latitude: addressData.coordinates.latitude,
          longitude: addressData.coordinates.longitude,
        },
      };

      if (editingAddress) {
        // Update existing address
        await updateAddress(
          editingAddress._id,
          addressRequest as UpdateAddressRequest
        );
      } else {
        // Add new address
        await addAddress(addressRequest as AddAddressRequest);
      }
      // Reset editing state after successful save
      setEditingAddress(null);
    } catch (error) {
      console.error("Error saving address:", error);
      throw error; // Re-throw to let modal handle the error
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddressMenuOpen = (
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

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home sx={{ fontSize: 16, color: "#ff6b35" }} />;
      case "work":
        return <Work sx={{ fontSize: 16, color: "#ff6b35" }} />;
      case "warehouse":
        return <Work sx={{ fontSize: 16, color: "#ff6b35" }} />;
      case "other":
        return <LocationOn sx={{ fontSize: 16, color: "#ff6b35" }} />;
      default:
        return <LocationOn sx={{ fontSize: 16, color: "#ff6b35" }} />;
    }
  };

  // Password change function
  const handlePasswordChange = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await passwordChangeHandler.changePassword(currentPassword, newPassword);
    } catch (error) {
      throw error; // Re-throw to let the component handle the error
    }
  };

  // Addresses are automatically loaded by the hook when customer.id is available

  if (currentPage === "orders") {
    return (
      <ProtectedRoute>
        <ProfileLayout
          customer={customer}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onBackToProfile={handleBackToProfile}
          title="My Orders"
          showBackButton={true}
        >
          <OrdersPage onBack={handleBackToProfile} />{" "}
        </ProfileLayout>
      </ProtectedRoute>
    );
  }

  if (currentPage === "rfqs") {
    return (
      <ProtectedRoute>
        <ProfileLayout
          customer={customer}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onBackToProfile={handleBackToProfile}
          title="Your RFQs"
          showBackButton={true}
        >
          <RFQListing customerPhone={customer?.phone || ""} />
        </ProfileLayout>
      </ProtectedRoute>
    );
  }

  if (currentPage === "settings") {
    return (
      <ProtectedRoute>
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          <ProfileLayout
            customer={customer}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onBackToProfile={handleBackToProfile}
            title="Settings"
            showBackButton={true}
          >
            {/* Left Sidebar */}

            {/* Main Content Area - Settings */}
            <Box
              sx={{
                flex: 1,
                backgroundColor: "#f8f9fa",
                overflow: "auto",
              }}
            >
              <SettingsPage />
            </Box>
          </ProfileLayout>
        </Box>
      </ProtectedRoute>
    );
  }

  if (currentPage === "change-password") {
    return (
      <ProtectedRoute>
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          {/* Left Sidebar */}
          <ProfileLayout
            customer={customer}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onBackToProfile={handleBackToProfile}
            title="Change Password"
            showBackButton={true}
          >
            {/* Main Content Area - Change Password */}
            <Box
              sx={{
                flex: 1,
                backgroundColor: "#f8f9fa",
                overflow: "auto",
              }}
            >
              <ChangePasswordPage onPasswordChange={handlePasswordChange} />
            </Box>
          </ProfileLayout>
        </Box>
      </ProtectedRoute>
    );
  }

  if (currentPage === "edit-profile") {
    return (
      <ProtectedRoute>
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
          }}
        >
          {/* Left Sidebar */}

          <ProfileLayout
            customer={customer}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onBackToProfile={handleBackToProfile}
            title="Your RFQs"
            showBackButton={true}
          >
            {/* Main Content Area - Edit Profile */}
            <Box
              sx={{
                flex: 1,
                backgroundColor: "#f8f9fa",
                overflow: "auto",
                p: 4,
              }}
            >
              <ProfileUpdateForm
                customerId={customer?.id || ""}
                onSuccess={(updatedProfile) => {
                  console.log("Profile updated:", updatedProfile);
                  // You can update the store here if needed
                }}
              />
            </Box>
          </ProfileLayout>
        </Box>
      </ProtectedRoute>
    );
  }

  if (currentPage === "addresses") {
    return (
      <ProtectedRoute>
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "#f8f9fa",
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          {/* Left Sidebar */}
          <Box
            sx={{
              width: { xs: "100%", md: "280px" },
              backgroundColor: "white",
              borderRight: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Profile Header */}
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#333",
                  mb: 0.5,
                }}
              >
                Profile
              </Typography>
            </Box>

            {/* User Info */}
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: "#d0d0d0",
                }}
              />
              <Box>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#666",
                    mb: 0.5,
                  }}
                >
                  Hello
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#333",
                    mb: 0.5,
                  }}
                >
                  {customer?.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  Personal Information
                </Typography>
              </Box>
            </Box>

            {/* Navigation Menu */}
            <Box sx={{ flex: 1 }}>
              {/* My Accounts */}
              <Box
                onClick={() => setCurrentPage("profile")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 3,
                  py: 2.5,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                }}
              >
                <Person sx={{ fontSize: 20, color: "#666" }} />
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "#666",
                  }}
                >
                  My Accounts
                </Typography>
              </Box>

              {/* Address Management - Active */}
              <Box
                sx={{
                  backgroundColor: "#ff6b35",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 3,
                  py: 2.5,
                  cursor: "pointer",
                }}
              >
                <LocationOn sx={{ fontSize: 20 }} />
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  Address Management
                </Typography>
              </Box>

              {/* My Orders */}
              <Box
                onClick={handleMyOrdersClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 3,
                  py: 2.5,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                }}
              >
                <ShoppingBag sx={{ fontSize: 20, color: "#666" }} />
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "#666",
                  }}
                >
                  My Orders
                </Typography>
              </Box>

              {/* Change Password */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 3,
                  py: 2.5,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                }}
              >
                <Lock sx={{ fontSize: 20, color: "#666" }} />
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "#666",
                  }}
                >
                  Change Password
                </Typography>
              </Box>

              {/* Settings */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 3,
                  py: 2.5,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                }}
              >
                <Settings sx={{ fontSize: 20, color: "#666" }} />
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "#666",
                  }}
                >
                  Settings
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Main Content Area - Address Management */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "white",
              p: { xs: 2, md: 4 },
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                Address Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddAddress}
                sx={{
                  backgroundColor: "#ff6b35",
                  "&:hover": {
                    backgroundColor: "#e55a2b",
                  },
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                }}
              >
                Add New Address
              </Button>
            </Box>

            {addressError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {addressError}
              </Alert>
            )}

            {addressLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 400,
                }}
              >
                <CircularProgress size={40} />
              </Box>
            ) : addresses.length === 0 ? (
              <Card
                sx={{
                  minHeight: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f8f9fa",
                  border: "2px dashed #e0e0e0",
                  borderRadius: 3,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 107, 53, 0.1)",
                      border: "2px dashed #ff6b35",
                      mx: "auto",
                      mb: 3,
                    }}
                  >
                    <LocationOn
                      sx={{
                        fontSize: 40,
                        color: "#ff6b35",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#333",
                      mb: 2,
                      fontWeight: 600,
                    }}
                  >
                    No addresses added yet
                  </Typography>
                  <Typography
                    sx={{
                      color: "#666",
                      mb: 4,
                      maxWidth: 400,
                      mx: "auto",
                      lineHeight: 1.6,
                    }}
                  >
                    Add your first delivery address to get started with fast and
                    easy checkout. Your addresses will be securely saved for
                    future orders.
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
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 24px rgba(255, 107, 53, 0.3)",
                      },
                      textTransform: "none",
                      borderRadius: 3,
                      px: 5,
                      py: 2,
                      fontWeight: 600,
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Add Your First Address
                  </Button>
                </Box>
              </Card>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  maxWidth: "100%",
                }}
              >
                {addresses.map((address) => (
                  <Card
                    key={address._id}
                    sx={{
                      border: address.isDefault
                        ? "2px solid #ff6b35"
                        : "1px solid #e0e0e0",
                      borderRadius: 2,
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease-in-out",
                      background: address.isDefault
                        ? "rgba(255, 107, 53, 0.03)"
                        : "white",
                    }}
                  >
                    {/* Default Badge */}
                    {address.isDefault && (
                      <Chip
                        label="DEFAULT"
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          backgroundColor: "#ff6b35",
                          color: "white",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          height: 20,
                          zIndex: 1,
                          "& .MuiChip-label": {
                            px: 1,
                          },
                        }}
                      />
                    )}

                    <CardContent sx={{ p: 2.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              backgroundColor: address.isDefault
                                ? "rgba(255, 107, 53, 0.1)"
                                : "#f8f9fa",
                              border: address.isDefault
                                ? "2px solid #ff6b35"
                                : "2px solid #e0e0e0",
                            }}
                          >
                            {getAddressIcon(address.type)}
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                color: address.isDefault ? "#ff6b35" : "#333",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {address.type} Address
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => handleAddressMenuOpen(e, address._id)}
                          sx={{
                            color: "#666",
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #e0e0e0",
                            width: 32,
                            height: 32,
                            "&:hover": {
                              backgroundColor: "#ff6b35",
                              color: "white",
                              borderColor: "#ff6b35",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <MoreVert sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>

                      <Box sx={{ ml: 5.5, pr: 4 }}>
                        {/* Company Name */}
                        {address.companyName && (
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "#1e293b",
                              mb: 0.5,
                            }}
                          >
                            {address.companyName}
                          </Typography>
                        )}

                        {/* Receiver Name */}
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "#1e293b",
                            mb: 0.5,
                          }}
                        >
                          {address.receiverName}
                        </Typography>

                        {/* Street Address */}
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            color: "#64748b",
                            lineHeight: 1.4,
                            mb: 0.5,
                          }}
                        >
                          {address.street}
                        </Typography>

                        {/* City, State, Zip */}
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            color: "#64748b",
                            lineHeight: 1.4,
                            mb: 0.5,
                          }}
                        >
                          {address.city}, {address.state} {address.zipCode}
                        </Typography>

                        {/* Country */}
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            color: "#64748b",
                            lineHeight: 1.4,
                            mb: 0.5,
                          }}
                        >
                          {address.country}
                        </Typography>

                        {/* Contact Info */}
                        <Typography
                          sx={{
                            fontSize: "0.65rem",
                            color: "#94a3b8",
                            lineHeight: 1.3,
                          }}
                        >
                          📞 {address.receiverPhone} • ✉️{" "}
                          {address.receiverEmail}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {/* Address Menu */}
            <Menu
              anchorEl={addressMenuAnchor}
              open={Boolean(addressMenuAnchor)}
              onClose={handleAddressMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  minWidth: 180,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  const address = addresses.find(
                    (addr) => addr._id === selectedAddressId
                  );
                  if (address) handleEditAddress(address);
                }}
                sx={{ py: 1.5 }}
              >
                <Edit sx={{ mr: 2, fontSize: 20 }} />
                Edit Address
              </MenuItem>
              {!addresses.find((addr) => addr._id === selectedAddressId)
                ?.isDefault && (
                <MenuItem
                  onClick={() => handleSetDefaultAddress(selectedAddressId)}
                  sx={{ py: 1.5 }}
                >
                  <Home sx={{ mr: 2, fontSize: 20 }} />
                  Set as Default
                </MenuItem>
              )}
              <MenuItem
                onClick={() => handleDeleteAddress(selectedAddressId)}
                sx={{ color: "error.main", py: 1.5 }}
              >
                <Delete sx={{ mr: 2, fontSize: 20 }} />
                Delete Address
              </MenuItem>
            </Menu>

            {/* Address Modal */}
            <AddressModal
              open={addressModalOpen}
              onClose={() => setAddressModalOpen(false)}
              onSave={handleSaveAddress}
              initialData={
                editingAddress
                  ? {
                      companyName: editingAddress.companyName || "",
                      receiverName: editingAddress.receiverName || "",
                      receiverEmail: editingAddress.receiverEmail || "",
                      receiverPhone: editingAddress.receiverPhone || "",
                      receiverPhoneCountryCode:
                        editingAddress.receiverPhoneCountryCode || "+1",
                      type: editingAddress.type || "home",
                      street: editingAddress.street || "",
                      city: editingAddress.city || "",
                      state: editingAddress.state || "",
                      country: editingAddress.country || "",
                      zipCode: editingAddress.zipCode || "",
                      coordinates: {
                        latitude: editingAddress.coordinates?.latitude || "",
                        longitude: editingAddress.coordinates?.longitude || "",
                      },
                      isDefault: editingAddress.isDefault || false,
                      isActive: editingAddress.isActive || true,
                    }
                  : undefined
              }
              customerId={customer?.id}
              editingAddressId={editingAddress?._id}
            />
          </Box>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        }}
      >
        {/* Left Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", md: "280px" },
            backgroundColor: "white",
            borderRight: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Profile Header */}
          <Box
            sx={{
              p: 3,
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#333",
                mb: 0.5,
              }}
            >
              Profile
            </Typography>
          </Box>

          {/* User Info */}
          <Box
            sx={{
              p: 3,
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: "#d0d0d0",
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#666",
                  mb: 0.5,
                }}
              >
                Hello
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#333",
                  mb: 0.5,
                }}
              >
                {customer?.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                Personal Information
              </Typography>
            </Box>
          </Box>

          {/* Navigation Menu */}
          <Box sx={{ flex: 1 }}>
            {/* My Accounts - Active */}
            <Box
              onClick={() => setCurrentPage("profile")}
              sx={{
                backgroundColor:
                  currentPage === "profile" ? "#ff6b35" : "transparent",
                color: currentPage === "profile" ? "white" : "#666",
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 3,
                py: 2.5,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor:
                    currentPage === "profile" ? "#ff6b35" : "#f8f9fa",
                },
              }}
            >
              <Person sx={{ fontSize: 20 }} />
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: currentPage === "profile" ? 500 : 400,
                }}
              >
                My Accounts
              </Typography>
            </Box>

            {/* Address Management */}
            <Box
              onClick={handleAddressManagementClick}
              sx={{
                backgroundColor:
                  (currentPage as string) === "addresses"
                    ? "#ff6b35"
                    : "transparent",
                color:
                  (currentPage as string) === "addresses" ? "white" : "#666",
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 3,
                py: 2.5,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor:
                    (currentPage as string) === "addresses"
                      ? "#ff6b35"
                      : "#f8f9fa",
                },
              }}
            >
              <LocationOn sx={{ fontSize: 20 }} />
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight:
                    (currentPage as string) === "addresses" ? 500 : 400,
                }}
              >
                Address Management
              </Typography>
            </Box>

            {/* My Orders */}
            <Box
              onClick={handleMyOrdersClick}
              sx={{
                backgroundColor:
                  (currentPage as string) === "orders"
                    ? "#ff6b35"
                    : "transparent",
                color: (currentPage as string) === "orders" ? "white" : "#666",
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 3,
                py: 2.5,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor:
                    (currentPage as string) === "orders"
                      ? "#ff6b35"
                      : "#f8f9fa",
                },
              }}
            >
              <ShoppingBag sx={{ fontSize: 20 }} />
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: (currentPage as string) === "orders" ? 500 : 400,
                }}
              >
                My Orders
              </Typography>
            </Box>

            {/* Your RFQs */}
            <Box
              onClick={handleRFQsClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 3,
                py: 2.5,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            >
              <Work sx={{ fontSize: 20, color: "#666" }} />
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "#666",
                }}
              >
                Your RFQs
              </Typography>
            </Box>

            {/* Change Password */}
            <Box
              onClick={handleChangePasswordClick}
              sx={{
                backgroundColor:
                  (currentPage as string) === "change-password"
                    ? "#ff6b35"
                    : "transparent",
                color:
                  (currentPage as string) === "change-password"
                    ? "white"
                    : "#666",
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 3,
                py: 2.5,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor:
                    (currentPage as string) === "change-password"
                      ? "#ff6b35"
                      : "#f8f9fa",
                },
              }}
            >
              <Lock sx={{ fontSize: 20 }} />
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight:
                    (currentPage as string) === "change-password" ? 500 : 400,
                }}
              >
                Change Password
              </Typography>
            </Box>

            {/* Settings */}
            <Box
              onClick={handleSettingsClick}
              sx={{
                backgroundColor:
                  (currentPage as string) === "settings"
                    ? "#ff6b35"
                    : "transparent",
                color:
                  (currentPage as string) === "settings" ? "white" : "#666",
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 3,
                py: 2.5,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor:
                    (currentPage as string) === "settings"
                      ? "#ff6b35"
                      : "#f8f9fa",
                },
              }}
            >
              <Settings sx={{ fontSize: 20 }} />
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight:
                    (currentPage as string) === "settings" ? 500 : 400,
                }}
              >
                Settings
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "white",
            p: { xs: 2, md: 4 },
          }}
        >
          {/* Profile Photo Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 4,
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#f0f0f0",
                }}
              >
                <Image
                  src="/placeholder.svg?height=80&width=80"
                  alt="Profile"
                  width={80}
                  height={80}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Avatar>
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  backgroundColor: "white",
                  border: "2px solid #e0e0e0",
                  width: 28,
                  height: 28,
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                }}
              >
                <EditOutlined sx={{ fontSize: 14, color: "#666" }} />
              </IconButton>
            </Box>

            <Button
              onClick={handleEditProfileClick}
              sx={{
                color: "#1976d2",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 1,
                textTransform: "none",
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
              }}
            >
              <Edit sx={{ fontSize: 16 }} />
              Change profile information
            </Button>
          </Box>

          {/* Form Fields */}
          <Box sx={{ maxWidth: 500 }}>
            {/* Name Field */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#333",
                  mb: 1,
                }}
              >
                Name
              </Typography>
              <TextField
                fullWidth
                value={customer?.name || ""}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f8f9fa",
                    fontSize: "14px",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#c0c0c0",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "12px 14px",
                    color: "#666",
                  },
                }}
              />
            </Box>

            {/* Gender Field */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#333",
                  mb: 1,
                }}
              >
                Gender
              </Typography>
              <FormControl>
                <RadioGroup
                  row
                  value="male"
                  sx={{
                    gap: 3,
                  }}
                >
                  <FormControlLabel
                    value="male"
                    control={
                      <Radio
                        sx={{
                          color: "#1976d2",
                          "&.Mui-checked": {
                            color: "#1976d2",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "14px", color: "#333" }}>
                        Male
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="female"
                    control={
                      <Radio
                        sx={{
                          color: "#c0c0c0",
                          "&.Mui-checked": {
                            color: "#1976d2",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "14px", color: "#333" }}>
                        Female
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Phone Number Field */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#333",
                  mb: 1,
                }}
              >
                Phone number
              </Typography>
              <TextField
                fullWidth
                value={customer?.phone || ""}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          width: 20,
                          height: 14,
                          backgroundColor: "#ff9933",
                          position: "relative",
                          mr: 1,
                        }}
                      >
                        {/* Indian Flag Placeholder */}
                        <Box
                          sx={{
                            width: "100%",
                            height: "33.33%",
                            backgroundColor: "#ff9933",
                          }}
                        />
                        <Box
                          sx={{
                            width: "100%",
                            height: "33.33%",
                            backgroundColor: "white",
                          }}
                        />
                        <Box
                          sx={{
                            width: "100%",
                            height: "33.33%",
                            backgroundColor: "#138808",
                          }}
                        />
                      </Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f8f9fa",
                    fontSize: "14px",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#c0c0c0",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "12px 14px",
                    color: "#666",
                  },
                }}
              />
            </Box>

            {/* Email Field */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#333",
                  mb: 1,
                }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                value={customer?.email || ""}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f8f9fa",
                    fontSize: "14px",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#c0c0c0",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "12px 14px",
                    color: "#666",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default PixelPerfectClone;
