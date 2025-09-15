"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import {
  Person,
  Business,
  Phone,
  Language,
  Description,
  Save,
  BusinessCenter,
  LocationOn,
  AttachMoney,
  Group,
} from "@mui/icons-material";
import { customerProfileHandler } from "@/api/handlers/customerProfileHandler";
import type {
  UpdateProfileRequest,
  CustomerProfile,
} from "@/api/services/customerProfile";

interface ProfileUpdateFormProps {
  customerId: string;
  initialData?: CustomerProfile;
  onSuccess?: (updatedProfile: CustomerProfile) => void;
}

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({
  customerId,
  initialData,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: "",
    phone: "",
    companyName: "",
    companyAddress: "",
    businessType: "",
    annualRevenue: "",
    employeeCount: "",
    website: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  interface Profile {
    name: string;
    phone: string;
    companyName: string;
    companyAddress: string;
    businessType: string;
    annualRevenue: string;
    employeeCount: string;
    website: string;
    description: string;
  }

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customerId) return;
      setLoading(true);
      setError("");

      try {
        const data = await customerProfileHandler.getProfile(customerId);
        setProfile(data);
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
  }, [customerId]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        companyName: profile.companyName || "",
        companyAddress: profile.companyAddress || "",
        businessType: profile.businessType || "",
        annualRevenue: profile.annualRevenue || "",
        employeeCount: profile.employeeCount || "",
        website: profile.website || "",
        description: profile.description || "",
      });
    }
  }, [profile]);

  const handleInputChange = (
    field: keyof UpdateProfileRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website =
        "Please enter a valid website URL (include http:// or https://)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const updatedProfile = await customerProfileHandler.updateProfile(
        customerId,
        formData
      );

      setSuccess(true);
      if (onSuccess) {
        onSuccess(updatedProfile);
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    "Manufacturing",
    "Retail",
    "Wholesale",
    "Healthcare",
    "Technology",
    "Food & Beverage",
    "Cosmetics",
    "Pharmaceuticals",
    "Agriculture",
    "Other",
  ];

  const revenueRanges = [
    "Under $100K",
    "$100K - $500K",
    "$500K - $1M",
    "$1M - $5M",
    "$5M - $10M",
    "$10M - $50M",
    "$50M+",
  ];

  const employeeRanges = [
    "1-10",
    "11-50",
    "51-100",
    "101-250",
    "251-500",
    "501-1000",
    "1000+",
  ];

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", px: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#2c3e50",
            mb: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontSize: "1.5rem",
          }}
        >
          <Person sx={{ color: "#ff6b35", fontSize: 24 }} />
          Profile Information
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#7f8c8d",
            lineHeight: 1.5,
            fontSize: "0.875rem",
            fontWeight: 400,
          }}
        >
          Update your personal and business information to help us provide
          better service
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Profile updated successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Personal Information Section */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #f0f0f0",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}
            >
              <Person sx={{ color: "#ff6b35", fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#2c3e50",
                  fontSize: "1rem",
                }}
              >
                Personal Information
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                  required
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Person sx={{ mr: 1, color: "#7f8c8d", fontSize: 18 }} />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fafafa",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e8e8e8",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#d0d0d0",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      color: "#7f8c8d",
                    },
                    "& .MuiFormHelperText-root": {
                      fontSize: "0.75rem",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Phone sx={{ mr: 1, color: "#7f8c8d", fontSize: 18 }} />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fafafa",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e8e8e8",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#d0d0d0",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      color: "#7f8c8d",
                    },
                    "& .MuiFormHelperText-root": {
                      fontSize: "0.75rem",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Business Information Section */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #f0f0f0",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}
            >
              <Business sx={{ color: "#ff6b35", fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#2c3e50",
                  fontSize: "1rem",
                }}
              >
                Business Information
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Company Name"
                  value={formData.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Business
                        sx={{ mr: 1, color: "#7f8c8d", fontSize: 18 }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fafafa",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e8e8e8",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#d0d0d0",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      color: "#7f8c8d",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: "0.875rem", color: "#7f8c8d" }}>
                    Business Type
                  </InputLabel>
                  <Select
                    value={formData.businessType}
                    onChange={(e) =>
                      handleInputChange("businessType", e.target.value)
                    }
                    label="Business Type"
                    startAdornment={
                      <BusinessCenter
                        sx={{ mr: 1, color: "#7f8c8d", fontSize: 18 }}
                      />
                    }
                    sx={{
                      backgroundColor: "#fafafa",
                      fontSize: "0.875rem",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e8e8e8",
                        borderWidth: "1px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d0d0d0",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff6b35",
                        borderWidth: "2px",
                      },
                    }}
                  >
                    {businessTypes.map((type) => (
                      <MenuItem
                        key={type}
                        value={type}
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Company Address"
                  value={formData.companyAddress}
                  onChange={(e) =>
                    handleInputChange("companyAddress", e.target.value)
                  }
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <LocationOn
                        sx={{ mr: 1, color: "#7f8c8d", mt: 1, fontSize: 18 }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fafafa",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e8e8e8",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#d0d0d0",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      color: "#7f8c8d",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: "0.875rem", color: "#7f8c8d" }}>
                    Annual Revenue
                  </InputLabel>
                  <Select
                    value={formData.annualRevenue}
                    onChange={(e) =>
                      handleInputChange("annualRevenue", e.target.value)
                    }
                    label="Annual Revenue"
                    startAdornment={
                      <AttachMoney
                        sx={{ mr: 1, color: "#7f8c8d", fontSize: 18 }}
                      />
                    }
                    sx={{
                      backgroundColor: "#fafafa",
                      fontSize: "0.875rem",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e8e8e8",
                        borderWidth: "1px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d0d0d0",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff6b35",
                        borderWidth: "2px",
                      },
                    }}
                  >
                    {revenueRanges.map((range) => (
                      <MenuItem
                        key={range}
                        value={range}
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {range}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: "0.875rem", color: "#7f8c8d" }}>
                    Employee Count
                  </InputLabel>
                  <Select
                    value={formData.employeeCount}
                    onChange={(e) =>
                      handleInputChange("employeeCount", e.target.value)
                    }
                    label="Employee Count"
                    startAdornment={
                      <Group sx={{ mr: 1, color: "#7f8c8d", fontSize: 18 }} />
                    }
                    sx={{
                      backgroundColor: "#fafafa",
                      fontSize: "0.875rem",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e8e8e8",
                        borderWidth: "1px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d0d0d0",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff6b35",
                        borderWidth: "2px",
                      },
                    }}
                  >
                    {employeeRanges.map((range) => (
                      <MenuItem
                        key={range}
                        value={range}
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {range}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  error={!!errors.website}
                  helperText={errors.website}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Language
                        sx={{ mr: 1, color: "#7f8c8d", fontSize: 18 }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fafafa",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e8e8e8",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#d0d0d0",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      color: "#7f8c8d",
                    },
                    "& .MuiFormHelperText-root": {
                      fontSize: "0.75rem",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Business Description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <Description
                        sx={{ mr: 1, color: "#7f8c8d", mt: 1, fontSize: 18 }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fafafa",
                      fontSize: "0.875rem",
                      "& fieldset": {
                        borderColor: "#e8e8e8",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#d0d0d0",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ff6b35",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: "0.875rem",
                      color: "#7f8c8d",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={16} />
              ) : (
                <Save sx={{ fontSize: 18 }} />
              )
            }
            sx={{
              background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #e55a2b 0%, #ff6b35 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 20px rgba(255, 107, 53, 0.25)",
              },
              "&:disabled": {
                background: "#bdc3c7",
                color: "#7f8c8d",
              },
              textTransform: "none",
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 500,
              fontSize: "0.9rem",
              transition: "all 0.2s ease",
              minWidth: 160,
            }}
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProfileUpdateForm;
