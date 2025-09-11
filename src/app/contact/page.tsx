"use client";
import React from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import ContactForm from "@/components/ContactForm";
import { useCompanyDetails } from "@/hooks/use-company-details";

const ContactPage: React.FC = () => {
  const { companyDetails, loading } = useCompanyDetails();

  const handleSuccess = () => {
    // You can add additional success handling here
    console.log("Contact form submitted successfully");
  };

  const handleError = (error: string) => {
    // You can add additional error handling here
    console.error("Contact form error:", error);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "#333",
            mb: 2,
          }}
        >
          Get in Touch
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#666",
            maxWidth: "600px",
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Have questions about our products or services? We'd love to hear from
          you. Send us a message and we'll respond as soon as possible.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "16px",
              backgroundColor: "#f8f9fa",
              height: "fit-content",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#333",
                mb: 3,
              }}
            >
              Contact Information
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#ff6b35",
                  mb: 1,
                }}
              >
                Address
              </Typography>
              <Typography sx={{ color: "#666", lineHeight: 1.6 }}>
                {loading
                  ? "Loading..."
                  : companyDetails?.address ||
                    "123 Business Street, Suite 100, City, State 12345"}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#ff6b35",
                  mb: 1,
                }}
              >
                Phone
              </Typography>
              <Typography sx={{ color: "#666", lineHeight: 1.6 }}>
                {loading
                  ? "Loading..."
                  : companyDetails?.phone || "+1 (555) 123-4567"}
                <br />
                Monday - Friday, 9:00 AM - 6:00 PM EST
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#ff6b35",
                  mb: 1,
                }}
              >
                Email
              </Typography>
              <Typography sx={{ color: "#666", lineHeight: 1.6 }}>
                {loading
                  ? "Loading..."
                  : companyDetails?.email || "info@greenjeeva.com"}
                <br />
                support@ezrm.com
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#ff6b35",
                  mb: 1,
                }}
              >
                Business Hours
              </Typography>
              <Typography sx={{ color: "#666", lineHeight: 1.6 }}>
                Monday - Friday: 9:00 AM - 6:00 PM
                <br />
                Saturday: 10:00 AM - 4:00 PM
                <br />
                Sunday: Closed
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <ContactForm
            source="contact_page"
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactPage;
