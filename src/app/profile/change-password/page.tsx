"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileLayoutWrapper from "@/components/ProfileLayoutWrapper";
import ChangePasswordPage from "@/components/ChangePasswordPage";

const ProfileChangePasswordPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <ProfileLayoutWrapper title="Change Password">
        <ChangePasswordPage />
      </ProfileLayoutWrapper>
    </ProtectedRoute>
  );
};

export default ProfileChangePasswordPage;
