"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Box, CircularProgress, Typography } from "@mui/material";

const ProfilePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new account overview page
    router.replace("/profile/account");
  }, [router]);

  return (
    <ProtectedRoute>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
          Redirecting to your profile...
        </Typography>
      </Box>
    </ProtectedRoute>
  );
};

export default ProfilePage;
