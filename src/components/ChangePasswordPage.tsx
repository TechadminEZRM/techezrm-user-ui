"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock,
  Security,
  CheckCircle,
} from "@mui/icons-material";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  message: string;
  color: string;
}

interface ChangePasswordPageProps {
  onPasswordChange?: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const ChangePasswordPage: React.FC<ChangePasswordPageProps> = ({
  onPasswordChange,
}) => {
  const [formData, setFormData] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleInputChange = (field: keyof PasswordForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Clear API error when user modifies form
    if (apiError) {
      setApiError("");
    }

    // Clear success state when user modifies form
    if (success) {
      setSuccess(false);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, message: "", color: "#e0e0e0" };
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        return { score, message: "Very Weak", color: "#f44336" };
      case 2:
        return { score, message: "Weak", color: "#ff9800" };
      case 3:
        return { score, message: "Fair", color: "#ffc107" };
      case 4:
        return { score, message: "Good", color: "#8bc34a" };
      case 5:
        return { score, message: "Strong", color: "#4caf50" };
      default:
        return { score: 0, message: "", color: "#e0e0e0" };
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Current password validation
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    // New password validation
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      if (onPasswordChange) {
        await onPasswordChange(formData.currentPassword, formData.newPassword);
      }

      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      setApiError(
        error?.message || "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  const passwordRequirements = [
    { met: formData.newPassword.length >= 8, text: "At least 8 characters" },
    { met: /[a-z]/.test(formData.newPassword), text: "One lowercase letter" },
    { met: /[A-Z]/.test(formData.newPassword), text: "One uppercase letter" },
    { met: /[0-9]/.test(formData.newPassword), text: "One number" },
    {
      met: /[^A-Za-z0-9]/.test(formData.newPassword),
      text: "One special character",
    },
  ];

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      {/* Header */}
      {/* <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
          Change Password
        </Typography>
        <Typography variant="body1" sx={{ color: "#666" }}>
          Update your password to keep your account secure
        </Typography>
      </Box> */}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3, borderRadius: 2 }}
          icon={<CheckCircle />}
        >
          Password changed successfully! Please use your new password for future
          logins.
        </Alert>
      )}

      {apiError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {apiError}
        </Alert>
      )}

      {/* Change Password Form */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Lock sx={{ color: "#ff6b35" }} />
            Password Update
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Current Password */}
              <TextField
                label="Current Password"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                error={!!errors.currentPassword}
                helperText={errors.currentPassword}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("current")}
                        edge="end"
                        size="small"
                      >
                        {showPasswords.current ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#c0c0c0",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff6b35",
                    },
                  },
                }}
              />

              <Divider />

              {/* New Password */}
              <TextField
                label="New Password"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("new")}
                        edge="end"
                        size="small"
                      >
                        {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#c0c0c0",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff6b35",
                    },
                  },
                }}
              />

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <Box sx={{ mt: -1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Password Strength:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: passwordStrength.color, fontWeight: 600 }}
                    >
                      {passwordStrength.message}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      height: 4,
                      backgroundColor: "#e0e0e0",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        height: "100%",
                        backgroundColor: passwordStrength.color,
                        transition: "all 0.3s ease",
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* Password Requirements */}
              {formData.newPassword && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                    Password Requirements:
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    {passwordRequirements.map((req, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CheckCircle
                          sx={{
                            fontSize: 16,
                            color: req.met ? "#4caf50" : "#e0e0e0",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: req.met ? "#4caf50" : "#999",
                          }}
                        >
                          {req.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Confirm Password */}
              <TextField
                label="Confirm New Password"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("confirm")}
                        edge="end"
                        size="small"
                      >
                        {showPasswords.confirm ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#c0c0c0",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff6b35",
                    },
                  },
                }}
              />

              {/* Security Tips */}
              <Box
                sx={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                  p: 3,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Security sx={{ fontSize: 18, color: "#ff6b35" }} />
                  Security Tips
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0, color: "#666" }}>
                  <li>Use a unique password for your account</li>
                  <li>Avoid using personal information in passwords</li>
                  <li>Consider using a password manager</li>
                  <li>
                    Change your password if you suspect it's been compromised
                  </li>
                </Box>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: "#ff6b35",
                  "&:hover": {
                    backgroundColor: "#e55a2b",
                  },
                  "&:disabled": {
                    backgroundColor: "#e0e0e0",
                  },
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Updating Password...
                  </Box>
                ) : (
                  "Update Password"
                )}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePasswordPage;
