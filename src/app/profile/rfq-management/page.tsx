"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileLayoutWrapper from "@/components/ProfileLayoutWrapper";
import RFQListing from "@/components/RFQListing";
import { useAppStore } from "@/store/use-app-store";

const RFQManagementPage: React.FC = () => {
  const { customer } = useAppStore();

  return (
    <ProtectedRoute>
      <ProfileLayoutWrapper title="RFQ Management">
        <RFQListing customerPhone={customer?.phone || ""} />
      </ProfileLayoutWrapper>
    </ProtectedRoute>
  );
};

export default RFQManagementPage;
