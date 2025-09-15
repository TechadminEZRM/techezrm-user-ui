"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileLayoutWrapper from "@/components/ProfileLayoutWrapper";
import ProfileUpdateForm from "@/components/ProfileUpdateForm";
import { useAppStore } from "@/store/use-app-store";

const AccountEditPage: React.FC = () => {
  const { customer } = useAppStore();

  return (
    <ProtectedRoute>
      <ProfileLayoutWrapper title="Edit Profile">
        <ProfileUpdateForm
          customerId={customer?.id || ""}
          onSuccess={(updatedProfile) => {
            console.log("Profile updated:", updatedProfile);
            // You can add additional success handling here
          }}
        />
      </ProfileLayoutWrapper>
    </ProtectedRoute>
  );
};

export default AccountEditPage;
