"use client";

import React from "react";
import { Box, Typography, Modal, IconButton, Button } from "@mui/material";
import { Support, Close, WhatsApp, Email, Phone } from "@mui/icons-material";

interface ContactSupportModalProps {
  open: boolean;
  onClose: () => void;
}

const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  open,
  onClose,
}) => {
  const handleWhatsAppClick = () => {
    if (typeof window === "undefined") return;

    const phoneNumber = "+1234567890"; // Replace with actual WhatsApp number
    const message = "Hello, I need support with my order.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailClick = () => {
    if (typeof window === "undefined") return;

    const email = "support@ezrm.com"; // Replace with actual support email
    const subject = "Order Support Request";
    const body = "Hello, I need support with my order.";
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handlePhoneClick = () => {
    if (typeof window === "undefined") return;

    const phoneNumber = "+1234567890"; // Replace with actual support phone
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="contact-support-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          width: { xs: "95%", sm: "500px", md: "600px" },
          maxWidth: 600,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f8f9fa",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Support sx={{ color: "#ff6b35", fontSize: 28 }} />
            <Box>
              <Typography variant="h5" fontWeight="600" color="#1a365d">
                Contact Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We're here to help you
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#666",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Choose your preferred way to get in touch with our support team
          </Typography>

          {/* Contact Options */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: 4,
            }}
          >
            {/* WhatsApp */}
            <Button
              variant="outlined"
              fullWidth
              startIcon={<WhatsApp sx={{ color: "#25D366" }} />}
              onClick={handleWhatsAppClick}
              sx={{
                p: 2,
                borderColor: "#25D366",
                color: "#25D366",
                "&:hover": {
                  borderColor: "#128C7E",
                  backgroundColor: "rgba(37, 211, 102, 0.04)",
                },
                justifyContent: "flex-start",
                textTransform: "none",
              }}
            >
              <Box sx={{ textAlign: "left", flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  WhatsApp Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get instant help via WhatsApp
                </Typography>
              </Box>
            </Button>

            {/* Email */}
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Email sx={{ color: "#ff6b35" }} />}
              onClick={handleEmailClick}
              sx={{
                p: 2,
                borderColor: "#ff6b35",
                color: "#ff6b35",
                "&:hover": {
                  borderColor: "#e55a2b",
                  backgroundColor: "rgba(255, 107, 53, 0.04)",
                },
                justifyContent: "flex-start",
                textTransform: "none",
              }}
            >
              <Box sx={{ textAlign: "left", flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  Email Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Send us an email and we'll respond within 24 hours
                </Typography>
              </Box>
            </Button>

            {/* Phone */}
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Phone sx={{ color: "#4CAF50" }} />}
              onClick={handlePhoneClick}
              sx={{
                p: 2,
                borderColor: "#4CAF50",
                color: "#4CAF50",
                "&:hover": {
                  borderColor: "#388E3C",
                  backgroundColor: "rgba(76, 175, 80, 0.04)",
                },
                justifyContent: "flex-start",
                textTransform: "none",
              }}
            >
              <Box sx={{ textAlign: "left", flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  Phone Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Call us directly for immediate assistance
                </Typography>
              </Box>
            </Button>
          </Box>

          {/* Business Hours */}
          <Box
            sx={{
              backgroundColor: "#f8f9fa",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Business Hours
            </Typography>
            <Typography variant="body1" fontWeight="600" color="#ff6b35">
              Monday - Friday: 9:00 AM - 6:00 PM
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saturday: 10:00 AM - 4:00 PM
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sunday: Closed
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ContactSupportModal;
