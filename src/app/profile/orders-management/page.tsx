"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileLayoutWrapper from "@/components/ProfileLayoutWrapper";
import OrdersPage from "@/app/my_orders/page";

const OrdersManagementPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <ProfileLayoutWrapper title="Orders Management">
        <OrdersPage />
      </ProfileLayoutWrapper>
    </ProtectedRoute>
  );
};

export default OrdersManagementPage;
