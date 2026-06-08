"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Spinner } from "@/components/ui/spinner";

const ProfilePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new account overview page
    router.replace("/profile/account");
  }, [router]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Spinner size="md" />
        <p className="text-[#7f8c8d] text-sm">Redirecting to your profile...</p>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
