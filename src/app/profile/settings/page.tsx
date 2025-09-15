"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileLayoutWrapper from "@/components/ProfileLayoutWrapper";
import SettingsPage from "@/components/SettingsPage";

const ProfileSettingsPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <ProfileLayoutWrapper title="Settings">
        <SettingsPage />
      </ProfileLayoutWrapper>
    </ProtectedRoute>
  );
};

export default ProfileSettingsPage;
