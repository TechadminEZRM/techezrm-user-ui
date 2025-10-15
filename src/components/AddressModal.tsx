"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import {
  LocalShipping,
  Close,
  Save,
  Map,
  Home,
  Business,
  Store,
} from "@mui/icons-material";
import MapSelector from "@/components/MapSelector";
import {
  customerAddressService,
  AddAddressRequest,
} from "@/api/services/customerAddress";

interface AddressFormData {
  companyName: string;
  receiverName: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverPhoneCountryCode: string;
  type: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  isDefault: boolean;
  isActive: boolean;
}

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (addressData: AddressFormData) => void;
  initialData?: Partial<AddressFormData>;
  customerId?: string;
  editingAddressId?: string;
}

const AddressModal: React.FC<AddressModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  customerId,
  editingAddressId,
}) => {
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [addressData, setAddressData] = useState<AddressFormData>({
    companyName: "",
    receiverName: "",
    receiverEmail: "",
    receiverPhone: "",
    receiverPhoneCountryCode: "+1",
    type: "home",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    coordinates: {
      latitude: "",
      longitude: "",
    },
    isDefault: false,
    isActive: true,
    ...initialData,
  });
  useEffect(() => {
    if (initialData) {
      setAddressData({
        companyName: "",
        receiverName: "",
        receiverEmail: "",
        receiverPhone: "",
        receiverPhoneCountryCode: "+1",
        type: "home",
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        coordinates: {
          latitude: "",
          longitude: "",
        },
        isDefault: false,
        isActive: true,
        ...initialData, // merge
      });
    } else {
      setAddressData({
        companyName: "",
        receiverName: "",
        receiverEmail: "",
        receiverPhone: "",
        receiverPhoneCountryCode: "+1",
        type: "home",
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        coordinates: {
          latitude: "",
          longitude: "",
        },
        isDefault: false,
        isActive: true,
      });
    }
  }, [initialData]);
  


  // Address type options
  const addressTypes = [
    { value: "home", label: "Home", icon: <Home /> },
    { value: "business", label: "Business", icon: <Business /> },
    { value: "warehouse", label: "Warehouse", icon: <Store /> },
  ];

  // Country options
  const countries = [
    "Argentina",
    "Australia",
    "Austria",
    "Belgium",
    "Brazil",
    "Canada",
    "China",
    "Czech Republic",
    "Denmark",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "India",
    "Italy",
    "Japan",
    "Mexico",
    "Netherlands",
    "New Zealand",
    "Norway",
    "Poland",
    "Portugal",
    "Singapore",
    "South Korea",
    "Spain",
    "Sweden",
    "Switzerland",
    "United Kingdom",
    "United States",
  ];
  

  // Country code options
  const countryCodes = [
    { code: "+54", country: "Argentina" },
    { code: "+61", country: "Australia" },
    { code: "+43", country: "Austria" },
    { code: "+32", country: "Belgium" },
    { code: "+55", country: "Brazil" },
    { code: "+86", country: "China" },
    { code: "+420", country: "Czech Republic" },
    { code: "+45", country: "Denmark" },
    { code: "+358", country: "Finland" },
    { code: "+33", country: "France" },
    { code: "+49", country: "Germany" },
    { code: "+30", country: "Greece" },
    { code: "+36", country: "Hungary" },
    { code: "+91", country: "India" },
    { code: "+39", country: "Italy" },
    { code: "+81", country: "Japan" },
    { code: "+52", country: "Mexico" },
    { code: "+31", country: "Netherlands" },
    { code: "+64", country: "New Zealand" },
    { code: "+47", country: "Norway" },
    { code: "+48", country: "Poland" },
    { code: "+351", country: "Portugal" },
    { code: "+65", country: "Singapore" },
    { code: "+82", country: "South Korea" },
    { code: "+34", country: "Spain" },
    { code: "+46", country: "Sweden" },
    { code: "+41", country: "Switzerland" },
    { code: "+44", country: "UK" },
    { code: "+1", country: "US/CA" },
  ];
  
  const handleInputChange =
    (field: keyof AddressFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddressData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSelectChange = (field: keyof AddressFormData) => (value: any) => {
    setAddressData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCoordinatesChange =
    (field: "latitude" | "longitude") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddressData((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [field]: e.target.value,
        },
      }));
    };

  const handleMapSelection = (lat: number, lng: number, address: string) => {
    setAddressData((prev) => ({
      ...prev,
      coordinates: {
        latitude: lat.toString(),
        longitude: lng.toString(),
      },
      street: address,
    }));
    setMapModalOpen(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Validate required fields
      if (
        !addressData.companyName ||
        !addressData.receiverName ||
        !addressData.receiverEmail ||
        !addressData.receiverPhone ||
        !addressData.street ||
        !addressData.city ||
        !addressData.state ||
        !addressData.country ||
        !addressData.zipCode
      ) {
        setError("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

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

      // If onSave callback is provided, use it (for hook-based approach)
      if (onSave) {
        await onSave(addressData);
        onClose();
      } else if (customerId) {
        // Fallback to direct API call if no callback provided
        let result;
        if (editingAddressId) {
          // Update existing address
          result = await customerAddressService.updateAddress(
            customerId,
            editingAddressId,
            addressRequest
          );
        } else {
          // Add new address
          result = await customerAddressService.addAddress(
            customerId,
            addressRequest
          );
        }

        if (result.success) {
          onClose();
        } else {
          setError("Failed to save address");
        }
      } else {
        setError("Customer ID is required");
      }
    } catch (err) {
      console.error("Error saving address:", err);
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
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
            onClick={onClose}
            sx={{ color: "white", p: 0.5 }}
            size="small"
          >
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, maxHeight: "80vh", overflowY: "auto" }}>
          {error && (
            <Box
              sx={{
                backgroundColor: "#ffebee",
                color: "#c62828",
                p: 2,
                borderRadius: 1,
                mb: 2,
                border: "1px solid #ffcdd2",
              }}
            >
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}
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
                value={addressData.companyName}
                onChange={handleInputChange("companyName")}
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
                  value={addressData.receiverName}
                  onChange={handleInputChange("receiverName")}
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
                  value={addressData.receiverEmail}
                  onChange={handleInputChange("receiverEmail")}
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
                    value={addressData.receiverPhoneCountryCode}
                    onChange={(e) =>
                      handleSelectChange("receiverPhoneCountryCode")(
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
                  value={addressData.receiverPhone}
                  onChange={handleInputChange("receiverPhone")}
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
                      addressData.type === type.value ? "contained" : "outlined"
                    }
                    startIcon={type.icon}
                    onClick={() => handleSelectChange("type")(type.value)}
                    sx={{
                      borderColor: "#ff6b35",
                      color:
                        addressData.type === type.value ? "white" : "#ff6b35",
                      backgroundColor:
                        addressData.type === type.value
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
                          addressData.type === type.value
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
                value={addressData.street}
                onChange={handleInputChange("street")}
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
                  value={addressData.city}
                  onChange={handleInputChange("city")}
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
                  value={addressData.state}
                  onChange={handleInputChange("state")}
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
                  value={addressData.country}
                  onChange={(_, value) =>
                    handleSelectChange("country")(value || "")
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
                  value={addressData.zipCode}
                  onChange={handleInputChange("zipCode")}
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
                  value={addressData.coordinates.latitude}
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
                  value={addressData.coordinates.longitude}
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
                    checked={addressData.isDefault}
                    onChange={(e) =>
                      handleSelectChange("isDefault")(e.target.checked)
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
                    checked={addressData.isActive}
                    onChange={(e) =>
                      handleSelectChange("isActive")(e.target.checked)
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
            onClick={onClose}
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
            onClick={handleSave}
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Save sx={{ fontSize: 16 }} />
              )
            }
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
              "&:disabled": {
                backgroundColor: "#ccc",
              },
            }}
          >
            {isLoading
              ? "Saving..."
              : editingAddressId
              ? "Update Address"
              : "Save Address"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Map Modal */}
      <Dialog
        open={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        maxWidth="lg"
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
            <Map sx={{ fontSize: 20 }} />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: "1rem" }}
            >
              Select Location on Map
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

        <DialogContent sx={{ p: 0 }}>
          <MapSelector
            onLocationSelect={handleMapSelection}
            initialCenter={{
              lat: addressData.coordinates.latitude
                ? parseFloat(addressData.coordinates.latitude)
                : 40.7128,
              lng: addressData.coordinates.longitude
                ? parseFloat(addressData.coordinates.longitude)
                : -74.006,
            }}
            height="500px"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddressModal;
