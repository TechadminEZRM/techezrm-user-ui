"use client";
import type React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Autocomplete,
} from "@mui/material";
import Image from "next/image";
import { useAppStore } from "@/store/use-app-store";
import { customerAddressHandler } from "@/api/handlers/customerAddressHandler";
import { customerProfileHandler } from "@/api/handlers/customerProfileHandler";
import { useCart } from "@/api/handlers/cartHandler";
import { checkoutSessionsService } from "@/api/services/checkoutSessions";
import type { CustomerAddress } from "@/api/services/customerAddress";
import type { CustomerProfile } from "@/api/services/customerProfile";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import MapSelector from "@/components/MapSelector";

import {
  LocalShipping,
  Payment,
  Security,
  Discount,
  Close,
  Add,
  Save,
  Map,
  LocationOn,
  Business,
  Home,
  Store,
  Public,
} from "@mui/icons-material";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  cardHolderName: string;
  cardNumber: string;
  cvv: string;
  expirationDate: string;
  addressLine1: string;
  city: string;
  state: string;
  landmark: string;
  postalCode: string;
}

interface AddressFormData {
  companyName: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  receiverPhoneCountryCode: string;
  type: "home" | "work" | "other" | "warehouse";
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  isActive: boolean;
  coordinates: {
    latitude: string;
    longitude: string;
  };
}

