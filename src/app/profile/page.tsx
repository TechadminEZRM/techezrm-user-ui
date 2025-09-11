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
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  const [addressError, setAddressError] = useState<string>("");
  const [addressModalOpen, setAddressModalOpen] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null
  );
  const [addressMenuAnchor, setAddressMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [modalLoading, setModalLoading] = useState<boolean>(false);
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
  const fetchAddresses = async () => {
    if (!customer?.id) return;

    setAddressLoading(true);
    setAddressError("");
    try {
      const addressList = await customerAddressHandler.getAddresses(
        customer.id
      );
      setAddresses(addressList);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddressError("Failed to load addresses");
    } finally {
      setAddressLoading(false);
    }
  };

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
    if (!customer?.id) return;

    try {
      await customerAddressHandler.deleteAddress(customer.id, addressId);
      setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
      setAddressMenuAnchor(null);
    } catch (error) {
      console.error("Error deleting address:", error);
      setAddressError("Failed to delete address");
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!customer?.id) return;

    try {
      await customerAddressHandler.setDefaultAddress(customer.id, addressId);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr._id === addressId,
        }))
      );
      setAddressMenuAnchor(null);
    } catch (error) {
      console.error("Error setting default address:", error);
      setAddressError("Failed to set default address");
    }
  };

  const handleSaveAddress = async (
    addressData: AddAddressRequest | UpdateAddressRequest
  ) => {
    if (!customer?.id) return;

    setModalLoading(true);
    try {
      if (editingAddress) {
        // Update existing address
        const updatedAddress = await customerAddressHandler.updateAddress(
          customer.id,
          editingAddress._id,
          addressData as UpdateAddressRequest
        );
        if (updatedAddress) {
          setAddresses((prev) =>
            prev.map((addr) =>
              addr._id === editingAddress._id ? updatedAddress : addr
            )
          );
        }
      } else {
        // Add new address
        const newAddress = await customerAddressHandler.addAddress(
          customer.id,
          addressData as AddAddressRequest
        );
        if (newAddress) {
          setAddresses((prev) => [...prev, newAddress]);
        }
      }
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
        return <Home sx={{ fontSize: 20, color: "#666" }} />;
      case "work":
        return <Work sx={{ fontSize: 20, color: "#666" }} />;
      default:
        return <LocationOn sx={{ fontSize: 20, color: "#666" }} />;
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

  // Load addresses when customer is available
  useEffect(() => {
    if (customer?.id && currentPage === "addresses") {
      fetchAddresses();
    }
  }, [customer?.id, currentPage]);

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
              <Box sx={{ display: "grid", gap: 3, maxWidth: 800 }}>
                {addresses.map((address) => (
                  <Card
                    key={address._id}
                    sx={{
                      border: address.isDefault
                        ? "2px solid #ff6b35"
                        : "1px solid #e0e0e0",
                      borderRadius: 3,
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                        transform: "translateY(-4px)",
                      },
                      transition: "all 0.3s ease-in-out",
                      background: address.isDefault
                        ? "linear-gradient(135deg, #fff 0%, #fff8f5 100%)"
                        : "white",
                    }}
                  >
                    {/* Premium Badge for Default Address */}
                    {address.isDefault && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          background:
                            "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
                          color: "white",
                          px: 2,
                          py: 0.5,
                          borderRadius: "0 12px 0 12px",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          zIndex: 1,
                        }}
                      >
                        DEFAULT
                      </Box>
                    )}

                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 3,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 3 }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 56,
                              height: 56,
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
                                fontSize: "20px",
                                fontWeight: 700,
                                color: "#333",
                                textTransform: "capitalize",
                                mb: 1,
                              }}
                            >
                              {address.type} Address
                            </Typography>
                            {address.isDefault && (
                              <Chip
                                icon={<Star sx={{ fontSize: 16 }} />}
                                label="Primary Address"
                                size="small"
                                sx={{
                                  backgroundColor: "#ff6b35",
                                  color: "white",
                                  fontSize: "0.75rem",
                                  height: 24,
                                  fontWeight: 600,
                                  "& .MuiChip-icon": {
                                    color: "white",
                                  },
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                        <IconButton
                          size="medium"
                          onClick={(e) => handleAddressMenuOpen(e, address._id)}
                          sx={{
                            color: "#666",
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #e0e0e0",
                            "&:hover": {
                              backgroundColor: "#ff6b35",
                              color: "white",
                              borderColor: "#ff6b35",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>

                      <Box
                        sx={{
                          pl: 7,
                          position: "relative",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "16px",
                            color: "#333",
                            lineHeight: 1.8,
                            fontWeight: 500,
                            mb: 2,
                          }}
                        >
                          {address.street}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "15px",
                              color: "#666",
                              fontWeight: 500,
                            }}
                          >
                            {address.city}, {address.state} {address.zipCode}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              color: "#666",
                              fontWeight: 500,
                            }}
                          >
                            {address.country}
                          </Typography>
                        </Box>

                        {/* Address Type Badge */}
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            label={address.type.toUpperCase()}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: address.isDefault
                                ? "#ff6b35"
                                : "#e0e0e0",
                              color: address.isDefault ? "#ff6b35" : "#666",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              height: 22,
                            }}
                          />
                        </Box>
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
              editAddress={editingAddress}
              loading={modalLoading}
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
