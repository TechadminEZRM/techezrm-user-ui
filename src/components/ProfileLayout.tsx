import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Home } from "@mui/icons-material";
import ProfileSidebar from "./ProfileSidebar";

interface ProfileLayoutProps {
  customer: any;
  currentPage: string;
  onPageChange: (
    page:
      | "profile"
      | "orders"
      | "addresses"
      | "settings"
      | "change-password"
      | "edit-profile"
      | "rfqs"
  ) => void;
  onBackToProfile: () => void;
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  customer,
  currentPage,
  onPageChange,
  onBackToProfile,
  title,
  children,
  showBackButton = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      }}
    >
      {/* Left Sidebar */}
      <ProfileSidebar
        customer={customer}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 4 },
          overflowY: "auto",
        }}
      >
        {/* Header */}
        {/* {showBackButton && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <Button
              onClick={onBackToProfile}
              sx={{
                minWidth: "auto",
                p: 1,
                color: "#666",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              <Home sx={{ fontSize: 20 }} />
            </Button>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "24px", md: "32px" },
                fontWeight: 700,
                color: "#333",
              }}
            >
              {title}
            </Typography>
          </Box>
        )} */}

        {/* Content */}
        {children}
      </Box>
    </Box>
  );
};

export default ProfileLayout;