const CheckoutForm: React.FC = () => {
  const { customer } = useAppStore();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    cardHolderName: "",
    cardNumber: "",
    cvv: "",
    expirationDate: "",
    addressLine1: "",
    city: "",
    state: "",
    landmark: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [customerProfile, setCustomerProfile] =
    useState<CustomerProfile | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<CustomerAddress | null>(
    null
  );
  const [allAddresses, setAllAddresses] = useState<CustomerAddress[]>([]);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string>("");
  const [paymentSuccess, setPaymentSuccess] = useState<string>("");
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const [discount, setDiscount] = useState("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [newAddressData, setNewAddressData] = useState<AddressFormData>({
    companyName: "",
    receiverName: "",
    receiverPhone: "",
    receiverEmail: "",
    receiverPhoneCountryCode: "+1",
    type: "home",
    street: "",
    city: "",
    state: "",
    country: "United States",
    zipCode: "",
    isDefault: false,
    isActive: true,
    coordinates: {
      latitude: "",
      longitude: "",
    },
  });

  // Address type options
  const addressTypes = [
    { value: "home", label: "Home", icon: <Home /> },
    { value: "work", label: "Work", icon: <Business /> },
    { value: "warehouse", label: "Warehouse", icon: <Store /> },
    { value: "other", label: "Other", icon: <Public /> },
  ];

  // Country options
  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Australia",
    "India",
    "China",
    "Japan",
    "Brazil",
  ];

  // Country code options
  const countryCodes = [
    { code: "+1", country: "US/CA" },
    { code: "+44", country: "UK" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" },
    { code: "+61", country: "Australia" },
    { code: "+91", country: "India" },
    { code: "+86", country: "China" },
    { code: "+81", country: "Japan" },
    { code: "+55", country: "Brazil" },
  ];

  // Fetch cart data
  const {
    data: cartResponse,
    isLoading: cartLoading,
    error: cartError,
  } = useCart(customer?.id || "", { enabled: !!customer?.id });

  // Extract cart data
  const cartData = cartResponse?.data?.cart;
  const cartItems = cartData?.items || [];
  const subtotal = cartData?.totalAmount || 0;
  const total = subtotal;

  // Fetch customer profile and default address
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customer?.id) return;

      setLoading(true);
      setError("");

      try {
        // Fetch customer profile
        const profile = await customerProfileHandler.getProfile(customer.id);
        setCustomerProfile(profile);

        // Fetch customer addresses
        const addresses = await customerAddressHandler.getAddresses(
          customer.id
        );
        setAllAddresses(addresses);
        const defaultAddr = addresses.find((addr) => addr.isDefault);
        setDefaultAddress(defaultAddr || null);

        // Auto-fill form with customer data
        if (profile) {
          const nameParts = profile.name?.split(" ") || [];
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          setFormData((prev) => ({
            ...prev,
            firstName,
            lastName,
            email: profile.email || "",
            phoneNumber: profile.phone || "",
            cardHolderName: profile.name || "",
          }));
        }

        // Auto-fill address if default address exists
        if (defaultAddr) {
          setFormData((prev) => ({
            ...prev,
            addressLine1: defaultAddr.street || "",
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            postalCode: defaultAddr.zipCode || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setError(
          "Failed to load customer information. Please fill the form manually."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customer?.id]);

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      setStripe(stripeInstance);
    };

    initializeStripe();
  }, []);

  const handleInputChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleAddressInputChange =
    (field: keyof AddressFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewAddressData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleAddressSelectChange =
    (field: keyof AddressFormData) => (value: any) => {
      setNewAddressData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleCoordinatesChange =
    (field: "latitude" | "longitude") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewAddressData((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [field]: e.target.value,
        },
      }));
    };

  const handleMapSelection = (lat: number, lng: number, address: string) => {
    // Parse the address to extract components
    const addressParts = address.split(", ");
    let street = addressParts[0] || "";
    let city = "";
    let state = "";
    let zipCode = "";
    let country = "United States"; // Default country

    if (addressParts.length >= 2) {
      city = addressParts[1] || "";
    }
    if (addressParts.length >= 3) {
      const stateZip = addressParts[2] || "";
      const stateZipParts = stateZip.split(" ");
      state = stateZipParts[0] || "";
      zipCode = stateZipParts[1] || "";
    }
    if (addressParts.length >= 4) {
      country = addressParts[3] || "United States";
    }

    setNewAddressData((prev) => ({
      ...prev,
      coordinates: {
        latitude: lat.toString(),
        longitude: lng.toString(),
      },
      street: street,
      city: city,
      state: state,
      zipCode: zipCode,
      country: country,
    }));
    setMapModalOpen(false);
  };

  const handleCompletePurchase = async () => {
    if (!customer?.id) {
      setPaymentError("Please log in to complete your purchase.");
      return;
    }

    if (!stripe) {
      setPaymentError("Payment system is not ready. Please try again.");
      return;
    }

    // Validate required fields
    const requiredFields = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      addressLine1: formData.addressLine1,
      city: formData.city,
      state: formData.state,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value?.trim())
      .map(([field]) => field);

    if (missingFields.length > 0) {
      setPaymentError(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setPaymentError("Please enter a valid email address.");
      return;
    }

    setPaymentProcessing(true);
    setPaymentError("");

    try {
      // Generate a unique order ID
      const orderId = `order_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setOrderId(orderId);

      // Calculate total amount including shipping and tax
      const shipping = 5.99;
      const tax = subtotal * 0.08;
      const totalAmount = subtotal + shipping + tax;

      // Create checkout session data
      const checkoutData = {
        customerId: customer.id,
        orderId,
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: "inr",
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        shippingAddress: {
          addressLine1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: "India",
        },
        lineItems: cartItems.map((item) => ({
          price_data: {
            currency: "inr",
            product_data: {
              name: item.productName || "Product",
              description: `Product ID: ${item.product._id}`,
              images: ["/product.png"], // Default product image
            },
            unit_amount: Math.round((item.productPrice || 0) * 100), // Convert to cents
          },
          quantity: item.quantity,
        })),
        mode: "payment" as "payment",
        successUrl: `${window.location.origin}/payment-success?orderId=${orderId}`,
        cancelUrl: `${window.location.origin}/checkout`,
      };

      // Create checkout session
      const checkoutSession =
        await checkoutSessionsService.createCheckoutSession(checkoutData);
      console.log("Checkout session created:", checkoutSession);

      // Redirect to Stripe checkout
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: checkoutSession.sessionId,
        });

        if (error) {
          throw new Error(error.message);
        }
      } else {
        throw new Error("Stripe is not initialized");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again."
      );
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Function to handle address selection
  const handleAddressSelect = (address: CustomerAddress) => {
    setFormData((prev) => ({
      ...prev,
      addressLine1: address.street || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.zipCode || "",
    }));
  };

  const paymentMethods = [
    { name: "Visa", src: "/visa2.png?height=25&width=44&text=VISA" },
    { name: "Stripe", src: "/stripe.png?height=24&width=40&text=stripe" },
    { name: "PayPal", src: "/pp.png?height=24&width=40&text=PayPal" },
    { name: "Mastercard", src: "/mastercard.png?height=24&width=40&text=MC" },
    { name: "Google Pay", src: "/gpay.png?height=24&width=40&text=GPay" },
  ];

  // Common TextField styles
  const textFieldStyles = {
    width: "300px", // Fixed width for all input fields
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
      fontSize: "0.875rem",
      "& fieldset": {
        borderColor: "#e0e0e0",
      },
      "&:hover fieldset": {
        borderColor: "#ccc",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ff6b35",
      },
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#999",
      opacity: 1,
    },
  };

  // Address field styles (full width)
  const addressFieldStyles = {
    width: "100%", // Full width for address field
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
      fontSize: "0.875rem",
      "& fieldset": {
        borderColor: "#e0e0e0",
      },
      "&:hover fieldset": {
        borderColor: "#ccc",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ff6b35",
      },
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#999",
      opacity: 1,
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "#333",
          fontSize: { xs: "1.25rem", md: "1.5rem" },
          mb: 3,
        }}
      >
        Complete your Order
      </Typography>

      {/* Loading State */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
          }}
        >
          <CircularProgress sx={{ color: "#ff6b35" }} />
          <Typography sx={{ ml: 2, color: "#666" }}>
            Loading your information...
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Payment Error Message */}
      {paymentError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {paymentError}
        </Alert>
      )}

      {/* Payment Success Message */}
      {paymentSuccess && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {paymentSuccess}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 4,
        }}
      >
        {/* Left Section - Cart Items & Address Management */}
        <Box sx={{ flex: "1" }}>
          {/* Cart Items Section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: "white",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              mb: 4,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#1e293b",
                fontWeight: 700,
                mb: 3,
                fontSize: "1.25rem",
              }}
            >
              Cart Items ({cartItems.length})
            </Typography>

            {cartLoading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#ff6b35" }} />
                <Typography sx={{ color: "#666", mt: 2 }}>
                  Loading cart items...
                </Typography>
              </Box>
            ) : cartItems.length > 0 ? (
              <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
                {cartItems.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      mb: 2,
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 107, 53, 0.1)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 4px 16px rgba(255, 107, 53, 0.1)",
                        transform: "translateY(-1px)",
                        borderColor: "rgba(255, 107, 53, 0.2)",
                      },
                      "&:last-child": { mb: 0 },
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "10px",
                          overflow: "hidden",
                          flexShrink: 0,
                          border: "2px solid rgba(255, 107, 53, 0.1)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <img
                          src={item?.product?.bannerImage}
                          alt={item.productName || "Product"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: "1", minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: "#1e293b",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            mb: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            lineHeight: 1.3,
                          }}
                        >
                          {item.productName || "Product"}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#64748b",
                            fontSize: "0.75rem",
                            mb: 1,
                            fontFamily: "monospace",
                          }}
                        >
                          ID: {item?.product?._id?.slice(-8) || "N/A"}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#ff6b35",
                              fontSize: "1rem",
                              fontWeight: 700,
                              background:
                                "linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%)",
                              backgroundClip: "text",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            ${item.productPrice || 0}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#64748b",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                              }}
                            >
                              Qty:
                            </Typography>
                            <Box
                              sx={{
                                backgroundColor: "rgba(255, 107, 53, 0.1)",
                                color: "#ff6b35",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                minWidth: "32px",
                                textAlign: "center",
                                border: "1px solid rgba(255, 107, 53, 0.2)",
                              }}
                            >
                              {item.quantity}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography sx={{ color: "#64748b", fontSize: "1rem" }}>
                  No items in cart
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Address Management Section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: "white",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#1e293b",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                }}
              >
                Shipping Address
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  onClick={() => setAddressModalOpen(true)}
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "#ff6b35",
                    color: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#e55a2b",
                    },
                  }}
                >
                  Add New Address
                </Button>
              </Box>
            </Box>

            {/* Address Selection */}
            {!loading && allAddresses.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  sx={{
                    color: "#64748b",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    mb: 2,
                  }}
                >
                  Saved Addresses ({allAddresses.length})
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {allAddresses.map((address, index) => (
                    <Box
                      key={address._id}
                      sx={{
                        p: 3,
                        border: address.isDefault
                          ? "2px solid #ff6b35"
                          : "1px solid #e0e0e0",
                        borderRadius: 2,
                        backgroundColor: address.isDefault
                          ? "rgba(255, 107, 53, 0.05)"
                          : "white",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: address.isDefault
                            ? "rgba(255, 107, 53, 0.1)"
                            : "#f8f9fa",
                          borderColor: "#ff6b35",
                        },
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => handleAddressSelect(address)}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: address.isDefault ? "#ff6b35" : "#333",
                            textTransform: "uppercase",
                          }}
                        >
                          {address.type} Address{" "}
                          {address.isDefault && "(Default)"}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          color: "#333",
                          lineHeight: 1.5,
                        }}
                      >
                        {address.street}
                        <br />
                        {address.city}, {address.state} {address.zipCode}
                        <br />
                        {address.country}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.75rem", color: "#666", mt: 1 }}
                      >
                        Click to use this address
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Manual Address Input */}
            {/* <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                variant="outlined"
                onClick={() => setAddressModalOpen(true)}
                startIcon={<Add />}
                sx={{
                  borderColor: "#ff6b35",
                  color: "#ff6b35",
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                  px: 3,
                  "&:hover": {
                    borderColor: "#e55a2b",
                    backgroundColor: "rgba(255, 107, 53, 0.04)",
                  },
                }}
              >
                Enter Address Manually
              </Button>
            </Box> */}
          </Paper>

          {/* Personal Details Section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: "white",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              mt: 4,
            }}
          >
            <Typography
              sx={{
                color: "#ff6b35",
                fontWeight: 600,
                fontSize: "1rem",
                mb: 3,
              }}
            >
              Personal Details
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
              <Box>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  First name
                </Typography>
                <TextField
                  placeholder="Enter Your First Name"
                  variant="outlined"
                  size="small"
                  value={formData.firstName}
                  onChange={handleInputChange("firstName")}
                  sx={textFieldStyles}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Last name
                </Typography>
                <TextField
                  placeholder="Enter Your Last Name"
                  variant="outlined"
                  size="small"
                  value={formData.lastName}
                  onChange={handleInputChange("lastName")}
                  sx={textFieldStyles}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Email
                </Typography>
                <TextField
                  placeholder="Enter Your Email"
                  variant="outlined"
                  size="small"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  sx={textFieldStyles}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  Phone number
                </Typography>
                <TextField
                  placeholder="Enter Your Phone Number"
                  variant="outlined"
                  size="small"
                  value={formData.phoneNumber}
                  onChange={handleInputChange("phoneNumber")}
                  sx={textFieldStyles}
                />
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right Section - Coupon & Pricing */}
        <Box sx={{ width: { xs: "100%", lg: "400px" }, flexShrink: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              borderRadius: 3,
              border: "1px solid #475569",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
              position: "sticky",
              top: 24,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "white",
                mb: 3,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Order Summary
            </Typography>

            {/* Coupon Section */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Discount sx={{ color: "#10b981", fontSize: 18 }} />
                <Typography
                  sx={{
                    color: "#e2e8f0",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Apply Coupon
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="Enter coupon code"
                variant="outlined"
                size="small"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "0.875rem",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "white",
                    "& fieldset": {
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: 2,
                    },
                    "&:hover fieldset": {
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused fieldset": {
                      border: "2px solid #ff6b35",
                    },
                    "& input": {
                      color: "white",
                      "&::placeholder": {
                        color: "rgba(255, 255, 255, 0.6)",
                        opacity: 1,
                      },
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#10b981",
                  color: "white",
                  mt: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#059669",
                  },
                }}
              >
                Apply Coupon
              </Button>
            </Box>

            {/* Price Breakdown */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "#cbd5e1",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                >
                  Subtotal
                </Typography>
                <Typography
                  sx={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}
                >
                  ${subtotal.toFixed(2)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "#cbd5e1",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                >
                  Shipping
                </Typography>
                <Typography
                  sx={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}
                >
                  $5.99
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "#cbd5e1",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                >
                  Tax
                </Typography>
                <Typography
                  sx={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}
                >
                  ${(subtotal * 0.08).toFixed(2)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "#cbd5e1",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                >
                  Discount
                </Typography>
                <Typography
                  sx={{ color: "#10b981", fontSize: "1.1rem", fontWeight: 700 }}
                >
                  -$0.00
                </Typography>
              </Box>

              <Divider
                sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.2)" }}
              />

              {/* Total */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Typography
                  sx={{ color: "white", fontSize: "1.2rem", fontWeight: 700 }}
                >
                  Total
                </Typography>
                <Typography
                  sx={{ color: "#ff6b35", fontSize: "1.4rem", fontWeight: 800 }}
                >
                  ${(subtotal + 5.99 + subtotal * 0.08).toFixed(2)}
                </Typography>
              </Box>

              {/* Trust Indicators */}
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#94a3b8", fontSize: "0.75rem", mb: 1 }}
                >
                  🔒 Secure Payment • 🚚 Fast Delivery • 💯 Quality Guarantee
                </Typography>
              </Box>

              {/* Payment Methods */}
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#94a3b8", fontSize: "0.75rem", mb: 2 }}
                >
                  Accepted Payment Methods
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {paymentMethods.map((method, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 40,
                        height: 25,
                        borderRadius: 1,
                        overflow: "hidden",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <img
                        src={method.src}
                        alt={method.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          backgroundColor: "white",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Continue to Payment Button */}
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleCompletePurchase}
                disabled={loading || paymentProcessing}
                startIcon={
                  loading || paymentProcessing ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
                fullWidth
                sx={{
                  backgroundColor: "#ff6b35",
                  color: "white",
                  py: 2,
                  fontSize: "1rem",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "0 8px 25px rgba(255, 107, 53, 0.3)",
                  "&:hover": {
                    backgroundColor: "#e55a2b",
                    boxShadow: "0 12px 35px rgba(255, 107, 53, 0.4)",
                  },
                  "&:disabled": {
                    backgroundColor: "#ccc",
                    boxShadow: "none",
                  },
                }}
              >
                {loading
                  ? "Loading..."
                  : paymentProcessing
                  ? "Creating Checkout Session..."
                  : "Proceed to Checkout"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Address Modal */}
      <Dialog
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#ff6b35",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
            px: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <LocalShipping sx={{ fontSize: 20 }} />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: "1rem" }}
            >
              Enter Shipping Address
            </Typography>
          </Box>
          <IconButton
            onClick={() => setAddressModalOpen(false)}
            sx={{ color: "white", p: 0.5 }}
            size="small"
          >
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, maxHeight: "80vh", overflowY: "auto" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Company Name */}
            <Box>
              <Typography
                sx={{
                  color: "#333",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Company Name *
              </Typography>
              <TextField
                placeholder="Enter Company Name"
                variant="outlined"
                fullWidth
                value={newAddressData.companyName}
                onChange={handleAddressInputChange("companyName")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    fontSize: "0.875rem",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ccc",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff6b35",
                    },
                  },
                }}
              />
            </Box>

            {/* Receiver Information Row */}
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Receiver Name *
                </Typography>
                <TextField
                  placeholder="Enter Receiver Name"
                  variant="outlined"
                  fullWidth
                  value={newAddressData.receiverName}
                  onChange={handleAddressInputChange("receiverName")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ccc",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Receiver Email *
                </Typography>
                <TextField
                  placeholder="Enter Receiver Email"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={newAddressData.receiverEmail}
                  onChange={handleAddressInputChange("receiverEmail")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ccc",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Phone Number Row */}
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ flex: 0.3 }}>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Country Code *
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={newAddressData.receiverPhoneCountryCode}
                    onChange={(e) =>
                      handleAddressSelectChange("receiverPhoneCountryCode")(
                        e.target.value
                      )
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        fontSize: "0.875rem",
                        "& fieldset": {
                          borderColor: "#e0e0e0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ccc",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ff6b35",
                        },
                      },
                    }}
                  >
                    {countryCodes.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.code} ({country.country})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: 0.7 }}>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Phone Number *
                </Typography>
                <TextField
                  placeholder="Enter Phone Number"
                  variant="outlined"
                  fullWidth
                  value={newAddressData.receiverPhone}
                  onChange={handleAddressInputChange("receiverPhone")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ccc",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Address Type */}
            <Box>
              <Typography
                sx={{
                  color: "#333",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Address Type *
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {addressTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={
                      newAddressData.type === type.value
                        ? "contained"
                        : "outlined"
                    }
                    startIcon={type.icon}
                    onClick={() =>
                      handleAddressSelectChange("type")(type.value)
                    }
                    sx={{
                      borderColor: "#ff6b35",
                      color:
                        newAddressData.type === type.value
                          ? "white"
                          : "#ff6b35",
                      backgroundColor:
                        newAddressData.type === type.value
                          ? "#ff6b35"
                          : "transparent",
                      textTransform: "none",
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "#e55a2b",
                        backgroundColor:
                          newAddressData.type === type.value
                            ? "#e55a2b"
                            : "rgba(255, 107, 53, 0.04)",
                      },
                    }}
                  >
                    {type.label}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Street Address with Map Button */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  Street Address *
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Map />}
                  onClick={() => setMapModalOpen(true)}
                  sx={{
                    borderColor: "#ff6b35",
                    color: "#ff6b35",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2,
                    py: 0.5,
                    fontSize: "0.75rem",
                    "&:hover": {
                      borderColor: "#e55a2b",
                      backgroundColor: "rgba(255, 107, 53, 0.04)",
                    },
                  }}
                >
                  Choose on Map
                </Button>
              </Box>
              <TextField
                placeholder="Enter Street Address"
                variant="outlined"
                fullWidth
                value={newAddressData.street}
                onChange={handleAddressInputChange("street")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    fontSize: "0.875rem",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ccc",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff6b35",
                    },
                  },
                }}
              />
            </Box>

            {/* City, State, Country Row */}
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  City *
                </Typography>
                <TextField
                  placeholder="Enter City"
                  variant="outlined"
                  fullWidth
                  value={newAddressData.city}
                  onChange={handleAddressInputChange("city")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ccc",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  State *
                </Typography>
                <TextField
                  placeholder="Enter State"
                  variant="outlined"
                  fullWidth
                  value={newAddressData.state}
                  onChange={handleAddressInputChange("state")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ccc",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Country and ZIP Code Row */}
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Country *
                </Typography>
                <Autocomplete
                  options={countries}
                  value={newAddressData.country}
                  onChange={(_, value) =>
                    handleAddressSelectChange("country")(value || "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Country"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          fontSize: "0.875rem",
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#ccc",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#ff6b35",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  ZIP Code *
                </Typography>
                <TextField
                  placeholder="Enter ZIP Code"
                  variant="outlined"
                  fullWidth
                  value={newAddressData.zipCode}
                  onChange={handleAddressInputChange("zipCode")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ccc",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Coordinates Row */}
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Latitude
                </Typography>
                <TextField
                  placeholder="Enter Latitude"
                  variant="outlined"
                  fullWidth
                  value={newAddressData.coordinates.latitude}
                  onChange={handleCoordinatesChange("latitude")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ccc",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Longitude
                </Typography>
                <TextField
                  placeholder="Enter Longitude"
                  variant="outlined"
                  fullWidth
                  value={newAddressData.coordinates.longitude}
                  onChange={handleCoordinatesChange("longitude")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ccc",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Options Row */}
            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newAddressData.isDefault}
                    onChange={(e) =>
                      handleAddressSelectChange("isDefault")(e.target.checked)
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#ff6b35",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#ff6b35",
                        },
                    }}
                  />
                }
                label="Set as Default Address"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#333",
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newAddressData.isActive}
                    onChange={(e) =>
                      handleAddressSelectChange("isActive")(e.target.checked)
                    }
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#ff6b35",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#ff6b35",
                        },
                    }}
                  />
                }
                label="Active Address"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#333",
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setAddressModalOpen(false)}
            sx={{
              borderColor: "#ddd",
              color: "#666",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              px: 2.5,
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setAddressModalOpen(false)}
            startIcon={<Save sx={{ fontSize: 16 }} />}
            sx={{
              backgroundColor: "#ff6b35",
              color: "white",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              px: 2.5,
              py: 1,
              "&:hover": {
                backgroundColor: "#e55a2b",
              },
            }}
          >
            Save Address
          </Button>
        </DialogActions>
      </Dialog>

      {/* Google Maps Modal */}
      <Dialog
        open={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            height: "80vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#ff6b35",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
            px: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Map sx={{ fontSize: 20 }} />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: "1rem" }}
            >
              Choose Location on Map
            </Typography>
          </Box>
          <IconButton
            onClick={() => setMapModalOpen(false)}
            sx={{ color: "white", p: 0.5 }}
            size="small"
          >
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, height: "100%" }}>
          <MapSelector
            onLocationSelect={handleMapSelection}
            initialCenter={{
              lat: newAddressData.coordinates.latitude
                ? parseFloat(newAddressData.coordinates.latitude)
                : 40.7128,
              lng: newAddressData.coordinates.longitude
                ? parseFloat(newAddressData.coordinates.longitude)
                : -74.006,
            }}
            height="100%"
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setMapModalOpen(false)}
            sx={{
              borderColor: "#ddd",
              color: "#666",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              px: 2.5,
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setMapModalOpen(false)}
            startIcon={<LocationOn sx={{ fontSize: 16 }} />}
            sx={{
              backgroundColor: "#ff6b35",
              color: "white",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              px: 2.5,
              py: 1,
              "&:hover": {
                backgroundColor: "#e55a2b",
              },
            }}
          >
            Use Current Location
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CheckoutForm;
