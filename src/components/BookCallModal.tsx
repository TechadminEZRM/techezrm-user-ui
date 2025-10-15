import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useBookACallQuery } from "@/api/handlers";

interface BookCallModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const BookCallModal: React.FC<BookCallModalProps> = ({
  open,
  onClose,
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    mode: "call",
    purpose: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const submitMutation = useBookACallQuery();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const formatPhone = (value: string) => value.replace(/\D/g, "").slice(0, 10);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.mobile.trim()) newErrors.mobile = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.mobile))
      newErrors.mobile = "Enter a valid 10-digit number";
    if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await submitMutation.mutateAsync(formData);
      if (response.success) {
        setFormData({
          name: "",
          email: "",
          mobile: "",
          mode: "call",
          purpose: "",
          date: "",
          time: "",
        });
        onSuccess?.();
        onClose();
      } else {
        onError?.(response.message || "Failed to book call");
      }
    } catch {
      onError?.("Failed to book call. Please try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          background: "linear-gradient(135deg, #8B3E2F 0%, #A0522D 100%)",
          boxShadow: "0 8px 32px rgba(139, 62, 47, 0.3)",
          maxWidth: 700, // increased width
          width: "100%",
          p: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "white",
          fontWeight: 600,
          textAlign: "center",
          fontSize: "1.7rem",
        }}
      >
        Book a Call
      </DialogTitle>
      <DialogContent>
        {submitMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to submit. Please try again.
          </Alert>
        )}

        {submitMutation.isSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Thank you! Your booking has been received.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            {/* Name & Email Row */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={labelStyle}>Name</Typography>
                <TextField
                  fullWidth
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={inputStyles}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={labelStyle}>Email</Typography>
                <TextField
                  fullWidth
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={inputStyles}
                />
              </Box>
            </Box>

            {/* Phone & Mode Row */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={labelStyle}>Phone Number</Typography>
                <TextField
                  fullWidth
                  value={formData.mobile}
                  onChange={(e) =>
                    handleInputChange("mobile", formatPhone(e.target.value))
                  }
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  placeholder="9876501234"
                  sx={inputStyles}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={labelStyle}>Mode</Typography>
                <TextField
                  select
                  fullWidth
                  value={formData.mode}
                  onChange={(e) => handleInputChange("mode", e.target.value)}
                  sx={inputStyles}
                >
                  <MenuItem value="call">Call</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                </TextField>
              </Box>
            </Box>

            {/* Purpose */}
            <Box>
              <Typography sx={labelStyle}>Purpose</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={formData.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
                error={!!errors.purpose}
                helperText={errors.purpose}
                placeholder="Please describe the purpose of the call..."
                sx={inputStyles}
              />
            </Box>

            {/* Date & Time */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={labelStyle}>Date</Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  error={!!errors.date}
                  helperText={errors.date}
                  InputLabelProps={{ shrink: true }}
                  sx={inputStyles}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={labelStyle}>Time</Typography>
                <TextField
                  type="time"
                  fullWidth
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  error={!!errors.time}
                  helperText={errors.time}
                  InputLabelProps={{ shrink: true }}
                  sx={inputStyles}
                />
              </Box>
            </Box>

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              disabled={submitMutation.isPending}
              sx={{
                backgroundColor: "white",
                color: "#8B3E2F",
                fontWeight: 600,
                fontSize: "16px",
                padding: "12px 24px",
                borderRadius: "25px",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                },
                "&:disabled": {
                  backgroundColor: "rgba(255,255,255,0.5)",
                  color: "rgba(139,62,47,0.5)",
                },
              }}
            >
              {submitMutation.isPending ? (
                <CircularProgress size={20} sx={{ color: "#8B3E2F" }} />
              ) : (
                "Book a Call"
              )}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Reused styles
const inputStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
    "&.Mui-focused fieldset": { borderColor: "white" },
  },
  "& .MuiInputBase-input": {
    color: "white",
    "&::placeholder": { color: "rgba(255,255,255,0.7)" },
  },
  "& .MuiFormHelperText-root": { color: "#ffcdd2" },
};

const labelStyle = {
  color: "rgba(255,255,255,0.9)",
  fontSize: "14px",
  fontWeight: 500,
  mb: 1,
};

export default BookCallModal;
