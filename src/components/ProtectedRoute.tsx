"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useAppStore } from "@/store/use-app-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = "/sign_in" }) => {
  const router = useRouter();
  const { isAuthenticated, customer } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated || !customer) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, customer, router, redirectTo]);

  if (!isAuthenticated || !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
        <Spinner size="lg" />
        <p className="text-dim text-sm mt-4">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
